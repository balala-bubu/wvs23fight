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
    const SUN = {city:[26, 0xffb070, -18, 3], farm:[18, 0xfff2c0, 20, 20], mansion:[24, 0xffd9a0, 18, 6], falls:[20, 0xfff6d8, -24, 24]}[map.look] || [18, 0xfff2c0, 20, 20];
    const sun = sprite(T.glow, SUN[0], SUN[1]); sun.position.set(SUN[2], SUN[3], -66); group.add(sun);
    // drifting clouds
    for (let i=0;i<7;i++){
      const c = new THREE.Group(), col = map.look === 'city' ? 0xf0b49a : map.look === 'mansion' ? 0xf6b77a : 0xffffff;
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
    const hills = [{z:-30, col:0xb08878}, {z:-44, col:0xc49a88}];
    for (const Ly of hills) for (let i=0;i<6;i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(16 + rr()*10, 20, 10), basic({color:Ly.col})); m.position.set(-70 + i*26 + rr()*10, -12, Ly.z - rr()*6); m.scale.y = .45; group.add(m); }
    // bare dead trees in silhouette
    const sil = basic({color:0x7a5e58});
    const deadTree = (x, z, s)=>{ const t = new THREE.Group(); t.position.set(x, -1, z); t.scale.setScalar(s); group.add(t);
      const tr = new THREE.Mesh(new THREE.BoxGeometry(.5, 6, .1), sil); tr.position.y = 3; t.add(tr);
      for (let k=0;k<5;k++){ const b = new THREE.Mesh(new THREE.BoxGeometry(.18, 2 + rr()*2, .1), sil); const sd = k%2 ? 1 : -1; b.position.set(sd*.6, 3.5 + k*.6, 0); b.rotation.z = -sd*(.6 + rr()*.4); t.add(b); } };
    for (let i=0;i<9;i++) deadTree(-60 + i*15 + rr()*6, -20 - rr()*10, .8 + rr()*.7);
    // graves and an iron fence in front of the hill
    const stone = lam({color:0x55515e});
    for (let i=0;i<8;i++){ const gx = -34 + i*3.2 + rr(); if (gx > -12 && gx < 12) continue; const gs = new THREE.Mesh(new THREE.BoxGeometry(.9, 1.2 + rr()*.4, .25), stone); gs.position.set(gx, .5, -9 - rr()*2); gs.rotation.z = (rr()-.5)*.25; group.add(gs); }
    const iron = basic({color:0x5a4642});
    for (let x=-40; x<=40; x+=.8){ const p = new THREE.Mesh(new THREE.BoxGeometry(.08, 1.6, .08), iron); p.position.set(x, .3, -7); group.add(p); const tip = new THREE.Mesh(new THREE.ConeGeometry(.1, .25, 4), iron); tip.position.set(x, 1.2, -7); group.add(tip); }
    [-.1, .8].forEach(y=>{ const r = new THREE.Mesh(new THREE.BoxGeometry(80, .08, .08), iron); r.position.set(0, y, -7); group.add(r); });
    // bats
    for (let i=0;i<6;i++){ const b = new THREE.Group(), m = basic({color:0x5a4642});
      const body = new THREE.Mesh(new THREE.SphereGeometry(.13, 6, 4), m); b.add(body);
      [-1,1].forEach(sd=>{ const wing = new THREE.Mesh(new THREE.PlaneGeometry(.5, .16), m); wing.position.x = sd*.28; b.add(wing); });
      b.position.set(-50 + rr()*100, 14 + rr()*10, -16 - rr()*8); group.add(b); const sp = 2.5 + rr()*2, ph = rr()*6;
      ambient.push({update(dt, t){ b.position.x += sp*dt; b.position.y += Math.sin(t*3 + ph)*dt*1.2; b.children.slice(1).forEach((w,j)=>w.rotation.y = (j ? 1 : -1) * Math.sin(t*16 + ph)*.9); if (b.position.x > 60) b.position.x = -60; }}); }
    // low fog drifting
    for (let i=0;i<10;i++){ const f = sprite(T.puff, 8 + rr()*6, 0xf2d0b0, .25); f.position.set(-50 + i*11, -1 + rr()*2, -5 - rr()*6); group.add(f); const sp = .4 + rr()*.4; ambient.push({update(dt){ f.position.x += sp*dt; if (f.position.x > 50) f.position.x = -50; }}); }
  }
  function mansionProps(){
    const back = -1.9, front = DEPTH/2 + .03;
    // torn wallpaper behind the house, with holes where the night shows through
    const paper = (x0, y0, x1, y1)=>{ const m = new THREE.Mesh(new THREE.PlaneGeometry(x1-x0, y1-y0), lam({map:repTex(T.paper, (x1-x0)/2, (y1-y0)/2)})); m.position.set(WX((x0+x1)/2), WY((y0+y1)/2), back); group.add(m); };
    paper(10, 5, 21, 15); paper(13, 1.5, 18, 4);
    const wood = lam({color:0x2e2018});
    // the house frame: corner posts and slanted broken roof beams
    [[6.3, 10, 15], [8, 10, 15], [10.3, 10, 15], [12.4, 10, 15]].forEach(([x, y0, y1])=>{ const p = box(.4, y1-y0, .4, wood); p.position.set(WX(x + .2), WY((y0+y1)/2), back + .3); group.add(p); });
    // pointed roof behind the eave, chimney, and a slanted brace holding the goal platform
    const rs = new THREE.Shape(); rs.moveTo(-7.5, 0); rs.lineTo(0, 3.4); rs.lineTo(7.5, 0); rs.closePath();
    const roof = new THREE.Mesh(new THREE.ShapeGeometry(rs), lam({map:repTex(T.shingle, 4, 3)})); roof.position.set(WX(14.5), WY(4), back + .2); group.add(roof);
    const chim = box(1.4, 2.2, .8, lam({map:repTex(T.brick, 1, 1)})); chim.position.set(WX(17.8), WY(1.6), back + .2); group.add(chim);
    [[21.5, 4.6, 25.5, 5.6, -.25], [21, 8, 26, 5.8, .42]].forEach(([x0, y0, x1, y1, rz])=>{ const b = box(Math.hypot(x1-x0, y1-y0), .25, .25, wood); b.position.set(WX((x0+x1)/2), WY((y0+y1)/2), -1); b.rotation.z = rz; group.add(b); });
    // two windows with moonlight, one with broken panes
    [[12.5, 7], [16, 11.5]].forEach(([x, y], k)=>{ const fr = box(2.2, 2.6, .12, wood); fr.position.set(WX(x), WY(y), back + .05); group.add(fr);
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.2), basic({color:0x9fb2dd, transparent:true, opacity:.7})); gl.position.set(WX(x), WY(y), back + .13); group.add(gl);
      [[1.9, .1, 0, 0], [.1, 2.3, 0, 0]].forEach(([w, h])=>{ const c = box(w, h, .05, wood); c.position.set(WX(x), WY(y), back + .16); group.add(c); });
      if (k === 1){ const hole = new THREE.Mesh(new THREE.CircleGeometry(.55, 7), basic({color:0x1c1830})); hole.position.set(WX(x + .4), WY(y + .4), back + .15); group.add(hole); }
      const beam = sprite(T.glow, 3.4, 0x9fb2ff, .35); beam.position.set(WX(x), WY(y), back + .3); group.add(beam); });
    // crooked portraits
    [[18.6, 11.6, .12, 0xb88a3a], [16.5, 6.6, -.18, 0x8a6a3a]].forEach(([x, y, rz, col])=>{ const f = box(1.3, 1.6, .1, lam({color:col})); f.position.set(WX(x), WY(y), back + .1); f.rotation.z = rz; group.add(f);
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(.95, 1.25), lam({color:0x3a2c3e})); pic.position.set(0, 0, .06); f.add(pic);
      const face = new THREE.Mesh(new THREE.CircleGeometry(.25, 12), lam({color:0xb8a690})); face.position.set(0, .15, .07); f.add(face); });
    // swinging chandelier under the roof
    const ch = new THREE.Group(); ch.position.set(WX(11), WY(5), -1); group.add(ch);
    const chain = box(.05, 1.3, .05, lam({color:0x6a5a3a})); chain.position.y = -.65; ch.add(chain);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .06, 6, 16), lam({color:0x8a7444})); ring.rotation.x = Math.PI/2; ring.position.y = -1.35; ch.add(ring);
    for (let k=0;k<5;k++){ const a = k/5*Math.PI*2; const c = sprite(T.glow, .5, 0xffc070, .9); c.position.set(Math.cos(a)*.6, -1.15, Math.sin(a)*.6); ch.add(c); const ph = rr()*6; ambient.push({update(dt, t){ c.material.opacity = .65 + Math.sin(t*11 + ph)*.25; }}); }
    ambient.push({update(dt, t){ ch.rotation.z = Math.sin(t*.9)*.12; }});
    // cobwebs in the corners
    const web = basic({color:0xd8d4e0, transparent:true, opacity:.35});
    [[10.4, 5.3, 1], [20.6, 5.3, -1], [10.4, 10.3, 1]].forEach(([x, y, sd])=>{ for (let k=0;k<4;k++){ const l = new THREE.Mesh(new THREE.PlaneGeometry(1.4, .03), web); l.position.set(WX(x) + sd*.45, WY(y) - .45, back + .4); l.rotation.z = -sd*(.2 + k*.35); group.add(l); } });
    // candles on the ground floor, rubble and loose boards in front
    [[11, 15], [20.5, 15]].forEach(([x, y])=>{ const c = box(.16, .5, .16, lam({color:0xeee6d0})); c.position.set(WX(x), WY(y) + .25, -1.2); group.add(c); const fl = sprite(T.glow, .7, 0xffb050); fl.position.set(WX(x), WY(y) + .62, -1.1); group.add(fl); const ph = rr()*6; ambient.push({update(dt, t){ fl.scale.setScalar(.6 + Math.sin(t*14 + ph)*.08); }}); });
    for (let i=0;i<8;i++){ const r = box(.3 + rr()*.4, .2 + rr()*.2, .3, lam({color:[0x4a4752,0x3e2b1f][i%2]})); r.position.set(WX(8.5 + rr()*13), WY(15) + .1, 1.2 + rr()*.7); r.rotation.y = rr()*3; group.add(r); }
    const sign = textPlane('老宅', 1.8, .6, '#e9dcc0', 'rgba(40,24,18,.95)'); sign.position.set(WX(3.5), WY(17) + 1.4, -.8); sign.rotation.z = -.08; group.add(sign);
    const post = box(.15, 1.4, .15, wood); post.position.set(WX(3.5), WY(17) + .6, -.85); group.add(post);
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
    const cave = new THREE.Mesh(new THREE.CircleGeometry(.55, 12), basic({color:0x2a2622})); cave.scale.y = 1.5; cave.position.set(WX(1), WY(13.4), front); group.add(cave);
    const poolFront = new THREE.Mesh(new THREE.PlaneGeometry(26, 2.4), lam({color:0x184a66})); poolFront.position.set(WX(19), WY(18) - 2.4, 4.9); group.add(poolFront);
    for (let i=0;i<14;i++){ const sp = sprite(T.glow, .5 + rr()*.4, 0xbfe8ff, .5); sp.position.set(WX(6 + rr()*20), WY(18) - 1.1, -3 + rr()*6); group.add(sp); const ph = rr()*6; ambient.push({update(dt, t){ sp.material.opacity = .15 + Math.max(0, Math.sin(t*2 + ph))*.6; }}); }
    // rocks poking out of the pool
    const rock = lam({map:repTex(T.rock, 1, 1)});
    [[9, .9], [17, 1.2], [13, .7]].forEach(([x, r])=>{ const m = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 0), rock); m.position.set(WX(x), WY(18) - .9, -.5 + rr()); m.rotation.set(rr(), rr(), rr()); group.add(m); });
    // the river on top of the right cliff and the falling sheet of water
    const river = repTex(T.water, 2, 1), sheet = repTex(T.water, 1.5, 4), veil = repTex(T.water, 1, 3);
    const rv = new THREE.Mesh(new THREE.PlaneGeometry(6, DEPTH + 1), lam({map:river, transparent:true, opacity:.9})); rv.rotation.x = -Math.PI/2; rv.scale.x = 3; rv.position.set(WX(9.5), WY(6) + .04, -1.2); rv.scale.y = .35; group.add(rv);
    const lip = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, DEPTH + 1, 12, 1, true, Math.PI, Math.PI/2), lam({map:repTex(T.water, 1, 1), transparent:true, opacity:.9, side:THREE.DoubleSide})); lip.rotation.x = Math.PI/2; lip.position.set(WX(18.3), WY(6) - .5, -.9); lip.scale.y = .5; group.add(lip);
    const fall = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 20), lam({map:sheet, transparent:true, opacity:.88})); fall.position.set(WX(19.25), WY(6.4) - 10, -.9); group.add(fall);
    const front2 = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 20), basic({map:veil, transparent:true, opacity:.32, depthWrite:false})); front2.position.set(WX(19.25), WY(6.4) - 10, 1.4); group.add(front2);
    ambient.push({update(dt){ sheet.offset.y += dt*1.6; veil.offset.y += dt*2.3; river.offset.x -= dt*.6; }});
    // foam and mist
    let acc = 0; ambient.push({update(dt){ acc += dt; while (acc > .07){ acc -= .07;
      spawnPart({pos:[WX(18.3 + rr()*1.9), WY(17.6), -1 + rr()*2.4], vel:[(rr()-.5)*2, 1.5 + rr()*2, (rr()-.5)], life:1.4, size:.9, grow:1.6, color:0xffffff, opacity:.55});
      if (rr() < .4) spawnPart({pos:[WX(18.4 + rr()*1.6), WY(6.2), -1 + rr()*2], vel:[(rr()-.5), .3, 0], life:.8, size:.4, grow:.6, color:0xe8f8ff, opacity:.7}); } }});
    for (let i=0;i<5;i++){ const m = sprite(T.puff, 7 + rr()*4, 0xffffff, .35); m.position.set(WX(16 + rr()*7), WY(17) + rr()*2, -2 + rr()*3); group.add(m); const ph = rr()*6; ambient.push({update(dt, t){ m.material.opacity = .22 + Math.sin(t*.8 + ph)*.1; }}); }
    // dead tree holding the goal
    const bark = lam({color:0x6e5a48}), dt0 = new THREE.Group(); dt0.position.set(WX(1.6), WY(6), -.9); group.add(dt0);
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.28, .45, 4.4, 7), bark); trunk.position.y = 2.2; trunk.rotation.z = .06; dt0.add(trunk);
    [[1.2, 2.6, -.9, 2], [-1, 3.2, .8, 1.8], [.6, 4, -.5, 1.4], [-.4, 1.5, 1.1, 1.2]].forEach(([x, y, rz, l])=>{ const b = new THREE.Mesh(new THREE.CylinderGeometry(.06, .14, l, 5), bark); b.position.set(x*.6, y, 0); b.rotation.z = rz; dt0.add(b); });
    const roots = new THREE.Mesh(new THREE.ConeGeometry(.8, .5, 7), bark); roots.position.y = .2; dt0.add(roots);
    // tall grass on the cliff tops (hides what is placed in it, like the original)
    const blades = [lam({color:0x4f9a36, side:THREE.DoubleSide}), lam({color:0x6fbf4a, side:THREE.DoubleSide}), lam({color:0x3f8a2e, side:THREE.DoubleSide})];
    const tufts = (x0, x1, y)=>{ for (let x=x0; x<x1; x+=.28){ const hgt = .7 + rr()*.6, b = new THREE.Mesh(new THREE.PlaneGeometry(.22, hgt), blades[Math.floor(rr()*3)]);
      b.geometry.translate(0, hgt/2, 0); b.position.set(WX(x + rr()*.2), WY(y) - .05, .4 + rr()*1.9); b.rotation.y = (rr()-.5)*1.2; group.add(b); const ph = rr()*6; ambient.push({update(dt, t){ b.rotation.z = Math.sin(t*1.8 + ph + x*.3)*.12; }}); } };
    tufts(0, 21.5, 6);
    // roots and moss hanging under the overhang, ferns on the start ledge
    const root = lam({color:0x5a4634}), moss = lam({color:0x4a7a34});
    for (let i=0;i<12;i++){ const x = 2.5 + rr()*14, l = .5 + rr()*1.4, r = new THREE.Mesh(new THREE.CylinderGeometry(.03, .06, l, 4), i%3 ? root : moss); r.position.set(WX(x), WY(x < 17 ? 9 : 8) - l/2, .2 + rr()*1.6); group.add(r); const ph = rr()*6; ambient.push({update(dt, t){ r.rotation.z = Math.sin(t*1.3 + ph)*.08; }}); }
    for (let i=0;i<5;i++){ const f = new THREE.Mesh(new THREE.ConeGeometry(.3, .7, 5), moss); f.position.set(WX(2.3 + i*.9), WY(15) + .3, -1.2 + rr()*.6); group.add(f); }
    // moss streaks on the right cliff face
    for (let i=0;i<7;i++){ const m = new THREE.Mesh(new THREE.PlaneGeometry(.5 + rr()*.8, 1 + rr()*3), lam({color:0x4f7d38})); m.position.set(WX(.3 + rr()*1.4), WY(8 + rr()*9), front); group.add(m); }
    const sign = textPlane('瀑布', 1.8, .6, '#f4ecd8', 'rgba(70,48,30,.95)'); sign.position.set(WX(5.5), WY(15) + 1.4, -.8); sign.rotation.z = .06; group.add(sign);
    const post = box(.15, 1.4, .15, lam({color:0x5a3f2a})); post.position.set(WX(5.5), WY(15) + .6, -.85); group.add(post);
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
    scene.fog = new THREE.Fog({city:0x5b4f6a, mansion:0xe0b89a, falls:0xcfe6ee}[map.look] || 0xbcd6ea, 40, 110);
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
    if (type === 'coin'){
      const c = new THREE.Group(); c.position.set(.5, -.5, .3); g.add(c);
      const disk = new THREE.Mesh(new THREE.CylinderGeometry(.38, .38, .1, 24), lam({color:0xd9a414, emissive:0x4a3000})); disk.rotation.x = Math.PI/2; c.add(disk);
      for (const sz of [1, -1]){ const fc = new THREE.Mesh(new THREE.CircleGeometry(.38, 24), basic({map:T.coinFace})); fc.position.z = sz*.056; if (sz < 0) fc.rotation.y = Math.PI; c.add(fc); }
      const glow = sprite(T.glow, 1.4, 0xffe08a, .6); c.add(glow);
      up.update = (dt)=>{ c.rotation.y += dt*3; }; g.userData.coin = c;
    }
    // ---- the other 44 objects ----

    if (!T.swirl){
      T.swirl = canvasTex(128, 128, (g)=>{ g.clearRect(0,0,128,128); g.translate(64,64);
        for (let k=0;k<70;k++){ const a = k*.6, r = 6 + k*.8; g.strokeStyle = 'rgba(0,0,0,' + (1 - k/80) + ')'; g.lineWidth = 6 - k*.07; g.beginPath(); g.arc(0, 0, r, a, a + .9); g.stroke(); }
        g.fillStyle = '#000'; g.beginPath(); g.arc(0,0,20,0,7); g.fill(); for (let k=0;k<40;k++){ const a = rr()*7, r = 36 + rr()*26; g.fillStyle = 'rgba(0,0,0,.8)'; g.fillRect(Math.cos(a)*r, Math.sin(a)*r, 4, 1.5); } });
      T.clock = canvasTex(128, 128, (g)=>{ g.fillStyle = '#f6ecd2'; g.beginPath(); g.arc(64,64,62,0,7); g.fill(); g.strokeStyle = '#8a6a2a'; g.lineWidth = 3; g.beginPath(); g.arc(64,64,56,0,7); g.stroke();
        g.fillStyle = '#5a4a3a'; g.font = '700 22px serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; [['XII',0],['III',3],['VI',6],['IX',9]].forEach(([n,h])=>{ const a = h/12*Math.PI*2 - Math.PI/2; g.fillText(n, 64 + Math.cos(a)*40, 64 + Math.sin(a)*40); });
        for (let h=0;h<12;h++){ const a = h/12*Math.PI*2; g.fillRect(64 + Math.cos(a)*50 - 1.5, 64 + Math.sin(a)*50 - 1.5, 3, 3); } });
      T.coinFace = canvasTex(128, 128, (g)=>{ const gr = g.createRadialGradient(54,50,10,64,64,64); gr.addColorStop(0,'#ffe9a0'); gr.addColorStop(1,'#d9a414'); g.fillStyle = gr; g.beginPath(); g.arc(64,64,63,0,7); g.fill();
        g.strokeStyle = '#b8860b'; g.lineWidth = 6; g.beginPath(); g.arc(64,64,54,0,7); g.stroke(); for (let k=0;k<40;k++){ const a = k/40*Math.PI*2; g.fillStyle = '#c9961a'; g.fillRect(64 + Math.cos(a)*60 - 2, 64 + Math.sin(a)*60 - 2, 4, 4); }
        g.save(); g.translate(64,64); g.fillStyle = '#c08a10'; g.rotate(.7); g.fillRect(-6,-34,12,62); g.fillRect(-20,-40,40,16); g.rotate(-1.4); g.fillRect(-6,-30,12,60); g.beginPath(); g.arc(0,-32,13,0,7); g.fill(); g.fillStyle = '#ffe9a0'; g.fillRect(-4,-46,8,14); g.restore(); });
      T.hazard = canvasTex(64, 16, (g)=>{ g.fillStyle = '#f2c14e'; g.fillRect(0,0,64,16); g.fillStyle = '#1a1a1a'; for (let x=-16;x<64;x+=16){ g.beginPath(); g.moveTo(x,16); g.lineTo(x+8,0); g.lineTo(x+16,0); g.lineTo(x+8,16); g.fill(); } });
      T.hazard.wrapS = THREE.RepeatWrapping;
      T.straw = canvasTex(64, 64, (g)=>{ g.fillStyle = '#e8d468'; g.fillRect(0,0,64,64); for (let k=0;k<260;k++){ g.strokeStyle = ['#f6e488','#cdb84a','#f0dc78','#bfa83c'][k%4]; g.lineWidth = 1; const x = rr()*64, y = rr()*64; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 4, y + 6*rr(), x + (rr()-.5)*6, y + 12); g.stroke(); } });
      T.stoneC = canvasTex(64, 64, (g)=>{ speckle(g, 64, 64, '#c9c9cc', ['#b8b8bc','#d6d6d9','#aeaeb3'], .5); g.strokeStyle = '#7a7a80'; g.lineWidth = 2; for (let k=0;k<5;k++){ g.beginPath(); let x = rr()*64, y = rr()*64; g.moveTo(x,y); for (let j=0;j<4;j++){ x += (rr()-.5)*24; y += (rr()-.5)*24; g.lineTo(x,y); } g.stroke(); } });
    }
    const truss = (w, h, col)=>{ const tg = new THREE.Group(), tm = M(col || 0x9aa0a8), th = .09;
      for (const y of [0, -h]) { const b = box(w, th, th, tm); b.position.set(w/2, y, 0); tg.add(b); }
      for (const x of [0, w]) { const b = box(th, h, th, tm); b.position.set(x, -h/2, 0); tg.add(b); }
      const n = Math.max(1, Math.round(Math.max(w, h) / Math.min(w, h)));
      for (let k=0;k<n;k++){ const horiz = w >= h, cw = horiz ? w/n : w, chh = horiz ? h : h/n, ox = horiz ? k*cw : 0, oy = horiz ? 0 : -k*chh, len = Math.hypot(cw, chh), ang = Math.atan2(chh, cw);
        for (const sg of [1, -1]){ const dgl = box(len, th*.8, th*.8, tm); dgl.position.set(ox + cw/2, oy - chh/2, 0); dgl.rotation.z = sg*ang; tg.add(dgl); }
        if (k) { const b = box(horiz ? th : w, horiz ? h : th, th, tm); b.position.set(horiz ? ox : w/2, horiz ? -h/2 : oy, 0); tg.add(b); } }
      return tg; };
    const M = (c, o)=>lam(Object.assign({color:c}, o || {}));
    const ball = (r, mat, seg=14)=>new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg - 4)), mat);
    const cylZ = (r1, r2, h, mat, seg=16)=>{ const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat); m.rotation.x = Math.PI/2; return m; };
    const cylX = (r1, r2, h, mat, seg=16)=>{ const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat); m.rotation.z = Math.PI/2; return m; };
    const spikesRow = (n, x0, y, len, mat, dirY=-1)=>{ for (let k=0;k<n;k++){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.12, len, 4), mat); if (dirY > 0) sp.rotation.z = Math.PI; at2(sp, x0 + k*(1/n) + .5/n, y + dirY*len/2, 0); } };
    const movingPlat = (w, color, mark)=>{ const p = new THREE.Group(); g.add(p);
      const body = rbox(w - .04, .86, 1.8, .12, M(color)); body.position.set(w/2, -.52, 0); p.add(body);
      const top = rbox(w, .16, 1.86, .06, M(0xf8f4ea)); top.position.set(w/2, -.08, 0); p.add(top);
      const band = box(w - .1, .1, 1.82, M(0x2a2a2e)); band.position.set(w/2, -.86, 0); p.add(band);
      for (const x of [.18, w - .18]) for (const z of [.6, -.6]){ const rv = ball(.05, M(0xdfe3e8), 6); rv.position.set(x, -.5, .91 + 0*z); p.add(rv); }
      // painted arrows say how it moves
      const arM = basic({color:0xffffff}), arrow = (x, y, rot)=>{ const a = new THREE.Mesh(new THREE.ConeGeometry(.14, .26, 3), arM); a.rotation.z = rot; a.position.set(x, y, .92); p.add(a); };
      const cx = w/2;
      if (mark === 'h'){ arrow(cx - .45, -.5, Math.PI/2); arrow(cx + .45, -.5, -Math.PI/2); const ln = box(.6, .05, .02, arM); ln.position.set(cx, -.5, .92); p.add(ln); }
      else if (mark === 'v'){ arrow(cx - .3, -.33, 0); arrow(cx + .3, -.66, Math.PI); const l1 = box(.05, .3, .02, arM); l1.position.set(cx - .3, -.55, .92); p.add(l1); const l2 = box(.05, .3, .02, arM); l2.position.set(cx + .3, -.45, .92); p.add(l2); }
      else if (mark === 'c'){ const rg = new THREE.Mesh(new THREE.TorusGeometry(.24, .04, 4, 20, Math.PI*1.5), arM); rg.position.set(cx, -.5, .92); p.add(rg); arrow(cx + .24, -.5, Math.PI); }
      return p; };
    switch (type){
      case 'hay': { const hm = lam({map:repTex(T.straw, 1, 1)}); const roll = cylZ(.98, .98, 1.9, hm, 24); roll.rotation.x = 0; roll.rotation.z = Math.PI/2; roll.scale.set(1, 1, 1); at2(roll, 1, 1);
        for (const x of [.04, 1.96]){ const end = new THREE.Mesh(new THREE.CircleGeometry(.98, 24), lam({map:repTex(T.straw, .6, .6)})); end.rotation.y = x < 1 ? -Math.PI/2 : Math.PI/2; at2(end, x, 1); }
        for (let k=0;k<6;k++){ const sw = box(.04, .28, .04, M(0xf0dc78)); sw.rotation.z = (rr()-.5)*1.4; at2(sw, .2 + rr()*1.6, -.02, (rr()-.5)*1.4); } break; }
      case 'wire': { const wm = M(0x8a8d94); const post = M(0x5a4a3a); [.12, 1.88].forEach(x=>at2(box(.1, .9, .1, post), x, .55));
        for (let k=0;k<26;k++){ const t_ = new THREE.Mesh(new THREE.TorusGeometry(.18 + rr()*.16, .022, 4, 12), wm); t_.rotation.set(rr()*3, rr()*3, rr()*3); at2(t_, .2 + rr()*1.6, .45 + rr()*.35, (rr()-.5)*.9); }
        for (let k=0;k<14;k++){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.04, .16, 4), M(0xd8dde4)); sp.rotation.set(rr()*3, rr()*3, rr()*3); at2(sp, .15 + rr()*1.7, .35 + rr()*.5, (rr()-.5)*.9); } break; }
      case 'saw': { at2(box(1, 1, 1.2, lam({map:repTex(T.crate, 1, 1)})), 1.5, 1.5); at2(cylZ(.18, .18, 1.4, M(0x8a8d94), 10), 1.5, 1.5);
        const arm = new THREE.Group(); arm.position.set(1.5, -1.5, .75); g.add(arm); g.userData.sawArm = arm;
        const bar = box(1.1, .2, .1, M(0x8a6a4a)); bar.geometry.translate(.55, 0, 0); arm.add(bar);
        const disc = new THREE.Group(); disc.position.x = 1.0; arm.add(disc); g.userData.sawDisc = disc;
        disc.add(cylZ(.38, .38, .05, M(0xc8ccd3), 20)); for (let k=0;k<12;k++){ const a = k/12*Math.PI*2, tooth = new THREE.Mesh(new THREE.ConeGeometry(.07, .18, 3), M(0xe8ebef)); tooth.position.set(Math.cos(a)*.42, Math.sin(a)*.42, 0); tooth.rotation.z = a - Math.PI/2 + .5; disc.add(tooth); }
        disc.add(cylZ(.08, .08, .08, M(0x55585e), 8)); break; }
      case 'bomb': { const s_ = ball(.4, M(0x4a4a50), 16); at2(s_, .48, .58); at2(cylZ(.1, .12, .14, M(0x55585e), 10), .62, .2, 0).rotation.set(0, 0, -.6);
        const fz = new THREE.Mesh(new THREE.TorusGeometry(.16, .02, 4, 10, Math.PI*.8), M(0x2a2a2a)); at2(fz, .82, .05); const sp = sprite(T.glow, .55, 0xfff060); sp.position.set(.98, .05, 0); g.add(sp);
        up.update = ()=>{ sp.material.opacity = .5 + Math.random()*.5; sp.scale.setScalar(.45 + Math.random()*.2); }; break; }
      case 'crossbow': { const body = new THREE.Group(); body.position.set(.5, -.5, 0); g.add(body); g.userData.gun = body;
        const base = box(.22, .9, .7, M(0x8a8d94)); base.position.x = -.36; body.add(base); const foot = box(.32, .14, .9, M(0x6a6d74)); foot.position.x = -.45; body.add(foot);
        const stock = box(.8, .16, .16, M(0x5a3a22)); stock.position.x = .05; body.add(stock);
        const arm = new THREE.Mesh(new THREE.TorusGeometry(.62, .05, 6, 20, Math.PI*.8), M(0x8a8d94)); arm.rotation.z = -Math.PI*.4; arm.position.x = -.1; arm.scale.x = .55; body.add(arm);
        const strg = box(.02, .94, .02, M(0xeeeeee)); strg.position.x = -.12; body.add(strg);
        const bolt = box(.8, .06, .06, M(0xe0602a)); bolt.position.set(.1, .1, .08); body.add(bolt); const tip = new THREE.Mesh(new THREE.ConeGeometry(.08, .2, 4), M(0xe0602a)); tip.rotation.z = -Math.PI/2; tip.position.set(.58, .1, .08); body.add(tip); break; }
      case 'hockey': { const body = new THREE.Group(); body.position.set(.5, -.5, 0); g.add(body); g.userData.gun = body;
        const base = box(.8, .22, .8, M(0x3d7fe0)); base.position.y = -.38; body.add(base);
        const net = box(.6, .5, .6, new THREE.MeshLambertMaterial({color:0xffffff, transparent:true, opacity:.75})); net.position.y = -.02; body.add(net);
        for (const x of [-.3, .3]) for (const z of [-.3, .3]){ const pst = box(.06, .55, .06, M(0xd93a2e)); pst.position.set(x, -.02, z); body.add(pst); }
        const top = cylZ(.2, .24, .18, M(0x2a2a2e), 12); top.rotation.x = 0; top.position.y = .32; body.add(top); const siren = new THREE.Mesh(new THREE.SphereGeometry(.18, 12, 8, 0, Math.PI*2, 0, Math.PI/2), M(0xe0302a, {emissive:0x801010})); siren.position.y = .41; body.add(siren); g.userData.siren = siren;
        const pk = cylZ(.2, .2, .08, M(0x111114), 14); pk.rotation.x = 0; pk.position.set(0, -.22, 0); body.add(pk);
        const stick = box(.05, .85, .05, M(0x6e4a28)); stick.position.set(-.35, 0, .38); stick.rotation.z = -.5; body.add(stick); const blade = box(.3, .08, .06, M(0x2a2a2e)); blade.position.set(-.55, -.38, .38); body.add(blade);
        const mz = cylX(.16, .18, .25, M(0x3a3d44), 12); mz.position.set(.45, -.22, 0); body.add(mz); break; }
      case 'plane': { const body = new THREE.Group(); body.position.set(.5, -.5, 0); g.add(body); g.userData.gun = body;
        const bx = box(.7, .75, .8, M(0xe8e0c8)); body.add(bx); const pn = box(.5, .3, .05, M(0x3a6ab0)); pn.position.set(0, .12, .42); body.add(pn);
        for (const [x, y] of [[-.22, -.22], [.18, -.25]]){ const gr = cylZ(.14, .14, .1, M(0xb8bcc4), 10); gr.position.set(x, y, .45); body.add(gr); for (let k=0;k<6;k++){ const tt = box(.07, .07, .1, M(0x9aa0a8)); const a = k/6*Math.PI*2; tt.position.set(x + Math.cos(a)*.16, y + Math.sin(a)*.16, .45); body.add(tt); } }
        const lamp = sprite(T.glow, .3, 0xffc040); lamp.position.set(-.25, .32, .45); body.add(lamp); const ant = box(.03, .3, .03, M(0x55585e)); ant.position.set(.2, .5, 0); body.add(ant);
        const mz = cylX(.13, .16, .3, M(0x55585e), 12); mz.position.set(.48, -.05, 0); body.add(mz);
        const shp = new THREE.Shape(); shp.moveTo(.4, 0); shp.lineTo(-.3, .22); shp.lineTo(-.18, 0); shp.lineTo(-.3, -.22); shp.lineTo(.4, 0); const pp = new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshLambertMaterial({color:0xf8f4ea, side:THREE.DoubleSide})); pp.rotation.x = -1.3; pp.position.set(0, .48, 0); body.add(pp); g.userData.toy = pp; break; }
      case 'wood1': at2(box(.98, .98, 2, lam({map:T.crate})), .5, .5); break;
      case 'stairs': { const wm = lam({map:repTex(T.wood, .5, .4)}), tm = M(0xe8c890);
        for (let k=0;k<3;k++){ const h = k + 1; at2(box(1, h, 1.8, wm), .5 + k, 3 - h/2); at2(box(1.06, .14, 1.86, tm), .5 + k, 3 - h + .07); at2(box(1.02, .04, 1.82, M(0x8a5a30)), .5 + k, 3 - h + .16); }
        const rail = box(3.3, .08, .08, M(0x8a5a30)); rail.rotation.z = Math.atan2(2, 2.2); at2(rail, 1.5, .5, .85); for (const k of [0, 1, 2]) at2(box(.06, .7, .06, M(0x8a5a30)), .6 + k, 1.65 - k, .85); break; }
      case 'girder': { for (const [cx, cy] of d.cells){ const t1 = truss(1, 1, 0x8a8d94); t1.position.set(cx, -cy, .4); g.add(t1); const t2 = truss(1, 1, 0x8a8d94); t2.position.set(cx, -cy, -.4); g.add(t2); }
        break; }
      case 'scaffold': { const t1 = truss(2.2, .6, 0x5a5d64); t1.position.set(.4, -.05, .7); g.add(t1); const t2 = truss(2.2, .6, 0x5a5d64); t2.position.set(.4, -.05, -.7); g.add(t2);
        for (const x of [.2, 2.8]) at2(box(.4, .64, 1.6, M(0xf4f4f4)), x, .35); at2(box(3, .08, 1.6, M(0x8a8d94)), 1.5, .04); break; }
      case 'ice': { const im = new THREE.MeshPhongMaterial({color:0xbfeaf8, emissive:0x2a5a70, shininess:120, specular:0xffffff, transparent:true, opacity:.9});
        at2(box(3, .42, 1.8, im), 1.5, .22); for (let k=0;k<14;k++){ const len = .2 + ((k*37)%7)/10; const ic = new THREE.Mesh(new THREE.ConeGeometry(.1, len, 5), im); ic.rotation.z = Math.PI; at2(ic, .1 + k*.21, .43 + len/2, ((k*5)%3 - 1)*.5); }
        for (let k=0;k<3;k++){ const sh = box(.5, .05, .04, basic({color:0xffffff})); sh.rotation.z = .5; at2(sh, .5 + k*.9, .18, .92); } break; }
      case 'tire': { const fm = lam({map:repTex(T.wood, .5, .3)}); for (const [x, y, w, h] of [[1, .07, 2, .14], [1, .93, 2, .14], [.07, .5, .14, 1], [1.93, .5, .14, 1]]) at2(box(w, h, 1.4, fm), x, y);
        at2(box(1.8, .8, 1.2, M(0x2a2a2e)), 1, .5, -.1); const tr = new THREE.Group(); tr.position.set(1, -.5, .62); g.add(tr); g.userData.squash = tr;
        const tire = new THREE.Mesh(new THREE.TorusGeometry(.3, .14, 10, 24), M(0x1e1e22)); tire.scale.x = 2.2; tr.add(tire); const rim_ = cylZ(.24, .24, .2, M(0x8a8d94), 18); rim_.scale.x = 2.2; tr.add(rim_);
        for (let k=0;k<5;k++){ const sp = box(.05, .3, .05, M(0x55585e)); sp.rotation.z = k/5*Math.PI*2; sp.position.z = .12; sp.scale.x = 1; tr.add(sp); } break; }
      case 'crumble': { const c = new THREE.Group(); g.add(c); g.userData.chunks = c; const rk = lam({map:T.stoneC});
        [[.25,.27,.5,.54],[.75,.22,.5,.44],[.24,.76,.48,.48],[.74,.72,.52,.56]].forEach(([x,y,w,h],k)=>{ const q = box(w - .04, h - .04, 1.8 - k*.05, rk); q.position.set(x, -y, 0); q.rotation.z = (k - 1.5)*.03; c.add(q); });
        break; }
      case 'fallblock': { const b = box(2, .96, 1.9, lam({map:repTex(T.metal, 1, .5)})); at2(b, 1, .5);
        for (let k=0;k<5;k++){ const st = box(.22, .14, 1.94, M(k%2 ? 0x222226 : 0xf2c14e)); st.rotation.z = .6; at2(st, .25 + k*.38, .1); }
        at2(box(2.04, .06, 1.94, M(0x2a2a2e)), 1, .2); for (const x of [.15, 1.85]) for (const y of [.4, .82]) at2(ball(.06, M(0xc9ccd2), 6), x, y, .96);
        const ar = new THREE.Mesh(new THREE.ConeGeometry(.2, .3, 3), basic({color:0xf2c14e})); ar.rotation.z = Math.PI; at2(ar, 1, .6, .97); break; }
      case 'flipblock': { const f = new THREE.Group(); f.position.set(.5, -.5, 0); g.add(f); g.userData.flip = f;
        const b = box(.96, .7, 1.5, M(0x2a5a8a)); b.position.y = -.08; f.add(b); for (const y of [-.4, .25]){ const bar = box(.98, .1, 1.52, M(0x6a8aaa)); bar.position.y = y; f.add(bar); }
        for (const sg of [-1, 1]){ const c = box(.3, .08, .04, basic({color:0xf2c14e})); c.position.set(sg*.15 - .0, -.08 + .07, .77); c.rotation.z = sg*.6; f.add(c); const c2 = c.clone(); c2.position.y = -.08 - .07; c2.rotation.z = -sg*.6; f.add(c2); }
        for (let k=0;k<4;k++) for (const z of [-.45, .45]){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.1, .36, 4), M(0xc9ccd2)); sp.position.set(-.36 + k*.24, .48, z); f.add(sp); }
        const ax = cylZ(.08, .08, 1.6, M(0x2a2a2e), 10); ax.position.y = -.08; f.add(ax); break; }
      case 'trigspike': { at2(box(.98, .34, 1.6, lam({map:repTex(T.hazard, 1, 1)})), .5, .82); at2(box(.98, .5, 1.6, M(0x8a8d94)), .5, .4); for (let k=0;k<4;k++) at2(box(.18, .06, 1.62, M(0x55585e)), .14 + k*.24, .3);
        const s = new THREE.Group(); g.add(s); g.userData.spk = s; s.position.set(.5, 0, 0);
        for (const z of [-.5, 0, .5]) for (let k=0;k<4;k++){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.1, .5, 4), M(0xdfe3e8)); sp.position.set(-.36 + k*.24, -.2, z); s.add(sp); } break; }
      case 'blueplat': g.userData.mover = movingPlat(3, 0x3d7fe0, 'h'); break;
      case 'redplat': g.userData.mover = movingPlat(2, 0xe0483d, 'v'); break;
      case 'purpleplat': g.userData.mover = movingPlat(2, 0x9a55d8, 'c'); break;
      case 'dancer': { const pm = movingPlat(2, 0x2a2a3e); const tiles = []; for (let k=0;k<4;k++){ const tl = box(.44, .06, 1.6, basic({color:[0xff6fb1, 0x6ad0ff, 0xf2c14e, 0x5fd36a][k]})); at2(tl, .28 + k*.48, -.02, 0); tiles.push(tl); } g.userData.tiles = tiles;
        const ball_ = ball(.22, new THREE.MeshPhongMaterial({color:0xdfe3e8, shininess:120, specular:0xffffff}), 12); at2(ball_, 1, -.9); at2(box(.02, .6, .02, M(0x888888)), 1, -.4); g.userData.disco = ball_; break; }
      case 'fanplat': { const pm = new THREE.Group(); g.add(pm); g.userData.mover = pm;
        const top = box(3, .2, 1.8, M(0x8a8d94)); top.position.set(1.5, -.1, 0); pm.add(top); const wd = box(2.8, .45, 1.6, lam({map:repTex(T.wood, 1, .5)})); wd.position.set(1.5, -.42, 0); pm.add(wd);
        const fans = []; const hs = ball(.26, M(0xb8bcc4), 12); hs.scale.y = .8; hs.position.set(1.5, -.82, 0); pm.add(hs);
        const f = new THREE.Group(); f.position.set(1.5, -1.0, 0); pm.add(f); for (let k=0;k<2;k++){ const bl = ball(.2, M(0xc9ccd2), 10); bl.scale.set(3, .35, 1); bl.geometry.translate(.0, 0, 0); bl.position.x = k ? .48 : -.48; f.add(bl); } fans.push(f); g.userData.fans = fans; break; }
      case 'ferris': { const rim = new THREE.Group(); rim.position.set(2.5, -2.5, -.3); g.add(rim); g.userData.rim = rim;
        for (const a of [Math.PI/4, -Math.PI/4]){ const arm = truss(2.9*2, .32, 0x7a7d84); arm.position.set(-2.9, .16, 0); const hold = new THREE.Group(); hold.rotation.z = a; hold.add(arm); rim.add(hold); }
        at2(cylZ(.3, .3, .8, M(0x55585e), 12), 2.5, 2.5); break; }
      case 'gear': { const gr = new THREE.Group(); gr.position.set(1.5, -1.5, 0); g.add(gr); g.userData.spin = gr;
        const disc = cylZ(1.15, 1.15, 1.4, M(0x9a9da4), 28); gr.add(disc); for (let k=0;k<12;k++){ const tt = box(.38, .34, 1.4, M(0x8a8d94)); const a = k/12*Math.PI*2; tt.position.set(Math.cos(a)*1.25, Math.sin(a)*1.25, 0); tt.rotation.z = a; gr.add(tt); }
        const inner = cylZ(.7, .7, 1.44, M(0x6a6d74), 24); gr.add(inner);
        const chev = new THREE.Group(); chev.position.z = .74; gr.add(chev); for (const sg of [1, -1]){ const c = box(.5, .14, .04, basic({color:0xf2c14e})); c.position.set(.05, sg*.15, 0); c.rotation.z = -sg*.7; chev.add(c); } break; }
      case 'treadmill': { const belt = new THREE.Group(); g.add(belt); g.userData.belt = belt;
        for (let k=0;k<14;k++){ const sg = box(.18, .1, 1.6, M(0x2a2a2e)); sg.position.set(k*.3, -.06, 0); belt.add(sg); } at2(box(2.6, .08, 1.5, M(0x3a3a40)), 1.5, .94);
        for (const x of [.5, 1.5, 2.5]){ const wh = cylZ(.42, .42, 1.5, M(0x4a4d55), 18); at2(wh, x, .5); const hub = cylZ(.2, .2, 1.56, M(0x8a8d94), 10); at2(hub, x, .5); }
        for (const x of [.08, 2.92]){ const end = cylZ(.48, .48, 1.62, M(0x2a2a2e), 18); at2(end, x === .08 ? .5 : 2.5, .5, -.01).scale.set(1.04, 1.04, 1); }
        break; }
      case 'barrel': { const b = new THREE.Group(); b.position.set(1, -1, 0); g.add(b); g.userData.roll = b;
        const bm = new THREE.MeshPhongMaterial({color:0x4a7aa0, shininess:60, specular:0xdfe8f0}); const body = cylZ(.98, .98, 1.7, bm, 26); b.add(body);
        for (const r0 of [.98, .62]){ const hoop = new THREE.Mesh(new THREE.TorusGeometry(r0, .045, 5, 28), M(0x5a7a98)); hoop.position.z = .86; b.add(hoop); }
        const lid = cylZ(.2, .2, 1.74, M(0x5a7a98), 12); lid.position.set(.5, .3, 0); b.add(lid); const hl = box(1.2, .1, .02, basic({color:0xdfeaf4, transparent:true, opacity:.6})); hl.position.set(-.1, .55, .87); hl.rotation.z = .3; b.add(hl); break; }
      case 'door': case 'onewaydoor': { at2(box(1, .3, 1.7, M(0x55585e)), .5, .15); at2(box(.3, .45, .3, M(0x3a8ac0)), .2, -.1, .4); at2(cylZ(.08, .08, 1.8, M(0x2a2a2e), 8), .8, .2);
        const dm = new THREE.Group(); g.add(dm); g.userData.door = dm;
        const slab = box(.9, 2.66, 1.4, M(0xe0c8a8)); slab.position.set(.5, -1.63, 0); dm.add(slab); for (const y of [-1.1, -2.3]){ const pn = box(.6, .8, 1.44, M(0xd0b494)); pn.position.set(.5, y, 0); dm.add(pn); }
        const knob = ball(.07, M(0x8a8d94)); knob.position.set(.86, -1.75, .45); dm.add(knob); const hinge = box(.08, .3, .3, M(0x8a8d94)); hinge.position.set(.06, -.6, .5); dm.add(hinge);
        if (type === 'onewaydoor'){ for (const y of [-1.1, -2.3]){ const ar = new THREE.Mesh(new THREE.ConeGeometry(.2, .36, 3), basic({color:0x5fd36a})); ar.rotation.z = -Math.PI/2; ar.position.set(.55, y, .73); dm.add(ar); } } break; }
      case 'teleporter': { const fr = new THREE.Mesh(new THREE.TorusGeometry(.5, .1, 6, 4), M(0x9aa0a8)); fr.rotation.z = Math.PI/4; fr.scale.set(.85, 1.75, 1); at2(fr, .5, .95, .1);
        const core = sprite(T.glow, 1.6, 0x7ad8ff, .7); core.scale.set(.9, 1.7, 1); at2(core, .5, .95, .1); g.userData.spinS = core;
        for (const [col, dx] of [[0x30a0ff, -.5], [0xe040c0, .48], [0x40d070, -.42]]){ const wr = box(.03, 1.6, .03, basic({color:col})); at2(wr, .5 + dx, .95, .3); }
        at2(box(.9, .16, .8, M(0x55585e)), .5, 1.9); const ant = box(.03, .3, .03, M(0x6ad0ff)); at2(ant, .45, -.1, .2); break; }
      case 'spring': { at2(box(.96, .14, .96, M(0x8a8d94)), .5, .93); const sp = new THREE.Group(); sp.position.set(.5, -.86, 0); g.add(sp); g.userData.pop = sp;
        for (let k=0;k<5;k++){ const c = new THREE.Mesh(new THREE.TorusGeometry(.28, .05, 6, 16), M(0xd8dce2)); c.rotation.x = Math.PI/2 - .15; c.position.y = .1 + k*.11; sp.add(c); }
        const pad = box(1, .14, .98, lam({map:repTex(T.wood, .4, .3)})); pad.position.y = .68; sp.add(pad); break; }
      case 'fan': { const cm = M(0x8a3a3a); const cage = new THREE.Group(); cage.position.set(1, -.5, 0); g.add(cage);
        for (const x of [-.95, -.5, 0, .5, .95]){ const rg = new THREE.Mesh(new THREE.TorusGeometry(.42, .025, 4, 24), cm); rg.rotation.y = Math.PI/2; rg.position.x = x; rg.scale.set(1, 1, 1.8); cage.add(rg); }
        for (let k=0;k<6;k++){ const a = k/6*Math.PI*2, bar = box(1.95, .03, .03, cm); bar.position.set(0, Math.sin(a)*.42, Math.cos(a)*.76); cage.add(bar); }
        const f = new THREE.Group(); f.position.set(1, -.5, 0); g.add(f); g.userData.spinX = f; for (let k=0;k<3;k++){ const bl = ball(.18, M(0x2a5ac0), 10); bl.scale.set(.25, 1.6, 1); bl.rotation.x = k*Math.PI*2/3; f.add(bl); }
        at2(box(2, .1, 1, M(0x55585e)), 1, .97);
        const air = []; for (let k=0;k<8;k++){ const st = box(.05, .7, .05, basic({color:0xffffff, transparent:true, opacity:.4})); st.position.set(.2 + (k%4)*.53, 0, -.4 + (k>>2)*.8); g.add(st); air.push(st); } g.userData.air = air; break; }
      case 'hydrant': { const red = M(0xd02a22); at2(cylZ(.22, .26, .55, red, 14), .5, .66).rotation.x = 0; at2(cylZ(.3, .3, .08, red, 14), .5, .38).rotation.x = 0;
        at2(new THREE.Mesh(new THREE.SphereGeometry(.22, 14, 8, 0, Math.PI*2, 0, Math.PI/2), red), .5, .34); at2(cylZ(.06, .06, .1, red, 8), .5, .1).rotation.x = 0;
        for (const sx of [-1, 1]) at2(cylX(.09, .09, .18, M(0xa01a14), 10), .5 + sx*.28, .6); at2(cylZ(.32, .34, .07, red, 14), .5, .96).rotation.x = 0;
        const jet = new THREE.Group(); jet.visible = false; g.add(jet); g.userData.jet = jet; for (let k=0;k<10;k++){ const s = sprite(T.puff, .5 + k*.06, 0x4aa0ff, .85); s.position.set(.5, k*.5 + .3, .3); jet.add(s); }
        const drop = sprite(T.glow, .5, 0x4aa0ff, .8); at2(drop, .5, -.15); break; }
      case 'magnet': { const t1 = truss(3, .9, 0x8a8d94); t1.position.set(0, -.05, .7); g.add(t1); const t2 = truss(3, .9, 0x8a8d94); t2.position.set(0, -.05, -.7); g.add(t2);
        at2(box(3, .12, 1.5, lam({map:repTex(T.wood, 1, .3)})), 1.5, .06); for (const x of [.06, 2.94]) at2(box(.12, .9, 1.5, M(0xdfe3e8)), x, .5);
        const u = new THREE.Group(); u.position.set(1.5, .05, 0); g.add(u); const arc = new THREE.Mesh(new THREE.TorusGeometry(.3, .12, 10, 20, Math.PI), M(0xd93a2e)); arc.position.y = .35; u.add(arc);
        for (const sx of [-1, 1]){ const leg = box(.24, .25, .24, M(0xd93a2e)); leg.position.set(sx*.3, .22, 0); u.add(leg); const tip = box(.25, .12, .25, M(0xe8ebef)); tip.position.set(sx*.3, .04, 0); u.add(tip); }
        const waves = []; for (let k=0;k<3;k++){ const wv = new THREE.Mesh(new THREE.TorusGeometry(.8 + k*.5, .03, 4, 24, Math.PI), basic({color:0xb37aff, transparent:true, opacity:.5})); wv.position.set(1.5, .2, .9); g.add(wv); waves.push(wv); } g.userData.waves = waves; break; }
      case 'blackhole': { const halo = sprite(T.glow, 2.6, 0x6a4a90, .35); at2(halo, 1, 1, -.1);
        const sw = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), basic({map:T.swirl, transparent:true, depthWrite:false})); const sg = new THREE.Group(); sg.position.set(1, -1, .3); sg.add(sw); g.add(sg); g.userData.spin = sg;
        const sw2 = sw.clone(); sw2.scale.setScalar(.6); sw2.position.z = .02; sw2.rotation.z = 1; sg.add(sw2); break; }
      case 'honey': { const hm = new THREE.MeshPhongMaterial({color:0xe8b020, emissive:0x5a3a00, shininess:100, specular:0xfff4c0});
        const slab = rbox(1.02, .3, 1.7, .12, hm); at2(slab, .5, .16);
        [[.12,.42,.08],[.4,.3,.06],[.62,.5,.09],[.86,.36,.06]].forEach(([x,len,r],k)=>{ const dr = new THREE.Mesh(new THREE.CylinderGeometry(r*.8, r, len, 8), hm); at2(dr, x, .3 + len/2, .84); const tipb = ball(r*1.25, hm, 8); at2(tipb, x, .3 + len, .84); if (k === 2) g.userData.drip = tipb; });
        break; }
      case 'slowatch': { at2(cylZ(.44, .44, .18, new THREE.MeshPhongMaterial({color:0xd8a030, shininess:90, specular:0xfff0c0}), 24), .5, .55);
        const face = new THREE.Mesh(new THREE.CircleGeometry(.37, 24), basic({map:T.clock})); at2(face, .5, .55, .1);
        at2(cylZ(.06, .06, .14, M(0xd8a030), 8), .5, .06).rotation.x = 0; const ring = new THREE.Mesh(new THREE.TorusGeometry(.1, .03, 6, 12), M(0xd8a030)); at2(ring, .5, -.06);
        const hand = box(.03, .28, .02, basic({color:0xc02a2a})); hand.geometry.translate(0, .12, 0); at2(hand, .5, .55, .13); g.userData.hand = hand; const aura = sprite(T.glow, 9, 0x9ad0ff, .15); at2(aura, .5, .5, -.5); break; }
      case 'jetpack': { const jp = new THREE.Group(); jp.position.set(.5, -.5, 0); g.add(jp); g.userData.pick = jp;
        for (const x of [-.17, .17]){ const tk = cylZ(.15, .15, .55, M(0x5ab0e0), 12); tk.rotation.x = 0; tk.position.x = x; jp.add(tk); const cap = ball(.15, M(0x5ab0e0), 10); cap.position.set(x, .27, 0); jp.add(cap); const nz = new THREE.Mesh(new THREE.ConeGeometry(.12, .16, 10), M(0x55585e)); nz.rotation.z = Math.PI; nz.position.set(x, -.34, 0); jp.add(nz);
          const fl = sprite(T.glow, .45, 0xffc040, .9); fl.position.set(x, -.5, 0); jp.add(fl); }
        const st = box(.5, .12, .22, M(0x8a5a2a)); st.position.y = .08; jp.add(st); break; }
      case 'jetdisp': { const cm = lam({map:T.crate}); cm.color = new THREE.Color(0xc89060); at2(box(.96, .9, 1.4, cm), .5, 1.52);
        at2(box(.86, .9, 1.2, new THREE.MeshPhongMaterial({color:0xbfe8ff, transparent:true, opacity:.45, shininess:90})), .5, .6);
        const tk = cylZ(.14, .14, .5, M(0x5ab0e0), 10); tk.rotation.x = 0; at2(tk, .38, .6); const tk2 = tk.clone(); at2(tk2, .62, .6);
        const nz = new THREE.Mesh(new THREE.ConeGeometry(.1, .14, 8), M(0x55585e)); nz.rotation.z = Math.PI; at2(nz, .38, .9); const nz2 = nz.clone(); at2(nz2, .62, .9);
        at2(box(.96, .08, 1.24, M(0x9aa0a8)), .5, .12); const lamp = sprite(T.glow, .5, 0x5fd36a); at2(lamp, .8, 1.3, .75); g.userData.blink = lamp; break; }
      case 'linsaw': { at2(box(5, .55, .5, M(0x6a6d74)), 2.5, .5, -.3); for (let k=0;k<6;k++) at2(box(.4, .07, .02, M(0xf2c14e)), .45 + k*.82, .5, -.04);
        for (const y of [.25, .75]) at2(box(5, .05, .52, M(0x4a4d55)), 2.5, y, -.3);
        const pv = new THREE.Group(); pv.position.set(2.5, -.5, .4); g.add(pv); pv.userData.preview = true; g.userData.prev = pv;
        const pl = cylZ(.75, .75, .06, M(0xc8ccd3), 24); pv.add(pl); for (let k=0;k<14;k++){ const a = k/14*Math.PI*2, th = new THREE.Mesh(new THREE.ConeGeometry(.1, .25, 3), M(0xe8ebef)); th.position.set(Math.cos(a)*.82, Math.sin(a)*.82, 0); th.rotation.z = a - Math.PI/2 + .5; pv.add(th); } pv.add(cylZ(.15, .15, .12, M(0x55585e), 10)); break; }
      case 'spikeball': { at2(ball(.3, M(0x8a8d94), 12), .5, .5); const cols = [0xbfe8f0, 0xf0c0d8, 0xf8f0a0, 0xd8f0f8];
        for (let k=0;k<16;k++){ const sp = new THREE.Mesh(new THREE.ConeGeometry(.1, .38, 4), new THREE.MeshPhongMaterial({color:cols[k%4], shininess:80, specular:0xffffff})); const a = k/16*Math.PI*2, b = ((k*7)%5 - 2)*.35;
          sp.position.set(.5 + Math.cos(a)*.38*Math.cos(b), -.5 + Math.sin(a)*.38*Math.cos(b), Math.sin(b)*.38); sp.rotation.z = a - Math.PI/2; sp.rotation.x = b; g.add(sp); } break; }
      case 'wrecking': { at2(box(.7, .5, .7, M(0xf2c14e)), 2.5, .3); at2(cylZ(.12, .12, .8, M(0x55585e), 10), 2.5, .5);
        const pv = new THREE.Group(); g.add(pv); pv.userData.preview = true; g.userData.prev = pv;
        const ch = box(.06, 2.2, .06, M(0x2a4a90)); ch.position.set(2.5 + .6, -1.6, .4); ch.rotation.z = .28; pv.add(ch); const bb = ball(.8, M(0xc0342a), 18); bb.position.set(2.5 + 1.25, -3.1, .4); pv.add(bb); break; }
      case 'flame': { at2(rbox(.9, .66, 1.1, .1, lam({map:repTex(T.metal, .5, .5)})), .45, .5);
        const tank = cylX(.26, .26, .7, M(0xd93a2e), 14); at2(tank, .4, .5, .4); for (const x of [.15, .65]){ const bd = cylX(.27, .27, .05, M(0x2a2a2e), 14); at2(bd, x, .5, .4); }
        at2(cylX(.12, .2, .35, M(0x3a3d44), 12), .98, .5); const pilot = sprite(T.glow, .35, 0x6ab0ff); at2(pilot, 1.18, .5, .1); g.userData.pilot = pilot;
        const fl = new THREE.Group(); g.add(fl); g.userData.flame = fl; for (let k=0;k<9;k++){ const s = sprite(T.glow, .7 + k*.12, [0xffe08a, 0xff9a3a, 0xff5a2a][k%3], .9); s.position.set(1.3 + k*.38, -.5, .3); fl.add(s); } break; }
      case 'beehive': { const hv = new THREE.Group(); hv.position.set(.5, -.55, 0); g.add(hv); g.userData.hive = hv;
        for (let k=0;k<5;k++){ const r0 = [.24, .4, .46, .4, .26][k]; const rg = new THREE.Mesh(new THREE.TorusGeometry(r0, .1, 8, 18), M(k%2 ? 0xd99a2a : 0xf0be4e)); rg.rotation.x = Math.PI/2; rg.position.y = .36 - k*.18; hv.add(rg); const core = cylZ(r0, r0, .14, M(0xe0aa3a), 18); core.rotation.x = 0; core.position.y = .36 - k*.18; hv.add(core); }
        const hole = new THREE.Mesh(new THREE.CircleGeometry(.12, 12), basic({color:0x2a1a08})); hole.position.set(0, -.12, .48); hv.add(hole);
        at2(box(.06, .3, .06, M(0x6e4a28)), .5, -.02); break; }
      case 'cannon': case 'tennis': {
        const col = {cannon:0x2a2a2e, crossbow:0x8a5a2a, hockey:0x3d7fe0, tennis:0x4fae5a, plane:0x6a8ad8}[type], body = new THREE.Group(); body.position.set(.5, -.5, 0); g.add(body); g.userData.gun = body;
        if (type === 'cannon'){ const brl = cylX(.26, .36, .95, M(col), 16); brl.position.set(.08, .05, 0); body.add(brl); const lip = cylX(.3, .3, .1, M(0x3a3a40), 16); lip.position.set(.55, .05, 0); body.add(lip); const bk = ball(.3, M(col), 12); bk.position.x = -.36; body.add(bk);
          for (const z of [-.42, .42]){ const wh = cylZ(.28, .28, .1, M(0x8a5a2a), 12); wh.position.set(-.05, -.25, z); body.add(wh); for (let k=0;k<3;k++){ const sp = box(.5, .05, .04, M(0x5a3a1a)); sp.rotation.z = k*Math.PI/3; sp.position.set(-.05, -.25, z + Math.sign(z)*.06); body.add(sp); } } }
        else if (type === 'crossbow'){ const st = box(.95, .16, .22, M(col)); body.add(st); const grip = box(.16, .35, .2, M(0x6e4a28)); grip.position.set(-.3, -.22, 0); body.add(grip);
          const arc = new THREE.Mesh(new THREE.TorusGeometry(.45, .05, 6, 16, Math.PI), M(0x4a3020)); arc.rotation.z = -Math.PI/2; arc.position.x = .22; body.add(arc);
          const strg = box(.02, .9, .02, M(0xeeeeee)); strg.position.x = -.05; body.add(strg); const ar = box(.75, .04, .04, M(0xdfe3e8)); ar.position.set(.12, .12, 0); body.add(ar); const tip = new THREE.Mesh(new THREE.ConeGeometry(.06, .16, 4), M(0xdfe3e8)); tip.rotation.z = -Math.PI/2; tip.position.set(.55, .12, 0); body.add(tip); }
        else { const bx = box(.9, .8, 1.2, M(col)); body.add(bx); const trim = box(.92, .12, 1.22, M(0xf4ecd8)); trim.position.y = -.28; body.add(trim); const mz = cylX(.2, .24, .35, M(0x3a3d44), 12); mz.position.x = .55; body.add(mz);
          if (type === 'tennis'){ const hop = new THREE.Mesh(new THREE.CylinderGeometry(.42, .25, .35, 12, 1, true), M(0x2a2a2e)); hop.material.side = THREE.DoubleSide; hop.position.y = .55; body.add(hop); for (let k=0;k<5;k++){ const tb = ball(.13, M(0xd8f040), 8); tb.position.set(Math.cos(k*1.3)*.18, .62 + (k>2 ? .1 : 0), Math.sin(k*1.3)*.18); body.add(tb); } }
          if (type === 'hockey'){ for (let k=0;k<3;k++){ const pk = cylZ(.22, .22, .09, M(0x111114), 14); pk.rotation.x = 0; pk.position.set(-.1, .45 + k*.1, 0); body.add(pk); } const stick = box(.06, .7, .06, M(0x8a5a2a)); stick.position.set(.3, .55, .3); stick.rotation.z = -.4; body.add(stick); }
          if (type === 'plane'){ const shp = new THREE.Shape(); shp.moveTo(.4, 0); shp.lineTo(-.3, .22); shp.lineTo(-.18, 0); shp.lineTo(-.3, -.22); shp.lineTo(.4, 0); const pp = new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshLambertMaterial({color:0xf8f4ea, side:THREE.DoubleSide})); pp.rotation.x = -1.3; pp.position.set(0, .48, 0); body.add(pp); g.userData.toy = pp; }
          const lab = new THREE.Mesh(new THREE.CircleGeometry(.17, 16), basic({color: type === 'tennis' ? 0xd8f040 : type === 'hockey' ? 0xf4ecd8 : 0xffffff})); lab.position.set(-.05, .02, .61); body.add(lab); }
        break; }
      case 'glove': { const cl = M(0x2a6ac0); at2(box(.3, .9, 1.1, cl), .18, .5); for (const y of [.12, .88]) at2(box(.45, .14, 1.1, cl), .4, y);
        const arm = new THREE.Group(); arm.position.set(.5, -.5, 0); g.add(arm); g.userData.arm = arm;
        const sprg = new THREE.Group(); arm.add(sprg); for (let k=0;k<6;k++){ const c = new THREE.Mesh(new THREE.TorusGeometry(.22, .04, 5, 12), M(0xf2c14e)); c.rotation.y = Math.PI/2; c.position.x = -.2 + k*.1; sprg.add(c); } g.userData.sprg = sprg;
        const glv = new THREE.Group(); arm.add(glv); g.userData.fist = glv; const mitt = ball(.36, M(0xc02a2a), 14); mitt.scale.set(1.05, .9, .9); glv.add(mitt); const th = ball(.14, M(0xc02a2a), 10); th.position.set(-.05, .3, .1); glv.add(th); const cuff = cylX(.26, .26, .2, M(0xf4ecd8), 12); cuff.position.x = -.32; glv.add(cuff); glv.position.x = .55; break; }
      case 'flower': { const pot = new THREE.Mesh(new THREE.CylinderGeometry(.34, .24, .44, 14), M(0xb8653a)); at2(pot, .5, .78); at2(cylZ(.38, .38, .1, M(0xc8754a), 14), .5, .56, 0).rotation.x = 0;
        at2(box(.05, .4, .05, M(0x3a8a3a)), .5, .38); for (const sx of [-1, 1]){ const lf = ball(.12, M(0x4aa04a), 8); lf.scale.set(1.8, .6, .8); lf.rotation.z = sx*.5; at2(lf, .5 + sx*.18, .44); }
        const head = new THREE.Group(); head.position.set(.5, -.12, .2); g.add(head); g.userData.head = head;
        for (let k=0;k<12;k++){ const a = k/12*Math.PI*2, pt = ball(.1, M(0xd060c0), 8); pt.scale.set(1.9, .7, .4); pt.position.set(Math.cos(a)*.24, Math.sin(a)*.24, 0); pt.rotation.z = a; head.add(pt); }
        const face = cylZ(.15, .15, .08, M(0xf8e040), 16); face.position.z = .04; head.add(face);
        for (const ex of [-.05, .05]){ const ey = ball(.022, basic({color:0x222}), 6); ey.position.set(ex, .03, .1); head.add(ey); } const sm = new THREE.Mesh(new THREE.TorusGeometry(.05, .012, 4, 10, Math.PI), basic({color:0x222})); sm.rotation.z = Math.PI; sm.position.set(0, -.02, .1); head.add(sm);
        const fist = ball(.17, M(0xd060c0)); fist.visible = false; head.add(fist); g.userData.fist = fist; break; }
      case 'minibomb': { const st = cylZ(.13, .13, .75, M(0xd04030), 12); st.rotation.x = 0; st.rotation.z = .35; at2(st, .5, .58); const fz = box(.03, .2, .03, M(0x6a5a40)); fz.rotation.z = .35; at2(fz, .38, .14);
        const sp = sprite(T.glow, .5, 0xffe060); sp.position.set(.34, .02, 0); g.add(sp); up.update = ()=>{ sp.material.opacity = .5 + Math.random()*.5; sp.scale.setScalar(.4 + Math.random()*.2); }; break; }
      case 'megabomb': { const mb = new THREE.Group(); mb.position.set(.5, -.5, 0); g.add(mb); const gm = M(0x6a8a5a);
        const bd = ball(.36, gm, 16); bd.scale.x = 1.15; bd.position.x = -.05; mb.add(bd); const tail = cylX(.28, .12, .35, gm, 14); tail.position.x = .38; mb.add(tail);
        for (let k=0;k<4;k++){ const fin = box(.3, .32, .04, M(0x5a7a4a)); fin.position.x = .5; fin.rotation.x = k*Math.PI/2; fin.geometry.translate(0, .16, 0); mb.add(fin); }
        for (let k=0;k<6;k++){ const rv = ball(.03, M(0x4a6a3a), 6); const a = k/6*Math.PI*2; rv.position.set(-.05 + Math.cos(a)*.1, Math.sin(a)*.32, .2); mb.add(rv); } break; }
    }
    if (ownerColor !== undefined){ const o = outline(d.w, d.h, ownerColor); o.position.z = 1.15; g.add(o);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(.13, 12), basic({color:ownerColor})); dot.position.set(d.w - .2, -.2, 1.2); g.add(dot); }
    g.userData.update = up.update; return g;
  }
  function syncItems(items, colors){
    const live = new Set(items);
    for (const [it, v] of itemViews) if (!live.has(it)){ itemsGroup.remove(v); if (v.userData.free) itemsGroup.remove(v.userData.free); itemViews.delete(it); }
    for (const it of items) if (!itemViews.has(it)){ const v = pivotOf(itemModel(it.type, it.owner !== undefined ? colors[it.owner] : undefined), it.type); placePivot(v, it.type, it.x, it.y, it.r); v.userData.base = v.position.clone(); v.userData.free = freeParts(it); v.traverse(o=>{ if (o.userData && o.userData.preview) o.visible = false; }); if (v.userData.free) itemsGroup.add(v.userData.free); itemsGroup.add(v); itemViews.set(it, v); popIn(v); }
  }
  // items turn about their own centre: the pivot sits at the centre of the (rotated) footprint
  function pivotOf(model, type){ const d = IT[type], pv = new THREE.Group(); model.position.set(-d.w/2, d.h/2, 0); pv.add(model); pv.userData = model.userData; return pv; }
  function placePivot(pv, type, x, y, r){ const D = GaoshiRules.dims(type, r); pv.position.set(WX(x + D.w/2), WY(y + D.h/2), 0); pv.rotation.z = -(r||0) * Math.PI/2; }
  function popIn(v){ v.scale.setScalar(.2); let t = 0; const a = {update(dt){ t += dt; const k = Math.min(1, t/.25); v.scale.setScalar(.2 + .8*k + Math.sin(k*Math.PI)*.25); if (k >= 1){ v.scale.setScalar(1); a.done = true; } }}; ambient.push(a); }
  // world-aligned moving parts (they don't turn with the item): ferris seats, saw discs, wrecking balls
  function freeParts(it){
    const f = new THREE.Group();
    if (it.type === 'ferris'){ f.userData.seats = []; for (let k=0;k<4;k++){ const st = new THREE.Group(); const b = box(1.6, .3, 1.4, lam({color:[0xe0483d, 0x3d7fe0, 0xf2c14e, 0x5fd36a][k]})); st.add(b); const hg = box(.06, .5, .06, lam({color:0xe8e1d0})); hg.position.y = .35; st.add(hg); f.add(st); f.userData.seats.push(st); } }
    else if (it.type === 'linsaw'){ const disc = new THREE.Group(); const pl = new THREE.Mesh(new THREE.CylinderGeometry(.75, .75, .06, 24), lam({color:0xc8ccd3})); pl.rotation.x = Math.PI/2; disc.add(pl);
      for (let k=0;k<12;k++){ const a = k/12*Math.PI*2, th = new THREE.Mesh(new THREE.ConeGeometry(.1, .25, 3), lam({color:0xe8ebef})); th.position.set(Math.cos(a)*.82, Math.sin(a)*.82, 0); th.rotation.z = a - Math.PI/2 + .5; disc.add(th); }
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(.18, .18, .12, 10), lam({color:0xd93a2e})); hub.rotation.x = Math.PI/2; disc.add(hub); f.add(disc); f.userData.disc = disc; }
    else if (it.type === 'wrecking'){ const chain = box(.08, 1, .08, lam({color:0x6a6d74})); f.add(chain); const b = new THREE.Mesh(new THREE.SphereGeometry(.8, 18, 14), lam({color:0x2a2a2e})); f.add(b); f.userData.chain = chain; f.userData.ball = b; }
    else return null;
    f.position.z = .9; return f;
  }
  const shotViews = new Map();
  function shotMesh(kind){
    const m = new THREE.Group();
    if (kind === 'cannon') m.add(new THREE.Mesh(new THREE.SphereGeometry(.35, 12, 10), lam({color:0x222226})));
    if (kind === 'crossbow'){ const a = box(.8, .05, .05, lam({color:0x8a5a2a})); m.add(a); const tip = new THREE.Mesh(new THREE.ConeGeometry(.08, .2, 4), lam({color:0xdfe3e8})); tip.rotation.z = -Math.PI/2; tip.position.x = .45; m.add(tip); m.userData.aim = true; }
    if (kind === 'hockey'){ const pk = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .16, 16), lam({color:0x111114})); m.add(pk); }
    if (kind === 'tennis') m.add(new THREE.Mesh(new THREE.SphereGeometry(.25, 12, 10), lam({color:0xd8f040})));
    if (kind === 'plane'){ const shp = new THREE.Shape(); shp.moveTo(.45, 0); shp.lineTo(-.35, .25); shp.lineTo(-.2, 0); shp.lineTo(-.35, -.25); shp.lineTo(.45, 0);
      const pl = new THREE.Mesh(new THREE.ShapeGeometry(shp), new THREE.MeshLambertMaterial({color:0xf8f4ea, side:THREE.DoubleSide})); pl.rotation.x = 1.1; m.add(pl); m.userData.aim = true; }
    if (kind === 'bee'){ const b = new THREE.Mesh(new THREE.SphereGeometry(.18, 10, 8), lam({color:0xf2c14e})); b.scale.x = 1.4; m.add(b); const st = box(.08, .3, .3, lam({color:0x222})); m.add(st);
      m.userData.wings = []; for (const z of [-.1, .1]){ const wp = new THREE.Group(); wp.position.set(0, .12, z); const wg = new THREE.Mesh(new THREE.SphereGeometry(.13, 8, 6), basic({color:0xffffff, transparent:true, opacity:.7})); wg.scale.set(1, .4, .6); wg.position.y = .1; wp.add(wg); m.add(wp); m.userData.wings.push(wp); }
      for (const x of [-.05, .1]){ const sb = box(.06, .3, .32, lam({color:0x222})); sb.position.x = x; m.add(sb); } const stg = new THREE.Mesh(new THREE.ConeGeometry(.05, .14, 5), lam({color:0x222})); stg.rotation.z = Math.PI/2; stg.position.x = -.3; m.add(stg); }
    m.position.z = 1; return m;
  }
  function syncShots(shots){
    const live = new Set(shots || []);
    for (const [sh, m] of shotViews) if (!live.has(sh)){ itemsGroup.remove(m); shotViews.delete(sh); }
    for (const sh of shots || []){ let m = shotViews.get(sh); if (!m){ m = shotMesh(sh.kind); itemsGroup.add(m); shotViews.set(sh, m); }
      m.position.x = WX(sh.x); m.position.y = WY(sh.y);
      if (m.userData.aim) m.rotation.z = Math.atan2(-sh.vy, sh.vx); else if (sh.kind !== 'bee') m.rotation.z -= sh.vx * .02;
      if (m.userData.wings) m.userData.wings.forEach((wg, k)=>{ wg.rotation.x = Math.sin(sh.t*60 + k*Math.PI)*.8; }); if (sh.kind === 'bee') m.scale.x = sh.vx < 0 ? -1 : 1;
      if (sh.kind === 'plane') m.rotation.x = Math.sin(sh.t*4)*.3; }
  }
  function updateItems(dt, t, items, world, racing){
    if (!itemsGroup) return;
    syncShots(world && racing ? world.shots : []);
    if (world && racing && world.puffs){ for (const [x, y] of world.puffs) burst(WX(x), WY(y), 0xdddddd, 6, 3, {gravity:4, size:.4}); world.puffs.length = 0; }
    for (const [it, v] of itemViews){ if (v.userData.update) v.userData.update(dt, t);
      const s = world && racing ? GaoshiPhysics.itemState(world, it) : null, u = v.userData, b = u.base;
      if (b){ v.position.copy(b); if (s && (s.dx || s.dy || s.shakeX)) { v.position.x += (s.dx || 0) + (s.shakeX || 0); v.position.y -= (s.dy || 0); } }
      v.visible = !(s && s.off && it.type !== 'door' && it.type !== 'onewaydoor' && it.type !== 'crumble');
      if (it.type === 'barrel' && s && s.x !== undefined){ v.position.set(WX(s.x + 1), WY(s.y + 1), 0); if (u.roll) u.roll.rotation.z = -(s.roll || 0); }
      if (u.chunks){ const off = s && s.off, cr = s ? (s.crack || 0) : 0; u.chunks.children.forEach((c, k)=>{ c.visible = !off; c.position.x = .25 + (k%2)*.5 + (cr > 0 ? (Math.random() - .5)*.06 : 0); }); }
      if (u.door){ const o = s && s.open > 0; u.door.position.y += ((o ? 2.6 : 0) - u.door.position.y) * Math.min(1, dt*14); }
      if (u.flip){ const want = s && s.side ? Math.PI : 0; u.flip.rotation.z += (want - u.flip.rotation.z) * Math.min(1, dt*10); }
      if (u.spk){ const up_ = s && s.up > 0; u.spk.position.y += ((up_ ? .45 : 0) - u.spk.position.y) * Math.min(1, dt*25); }
      if (u.spin){ u.spin.rotation.z = s && s.spin !== undefined ? -s.spin : -t*1.5; }
      if (u.spinS) u.spinS.material.rotation = t*3;
      if (u.belt) u.belt.children.forEach((c, k)=>{ c.position.x = (((k*.3 + (s ? s.roll || 0 : t*4.5)) % 3) + 3) % 3; });
      if (u.fans) u.fans.forEach(f=>{ f.rotation.y = t*20; });
      if (u.rim) u.rim.rotation.z = -t/9*Math.PI*2 * ((it.r||0) % 2 ? -1 : 1);
      if (u.air) u.air.forEach((a, k)=>{ const ph = ((t*1.6 + k*.37) % 1); a.position.y = ph*7.5; a.material.opacity = .4*(1 - ph); });
      if (u.jet){ const on = s ? s.on : false; u.jet.visible = !!on; u.jet.children.forEach((c, k)=>{ c.material.rotation = t*6 + k; c.scale.setScalar(.5 + Math.random()*.3); }); }
      if (u.pilot) u.pilot.material.opacity = .6 + Math.sin(t*20)*.3;
      if (u.flame){ const on = s ? s.on : false; u.flame.visible = !!on; u.flame.children.forEach(c=>{ c.material.opacity = .6 + Math.random()*.4; }); }
      if (u.hand) u.hand.rotation.z = -t*.8;
      if (u.spinY) u.spinY.rotation.y = t*18;
      if (u.spinX) u.spinX.rotation.x = t*14;
      if (u.siren) u.siren.material.emissive.setHex((t*3 % 1) < .5 ? 0xff2010 : 0x400000);
      if (u.sawArm){ u.sawArm.rotation.z = (s && s.sawA !== undefined ? s.sawA : t*Math.PI) + (it.r||0)*Math.PI/2; u.sawDisc.rotation.z -= dt*14; }
      if (u.tiles) u.tiles.forEach((tl, k)=>{ tl.material.color.setHSL(((t*.6 + k*.25) % 1), .8, .6); });
      if (u.disco) u.disco.rotation.y = t*2;
      if (u.waves) u.waves.forEach((wv, k)=>{ const ph = (t*.8 + k/3) % 1; wv.scale.setScalar(.5 + ph); wv.material.opacity = .55*(1 - ph); });
      if (u.drip){ const ph = (t*.7 + it.x*.13) % 1; u.drip.position.y = -.8 - ph*.25; u.drip.scale.set(1 - ph*.3, 1.7 + ph, 1); }
      if (u.blink) u.blink.material.opacity = (t*2 % 1) < .5 ? 1 : .25;
      if (u.hive) u.hive.rotation.z = Math.sin(t*1.7 + it.x)*.06;
      if (u.toy) u.toy.position.y = .48 + Math.sin(t*3)*.05;
      if (u.squash){ s && s.squash > 0 && (s.squash -= dt); const k_ = s && s.squash > 0 ? Math.sin(s.squash/.25*Math.PI)*.3 : 0; u.squash.scale.set(1 + k_*.5, 1 - k_, 1); }
      if (u.pick){ u.pick.visible = !(s && s.taken); u.pick.position.y = -.5 + Math.sin(t*3)*.08; u.pick.rotation.y = t*1.5; }
      if (u.pop){ s && s.pop > 0 && (s.pop -= dt); u.pop.scale.y = 1 + (s && s.pop > 0 ? Math.sin(s.pop/.3*Math.PI)*.6 : 0); }
      if (u.gun){ u.gun.position.x = .5 - (s && s.recoil > 0 ? s.recoil*.8 : 0); }
      if (u.fist && u.arm){ const e = s ? s.ext || 0 : 0; u.fist.position.x = .55 + e*2; u.sprg.scale.x = .55 + e*2; }
      if (u.head && u.fist){ const e = s ? s.ext || 0 : 0, f = s && s.face ? s.face : 1; u.fist.position.set(f*(.2 + e*1.8), 0, .2); u.head.rotation.z = s && s.wind > 0 ? Math.sin(t*40)*.2 : 0; }
      const fr = u.free;
      if (fr){
        if (fr.userData.seats){ const c = GaoshiRules.dims(it.type, it.r), cx = it.x + c.w/2, cy = it.y + c.h/2, a0 = (s && s.seats) ? null : 0;
          fr.userData.seats.forEach((st, k)=>{ const q = s && s.seats ? s.seats[k] : {x:cx + Math.cos(k*Math.PI/2)*2, y:cy + Math.sin(k*Math.PI/2)*2}; st.position.set(WX(q.x), WY(q.y) - .15, 0); }); void a0; }
        if (fr.userData.disc){ const D = GaoshiRules.dims(it.type, it.r), sx = s && s.sx !== undefined ? s.sx : it.x + .5 + (D.w > D.h ? 0 : D.w/2 - .5), sy = s && s.sy !== undefined ? s.sy : it.y + D.h/2 + (D.w > D.h ? 0 : -D.h/2 + .5);
          fr.userData.disc.position.set(WX(sx), WY(sy), 0); fr.userData.disc.rotation.z -= dt*12; }
        if (fr.userData.ball){ const piv = GaoshiRules.rotRect(it.type, it.r, {x:2.5, y:.5, w:0, h:0}, it.x, it.y), bx = s && s.bx !== undefined ? s.bx : piv.x + [0, -2.7, 0, 2.7][(it.r||0)%4], by = s && s.by !== undefined ? s.by : piv.y + [2.7, 0, -2.7, 0][(it.r||0)%4];
          fr.userData.ball.position.set(WX(bx), WY(by), 0); const mx = (piv.x + bx)/2, my = (piv.y + by)/2, len = Math.hypot(bx - piv.x, by - piv.y);
          fr.userData.chain.position.set(WX(mx), WY(my), 0); fr.userData.chain.scale.y = len; fr.userData.chain.rotation.z = Math.atan2(-(by - piv.y), bx - piv.x) - Math.PI/2; }
      }

      if (it.type === 'coin' && v.userData.coin){ const c = v.userData.coin; const cx = it.cx !== undefined ? it.cx : it.x + .5, cy = it.cy !== undefined ? it.cy : it.y + .5; c.position.set(cx - it.x, -(cy - it.y), it.carrier !== undefined ? 1.2 : .3); v.rotation.z = 0; } }
  }

  // red glow on every item a bomb would destroy (the 3×3 around the cursor); pass [] to clear
  function markBombTargets(list){
    const want = new Set(list || []), t = performance.now()/1000, pulse = .5 + .5*Math.sin(t*8);
    for (const [it, v] of itemViews){
      let m = v.userData.bombMark;
      if (want.has(it)){
        if (!m){
          const d = IT[it.type]; m = new THREE.Group();
          const fill = new THREE.Mesh(new THREE.PlaneGeometry(d.w, d.h), basic({color:0xff2a1a, transparent:true, opacity:.4, depthWrite:false})); fill.position.z = 1.3; m.add(fill);
          const frame = outline(d.w, d.h, 0xff3a2a); frame.position.set(-d.w/2, d.h/2, 1.35); m.add(frame);
          const glow = sprite(T.glow, Math.max(d.w, d.h) * 1.8 + .6, 0xff2a1a, .6); glow.position.z = 1.4; m.add(glow);
          m.userData = {fill, glow}; v.add(m); v.userData.bombMark = m;
        }
        m.userData.fill.material.opacity = .28 + .3*pulse; m.userData.glow.material.opacity = .45 + .4*pulse;
      } else if (m){ v.remove(m); v.userData.bombMark = null; m.traverse(o=>{ if (o.isMesh){ o.geometry.dispose(); o.material.dispose(); } }); }
    }
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
    if (GaoshiRules.isBomb(type)){ const k = d.bomb, r = outline(2*k + 1, 2*k + 1, 0xffb040); r.position.set(-k, k, 2.3); g.add(r); }
    // show where shooters fire and what moving things cover
    const reach = {fan:[0,7.5,'up'], hydrant:[0,5,'up'], flame:[0,3.4,'aim'], glove:[0,2,'aim']}[type];
    if (reach){ const ar = basic({color:0xffb040, transparent:true, opacity:.18, depthWrite:false}), up_ = reach[2] === 'up';
      const m = new THREE.Mesh(new THREE.PlaneGeometry(up_ ? d.w : reach[1], up_ ? reach[1] : d.h), ar); m.position.set(up_ ? d.w/2 : d.w + reach[1]/2, up_ ? reach[1]/2 : -d.h/2, 2.25); g.add(m); }
    if (['cannon','crossbow','hockey','tennis','plane'].includes(type)){ const a = new THREE.Mesh(new THREE.ConeGeometry(.18, .4, 3), basic({color:0xffb040})); a.rotation.z = -Math.PI/2; a.position.set(1.35, -.5, 2.3); g.add(a); }
    if (type === 'linsaw'){ const c = new THREE.Mesh(new THREE.RingGeometry(.8, .85, 24), basic({color:0xff5a4f, transparent:true, opacity:.7})); c.position.set(.5, -.5, 2.3); g.add(c); }
    if (type === 'wrecking'){ const c = new THREE.Mesh(new THREE.RingGeometry(2.6, 2.7, 32, 1, -Math.PI*.85, Math.PI*.7), basic({color:0xff5a4f, transparent:true, opacity:.6})); c.position.set(2.5, -.5, 2.3); g.add(c); }
    if (type === 'blackhole' || type === 'magnet' || type === 'slowatch'){ const rad = {blackhole:6.5, magnet:6, slowatch:4.5}[type], c = new THREE.Mesh(new THREE.RingGeometry(rad - .06, rad, 40), basic({color:type === 'slowatch' ? 0x9ad0ff : 0xb37aff, transparent:true, opacity:.5})); c.position.set(d.w/2, -d.h/2, 2.3); g.add(c); }
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
  function explosion(x, y, k){
    k = k === undefined ? 1 : k; const sc = [.45, 1, 1.8][k] || 1;
    const fl = sprite(T.glow, 1, 0xffc060); fl.position.set(x, y, 1.5); group.add(fl);
    parts.push({m:fl, v:[0,0,0], life:.45, t:0, g:0, grow:14*sc, spin:0, o0:1, size:1});
    burst(x, y, [0x3a3a3a, 0xff8a3a, 0xffd27a], Math.round(22*sc), 9*sc, {cubes:true, gravity:10});
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
  // ---------- item icons: the real 3D model, rendered once off screen ----------
  const iconCache = {};
  let iconRig = null;
  function iconOf(type, W, H){
    W = W || 176; H = H || 132; const key = type + W + 'x' + H; if (iconCache[key]) return iconCache[key];
    if (!iconRig){ const sc = new THREE.Scene(); sc.add(new THREE.HemisphereLight(0xfff4e6, 0x5a4a40, .95)); const dl = new THREE.DirectionalLight(0xffffff, .85); dl.position.set(-4, 7, 9); sc.add(dl); const rl = new THREE.DirectionalLight(0xa8c4ff, .35); rl.position.set(5, 2, -6); sc.add(rl); iconRig = {sc}; }
    const m = itemModel(type), d = IT[type], hold = new THREE.Group(); m.position.set(-d.w/2, d.h/2, 0); hold.add(m);
    hold.rotation.set(.18, -.42, 0); iconRig.sc.add(hold); hold.updateMatrixWorld(true);
    const bb = new THREE.Box3(); m.traverse(o=>{ if (o.isMesh && !(o.material && o.material.transparent && o.material.opacity < .3)) bb.expandByObject(o); });
    if (bb.isEmpty()) bb.setFromObject(m);
    const c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3()), asp = W/H, half = Math.max(sz.x/asp, sz.y) * .58;
    const cam = new THREE.OrthographicCamera(-half*asp, half*asp, half, -half, -50, 50); cam.position.set(c.x, c.y, 20); cam.lookAt(c.x, c.y, 0);
    const rt = new THREE.WebGLRenderTarget(W, H), buf = new Uint8Array(W*H*4), prevT = renderer.getRenderTarget(), prevC = renderer.getClearColor(new THREE.Color()), prevA = renderer.getClearAlpha();
    renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(iconRig.sc, cam); renderer.readRenderTargetPixels(rt, 0, 0, W, H, buf);
    renderer.setRenderTarget(prevT); renderer.setClearColor(prevC, prevA); rt.dispose(); iconRig.sc.remove(hold);
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d'), img = g.createImageData(W, H);
    for (let y=0; y<H; y++) img.data.set(buf.subarray((H - 1 - y)*W*4, (H - y)*W*4), y*W*4);
    // the render target holds linear colour: brighten to match the on-screen look
    const gam = new Uint8Array(256); for (let v=0; v<256; v++) gam[v] = Math.round(255*Math.pow(v/255, 1/2.2));
    for (let i=0; i<img.data.length; i+=4){ if (!img.data[i+3]) continue; for (let k=0;k<3;k++) img.data[i+k] = gam[img.data[i+k]]; }
    g.putImageData(img, 0, 0); iconCache[key] = cv; return cv;
  }
  return { WX, WY, buildMap, iconOf, syncItems, updateItems, update, markBombTargets, placeOverlay, makeGhost, setGhost, removeObj, burst, explosion, itemModel, itemIcon:null };
})();
