"""世志搞事 headless check: python3 tools/gaoshi_shot.py [outdir]
Walks title → select → map → race (scripted keys) → result, saves screenshots, prints page errors."""
import sys, os, glob, asyncio, threading, http.server, functools
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/gaoshi_shots'
os.makedirs(OUT, exist_ok=True)
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=ROOT))
PORT = srv.server_address[1]; threading.Thread(target=srv.serve_forever, daemon=True).start()
def chrome():
    for pat in ['/opt/pw-browsers/chromium-*/chrome-linux/chrome', os.path.expanduser('~/.cache/ms-playwright/chromium-*/chrome-linux/chrome')]:
        hits = sorted(glob.glob(pat))
        if hits: return hits[-1]
    return '/usr/bin/chromium' if os.path.exists('/usr/bin/chromium') else None
async def main():
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=chrome(), args=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        pg = await b.new_page(viewport={'width':1280,'height':720})
        errs = []
        pg.on('pageerror', lambda e: errs.append('PAGE ERROR: ' + str(e)))
        pg.on('console', lambda m: errs.append('console.' + m.type + ': ' + m.text) if m.type in ('error','warning') else None)
        async def route(r):
            u = r.request.url
            if 'three.min.js' in u: await r.fulfill(path=os.path.join(ROOT, 'js/vendor/three-r128.min.js'), content_type='application/javascript')
            elif f'127.0.0.1:{PORT}' in u: await r.continue_()
            else: await r.abort()
        await pg.route('**/*', route)
        await pg.goto(f'http://127.0.0.1:{PORT}/gaoshi.html')
        await pg.wait_for_function('window.GaoshiGame && GaoshiGame.S.mode==="title"', timeout=60000)
        await pg.wait_for_timeout(500); await pg.screenshot(path=f'{OUT}/1_title.png')
        await pg.click('[data-players="2"]'); await pg.wait_for_timeout(800)
        await pg.keyboard.press('KeyD'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(600)
        await pg.screenshot(path=f'{OUT}/2_select.png')
        await pg.keyboard.press('KeyW'); await pg.keyboard.press('ArrowUp'); await pg.wait_for_timeout(900)
        await pg.mouse.move(5, 700); await pg.wait_for_timeout(100); await pg.screenshot(path=f'{OUT}/3_map.png')
        mid = os.environ.get('MAP', '0')
        for _ in range(int(mid)): await pg.keyboard.press('KeyD')
        await pg.keyboard.press('KeyW'); await pg.wait_for_timeout(2600)   # countdown
        await pg.keyboard.down('ShiftLeft'); await pg.keyboard.down('KeyD'); await pg.wait_for_timeout(250)
        await pg.keyboard.down('KeyW'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/4_race.png')
        await pg.keyboard.up('KeyW'); await pg.wait_for_timeout(700)
        await pg.keyboard.down('ArrowDown'); await pg.wait_for_timeout(400); await pg.screenshot(path=f'{OUT}/5_race2.png')
        await pg.keyboard.up('ArrowDown')
        info = await pg.evaluate('JSON.stringify(GaoshiGame.S.world.players.map(p=>({x:+p.x.toFixed(2),y:+p.y.toFixed(2),alive:p.alive,done:p.done})))')
        print('players:', info)
        await pg.evaluate('GaoshiGame.S.world.players.forEach(p=>GaoshiPhysics.kill(p,{type:"fall"}))')
        await pg.wait_for_timeout(2200); await pg.screenshot(path=f'{OUT}/6_result.png')
        print('mode:', await pg.evaluate('GaoshiGame.S.mode'))
        print('\n'.join(errs) or 'errors: 0')
        await b.close()
asyncio.run(main())
