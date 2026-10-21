# 世志大亂鬥 — notes for Claude

Three.js r128 platform fighter, plain classic scripts (no build step), hosted on GitHub Pages.
All files share one global scope: top-level `const`/`function` in `js/core.js` are visible to every character and map file.

## Layout
- `index.html` — HTML + CSS, then script tags in this order: `js/core.js` → `characters/*.js` → `maps/*.js` → `boot()`.
- `js/core.js` (~100 KB) — renderer, physics, hits, menus, select screen, online play, results flow. **Do not read it whole.** Grep for what you need.
- `characters/<kind>.js` — one self-contained file per character, ending in `registerChar(kind, {...})`.
- `maps/<id>.js` — one file per stage, ending in `registerMap(id, {...})`.
- `characters/_template.js`, `maps/_template.js` — annotated skeletons with every hook. **Start here.**

## Menu flow
Title → rules (players / opponent / stocks) → character select → **map select** (`G.mode==='mapsel'`, `enterMapSel()`, thumbnails rendered once by `mapThumb()`, last card = 隨機 with a big ?) → match. Pause menu and the game-over sheet both have 換地圖 (→ `enterMapSel`) and 換角色. Phones-as-controllers: host broadcasts `st:'mapsel'`, `vib` (hit/KO counters → phone vibrates, toggle on the pad) and `rst` (back to character select un-readies the phones). Audio: `audioOn()` also plays a silent looping `<audio>` so iOS ignores the mute switch when mirroring to a TV; `#sndHint` shows while the browser keeps sound locked.

## Releasing
Bump the default `?v=` number in the `S()` helper at the bottom of `index.html` on every release (browsers cache `js/*.js`; a new index.html with an old core.js shows a black screen).

## Add a character (cheapest path)
1. Read `characters/_template.js` (and at most one similar character file if you need a pattern, e.g. `bear.js` for a heavy, `seafood.js` for projectiles + a moving final).
2. Write `characters/<kind>.js` (kind = lowercase letters only).
3. Add `<script>S('characters/<kind>.js')</script>` to `index.html` after the other characters (`S()` appends the page's `?v=` so a new `?v=` number always loads fresh files; a plain `<script src>` also works but may be served from cache). Nothing else in core changes.
4. Test: `python3 tools/smoke_test.py` (headless; runs every character's moves, finals, wins and losses on every map; prints page errors). For a small change (a costume, a tweak to one character) run just one match: `python3 tools/smoke_test.py --only=<char>` (about 20 s) and look for `errors: 0`; run the full test only for core changes or a brand-new character/map.

## Costumes (skins)
- Optional `skins:[{name:'生日帽', apply(c){ ... }}]` in registerChar. After picking a character the select screen asks for a costume (skin 0 = 原版); `apply(c)` adds meshes to the built model, e.g. `birthdayHat(colorA, colorB, pom)` on `c.head` at y≈0.6. Stored in `sel.skin[i]`.

## Add a map
1. Read `maps/_template.js` (or `maps/park.js`, the smallest).
2. Write `maps/<id>.js`, add its script tag after the other maps. The menu button is generated from `name`.
3. Keep the background darker than the platforms/fighters (multiply-tint big wall/floor/ceiling textures, dim `MeshBasicMaterial` screens/lights) and give platforms a bright top edge so they stand out. Overlapping planes need ≥0.5 spacing (z-fighting at distance 70).
4. Look at it: `python3 tools/map_shot.py <id> <outdir>` (2p / 4p / fighters-high screenshots), then `tools/smoke_test.py`. `maps/mecls.js` is a full example (indoor room, spinning fans, a friendly NPC built with `buildChar`). Full recipe: `.claude/skills/wvs-add-map/SKILL.md`.

## Shared helpers (from core)
- Textures: `tex(w,h,draw,rep)`, `speckle`, `shadeFace(g)`, `blackHairTex`, `shoeTex`, `starTex`, `puffTex`, `loveTex`, `rockTex`, `cobbleTex`
- Meshes: `rbox(w,h,d,round,mat)`, `cyl(r1,r2,h,mat,seg)`, `at(mesh,x,y,z)`, `pivot(parent,x,y,z)`, `L({color|map})`, `black`, `spriteOf(tex,size,color)`, `buildChar(spec,parent)`, `SC` (model scale), `shoeM`, `greySole`
- Game: `G` (fighters, finals, flash, shake, freeze), `MAIN`, `PLATS`, `scene`, `proj({...})`, `launch(v,kb,ang,dir)`, `pop(text,x,y,cls)`, `banner(text)`, `burst(x,y,color,n,spd)`, `drip`, `spark`, `other(f)` (nearest foe), `reduce` (reduced motion)
- Results: `RS_Y`, `once(key,t,fn)`, `popAt(text,fighter,dy,cls)`, `SFX2.fanfare/cheer/jet/sigh`
- Poses (`POSE.x`): stand thumbs peace air squat hurt dizzy sob helpless shieldW old jabR jabL laughIn laugh punch2 batWind batHit upWind upHit slide nair fair dair dairHit throwWind throwHit piano laughUp spikeWind spikeHit block dive serveWind serveHit inject setUp guitar salute hang sprint climbUp climbUp2 bookUp bookSlam selfie ponder cheer sit flat (+ seafood: eat surf full)
- Sounds (`SFX.x()`): hit(power) soft swing batCrack jump laughShort laugh note chord guitar sob ko whistle shield inject spike march bark crash horn fire boom (+ chomp splash wave roar); raw `tone(freq,dur,type,vol,slide,when)`, `noise(dur,vol,freq,when)`

## Rules of thumb
- Characters never edit core; anything special goes through a hook in the registerChar object.
- Moves with `sfx:'hit'` would crash (hit needs a number) — use another sound.
- Finals that travel (wave, army, car, beam…) must hit **every** fighter on their path: loop `G.fighters`, skip the owner, track hits in a `Set` (see `_template.js`, `tommy.js`). Never check only `F.target`.
- Temporary power-ups: set `f.buffT` (seconds) → +30% damage while > 0.
- Things added to the scene in results go in `R.items`; things attached to a model go in `R.attach` — both are cleaned up automatically.
