/* 世志搞事 — game flow, rendering and input (step 1: race only).
 * Flow follows 世志大亂鬥: title → character select → map select → match → results (retry / 換地圖 / 換角色). */
'use strict';
var GaoshiGame = (function(){
  const PH = GaoshiPhysics, $ = (id)=>document.getElementById(id);
  const COLORS = ['#ff7a3d','#4fa3ff','#5fd36a','#d070e0'];
  const WX = (x)=>x - 16, WY = (y)=>18 - y;
  const RACE_TIME = 60, MODEL_H = 2.15;

  // ---------- sound (tiny WebAudio synth, no files) ----------
  let AC = null;
  function audio(){ if (!AC){ try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch(_){} } if (AC && AC.state !== 'running') AC.resume().catch(()=>{}); }
  function beep(f, d, type='square', vol=.08, slide=0, when=0){
    if (!AC) return; const t = AC.currentTime + when, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t + d);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d); o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
  }
  const SND = {
    jump:()=>beep(420,.12,'square',.05,380), wall:()=>beep(620,.12,'square',.05,420), land:()=>beep(140,.07,'triangle',.07,-40),
    die:()=>beep(520,.45,'sawtooth',.06,-420), goal:()=>{ [523,659,784,1047].forEach((f,i)=>beep(f,.18,'square',.06,0,i*.09)); },
    tick:()=>beep(880,.06,'square',.05), go:()=>beep(1175,.25,'square',.07), pick:()=>beep(660,.06,'triangle',.08),
  };

  // ---------- map rendering ----------
  const LOOK = {
    '#':{c:0x8b92a1, e:0xdfe4ec, map:'stone'}, C:{c:0xa04a3a, e:0xe08a6a},
    G:{c:0x6f9a4a, e:0x6fae4c, map:'grass'}, B:{c:0xa8382e, e:0xf3ead8}, T:{c:0x3f8f3a, e:0xb4ec82},
    M:{c:0x7d7f86, e:0xd3d6dc}, P:{c:0x8a6038, e:0xd8a96d}, O:{c:0xb9bec4, e:0xf4f7fa}, plank:{c:0xb5793e, e:0xffd27a},
  };
  const matCache = {};
  function lookMat(k, edge){
    const key = k + (edge ? 'e' : ''); if (matCache[key]) return matCache[key];
    const L0 = LOOK[k] || LOOK['#'];
    const o = {color: edge ? L0.e : L0.c};
    if (!edge && L0.map === 'stone') o.map = stoneTex; if (!edge && L0.map === 'grass') o.map = grassTex;
    return (matCache[key] = new THREE.MeshLambertMaterial(o));
  }
  function skyTexture(a, b){
    const cv = document.createElement('canvas'); cv.width = 4; cv.height = 128; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0,0,0,128); gr.addColorStop(0, '#' + a.toString(16).padStart(6,'0')); gr.addColorStop(1, '#' + b.toString(16).padStart(6,'0'));
    g.fillStyle = gr; g.fillRect(0,0,4,128); const t = new THREE.CanvasTexture(cv); t.encoding = THREE.sRGBEncoding; return t;
  }
  let mapGroup = null, bladeMeshes = [];
  function addBox(group, x, y, w, h, d, mat, z=0){ const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(WX(x + w/2), WY(y + h/2), z); group.add(m); return m; }
  function buildMapScene(map, boxes){
    if (mapGroup) scene.remove(mapGroup);
    mapGroup = new THREE.Group(); bladeMeshes = []; scene.add(mapGroup);
    const G0 = mapGroup, grid = map.grid, H = grid.length, W = grid[0].length;
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(260, 120), new THREE.MeshBasicMaterial({map:skyTexture(map.sky[0], map.sky[1]), fog:false}));
    sky.position.set(0, 12, -60); G0.add(sky);
    const solidAt = (x,y)=> y>=0 && y<H && x>=0 && x<W && !'.SF'.includes(grid[y][x]);
    // backdrop: distant silhouettes, darker than the play area
    let s = 7; const r = ()=> (s = (s*16807) % 2147483647) / 2147483647;
    if (map.look === 'city'){
      const dark = new THREE.MeshBasicMaterial({color:0x3b4260}), win = new THREE.MeshBasicMaterial({color:0xf2c96a});
      for (let i=0;i<26;i++){ const w = 3 + r()*5, h = 6 + r()*16, x = -60 + i*5 + r()*2, z = -18 - r()*14;
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 3), dark); b.position.set(x, h/2 - 6, z); G0.add(b);
        for (let k=0;k<4;k++){ const q = new THREE.Mesh(new THREE.PlaneGeometry(.5,.6), win); q.position.set(x - w/2 + .8 + r()*(w-1.6), -6 + 2 + r()*(h-3), z + 1.52); G0.add(q); } }
    } else {
      const hill = new THREE.MeshLambertMaterial({color:0x4d7a3c});
      for (let i=0;i<7;i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(12 + r()*8, 16, 10), hill); m.position.set(-50 + i*17, -8, -30 - r()*10); m.scale.y = .55; G0.add(m); }
    }
    // solid cells merged into horizontal runs, plus a bright top edge so platforms read clearly
    for (let y=0;y<H;y++){
      let x = 0;
      while (x < W){
        const c = grid[y][x]; if (!solidAt(x,y)){ x++; continue; }
        let x1 = x; while (x1+1 < W && grid[y][x1+1] === c) x1++;
        const n = x1 - x + 1, depth = c === 'G' ? 10 : 4;
        addBox(G0, x, y, n, 1, depth, lookMat(c), c === 'G' ? -3 : 0);
        let e = x; while (e <= x1){ if (solidAt(e, y-1)){ e++; continue; } let e1 = e; while (e1+1 <= x1 && !solidAt(e1+1, y-1)) e1++; addBox(G0, e, y, e1-e+1, .16, depth + .04, lookMat(c, true), c === 'G' ? -3 : 0); e = e1 + 1; }
        x = x1 + 1;
      }
    }
    for (const b of boxes){ addBox(G0, b.x, b.y, b.w, b.h, 2.2, lookMat('plank')); addBox(G0, b.x, b.y, b.w, .14, 2.24, lookMat('plank', true)); }
    // flag
    grid.forEach((row,y)=>[...row].forEach((c,x)=>{ if (c !== 'F') return;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07,.07,3.4,8), new THREE.MeshLambertMaterial({color:0xeeeeee})); pole.position.set(WX(x+.5), WY(y+1) + 1.7, .4); G0.add(pole);
      const sh = new THREE.Shape(); sh.moveTo(0,0); sh.lineTo(1.5,-.5); sh.lineTo(0,-1); sh.closePath();
      const fl = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshLambertMaterial({color:0xf2c14e, side:THREE.DoubleSide})); fl.position.set(WX(x+.5)+.06, WY(y+1) + 3.4, .4); G0.add(fl); G0.userData.flag = fl;
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.9,.06,8,32), new THREE.MeshBasicMaterial({color:0xf2c14e, transparent:true, opacity:.5})); ring.rotation.x = Math.PI/2; ring.position.set(WX(x+.5), WY(y+1)+.05, .4); G0.add(ring); }));
    // hazards
    for (const h of map.hazards || []) if (h.type === 'rotating_blade'){
      const g = new THREE.Group(); g.position.set(WX(h.center[0]), WY(h.center[1]), .8); G0.add(g);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.5,16), new THREE.MeshLambertMaterial({color:0x444448})); hub.rotation.x = Math.PI/2; g.add(hub);
      const arm = new THREE.Group(); g.add(arm);
      [[-1,0xd93a2e],[1,0xf2f2f2]].forEach(([s,col])=>{ const m = new THREE.Mesh(new THREE.BoxGeometry(h.length/2, h.thickness, .18), new THREE.MeshLambertMaterial({color:col})); m.position.x = s*h.length/4; arm.add(m); });
      bladeMeshes.push({arm, h});
    }
  }
  function mapThumb(map){
    const cv = document.createElement('canvas'), W = map.size[0], H = map.size[1], k = 6; cv.width = W*k; cv.height = H*k; const g = cv.getContext('2d');
    const gr = g.createLinearGradient(0,0,0,cv.height); gr.addColorStop(0,'#'+map.sky[0].toString(16).padStart(6,'0')); gr.addColorStop(1,'#'+map.sky[1].toString(16).padStart(6,'0')); g.fillStyle = gr; g.fillRect(0,0,cv.width,cv.height);
    map.grid.forEach((row,y)=>[...row].forEach((c,x)=>{ if ('.S'.includes(c)) return; g.fillStyle = c === 'F' ? '#f2c14e' : '#' + (LOOK[c]||LOOK['#']).c.toString(16).padStart(6,'0'); g.fillRect(x*k, y*k, k, k); }));
    (map.testBoxes||[]).forEach(b=>{ g.fillStyle = '#d8a96d'; g.fillRect(b.x*k, b.y*k, b.w*k, b.h*k); });
    return cv;
  }

  // ---------- fighters (models from 世志大亂鬥) ----------
  function makeFighterModel(kind, height){
    const m = makeModel(kind, 0);
    m.holder.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(m.body), size = box.getSize(new THREE.Vector3());
    m.body.position.y -= box.min.y; m.baseScale = height / Math.max(.5, size.y);
    m.holder.scale.setScalar(m.baseScale); m.sx = 1; m.sy = 1; m.phase = 0;
    return m;
  }
  const disposeModel = (m)=>{ if (m && m.holder) scene.remove(m.holder); };
  const charName = (k)=> (CHARS[k] && CHARS[k].stats && CHARS[k].stats.name) || k;
  const charTag = (k)=> (CHARS[k] && CHARS[k].stats && CHARS[k].stats.tag) || '';
  const setFace = (m, f)=>{ if (m.setFace) try { m.setFace(f); } catch(_){} };

  // ---------- input ----------
  const keys = new Set(); let pressed = [];
  const BIND = [
    {left:['KeyA'], right:['KeyD'], jump:['KeyW','Space'], run:['ShiftLeft'], crouch:['KeyS']},
    {left:['ArrowLeft'], right:['ArrowRight'], jump:['ArrowUp','Enter','NumpadEnter'], run:['ShiftRight'], crouch:['ArrowDown']},
  ];
  function readInput(i){
    const sets = S.players === 1 ? [BIND[0], BIND[1]] : [BIND[i]], out = {};
    for (const a of ['left','right','jump','run','crouch']) out[a] = sets.some(b=>b[a].some(k=>keys.has(k)));
    return out;
  }
  addEventListener('keydown', (e)=>{
    audio(); if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) e.preventDefault();
    if (['select','map','race'].includes(S.mode) && ['Space','Enter','NumpadEnter'].includes(e.code)) e.preventDefault();   // keys drive the game, not a focused button
    if (!keys.has(e.code)) pressed.push(e.code); keys.add(e.code);
  });
  addEventListener('keyup', (e)=>keys.delete(e.code));
  addEventListener('blur', ()=>keys.clear());
  addEventListener('pointerdown', audio);

  // ---------- state ----------
  const S = { mode:'title', players:2, kinds:[], ready:[], mapId:'rooftops', mapPick:0, world:null, models:[], time:0, endT:0, count:0, acc:0, prevMode:'' };
  const show = (id)=>{ for (const s of ['scrTitle','scrSelect','scrMap','scrPause','scrResult']) $(s).hidden = s !== id; $('hud').hidden = !(S.mode === 'race' || S.mode === 'pause' || S.mode === 'result'); };
  function flash(text, color){ const d = document.createElement('div'); d.className = 'flash'; d.textContent = text; if (color) d.style.color = color; const box = $('flashBox'); box.replaceChildren(d); setTimeout(()=>{ if (d.parentNode) d.remove(); }, 1200); }

  // title
  function enterTitle(){ S.mode = 'title'; clearModels(); buildMapScene(GaoshiMaps.byId.rooftops, GaoshiMaps.byId.rooftops.testBoxes); show('scrTitle'); }

  // character select
  function clearModels(){ S.models.forEach(disposeModel); S.models = []; $('tags').replaceChildren(); }
  function enterSelect(){
    S.mode = 'select'; clearModels(); show('scrSelect');
    const n = CHAR_ORDER.length;
    for (let i=0;i<S.players;i++){ if (!CHARS[S.kinds[i]]) S.kinds[i] = CHAR_ORDER[i % n]; S.ready[i] = false; }
    S.kinds.length = S.players; S.ready.length = S.players;
    for (let i=0;i<S.players;i++) S.models[i] = makeFighterModel(S.kinds[i], 6.2);
    renderSelect();
  }
  function renderSelect(){
    const roster = $('roster'); roster.replaceChildren();
    CHAR_ORDER.forEach((k)=>{ const b = document.createElement('button'); b.textContent = charName(k); b.setAttribute('aria-label', charName(k));
      const mk = document.createElement('span'); mk.className = 'mk';
      S.kinds.forEach((kk,i)=>{ if (kk === k){ const t = document.createElement('i'); t.textContent = 'P' + (i+1); t.style.background = COLORS[i]; mk.appendChild(t); b.style.borderColor = COLORS[i]; } });
      b.appendChild(mk); b.onclick = ()=>{ const i = S.ready.findIndex(r=>!r); if (i >= 0){ setKind(i, k); setReady(i, true); } }; roster.appendChild(b); });
    const plates = $('plates'); plates.replaceChildren();
    S.kinds.forEach((k,i)=>{ const d = document.createElement('div'); d.className = 'plate' + (S.ready[i] ? ' ready' : ''); d.style.setProperty('--pc', COLORS[i]);
      d.innerHTML = '<div class="who"></div><div class="nm"></div><div class="tag"></div><div class="st"></div>';
      d.querySelector('.who').textContent = 'P' + (i+1); d.querySelector('.nm').textContent = charName(k); d.querySelector('.tag').textContent = charTag(k);
      d.querySelector('.st').textContent = S.ready[i] ? '準備好了！' : (i === 0 ? 'A / D 換人　W 確定' : '← / → 換人　↑ 確定');
      d.onclick = ()=>setReady(i, !S.ready[i]); plates.appendChild(d); });
  }
  function setKind(i, k){
    if (S.kinds[i] === k) return; S.kinds[i] = k; disposeModel(S.models[i]); S.models[i] = makeFighterModel(k, 6.2); SND.pick(); renderSelect();
  }
  function setReady(i, r){
    S.ready[i] = r; SND.pick(); renderSelect();
    if (S.ready.every(Boolean)) setTimeout(()=>{ if (S.mode === 'select' && S.ready.every(Boolean)) enterMap(); }, 350);
  }
  function selectKeys(code){
    const n = CHAR_ORDER.length;
    [[0,'KeyA','KeyD',['KeyW','Space'],'KeyS'],[1,'ArrowLeft','ArrowRight',['ArrowUp','Enter'],'ArrowDown']].forEach(([i,l,r,ok,back])=>{
      if (i >= S.players) return;
      if (code === l && !S.ready[i]) setKind(i, CHAR_ORDER[(CHAR_ORDER.indexOf(S.kinds[i]) - 1 + n) % n]);
      if (code === r && !S.ready[i]) setKind(i, CHAR_ORDER[(CHAR_ORDER.indexOf(S.kinds[i]) + 1) % n]);
      if (ok.includes(code) && !S.ready[i]) setReady(i, true);
      if (code === back && S.ready[i]) setReady(i, false);
    });
    if (code === 'Escape') enterTitle();
  }

  // map select
  const MAP_CARDS = () => [...GaoshiMaps.LIST.map(m=>m.id), 'random'];
  function enterMap(){
    S.mode = 'map'; clearModels(); show('scrMap');
    const box = $('maps'); box.replaceChildren();
    MAP_CARDS().forEach((id, j)=>{ const b = document.createElement('button'); b.className = 'mapc';
      if (id === 'random'){ const q = document.createElement('div'); q.className = 'q'; q.textContent = '?'; b.appendChild(q); }
      else b.appendChild(mapThumb(GaoshiMaps.byId[id]));
      const t = document.createElement('b'); t.textContent = id === 'random' ? '隨機' : GaoshiMaps.byId[id].name; b.appendChild(t);
      b.onclick = ()=>{ S.mapPick = j; startRace(); }; box.appendChild(b); });
    markMap();
  }
  function markMap(){ [...$('maps').children].forEach((b,j)=>b.classList.toggle('on', j === S.mapPick)); const id = MAP_CARDS()[S.mapPick]; if (id !== 'random') buildMapScene(GaoshiMaps.byId[id], GaoshiMaps.byId[id].testBoxes); }
  function mapKeys(code){
    const n = MAP_CARDS().length;
    if (code === 'KeyA' || code === 'ArrowLeft'){ S.mapPick = (S.mapPick - 1 + n) % n; markMap(); SND.pick(); }
    if (code === 'KeyD' || code === 'ArrowRight'){ S.mapPick = (S.mapPick + 1) % n; markMap(); SND.pick(); }
    if (['KeyW','Space','Enter','ArrowUp'].includes(code)) startRace();
    if (code === 'Escape' || code === 'KeyS' || code === 'ArrowDown') enterSelect();
  }

  // race
  function startRace(){
    let id = MAP_CARDS()[S.mapPick]; if (id === 'random') id = GaoshiMaps.LIST[Math.floor(Math.random()*GaoshiMaps.LIST.length)].id;
    S.mapId = id; const map = GaoshiMaps.byId[id];
    buildMapScene(map, map.testBoxes); clearModels();
    const w = PH.makeWorld(map); w.boxes = map.testBoxes.map(b=>Object.assign({}, b)); S.world = w;
    const tags = $('tags');
    for (let i=0;i<S.players;i++){
      const p = PH.addPlayer(w, i); p.px = p.x; p.py = p.y;
      const m = makeFighterModel(S.kinds[i], MODEL_H); S.models[i] = m; setFace(m, 'normal');
      const t = document.createElement('div'); t.className = 'tagl'; t.style.setProperty('--pc', COLORS[i]); t.textContent = 'P' + (i+1); tags.appendChild(t); m.tag = t;
    }
    S.mode = 'race'; S.time = 0; S.endT = 0; S.count = 2.2; S.acc = 0; S.lastTick = 3; show(null);
    $('phaseName').textContent = map.name + '：跑到終點旗！'; renderChips(); flash('預備…');
  }
  function renderChips(){
    const L0 = $('chipsL'), R0 = $('chipsR'); L0.replaceChildren(); R0.replaceChildren();
    S.world.players.forEach((p,i)=>{ const d = document.createElement('div'); d.className = 'chip' + (p.done ? ' done' : !p.alive ? ' dead' : ''); d.style.setProperty('--pc', COLORS[i]);
      d.innerHTML = '<b></b><span class="n"></span><span class="s"></span>'; d.querySelector('b').textContent = 'P' + (i+1); d.querySelector('.n').textContent = charName(S.kinds[i]);
      d.querySelector('.s').textContent = p.done ? '抵達第 ' + (S.world.order.indexOf(i)+1) : !p.alive ? '倒下' : '跑關中';
      (i % 2 ? R0 : L0).appendChild(d); });
  }
  function stepRace(dt){
    const w = S.world;
    if (S.count > 0){ S.count -= dt; if (S.count <= 0){ flash('衝！'); SND.go(); } return; }
    S.time += dt; let changed = false;
    const inputs = w.players.map((p,i)=>readInput(i));
    w.players.forEach(p=>{ p.px = p.x; p.py = p.y; });
    PH.stepWorld(w, inputs, PH.DT);
    w.players.forEach((p,i)=>{ const m = S.models[i];
      for (const e of p.events){
        if (e === 'jump'){ SND.jump(); m.sx = .75; m.sy = 1.3; }
        if (e === 'walljump'){ SND.wall(); m.sx = .8; m.sy = 1.25; }
        if (e === 'land'){ SND.land(); m.sx = 1.28; m.sy = .76; }
        if (e === 'die'){ SND.die(); setFace(m, 'cry'); changed = true; flash('P' + (i+1) + ' 倒下了', COLORS[i]); }
        if (e === 'goal'){ SND.goal(); changed = true; flash('P' + (i+1) + ' 抵達！', COLORS[i]); }
      } });
    if (changed) renderChips();
    const left = Math.max(0, RACE_TIME - S.time), sec = Math.ceil(left);
    $('timer').textContent = sec; $('timer').classList.toggle('low', left <= 5);
    if (left <= 5 && sec < S.lastTick){ S.lastTick = sec; SND.tick(); }
    if ((PH.raceOver(w) || left <= 0) && !S.endT) S.endT = S.time;
    if (S.endT && S.time - S.endT > 1.4) enterResult(left <= 0);
  }
  function enterResult(timeUp){
    S.mode = 'result'; const w = S.world, n = w.players.length, done = w.order.length;
    let title, why;
    if (n === 1){ title = done ? '抵達終點！' : '沒能抵達…'; why = done ? '用時 ' + w.players[0].finishT.toFixed(2) + ' 秒' : (timeUp ? '時間到了' : '再試一次吧'); }
    else if (done === n){ title = '太簡單了，全員過關'; why = '正式規則裡，這回合沒有人得分'; }
    else if (!done){ title = '太難了，沒人到終點'; why = '正式規則裡，這回合沒有人得分'; }
    else { title = charName(S.kinds[w.order[0]]) + ' 第一個抵達！'; why = '下一版加入選道具、放道具與計分'; }
    $('resTitle').textContent = title; $('resWhy').textContent = why;
    const rank = $('resRank'); rank.replaceChildren();
    const rows = w.players.map((p,i)=>({p,i})).sort((a,b)=>{ const ra = a.p.done ? w.order.indexOf(a.i) : 99, rb = b.p.done ? w.order.indexOf(b.i) : 99; return ra - rb; });
    for (const {p,i} of rows){ const d = document.createElement('div'); d.style.setProperty('--pc', COLORS[i]); d.innerHTML = '<b></b><span></span>';
      d.querySelector('b').textContent = 'P' + (i+1);
      d.querySelector('span').textContent = charName(S.kinds[i]) + '　' + (p.done ? '抵達第 ' + (w.order.indexOf(i)+1) + '（' + p.finishT.toFixed(2) + ' 秒）' : !p.alive ? (p.cause && p.cause.type === 'fall' ? '掉下去了' : '被葉片打中') : '時間到');
      rank.appendChild(d); }
    show('scrResult'); $('rRetry').focus();
  }
  function pause(on){ if (on && S.mode === 'race'){ S.mode = 'pause'; show('scrPause'); $('pResume').focus(); } else if (!on && S.mode === 'pause'){ S.mode = 'race'; show(null); } }

  // ---------- per-frame model animation ----------
  const k_ = (dt, r)=>1 - Math.exp(-dt * r);
  function animateRace(dt, alpha){
    const w = S.world;
    for (const b of bladeMeshes) b.arm.rotation.z = -b.h.angle;
    if (mapGroup && mapGroup.userData.flag) mapGroup.userData.flag.rotation.y = Math.sin(performance.now()/300) * .25;
    w.players.forEach((p,i)=>{
      const m = S.models[i]; if (!m) return;
      const x = p.px + (p.x - p.px) * alpha, y = p.py + (p.y - p.py) * alpha;
      m.holder.position.set(WX(x), WY(y), 0);
      const ry = p.face * (Math.PI/2 - 0.4); let d = ry - m.holder.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d)); m.holder.rotation.y += d * k_(dt, 20);
      let pose, kk = k_(dt, 16);
      if (!p.alive){ pose = POSE.hurt; m.holder.rotation.z += ((p.face > 0 ? 1.35 : -1.35) - m.holder.rotation.z) * k_(dt, 6); }
      else if (p.done){ pose = Math.sin(performance.now()/180) > 0 ? POSE.thumbs : POSE.peace; m.holder.rotation.z *= .9; }
      else if (p.onGround && p.crouch) pose = POSE.squat;
      else if (p.onGround && Math.abs(p.vx) > .4){ m.phase += Math.abs(p.vx) * dt * (p.run ? 1.15 : 1.4); pose = runPose(m.phase); kk = k_(dt, 24); }
      else if (p.onGround) pose = POSE.stand;
      else if (p.wall) pose = POSE.hang || POSE.air;
      else pose = POSE.air;
      applyPose(m, pose, kk);
      // squash & stretch, crouch squeezes the model down to the 1-cell hitbox
      const ty = p.crouch && p.alive ? .62 : 1, tx = p.crouch && p.alive ? 1.12 : 1, rec = Math.min(1, .16 * dt * 60);
      m.sx += (tx - m.sx) * rec; m.sy += (ty - m.sy) * rec;
      m.holder.scale.set(m.baseScale * m.sx, m.baseScale * m.sy, m.baseScale * m.sx);
      if (m.tag){ const v = new THREE.Vector3(WX(x), WY(y) + p.h + .55, 0).project(camera);
        m.tag.style.left = ((v.x + 1) / 2 * innerWidth) + 'px'; m.tag.style.top = ((1 - v.y) / 2 * innerHeight) + 'px'; m.tag.style.opacity = p.done ? .5 : 1; }
    });
  }
  function animateSelect(dt){
    const n = S.models.length, t = performance.now()/1000;
    S.models.forEach((m,i)=>{ const x = n === 1 ? 0 : (i === 0 ? -7 : 7);
      m.holder.position.set(x, 4.2, 4); m.holder.rotation.set(0, (n === 1 ? 0 : (i === 0 ? .45 : -.45)) + Math.sin(t*.8 + i)*.12, 0);
      applyPose(m, S.ready[i] ? (Math.sin(t*5) > 0 ? POSE.thumbs : POSE.peace) : POSE.stand, k_(dt, 10)); });
  }

  // ---------- loop ----------
  let last = performance.now();
  function frame(now){
    const dt = Math.min(.1, (now - last) / 1000); last = now;
    const codes = pressed; pressed = [];
    for (const c of codes){
      if (S.mode === 'select') selectKeys(c);
      else if (S.mode === 'map') mapKeys(c);
      else if (S.mode === 'race' && c === 'Escape') pause(true);
      else if (S.mode === 'pause' && c === 'Escape') pause(false);
      else if (S.mode === 'result' && (c === 'KeyR')) startRace();
    }
    if (S.mode === 'race'){
      S.acc += dt; while (S.acc >= PH.DT){ stepRace(PH.DT); S.acc -= PH.DT; if (S.mode !== 'race') break; }
      animateRace(dt, Math.min(1, S.acc / PH.DT));
    } else if (S.mode === 'result' || S.mode === 'pause') animateRace(dt, 1);
    else if (S.mode === 'select') animateSelect(dt);
    if (S.mode === 'title' || S.mode === 'map'){ for (const b of bladeMeshes){ b.h.angle = now/1000 / b.h.periodSec * Math.PI*2; b.arm.rotation.z = -b.h.angle; } }
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function boot(){
    document.querySelectorAll('[data-players]').forEach(b=>b.onclick = ()=>{ audio(); S.players = +b.dataset.players; enterSelect(); });
    $('selBack').onclick = enterTitle; $('mapBack').onclick = enterSelect;
    $('pResume').onclick = ()=>pause(false); $('pRetry').onclick = startRace; $('pMap').onclick = enterMap; $('pChar').onclick = enterSelect; $('pTitle').onclick = enterTitle;
    $('rRetry').onclick = startRace; $('rMap').onclick = enterMap; $('rChar').onclick = enterSelect; $('rTitle').onclick = enterTitle;
    if (matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches) $('touchNote').hidden = false;
    enterTitle(); $('scrTitle').querySelector('.big').focus();
    requestAnimationFrame(frame);
  }
  return { boot, S };
})();
