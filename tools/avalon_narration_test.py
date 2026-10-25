"""Narration routing regression with a mocked reliable data channel, not real WebRTC."""
import asyncio,functools,http.server,pathlib,threading,json
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1];errors=[];packets=[]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
async def main():
 srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=srv.serve_forever,daemon=True).start();url=f'http://127.0.0.1:{srv.server_port}'
 async with async_playwright() as pw:
  browser=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  ctx=await browser.new_context(viewport={'width':1280,'height':800});peers={};links={}
  await ctx.add_init_script("window.__spoken=[];speechSynthesis.speak=function(u){window.__spoken.push(u.text);queueMicrotask(()=>{if(u.onend)u.onend()});};speechSynthesis.cancel=function(){};")
  async def bridge(source,kind,data):
   page=source['page']
   if kind=='register':peers[data['id']]=page
   elif kind=='connect':
    other=peers[data['target']];links[data['id']]=(page,other)
    await other.evaluate('([k,d])=>__peerNotify(k,d)',['incoming',{'from':data['from'],'id':data['id']}]);await other.evaluate('([k,d])=>__peerNotify(k,d)',['open',{'id':data['id']}]);await page.evaluate('([k,d])=>__peerNotify(k,d)',['open',{'id':data['id']}])
   elif kind in ['data','close'] and data['id'] in links:
    a,b=links[data['id']];other=b if page==a else a
    if kind=='data':packets.append(data['data'])
    if not other.is_closed():await other.evaluate('([k,d])=>__peerNotify(k,d)',[kind,data])
  await ctx.expose_binding('__peerBridge',bridge)
  await ctx.route('**/three.min.js',lambda r:r.fulfill(path=str(ROOT/'js/vendor/three-r128.min.js'),content_type='application/javascript'))
  await ctx.route('**/peerjs.min.js',lambda r:r.fulfill(path=str(ROOT/'tools/fixtures/volleyball-peer-mock.js'),content_type='application/javascript'))
  await ctx.route('https://fonts.googleapis.com/**',lambda r:r.fulfill(body='',content_type='text/css'))
  async def page():
   p=await ctx.new_page();p.on('pageerror',lambda e:errors.append(str(e)));await p.goto(url+'/avalon.html');await p.wait_for_function('!!window.__AW');return p
  hub=await ctx.new_page();await hub.goto(url+'/');assert await hub.locator('main > a.mode').count()==3;await hub.screenshot(path='/workspace/work/preview-hub.png');await hub.set_viewport_size({'width':390,'height':844});assert await hub.evaluate('document.documentElement.scrollWidth<=innerWidth');await hub.screenshot(path='/workspace/work/preview-hub-phone.png');await hub.close()
  async def heard(p):return await p.evaluate("__spoken.filter(t=>t.trim())")
  for display,mode in [('remote','voice'),('shared','voice'),('remote','manual')]:
   host=await page();await host.click('#modeHost');await host.click('#remoteMode' if display=='remote' else '#sharedMode');await host.click('#rulesNext');await host.wait_for_function('NET.peer?.open');code=await host.evaluate('NET.code');phones=[]
   for name in ['甲','乙']:
    p=await page();await p.click('#modeJoin');await p.fill('#frontJoinCode',code);await p.click('#joinNext');await p.wait_for_function('NET.editingPlayer');await p.fill('#inName',name);await p.click('#goBtn');await p.wait_for_function('!NET.editingPlayer');await p.click('#readyRoom');phones.append(p)
   await host.wait_for_function('NET.roster.length===2&&NET.roster.every(p=>p.ready)')
   await host.evaluate("""(mode)=>{NET.narration=mode;lobbyBroadcast();beginGame=async()=>{S.G=createGame(NET.roster.map(p=>({id:p.id,name:p.name})),{lake:false});S.hist={votes:[],missions:[]};S.P=[];S.running=true;S.narrationOff=false;RT.voice=NET.narration==='voice';await netLaunch();};}""",mode)
   await host.click('#startRoom')
   for p in phones:await p.wait_for_function('S.running')
   await host.evaluate("window.__reading=hostNarrate('隊伍投票','請大家在自己的手機投票。');true")
   if mode=='manual':
    await host.wait_for_function('!!NARRATOR.pending');await host.evaluate("document.getElementById('scriptNext').click()")
   else:await host.evaluate('window.__reading')
   await host.evaluate("window.__reading=hostNarrate('任務結果','本次任務成功。');true")
   if mode=='manual':
    await host.wait_for_function('!!NARRATOR.pending');await host.evaluate("document.getElementById('scriptNext').click()")
   else:await host.evaluate('window.__reading')
   expected=['請大家在自己的手機投票。','本次任務成功。']
   assert await heard(host)==(expected if mode=='voice' else [])
   for p in phones:
    if display=='remote' and mode=='voice':
     await p.wait_for_function('__spoken.filter(t=>t.trim()).length===2');assert await heard(p)==expected
     assert await p.evaluate('RT.voice===true')
    else:assert await heard(p)==[]
    await p.evaluate("(()=>{netReceive({v:NET_VERSION,type:'narration',id:2,text:'重複播報'});speak('秘密同夥不可播報');subtitle('私密身分不可播報');window.__notice=guestPrompt({kind:'notice',text:'秘密查驗：乙是壞人'});})()")
    await p.get_by_role('button',name='知道了',exact=True).click();await p.evaluate('window.__notice');await p.wait_for_timeout(100)
    assert await heard(p)==(expected if display=='remote' and mode=='voice' else [])
    await p.evaluate("S.narrationOff=true;speechSynthesis.cancel();netReceive({v:NET_VERSION,type:'narration',id:3,text:'結算情境不可播報'});true")
    await p.wait_for_timeout(50);assert await heard(p)==(expected if display=='remote' and mode=='voice' else [])
   assert not errors,errors
   print(f'PASS {display}/{mode}: correct narration devices, no duplicates, private information and endings remain silent',flush=True)
   for p in phones:await p.close()
   await host.close()
  await browser.close();srv.shutdown()
asyncio.run(main())
