/* 世志土木 — scenery, item models, ghosts and particles. Uses helpers from gaoshi-models.js (tex, speckle, rbox, cyl, L). */
'use strict';
var GaoshiArt = (function(){
  const WX = (x)=>x - 16, WY = (y)=>18 - y;
  const IT = GaoshiRules.ITEMS;
  const hex = (n)=>'#' + n.toString(16).padStart(6, '0');
  const basic = (o)=>new THREE.MeshBasicMaterial(o);
  const lam = (o)=>new THREE.MeshLambertMaterial(o);
  let seedA = 7; const rr = ()=> (seedA = (seedA * 16807) % 2147483647) / 2147483647;
  const ambient = [];   // things that animate on their own: {update(dt, t)}
  const parts = [];     // particles

  // ---------- textures ----------
  function canvasTex(w, h, draw, rep){ return tex(w, h, draw, rep); }
  function facadeTex(base, glass, lit){
    return canvasTex(128, 128, (g)=>{
      speckle(g, 128, 128, base, ['#7c8392','#9aa1ad','#868d9b'], .35);
      for (let r=0;r<4;r++) for (let c=0;c<4;c++){
        const x = c*32 + 8, y = r*32 + 7, on = rr() < lit;
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x-2, y-2, 20, 22);
        g.fillStyle = on ? '#ffd27a' : glass; g.fillRect(x, y, 16, 18);
        if (on){ g.fillStyle = 'rgba(255,240,200,.6)'; g.fillRect(x+2, y+2, 5, 14); }
        g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x, y+8, 16, 2);
        g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(c*32, r*32 + 30, 32, 2);
      }
    });
  }
  const T = {};
  function textures(){
    if (T.ready) return; T.ready = true;
    T.brick = canvasTex(64, 64, (g)=>{ g.fillStyle = '#8c3b2c'; g.fillRect(0,0,64,64);
      for (let r=0;r<8;r++) for (let c=0;c<5;c++){ const x = c*16 - (r%2)*8, y = r*8; g.fillStyle = ['#a24a35','#9a4230','#b0553c'][(r+c)%3]; g.fillRect(x+1, y+1, 14, 6); } });
    T.planks = canvasTex(64, 64, (g)=>{ for (let i=0;i<4;i++){ g.fillStyle = ['#b23a2c','#a8342a','#bb4132','#9f3127'][i]; g.fillRect(i*16, 0, 16, 64); g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(i*16, 0, 2, 64); }
      for (let k=0;k<30;k++){ g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(rr()*64, rr()*64, 1, 6); } });
    T.wood = canvasTex(64, 16, (g)=>{ speckle(g, 64, 16, '#b07a44', ['#a06c3a','#c08a52','#94622f'], .5); g.fillStyle = 'rgba(60,30,10,.5)'; g.fillRect(0,0,64,1); g.fillRect(0,15,64,1);
      for (const x of [3, 60]){ g.fillStyle = '#4a3a2a'; g.fillRect(x, 4, 2, 2); g.fillRect(x, 10, 2, 2); } });
    T.crate = canvasTex(32, 32, (g)=>{ speckle(g, 32, 32, '#a77443', ['#97663a','#b8844f'], .5); g.strokeStyle = '#6e4a28'; g.lineWidth = 3; g.strokeRect(1.5,1.5,29,29); g.beginPath(); g.moveTo(2,2); g.lineTo(30,30); g.stroke(); });
    T.soil = canvasTex(64, 64, (g)=>{ speckle(g, 64, 64, '#6b4a2e', ['#5c3f26','#7a5636','#4f3520'], .6); for (let k=0;k<14;k++){ g.fillStyle = '#8d7a66'; g.beginPath(); g.arc(rr()*64, rr()*64, 1.5 + rr()*2, 0, 7); g.fill(); } });
    T.grass = canvasTex(64, 16, (g)=>{ g.fillStyle = '#5ea83f'; g.fillRect(0,0,64,16); for (let x=0;x<64;x+=2){ g.fillStyle = ['#6fbf4a','#4f9334','#7ccc55'][x%3]; g.fillRect(x, 0, 2, 4 + rr()*10); } });
    T.metal = canvasTex(64, 64, (g)=>{ speckle(g, 64, 64, '#8a8d94', ['#7d8087','#979aa1'], .4); g.fillStyle = '#e07a2a'; g.fillRect(0, 22, 64, 8); g.fillStyle = '#2a2a2a'; for (let x=0;x<64;x+=8){ g.fillRect(x, 23, 4, 6); }
      g.fillStyle = '#5c5f66'; for (let x=4;x<64;x+=12){ g.fillRect(x, 4, 2, 2); g.fillRect(x, 56, 2, 2); } });
    T.tractor = canvasTex(32, 32, (g)=>{ speckle(g, 32, 32, '#3d8c38', ['#357c31','#47a041'], .4); g.fillStyle = '#f2c14e'; g.fillRect(0, 26, 32, 3); });
    T.silo = canvasTex(32, 32, (g)=>{ speckle(g, 32, 32, '#c4c9cf', ['#b6bbc2','#d2d6db'], .4); g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(0, 0, 32, 2); g.fillRect(15, 0, 2, 32); });
    T.hay = canvasTex(32, 32, (g)=>{ speckle(g, 32, 32, '#e2bd55', ['#d4a93f','#f0cf6a','#c79c37'], .7); g.fillStyle = '#8a5a2a'; g.fillRect(0, 7, 32, 3); g.fillRect(0, 22, 32, 3); });
    T.stone = canvasTex(64, 64, (g)=>{ speckle(g, 64, 64, '#5e5b63', ['#55525a','#6a6670','#4c4a52'], .5);
      for (let r=0;r<4;r++) for (let c=0;c<3;c++){ const x = c*24 - (r%2)*12, y = r*16; g.strokeStyle = 'rgba(20,18,24,.6)'; g.lineWidth = 2; g.strokeRect(x+1, y+1, 22, 14); }
      for (let k=0;k<10;k++){ g.fillStyle = 'rgba(80,110,60,.55)'; g.fillRect(rr()*64, rr()*64, 3 + rr()*6, 2); } });
    T.rot = canvasTex(64, 64, (g)=>{ for (let i=0;i<4;i++){ g.fillStyle = ['#5a3f2e','#4e3628','#634533','#47311f'][i]; g.fillRect(0, i*16, 64, 16); g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(0, i*16, 64, 2); }
      for (let k=0;k<26;k++){ g.fillStyle = 'rgba(20,10,5,.3)'; g.fillRect(rr()*64, rr()*64, 6 + rr()*10, 1); } g.fillStyle = '#2a1d14'; for (let k=0;k<6;k++){ g.beginPath(); g.arc(rr()*64, rr()*64, 1.5, 0, 7); g.fill(); } });
    T.shingle = canvasTex(64, 32, (g)=>{ g.fillStyle = '#2e2738'; g.fillRect(0,0,64,32); for (let r=0;r<4;r++) for (let c=0;c<9;c++){ const x = c*8 - (r%2)*4, y = r*8; g.fillStyle = ['#3e3448','#352d40','#463b52'][(r+c)%3]; g.fillRect(x+1, y+1, 7, 7); } });
    T.paper = canvasTex(64, 64, (g)=>{ g.fillStyle = '#4a3a52'; g.fillRect(0,0,64,64); for (let x=0;x<64;x+=16){ g.fillStyle = 'rgba(160,130,170,.18)'; g.fillRect(x, 0, 6, 64); }
      for (let y=8;y<64;y+=16) for (let x=8;x<64;x+=16){ g.fillStyle = 'rgba(200,170,120,.22)'; g.beginPath(); g.moveTo(x, y-4); g.lineTo(x+3, y); g.lineTo(x, y+4); g.lineTo(x-3, y); g.fill(); }
      for (let k=0;k<5;k++){ g.fillStyle = 'rgba(20,12,24,.35)'; g.fillRect(rr()*64, 0, 2 + rr()*3, 64*rr()); } });
    T.rock = canvasTex(64, 64, (g)=>{ speckle(g, 64, 64, '#7a6e60', ['#6c6153','#857868','#5f5549'], .6);
      for (let k=0;k<5;k++){ g.strokeStyle = 'rgba(40,32,26,.45)'; g.lineWidth = 2; g.beginPath(); const y = rr()*64; g.moveTo(0, y); for (let x=0;x<=64;x+=8) g.lineTo(x, y + (rr()-.5)*6); g.stroke(); }
      for (let k=0;k<8;k++){ g.fillStyle = 'rgba(90,130,60,.45)'; g.fillRect(rr()*64, rr()*64, 4, 3); } });
    T.water = canvasTex(32, 64, (g)=>{ g.fillStyle = '#7cc4ea'; g.fillRect(0,0,32,64); for (let k=0;k<40;k++){ g.fillStyle = ['rgba(255,255,255,.75)','rgba(200,236,255,.6)','rgba(60,130,190,.35)'][k%3]; g.fillRect(rr()*32, rr()*64, 1 + rr()*2, 8 + rr()*20); } });
    T.water.wrapS = T.water.wrapT = THREE.RepeatWrapping;
    T.hatch = canvasTex(32, 32, (g)=>{ g.clearRect(0,0,32,32); g.strokeStyle = 'rgba(255,90,79,.55)'; g.lineWidth = 4; for (let k=-32;k<64;k+=12){ g.beginPath(); g.moveTo(k,0); g.lineTo(k+32,32); g.stroke(); } });
    T.hatch.wrapS = T.hatch.wrapT = THREE.RepeatWrapping;
    T.glow = canvasTex(64, 64, (g)=>{ const gr = g.createRadialGradient(32,32,0,32,32,32); gr.addColorStop(0,'rgba(255,255,255,1)'); gr.addColorStop(.35,'rgba(255,240,200,.6)'); gr.addColorStop(1,'rgba(255,220,160,0)'); g.fillStyle = gr; g.fillRect(0,0,64,64); });
    T.puff = canvasTex(32, 32, (g)=>{ const gr = g.createRadialGradient(16,16,0,16,16,16); gr.addColorStop(0,'rgba(255,255,255,.9)'); gr.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0,0,32,32); });
  }
  const sprite = (map, size, color, opacity=1)=>{ const s = new THREE.Sprite(new THREE.SpriteMaterial({map, color, transparent:true, opacity, depthWrite:false})); s.scale.set(size, size, 1); return s; };
  function textPlane(text, w, h, fg, bg){
    const t = canvasTex(256, 64, (g)=>{ g.fillStyle = bg; g.fillRect(0,0,256,64); g.font = '900 40px "Noto Sans TC", sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.shadowColor = fg; g.shadowBlur = 14; g.fillStyle = fg; g.fillText(text, 128, 34); });
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic({map:t, transparent:true}));
  }

  // ---------- map ----------
  let hzViews = [];
  let group = null, blades = [], flagMesh = null, overlay = null;
  const DEPTH = 4;
  function box(w, h, d, mats){ return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); }
  function placeBox(m, x, y, w, h, z=0){ m.position.set(WX(x + w/2), WY(y + h/2), z); group.add(m); return m; }
  function faceMats(side, top, bottom){ return [side, side, top, bottom || side, side, side]; }
  function repTex(t, rx, ry, ox=0, oy=0){ const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.offset.set(ox, oy); return c; }

  function sky(map){
    const t = canvasTex(4, 128, (g)=>{ const gr = g.createLinearGradient(0,0,0,128); gr.addColorStop(0, hex(map.sky[0])); gr.addColorStop(1, hex(map.sky[1])); g.fillStyle = gr; g.fillRect(0,0,4,128); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(300, 140), basic({map:t, fog:false})); m.position.set(0, 14, -70); group.add(m);
    const SUN = {city:[26, 0xffb070, -18, 3], farm:[18, 0xfff2c0, 20, 20], mansion:[12, 0xdfe4ff, 16, 22], falls:[20, 0xfff6d8, -24, 24]}[map.look] || [18, 0xfff2c0, 20, 20];
    const sun = sprite(T.glow, SUN[0], SUN[1]); sun.position.set(SUN[2], SUN[3], -66); group.add(sun);
    if (map.look === 'mansion'){ const moon = new THREE.Mesh(new THREE.CircleGeometry(2.6, 32), basic({color:0xf1ecd8, fog:false})); moon.position.set(16, 22, -65); group.add(moon);
      for (let i=0;i<60;i++){ const st = sprite(T.glow, .25 + rr()*.35, 0xffffff, .8); st.position.set(-70 + rr()*140, 8 + rr()*28, -64); group.add(st); const ph = rr()*6; ambient.push({update(dt, t){ st.material.opacity = .45 + Math.sin(t*2 + ph)*.35; }}); } }
    // drifting clouds
    for (let i=0;i<7;i++){
      const c = new THREE.Group(), col = map.look === 'city' ? 0xf0b49a : map.look === 'mansion' ? 0x5c5070 : 0xffffff;
      for (let k=0;k<4;k++){ const s = sprite(T.puff, 5 + rr()*4, col, map.look === 'city' ? .55 : .85); s.position.set(k*2.6 - 4, rr()*1.2, 0); c.add(s); }
      c.position.set(-70 + i*22 + rr()*8, 16 + rr()*10, -50 - rr()*8); group.add(c);
      const sp = .6 + rr()*.8; ambient.push({update(dt){ c.position.x += sp*dt; if (c.position.x > 80) c.position.x = -80; }});
    }
  }
  function cityBackdrop(){
    const layers = [{z:-22, col:0x46507a, n:30, hMax:20}, {z:-34, col:0x3a4369, n:26, hMax:26}, {z:-46, col:0x323a5c, n:22, hMax:32}];
    for (const Ly of layers){
      const mat = basic({color:Ly.col}), win = basic({color:0xffd27a, transparent:true, opacity:.85});
      for (let i=0;i<Ly.n;i++){ const w = 3 + rr()*6, h = 6 + rr()*Ly.hMax, x = -75 + i*(150/Ly.n) + rr()*2;
        const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); b.position.set(x, h/2 - 10, Ly.z); group.add(b);
        const nw = Math.floor(h*w/7); for (let k=0;k<nw;k++){ const q = new THREE.Mesh(new THREE.PlaneGeometry(.45,.55), win); q.position.set(x - w/2 + .6 + rr()*(w-1.2), -9 + rr()*(h-2), Ly.z + .05); group.add(q); }
        if (rr() < .25){ const a = new THREE.Mesh(new THREE.PlaneGeometry(.15, 3), mat); a.position.set(x, h - 10 + 1.5, Ly.z); group.add(a);
          const blink = sprite(T.glow, 1.2, 0xff4040); blink.position.set(x, h - 10 + 3, Ly.z + .1); group.add(blink); const ph = rr()*6; ambient.push({update(dt, t){ blink.material.opacity = (Math.sin(t*3 + ph) > .6) ? 1 : .15; }}); }
      }
    }
    // birds gliding by
    for (let i=0;i<5;i++){ const b = new THREE.Group(), m = basic({color:0x22263a});
      [-1,1].forEach(s=>{ const wing = new THREE.Mesh(new THREE.PlaneGeometry(.5,.08), m); wing.position.x = s*.22; wing.rotation.z = s*.35; b.add(wing); });
      b.position.set(-60 + rr()*120, 16 + rr()*8, -18 - rr()*6); group.add(b); const sp = 2 + rr()*2, ph = rr()*6;
      ambient.push({update(dt, t){ b.position.x += sp*dt; b.position.y += Math.sin(t*2 + ph)*dt*.6; b.children.forEach((w,j)=>w.rotation.z = (j ? 1 : -1) * (.2 + Math.sin(t*9 + ph)*.35)); if (b.position.x > 70) b.position.x = -70; }}); }
  }
  function farmBackdrop(){
    const hills = [{z:-26, col:0x6aa04c, n:6}, {z:-40, col:0x5b8f44, n:5}];
    for (const Ly of hills) for (let i=0;i<Ly.n;i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(16 + rr()*10, 20, 10), lam({color:Ly.col})); m.position.set(-70 + i*(140/Ly.n) + rr()*10, -12, Ly.z - rr()*6); m.scale.y = .5; group.add(m); }
    // trees
    for (let i=0;i<10;i++){ const t = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.25,.3,2,6), lam({color:0x6b4a2e})); trunk.position.y = 1; t.add(trunk);
      const top = new THREE.Mesh(new THREE.SphereGeometry(1.4 + rr()*.6, 10, 8), lam({color:[0x3f7d34,0x4f8f3c,0x356e2c][i%3]})); top.position.y = 2.8; t.add(top);
      t.position.set(-40 + i*8.5 + rr()*3, 0, -12 - rr()*6); group.add(t); }
    // windmill
    const wm = new THREE.Group(); wm.position.set(-22, 0, -24); group.add(wm);
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(.8, 1.8, 12, 6), lam({color:0xe8e0d0})); tower.position.y = 6; wm.add(tower);
    const hub = new THREE.Group(); hub.position.set(0, 12, 1.2); wm.add(hub);
    for (let k=0;k<4;k++){ const bl = new THREE.Mesh(new THREE.BoxGeometry(.7, 6, .1), lam({color:0xb23a2c})); bl.position.y = 3; const arm = new THREE.Group(); arm.rotation.z = k*Math.PI/2; arm.add(bl); hub.add(arm); }
    ambient.push({update(dt){ hub.rotation.z -= dt*.8; }});
    // fence along the back of the field
    const fm = lam({color:0xf0e6d2});
    for (let x=-20; x<=20; x+=1.6){ const p = new THREE.Mesh(new THREE.BoxGeometry(.15, 1.1, .15), fm); p.position.set(x, .55, -3.4); group.add(p); }
    [.35, .8].forEach(y=>{ const r = new THREE.Mesh(new THREE.BoxGeometry(41, .12, .1), fm); r.position.set(0, y, -3.4); group.add(r); });
    // sheep grazing behind the fence
    for (let i=0;i<3;i++){ const s = new THREE.Group(); const body = new THREE.Mesh(new THREE.SphereGeometry(.7, 10, 8), lam({color:0xf6f3ea})); body.scale.set(1.3, .9, .9); body.position.y = .9; s.add(body);
      const head = new THREE.Mesh(new THREE.BoxGeometry(.4, .4, .4), lam({color:0x2b2522})); head.position.set(.95, 1.05, 0); s.add(head);
      for (const lx of [-.45, .45]){ const leg = new THREE.Mesh(new THREE.BoxGeometry(.12, .5, .12), lam({color:0x2b2522})); leg.position.set(lx, .25, 0); s.add(leg); }
      s.position.set(-8 + i*9 + rr()*3, 0, -6 - rr()*2); s.rotation.y = rr() < .5 ? 0 : Math.PI; group.add(s); const ph = rr()*6;
      ambient.push({update(dt, t){ head.position.y = 1.05 - Math.max(0, Math.sin(t*.9 + ph))*.45; }}); }
  }
  // solid cells: one box per horizontal run, faces textured by what the run is
  function looks(c, n){
    switch (c){
      case '#': return {side: lam({map:repTex(T.facade, n/4, 1/4, 0, Math.floor(rr()*4)/4)}), top: lam({color:0x9aa1ae}), edge:0xe7ebf2};
      case 'C': return {side: lam({map:repTex(T.brick, n/2, .5)}), top: lam({color:0x5a2a20}), edge:0xd88a6a};
      case 'G': return {side: lam({map:repTex(T.soil, n/2, .5)}), top: lam({map:repTex(T.grass, n/2, 1)}), edge:0x77c04f};
      case 'B': return {side: lam({map:repTex(T.planks, n/2, .5)}), top: lam({color:0x6a2a22}), edge:0xf3ead8};
      case 'T': return {side: lam({map:repTex(T.tractor, n/2, .5)}), top: lam({color:0x2f6e2b}), edge:0xb4ec82};
      case 'M': return {side: lam({map:repTex(T.metal, n/2, .5)}), top: lam({color:0x6c6f76}), edge:0xd3d6dc};
      case 'P': return {side: lam({map:T.crate}), top: lam({color:0x8a6038}), edge:0xd8a96d};
      case 'O': return {side: lam({map:repTex(T.silo, n/2, .5)}), top: lam({color:0x9aa0a8}), edge:0xf4f7fa};
      case 'W': return {side: lam({map:repTex(T.stone, n/3, .33)}), top: lam({color:0x4a4752}), edge:0x8d9a7a};
      case 'H': return {side: lam({map:repTex(T.rot, n/2, .5)}), top: lam({color:0x3e2b1f}), edge:0xc9a27a};
      case 'R': return {side: lam({map:repTex(T.shingle, n/2, .5)}), top: lam({color:0x2a2333}), edge:0x8a7aa0};
      case 'K': return {side: lam({map:repTex(T.rock, n/3, .33)}), top: lam({color:0x6b6156}), edge:0xb9ad9c};
      case 'Q': return {side: lam({map:repTex(T.rock, n/3, .33)}), top: lam({map:repTex(T.grass, n/2, 1)}), edge:0x77c04f};
      default:  return {side: lam({color:0x888888}), top: lam({color:0x999999}), edge:0xdddddd};
    }
  }
  function solids(map){
    const grid = map.grid, H = grid.length, W = grid[0].length;
    const solidAt = (x,y)=> y>=0 && y<H && x>=0 && x<W && !'.SF'.includes(grid[y][x]);
    const dark = lam({color:0x1a1716});
    for (let y=0;y<H;y++){
      let x = 0;
      while (x < W){
        const c = grid[y][x]; if (!solidAt(x,y)){ x++; continue; }
        let x1 = x; while (x1+1 < W && grid[y][x1+1] === c) x1++;
        const n = x1 - x + 1, Lk = looks(c, n), depth = c === 'G' ? 10 : DEPTH, z = c === 'G' ? -3 : 0;
        // runs on the last row continue below the frame so buildings never float
        const m = box(n, 1, depth, faceMats(Lk.side, Lk.top, dark)); m.position.set(WX(x + n/2), WY(y + .5), z); group.add(m);
        if (y === H-1){ const ext = box(n, 14, depth, c === 'G' ? lam({color:0x4a3320}) : lam({color:0x4a5060})); ext.position.set(WX(x + n/2), WY(y + 1) - 7, z); group.add(ext); }
        let e = x; while (e <= x1){ if (solidAt(e, y-1)){ e++; continue; } let e1 = e; while (e1+1 <= x1 && !solidAt(e1+1, y-1)) e1++;
          placeBox(box(e1-e+1, .16, depth + .06, lam({color:Lk.edge})), e, y, e1-e+1, .16, z); e = e1 + 1; }
        x = x1 + 1;
      }
    }
  }
  function cityProps(){
    // AC units and a water tower on the roofs (behind the running lane)
    const ac = lam({color:0xb7bcc6}), fan = lam({color:0x4a4f5c});
    [[1.2, 10], [4.6, 10]].forEach(([x, y])=>{ const u = box(1.4, .9, 1.2, ac); u.position.set(WX(x), WY(y) + .45, -1.5); group.add(u); const f = new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.05,12), fan); f.position.set(WX(x), WY(y) + .92, -1.5); group.add(f); });
    const wt = new THREE.Group(); wt.position.set(WX(23.5), WY(8), -1.6); group.add(wt);
    for (const lx of [-.7, .7]){ const leg = box(.12, 2.2, .12, lam({color:0x5a3f2a})); leg.position.set(lx, 1.1, 0); wt.add(leg); }
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 1.8, 14), lam({map:repTex(T.wood, 2, 4)})); tank.position.y = 3.1; wt.add(tank);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(1.25, .8, 14), lam({color:0x4a3a2a})); cap.position.y = 4.4; wt.add(cap);
    // antenna with a blinking light
    const ant = box(.08, 3, .08, lam({color:0x333844})); ant.position.set(WX(30.5), WY(8) + 1.5, -1.5); group.add(ant);
    const bl = sprite(T.glow, 1, 0xff3b3b); bl.position.set(WX(30.5), WY(8) + 3.05, -1.4); group.add(bl); ambient.push({update(dt, t){ bl.material.opacity = Math.sin(t*4) > .3 ? 1 : .2; }});
    // neon sign on the goal tower
    const sign = textPlane('世志旅館', 4.2, 1.05, '#ff6fb1', 'rgba(30,10,30,.92)'); sign.position.set(WX(26), WY(11.2), DEPTH/2 + .05); group.add(sign);
    ambient.push({update(dt, t){ sign.material.opacity = (Math.sin(t*13) > .96) ? .55 : 1; }});
    // string lights from the chimney to the antenna
    const p0 = new THREE.Vector3(WX(27.9), WY(5.2), -1.6), p1 = new THREE.Vector3(WX(30.5), WY(5.5), -1.6);
    for (let i=0;i<=8;i++){ const t = i/8, pt = p0.clone().lerp(p1, t); pt.y -= Math.sin(t*Math.PI)*.5; const s = sprite(T.glow, .55, [0xffd27a, 0xff8a6a, 0x9ad0ff][i%3]); s.position.copy(pt); group.add(s); }
    // chimney smoke
    chimneySmoke(WX(27), WY(5), -.4);
  }
  function chimneySmoke(x, y, z){
    let acc = 0; ambient.push({update(dt){ acc += dt; if (acc > .45){ acc = 0; spawnPart({pos:[x + (rr()-.5)*.6, y + .2, z], vel:[.3 + rr()*.3, 1 + rr()*.4, 0], life:3.2, size:.7, grow:1.2, color:0xd9d4cf, opacity:.5}); } }});
  }
  function farmProps(){
    // barn door (white X) and hayloft window, painted on the barn front
    const front = DEPTH/2 + .03, white = lam({color:0xf3ead8});
    const door = new THREE.Group(); door.position.set(WX(4), WY(14), front); group.add(door);
    const dr = new THREE.Mesh(new THREE.PlaneGeometry(3, 4), lam({color:0x8f2b22})); door.add(dr);
    [[3.1,.22,0,1.9],[3.1,.22,0,-1.9],[.22,4,1.45,0],[.22,4,-1.45,0]].forEach(([w,h,x,y])=>{ const b = new THREE.Mesh(new THREE.PlaneGeometry(w,h), white); b.position.set(x,y,.01); door.add(b); });
    [1,-1].forEach(s=>{ const b = new THREE.Mesh(new THREE.PlaneGeometry(.22, 4.9), white); b.rotation.z = s*.64; b.position.z = .01; door.add(b); });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), lam({color:0x2a1a14})); win.position.set(WX(4), WY(10), front); group.add(win);
    const hayIn = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .5), lam({map:T.hay})); hayIn.position.set(WX(4), WY(10.3), front + .01); group.add(hayIn);
    // gable roof behind the flat roof
    const sh = new THREE.Shape(); sh.moveTo(-4.4, 0); sh.lineTo(0, 2.4); sh.lineTo(4.4, 0); sh.closePath();
    const gable = new THREE.Mesh(new THREE.ShapeGeometry(sh), lam({color:0x5b2a22})); gable.position.set(WX(4), WY(8), -2.2); group.add(gable);
    // tractor wheels, cab window, exhaust
    const tire = lam({color:0x1d1d1f}), rim = lam({color:0xf2c14e});
    [[10, 15.6, 1.25], [12.4, 15.85, .7]].forEach(([x,y,r])=>{ const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .5, 20), tire); t.rotation.x = Math.PI/2; t.position.set(WX(x), WY(y), DEPTH/2 + .1); group.add(t);
      const h = new THREE.Mesh(new THREE.CylinderGeometry(r*.45, r*.45, .52, 12), rim); h.rotation.x = Math.PI/2; h.position.copy(t.position); h.position.z += .02; group.add(h); });
    const cab = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1), lam({color:0x9fd2ee})); cab.position.set(WX(11.6), WY(13.8), front); group.add(cab);
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 1.4, 8), lam({color:0x333333})); pipe.position.set(WX(12.3), WY(13) + .7, -1.4); group.add(pipe);
    chimneySmoke(WX(12.3), WY(13) + 1.45, -1.4);
    // thresher: intake hood and warning sign
    const warn = textPlane('危險', 1.6, .55, '#1a1716', '#f2c14e'); warn.position.set(WX(20.5), WY(14.3), front); group.add(warn);
    // silo ladder + dome behind
    const lad = lam({color:0x6c7178});
    for (let y=6; y<15; y+=.6){ const r = new THREE.Mesh(new THREE.PlaneGeometry(.8, .08), lad); r.position.set(WX(28.4), WY(y), front); group.add(r); }
    [28.05, 28.75].forEach(x=>{ const r = new THREE.Mesh(new THREE.PlaneGeometry(.08, 9.6), lad); r.position.set(WX(x), WY(10.4), front); group.add(r); });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 16, 8, 0, Math.PI*2, 0, Math.PI/2), lam({color:0x9aa0a8})); dome.position.set(WX(27.5), WY(5), -2.4); dome.scale.y = .6; group.add(dome);
    // grass tufts and sunflowers along the ground (short, never hiding a runner)
    const tuft = lam({color:0x4f9a36}), petal = lam({color:0xf2c14e}), mid = lam({color:0x6b4a2e});
    for (let i=0;i<46;i++){ const x = rr()*32; if (x > 0 && x < 8) continue; const t = new THREE.Mesh(new THREE.ConeGeometry(.12, .5 + rr()*.4, 4), tuft); t.position.set(WX(x), WY(16) + .22, 1.4 + rr()*1.2); t.rotation.z = (rr()-.5)*.5; group.add(t); const ph = rr()*6; ambient.push({update(dt, tt){ t.rotation.z = Math.sin(tt*1.6 + ph)*.18; }}); }
    for (const x of [14.2, 15.6, 30.5, 31.3]){ const f = new THREE.Group(); f.position.set(WX(x), WY(16), -1.2); group.add(f);
      const st = new THREE.Mesh(new THREE.CylinderGeometry(.05,.05,1.6,5), tuft); st.position.y = .8; f.add(st);
      const head = new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.08,12), petal); head.rotation.x = Math.PI/2; head.position.y = 1.65; f.add(head);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(.15,.15,.1,10), mid); c.rotation.x = Math.PI/2; c.position.set(0, 1.65, .03); f.add(c); }
  }
  // ---------- old mansion ----------
  function mansionBackdrop(){
    const hills = [{z:-30, col:0x2a2440}, {z:-44, col:0x221d36}];
    for (const Ly of hills) for (let i=0;i<6;i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(16 + rr()*10, 20, 10), basic({color:Ly.col})); m.position.set(-70 + i*26 + rr()*10, -12, Ly.z - rr()*6); m.scale.y = .45; group.add(m); }
    // bare dead trees in silhouette
    const sil = basic({color:0x15121f});
    const deadTree = (x, z, s)=>{ const t = new THREE.Group(); t.position.set(x, -1, z); t.scale.setScalar(s); group.add(t);
      const tr = new THREE.Mesh(new THREE.BoxGeometry(.5, 6, .1), sil); tr.position.y = 3; t.add(tr);
      for (let k=0;k<5;k++){ const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 2 + rr()*2, .1), sil); const sd = k%2 ? 1 : -1; b.position.set(sd*.6, 3.5 + k*.6, 0); b.rotation.z = -sd*(.6 + rr()*.4); t.add(b); } };
    for (let i=0;i<9;i++) deadTree(-60 + i*15 + rr()*6, -20 - rr()*10, .8 + rr()*.7);
    // graves and an iron fence in front of the hill
    const stone = lam({color:0x55515e});
    for (let i=0;i<8;i++){ const gx = -34 + i*3.2 + rr(); if (gx > -12 && gx < 12) continue; const gs = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.2 + rr()*.4, .25), stone); gs.position.set(gx, .5, -9 - rr()*2); gs.rotation.z = (rr()-.5)*.25; group.add(gs); }
    const iron = basic({color:0x0f0d16});
    for (let x=-40; x<=40; x+=.8){ const p = new THREE.Mesh(new THREE.BoxGeometry(.08, 1.6, .08), iron); p.position.set(x, .3, -7); group.add(p); const tip = new THREE.Mesh(new THREE.ConeGeometry(.1, .25, 4), iron); tip.position.set(x, 1.2, -7); group.add(tip); }
    [-.1, .8].forEach(y=>{ const r = new THREE.Mesh(new THREE.BoxGeometry(80, .08, .08), iron); r.position.set(0, y, -7); group.add(r); });
    // bats
    for (let i=0;i<6;i++){ const b = new THREE.Group(), m = basic({color:0x0c0a12});
      const body = new THREE.Mesh(new THREE.SphereGeometry(.13, 6, 4), m); b.add(body);
      [-1,1].forEach(sd=>{ const wing = new THREE.Mesh(new THREE.PlaneGeometry(.5, .16), m); wing.position.x = sd*.28; b.add(wing); });
      b.position.set(-50 + rr()*100, 14 + rr()*10, -16 - rr()*8); group.add(b); const sp = 2.5 + rr()*2, ph = rr()*6;
      ambient.push({update(dt, t){ b.position.x += sp*dt; b.position.y += Math.sin(t*3 + ph)*dt*1.2; b.children.slice(1).forEach((w,j)=>w.rotation.y = (j ? 1 : -1) * Math.sin(t*16 + ph)*.9); if (b.position.x > 60) b.position.x = -60; }}); }
    // low fog drifting
    for (let i=0;i<10;i++){ const f = sprite(T.puff, 8 + rr()*6, 0x8a7fa6, .25); f.position.set(-50 + i*11, -1 + rr()*2, -5 - rr()*6); group.add(f); const sp = .4 + rr()*.4; ambient.push({update(dt){ f.position.x += sp*dt; if (f.position.x > 50) f.position.x = -50; }}); }
  }
  function mansionProps(){
    const back = -1.9, front = DEPTH/2 + .03;
    // torn wallpaper behind the house, with holes where the night shows through
    const paper = (x0, y0, x1, y1)=>{ const m = new THREE.Mesh(new THREE.PlaneGeometry(x1-x0, y1-y0), lam({map:repTex(T.paper, (x1-x0)/2, (y1-y0)/2)})); m.position.set(WX((x0+x1)/2), WY((y0+y1)/2), back); group.add(m); };
    paper(7, 7, 22, 16); paper(9, 2, 14, 6); paper(18, 3, 23, 6); paper(14, 4, 18, 6);
    const wood = lam({color:0x2e2018});
    // the house frame: corner posts and slanted broken roof beams
    [[7, 7, 16], [22, 3, 10], [9, 2, 6]].forEach(([x, y0, y1])=>{ const p = box(.4, y1-y0, .4, wood); p.position.set(WX(x + .2), WY((y0+y1)/2), back + .3); group.add(p); });
    [[9, 2.2, 14.5, .9, .5], [17.5, 3, 22.5, 1.6, -.35]].forEach(([x0, y0, x1, y1, rz])=>{ const b = box(Math.hypot(x1-x0, y1-y0) + .6, .3, .3, wood); b.position.set(WX((x0+x1)/2), WY((y0+y1)/2) + 1, back + .5); b.rotation.z = rz; group.add(b); });
    // two windows with moonlight, one with broken panes
    [[11, 9.5], [19, 9.5]].forEach(([x, y], k)=>{ const fr = box(2.2, 2.6, .12, wood); fr.position.set(WX(x), WY(y), back + .05); group.add(fr);
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.2), basic({color:0x9fb2dd, transparent:true, opacity:.7})); gl.position.set(WX(x), WY(y), back + .13); group.add(gl);
      [[1.9, .1, 0, 0], [.1, 2.3, 0, 0]].forEach(([w, h])=>{ const c = box(w, h, .05, wood); c.position.set(WX(x), WY(y), back + .16); group.add(c); });
      if (k === 1){ const hole = new THREE.Mesh(new THREE.CircleGeometry(.55, 7), basic({color:0x1c1830})); hole.position.set(WX(x + .4), WY(y + .4), back + .15); group.add(hole); }
      const beam = sprite(T.glow, 3.4, 0x9fb2ff, .35); beam.position.set(WX(x), WY(y), back + .3); group.add(beam); });
    // crooked portraits
    [[15.6, 10.8, .12, 0xb88a3a], [9.4, 12.6, -.18, 0x8a6a3a]].forEach(([x, y, rz, col])=>{ const f = box(1.3, 1.6, .1, lam({color:col})); f.position.set(WX(x), WY(y), back + .1); f.rotation.z = rz; group.add(f);
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(.95, 1.25), lam({color:0x3a2c3e})); pic.position.set(0, 0, .06); f.add(pic);
      const face = new THREE.Mesh(new THREE.CircleGeometry(.25, 12), lam({color:0xb8a690})); face.position.set(0, .15, .07); f.add(face); });
    // swinging chandelier under the roof
    const ch = new THREE.Group(); ch.position.set(WX(12), WY(2), -1); group.add(ch);
    const chain = box(.05, 1.3, .05, lam({color:0x6a5a3a})); chain.position.y = -.65; ch.add(chain);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .06, 6, 16), lam({color:0x8a7444})); ring.rotation.x = Math.PI/2; ring.position.y = -1.35; ch.add(ring);
    for (let k=0;k<5;k++){ const a = k/5*Math.PI*2; const c = sprite(T.glow, .5, 0xffc070, .9); c.position.set(Math.cos(a)*.6, -1.15, Math.sin(a)*.6); ch.add(c); const ph = rr()*6; ambient.push({update(dt, t){ c.material.opacity = .65 + Math.sin(t*11 + ph)*.25; }}); }
    ambient.push({update(dt, t){ ch.rotation.z = Math.sin(t*.9)*.12; }});
    // cobwebs in the corners
    const web = basic({color:0xd8d4e0, transparent:true, opacity:.35});
    [[7.4, 7.3, 1], [21.6, 7.3, -1], [9.4, 2.3, 1]].forEach(([x, y, sd])=>{ for (let k=0;k<4;k++){ const l = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .03), web); l.position.set(WX(x) + sd*.45, WY(y) - .45, back + .4); l.rotation.z = -sd*(.2 + k*.35); group.add(l); } });
    // candles on the ground floor, rubble and loose boards in front
    [[13.5, 16], [20, 16]].forEach(([x, y])=>{ const c = box(.16, .5, .16, lam({color:0xeee6d0})); c.position.set(WX(x), WY(y) + .25, -1.2); group.add(c); const fl = sprite(T.glow, .7, 0xffb050); fl.position.set(WX(x), WY(y) + .62, -1.1); group.add(fl); const ph = rr()*6; ambient.push({update(dt, t){ fl.scale.setScalar(.6 + Math.sin(t*14 + ph)*.08); }}); });
    for (let i=0;i<8;i++){ const r = box(.3 + rr()*.4, .2 + rr()*.2, .3, lam({color:[0x4a4752,0x3e2b1f][i%2]})); r.position.set(WX(7.5 + rr()*14), WY(16) + .1, 1.2 + rr()*.7); r.rotation.y = rr()*3; group.add(r); }
    const sign = textPlane('老宅', 1.8, .6, '#e9dcc0', 'rgba(40,24,18,.95)'); sign.position.set(WX(3.5), WY(12) + 1.4, -.8); sign.rotation.z = -.08; group.add(sign);
    const post = box(.15, 1.4, .15, wood); post.position.set(WX(3.5), WY(12) + .6, -.85); group.add(post);
  }
  function elevatorView(h, i){
    const metal = lam({color:0x6a6670}), dark = lam({color:0x2c2a30}), red = lam({color:0xd8322a, emissive:0x400000}), gold = lam({color:0xb8913c});
    // guide rails, pulley at the top
    [h.x, h.x + h.w].forEach(x=>{ const r = box(.16, h.bottom - h.top + 1.5, .16, dark); r.position.set(WX(x), WY((h.top + h.bottom)/2), -1.2); group.add(r); });
    const pulley = new THREE.Mesh(new THREE.CylinderGeometry(.45, .45, .3, 16), gold); pulley.rotation.x = Math.PI/2; pulley.position.set(WX(h.x + h.w/2), WY(h.top - 4.6), -1); group.add(pulley);
    const g = new THREE.Group(); group.add(g);
    const plat = box(h.w, .5, DEPTH*.8, lam({map:repTex(T.metal, h.w/2, .25)})); plat.position.y = -.25; g.add(plat);
    const trim = box(h.w + .04, .1, DEPTH*.8 + .04, gold); trim.position.y = -.02; g.add(trim);
    const chains = [-1, 1].map(sd=>{ const c = box(.06, 1, .06, metal); c.position.x = sd*(h.w/2 - .25); g.add(c); return c; });
    const btns = h.buttons.map(bt=>{ const b = new THREE.Group(); b.position.set(WX(bt.x), WY(bt.y), .9); group.add(b);
      const base = box(1, .18, .9, dark); base.position.y = .09; b.add(base);
      const dome = new THREE.Mesh(new THREE.SphereGeometry(.38, 16, 8, 0, Math.PI*2, 0, Math.PI/2), red); dome.position.y = .18; b.add(dome);
      const halo = sprite(T.glow, 1.2, 0xff5040, .5); halo.position.y = .4; b.add(halo); return {dome, halo}; });
    return { i, update(dt, t, st){
      const y = st ? st.y : h.top; g.position.set(WX(h.x + h.w/2), WY(y), 0);
      const len = y - (h.top - 4.6); chains.forEach(c=>{ c.scale.y = len; c.position.y = len/2; });
      pulley.rotation.z = -y*1.5;
      btns.forEach((b, k)=>{ const on = st && st.pressed && st.pressed[k]; b.dome.scale.y = on ? .35 : 1; b.halo.material.opacity = on ? .9 : .35 + Math.sin(t*3)*.15; });
    }};
  }
  function spikesView(h){
    const q = h.rect;
    if (h.look === 'thorns'){
      const leaf = [lam({color:0x2a3a22}), lam({color:0x34482a}), lam({color:0x3a2a3a})], spike = lam({color:0xc9c0a6}), berry = lam({color:0xa0202a});
      for (let k=0;k<26;k++){ const x = q.x + rr()*q.w, y = q.y + q.h*(.25 + rr()*.75);
        const s = new THREE.Mesh(new THREE.SphereGeometry(.35 + rr()*.35, 7, 5), leaf[k%3]); s.position.set(WX(x), WY(y), -.6 + rr()*2.6); group.add(s);
        for (let j=0;j<3;j++){ const c = new THREE.Mesh(new THREE.ConeGeometry(.06, .45, 4), spike); const a = rr()*Math.PI*2; c.position.set(s.position.x + Math.cos(a)*.4, s.position.y + Math.sin(a)*.4, s.position.z + .2); c.rotation.z = a - Math.PI/2; group.add(c); }
        if (rr() < .3){ const b = new THREE.Mesh(new THREE.SphereGeometry(.08, 6, 4), berry); b.position.set(s.position.x + .2, s.position.y + .25, s.position.z + .35); group.add(b); } }
    } else if (h.look === 'glass'){
      const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(q.w, 0); sh.lineTo(q.w*.75, q.h*.55); sh.lineTo(q.w*.45, q.h); sh.lineTo(q.w*.1, q.h*.4); sh.closePath();
      const geo = new THREE.ExtrudeGeometry(sh, {depth:.25, bevelEnabled:false});
      const m = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color:0xbfe8ff, transparent:true, opacity:.55, shininess:120, specular:0xffffff, side:THREE.DoubleSide})); m.position.set(WX(q.x), WY(q.y + q.h), .4); group.add(m);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:.8})); edges.position.copy(m.position); group.add(edges);
      const glint = sprite(T.glow, .8, 0xffffff, 0); glint.position.set(WX(q.x + q.w*.45), WY(q.y + .3), .8); group.add(glint);
      ambient.push({update(dt, t){ const k = (t % 3.2); glint.material.opacity = k < .35 ? Math.sin(k/.35*Math.PI) : 0; }});
    } else if (h.look === 'vine'){
      const g = new THREE.Group(); g.position.set(WX(q.x + q.w/2), WY(q.y), .5); group.add(g);
      const stem = lam({color:0x2d4a24}), leaf = lam({color:0x3f6a2e, side:THREE.DoubleSide}), thorn = lam({color:0x8a2a3a});
      const st = new THREE.Mesh(new THREE.CylinderGeometry(.08, .12, q.h, 6), stem); st.position.y = -q.h/2; g.add(st);
      for (let y=.4; y<q.h; y+=.42){ const sd = (Math.round(y/.42) % 2) ? 1 : -1;
        const l = new THREE.Mesh(new THREE.CircleGeometry(.2, 6), leaf); l.scale.set(1.4, .7, 1); l.position.set(sd*.22, -y, .05); l.rotation.z = sd*.5; g.add(l);
        const c = new THREE.Mesh(new THREE.ConeGeometry(.05, .22, 4), thorn); c.position.set(-sd*.12, -y - .2, .08); c.rotation.z = sd*Math.PI/2; g.add(c); }
      const bud = new THREE.Mesh(new THREE.SphereGeometry(.15, 8, 6), thorn); bud.position.y = -q.h; g.add(bud);
      const ph = rr()*6; ambient.push({update(dt, t){ g.rotation.z = Math.sin(t*1.1 + ph)*.035; }});
    }
  }
  // ---------- waterfall ----------
  function fallsBackdrop(){
    const ridges = [{z:-50, col:0x9bb8cc, n:6, h:26}, {z:-38, col:0x7d9fb2, n:7, h:20}];
    for (const Ly of ridges) for (let i=0;i<Ly.n;i++){ const hh = Ly.h*(.6 + rr()*.5), m = new THREE.Mesh(new THREE.ConeGeometry(hh*.8, hh, 5), basic({color:Ly.col})); m.position.set(-75 + i*(150/Ly.n) + rr()*8, -8 + hh/2, Ly.z); group.add(m);
      const snow = new THREE.Mesh(new THREE.ConeGeometry(hh*.22, hh*.27, 5), basic({color:0xf2f6f8})); snow.position.set(m.position.x, -8 + hh - hh*.135, Ly.z + .1); group.add(snow); }
    // pine forest
    const pine = [lam({color:0x2f5e3a}), lam({color:0x3a6e44}), lam({color:0x28502f})];
    for (let i=0;i<22;i++){ const t = new THREE.Group(), s = .7 + rr()*.8; t.position.set(-60 + i*5.6 + rr()*3, -4 + rr()*2, -18 - rr()*12); t.scale.setScalar(s); group.add(t);
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(.18, .22, 1.4, 5), lam({color:0x5a3f2a})); tr.position.y = .7; t.add(tr);
      for (let k=0;k<3;k++){ const c = new THREE.Mesh(new THREE.ConeGeometry(1.6 - k*.4, 2, 7), pine[i%3]); c.position.y = 2 + k*1.1; t.add(c); } }
    // birds
    for (let i=0;i<4;i++){ const b = new THREE.Group(), m = basic({color:0x3a4a5a});
      [-1,1].forEach(sd=>{ const wing = new THREE.Mesh(new THREE.PlaneGeometry(.5,.08), m); wing.position.x = sd*.22; wing.rotation.z = sd*.35; b.add(wing); });
      b.position.set(-60 + rr()*120, 18 + rr()*8, -22 - rr()*6); group.add(b); const sp = 2 + rr()*2, ph = rr()*6;
      ambient.push({update(dt, t){ b.position.x -= sp*dt; b.position.y += Math.sin(t*2 + ph)*dt*.6; b.children.forEach((w,j)=>w.rotation.z = (j ? 1 : -1) * (.2 + Math.sin(t*9 + ph)*.35)); if (b.position.x < -70) b.position.x = 70; }}); }
  }
  function fallsProps(){
    const front = DEPTH/2 + .03;
    // the pool far below: dark water filling the gap
    const pool = new THREE.Mesh(new THREE.PlaneGeometry(40, 10), lam({color:0x1f5a78, transparent:true, opacity:.92})); pool.rotation.x = -Math.PI/2; pool.position.set(WX(16), WY(18) - 1.2, 0); group.add(pool);
    const poolFront = new THREE.Mesh(new THREE.PlaneGeometry(21, 2.4), lam({color:0x184a66})); poolFront.position.set(WX(15.5), WY(18) - 2.4, 4.9); group.add(poolFront);
    for (let i=0;i<14;i++){ const sp = sprite(T.glow, .5 + rr()*.4, 0xbfe8ff, .5); sp.position.set(WX(6 + rr()*20), WY(18) - 1.1, -3 + rr()*6); group.add(sp); const ph = rr()*6; ambient.push({update(dt, t){ sp.material.opacity = .15 + Math.max(0, Math.sin(t*2 + ph))*.6; }}); }
    // rocks poking out of the pool
    const rock = lam({map:repTex(T.rock, 1, 1)});
    [[9, .9], [17, 1.2], [13, .7]].forEach(([x, r])=>{ const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rock); m.position.set(WX(x), WY(18) - .9, -.5 + rr()); m.rotation.set(rr(), rr(), rr()); group.add(m); });
    // the river on top of the right cliff and the falling sheet of water
    const river = repTex(T.water, 2, 1), sheet = repTex(T.water, 1.5, 4), veil = repTex(T.water, 1, 3);
    const rv = new THREE.Mesh(new THREE.PlaneGeometry(6, DEPTH + 1), lam({map:river, transparent:true, opacity:.9})); rv.rotation.x = -Math.PI/2; rv.position.set(WX(29), WY(3) + .04, 0); group.add(rv);
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, DEPTH + 1, 12, 1, true, Math.PI, Math.PI/2), lam({map:repTex(T.water, 1, 1), transparent:true, opacity:.9, side:THREE.DoubleSide})); lip.rotation.x = Math.PI/2; lip.position.set(WX(26), WY(3) - .5, 0); group.add(lip);
    const fall = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 20), lam({map:sheet, transparent:true, opacity:.88})); fall.position.set(WX(24.3), WY(3) - 10, -.9); group.add(fall);
    const front2 = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 20), basic({map:veil, transparent:true, opacity:.32, depthWrite:false})); front2.position.set(WX(24.3), WY(3) - 10, 1.4); group.add(front2);
    ambient.push({update(dt){ sheet.offset.y += dt*1.6; veil.offset.y += dt*2.3; river.offset.x -= dt*.6; }});
    // foam and mist
    let acc = 0; ambient.push({update(dt){ acc += dt; while (acc > .07){ acc -= .07;
      spawnPart({pos:[WX(22.8 + rr()*3.2), WY(17.6), -1 + rr()*2.4], vel:[(rr()-.5)*2, 1.5 + rr()*2, (rr()-.5)], life:1.4, size:.9, grow:1.6, color:0xffffff, opacity:.55});
      if (rr() < .4) spawnPart({pos:[WX(25.6 + rr()*.4), WY(3.2), -1 + rr()*2], vel:[-1.2 - rr(), .3, 0], life:.8, size:.4, grow:.6, color:0xe8f8ff, opacity:.7}); } }});
    for (let i=0;i<5;i++){ const m = sprite(T.puff, 7 + rr()*4, 0xffffff, .35); m.position.set(WX(20 + rr()*8), WY(17) + rr()*2, -2 + rr()*3); group.add(m); const ph = rr()*6; ambient.push({update(dt, t){ m.material.opacity = .22 + Math.sin(t*.8 + ph)*.1; }}); }
    // dead tree holding the goal
    const bark = lam({color:0x6e5a48}), dt0 = new THREE.Group(); dt0.position.set(WX(3.5), WY(6), -.9); group.add(dt0);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.28, .45, 4.4, 7), bark); trunk.position.y = 2.2; trunk.rotation.z = .06; dt0.add(trunk);
    [[1.2, 2.6, -.9, 2], [-1, 3.2, .8, 1.8], [.6, 4, -.5, 1.4], [-.4, 1.5, 1.1, 1.2]].forEach(([x, y, rz, l])=>{ const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .14, l, 5), bark); b.position.set(x*.6, y, 0); b.rotation.z = rz; dt0.add(b); });
    const roots = new THREE.Mesh(new THREE.ConeGeometry(.8, .5, 7), bark); roots.position.y = .2; dt0.add(roots);
    // tall grass on the cliff tops (hides what is placed in it, like the original)
    const blades = [lam({color:0x4f9a36, side:THREE.DoubleSide}), lam({color:0x6fbf4a, side:THREE.DoubleSide}), lam({color:0x3f8a2e, side:THREE.DoubleSide})];
    const tufts = (x0, x1, y)=>{ for (let x=x0; x<x1; x+=.28){ const hgt = .7 + rr()*.6, b = new THREE.Mesh(new THREE.PlaneGeometry(.22, hgt), blades[Math.floor(rr()*3)]);
      b.geometry.translate(0, hgt/2, 0); b.position.set(WX(x + rr()*.2), WY(y) - .05, .4 + rr()*1.9); b.rotation.y = (rr()-.5)*1.2; group.add(b); const ph = rr()*6; ambient.push({update(dt, t){ b.rotation.z = Math.sin(t*1.8 + ph + x*.3)*.12; }}); } };
    tufts(0, 16, 6); tufts(26.6, 32, 3);
    // roots and moss hanging under the overhang, ferns on the start ledge
    const root = lam({color:0x5a4634}), moss = lam({color:0x4a7a34});
    for (let i=0;i<12;i++){ const x = .5 + rr()*15, l = .5 + rr()*1.4, r = new THREE.Mesh(new THREE.CylinderGeometry(.03, .06, l, 4), i%3 ? root : moss); r.position.set(WX(x), WY(10) - l/2, .2 + rr()*1.6); group.add(r); const ph = rr()*6; ambient.push({update(dt, t){ r.rotation.z = Math.sin(t*1.3 + ph)*.08; }}); }
    for (let i=0;i<5;i++){ const f = new THREE.Mesh(new THREE.ConeGeometry(.3, .7, 5), moss); f.position.set(WX(.5 + i*1.1), WY(14) + .3, -1.2 + rr()*.6); group.add(f); }
    // moss streaks on the right cliff face
    for (let i=0;i<7;i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(.5 + rr()*.8, 1 + rr()*3), lam({color:0x4f7d38})); m.position.set(WX(26.6 + rr()*4.8), WY(5 + rr()*11), front); group.add(m); }
    const sign = textPlane('瀑布', 1.8, .6, '#f4ecd8', 'rgba(70,48,30,.95)'); sign.position.set(WX(4.5), WY(14) + 1.4, -.8); sign.rotation.z = .06; group.add(sign);
    const post = box(.15, 1.4, .15, lam({color:0x5a3f2a})); post.position.set(WX(4.5), WY(14) + .6, -.85); group.add(post);
  }
  function flagAt(map){
    let fx = -1, fy = -1; map.grid.forEach((row,y)=>{ const x = row.indexOf('F'); if (x >= 0){ fx = x; fy = y + 1; } });
    if (fx < 0) return;
    const F = GaoshiPhysics.FLAG, g = new THREE.Group(); g.position.set(WX(fx + .5), WY(fy), 0); group.add(g);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.08, .08, F.pole, 8), lam({color:0xf4f1ea})); pole.position.y = F.pole/2; g.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(.16, 10, 8), lam({color:0xf2c14e})); ball.position.y = F.pole + .1; g.add(ball);
    // the cloth is a strip of segments that waves
    const geo = new THREE.PlaneGeometry(F.clothW, F.clothH, 8, 1); geo.translate(F.clothW/2, -F.clothH/2, 0);
    flagMesh = new THREE.Mesh(geo, lam({color:0xf2c14e, side:THREE.DoubleSide})); flagMesh.position.set(.05, F.pole, 0); g.add(flagMesh);
    const pos = geo.attributes.position, base = Float32Array.from(pos.array);
    ambient.push({update(dt, t){ for (let i=0;i<pos.count;i++){ const x = base[i*3]; pos.array[i*3+2] = Math.sin(t*5 - x*3) * .12 * x; } pos.needsUpdate = true; }});
    const ring = new THREE.Mesh(new THREE.RingGeometry(.7, .85, 32), basic({color:0xf2c14e, transparent:true, opacity:.6, side:THREE.DoubleSide})); ring.rotation.x = -Math.PI/2; ring.position.y = .06; g.add(ring);
    ambient.push({update(dt, t){ const k = 1 + (t % 1.4) * .6; ring.scale.set(k, k, k); ring.material.opacity = .6 * (1 - (t % 1.4)/1.4); }});
  }
  function hazards(map){
    blades = []; hzViews = [];
    (map.hazards || []).forEach((h, i)=>{
      if (h.type === 'elevator') hzViews.push(elevatorView(h, i));
      else if (h.type === 'spikes') spikesView(h);
    });
    for (const h of map.hazards || []) if (h.type === 'rotating_blade'){
      const g = new THREE.Group(); g.position.set(WX(h.center[0]), WY(h.center[1]), .9); group.add(g);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.5,16), lam({color:0x3a3a3e})); hub.rotation.x = Math.PI/2; g.add(hub);
      const arm = new THREE.Group(); g.add(arm);
      [[-1,0xd93a2e],[1,0xf2f2f2]].forEach(([s,col])=>{ const m = box(h.length/2, h.thickness, .18, lam({color:col})); m.position.x = s*h.length/4; arm.add(m);
        const tip = box(.3, h.thickness + .1, .2, lam({color:0x1a1716})); tip.position.x = s*(h.length/2 - .15); arm.add(tip); });
      const shaft = box(.3, 1.8, .3, lam({color:0x55585e})); shaft.position.set(0, -1.1, -.3); g.add(shaft);
      blades.push({arm, h});
    }
  }
  function buildMap(map){
    textures(); if (!T.facade) T.facade = facadeTex('#8b92a1', '#33415e', .3);
    if (group) scene.remove(group); ambient.length = 0; parts.length = 0;
    group = new THREE.Group(); scene.add(group); seedA = {farm:11, mansion:23, waterfall:31}[map.id] || 7;
    scene.fog = new THREE.Fog({city:0x5b4f6a, mansion:0x2a2438, falls:0xcfe6ee}[map.look] || 0xbcd6ea, 40, 110);
    sky(map); ({city:cityBackdrop, farm:farmBackdrop, mansion:mansionBackdrop, falls:fallsBackdrop}[map.look] || farmBackdrop)();
    solids(map); ({city:cityProps, farm:farmProps, mansion:mansionProps, falls:fallsProps}[map.look] || farmProps)();
    flagAt(map); hazards(map);
    itemsGroup = new THREE.Group(); group.add(itemsGroup); itemViews = new Map();
    overlay = null;
  }

  // ---------- items ----------
  let itemsGroup = null, itemViews = new Map();
  function outline(w, h, color){
    const pts = [[0,0],[w,0],[w,0],[w,-h],[w,-h],[0,-h],[0,-h],[0,0]].map(([x,y])=>new THREE.Vector3(x, y, 0));
    return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color, transparent:true, opacity:.9}));
  }
  // returns a Group whose origin is the item's top-left cell corner
  function itemModel(type, ownerColor){
    textures(); const d = IT[type], g = new THREE.Group(), up = {update:null};
    const at2 = (m, x, y, z=0)=>{ m.position.set(x, -y, z); g.add(m); return m; };
    if (type === 'plank'){ at2(box(3, .7, 2, lam({map:repTex(T.wood, 1, 1)})), 1.5, .4); at2(box(3.04, .12, 2.04, lam({color:0xe0b070})), 1.5, .06); }
    if (type === 'hay'){ const m = lam({map:T.hay}); at2(box(1.96, 1.96, 2, m), 1, 1); for (let k=0;k<5;k++){ const s = box(.08, .3, .08, lam({color:0xf0cf6a})); s.rotation.z = (rr()-.5); at2(s, .3 + rr()*1.4, -.05, (rr()-.5)*1.5); } }
    if (type === 'wire'){
      const post = lam({color:0x5a4a3a}); [.2, 1.8].forEach(x=>at2(box(.12, .9, .12, post), x, .55));
      const wm = lam({color:0x9aa0a8});
      for (let k=0;k<6;k++){ const t = new THREE.Mesh(new THREE.TorusGeometry(.32, .035, 5, 14), wm); t.rotation.y = Math.PI/2.4; at2(t, .2 + k*.32, .62); }
      for (let k=0;k<9;k++){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.05, .2, 4), lam({color:0xd8dde4})); sp.rotation.z = (k%2 ? 1 : -1) * .9; at2(sp, .12 + k*.22, .3 + (k%3)*.18, .2); }
    }
    if (type === 'saw'){
      at2(box(1, 1, 1.2, lam({color:0x55585e})), 1.5, 1.5); [[1.15,1.15],[1.85,1.15],[1.15,1.85],[1.85,1.85]].forEach(([x,y])=>at2(box(.12,.12,1.25, lam({color:0xc9ccd2})), x, y));
      const disc = new THREE.Group(); disc.position.set(1.5, -1.5, .7); g.add(disc);
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, .06, 28), lam({color:0xc8ccd3})); plate.rotation.x = Math.PI/2; disc.add(plate);
      for (let k=0;k<16;k++){ const a = k/16*Math.PI*2, tooth = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 3), lam({color:0xe8ebef})); tooth.position.set(Math.cos(a)*1.25, Math.sin(a)*1.25, 0); tooth.rotation.z = a - Math.PI/2 + .5; disc.add(tooth); }
      const stripe = box(2.2, .14, .08, lam({color:0xd93a2e})); stripe.position.z = .05; disc.add(stripe);
      up.update = (dt)=>{ disc.rotation.z -= dt*9; };
    }
    if (type === 'bomb'){
      const s = new THREE.Mesh(new THREE.SphereGeometry(.42, 16, 12), lam({color:0x222226})); at2(s, .5, .55);
      at2(box(.2, .18, .2, lam({color:0x55585e})), .5, .08); const sp = sprite(T.glow, .6, 0xffb040); sp.position.set(.62, .2, 0); g.add(sp);
      up.update = (dt, t)=>{ sp.material.opacity = .5 + Math.random()*.5; };
    }
    if (type === 'coin'){
      const c = new THREE.Group(); c.position.set(.5, -.5, .3); g.add(c);
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .1, 20), lam({color:0xf2c14e, emissive:0x6a4a00})); disk.rotation.x = Math.PI/2; c.add(disk);
      const star = new THREE.Mesh(new THREE.CylinderGeometry(.16, .16, .12, 5), lam({color:0xfff2b0})); star.rotation.x = Math.PI/2; c.add(star);
      const glow = sprite(T.glow, 1.4, 0xffe08a, .6); c.add(glow);
      up.update = (dt)=>{ c.rotation.y += dt*3; }; g.userData.coin = c;
    }
    if (ownerColor !== undefined){ const o = outline(d.w, d.h, ownerColor); o.position.z = 1.15; g.add(o);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(.13, 12), basic({color:ownerColor})); dot.position.set(d.w - .2, -.2, 1.2); g.add(dot); }
    g.userData.update = up.update; return g;
  }
  function syncItems(items, colors){
    const live = new Set(items);
    for (const [it, v] of itemViews) if (!live.has(it)){ itemsGroup.remove(v); itemViews.delete(it); }
    for (const it of items) if (!itemViews.has(it)){ const v = pivotOf(itemModel(it.type, it.owner !== undefined ? colors[it.owner] : undefined), it.type); placePivot(v, it.type, it.x, it.y, it.r); itemsGroup.add(v); itemViews.set(it, v); popIn(v); }
  }
  // items turn about their own centre: the pivot sits at the centre of the (rotated) footprint
  function pivotOf(model, type){ const d = IT[type], pv = new THREE.Group(); model.position.set(-d.w/2, d.h/2, 0); pv.add(model); pv.userData = model.userData; return pv; }
  function placePivot(pv, type, x, y, r){ const D = GaoshiRules.dims(type, r); pv.position.set(WX(x + D.w/2), WY(y + D.h/2), 0); pv.rotation.z = -(r||0) * Math.PI/2; }
  function popIn(v){ v.scale.setScalar(.2); let t = 0; const a = {update(dt){ t += dt; const k = Math.min(1, t/.25); v.scale.setScalar(.2 + .8*k + Math.sin(k*Math.PI)*.25); if (k >= 1){ v.scale.setScalar(1); a.done = true; } }}; ambient.push(a); }
  function updateItems(dt, t, items){
    for (const [it, v] of itemViews){ if (v.userData.update) v.userData.update(dt, t);
      if (it.type === 'coin' && v.userData.coin){ const c = v.userData.coin; const cx = it.cx !== undefined ? it.cx : it.x + .5, cy = it.cy !== undefined ? it.cy : it.y + .5; c.position.set(cx - it.x, -(cy - it.y), it.carrier !== undefined ? 1.2 : .3); v.rotation.z = 0; } }
  }

  // ---------- placement overlay ----------
  function placeOverlay(on, world){
    if (overlay){ group.remove(overlay); overlay = null; }
    if (!on) return;
    overlay = new THREE.Group(); group.add(overlay);
    const pts = []; for (let x=0;x<=32;x++){ pts.push(new THREE.Vector3(WX(x), WY(0), 0), new THREE.Vector3(WX(x), WY(18), 0)); } for (let y=0;y<=18;y++){ pts.push(new THREE.Vector3(WX(0), WY(y), 0), new THREE.Vector3(WX(32), WY(y), 0)); }
    const gl = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:.12})); gl.position.z = 2.2; overlay.add(gl);
    const zones = [...(world.map.noPlaceZones || [])];
    for (const s of world.spawns) zones.push({x:Math.floor(s.x)-1, y:s.y-3, w:3, h:3});
    for (const g of world.goalRects) zones.push({x:Math.floor(g.x)-1, y:Math.floor(g.y)-1, w:Math.ceil(g.w)+2, h:Math.ceil(g.h)+2});
    for (const z of zones){ const t = repTex(T.hatch, z.w/2, z.h/2); const m = new THREE.Mesh(new THREE.PlaneGeometry(z.w, z.h), basic({map:t, transparent:true, depthWrite:false})); m.position.set(WX(z.x + z.w/2), WY(z.y + z.h/2), 2.25); overlay.add(m); }
  }
  // ghost preview for one player's cursor
  function makeGhost(type, color){
    const g = itemModel(type); g.traverse(o=>{ if (o.material){ o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = .55; o.material.depthWrite = false; } });
    const d = IT[type], frame = outline(d.w, d.h, color); frame.position.z = 2.3; g.add(frame); g.userData.frame = frame;
    const bad = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.h), basic({color:0xff3b30, transparent:true, opacity:.28, depthWrite:false})); bad.position.set(d.w/2, -d.h/2, 2.28); g.add(bad); g.userData.bad = bad;
    if (type === 'bomb'){ const r = outline(3, 3, 0xffb040); r.position.set(-1, 1, 2.3); g.add(r); }
    if (type === 'saw'){ const c = new THREE.Mesh(new THREE.RingGeometry(d.radius - .05, d.radius, 32), basic({color:0xff5a4f, transparent:true, opacity:.7})); c.position.set(1.5, -1.5, 2.3); g.add(c); }
    // a small arrow shows which way the base faces once it is turned
    if (d.needsSurface){ const ar = new THREE.Mesh(new THREE.ConeGeometry(.16, .3, 3), basic({color})); ar.rotation.z = Math.PI; ar.position.set(d.w/2, -d.h - .25, 2.3); g.add(ar); }
    g.userData.type = type;
    const pv = pivotOf(g, type); group.add(pv); return pv;
  }
  function setGhost(g, x, y, ok, r){ placePivot(g, g.userData.type, x, y, r); g.userData.bad.visible = !ok; g.visible = true; }
  const removeObj = (o)=>{ if (o && o.parent) o.parent.remove(o); };

  // ---------- particles ----------
  function spawnPart(o){
    const m = o.mesh || sprite(T.puff, o.size || .3, o.color || 0xffffff, o.opacity !== undefined ? o.opacity : 1);
    m.position.set(o.pos[0], o.pos[1], o.pos[2] || 0); group.add(m);
    parts.push({m, v:o.vel.slice(), life:o.life, t:0, g:o.gravity || 0, grow:o.grow || 0, spin:o.spin || 0, o0:m.material.opacity, size:o.size || .3});
  }
  function burst(x, y, color, n, speed, opts){
    opts = opts || {};
    for (let i=0;i<n;i++){ const a = rr()*Math.PI*2, s = speed*(.4 + rr()*.8);
      const m = opts.cubes ? new THREE.Mesh(new THREE.BoxGeometry(.18,.18,.18), lam({color: Array.isArray(color) ? color[i%color.length] : color})) : null;
      spawnPart({mesh:m, pos:[x, y, 1], vel:[Math.cos(a)*s, Math.sin(a)*s + (opts.up || 0), (rr()-.5)*2], life:.6 + rr()*.6, gravity:opts.gravity !== undefined ? opts.gravity : 14, size:opts.size || .4, color:Array.isArray(color) ? color[0] : color, spin:opts.cubes ? 8 : 0}); }
  }
  function explosion(x, y){
    const fl = sprite(T.glow, 1, 0xffc060); fl.position.set(x, y, 1.5); group.add(fl);
    parts.push({m:fl, v:[0,0,0], life:.45, t:0, g:0, grow:14, spin:0, o0:1, size:1});
    burst(x, y, [0x3a3a3a, 0xff8a3a, 0xffd27a], 22, 9, {cubes:true, gravity:10});
    for (let i=0;i<8;i++) spawnPart({pos:[x + (rr()-.5), y + (rr()-.5), 1], vel:[(rr()-.5)*3, 1 + rr()*2, 0], life:1.4, size:1.2, grow:2, color:0x777777, opacity:.6});
  }
  function updateParts(dt){
    for (let i=parts.length-1; i>=0; i--){ const p = parts[i]; p.t += dt;
      if (p.t >= p.life){ group.remove(p.m); parts.splice(i, 1); continue; }
      p.v[1] -= p.g*dt; p.m.position.x += p.v[0]*dt; p.m.position.y += p.v[1]*dt; p.m.position.z += p.v[2]*dt;
      if (p.spin){ p.m.rotation.x += p.spin*dt; p.m.rotation.y += p.spin*dt; }
      if (p.grow){ const s = p.size + p.grow*p.t; p.m.scale.set(s, s, s); }
      if (p.m.material) p.m.material.opacity = p.o0 * (1 - p.t/p.life); if (p.m.material) p.m.material.transparent = true;
    }
  }
  function update(dt, t, hz){
    for (let i=ambient.length-1; i>=0; i--){ ambient[i].update(dt, t); if (ambient[i].done) ambient.splice(i, 1); }
    const blade = hz && hz.find(h=>h.type === 'rotating_blade');
    for (const b of blades) b.arm.rotation.z = -(blade ? blade.angle : t / b.h.periodSec * Math.PI*2);
    for (const v of hzViews) v.update(dt, t, hz ? hz[v.i] : null);
    updateParts(dt);
  }
  return { WX, WY, buildMap, syncItems, updateItems, update, placeOverlay, makeGhost, setGhost, removeObj, burst, explosion, itemModel, itemIcon:null };
})();
