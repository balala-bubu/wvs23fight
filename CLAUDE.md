# 世志大亂鬥 — notes for Claude

Three.js r128 platform fighter, plain classic scripts (no build step), hosted on GitHub Pages.
All files share one global scope: top-level `const`/`function` in `js/core.js` are visible to every character and map file.

## Layout
- `index.html` — HTML + CSS, then script tags in this order: `js/core.js` → `characters/*.js` → `maps/*.js` → `boot()`.
- `js/core.js` (~100 KB) — renderer, physics, hits, menus, select screen, online play, results flow. **Do not read it whole.** Grep for what you need.
- `characters/<kind>.js` — one self-contained file per character, ending in `registerChar(kind, {...})`.
- `maps/<id>.js` — one file per stage, ending in `registerMap(id, {...})`.
- `characters/_template.js`, `maps/_template.js` — annotated skeletons with every hook. **Start here.**

## Add a character (cheapest path)
1. Read `characters/_template.js` (and at most one similar character file if you need a pattern, e.g. `bear.js` for a heavy, `seafood.js` for projectiles + a moving final).
2. Write `characters/<kind>.js` (kind = lowercase letters only).
3. Add `<script src="characters/<kind>.js"></script>` to `index.html` after the other characters. Nothing else in core changes.
4. Test: `python3 tools/smoke_test.py` (headless; runs every character's moves, finals, wins and losses on every map; prints page errors).

## Add a map
1. Read `maps/_template.js` (or `maps/park.js`, the smallest).
2. Write `maps/<id>.js`, add its script tag after the other maps. The menu button is generated from `name`.

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
- Temporary power-ups: set `f.buffT` (seconds) → +30% damage while > 0.
- Things added to the scene in results go in `R.items`; things attached to a model go in `R.attach` — both are cleaned up automatically.
