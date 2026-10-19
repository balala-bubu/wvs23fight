/* 提姆熊 Tim Bear — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- 提姆熊（Tim Bear） ---------- */
const TB_SKIN = '#dca07c', TB_SKIN_C = ['#d2956f','#e6ae8a','#d89a76'];
const tbSkinTex = tex(16,16,(g)=>speckle(g,16,16,TB_SKIN,TB_SKIN_C,.4));
function timFace(g, mode){
  speckle(g,64,64,TB_SKIN,TB_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(215,105,85,.25)'; g.beginPath(); g.ellipse(13,43,8,6,0,0,7); g.fill(); g.beginPath(); g.ellipse(51,43,8,6,0,0,7); g.fill();
  g.fillStyle='#1d1512';
  if (mode==='shout'){ g.fillRect(13,26,5,2); g.fillRect(18,27,6,2); g.fillRect(40,27,6,2); g.fillRect(46,26,5,2); }
  else if (mode==='cry'){ g.fillRect(13,28,5,2); g.fillRect(18,27,6,2); g.fillRect(40,27,6,2); g.fillRect(46,28,5,2); }
  else { g.fillRect(14,27,11,2); g.fillRect(39,27,11,2); }
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(15,35); g.lineTo(25,35); g.stroke(); g.beginPath(); g.moveTo(39,35); g.lineTo(49,35); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,37,3,15); g.fillRect(44,37,3,15);
  } else if (mode==='shout'){
    g.fillStyle='#1d1512'; g.fillRect(17,33,6,4); g.fillRect(41,33,6,4);
  } else {
    g.beginPath(); g.arc(20,35,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,35,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  }
  g.fillStyle='rgba(150,80,55,.5)'; g.fillRect(27,36,10,7); g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,42,3,1); g.fillRect(34,42,3,1);
  if (mode==='shout'){
    g.fillStyle='#4a1715'; g.beginPath(); g.ellipse(32,52,9,6,0,0,7); g.fill(); g.fillStyle='#efe2c8'; g.fillRect(25,46,14,2); g.fillStyle='#c0505a'; g.fillRect(28,54,8,2);
  } else if (mode==='cry'){
    g.beginPath(); g.moveTo(22,54); g.quadraticCurveTo(32,47,42,54); g.quadraticCurveTo(32,51,22,54); g.closePath(); g.fillStyle='#4a1715'; g.fill();
  } else {
    g.beginPath(); g.moveTo(17,47); g.quadraticCurveTo(32,44,47,47); g.quadraticCurveTo(42,57,32,57); g.quadraticCurveTo(22,57,17,47); g.closePath(); g.fillStyle='#4a1715'; g.fill();
    g.save(); g.clip(); g.fillStyle='#efe2c8'; g.fillRect(16,45,32,5); g.fillStyle='#c9b590'; [24,29,34,39].forEach(x=>g.fillRect(x,45,1,5)); g.restore();
  }
  g.fillStyle='rgba(40,30,25,.35)'; for (let i=0;i<14;i++) g.fillRect(24+((i*7)%16), 58+(i%3), 1, 1);
}
const timFaces = { normal:tex(64,64,(g)=>timFace(g,'normal')), cry:tex(64,64,(g)=>timFace(g,'cry')), shout:tex(64,64,(g)=>timFace(g,'shout')) };
const JK_COL = '#3d524f', JK_C = ['#445b58','#354846','#4b6360'];
const jkTex = tex(32,32,(g)=>speckle(g,32,32,JK_COL,JK_C,.45));
const jkFrontTex = tex(32,46,(g)=>{
  speckle(g,32,46,JK_COL,JK_C,.45);
  g.fillStyle='#283836'; g.fillRect(15,0,2,46); g.fillStyle='#b8c0be'; for (let y=0;y<46;y+=2) g.fillRect(16,y,1,1);
  g.fillStyle='#283836'; g.fillRect(4,16,8,1); g.fillRect(20,16,8,1); g.fillRect(4,34,9,2); g.fillRect(19,34,9,2);
  g.fillStyle='#3a5fa8'; g.fillRect(13,0,2,6);
});
const tbPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#555b66',['#5f6570','#4a505a','#666c78'],.5); });
const crocTex = tex(16,16,(g)=>{ speckle(g,16,16,'#f2c81e',['#f6d44a','#e4b812'],.35); g.fillStyle='#b88a10'; for (let y=2;y<16;y+=4) for (let x=(y%8?1:3);x<16;x+=4) g.fillRect(x,y,2,2); });
const honeyM = new THREE.MeshLambertMaterial({color:0xe8a020, transparent:true, opacity:.9}), lidM = L({color:0x7a4a20}), labelM = L({color:0xf4f0e6});
function honeyJarMesh(s){
  const g = new THREE.Group();
  g.add(cyl(0.42,0.38,0.8,honeyM,10));
  g.add(at(cyl(0.44,0.44,0.28,labelM,10),0,-0.05,0));
  g.add(at(cyl(0.34,0.36,0.2,lidM,10),0,0.5,0));
  g.add(at(cyl(0.4,0.4,0.08,lidM,10),0,0.38,0));
  g.scale.setScalar(s); return g;
}
const rantTexs = ['蛤？','笑死','你很吵欸','!?','看這張圖'].map(t=>tex(64,40,(g)=>{
  g.fillStyle='#fff'; g.beginPath(); g.ellipse(32,18,30,16,0,0,7); g.fill(); g.beginPath(); g.moveTo(12,28); g.lineTo(6,39); g.lineTo(22,31); g.fill();
  g.strokeStyle='#1d1512'; g.lineWidth=2; g.beginPath(); g.ellipse(32,18,30,16,0,0,7); g.stroke();
  g.fillStyle='#d8283c'; g.font='900 '+(t.length>3?13:17)+'px sans-serif'; g.textAlign='center'; g.fillText(t,32,24);
}));
const tbSkinM = L({map:tbSkinTex}), jkM = L({map:jkTex}), jkFrontM = L({map:jkFrontTex}), tbPantsM = L({map:tbPantsTex}), crocM = L({map:crocTex}), crocSoleM = L({color:0xd8a810}), strapM2 = L({color:0xff7a1a});
const furM = L({color:0x7a4a26});
function buildTim(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:timFaces.normal});
  const c = buildChar({
    skinM:tbSkinM, faceM, headW:1.12, headH:1.12,
    torsoMat:[jkM,jkM,jkM,jkM,jkFrontM,jkM], sleeve:[0.74,1.1], sleeveMat:()=>jkM,
    pantsM:tbPantsM, shoeM:crocM, soleM:crocSoleM,
    collar(chest){ chest.add(at(rbox(1.05,0.4,0.75,.4,jkM),0,2.25,0.03)); },
    hair(head){
      head.add(at(rbox(1.24,0.58,1.22,.62,hairM),0,0.46,-0.02));
      head.add(at(rbox(1.2,0.95,0.6,.6,hairM),0,0.08,-0.31));
      [-1,1].forEach(s=>head.add(at(rbox(0.12,0.5,0.55,.4,hairM),s*0.58,0.16,0.0)));
      [[-0.4,0.27],[-0.18,0.24],[0.04,0.23],[0.24,0.25],[0.42,0.28]].forEach(([x,y],i)=>{ const f = rbox(0.28,0.38,0.15,.5,hairM); f.position.set(x,y,0.5); f.rotation.z = (i-2)*0.06; head.add(f); });
    }
  }, parent);
  c.root.scale.set(1.15,1.1,1.15);
  [c.R, c.Lf].forEach(a=>{ a.sh.children[1].material = jkM; a.el.children[0].material = jkM; });
  [c.joints.rKn, c.joints.lKn].forEach(kn=>{ kn.children[1].scale.set(1.15,1.25,1.12); kn.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.74,0.12,0.12), strapM2),0,-1.36,-0.32)); });
  const pan = new THREE.Group(); c.R.hd.add(pan);
  pan.add(at(cyl(0.06,0.06,1.2,black,5),0,-0.7,0));
  const dish = cyl(0.8,0.7,0.15,L({color:0x2a2a2e}),12); dish.rotation.x = Math.PI/2; dish.position.set(0,-1.8,0); pan.add(dish);
  const camera = new THREE.Group(); camera.position.set(0,-0.35,0.25); c.R.hd.add(camera);
  camera.add(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.48,0.38), black));
  const lens = cyl(0.17,0.17,0.3,L({color:0x6a7078}),8); lens.rotation.x = Math.PI/2; lens.position.z = 0.3; camera.add(lens);
  camera.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.14,0.08,0.08), L({color:0xffffff, emissive:0x888888})),0.22,0.3,0));
  const honey = honeyJarMesh(0.9); honey.position.set(0,-0.45,0.2); c.R.hd.add(honey);
  // bear hood (shield / bear mode)
  const hood = new THREE.Group(); hood.position.set(0,0.08,0.02); c.head.add(hood);
  hood.add(rbox(1.6,1.5,1.4,.6,furM));
  [-1,1].forEach(s=>hood.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.3,7,5),furM),s*0.62,0.72,0)));
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.5,0.09,5,16), bearLightM); rim.position.set(0,-0.12,0.7); hood.add(rim);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.92,0.92), faceM); win.position.set(0,-0.12,0.71); hood.add(win);
  hood.visible = false;
  c.props = {pan, camera, honey};
  const propSet = new Set(); [pan,camera,honey,hood].forEach(o=>o.traverse(m=>propSet.add(m)));
  const fur = [];
  c.hips.traverse(m=>{ if (m.isMesh && !propSet.has(m) && m !== c.head.children[0]) fur.push([m, m.material]); });
  c.setHood = (on)=>{ hood.visible = on; };
  // bear mode: hide the human body and show one clean round bear
  const bearParts = [];
  const bp = (parent, m, x, y, z)=>{ m.position.set(x,y,z); m.visible = false; parent.add(m); bearParts.push(m); return m; };
  const tummy = new THREE.Mesh(new THREE.SphereGeometry(1.25,14,10), furM); tummy.scale.set(1.0,1.3,0.9); bp(c.chest, tummy, 0, 1.0, 0);
  const patch = new THREE.Mesh(new THREE.SphereGeometry(0.85,12,8), bearLightM); patch.scale.set(1,1.15,.45); bp(c.chest, patch, 0, 0.85, 0.78);
  bp(c.chest, new THREE.Mesh(new THREE.SphereGeometry(0.3,8,6), furM), 0, 0.0, -1.05);
  [c.R, c.Lf].forEach(a=>{ bp(a.sh, rbox(0.8,1.35,0.8,.7,furM), 0, -0.6, 0); bp(a.el, rbox(0.7,1.15,0.7,.7,furM), 0, -0.5, 0); bp(a.hd, new THREE.Mesh(new THREE.SphereGeometry(0.4,8,6), bearLightM), 0, -0.15, 0.05); });
  [c.joints.rHp, c.joints.lHp].forEach(h=>bp(h, rbox(0.95,1.8,0.95,.7,furM), 0, -0.8, 0));
  [c.joints.rKn, c.joints.lKn].forEach(k=>{ bp(k, rbox(0.85,1.5,0.9,.7,furM), 0, -0.7, 0); bp(k, rbox(0.9,0.45,1.15,.6,bearLightM), 0, -1.5, 0.15); });
  c.setBear = (on)=>{ fur.forEach(([m])=>{ m.visible = !on; }); bearParts.forEach(m=>{ m.visible = on; }); hood.scale.setScalar(on ? 1.15 : 1); };
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = timFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = timFaces[k]; faceM.needsUpdate = true; } };
  return c;
}
function buildBrownBear(){
  const g = new THREE.Group();
  const body = rbox(2.6,1.5,1.5,.55,bearM); body.position.y = 1.7; g.add(body);
  const head = new THREE.Group(); head.position.set(1.5,2.3,0); g.add(head);
  head.add(rbox(1.1,1.0,1.0,.6,bearM));
  head.add(at(rbox(0.5,0.4,0.55,.5,bearLightM),0.6,-0.15,0));
  head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.16,0.14,0.18),black),0.86,-0.05,0));
  [-1,1].forEach(s=>{ head.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.22,6,4),bearM),-0.1,0.55,s*0.4)); head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.08),black),0.45,0.15,s*0.25)); });
  const legs = [[0.8,0.4],[0.8,-0.4],[-0.8,0.4],[-0.8,-0.4]].map(([x,z])=>{ const p = pivot(g,x,1.2,z); p.add(at(rbox(0.45,1.2,0.45,.5,bearM),0,-0.6,0)); return p; });
  const b = {g, legs, head, ph:Math.random()*6, walk:1};
  body.onBeforeRender = ()=>{ const t = performance.now()/1000*9 + b.ph; legs.forEach((l,i)=>{ l.rotation.z = b.walk ? Math.sin(t + (i%2 ? Math.PI : 0) + (i>1 ? .6 : 0))*0.5 : 0; }); };
  return b;
}
function bearFinal(f, opp){
    f.finalT = .9; banner('熊化！'); SFX.roar(); G.shake = reduce ? .2 : .9;
    pop('吼——！', f.x, f.y+7.5, 'big'); burst(f.x, f.y+3, 0x7a4a26, 26, 14);
    f.m.setBear(true); f.buffT = 10;
    f.D = Object.assign({}, CH.bear, {run:12.8, air:10.5, weight:1.9, jumpV:28});
    if (opp && opp.hittable() && Math.abs(opp.x - f.x) < 7 && Math.abs(opp.y - f.y) < 6){ opp.pct += 8; launch(opp, 14, 50, Math.sign(opp.x - f.x) || f.face); pop('被吼飛！', opp.x, opp.y+8); }
    G.finals.push({type:'bearMode', owner:f, t:0, update:bearModeUpdate});
}
function bearModeUpdate(F, dt){
      const f = F.owner; f.buffT = 10 - F.t;
      if (f.state!=='dead' && Math.random() < dt*6) burst(f.x + (Math.random()-.5)*2, f.y + 1 + Math.random()*5, 0x7a4a26, 1, 2);
      if (F.t >= 10){ f.buffT = 0; f.m.setBear(false); f.D = CH.bear; pop('變回人了', f.x, f.y+7.5); return true; }
      return false;
}
function grabUpdate(F){
      const f = F.owner, v = F.target;
      const free = f.state==='dead' || f.state==='hitstun' || f.state==='stun' || v.state==='dead';
      if (free){ if (v.state==='stuck') v.state = 'air'; return true; }
      if (F.t < .4){ v.x = f.x + f.face*1.6; v.y = f.y + 2.5 + F.t*5; v.vx = v.vy = 0; v.state = 'stuck'; return false; }
      else {
        v.state = 'idle'; v.pct += 9;
        launch(v, (12 + v.pct*.13)/v.D.weight*(f.buffT > 0 ? 1.15 : 1), 40, f.face);
        SFX.hit(30); G.shake = reduce ? .2 : .7; spark(v.x, v.y+3, 2.4); pop('丟出去！', v.x, v.y+8, 'big');
        return true;
      }
}
// 提姆熊 wins: cooks in a doctor's coat, eats honey, grandma calls, group photo with the bears
const _bw = new THREE.Vector3();
const photoTex = tex(64,76,(g)=>{
  g.fillStyle='#fbfaf4'; g.fillRect(0,0,64,76);
  g.fillStyle='#8fd0ff'; g.fillRect(4,4,56,52); g.fillStyle='#7fc06a'; g.fillRect(4,42,56,14);
  const bear = (x,y,r)=>{ g.fillStyle='#7a4a26'; g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.beginPath(); g.arc(x-r*.7,y-r*.7,r*.35,0,7); g.fill(); g.beginPath(); g.arc(x+r*.7,y-r*.7,r*.35,0,7); g.fill();
    g.fillStyle='#c89a6a'; g.beginPath(); g.arc(x,y+r*.3,r*.4,0,7); g.fill(); g.fillStyle='#1d1512'; g.fillRect(x-r*.4,y-r*.2,2,2); g.fillRect(x+r*.3,y-r*.2,2,2); };
  bear(12,40,7); bear(52,40,7); bear(20,24,6); bear(44,24,6);
  g.fillStyle='#f6f6f2'; g.fillRect(23,44,18,12); g.fillStyle='#3d524f'; g.fillRect(30,44,4,12);
  g.fillStyle='#dca07c'; g.beginPath(); g.arc(32,36,8,0,7); g.fill(); g.fillStyle='#151110'; g.fillRect(24,27,16,5);
  g.fillStyle='#1d1512'; g.fillRect(28,35,2,1); g.fillRect(34,35,2,1); g.fillStyle='#4a1715'; g.fillRect(29,39,6,2);
  g.fillStyle='#dca07c'; g.fillRect(42,40,3,5); g.fillRect(43,36,2,4);
  g.fillStyle='#e8a020'; g.fillRect(8,49,6,7); g.fillRect(50,49,6,7);
  g.fillStyle='#2a2420'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.fillText('熊熊聚餐', 32, 69);
});
function bearCoat(W){
  const coatM = L({color:0xf6f6f2}), edgeM = L({color:0xdedcd4}), ch = W.m.chest, out = [];
  const add = (parent, m)=>{ parent.add(m); out.push(m); return m; };
  [-1,1].forEach(s=>{
    add(ch, at(rbox(0.72,3.3,1.08,.25,coatM), s*0.6, 0.55, 0));          // the two front panels, open in the middle
    const lap = rbox(0.34,0.95,0.08,.3,edgeM); lap.position.set(s*0.34,1.85,0.57); lap.rotation.z = s*0.38; add(ch, lap);
    add(ch, at(new THREE.Mesh(new THREE.BoxGeometry(0.42,0.36,0.06), edgeM), s*0.6, -0.1, 0.56));
  });
  add(ch, at(rbox(0.6,3.3,0.12,.25,coatM),0,0.55,-0.5));
  add(ch, at(new THREE.Mesh(new THREE.BoxGeometry(0.28,0.16,0.05), L({color:0x4fa3ff})), 0.62, 1.4, 0.57));
  const tubeM = L({color:0x2a3550});
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42,0.035,4,16), tubeM); ring.rotation.x = Math.PI/2 - 0.35; ring.position.set(0,2.1,0.12); add(ch, ring);
  add(ch, at(cyl(0.03,0.03,0.8,tubeM,4), -0.12, 1.55, 0.55));
  const bell = cyl(0.12,0.12,0.06,L({color:0xcfd6da}),8); bell.rotation.x = Math.PI/2; bell.position.set(-0.12,1.12,0.58); add(ch, bell);
  [W.m.R, W.m.Lf].forEach(a=>{
    add(a.sh, at(rbox(0.84,0.9,0.84,.4,coatM),0,-0.3,0));
    add(a.sh, at(cyl(0.27,0.25,1.15,coatM,8),0,-0.65,0));
    add(a.el, at(cyl(0.25,0.23,0.85,coatM,8),0,-0.4,0));
  });
  return out;
}
function bearWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.setBear(false); W.m.setHood(false);
  R.attach.push(...bearCoat(W));
  const stove = new THREE.Group(); stove.position.set(wp.x + 4, RS_Y, 1.6); scene.add(stove); R.items.push(stove);
  stove.add(at(rbox(3.2,2.6,2.2,.15,L({color:0x9aa3ad})),0,1.3,0));
  stove.add(at(cyl(0.9,0.85,1.1,L({color:0x6a7078}),12),0,3.15,0));
  stove.add(at(cyl(0.85,0.85,0.08,L({color:0xe8a020}),12),0,3.66,0));
  R.stove = stove;
  R.food = rbox(0.8,0.3,0.8,.5,L({color:0x8a4a2a})); R.food.visible = false; scene.add(R.food); R.items.push(R.food);
  R.bears = [];
  for (let i=0;i<6;i++){
    const b = buildBrownBear(); b.i = i; const side = i%2 ? 1 : -1;
    b.g.position.set(wp.x + side*(22 + i*1.5), RS_Y, -2 + (i%3)*1.2); scene.add(b.g); R.items.push(b.g);
    b.jar = honeyJarMesh(.8); b.jar.visible = false; scene.add(b.jar); R.items.push(b.jar);
    R.bears.push(b);
  }
  R.photo = new THREE.Mesh(new THREE.PlaneGeometry(4,4.75), new THREE.MeshBasicMaterial({map:photoTex, fog:false}));
  R.photo.position.set(wp.x + 6.6, RS_Y + 7.6, 3); R.photo.scale.setScalar(.001); scene.add(R.photo); R.items.push(R.photo);
}
function bearWinUpdate(R, dt, k){
  const W = R.W, wp = W.m.holder.position, P = W.m.props;
  for (const n in P) P[n].visible = false;
  if (Math.random() < dt*8){ const p = spriteOf(puffTex, .8 + Math.random()*.6, 0xffffff); p.material.transparent = true; p.position.set(R.stove.position.x + (Math.random()-.5), RS_Y + 3.9, R.stove.position.z); scene.add(p); R.puffs.push({o:p, life:1.2, vy:2.5, grow:.6}); }
  if (R.t < 2.4){
    W.m.holder.rotation.y = 0.65; P.pan.visible = true;
    applyPose(W.m, Math.sin(R.t*8) > 0 ? POSE.jabR : STANCE, k);
    W.m.R.hd.getWorldPosition(_bw);
    const u = (R.t*1.6) % 1; R.food.visible = true;
    R.food.position.set(_bw.x + 0.6, _bw.y - 0.6 + Math.sin(u*Math.PI)*3.2, _bw.z + 0.6); R.food.rotation.x = u*Math.PI*2;
    if (Math.floor(R.t*1.6) !== R.flipN){ R.flipN = Math.floor(R.t*1.6); noise(.15,.12,2500); }
    once('w1', .3, ()=>popAt('提姆熊廚房開張！', W, 8.5));
    once('w2', 1.3, ()=>popAt('不吃我就傳怪圖給你', W, 8.5, 'red'));
  } else if (R.t < 3.4){
    R.food.visible = false; P.honey.visible = true;
    const bite = Math.sin(R.t*12) > 0;
    applyPose(W.m, bite ? POSE.eat : STANCE, k);
    if (bite && Math.random() < dt*10){ W.m.R.hd.getWorldPosition(_bw); drip(_bw.x, _bw.y, 0xe8a020); }
    once('w3', 2.5, ()=>{ SFX.chomp(); popAt('蜂蜜燉肉，讚！', W, 8.5, 'big'); });
  } else if (R.t < 4.3){
    applyPose(W.m, POSE.ponder, k);
    once('w4', 3.45, ()=>{ tone(880,.1,'sine',.1); tone(880,.1,'sine',.1,.2); popAt('奶奶：金孫有吃飽嗎～', W, 9, 'blue'); });
    once('w5', 3.95, ()=>popAt('有！跟熊一起吃！', W, 8.2));
  } else {
    W.m.holder.rotation.y = 0.2; P.camera.visible = true; applyPose(W.m, POSE.selfie, k);
    once('c3', 4.3, ()=>popAt('3', W, 9.5, 'big')); once('c2', 4.6, ()=>popAt('2', W, 9.5, 'big')); once('c1', 4.9, ()=>popAt('1', W, 9.5, 'big'));
    once('snap', 5.2, ()=>{ G.flash = .9; tone(1800,.06,'square',.1); noise(.08,.2,4000); SFX2.fanfare(); popAt('這張要傳群組！', W, 9, 'big'); });
    if (R.t > 5.2){ const u = Math.min(1,(R.t-5.2)/.35); R.photo.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.2))); R.photo.rotation.z = -0.12 + Math.sin(R.t*2)*.03; }
  }
  once('w6', 1.5, ()=>{ SFX.roar(); popAt('熊熊們～開飯！', W, 9.5, 'big'); });
  R.bears.forEach(b=>{
    if (R.t < 1.5 + b.i*.12) return;
    const tx = wp.x - 4 + b.i*2.4, tz = -3.2 + (b.i%2)*1.2;
    const p = b.g.position, ox = p.x, oz = p.z, kk = 1 - Math.exp(-dt*3.2);
    p.x += (tx - p.x)*kk; p.z += (tz - p.z)*kk;
    const dx = p.x - ox, dz = p.z - oz, moving = Math.abs(tx - p.x) + Math.abs(tz - p.z) > .6;
    b.walk = moving ? 1 : 0;
    if (moving){ b.g.rotation.set(0, Math.atan2(-dz, dx), 0); p.y = RS_Y; }
    else {
      b.g.rotation.set(0, -Math.PI/2, 0.55);   // sit up facing the camera
      p.y = RS_Y + .4 + (R.t > 5.2 ? Math.abs(Math.sin(R.t*8 + b.i))*.5 : 0);
      if (!b.jar.visible){ b.jar.visible = true; b.jar.position.set(p.x, RS_Y + .4, p.z + 1.5); SFX.chomp(); }
      if (Math.random() < dt*.8){ const h = spriteOf(loveTex, 1.1); h.position.set(p.x, p.y + 4, p.z); scene.add(h); R.puffs.push({o:h, life:1.2, vy:3, grow:.2}); }
    }
  });
}
// 提姆熊 loses: honey jar smashes, bears pile on him, homework rains down
const hwTexs = ['作業','期中考','報告','共筆'].map(t=>tex(32,40,(g)=>{
  g.fillStyle='#fbfaf4'; g.fillRect(0,0,32,40); g.fillStyle='#c0303c'; g.fillRect(0,0,32,9);
  g.fillStyle='#fff'; g.font='bold 8px sans-serif'; g.textAlign='center'; g.fillText(t,16,7);
  g.fillStyle='#9aa3ad'; for (let y=13;y<38;y+=4) g.fillRect(3,y,26,1);
}));
function bearLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position;
  Lz.m.setBear(false); Lz.m.setHood(false);
  const jar = honeyJarMesh(1.1); jar.position.set(lp.x - .9, RS_Y + 4.2, lp.z + 1.2); jar.visible = false; scene.add(jar); R.items.push(jar); R.jar = jar; R.jarVy = 0;
  R.bears = []; R.papers = [];
  for (let i=0;i<5;i++){ const b = buildBrownBear(); b.i = i; b.g.position.set(lp.x + 26 + i*2.5, RS_Y, lp.z + (i%2)*1.2); b.g.rotation.y = Math.PI; scene.add(b.g); R.items.push(b.g); R.bears.push(b); }
}
function bearLoseUpdate(R, dt, k){
  const Lz = R.Lz, hp = Lz.m.holder.position, J = R.jar;
  if (R.t < .8){ applyPose(Lz.m, POSE.eat, k); Lz.m.props.honey.visible = true; once('bl0', .2, ()=>popAt('呼……還有蜂蜜', Lz, 7.5)); return; }
  if (!R.broke){
    Lz.m.props.honey.visible = false; J.visible = true;
    R.jarVy -= 40*dt; J.position.y += R.jarVy*dt; J.rotation.z += dt*6;
    applyPose(Lz.m, POSE.helpless, k); Lz.m.setFace('shout');
    if (J.position.y <= RS_Y + .4){
      R.broke = true; J.visible = false; SFX.boom(); noise(.3,.3,3000);
      burst(J.position.x, RS_Y + .5, 0xe8a020, 22, 10); burst(J.position.x, RS_Y + .5, 0xdfe6ea, 10, 8);
      const pud = new THREE.Mesh(new THREE.CircleGeometry(1.8,14), new THREE.MeshLambertMaterial({color:0xe8a020, transparent:true, opacity:.85})); pud.rotation.x = -Math.PI/2; pud.position.set(J.position.x, RS_Y + .04, J.position.z); scene.add(pud); R.items.push(pud);
      popAt('我的蜂蜜！！', Lz, 8, 'big');
    }
    return;
  }
  Lz.m.setFace('cry');
  const pileX = hp.x, pileZ = hp.z;
  if (R.t < 1.8){ applyPose(Lz.m, POSE.sob, k); }
  else {
    if (!R.down){ R.down = true; SFX.roar(); SFX.boom(); G.shake = reduce ? .2 : .8; popAt('熊來了！！', Lz, 8, 'big'); }
    Lz.m.holder.rotation.set(-Math.PI/2, 0, 0); hp.y = RS_Y + .5; applyPose(Lz.m, POSE.flat, k);
  }
  R.bears.forEach(b=>{
    if (R.t < 1.2) return;
    const slot = [[0,1.8,-1.4,.3],[-1.4,1.2,-2.6,-.4],[1.4,1.2,-2.4,.5],[0,2.8,-3.2,-.2],[0.4,1.0,-0.2,.1]][b.i];
    const tx = pileX + slot[0], tz = pileZ + slot[2], p = b.g.position, kk = 1 - Math.exp(-dt*4);
    p.x += (tx - p.x)*kk; p.z += (tz - p.z)*kk;
    const close = Math.abs(tx - p.x) < 1;
    b.walk = close ? 0 : 1;
    p.y = RS_Y + (close ? slot[1] : Math.abs(Math.sin(R.t*9 + b.i))*.3);
    b.g.rotation.y = Math.PI + slot[3]; b.g.rotation.z = close ? 0.08*Math.sin(R.t*3 + b.i) : 0;
  });
  if (R.t > 2.6 && R.papers.length < 16 && Math.random() < dt*10){
    const pp = new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.5), new THREE.MeshLambertMaterial({map:hwTexs[R.papers.length%4], side:THREE.DoubleSide}));
    pp.position.set(pileX + (Math.random()-.5)*6, RS_Y + 16, pileZ - 1.5 + (Math.random()-.5)*4); pp.userData.land = RS_Y + 1 + Math.random()*2.6; pp.userData.sp = Math.random()*4;
    scene.add(pp); R.items.push(pp); R.papers.push(pp);
  }
  R.papers.forEach(pp=>{ if (pp.position.y > pp.userData.land){ pp.position.y -= dt*7; pp.rotation.set(-1.2 + Math.sin(R.t*3 + pp.userData.sp)*.5, R.t + pp.userData.sp, Math.sin(R.t*4 + pp.userData.sp)*.4); } else pp.rotation.x = -Math.PI/2 + .1; });
  once('bl1', 3.0, ()=>popAt('還有期中考……', Lz, 3.5, 'blue'));
  once('bl2', 4.2, ()=>popAt('共筆還沒寫……', Lz, 3.5, 'blue'));
}
registerChar('bear', {
  stats: { name:'提姆熊', en:'Tim Bear', tag:'暴言・奶奶的金孫・蜂蜜・醫學系', weight:1.4, run:11, air:9, jumpV:26, djV:22, jumps:2 },
  skins: [{ name:'生日帽', apply(c){
    const h = birthdayHat('#36b37e','#ffd166',0xff5fa2); h.position.set(0.05,0.64,0); c.head.add(h);
    let hood = false, bear = false; const fix = ()=>{ h.position.y = hood ? (bear ? 0.98 : 0.86) : 0.64; };   // sit on top of the bear hood
    const sh = c.setHood, sb = c.setBear;
    c.setHood = (on)=>{ hood = on; sh(on); fix(); }; c.setBear = (on)=>{ bear = on; sb(on); fix(); };
  } }],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.3], pose:['jabR','punch2'], box:[2.1,3.8,1.6], dmg:7, kb:9, sc:.75, ang:38, text:'蛤？', sfx:'swing'},
    side:{t:[.32,.1,.38], pose:['batWind','batHit'], box:[2.9,3.4,1.8], dmg:18, kb:13, sc:1.15, ang:36, prop:'pan', armor:1, text:'平底鍋！', sfx:'swing'},
    up:{t:[.2,.12,.32], pose:['upWind','setUp'], box:[0.4,6.8,2.1], dmg:14, kb:12, sc:1, ang:88, prop:'camera', text:'喀嚓！', sfx:'swing'},
    down:{t:[.14,.12,.55], pose:['jabR','upHit'], poseSwitch:.3, box:[1.9,3.2,1.6], dmg:4, kb:1, sc:0, ang:45, onHit:'bearGrab', text:'抓住！', sfx:'swing'},
    nair:{t:[.07,.2,.18], pose:['nair','nair'], box:[0,3,2.3], dmg:8, kb:7, sc:.6, ang:45, air:1},
    fair:{t:[.14,.1,.24], pose:['batWind','batHit'], box:[2.5,3.4,1.6], dmg:12, kb:9, sc:.9, ang:40, air:1, prop:'pan', sfx:'swing'},
    uair:{t:[.12,.12,.22], pose:['air','setUp'], box:[0.3,6.4,1.7], dmg:9, kb:8, sc:.8, ang:85, air:1, prop:'camera'},
    dair:{t:[.22,.1,.28], pose:['bookUp','bookSlam'], box:[0.6,0.4,1.8], dmg:13, kb:7, sc:.8, ang:-70, air:1, sfx:'spike'},
    nB:{t:[.18,.05,.3], pose:['laughIn','laugh'], fire:[[.18,'rant']], air:1},
    sB:{t:[.22,.05,.3], pose:['throwWind','throwHit'], prop0:'honey', fire:[[.22,'honeyJar']], air:1, sfx:'swing'},
    uB:{t:[.05,.5,.12], pose:['climbUp','climbUp2'], poseSwitch:.28, start:'bearClimb', box:[0.4,4.8,1.9], dmg:8, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.25,.15,.35], pose:['selfie','selfie'], prop:'camera', fire:[[.25,'camFlash']], box:[1.4,3.8,3.2], dmg:6, kb:5, sc:.3, ang:45, onHit:'flashed', text:'拍照！', air:1},
  },
  fire: {
  rant(f){ const i = (Math.random()*rantTexs.length)|0; proj({owner:f, x:f.x+f.face*2, y:f.y+5, vx:f.face*18, vy:0, g:0, wave:.3, r:1.2, life:1.1, dmg:5, kb:4, sc:.2, ang:45, onHit:'shock', mesh:spriteOf(rantTexs[i],2.6)}); tone(180,.12,'sawtooth',.12,1.6); },
  honeyJar(f){ proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.8, vx:f.face*15, vy:9, g:30, r:.9, life:2, bounce:1, dmg:8, kb:6, sc:.5, ang:45, soft:1, slow:2.5, mesh:honeyJarMesh(1.1), spin:1}); pop('蜂蜜！', f.x, f.y+7); },
  camFlash(f){ G.flash = Math.max(G.flash, .3); burst(f.x+f.face*2, f.y+4.5, 0xffffff, 12, 9); tone(1800,.06,'square',.08); noise(.05,.15,4000); },
  },
  start: {
  bearClimb(f){ f.vy = 30; f.vx = f.face*5; f.onGround = false; f.jumps = 0; f.ff = false; pop('爬樹！', f.x, f.y+7); burst(f.x, f.y+1, 0x7a4a26, 10, 8); },
  },
  onhit: {
  bearGrab(a,v){ v.state = 'stuck'; v.move = null; v.vx = v.vy = 0; G.finals.push({type:'grab', owner:a, target:v, t:0, update:grabUpdate}); },
  shock(a,v){ v.state = 'stun'; v.stunT = .6; v.move = null; v.vx *= .3; pop('嚇到了……', v.x, v.y+7.5, 'blue'); },
  flashed(a,v){ v.state = 'stun'; v.stunT = .5; v.move = null; pop('好閃！', v.x, v.y+7.5); },
  },
  sfx: {
  roar(){ noise(.9,.45,180); tone(110,.8,'sawtooth',.2,.55); tone(82,.9,'square',.12,.6,.05); },
  },
  build: buildTim, face: timFaces.normal, portraitBg: '#e8b84a',
  portrait(g){ g.fillRect(2,4,60,18); g.fillRect(1,10,7,24); g.fillRect(56,10,7,24); for (let i=0;i<7;i++) g.fillRect(4+i*8,18,8,5+(i%2)*3); },
  breakText: '頭套掉了！', finalPose: 'cheer',
  animate(f, m, s){ m.setHood(s==='shield' || f.buffT > 0); if (s==='move' && f.moveId==='nB') m.setFace('shout'); },
  readyPose: (t)=> Math.sin(t*10) > 0 ? POSE.cheer : POSE.laugh,
  selectSfx: ()=>SFX.roar(),
  winSub: '"Bear with me."',
  final: bearFinal, winSetup: bearWinSetup, winUpdate: bearWinUpdate, loseSetup: bearLoseSetup, loseUpdate: bearLoseUpdate, longWin: true, longLose: true,
});
