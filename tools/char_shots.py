"""Screenshots for one character, pasted into ONE contact sheet (read that one image, not each shot).
Usage: python3 tools/char_shots.py <kind> [modes] [outdir]
  modes (default 'cfwl'):
    c  close-ups rendered with a separate camera: front view of skin 0 + skin 1 (face, hair, clothes),
       side view of the 4-character lineup, and any 3D props you list in PROPS_JS (edit for your character)
    a  match action: everyone fires nB and sB/dB at once
    f  final at ~1.3 s and ~2.8 s (prints everyone's % so you can check it hit)
    w  win animation at ~1.6 s and ~4.5 s of the results screen
    l  lose animation at ~1.7 s and ~3.7 s of the results screen
Prints page errors; writes sheet.png in outdir (a temp dir when not given) and prints its path.
Needs the same setup as smoke_test.py (playwright + chromium, three.js cached by smoke_test)."""
import sys, os, asyncio, threading, http.server, functools, tempfile, glob, base64
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
KIND = sys.argv[1]
MODES = sys.argv[2] if len(sys.argv) > 2 else 'cfwl'
OUT = sys.argv[3] if len(sys.argv) > 3 else tempfile.mkdtemp(prefix='wvs_shots_'); os.makedirs(OUT, exist_ok=True)
THREE = os.path.join(tempfile.gettempdir(), 'wvs_three/node_modules/three/build/three.min.js')
# Optional: JS expression returning an array of THREE.Object3D to show in the "props" close-up (e.g. thrown food).
PROPS_JS = os.environ.get('PROPS_JS', '')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT)); PORT = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
def chrome():
    for pat in ['/opt/pw-browsers/chromium-*/chrome-linux/chrome', os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')]:
        hits = sorted(glob.glob(pat))
        if hits: return hits[-1]
CLOSE = '''(a)=>{ const [v, propsJs] = a; const cam = new THREE.PerspectiveCamera(30, 16/9, .5, 200); const grp = new THREE.Group(); scene.add(grp);
  if (v==='front'){ [0,1].forEach(i=>{ const m=G.fighters[i].m; m.holder.rotation.y=0; m.body.rotation.y=0; applyPose(m,POSE.stand,1); });
    const x=(G.fighters[0].x+G.fighters[1].x)/2; cam.position.set(x,4.6,9); cam.lookAt(x,4.0,0); }
  else if (v==='side'){ cam.position.set(-1,4.2,15); cam.lookAt(-1,3.6,0); }
  else { const list = eval(propsJs); list.forEach((o,i)=>{ o.position.set(-7.5 + (i%6)*3, 7 - Math.floor(i/6)*2.6, 6); grp.add(o); }); cam.position.set(0,6.5,20); cam.lookAt(0,6.3,0); }
  scene.updateMatrixWorld(true); renderer.setSize(1280,720,false); renderer.render(scene, cam);
  const d = renderer.domElement.toDataURL('image/png'); scene.remove(grp); return d; }'''
async def main():
    from playwright.async_api import async_playwright
    from PIL import Image
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':640,'height':360}); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        async def route(r):
            u = r.request.url
            if 'three.min.js' in u: await r.fulfill(path=THREE, content_type='application/javascript')
            elif f'127.0.0.1:{PORT}' in u: await r.continue_()
            else: await r.abort()
        await pg.route('**/*', route)
        await pg.goto(f'http://127.0.0.1:{PORT}/brawl.html'); await pg.wait_for_timeout(1500)
        ev = pg.evaluate; paths = []; K = KIND
        async def shot(n):
            pth = os.path.join(OUT, n + '.png'); await pg.screenshot(path=pth); paths.append(pth)
        async def start(lineup, skins):
            await ev(f"sel.count={len(lineup)}; sel.p={lineup!r}; sel.skin={skins!r}; sel.map='park'; startGame();")
            await pg.wait_for_timeout(2700)
        async def pin(xs):
            await ev(f"G.fighters.forEach((f,i)=>{{ f.x={xs!r}[i]; f.y=0; f.vx=0; f.ctrl='x'; f.invuln=0; f.face = f.x < 0 ? 1 : -1; }})")
        nsk = await ev(f"skinCount('{K}')")
        for mode in MODES:
            if mode == 'c':
                await start([K, K, 'waffle', 'kelsey'], [0, 1 if nsk > 1 else 0, 0, 0]); await pin([-4.8,-1.6,1.6,4.8]); await pg.wait_for_timeout(600)
                for v in ['front', 'side'] + (['props'] if PROPS_JS else []):
                    d = await ev(CLOSE, [v, PROPS_JS]); pth = os.path.join(OUT, 'c_' + v + '.png')
                    open(pth, 'wb').write(base64.b64decode(d.split(',')[1])); paths.append(pth)
                await ev('enterSelect()'); await pg.wait_for_timeout(400)
            elif mode == 'a':
                await start([K, K, 'waffle', 'kelsey'], [0, 0, 0, 0]); await pin([-6,-2,2,6]); await pg.wait_for_timeout(300)
                await ev("G.fighters.forEach(f=>{ f.state='idle'; f.startMove('nB'); })"); await pg.wait_for_timeout(500); await shot('a1')
                await ev("G.fighters.forEach((f,i)=>{ f.state='idle'; f.startMove(i%2?'sB':'dB'); })"); await pg.wait_for_timeout(500); await shot('a2')
                await ev('enterSelect()'); await pg.wait_for_timeout(400)
            elif mode == 'f':
                await start([K, 'waffle', 'kelsey'], [0, 0, 0]); await pin([-2, 5, -8])
                await ev('G.fighters[0].meter=100; startFinal(G.fighters[0]);')
                await pg.wait_for_timeout(1300); await shot('f1'); await pg.wait_for_timeout(1500); await shot('f2'); await pg.wait_for_timeout(1500)
                print('after final:', await ev('G.fighters.map(f=>[f.kind, Math.round(f.pct), f.stocks, f.state])'))
                await ev('enterSelect()'); await pg.wait_for_timeout(400)
            elif mode in 'wl':
                win = mode == 'w'
                await start([K, 'waffle'] if win else ['waffle', K], [0, 0])
                await ev('const f=G.fighters[1]; f.stocks=1; f.invuln=0; f.ko();')
                await pg.wait_for_timeout(3600); await shot(mode + '1'); await pg.wait_for_timeout(2900 if win else 2000); await shot(mode + '2')
                await ev('enterSelect()'); await pg.wait_for_timeout(400)
        ims = [Image.open(x).convert('RGB').resize((640, 360)) for x in paths]
        sheet = Image.new('RGB', (1280, 360 * ((len(ims) + 1) // 2)))
        for i, im in enumerate(ims): sheet.paste(im, (i % 2 * 640, i // 2 * 360))
        out = os.path.join(OUT, 'sheet.png'); sheet.save(out)
        print('errors:', len(set(errs))); print('\n'.join(sorted(set(errs)))); print('sheet:', out)
        await b.close()
asyncio.run(main())
