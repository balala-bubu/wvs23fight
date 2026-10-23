"""Real WebRTC controller test using a local PeerJS signaling server.
Needs Playwright/Chromium; npm peer@1.0.2 installed in work/peer-test.
Production uses the normal PeerJS service; only the test's signaling endpoint changes.
Physical iOS/Android sensor feel still needs real-phone QA.
"""
import asyncio,sys,functools,http.server,json,pathlib,socket,subprocess,threading,time
from playwright.async_api import async_playwright
ROOT=pathlib.Path(__file__).resolve().parents[1]
def port():
 with socket.socket() as s:s.bind(('127.0.0.1',0));return s.getsockname()[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
 def log_message(self,*a):pass
async def main():
 pp=port();script=f"const {{PeerServer}}=require('./work/peer-test/node_modules/peer');PeerServer({{host:'127.0.0.1',port:{pp},path:'/'}});"
 process=subprocess.Popen(['node','-e',script],cwd=ROOT,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
 web=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Quiet,directory=str(ROOT)));threading.Thread(target=web.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{web.server_port}'
 try:
  async with async_playwright() as p:
   b=await p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-features=WebRtcHideLocalIpsWithMdns'])
   ctx=await b.new_context(viewport={'width':800,'height':600});errors=[]
   await ctx.add_init_script("""(()=>{window.__pcs=[];for(const method of ['setLocalDescription','setRemoteDescription']){const old=RTCPeerConnection.prototype[method];RTCPeerConnection.prototype[method]=function(...a){if(!window.__pcs.includes(this))window.__pcs.push(this);return old.apply(this,a);};}})();""")
   wrap=f";(()=>{{const P=window.Peer;function W(id,opts){{if(id&&typeof id==='object'){{opts=id;id=undefined;}}opts=Object.assign({{host:'127.0.0.1',port:{pp},path:'/',secure:false,config:{{iceServers:[]}}}},opts||{{}});return id?new P(id,opts):new P(opts);}}W.prototype=P.prototype;window.Peer=W;}})();"
   mock='--mock-transport' in sys.argv
   if mock:
    peers={};links={}
    async def bridge(source,kind,data):
     page=source['page']
     if kind=='register':peers[data['id']]=page
     elif kind=='connect':
      other=peers[data['target']];links[data['id']]=(page,other)
      await other.evaluate("([k,d])=>window.__peerNotify(k,d)",['incoming',{'from':data['from'],'id':data['id']}])
      await page.evaluate("([k,d])=>window.__peerNotify(k,d)",['open',{'id':data['id']}])
      await other.evaluate("([k,d])=>window.__peerNotify(k,d)",['open',{'id':data['id']}])
     elif kind in ['data','close'] and data['id'] in links:
      a,bpage=links[data['id']];other=bpage if page==a else a
      if not other.is_closed():await other.evaluate("([k,d])=>window.__peerNotify(k,d)",[kind,data])
    await ctx.expose_binding('__peerBridge',bridge)
    await ctx.route('**/peerjs-1.5.4.min.js*',lambda r:r.fulfill(body=(ROOT/'tools/fixtures/volleyball-peer-mock.js').read_text(),content_type='application/javascript'))
   else:
    await ctx.route('**/peerjs-1.5.4.min.js*',lambda r:r.fulfill(body=(ROOT/'js/vendor/peerjs-1.5.4.min.js').read_text()+wrap,content_type='application/javascript'))
   host=await ctx.new_page();host.on('pageerror',lambda e:errors.append('host: '+str(e)))
   await host.goto(base+'/volleyball.html');await host.wait_for_selector('#setup',state='visible');await host.click('#volleyFriends');await host.click('#volleyLocal');await host.click('#setupNext');await host.click('#hostRoom');await host.click('#createRoom')
   await host.wait_for_function("document.getElementById('roomCode').textContent.length===6",timeout=20000);code=await host.locator('#roomCode').inner_text();assert code.isdigit()
   phone=await ctx.new_page();phone.on('pageerror',lambda e:errors.append('phone: '+str(e)));phone_requests=[];phone.on('request',lambda r:phone_requests.append(r.url));await phone.set_viewport_size({'width':390,'height':844})
   await phone.goto(base+'/volleyball.html?pad='+code)
   try:await phone.wait_for_function('window.VolleyPhone?.state.seat===0',timeout=20000)
   except Exception:
    print('PHONE:',await phone.locator('#phoneWho').inner_text(),flush=True);print('HOST:',await host.locator('#roomStatus').inner_text(),flush=True);print('ERRORS:',errors,flush=True);print('SEATS:',await host.locator('#roomSeats').inner_text(),flush=True);
    for tag,page in [('host',host),('phone',phone)]:print(tag,await page.evaluate("__pcs.map(p=>({connection:p.connectionState,ice:p.iceConnectionState,gathering:p.iceGatheringState,signaling:p.signalingState,candidates:(p.localDescription?.sdp.match(/a=candidate/g)||[]).length}))"),flush=True)
    raise
   assert not any('/characters/' in u or 'three-r128' in u or 'volleyball-court' in u for u in phone_requests)
   await phone.click('#chooseTouch');await phone.click('#phoneReady');await phone.screenshot(path=str(ROOT/'work/v7-phone-touch.png'))
   await host.click('#roomClose');await host.click('#start');await host.click('#helpGo')
   await phone.wait_for_function("window.VolleyPhone.state.task==='toss'",timeout=10000)
   # Thumbstick sends proportional left/right input through the real page protocol.
   await phone.locator('#padStick').scroll_into_view_if_needed();rect=await phone.locator('#padStick').bounding_box();cx=rect['x']+rect['width']/2;cy=rect['y']+rect['height']/2
   await phone.mouse.move(cx,cy);await phone.mouse.down();await phone.mouse.move(cx-80,cy)
   await host.wait_for_function('Volleyball.state.players[0].move<-.9',timeout=5000)
   await phone.mouse.move(cx+18,cy);await host.wait_for_function('Volleyball.state.players[0].move>.2&&Volleyball.state.players[0].move<.8',timeout=5000)
   await phone.mouse.up();await host.wait_for_function('Volleyball.state.players[0].move===0',timeout=5000)
   assert await phone.locator('#padStick').get_attribute('aria-valuenow')=='0'
   await phone.mouse.move(cx,cy);await phone.mouse.down();await phone.mouse.move(cx+80,cy)
   await host.wait_for_function('Volleyball.state.players[0].move>.9',timeout=5000)
   await phone.evaluate("document.getElementById('padStick').dispatchEvent(new PointerEvent('pointercancel',{pointerId:1,bubbles:true}))")
   await host.wait_for_function('Volleyball.state.players[0].move===0',timeout=5000);await phone.mouse.up()
   await phone.locator('#padStick').focus();await phone.keyboard.down('ArrowLeft');await host.wait_for_function('Volleyball.state.players[0].move===-1',timeout=5000);await phone.keyboard.up('ArrowLeft');await host.wait_for_function('Volleyball.state.players[0].move===0',timeout=5000)
   await phone.screenshot(path=str(ROOT/'work/v7-phone-stick.png'));print('PASS thumbstick left/right, proportional speed, release/cancel stop and keyboard access',flush=True)
   assert await phone.locator('#padActionLabel').inner_text()=='拋球'
   await phone.click('#padAction');await host.wait_for_function("Volleyball.state.stage==='serve'",timeout=10000)
   await phone.wait_for_function("VolleyPhone.state.task==='serve'");assert await phone.locator('#padActionLabel').inner_text()=='發球'
   print('PASS '+('mock-transport protocol' if mock else 'real WebRTC')+' room, QR join, lightweight phone, context action button and serve transition',flush=True)
   await host.keyboard.press('Escape')
   await host.click('#backSetup');await host.click('#volleySolo');await host.click('#setupNext');await host.click('#practice');await host.click('#helpGo')
   await phone.wait_for_function("VolleyPhone.state.task==='receive'")
   await phone.wait_for_function("document.getElementById('padActionLabel').textContent==='接球'&&!document.getElementById('padAction').disabled")
   await host.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='receive'&&f.recipient===0&&f.contactTime-f.t<.07})()",timeout=15000)
   await phone.click('#padAction');await host.wait_for_function("Volleyball.state.flight?.kind==='set'",timeout=5000)
   await host.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='spike'&&f.recipient===0&&f.contactTime-f.t<.57})()",timeout=15000)
   await phone.wait_for_function("document.getElementById('padActionLabel').textContent==='起跳'")
   await phone.click('#padAction');await host.wait_for_function('Volleyball.state.players[0].y>1.8',timeout=5000)
   await phone.wait_for_function("document.getElementById('padActionLabel').textContent==='扣球'")
   await host.wait_for_function("(()=>{const f=Volleyball.state.flight;return f?.kind==='spike'&&f.recipient===0&&f.contactTime-f.t<.07})()",timeout=8000)
   await phone.click('#padAction');await host.wait_for_function("Volleyball.state.flight?.kind==='receive'&&Volleyball.state.flight.team===1",timeout=5000)
   print('PASS one phone button receives, changes to jump, then spikes while airborne',flush=True)
   await host.keyboard.press('Escape')
   await phone.click('#phoneSettings');await phone.click('#chooseMotion');await phone.click('#calibrate')
   await phone.evaluate("""async()=>{for(let i=0;i<28;i++){window.dispatchEvent(new DeviceMotionEvent('devicemotion',{acceleration:{x:0,y:0,z:0},accelerationIncludingGravity:{x:0,y:9.81,z:0},rotationRate:{alpha:0,beta:0,gamma:0},interval:20}));await new Promise(r=>setTimeout(r,20));}}""")
   await phone.wait_for_selector('#phonePlay',state='visible');assert await phone.evaluate("VolleyPhone.state.mode==='motion'")
   async def gesture(a,spin=0):
    await phone.evaluate("""async([a,spin])=>{for(let i=0;i<3;i++){window.dispatchEvent(new DeviceMotionEvent('devicemotion',{acceleration:{x:0,y:a,z:0},accelerationIncludingGravity:{x:0,y:9.81+a,z:0},rotationRate:{alpha:spin,beta:0,gamma:0},interval:20}));await new Promise(r=>setTimeout(r,20));}window.dispatchEvent(new DeviceMotionEvent('devicemotion',{acceleration:{x:0,y:0,z:0},accelerationIncludingGravity:{x:0,y:9.81,z:0},rotationRate:{alpha:0,beta:0,gamma:0}}));}""",[a,spin]);await phone.wait_for_timeout(370)
   for _ in range(3):await gesture(6)
   await gesture(-10,180)
   assert await phone.locator('#phoneTaskLabel').inner_text()=='練習完成！',(await phone.locator('#phoneTaskLabel').inner_text(),await phone.locator('#sensorFeedback').inner_text())
   await phone.screenshot(path=str(ROOT/'work/v7-phone-motion.png'))
   await phone.click('#phoneReady');await host.click('#resume')
   await phone.click('#phoneSettings');await phone.evaluate("()=>{Object.defineProperty(DeviceMotionEvent,'requestPermission',{value:async()=> 'denied',configurable:true});}");await phone.click('#chooseMotion');await phone.wait_for_function("document.getElementById('sensorStatus').textContent.includes('尚未允許')",timeout=5000);await phone.click('#chooseTouch');assert await phone.locator('#padAction').is_visible()
   print('PASS sensor calibration, up/down gesture drill and denied-permission touch fallback',flush=True)
   if mock:await phone.evaluate('__testPeer.destroy()')
   else:await phone.close()
   await host.wait_for_function('Volleyball.state.paused',timeout=6000);assert not errors,errors
   print(json.dumps({'transport':'mock protocol only' if mock else 'real WebRTC','phone_assets_isolation':'pass','sensor_permission_and_traces':'pass','disconnect_pause':'pass','errors':errors},ensure_ascii=False))
   await b.close()
 finally:process.terminate();web.shutdown()
if __name__=='__main__':asyncio.run(main())
