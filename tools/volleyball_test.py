"""Browser QA for the independent v7 volleyball mode.
Physical rules/sensor traces: node tools/volleyball_rules_test.cjs.
This checks real DOM input, follow/split cameras, fixed players and mobile layouts.
"""
import asyncio,datetime,functools,http.server,pathlib,threading,json
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
async def main():
 server=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 async with async_playwright() as pw:
  b=await pw.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  pg=await b.new_page(viewport={'width':1280,'height':800});errors=[];requests=[]
  pg.on('pageerror',lambda e:errors.append(str(e)));pg.on('request',lambda r:requests.append(r.url))
  await pg.goto(base+'/index.html');assert not any('/js/' in u for u in requests)
  await pg.screenshot(path=str(ROOT/'work/v7-home.png'));await pg.click('a[href="volleyball.html"]');await pg.wait_for_selector('#setup',state='visible');await pg.screenshot(path=str(ROOT/'work/v7-entry.png'))
  assert not any('/maps/' in u or '/audio/' in u or '/js/core.js' in u or 'peerjs' in u for u in requests)
  await pg.click('#volleySolo');await pg.click('#setupNext');assert await pg.locator('#hero option').count()==18
  for kind in await pg.locator('#hero option').evaluate_all('(os)=>os.map(o=>o.value)'):
   await pg.click('#volleyPortraits button[data-kind="'+kind+'"]');assert not errors,(kind,errors)
  await pg.click('#volleyPortraits button[data-kind="waffle"]');await pg.screenshot(path=str(ROOT/'work/v7-setup.png'));print('PASS 18 models, mode isolation',flush=True)
  # Follow the real animation clock so input is tested against actual rendering.
  async def state():return await pg.evaluate('Volleyball.state')
  async def forward(ms):await pg.wait_for_timeout(max(1,int(ms)))
  await pg.click('#practice');await pg.click('#helpGo');await forward(800)
  s=await state();assert s['humans']==[0]
  # Play one complete receive -> CPU set -> human jump/spike through physical input.
  for _ in range(80):
   s=await state();f=s['flight'];p=s['players'][0]
   if f and f['recipient']==0 and f['kind']=='receive':break
   await forward(100)
  assert f and f['kind']=='receive',s
  await pg.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='receive'&&f.recipient===0&&f.t>=f.contactTime-.08})()",timeout=12000);await pg.keyboard.press('j')
  assert (await state())['flight']['kind']=='set',await state()
  assert (await state())['players'][0]['task']=='approach'
  camera0=(await state())['cameras'][0]['position']
  await pg.wait_for_function("Volleyball.state.flight?.kind==='spike'&&Volleyball.state.flight.recipient===0",timeout=20000)
  s=await state();f=s['flight']
  assert f and f['kind']=='spike',s
  await pg.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='spike'&&f.recipient===0&&f.contactTime-f.t<.57})()",timeout=12000);await pg.keyboard.press('k');await pg.wait_for_function('Volleyball.state.players[0].y>1.8',timeout=5000)
  assert (await state())['players'][0]['y']>1.8
  assert (await state())['cameras'][0]['position']!=camera0
  await pg.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='spike'&&f.recipient===0&&f.t>=f.contactTime-.07})()",timeout=8000);await pg.keyboard.press('j')
  s=await state();assert s['flight']['kind']=='receive' and s['flight']['team']==1,s
  assert s['combo']==3,s
  await pg.screenshot(path=str(ROOT/'work/v7-jump.png'))
  await pg.keyboard.press('Escape');before=await state();await forward(1000);after=await state();assert all(after[k]==before[k] for k in ['ball','score','players'])
  await pg.click('#backSetup');print('PASS physical receive/set/jump/spike, camera follow, pause',flush=True)
  for mode,count,ids in [('coop',2,[0,1]),('versus',2,[0,2]),('four',4,[0,1,2,3])]:
   await pg.click('#volleySolo');await pg.click('[data-value="'+mode+'"]');await pg.click('#setupNext');await pg.click('#start');await pg.click('#helpGo');await forward(100)
   s=await state();assert s['humans']==ids and len(s['cameras'])==count
   assert s['cameras'][0]['rect']['w']==640
   if mode=='versus':assert s['cameras'][0]['position'][2]>0 and s['cameras'][1]['position'][2]<0
   if mode=='four':assert s['cameras'][0]['rect']['h']==400
   await pg.screenshot(path=str(ROOT/('work/v7-'+mode+'.png')))
   await pg.keyboard.press('Escape');await pg.click('#backSetup')
  print('PASS fixed-role co-op, versus and 4-way split cameras',flush=True)
  # A real missed serve enters read-only replay; pause freezes replay and live state.
  await pg.click('#volleySolo');await pg.click('#setupNext');await pg.click('#start');await pg.click('#helpGo');await pg.keyboard.press('j')
  await pg.wait_for_function('Volleyball.state.replay.playing',timeout=20000)
  await pg.keyboard.press('Escape');before=await state();await forward(350);after=await state()
  assert all(before[k]==after[k] for k in ['ball','players','score','replay'])
  await pg.click('#resume');await pg.screenshot(path=str(ROOT/'work/v7-replay.png'))
  await pg.click('#skipReplay');await pg.wait_for_function('!Volleyball.state.replay.active')
  await pg.wait_for_function("Volleyball.state.status==='play'&&Volleyball.state.stage==='ready'",timeout=12000)
  assert (await state())['score']==[0,1]
  await pg.keyboard.press('Escape');await pg.click('#backSetup')
  print('PASS replay start/pause/skip and return to the live match without rescoring',flush=True)
  touch=await b.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True)
  touch.on('pageerror',lambda e:errors.append(str(e)))
  await touch.goto(base+'/volleyball.html');await touch.wait_for_selector('#setup',state='visible');await touch.screenshot(path=str(ROOT/'work/v7-mobile-entry.png'));await touch.click('#volleySolo');await touch.click('#setupNext');await touch.screenshot(path=str(ROOT/'work/v7-mobile-lineup.png'));await touch.click('#practice');await touch.click('#helpGo')
  assert await touch.locator('#touchControls').is_visible();await touch.screenshot(path=str(ROOT/'work/v7-mobile.png'))
  await touch.set_viewport_size({'width':844,'height':390});await touch.screenshot(path=str(ROOT/'work/v7-mobile-landscape.png'))
  assert not errors,errors
  print(json.dumps({'errors':errors,'players':18,'split_views':'pass','physics_input':'pass','phone_layout':'pass'},ensure_ascii=False))
  await b.close()
 server.shutdown()
if __name__=='__main__':asyncio.run(main())
