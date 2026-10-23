"""Browser regression for optional haptics using the real game event handlers.
The vibration motor, renderer, audio hardware and animation loop are mocked;
physical vibration and rendered gameplay require a separate device/smoke check.
Run: python3 tools/vibration_test.py after smoke_test.py has cached three.js
(same Playwright/Chromium dependencies as smoke_test.py).
A physical Android phone is still needed to assess the feel of the vibration.
"""
import asyncio
import functools
import http.server
import os
import threading
from playwright.async_api import async_playwright
import glob
import tempfile
THREE = os.path.join(tempfile.gettempdir(), 'wvs_three/node_modules/three/build/three.min.js')
def chrome():
    hits = sorted(glob.glob('/opt/pw-browsers/chromium-*/chrome-linux/chrome') + glob.glob(os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')))
    return hits[-1] if hits else None

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

async def main():
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Quiet, directory=ROOT))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        ctx = await browser.new_context(viewport={'width': 900, 'height': 500}, has_touch=True, is_mobile=True)
        async def route(r):
            if 'three.min.js' in r.request.url: await r.fulfill(path=THREE)
            elif 'peerjs' in r.request.url: await r.fulfill(body='')
            elif '/js/core.js' in r.request.url:
                source = open(os.path.join(ROOT, 'js/core.js')).read().replace('const renderer = new THREE.WebGLRenderer({canvas, antialias:false});', 'const renderer = {setPixelRatio(){},getPixelRatio(){return 1},setSize(){},setRenderTarget(){},render(){},readRenderTargetPixels(){},clear(){},setClearColor(){},getClearAlpha(){return 0},getClearColor(c){return c}};')
                await r.fulfill(body=source, content_type='application/javascript')
            elif '127.0.0.1' in r.request.url: await r.continue_()
            else: await r.abort()
        await ctx.route('**/*', route)
        page = await ctx.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await ctx.add_init_script('window.requestAnimationFrame=()=>0;window.AudioContext=undefined;window.webkitAudioContext=undefined')
        await page.add_init_script("window.buzzCalls=[]; Object.defineProperty(navigator,'vibrate',{configurable:true,value:p=>{buzzCalls.push(p);return true}})")
        url = f'http://127.0.0.1:{server.server_port}/index.html?fps=15'
        print('loading supported browser', flush=True)
        await page.goto(url)
        await page.wait_for_function("typeof vibButtons !== 'undefined'")
        await page.evaluate("sel.mode='cpu';startGame();setPause(true);buzzCalls=[]")
        await page.dispatch_event('[data-t="atk"]', 'pointerdown', {'pointerId': 1})
        await page.dispatch_event('[data-t="atk"]', 'pointerup', {'pointerId': 1})
        assert await page.evaluate('buzzCalls.includes(12)'), 'solo attack should buzz'
        assert await page.evaluate('!TS.atk'), 'attack releases normally'
        await page.evaluate("document.getElementById('vibBtn').click()")
        assert await page.evaluate("buzzCalls.at(-1)===0 && localStorage.getItem('wvs.vib')==='0'"), 'off cancels and saves'
        assert await page.evaluate("vibButtons.every(b=>b.getAttribute('aria-pressed')==='false')"), 'buttons sync'
        await page.evaluate('buzzCalls=[];padPress("atk");buzz([120,60,220])')
        assert await page.evaluate('buzzCalls.length===0'), 'off suppresses all effects'
        print('input, toggle and cancellation passed', flush=True)
        await page.reload()
        await page.wait_for_function("typeof vibButtons !== 'undefined'")
        assert await page.locator('#vibBtn').inner_text() == '震動：關', 'off survives reload'
        music = await page.evaluate('Music.muted')
        await page.evaluate("document.getElementById('vibBtn').click()")
        assert await page.evaluate('buzzCalls.at(-1)===40'), 'enable previews vibration'
        assert await page.evaluate('Music.muted') == music, 'music stays independent'
        # Exercise the real damage and KO hooks on a touch-controlled fighter.
        await page.evaluate("sel.mode='cpu';startGame();setPause(true);buzzCalls=[];const v=G.fighters[0];v.invuln=0;v.state='idle';applyHit(G.fighters[1],v,{dmg:10,kb:20,sc:1},1,v.x,v.y);v.ko()")
        assert await page.evaluate('buzzCalls.some(p=>Array.isArray(p)&&p.join()===\'120,60,220\') && buzzCalls.length>=2'), 'hit and KO feedback'
        print('persistence, independent music, hit and KO passed', flush=True)
        # Feed host presence into the real phone tick; do not rely on external signalling.
        await page.evaluate("""()=>{
          G.mode='pad'; window.hp={st:'play',slots:['me'],kinds:['waffle'],meter:[0],stocks:[3],vib:[[0,0,0]]};
          party={role:'pad',room:{presence:()=>Promise.resolve(),peers:()=>[{sameTab:true,peer:'me'},{presence:Object.assign({host:1},hp)}]}};
          padTick();buzzCalls=[];hp.vib=[[1,35,0]];padTick();hp.vib=[[1,35,1]];padTick();hp.meter=[100];padTick();
        }""")
        assert await page.evaluate('buzzCalls.length===3'), 'phone hit, KO and charged feedback'
        await page.evaluate("buzzCalls=[];padTick()")
        assert await page.evaluate('buzzCalls.length===0'), 'unchanged presence does not repeat vibration'
        await page.evaluate("party=null;G.mode='play';buzz(100);setPause(true)")
        assert await page.evaluate('buzzCalls.at(-1)===0'), 'pause cancels'
        # API missing or throwing and storage blocked must not break input or settings.
        print('phone events, deduplication and pause passed', flush=True)
        await page.evaluate("Object.defineProperty(navigator,'vibrate',{value:()=>{throw Error('motor unavailable')}});buzz(12);stopBuzz()")
        await page.close()
        safari = await ctx.new_page()
        safari.on('pageerror', lambda e: errors.append(str(e)))
        # Exercise Safari's DOM/input path in Chromium; this cannot measure a
        # real iPhone Taptic Engine. The real tap must toggle the native input.
        await safari.add_init_script("Object.defineProperty(navigator,'vibrate',{value:undefined});Object.defineProperty(HTMLInputElement.prototype,'switch',{configurable:true,value:false})")
        await safari.goto(url)
        await safari.wait_for_function("typeof vibButtons !== 'undefined'")
        assert await safari.evaluate('vibSwitch && vibSupported && !vibNative')
        await safari.evaluate("sel.mode='cpu';startGame();setPause(true)")
        label = safari.locator('[data-t="atk"] [data-ios-haptic]')
        await safari.evaluate('setPause(false)')
        await label.tap()
        assert await label.locator('input').is_checked(), 'real tap reaches native switch'
        assert await safari.evaluate('!TS.atk'), 'Safari touch releases normally'
        await label.tap()
        assert not await label.locator('input').is_checked(), 'rapid taps are not cancelled'
        await safari.locator('#vibBtn').tap()
        assert await safari.evaluate("!vibOn && iosHapticLabels.every(l=>l.hidden && l.firstElementChild.disabled)"), 'off disables native haptics'
        await safari.locator('[data-t="jump"]').tap()
        assert await safari.evaluate('!TS.jump'), 'off preserves touch controls'
        await safari.locator('#vibBtn').tap()
        await safari.evaluate("document.body.classList.add('pad');document.getElementById('padUI').hidden=false;touchEl.hidden=true;G.mode='pad';window.beforeAtk=padC.a")
        pad_label = safari.locator('[data-p="atk"] [data-ios-haptic]')
        await pad_label.tap()
        assert await pad_label.locator('input').is_checked(), 'phone controller uses native switch'
        assert await safari.evaluate('padC.a===beforeAtk+1 && !TS.atk'), 'one controller action per native tap'
        await safari.locator('#padVib').tap()
        assert await safari.evaluate('!vibOn'), 'controller switch turns off'
        await safari.close()
        print('Safari input path: real taps, rapid taps, off, solo/controller input passed (motor unverified)', flush=True)
        other = await ctx.new_page()
        other.on('pageerror', lambda e: errors.append(str(e)))
        await other.add_init_script("Object.defineProperty(navigator,'vibrate',{value:undefined}); Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}")
        await other.goto(url)
        await other.wait_for_function("typeof vibButtons !== 'undefined'")
        assert await other.evaluate('vibButtons.every(b=>b.disabled)'), 'unsupported UI'
        await other.evaluate('buzz(12);sel.mode="cpu";startGame();padPress("atk")')
        assert not errors, errors
        print('PASS: Safari native input path, solo input, hit/KO, phone events, no repeats, toggle sync/persistence, cancellation, audio independence, unsupported API, storage failure, motor failure; no page errors')
        await browser.close()
    server.shutdown()

asyncio.run(main())
