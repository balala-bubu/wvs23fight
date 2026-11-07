"""阿 Wa 隆連線回歸測試（模擬資料通道，非真實 WebRTC）：
1. 照片縮小、訊息都小於上限，且開局後每支手機都看得到所有人的照片臉。
2. 手機中途斷線 → 遊戲不中止，重新連線後補送當下的提問。
3. 整頁重新載入後輸入同一房號 → 回到原座位。
4. 斷線太久 → 系統代為操作，遊戲不卡住。
執行：python3 tools/avalon_reconnect_test.py
"""
import asyncio, functools, http.server, pathlib, threading, json
from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parents[1]
errors = []
packets = []


class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


async def main():
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=str(ROOT)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    url = f'http://127.0.0.1:{srv.server_port}'
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(args=['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        ctx = await browser.new_context(viewport={'width': 1280, 'height': 800})
        peers, links = {}, {}

        async def bridge(source, kind, data):
            page = source['page']
            if kind == 'register':
                peers[data['id']] = page
            elif kind == 'connect':
                other = peers[data['target']]
                links[data['id']] = (page, other)
                await other.evaluate('([k,d])=>__peerNotify(k,d)', ['incoming', {'from': data['from'], 'id': data['id']}])
                await other.evaluate('([k,d])=>__peerNotify(k,d)', ['open', {'id': data['id']}])
                await page.evaluate('([k,d])=>__peerNotify(k,d)', ['open', {'id': data['id']}])
            elif kind in ['data', 'close'] and data['id'] in links:
                a, b = links[data['id']]
                other = b if page == a else a
                if kind == 'data':
                    packets.append(len(json.dumps(data['data'])))
                if not other.is_closed():
                    await other.evaluate('([k,d])=>__peerNotify(k,d)', [kind, data])

        await ctx.expose_binding('__peerBridge', bridge)
        await ctx.route('**/three.min.js', lambda r: r.fulfill(path=str(ROOT / 'js/vendor/three-r128.min.js'), content_type='application/javascript'))
        await ctx.route('**/peerjs.min.js', lambda r: r.fulfill(path=str(ROOT / 'tools/fixtures/volleyball-peer-mock.js'), content_type='application/javascript'))
        await ctx.route('https://fonts.googleapis.com/**', lambda r: r.fulfill(body='', content_type='text/css'))

        async def page():
            p = await ctx.new_page()
            p.on('pageerror', lambda e: errors.append(str(e)))
            await p.goto(url + '/avalon.html')
            await p.wait_for_function('!!window.__AW')
            return p

        host = await page()
        await host.click('#modeHost')
        await host.click('#remoteMode')
        await host.click('#rulesNext')
        await host.wait_for_function('NET.peer?.open')
        code = await host.evaluate('NET.code')
        phones = []
        for name in ['甲', '乙']:
            p = await page()
            if not await p.is_visible('#frontJoinCode'):
                await p.click('#modeJoin')
            await p.fill('#frontJoinCode', code)
            await p.click('#joinNext')
            await p.wait_for_function('NET.editingPlayer')
            await p.fill('#inName', name)
            if name == '甲':  # 最難壓縮的雜訊照片，驗證縮圖後仍小於訊息上限
                await p.evaluate("""()=>{const c=document.createElement('canvas');c.width=c.height=260;const g=c.getContext('2d'),d=g.createImageData(260,260);
                  for(let i=0;i<d.data.length;i+=4){d.data[i]=Math.random()*255;d.data[i+1]=Math.random()*255;d.data[i+2]=Math.random()*255;d.data[i+3]=255;}
                  g.putImageData(d,0,0);SETUP.cfg.photo=c;}""")
                n = await p.evaluate('myProfile().cfg.photo.length')
                assert n < 120000, f'photo data url too big: {n}'
                print('photo data-url length:', n)
            await p.click('#goBtn')
            await p.wait_for_function('!NET.editingPlayer')
            await p.click('#readyRoom')
            phones.append(p)
        a, b = phones
        await host.wait_for_function('NET.roster.length===2&&NET.roster.every(p=>p.ready)')
        assert await host.evaluate('NET.roster[0].cfg.photo||NET.roster[1].cfg.photo'), 'host lost the photo'
        await host.evaluate("""()=>{beginGame=async()=>{S.G=createGame(NET.roster.map(p=>({id:p.id,name:p.name})),{lake:false});S.hist={votes:[],missions:[]};S.P=[];S.running=true;S.narrationOff=false;RT.voice=false;await netLaunch();};}""")
        await host.click('#startRoom')
        for p in phones:
            await p.wait_for_function('S.running')
        assert max(packets) < 100000, f'a message is too big: {max(packets)}'
        print('largest message:', max(packets), 'bytes')
        for p in phones:  # 每支手機都要看到「甲」的照片臉
            ok = await p.evaluate("(()=>{const x=S.P.find(q=>q.name==='甲');return !!x&&x.ch.cfg.photo instanceof HTMLImageElement;})()")
            assert ok, 'photo face missing on a phone'
        print('PASS photo: small messages, face visible on every phone')

        # --- 斷線 → 提問等待 → 重新連線補送 ---
        ida = await a.evaluate('NET.myId')
        await a.evaluate('NET.host.close()')  # 網路中斷
        await host.wait_for_function('(id)=>NET.away.has(id)', arg=ida)
        assert not await host.evaluate('NET.failed'), 'game must not abort when a player drops'
        await host.evaluate("(id)=>{window.__ans=netAsk(id,{kind:'notice',text:'測試'}).then(v=>{window.__ansV=v;});}", ida)
        await a.evaluate('guestLost(NET.host)')  # 手機偵測到斷線 → 自動重連
        await a.wait_for_function('!NET.rejoining')
        await host.wait_for_function('(id)=>NET.links.has(id)&&!NET.away.has(id)', arg=ida)
        await a.get_by_role('button', name='知道了', exact=True).click()
        await host.wait_for_function('window.__ansV===true')
        assert not await host.evaluate('NET.failed') and not await a.evaluate('NET.failed')
        print('PASS reconnect: dropped phone rejoined and got the pending question')

        # --- 整頁被系統重新載入 → 輸入同一房號自動回座 ---
        await a.evaluate('saveSeat()')  # 同一個 context 的兩頁共用 localStorage，所以明確存 a 的座位
        await host.evaluate("(id)=>{window.__ans2V=undefined;netAsk(id,{kind:'notice',text:'重載'}).then(v=>{window.__ans2V=v;});}", ida)
        await a.reload()
        await a.wait_for_function('!!window.__AW')
        assert await a.evaluate("document.getElementById('frontJoinCode').value") == code, 'room code should be prefilled'
        await a.click('#joinNext')
        await a.wait_for_function('(id)=>S.running&&NET.myId===id', arg=ida)
        await a.get_by_role('button', name='知道了', exact=True).click()
        await host.wait_for_function('window.__ans2V===true')
        ok = await a.evaluate("(()=>{const x=S.P.find(q=>q.name==='甲');return !!x&&x.ch.cfg.photo instanceof HTMLImageElement;})()")
        assert ok, 'photo face missing after reload'
        assert not await host.evaluate('NET.failed') and not await host.evaluate('(id)=>NET.away.has(id)', ida)
        n_before = 2
        assert await host.evaluate('NET.roster.filter(x=>!x.bot).length') == n_before, 'reload must not create a new seat'
        print('PASS reload: page reloaded, same room code returned to the same seat with face and pending question')

        # --- 離線太久 → 系統代為操作 ---
        idb = await b.evaluate('NET.myId')
        await b.close()
        await host.wait_for_function('(id)=>NET.away.has(id)', arg=idb)
        await host.evaluate("""(id)=>{NET.away.get(id).auto=true;const g=S.G;g.phase='mission';g.proposedTeam=[id];
          window.__auto=netAsk(id,{kind:'mission'}).then(v=>{window.__autoV=v;});}""", idb)
        await host.wait_for_function('window.__autoV!==undefined', timeout=8000)
        v = await host.evaluate('window.__autoV')
        assert v in ('success', 'fail'), v
        assert await host.evaluate('(id)=>validateReply(id,{kind:"mission"},window.__autoV)', idb)
        assert not await host.evaluate('NET.failed')
        print('PASS fallback: offline seat is played automatically, game continues')

        real = [e for e in errors if 'Execution context was destroyed' not in e]  # 重新載入瞬間的模擬連線呼叫，屬測試雜訊
        assert not real, real
        await browser.close()
    srv.shutdown()


asyncio.run(main())
