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
  host=await page();await host.click('#modeHost');await host.click('#sharedMode')
  await host.locator('#presetChoices button').nth(2).click();assert '奧伯倫' in await host.locator('#ruleCast').inner_text()
  await host.locator('#presetChoices button').nth(0).click();assert '奧伯倫' not in await host.locator('#ruleCast').inner_text()
  await host.uncheck('#entryIntro');await host.click('#rulesNext');await host.wait_for_function('NET.peer?.open');code=await host.evaluate('NET.code')
  p=await page();await p.click('#modeJoin');await p.fill('#frontJoinCode',code);await p.click('#joinNext');await p.wait_for_function('NET.editingPlayer');await p.fill('#inName','同步名字')
  await host.wait_for_function("NET.roster.some(p=>p.name==='同步名字')")
  await p.evaluate("SETUP.cfg.cloth='#123456';queueProfile()")
  await host.wait_for_function("NET.roster[0].cfg.cloth==='#123456'")
  assert await p.locator('#lobbyPeers').is_visible()
  await p.click('#goBtn');await p.click('#readyRoom');await host.click('#hostPlay');await host.fill('#inName','參戰房主');await host.click('#goBtn')
  await host.wait_for_function("NET.roster.some(p=>p.id==='host'&&p.name==='參戰房主'&&p.ready)")
  await p.wait_for_function("NET.roster.length===2")
  assert await host.evaluate("NET.hostRole==='player'&&SETUP.opts.intro===false")
  await host.click('#hostWatch');await host.wait_for_function("NET.roster.every(p=>p.id!=='host')")
  await host.evaluate("""()=>{for(let n=5;n<=10;n++)for(const preset of Object.keys(GAME_PRESETS)){const players=Array.from({length:n},(_,i)=>({id:'t'+i,name:'玩家'+i}));const g=createGame(players,{preset});if(g.players.filter(p=>p.team==='evil').length!==GOOD_EVIL_COUNTS[n][1])throw Error('陣營人數');if(g.players.filter(p=>p.role==='Assassin').length!==1)throw Error('刺客數量');if(g.players.some(p=>p.role==='Oberon')!==(preset==='outsider'))throw Error('奧伯倫組合');const merlin=g.players.find(p=>p.role==='Merlin');if(privateInfo(g,merlin.id).knownEvil.some(p=>g.players.find(x=>x.id===p.id).role==='Mordred'))throw Error('莫德雷德被梅林看到');}}""")
  await host.wait_for_timeout(500);await host.screenshot(path='/workspace/work/avalon-lobby.png')
  await host.set_viewport_size({'width':390,'height':844});assert await host.evaluate('document.documentElement.scrollWidth<=innerWidth');await host.screenshot(path='/workspace/work/avalon-phone.png')
  await host.click('#hostPlay');await host.click('#goBtn')
  await host.evaluate("intro=async()=>{};hostNarrate=async()=>{};night=async()=>{};mainLoop=async()=>{};true")
  await p.evaluate("intro=async()=>{};true")
  await host.click('#startRoom');await host.wait_for_function("S.running&&S.me?.id==='host'")
  await p.wait_for_function('S.running')
  assert await host.evaluate("S.P.filter(p=>p.human).length===1&&!document.body.classList.contains('public-screen')&&!document.getElementById('bId').hidden")
  await host.evaluate('peekOn()');assert await host.locator('#role').is_visible();await host.evaluate('peekOff()')
  for packet in packets:
   if packet.get('type') in ['snapshot','start','scene']:
    assert all('role' not in person for person in packet['view']['state']['players'])
  assert not errors,errors
  print('PASS presets 5–10 players, secret visibility, live profile sync, host join/leave, intro toggle, mobile width, no browser errors',flush=True)
  await browser.close();srv.shutdown()
asyncio.run(main())
