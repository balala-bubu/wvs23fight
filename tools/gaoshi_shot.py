"""世志土木 headless check: python3 tools/gaoshi_shot.py [outdir]
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
        await pg.keyboard.press('KeyD'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(400)
        await pg.screenshot(path=f'{OUT}/2_select.png')
        # confirm character, then costume if this character has one (like 世志大亂鬥)
        shot = False
        for _ in range(4):
            if await pg.evaluate('GaoshiGame.S.mode') != 'select': break
            st = await pg.evaluate('GaoshiGame.S.stage.join()')
            if 'skin' in st and not shot: shot = True; await pg.keyboard.press('KeyD'); await pg.keyboard.press('ArrowRight'); await pg.wait_for_timeout(400); await pg.screenshot(path=f'{OUT}/2b_skin.png')
            await pg.keyboard.press('KeyW'); await pg.keyboard.press('ArrowUp'); await pg.wait_for_timeout(500)
        await pg.wait_for_timeout(600); await pg.mouse.move(5, 700)
        print('picked:', await pg.evaluate('JSON.stringify([GaoshiGame.S.kinds, GaoshiGame.S.skins])'))
        await pg.screenshot(path=f'{OUT}/3_map.png')
        for _ in range(int(os.environ.get('MAP', '0'))): await pg.keyboard.press('KeyD')
        await pg.keyboard.press('KeyW'); await pg.wait_for_timeout(900)
        await pg.screenshot(path=f'{OUT}/4_pick.png')
        print('mode at pick:', await pg.evaluate('GaoshiGame.S.mode'), [e for e in errs if 'PAGE' in e])
        # steer both face-cursors onto items and grab
        await pg.evaluate('(()=>{const S=GaoshiGame.S;S.pc[0].x=S.box[0].x;S.pc[0].y=S.box[0].y;S.pc[1].x=S.box[2].x;S.pc[1].y=S.box[2].y;})()')
        await pg.keyboard.press('Space'); await pg.wait_for_timeout(150); await pg.screenshot(path=f'{OUT}/4b_grab.png')
        await pg.keyboard.press('Enter'); await pg.wait_for_timeout(1300)
        print('picks:', await pg.evaluate('JSON.stringify(GaoshiGame.S.picks)'), 'mode', await pg.evaluate('GaoshiGame.S.mode'))
        for _ in range(4): await pg.keyboard.press('KeyS')
        await pg.keyboard.press('KeyE'); await pg.keyboard.press('Period')
        await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/5_place.png')
        print('rot:', await pg.evaluate('JSON.stringify(GaoshiGame.S.cursor.map(c=>c.r))'))
        # put both cursors on a spot next to the start and place
        await pg.evaluate('(()=>{const S=GaoshiGame.S;S.cursor.forEach((c,i)=>{const n=GaoshiRules.nearestLegal(S.world,S.picks[i],10+i*5,10,c.r);if(n){c.x=n.x;c.y=n.y;}})})()')
        await pg.keyboard.press('Space'); await pg.keyboard.press('Enter'); await pg.wait_for_timeout(2600)
        print('items:', await pg.evaluate('JSON.stringify(GaoshiGame.S.items.map(i=>[i.type,i.x,i.y,i.r,i.owner]))'), 'mode', await pg.evaluate('GaoshiGame.S.mode'))
        await pg.keyboard.down('ShiftLeft'); await pg.keyboard.down('KeyD'); await pg.wait_for_timeout(250)
        await pg.keyboard.down('KeyW'); await pg.wait_for_timeout(300); await pg.screenshot(path=f'{OUT}/6_race.png')
        await pg.keyboard.up('KeyW'); await pg.keyboard.up('KeyD'); await pg.keyboard.up('ShiftLeft')
        await pg.evaluate('(()=>{const w=GaoshiGame.S.world;w.players[1].x=w.flag.x+0.5;w.players[1].y=w.flag.y-0.01;})()')
        await pg.wait_for_timeout(400)
        await pg.evaluate('GaoshiGame.S.world.players.forEach(p=>{ if(!p.done) GaoshiPhysics.kill(p,{type:"fall"}) })')
        await pg.wait_for_timeout(3200); await pg.screenshot(path=f'{OUT}/7_score.png')
        print('mode:', await pg.evaluate('GaoshiGame.S.mode'), 'scores', await pg.evaluate('JSON.stringify(GaoshiGame.S.scores)'))
        await pg.keyboard.press('Space'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=f'{OUT}/7b_score.png')
        print('after score:', await pg.evaluate('GaoshiGame.S.mode + " round " + GaoshiGame.S.round'))
        print('\n'.join(errs) or 'errors: 0')
        await b.close()
asyncio.run(main())
