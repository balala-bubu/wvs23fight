"""世志土木 online check: two separate browsers (host + guest) join a room and play one round.
Needs a local PeerJS server:  npx peerjs --port 9000 --path /   (npm i peer)
Run: python3 tools/gaoshi_online_test.py [outdir]"""
import sys, os, glob, asyncio, threading, http.server, functools, json
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/gaoshi_online'
os.makedirs(OUT, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
PORT = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
PEER = 'peerhost=127.0.0.1&peerport=9000'
def chrome():
    for pat in ['/opt/pw-browsers/chromium-*/chrome-linux/chrome', os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')]:
        hits = sorted(glob.glob(pat))
        if hits: return hits[-1]
    return '/usr/bin/chromium' if os.path.exists('/usr/bin/chromium') else None
async def page(b, name, errs, url, touch=False):
    ctx = await b.new_context(viewport={'width':1100,'height':620}, has_touch=touch)
    pg = await ctx.new_page()
    pg.on('pageerror', lambda e: errs.append(name + ' PAGE ERROR: ' + str(e)))
    async def route(r):
        u = r.request.url
        if 'three.min.js' in u: await r.fulfill(path=os.path.join(ROOT, 'js/vendor/three-r128.min.js'), content_type='application/javascript')
        elif 'peerjs' in u and 'unpkg' in u: await r.fulfill(path=os.path.join(ROOT, 'js/vendor/peerjs-1.5.4.min.js'), content_type='application/javascript')
        elif '127.0.0.1' in u: await r.continue_()
        else: await r.abort()
    await pg.route('**/*', route)
    await pg.goto(url)
    await pg.wait_for_function('window.GaoshiGame && GaoshiGame.S.mode', timeout=60000)
    return pg
async def ready_up(pg):
    for _ in range(4):
        if await pg.evaluate('GaoshiGame.S.mode') != 'select': break
        await pg.keyboard.press('KeyW'); await pg.wait_for_timeout(500)
    await pg.wait_for_timeout(500)
async def main():
    from playwright.async_api import async_playwright
    errs = []
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        host = await page(b, 'host', errs, f'http://127.0.0.1:{PORT}/gaoshi.html?{PEER}')
        await host.click('#goOnline'); await host.click('#onHost')
        await host.wait_for_function('GaoshiGame.S.mode==="select"', timeout=20000)
        code = await host.evaluate('GaoshiGame.S.net.code'); print('room', code)
        await host.keyboard.press('KeyD'); await ready_up(host)
        guest = await page(b, 'guest', errs, f'http://127.0.0.1:{PORT}/gaoshi.html?room={code}&{PEER}&touch=1', touch=True)
        print('guest screen:', await guest.evaluate('GaoshiGame.S.mode'), await guest.input_value('#onCode'))
        await guest.click('#onJoin'); await guest.wait_for_function('GaoshiGame.S.mode==="select"', timeout=20000)
        for _ in range(3): await guest.keyboard.press('KeyD')
        await ready_up(guest)
        await host.wait_for_timeout(800)
        await host.screenshot(path=f'{OUT}/1_lobby_host.png'); await guest.screenshot(path=f'{OUT}/1_lobby_guest.png')
        print('roster:', await host.evaluate('JSON.stringify(GaoshiGame.S.roster.map(r=>[r.kind,r.ready]))'))
        await host.click('#lbStart'); await host.wait_for_timeout(500)
        print('guest while host picks map:', await guest.evaluate('GaoshiGame.S.mode'), await guest.text_content('#lbStatus'))
        await host.keyboard.press('KeyW'); await host.wait_for_timeout(1500)
        print('pick:', await host.evaluate('GaoshiGame.S.mode'), await guest.evaluate('GaoshiGame.S.mode'), 'me', await guest.evaluate('GaoshiGame.S.me'))
        await guest.screenshot(path=f'{OUT}/2_pick_guest.png')
        # both reach for items: guest moves its own face-cursor, host sees it move
        await guest.evaluate('(()=>{const S=GaoshiGame.S;S.pc[S.me].x=S.box[1].x;S.pc[S.me].y=S.box[1].y;})()')
        await guest.wait_for_timeout(400)
        print('host sees guest cursor near item 1:', await host.evaluate('(()=>{const S=GaoshiGame.S;return Math.hypot(S.pc[1].x-S.box[1].x,S.pc[1].y-S.box[1].y)<1})()'))
        await guest.keyboard.press('Space')
        await host.evaluate('(()=>{const S=GaoshiGame.S;S.pc[0].x=S.box[2].x;S.pc[0].y=S.box[2].y;})()'); await host.keyboard.press('Space')
        await host.wait_for_timeout(1800)
        print('picks host/guest:', await host.evaluate('JSON.stringify(GaoshiGame.S.picks)'), await guest.evaluate('JSON.stringify(GaoshiGame.S.picks)'), await host.evaluate('GaoshiGame.S.mode'), await guest.evaluate('GaoshiGame.S.mode'))
        # place: each device places its own item
        for pg in (host, guest): await pg.wait_for_function('GaoshiGame.S.mode==="place"', timeout=20000)
        for pg in (host, guest):
            await pg.evaluate('(()=>{const S=GaoshiGame.S,i=S.me,c=S.cursor[i];const n=GaoshiRules.nearestLegal(S.world,S.picks[i],10+i*6,10,0);c.x=n.x;c.y=n.y;})()')
        await guest.screenshot(path=f'{OUT}/3_place_guest.png')
        await host.keyboard.press('Space'); await guest.keyboard.press('Space')
        for pg in (host, guest): await pg.wait_for_function('GaoshiGame.S.mode==="race"', timeout=20000)
        print('items host:', await host.evaluate('JSON.stringify(GaoshiGame.S.items.map(i=>[i.type,i.x,i.y,i.owner]))'))
        print('items guest:', await guest.evaluate('JSON.stringify(GaoshiGame.S.items.map(i=>[i.type,i.x,i.y,i.owner]))'))
        print('race:', await host.evaluate('GaoshiGame.S.mode'), await guest.evaluate('GaoshiGame.S.mode'))
        await host.wait_for_timeout(1800)
        g0 = await host.evaluate('GaoshiGame.S.world.players[1].x')
        await guest.keyboard.down('KeyD'); await guest.wait_for_timeout(700); await guest.keyboard.up('KeyD'); await host.wait_for_timeout(400)
        g1 = await host.evaluate('GaoshiGame.S.world.players[1].x'); gl = await guest.evaluate('GaoshiGame.S.world.players[GaoshiGame.S.me].x')
        print('host sees guest run: %.2f -> %.2f (guest local %.2f)' % (g0, g1, gl))
        await guest.screenshot(path=f'{OUT}/4_race_guest.png'); await host.screenshot(path=f'{OUT}/4_race_host.png')
        # host reaches the flag, guest falls
        await host.evaluate('(()=>{const w=GaoshiGame.S.world;w.players[0].x=w.flag.x+0.5;w.players[0].y=w.flag.y-0.01;})()')
        await guest.evaluate('GaoshiPhysics.kill(GaoshiGame.S.world.players[GaoshiGame.S.me],{type:"fall"})')
        for pg in (host, guest): await pg.wait_for_function('GaoshiGame.S.mode==="score"', timeout=20000)
        await host.wait_for_timeout(1500)
        print('score:', await host.evaluate('GaoshiGame.S.mode'), await guest.evaluate('GaoshiGame.S.mode'), await host.evaluate('JSON.stringify(GaoshiGame.S.scores)'), await guest.evaluate('JSON.stringify(GaoshiGame.S.scores)'))
        await guest.screenshot(path=f'{OUT}/5_score_guest.png')
        await host.click('#scNext')
        for pg in (host, guest): await pg.wait_for_function('GaoshiGame.S.mode==="pick"', timeout=20000)
        print('next round:', await host.evaluate('GaoshiGame.S.mode + " " + GaoshiGame.S.round'), await guest.evaluate('GaoshiGame.S.mode + " " + GaoshiGame.S.round'))
        print('\n'.join(errs) or 'errors: 0')
        await b.close()
asyncio.run(main())
