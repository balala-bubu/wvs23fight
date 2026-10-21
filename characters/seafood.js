/* 雲嵐 Seafood Master — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- 雲嵐（Seafood Master） ---------- */
const S_SKIN = '#c99470', S_SKIN_C = ['#bf8966','#d29e7a','#c48e6a','#ba8562'];
const sSkinTex = tex(16,16,(g)=>speckle(g,16,16,S_SKIN,S_SKIN_C,.4));
function seafoodFace(g, mode){
  speckle(g,64,64,S_SKIN,S_SKIN_C,.35); shadeFace(g);
  g.fillStyle = mode==='chew' ? 'rgba(220,110,90,.45)' : 'rgba(215,105,85,.28)';
  const cr = mode==='chew' ? 9 : 6;
  g.beginPath(); g.ellipse(14,42,cr,cr*.7,0,0,7); g.fill();
  g.beginPath(); g.ellipse(50,42,cr,cr*.7,0,0,7); g.fill();
  g.fillStyle='#1d1512';
  if (mode==='cry'){ g.fillRect(13,26,5,2); g.fillRect(18,25,5,2); g.fillRect(41,25,5,2); g.fillRect(46,26,5,2); }
  else { g.fillRect(14,25,11,2); g.fillRect(39,25,11,2); }
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(15,35); g.lineTo(20,33); g.lineTo(25,35); g.stroke();
    g.beginPath(); g.moveTo(39,35); g.lineTo(44,33); g.lineTo(49,35); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,37,3,15); g.fillRect(44,37,3,15);
  } else if (mode==='chew'){
    g.beginPath(); g.moveTo(14,36); g.lineTo(20,32); g.lineTo(26,36); g.stroke();
    g.beginPath(); g.moveTo(38,36); g.lineTo(44,32); g.lineTo(50,36); g.stroke();
  } else {
    g.beginPath(); g.arc(20,37,5.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
    g.beginPath(); g.arc(44,37,5.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  }
  g.fillStyle='rgba(120,70,45,.4)'; g.fillRect(29,37,6,5);
  g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,42,3,1); g.fillRect(34,42,3,1);
  if (mode==='cry'){
    g.beginPath(); g.moveTo(22,53); g.quadraticCurveTo(32,46,42,53); g.quadraticCurveTo(32,50,22,53); g.closePath(); g.fillStyle='#4a1715'; g.fill();
  } else if (mode==='chew'){
    g.fillStyle='#4a1715'; g.fillRect(27,49,10,3); g.fillStyle='#ff8a5a'; g.fillRect(36,50,4,2);
  } else {
    g.beginPath(); g.moveTo(19,47); g.quadraticCurveTo(32,44,45,47);
    g.quadraticCurveTo(41,56,32,56); g.quadraticCurveTo(23,56,19,47); g.closePath();
    g.fillStyle='#4a1715'; g.fill();
    g.save(); g.clip(); g.fillStyle='#f1eadf'; g.fillRect(18,44,28,6); g.restore();
  }
}
const sfFaces = { normal:tex(64,64,(g)=>seafoodFace(g,'normal')), cry:tex(64,64,(g)=>seafoodFace(g,'cry')), chew:tex(64,64,(g)=>seafoodFace(g,'chew')) };
const NAVY = '#26305a', NAVY_C = ['#2d3868','#1f284c','#323d70'];
const sShirtTex = tex(32,32,(g)=>speckle(g,32,32,NAVY,NAVY_C,.45));
const sFrontTex = tex(32,46,(g)=>{
  speckle(g,32,46,NAVY,NAVY_C,.45);
  g.fillStyle='#1c2448'; g.fillRect(14,0,4,14); g.fillStyle='#141a36'; [3,7,11].forEach(y=>g.fillRect(15,y,2,2));
  g.fillStyle='#4fb05a'; for (let i=0;i<22;i++){ g.fillRect((6+i*0.45)|0, i, 2, 1); g.fillRect(25-((i*0.45)|0), i, 2, 1); }
  g.fillStyle='#e8e4dc'; g.fillRect(12,23,9,7); g.fillStyle='#4fb05a'; g.fillRect(12,23,9,2); g.fillStyle='#9aa3ad'; g.fillRect(15,21,3,2);
});
const sSleeveTex = tex(16,16,(g)=>{ speckle(g,16,16,NAVY,NAVY_C,.45); g.fillStyle='#b8323a'; g.fillRect(0,1,16,3); g.fillStyle='#f4f0e8'; g.fillRect(0,4,16,3); });
const sPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#2a2a30',['#33333a','#222228','#3a3a42'],.5); g.fillStyle='rgba(255,255,255,.04)'; for(let y=0;y<32;y+=3) g.fillRect(0,y,32,1); });
// sea creatures
const fishMs = {};
function fishMesh(s, col){
  col = col || 0x7f9fb8;
  const M = fishMs[col] || (fishMs[col] = L({color:col}));
  const g = new THREE.Group();
  g.add(rbox(1.6,0.7,0.36,.6,M));
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.42,0.6,4), M); tail.rotation.z = -Math.PI/2; tail.position.x = -1.0; g.add(tail);
  const fin = rbox(0.5,0.3,0.08,.4,M); fin.position.set(0,0.42,0); g.add(fin);
  [-1,1].forEach(z=>g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.12,0.05),black),0.55,0.1,z*0.18)));
  g.scale.setScalar(s); return g;
}
const shrimpM = L({color:0xff7a4a}), shrimpHiM = L({color:0xffb08a});
function shrimpMesh(s){
  const g = new THREE.Group();
  for (let i=0;i<5;i++){ const a = i*0.5; const b = rbox(0.42-i*0.04,0.38-i*0.03,0.34,.5, i%2 ? shrimpM : shrimpHiM); b.position.set(Math.sin(a)*0.55, Math.cos(a)*0.55, 0); b.rotation.z = -a; g.add(b); }
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.25,0.35,4), shrimpM); tail.position.set(Math.sin(2.5)*.55, Math.cos(2.5)*.55, 0); tail.rotation.z = Math.PI - 2.5; g.add(tail);
  [-1,1].forEach(z=>{ const an = new THREE.Mesh(new THREE.BoxGeometry(0.9,0.03,0.03), shrimpM); an.position.set(-0.4,0.75,z*0.08); an.rotation.z = 0.5; g.add(an); });
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.08,0.4),black),-0.12,0.6,0));
  g.scale.setScalar(s); return g;
}
const clamM = new THREE.MeshLambertMaterial({color:0xd9c39c, side:THREE.DoubleSide}), clamInM = L({color:0xf6e7d8});
const clamGeo = new THREE.SphereGeometry(0.55,8,4,0,Math.PI*2,0,Math.PI/2);
function clamMesh(s){
  const g = new THREE.Group();
  const bot = new THREE.Mesh(clamGeo, clamM); bot.scale.set(1,0.45,0.8); bot.rotation.x = Math.PI; g.add(bot);
  const hinge = pivot(g,-0.5,0,0); const tp = new THREE.Mesh(clamGeo, clamM); tp.scale.set(1,0.45,0.8); tp.position.x = 0.5; hinge.add(tp); hinge.rotation.z = 0.35;
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.42,6,4), clamInM); inner.scale.set(1,0.25,0.75); g.add(inner);
  g.scale.setScalar(s); return g;
}
const goldM = L({color:0xf2c14e});
function tridentMesh(){
  const g = new THREE.Group();
  g.add(at(cyl(0.07,0.07,3.0,goldM,6),0,-1.4,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9,0.12,0.12),goldM),0,-2.9,0));
  [-0.4,0,0.4].forEach(x=>{ g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.6,0.1),goldM),x,-3.2,0)); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.1,0.3,4),goldM); tip.rotation.x = Math.PI; tip.position.set(x,-3.6,0); g.add(tip); });
  return g;
}
// the guy in the bear suit (third photo)
const bearFaceTex = tex(64,64,(g)=>{
  speckle(g,64,64,'#dca07c',['#d2956f','#e6ae8a','#d89a76'],.35); shadeFace(g);
  g.fillStyle='#151110'; g.fillRect(0,0,64,16);
  for (let i=0;i<9;i++){ g.beginPath(); g.moveTo(i*7.5,14); g.lineTo(i*7.5+8,14); g.lineTo(i*7.5+3+(i%3),24+(i%2)*3); g.fill(); }
  g.fillStyle='#1d1512'; g.fillRect(14,27,11,2); g.fillRect(39,27,11,2);
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  g.beginPath(); g.arc(20,35,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,35,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  g.fillStyle='rgba(150,80,55,.5)'; g.fillRect(27,36,10,7); g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,42,3,1); g.fillRect(34,42,3,1);
  g.beginPath(); g.moveTo(17,47); g.quadraticCurveTo(32,44,47,47); g.quadraticCurveTo(42,57,32,57); g.quadraticCurveTo(22,57,17,47); g.closePath(); g.fillStyle='#4a1715'; g.fill();
  g.save(); g.clip(); g.fillStyle='#efe2c8'; g.fillRect(16,45,32,5); g.fillStyle='#c9b590'; [24,29,34,39].forEach(x=>g.fillRect(x,45,1,5)); g.restore();
  g.fillStyle='rgba(40,30,25,.35)'; for (let i=0;i<14;i++) g.fillRect(24+((i*7)%16), 58+(i%3), 1, 1);
});
const bearM = L({color:0x7a4a26}), bearLightM = L({color:0xc89a6a});
function buildBearSuit(){
  const g = new THREE.Group();
  g.add(at(rbox(2.4,3.0,1.9,.55,bearM),0,2.7,0));
  g.add(at(rbox(1.5,1.8,0.3,.5,bearLightM),0,2.6,0.92));
  [-1,1].forEach(s=>{ g.add(at(rbox(0.9,1.4,1.0,.5,bearM),s*0.65,0.7,0)); const a = rbox(0.75,2.0,0.75,.5,bearM); a.position.set(s*1.5,3.0,0.3); a.rotation.z = s*0.6; g.add(a); });
  const head = new THREE.Group(); head.position.set(0,5.2,0); g.add(head);
  head.add(rbox(2.1,1.9,1.8,.6,bearM));
  [-1,1].forEach(s=>head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.42,7,5),bearM),s*0.85,0.95,0)));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.72,0.13,5,16), bearLightM); rim.position.set(0,-0.1,0.9); head.add(rim);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(1.32,1.32), L({map:bearFaceTex})); face.position.set(0,-0.1,0.93); head.add(face);
  g.head = head; return g;
}
const foamM = new THREE.MeshLambertMaterial({color:0xf4fbff, transparent:true, opacity:.95});
const waveBodyM = new THREE.MeshLambertMaterial({vertexColors:true, transparent:true, opacity:.82, depthWrite:false});
function waveGeo(){
  // cross-section of a curling wave (front at +x), extruded along z
  const sh = new THREE.Shape();
  sh.moveTo(-8,0);
  sh.bezierCurveTo(-5,0.5, -3,6.5, 0,9);
  sh.bezierCurveTo(1.6,10.2, 4.2,9.8, 5.0,7.8);
  sh.bezierCurveTo(5.4,6.6, 4.6,5.9, 3.9,6.6);
  sh.bezierCurveTo(3.0,7.4, 2.4,5.5, 3.0,3.2);
  sh.bezierCurveTo(3.4,1.6, 4.8,0.6, 6.2,0);
  sh.lineTo(-8,0);
  const geo = new THREE.ExtrudeGeometry(sh, {depth:6, bevelEnabled:true, bevelThickness:.5, bevelSize:.35, bevelSegments:2, curveSegments:14});
  geo.translate(0,0,-3);
  const pos = geo.attributes.position, col = new Float32Array(pos.count*3), c = new THREE.Color(), lo = new THREE.Color(0x0f4f8a), hi = new THREE.Color(0x7fe0f5);
  for (let i=0;i<pos.count;i++){ const k = Math.max(0, Math.min(1, pos.getY(i)/9.5)); c.copy(lo).lerp(hi, k*k); col[i*3] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b; }
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  return geo;
}
function foamGeo(){
  // a white cap following the crest and the curl
  const path = new THREE.Path();
  path.moveTo(-3,6.6); path.quadraticCurveTo(-1.5,8.6,0,9.05);
  path.bezierCurveTo(1.6,10.25, 4.2,9.85, 5.02,7.8);
  path.bezierCurveTo(5.42,6.6, 4.6,5.9, 3.9,6.6);
  const pts = path.getPoints(14), out = [], inn = [];
  pts.forEach((p,i)=>{
    const a = pts[Math.max(0,i-1)], b = pts[Math.min(pts.length-1,i+1)];
    let nx = b.y - a.y, ny = -(b.x - a.x); const l = Math.hypot(nx,ny) || 1; nx /= l; ny /= l;
    const w = 0.7*Math.sin(Math.min(1, i/3, (pts.length-1-i)/3)*Math.PI/2) + 0.05;
    out.push(new THREE.Vector2(p.x - nx*.12, p.y - ny*.12)); inn.push(new THREE.Vector2(p.x + nx*w, p.y + ny*w));
  });
  const sh = new THREE.Shape(out.concat(inn.reverse()));
  const geo = new THREE.ExtrudeGeometry(sh, {depth:6.9, bevelEnabled:true, bevelThickness:.25, bevelSize:.15, bevelSegments:2});
  geo.translate(0,0,-3.45);
  return geo;
}
let WAVE_GEO = null, FOAM_GEO = null;
function buildTsunami(dir){
  if (!WAVE_GEO){ WAVE_GEO = waveGeo(); FOAM_GEO = foamGeo(); }
  const g = new THREE.Group(), inner = new THREE.Group(); inner.scale.x = dir; g.add(inner);
  const surge = new THREE.Group(); inner.add(surge);
  surge.add(new THREE.Mesh(WAVE_GEO, waveBodyM));
  surge.add(new THREE.Mesh(FOAM_GEO, foamM));
  // foam streaks running down the back slope
  for (let i=0;i<5;i++){ const st = rbox(1.6+i*.3,0.18,0.5,.5,foamM); st.position.set(-1.5-i*1.1, 7.6-i*1.5, -2.6+i*1.3); st.rotation.z = 0.75 - i*.08; surge.add(st); }
  const bear = buildBearSuit(); bear.position.set(-1.8,0.2,2.4); bear.scale.setScalar(.85); bear.rotation.y = 0.25; surge.add(bear);
  const sea = [];
  [[0.6,3.6,2.9,2.0,'f'],[-4.2,3.0,2.6,1.3,'s'],[1.6,6.4,2.4,1.3,'c'],[-5.5,1.2,2.4,1.1,'f'],[4.0,1.3,2.8,1.0,'s'],[-0.8,7.2,2.2,0.9,'c'],[2.2,1.4,3.0,1.3,'s'],[-2.6,5.6,2.4,1.1,'f'],[-6.2,0.6,1.0,0.9,'c']].forEach(([x,y,z,sc,k],i)=>{
    const m = k==='f' ? fishMesh(sc,[0x6f8fb8,0xd8584a,0xe0b040][i%3]) : k==='s' ? shrimpMesh(sc) : clamMesh(sc);
    m.position.set(x,y,z); surge.add(m); sea.push(m);
  });
  g.sea = sea; g.bear = bear; g.surge = surge; return g;
}
const sSkinM = L({map:sSkinTex}), sShirtM = L({map:sShirtTex}), sFrontM = L({map:sFrontTex}), sSleeveM = L({map:sSleeveTex}), sPantsM = L({map:sPantsTex});
function buildSeafood(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:sfFaces.normal});
  const c = buildChar({
    skinM:sSkinM, faceM, headW:0.98, headH:1.18,
    torsoMat:[sShirtM,sShirtM,sShirtM,sShirtM,sFrontM,sShirtM],
    sleeve:[0.64,0.85], sleeveMat:()=>[sSleeveM,sSleeveM,sShirtM,sShirtM,sSleeveM,sSleeveM],
    pantsM:sPantsM, shoeM, soleM:greySole,
    collar(chest){ const cl = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.05,4,12), L({color:0x1c2448})); cl.rotation.x = Math.PI/2; chest.add(at(cl,0,2.22,0.02)); },
    hair(head){
      head.add(at(rbox(1.14,0.56,1.14,.62,hairM),0,0.47,-0.02));
      head.add(at(rbox(1.1,1.0,0.56,.6,hairM),0,0.06,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.12,0.5,0.5,.4,hairM),s*0.52,0.15,0.0)));
      [[-0.36,0.25,-0.12],[-0.13,0.2,0.05],[0.1,0.22,-0.05],[0.34,0.26,0.12]].forEach(([x,y,r])=>{
        const f = rbox(0.3,0.42,0.15,.5,hairM); f.position.set(x,y,0.47); f.rotation.z = r; head.add(f);
      });
    }
  }, parent);
  const fish = fishMesh(1.0, 0x6f8fb8); fish.rotation.z = -Math.PI/2; fish.position.set(0,-1.1,0.1); c.R.hd.add(fish);
  const trident = tridentMesh(); c.R.hd.add(trident);
  const clam = clamMesh(1.4); clam.position.set(0,-0.5,0.2); c.R.hd.add(clam);
  const shrimp = shrimpMesh(0.9); shrimp.position.set(0,-0.35,0.25); c.R.hd.add(shrimp);
  const board = new THREE.Group(); c.root.add(board);
  board.add(at(rbox(1.3,0.2,4.6,.6,L({color:0xf4f0e6})),0,0.1,0));
  board.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.25,0.22,4.2),L({color:0xe0483c})),0,0.12,0));
  c.props = {fish, trident, clam, shrimp, board};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = sfFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = sfFaces[k]; faceM.needsUpdate = true; } };
  return c;
}
// 雲嵐's final: a tsunami full of seafood (and a bear suit), surfing on top
function updateSeafoodFinal(F, dt, t){
  const f = F.owner, v = F.target, dir = F.dir;
  F.x += dir*(F.t < .35 ? 8 : 26)*dt;
  F.mesh.position.set(F.x, Math.sin(t*6)*.15, 0);
  F.mesh.sea.forEach((m,i)=>{ m.rotation.z = Math.sin(t*8 + i)*.5; });
  F.mesh.bear.head.rotation.z = Math.sin(t*5)*.15;
  const grow = Math.min(1, .25 + F.t*2.5);
  F.mesh.scale.set(grow, grow, 1);
  F.mesh.surge.scale.y = 1 + Math.sin(t*5)*.04; F.mesh.surge.position.x = Math.sin(t*3.3)*.25;
  const spray = (x,y,sz,life)=>{ const p = spriteOf(puffTex, sz, 0xeefbff); p.material.transparent = true; p.position.set(x,y,(Math.random()-.5)*6); scene.add(p); G.fx.push({o:p, t:0, life, grow:sz*1.3, base:sz}); };
  if (Math.random() < dt*45) spray(F.x + dir*(1 + Math.random()*4.2)*grow, (8.4 + Math.random()*2)*grow, .8 + Math.random()*.8, .5);
  if (Math.random() < dt*30) spray(F.x + dir*(5.6 + Math.random()*1.5)*grow, .4 + Math.random()*1.4, 1 + Math.random(), .6);
  if (Math.random() < dt*22) spray(F.x - dir*(5 + Math.random()*4)*grow, .5 + Math.random()*2.5, .9 + Math.random()*.6, .9);
  const edge = dir > 0 ? MAIN.x2 : MAIN.x1;
  if (F.riding){
    if (f.state==='dead') F.riding = false;
    else {
      f.x = F.x; f.y = 9.1*Math.min(1, .25 + F.t*2.5); f.vx = f.vy = 0; f.face = dir; f.state = 'final'; f.onGround = false;
      if ((F.x - (edge - dir*4))*dir > 0){ F.riding = false; f.finalT = .01; f.vy = 18; f.vx = -dir*8; f.x = edge - dir*5; pop('衝浪成功！', f.x, f.y+7); }
    }
  }
  // the wave sweeps up EVERY fighter it reaches, not just the target
  F.caught = F.caught || new Map();
  for (const w of G.fighters){
    if (w===f || F.caught.has(w) || !w.hittable()) continue;
    if (Math.abs(w.x - (F.x + dir*1.5)) < 4.6 && w.y < 12 && w.y > -6){
      F.caught.set(w, {hitT:0, n:0, done:false, slot:F.caught.size});
      w.state = 'stuck'; w.move = null; w.vx = w.vy = 0; w.pct += 6;
      SFX.splash(); SFX.boom(); G.shake = reduce ? .2 : 1; spark(w.x, w.y+3, 3); pop('被海鮮淹沒！', w.x, w.y+9, 'big');
    }
  }
  for (const [w, C] of F.caught){
    if (C.done) continue;
    if (w.state==='dead'){ C.done = true; continue; }
    C.hitT += dt;
    w.x = F.x + dir*(2.2 - C.slot*.6); w.y = 3 + C.slot*1.6; w.vx = w.vy = 0; w.state = 'stuck';
    if (C.hitT > .2*(C.n+1) && C.n < 4){ C.n++; w.pct += 3; w.meter = Math.min(100, w.meter+2); SFX.chomp(); spark(w.x, w.y+4, 1.4); pop(['魚！','蝦！','蛤蜊！','熊！？'][C.n-1], w.x, w.y+8); }
    if (C.hitT > 1.0 || (F.x - edge)*dir > -1){
      C.done = true; w.state = 'idle'; launch(w, 30 + w.pct*.11, 38, dir);
      SFX.hit(40); G.shake = reduce ? .2 : 1.2; G.freeze = .15; G.flash = .3; spark(w.x, w.y+3, 4); pop('海鮮大滿貫！', w.x, w.y+9, 'big');
    }
  }
  if (Math.abs(F.x) > 75){
    for (const [w, C] of F.caught) if (!C.done && w.state==='stuck'){ C.done = true; w.state = 'idle'; launch(w, 30 + w.pct*.11, 38, dir); }
    return true;
  }
  return false;
}
function seafoodFinal(f, opp){
    f.finalT = 99; banner('大海嘯！海鮮吃到飽！'); SFX.wave(); SFX.splash();
    pop('津波だ！', f.x, f.y+7.5, 'big');
    const dir = Math.sign(opp.x - f.x) || f.face;
    const wave = buildTsunami(dir); wave.position.set(f.x - dir*3, 0, 0); scene.add(wave);
    f.face = dir;
    G.finals.push({type:'seafood', owner:f, target:opp, dir, t:0, mesh:wave, x:f.x - dir*3, riding:true, hitT:0, n:0, update:updateSeafoodFinal, dispose:(F)=>{ if (F.riding) F.owner.finalT = .01; scene.remove(F.mesh); }});
}
// 雲嵐 wins: all-you-can-eat seafood, plates pile up, belly grows, giant N1 behind him
const plateM = L({color:0xf8f6f0}), plateRimM = L({color:0x3c6fe8});
const n1Tex = tex(128,64,(g)=>{
  g.fillStyle='#b8323a'; g.fillRect(0,0,128,64); g.fillStyle='#f2c14e'; g.fillRect(3,3,122,58); g.fillStyle='#b8323a'; g.fillRect(6,6,116,52);
  g.fillStyle='#fff6e0'; g.font='900 44px sans-serif'; g.textAlign='center'; g.fillText('N1', 46, 49);
  g.font='900 20px sans-serif'; g.fillStyle='#f2c14e'; g.fillText('合格', 98, 30); g.fillText('！', 98, 52);
});
const jpFlagTex = tex(48,32,(g)=>{ g.fillStyle='#ffffff'; g.fillRect(0,0,48,32); g.fillStyle='#bc002d'; g.beginPath(); g.arc(24,16,9.6,0,7); g.fill(); });
const bibTex = tex(16,16,(g)=>{ g.fillStyle='#f8f6f0'; g.fillRect(0,0,16,16); g.fillStyle='#3c8ad8'; g.fillRect(0,0,16,2); g.fillRect(0,0,1,16); g.fillRect(15,0,1,16); g.fillStyle='#ff7a4a'; g.fillRect(6,8,4,3); });
function seafoodWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  const table = new THREE.Group(); table.position.set(wp.x + 4.4, RS_Y, 2); scene.add(table); R.items.push(table);
  const wood = L({color:0x9a6a3c});
  table.add(at(rbox(4.6,0.3,2.6,.2,wood),0,2.6,0));
  [[-2,-1],[2,-1],[-2,1],[2,1]].forEach(([x,z])=>table.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.2,2.5,0.2),wood),x*0.95,1.25,z*0.95)));
  R.table = table; R.plates = []; R.foods = []; R.nextPlate = .5;
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.8,10,8), sShirtM); belly.position.set(0,0.75,0.25); belly.scale.setScalar(.3); W.m.chest.add(belly);
  const bib = new THREE.Mesh(new THREE.BoxGeometry(1.1,0.95,0.05), L({map:bibTex})); bib.position.set(0,1.6,0.52); bib.rotation.x = -0.12; W.m.chest.add(bib);
  R.attach.push(belly, bib); R.belly = belly;
  const n1 = new THREE.Mesh(new THREE.PlaneGeometry(12,6), new THREE.MeshBasicMaterial({map:n1Tex, fog:false})); n1.position.set(wp.x + 2.5, RS_Y + 10, -12); n1.scale.setScalar(.001); scene.add(n1); R.items.push(n1); R.n1 = n1;
}
function seafoodWinUpdate(R, dt, k){
  const W = R.W, tb = R.table;
  W.m.holder.rotation.y = 0.7;
  if (R.t < 4.6){
    const bite = Math.sin(R.t*12) > 0;
    applyPose(W.m, bite ? POSE.eat : STANCE, k); W.m.setFace(bite ? 'chew' : 'normal');
    W.m.props.shrimp.visible = true;
    if (R.t > R.nextPlate){
      R.nextPlate += .32;
      const n = R.plates.length, col = n%2, row = Math.floor(n/2);
      const p = new THREE.Group(); p.add(cyl(0.75,0.6,0.14,plateM,12));
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.7,0.05,4,12),plateRimM); rim.rotation.x = Math.PI/2; rim.position.y = 0.07; p.add(rim);
      p.position.set(-1.0 + col*2.0, 2.85 + row*0.17, 0.2); tb.add(p); R.plates.push(p);
      R.foods.forEach(fd=>fd.visible = false);
      const kind = n%3, fd = kind===0 ? fishMesh(.7,0xd8584a) : kind===1 ? shrimpMesh(.6) : clamMesh(.8);
      fd.position.set(p.position.x, p.position.y + .35, 0.2); tb.add(fd); R.foods.push(fd);
      SFX.chomp(); if (n%3===2) popAt(['おいしい！','もう一皿！','おかわり！','うまい！'][((n/3)|0)%4], W, 8.5);
    }
    const g = Math.min(1.7, .3 + R.t*.32); R.belly.scale.set(g, g*.95, g*1.1);
  } else {
    W.m.props.shrimp.visible = false;
    applyPose(W.m, POSE.full, k); W.m.setFace('normal');
    once('burp', 4.7, ()=>{ SFX.soft(); popAt('ごちそうさまでした！', W, 9, 'big'); });
    R.belly.scale.set(1.7 + Math.sin(R.t*3)*.05, 1.62, 1.87);
  }
  once('n1', 3.4, ()=>{ SFX2.fanfare(); popAt('N1 合格！', W, 10, 'big'); });
  if (R.t > 3.4){ const u = Math.min(1, (R.t-3.4)/.35); R.n1.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.3))); R.n1.position.y = RS_Y + 10 + Math.sin(R.t*2)*.2; }
}
// 雲嵐 loses: falls into the sea, gets mobbed by seafood, a Japanese flag gets planted on him
function seafoodLoseSetup(R){
  const lp = R.Lz.m.holder.position;
  const sea = new THREE.Mesh(new THREE.CircleGeometry(5.5,20), new THREE.MeshLambertMaterial({color:0x2f86c8, transparent:true, opacity:.88})); sea.rotation.x = -Math.PI/2; sea.position.set(lp.x, RS_Y + .05, lp.z); scene.add(sea); R.items.push(sea);
  R.sea0 = {x:lp.x, z:lp.z}; R.mobs = [];
  for (let i=0;i<6;i++){ const m = i%3===0 ? fishMesh(1.1,[0x6f8fb8,0xd8584a][i%2]) : i%3===1 ? shrimpMesh(.9) : clamMesh(1.1); m.visible = false; scene.add(m); R.items.push(m); R.mobs.push(m); }
  const flag = new THREE.Group(); flag.add(at(cyl(0.05,0.05,2.6,L({color:0x8a6a44}),5),0,1.3,0));
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.0), new THREE.MeshLambertMaterial({map:jpFlagTex, side:THREE.DoubleSide})); cloth.position.set(0.78,2.1,0); flag.add(cloth);
  flag.scale.setScalar(.001); scene.add(flag); R.items.push(flag); R.flag = flag;
}
function seafoodLoseUpdate(R, dt, k){
  const Lz = R.Lz, hp = Lz.m.holder.position, s0 = R.sea0;
  if (R.t < .8){ applyPose(Lz.m, POSE.dizzy, k); once('sl0', .2, ()=>popAt('あれ……？', Lz, 7.5, 'blue')); return; }
  if (!R.splashed){
    const u = (R.t - .8)/.5; hp.y = RS_Y + Math.sin(Math.min(1,u)*Math.PI)*2.5 - Math.max(0,u-.5)*6;
    applyPose(Lz.m, POSE.hurt, k);
    if (u >= 1){ R.splashed = true; SFX.splash(); burst(s0.x, RS_Y+1, 0x5fb6ff, 24, 12); burst(s0.x, RS_Y+1, 0xffffff, 10, 9); popAt('ドボン！', Lz, 6, 'big'); }
    return;
  }
  hp.y = RS_Y - 2.9 + Math.sin(R.t*3)*.25; hp.x = s0.x;
  Lz.m.setFace('cry'); applyPose(Lz.m, POSE.sob, k);
  if (Math.random() < dt*6) burst(s0.x + (Math.random()-.5)*4, RS_Y+.3, 0x9fd0ff, 1, 3);
  const top = hp.y + 5.6;
  R.mobs.forEach((m,i)=>{
    const t0 = 1.5 + i*.18; if (R.t < t0) return;
    m.visible = true;
    const a = i/6*Math.PI*2 + R.t*.8, ph = (R.t - t0)*1.6, u = ph % 1, r = 2.8*(1-u);
    m.position.set(s0.x + Math.cos(a)*r, RS_Y + (top + .5 - RS_Y)*u + Math.sin(u*Math.PI)*2.4, s0.z + Math.sin(a)*r);
    m.rotation.z += dt*8;
    const n = Math.floor(ph);
    if (n !== m.userData.n){ m.userData.n = n; if (n > 0){ SFX.chomp(); spark(hp.x, top, 1.2); if (Math.random() < .5) popAt(['痛い！','いたっ','やめて～','ぎゃー'][(i+n)%4], Lz, 6.5, 'red'); } }
  });
  if (R.t > 3.8){
    const u = Math.min(1, (R.t-3.8)/.25);
    R.flag.scale.setScalar(Math.max(.001, u)); R.flag.position.set(hp.x - .2, top - .3, hp.z); R.flag.rotation.z = .15;
    once('flag', 3.8, ()=>{ SFX.spike(); popAt('ざんねん……', Lz, 3.5, 'blue'); });
  }
}
/* ---------- 造型：海神波賽頓（童話神話風：短髮＋金冠＋白鬍子＋海藍神袍＋貝殼肩甲） ---------- */
const sfPosBlue = '#1f6f9c', sfPosBlueC = ['#2a82b2','#185e87','#2f8fc0'];
const sfPosWaves = (g,w,h)=>{ g.fillStyle='rgba(190,235,255,.35)'; for (let y=5;y<h;y+=8) for (let x=0;x<w;x+=8){ g.fillRect(x,y,4,1); g.fillRect(x+4,y-1,4,1); } };
const sfPosSideTex = tex(32,32,(g)=>{ speckle(g,32,32,sfPosBlue,sfPosBlueC,.45); sfPosWaves(g,32,32); });
const sfPosFrontTex = tex(32,46,(g)=>{
  speckle(g,32,46,sfPosBlue,sfPosBlueC,.45); sfPosWaves(g,32,46);
  g.fillStyle=S_SKIN; for (let y=0;y<10;y++){ const w = Math.max(1,((10-y)*1.1)|0); g.fillRect(16-w,y,w*2,1); }   // V 領露出胸口
  g.fillStyle='#e9b630'; for (let i=0;i<46;i++) g.fillRect((3+i*0.55)|0, i, 4, 1);                               // 金色斜肩帶
  g.fillStyle='#fff6e6'; g.fillRect(15,23,3,3); g.fillStyle='#ff7f6e'; g.fillRect(14,26,5,1);                    // 珍珠 + 珊瑚
  g.fillStyle='#e9b630'; g.fillRect(0,44,32,2);
});
const sfPosSleeveTex = tex(16,16,(g)=>{ speckle(g,16,16,sfPosBlue,sfPosBlueC,.45); g.fillStyle='#e9b630'; g.fillRect(0,12,16,4); g.fillStyle='#fff6e6'; g.fillRect(2,13,2,2); g.fillRect(7,13,2,2); g.fillRect(12,13,2,2); });
const sfPosKiltTex = tex(32,32,(g)=>{ speckle(g,32,32,sfPosBlue,sfPosBlueC,.45); g.fillStyle='rgba(10,40,70,.35)'; for (let x=0;x<32;x+=4) g.fillRect(x,0,1,32); });
const sfPosCapeTex = tex(16,32,(g)=>{
  speckle(g,16,32,'#16808a',['#1b929d','#117078','#1f9aa6'],.45);
  g.fillStyle='rgba(200,255,245,.3)'; for (let y=4;y<28;y+=8) for (let x=0;x<16;x+=8){ g.fillRect(x,y,4,1); g.fillRect(x+4,y-1,4,1); }
  g.fillStyle='#e9b630'; g.fillRect(0,29,16,3);
});
const sfPosGoldM = L({color:0xe9b630}), sfPosPearlM = L({color:0xfff6e6}), sfPosCoralM = L({color:0xff7f6e});
const sfPosSideM = L({map:sfPosSideTex}), sfPosFrontM = L({map:sfPosFrontTex}), sfPosSleeveM = L({map:sfPosSleeveTex});
const sfPosKiltM = L({map:sfPosKiltTex}), sfPosCapeM = L({map:sfPosCapeTex}), sfPosBeardM = L({color:0xe6eef2}), sfPosLegM = L({map:sSkinTex});
function sfPoseidon(c){
  // 上衣：海藍神袍 + 金色斜肩帶，領口換成金色
  const torso = c.chest.children[0], old = Array.isArray(torso.material) ? torso.material[0] : torso.material;
  torso.material = [sfPosSideM,sfPosSideM,sfPosSideM,sfPosSideM,sfPosFrontM,sfPosSideM];
  c.chest.children.forEach(o=>{ if (o === torso || !o.isMesh) return; if (o.geometry && o.geometry.type === 'TorusGeometry') o.material = sfPosGoldM; else if (o.material === old) o.material = sfPosSideM; });
  // 袖子 + 貝殼肩甲（珊瑚角 + 珍珠）
  [c.R.sh, c.Lf.sh].forEach(sh=>{
    const first = sh.children[0]; if (first && first.isMesh) first.material = sfPosSleeveM;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.5,8,5,0,Math.PI*2,0,Math.PI/2), sfPosGoldM); dome.scale.set(1.05,.6,1.05); dome.position.y = 0.12; sh.add(dome);
    sh.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.1,6,5),sfPosPearlM),0,0.45,0));
    [-1,1].forEach(s=>{ const k = new THREE.Mesh(new THREE.ConeGeometry(0.07,0.3,4),sfPosCoralM); k.position.set(s*0.24,0.4,0); k.rotation.z = -s*0.5; sh.add(k); });
  });
  // 披風：海綠色，金邊
  c.chest.add(at(rbox(1.9,3.2,0.1,.3,sfPosCapeM),0,0.6,-0.58));
  // 金項鍊 + 珍珠
  c.chest.add(at(rbox(1.0,0.06,0.06,.3,sfPosGoldM),0,2.0,0.5));
  [-0.55,0.55].forEach(x=>c.chest.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.09,6,5),sfPosGoldM),x,2.1,0.47)));
  c.chest.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.11,6,5),sfPosPearlM),0,1.95,0.52));
  // 腰帶 + 短裙 + 垂下的裙片
  c.hips.add(at(rbox(1.68,0.24,1.0,.3,sfPosGoldM),0,0.05,0));
  c.hips.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.17,6,5),sfPosCoralM),0,0.05,0.52));
  c.hips.add(at(rbox(1.76,0.9,0.98,.4,sfPosKiltM),0,-0.5,0));
  [-0.7,-0.35,0,0.35,0.7].forEach(x=>{
    c.hips.add(at(rbox(0.3,0.6,0.07,.4,sfPosKiltM),x,-1.0,0.52));
    c.hips.add(at(rbox(0.3,0.08,0.075,.3,sfPosGoldM),x,-1.3,0.52));
  });
  // 腿：露出小腿 + 金色護脛
  [c.joints.rHp, c.joints.lHp].forEach(hp=>{ if (hp && hp.children[0] && hp.children[0].isMesh) hp.children[0].material = sfPosLegM; });
  [c.joints.rKn, c.joints.lKn].forEach(kn=>{
    if (!kn) return;
    if (kn.children[0] && kn.children[0].isMesh) kn.children[0].material = sfPosLegM;
    kn.add(at(rbox(0.68,0.5,0.72,.3,sfPosGoldM),0,-0.55,0));
  });
  // 頭：金冠（短髮保留）+ 銀白鬍子
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.58,0.07,5,14),sfPosGoldM); ring.rotation.x = Math.PI/2; ring.position.set(0,0.78,-0.02); c.head.add(ring);
  for (let i=0;i<6;i++){
    const a = i/6*Math.PI*2, tall = i===0 ? 1.45 : 1;
    const sp = new THREE.Mesh(new THREE.ConeGeometry(0.09,0.4*tall,4),sfPosGoldM); sp.position.set(Math.sin(a)*0.56,0.78+0.2*tall,-0.02+Math.cos(a)*0.56); c.head.add(sp);
    c.head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.06,5,4),sfPosPearlM),Math.sin(a)*0.56,0.78+0.42*tall,-0.02+Math.cos(a)*0.56));
  }
  c.head.add(at(rbox(0.74,0.55,0.36,.5,sfPosBeardM),0,-0.74,0.38));
  c.head.add(at(rbox(0.42,0.42,0.3,.5,sfPosBeardM),0,-1.08,0.36));
  [-1,1].forEach(s=>c.head.add(at(rbox(0.16,0.34,0.3,.5,sfPosBeardM),s*0.4,-0.62,0.3)));
  // 三叉戟加一顆珍珠
  if (c.props && c.props.trident) c.props.trident.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.13,6,5),sfPosPearlM),0,-2.95,0.1));
}
registerChar('seafood', {
  stats: { name:'雲嵐', en:'Seafood Master', tag:'海鮮狂熱・日文系・目標N1', weight:0.85, run:16, air:12.5, jumpV:33, djV:29, jumps:2 },
  skins: [{ name:'生日帽', apply(c){ const h = birthdayHat('#5fb6ff','#ffffff',0xe0483c); h.position.set(0.05,0.66,-0.02); c.head.add(h); } },
    { name:'海神波賽頓', apply(c){ sfPoseidon(c); } }],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.08,.1,.26], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:5, kb:8, sc:.7, ang:38, text:'おいしい！', dash:5, sfx:'chomp'},
    side:{t:[.24,.1,.32], pose:['batWind','batHit'], box:[2.9,3.4,1.7], dmg:15, kb:12, sc:1.1, ang:36, prop:'fish', text:'鮪魚甩擊！', sfx:'swing'},
    up:{t:[.16,.12,.28], pose:['upWind','upHit'], box:[0.5,7.0,1.8], dmg:12, kb:11, sc:1, ang:88, prop:'trident', text:'三叉戟！', sfx:'swing'},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[2.0,0.9,1.8], dmg:11, kb:9, sc:.85, ang:70, prop:'clam', text:'蛤蜊夾！', sfx:'chomp'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['batWind','batHit'], box:[2.5,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'fish', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.8,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1, prop:'trident'},
    dair:{t:[.18,.1,.25], pose:['bookUp','bookSlam'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'clam', sfx:'chomp'},
    nB:{t:[.18,.05,.25], pose:['throwWind','throwHit'], prop0:'shrimp', fire:[[.18,'shrimp']], air:1, sfx:'swing'},
    sB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], prop0:'fish', fire:[[.2,'fishDart']], air:1},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, prop:'trident', start:'spoutJump', box:[0.4,5.2,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.15,.5,.3], pose:['eat','throwHit'], poseSwitch:.4, prop0:'clam', fire:[[.2,'clam0'],[.45,'clam1']], air:1, text:'いただきます！', sfx:'chomp'},
  },
  fire: {
  shrimp(f){ proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.4, vx:f.face*22, vy:5, g:16, r:.85, life:1.3, dmg:6, kb:6, sc:.5, ang:40, mesh:shrimpMesh(1.1), spin:1}); pop('蝦子！', f.x, f.y+7); },
  fishDart(f){ const m = fishMesh(1.5, 0x4f6f9a); m.scale.x *= f.face; proj({owner:f, x:f.x+f.face*2, y:f.y+3.6, vx:f.face*34, vy:0, g:0, wave:.4, r:1.1, life:.9, dmg:10, kb:11, sc:.85, ang:32, mesh:m}); pop('鮪魚飛彈！', f.x, f.y+7); SFX.splash(); },
  clam0(f){ FIRE._clam(f,0); }, clam1(f){ FIRE._clam(f,1); },
  _clam(f,i){ proj({owner:f, x:f.x+f.face*1.2, y:f.y+4.4, vx:f.face*(10+i*6), vy:13-i*3, g:34, r:.9, life:2.2, bounce:1, dmg:5, kb:4, sc:.3, ang:50, onHit:'clamp', mesh:clamMesh(1.3), spin:1}); SFX.chomp(); },
  },
  start: {
  spoutJump(f){ f.vy = 34; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; pop('鯨魚噴泉！', f.x, f.y+7); burst(f.x, f.y+1, 0x5fb6ff, 14, 10); SFX.splash(); },
  },
  onhit: {
  clamp(a,v){ v.state = 'stun'; v.stunT = .7; v.move = null; v.vx *= .3; pop('被蛤蜊夾住！', v.x, v.y+7.5, 'red'); SFX.chomp(); },
  },
  poses: {
  eat: S_({rSh:[-1.35,0,0.55], rEl:[-2.25], lSh:[-1.0,0,-0.25], lEl:[-1.7], head:[0.12], chest:[0.15], drop:-0.15}),
  surf: S_({rSh:[-0.2,0,-1.35], lSh:[-0.2,0,1.35], rEl:[-0.2], lEl:[-0.2], rHp:[-0.55,0,-0.25], lHp:[0.35,0,0.25], rKn:[0.9], lKn:[0.6], chest:[0.25], head:[-0.1], drop:-0.6}),
  full: P({rSh:[-0.7,0,-0.35], lSh:[-0.7,0,0.35], rEl:[-1.3], lEl:[-1.3], chest:[-0.3], head:[-0.35], rHp:[-0.15], lHp:[-0.15], drop:-0.1}),
  },
  sfx: {
  roar(){ noise(.9,.45,180); tone(110,.8,'sawtooth',.2,.55); tone(82,.9,'square',.12,.6,.05); },
  splash(){ noise(.45,.35,700); noise(.3,.18,2600,.05); },
  chomp(){ tone(260,.05,'square',.1,.6); noise(.04,.1,1800); tone(260,.05,'square',.1,.6,.11); noise(.04,.1,1800,.11); },
  wave(){ noise(1.8,.4,240); noise(1.4,.22,900,.25); tone(70,1.2,'sawtooth',.12,.5); },
  },
  build: buildSeafood, face: sfFaces.normal, portraitBg: '#5fb6d9',
  portrait(g){ g.fillRect(4,4,56,18); g.fillRect(3,10,7,26); g.fillRect(54,10,7,26); for (let i=0;i<6;i++) g.fillRect(8+i*8,18,8,6+(i%2)*3); g.fillStyle = '#4fb05a'; g.fillRect(16,58,4,6); g.fillRect(44,58,4,6); },
  breakText: '吃撐了！', shieldPose: 'eat', shieldProp: 'shrimp', finalPose: 'surf', finalProp: 'board',
  animate(f, m, s, t, dt){ if (s==='shield'){ m.setFace(Math.sin(t*16) > 0 ? 'chew' : 'normal'); if (Math.random() < dt*6) drip(f.x + f.face*.5, f.y+5, 0xff8a5a); } },
  readyPose: (t)=> Math.sin(t*14) > 0 ? POSE.eat : POSE.cheer,
  selectSfx: ()=>SFX.chomp(),
  winSub: '"Itadakimasu!"',
  final: seafoodFinal, winSetup: seafoodWinSetup, winUpdate: seafoodWinUpdate, loseSetup: seafoodLoseSetup, loseUpdate: seafoodLoseUpdate, longWin: true, longLose: true,
});
