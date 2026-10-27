/* 世志搞事 — scenery, item models, ghosts and particles. Uses helpers from gaoshi-models.js (tex, speckle, rbox, cyl, L). */
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
  let group = null, blades = [], flagMesh = null, overlay = null;
  const DEPTH = 4;
  function box(w, h, d, mats){ return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats); }
  function placeBox(m, x, y, w, h, z=0){ m.position.set(WX(x + w/2), WY(y + h/2), z); group.add(m); return m; }
  function faceMats(side, top, bottom){ return [side, side, top, bottom || side, side, side]; }
  function repTex(t, rx, ry, ox=0, oy=0){ const c = t.clone(); c.needsUpdate = true; c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.offset.set(ox, oy); return c; }

  function sky(map){
    const t = canvasTex(4, 128, (g)=>{ const gr = g.createLinearGradient(0,0,0,128); gr.addColorStop(0, hex(map.sky[0])); gr.addColorStop(1, hex(map.sky[1])); g.fillStyle = gr; g.fillRect(0,0,4,128); });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(300, 140), basic({map:t, fog:false})); m.position.set(0, 14, -70); group.add(m);
    const sun = sprite(T.glow, map.look === 'city' ? 26 : 18, map.look === 'city' ? 0xffb070 : 0xfff2c0); sun.position.set(map.look === 'city' ? -18 : 20, map.look === 'city' ? 3 : 20, -66); group.add(sun);
    // drifting clouds
    for (let i=0;i<7;i++){
      const c = new THREE.Group(), col = map.look === 'city' ? 0xf0b49a : 0xffffff;
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
    blades = [];
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
    group = new THREE.Group(); scene.add(group); seedA = map.id === 'farm' ? 11 : 7;
    scene.fog = new THREE.Fog(map.look === 'city' ? 0x5b4f6a : 0xbcd6ea, 40, 110);
    sky(map); if (map.look === 'city'){ cityBackdrop(); } else farmBackdrop();
    solids(map); if (map.look === 'city') cityProps(); else farmProps();
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
    for (const it of items) if (!itemViews.has(it)){ const v = itemModel(it.type, it.owner !== undefined ? colors[it.owner] : undefined); v.position.set(WX(it.x), WY(it.y), 0); itemsGroup.add(v); itemViews.set(it, v); popIn(v); }
  }
  function popIn(v){ v.scale.setScalar(.2); let t = 0; const a = {update(dt){ t += dt; const k = Math.min(1, t/.25); v.scale.setScalar(.2 + .8*k + Math.sin(k*Math.PI)*.25); if (k >= 1){ v.scale.setScalar(1); a.done = true; } }}; ambient.push(a); }
  function updateItems(dt, t, items){
    for (const [it, v] of itemViews){ if (v.userData.update) v.userData.update(dt, t);
      if (it.type === 'coin' && v.userData.coin){ const c = v.userData.coin; const cx = it.cx !== undefined ? it.cx : it.x + .5, cy = it.cy !== undefined ? it.cy : it.y + .5; c.position.set(cx - it.x, -(cy - it.y), it.carrier !== undefined ? 1.2 : .3); } }
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
    group.add(g); return g;
  }
  function setGhost(g, x, y, ok){ g.position.set(WX(x), WY(y), 0); g.userData.bad.visible = !ok; g.visible = true; }
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
    for (const b of blades) b.arm.rotation.z = -(hz ? hz.angle : t / b.h.periodSec * Math.PI*2);
    updateParts(dt);
  }
  return { WX, WY, buildMap, syncItems, updateItems, update, placeOverlay, makeGhost, setGhost, removeObj, burst, explosion, itemModel, itemIcon:null };
})();
