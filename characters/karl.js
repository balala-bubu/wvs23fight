/* 白狗 Karl — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
/* ---------- Karl（白狗） ---------- */
const K_SKIN = '#d8aa86', K_SKIN_C = ['#cf9f7b','#e0b590','#d2a47f','#c99a76'];
const kSkinTex = tex(16,16,(g)=>speckle(g,16,16,K_SKIN,K_SKIN_C,.4));
function karlFace(g, mode){
  speckle(g,64,64,K_SKIN,K_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(220,110,90,.32)';
  g.beginPath(); g.ellipse(14,42,7,5,0,0,7); g.fill();
  g.beginPath(); g.ellipse(50,42,7,5,0,0,7); g.fill();
  g.fillStyle='#1d1512';
  if (mode==='cry'){ g.fillRect(13,25,5,2); g.fillRect(18,24,5,2); g.fillRect(41,24,5,2); g.fillRect(46,25,5,2); }
  else { g.fillRect(13,23,12,2); g.fillRect(39,23,12,2); g.fillRect(12,24,2,1); g.fillRect(50,24,2,1); }
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  if (mode==='dizzy'){
    [20,44].forEach(cx=>{ g.beginPath(); for (let a=0;a<12;a+=.4){ const r=a*.45, x=cx+Math.cos(a)*r, y=35+Math.sin(a)*r; if (a===0) g.moveTo(x,y); else g.lineTo(x,y); } g.stroke(); });
  } else if (mode==='cry'){
    g.beginPath(); g.moveTo(15,34); g.lineTo(25,34); g.stroke(); g.beginPath(); g.moveTo(39,34); g.lineTo(49,34); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,36,3,15); g.fillRect(44,36,3,15);
  } else {
    g.beginPath(); g.arc(20,36,5.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
    g.beginPath(); g.arc(44,36,5.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
    g.strokeStyle='rgba(110,60,40,.45)'; g.lineWidth=1;
    g.beginPath(); g.moveTo(13,38); g.lineTo(11,40); g.stroke(); g.beginPath(); g.moveTo(51,38); g.lineTo(53,40); g.stroke();
  }
  g.fillStyle='rgba(120,70,45,.4)'; g.fillRect(29,36,6,5);
  g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,41,3,1); g.fillRect(34,41,3,1);
  if (mode==='cry' || mode==='dizzy'){
    g.beginPath(); g.moveTo(22,52); g.quadraticCurveTo(27,48,32,51); g.quadraticCurveTo(37,54,42,50);
    g.lineWidth=2; g.strokeStyle='#4a1715'; g.stroke();
  } else {
    // the huge grin
    g.beginPath(); g.moveTo(15,45); g.quadraticCurveTo(32,42,49,45);
    g.quadraticCurveTo(45,59,32,59); g.quadraticCurveTo(19,59,15,45); g.closePath();
    g.fillStyle='#4a1715'; g.fill();
    g.save(); g.clip(); g.fillStyle='#f3ece0'; g.fillRect(14,43,36,7);
    g.fillStyle='#c9bca8'; [20,25,30,35,40,45].forEach(x=>g.fillRect(x,44,1,5));
    g.fillStyle='#efe6d8'; g.fillRect(20,55,24,3);
    g.fillStyle='rgba(185,75,75,.7)'; g.fillRect(25,52,14,3); g.restore();
    g.strokeStyle='rgba(110,60,40,.4)'; g.lineWidth=1;
    g.beginPath(); g.moveTo(14,41); g.quadraticCurveTo(10,46,14,51); g.stroke();
    g.beginPath(); g.moveTo(50,41); g.quadraticCurveTo(54,46,50,51); g.stroke();
  }
}
const kFaces = { normal:tex(64,64,(g)=>karlFace(g,'normal')), cry:tex(64,64,(g)=>karlFace(g,'cry')), dizzy:tex(64,64,(g)=>karlFace(g,'dizzy')) };
const kShirtTex = tex(32,32,(g)=>speckle(g,32,32,'#151517',['#1d1d20','#0e0e10','#232327'],.5));
const kShortsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#a8916a',['#b39d76','#9a845e','#bda781'],.5); g.fillStyle='rgba(60,45,25,.18)'; for(let y=0;y<32;y+=4) g.fillRect(0,y,32,1); });
const kShoeTex = tex(16,16,(g)=>{ speckle(g,16,16,'#e9e6df',['#dcd8cf','#f4f2ec'],.4); g.fillStyle='#ff6a2a'; g.fillRect(2,7,12,2); g.fillRect(4,5,8,1); });
const kBookTex = tex(32,40,(g)=>{
  g.fillStyle='#2f5fb3'; g.fillRect(0,0,32,40); g.fillStyle='#f2c14e'; g.fillRect(0,0,3,40);
  g.fillStyle='#fff'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.fillText('F=ma',18,16);
  g.strokeStyle='#ffd27a'; g.lineWidth=1; g.beginPath(); g.arc(18,28,6,0,7); g.stroke(); g.beginPath(); g.ellipse(18,28,9,3,.5,0,7); g.stroke();
});
const kCoverTex = tex(96,128,(g)=>{
  g.fillStyle = '#f39a3a'; g.fillRect(0,0,96,128);
  g.fillStyle = 'rgba(255,255,255,.18)'; for (let i=0;i<12;i++){ g.beginPath(); g.moveTo(48,74); g.arc(48,74,90,i*.52,i*.52+.26); g.fill(); }
  // title
  g.fillStyle = '#fff6e0'; g.fillRect(6,6,84,26);
  g.fillStyle = '#23365e'; g.font = '900 17px sans-serif'; g.textAlign = 'center'; g.fillText('白狗還活著', 48, 26);
  // Karl: bandaged head, glasses, huge grin, thumbs up
  g.fillStyle = '#151517'; g.fillRect(30,88,36,30);
  g.fillStyle = '#d8aa86'; g.fillRect(34,52,28,30); g.fillRect(64,84,8,10); g.fillRect(67,78,4,7);
  g.fillStyle = '#151110'; g.fillRect(32,46,32,9);
  g.fillStyle = '#ffffff'; g.fillRect(31,52,34,5); g.fillStyle = '#e04040'; g.fillRect(56,52,4,4);
  g.strokeStyle = '#3b2417'; g.lineWidth = 2; g.beginPath(); g.arc(41,64,4,0,7); g.stroke(); g.beginPath(); g.arc(55,64,4,0,7); g.stroke();
  g.fillStyle = '#4a1715'; g.fillRect(39,72,18,6); g.fillStyle = '#f3ece0'; g.fillRect(40,72,16,2);
  // dented car, coral berries, little white dog
  g.fillStyle = '#4a6fa8'; g.fillRect(4,104,24,9); g.fillRect(8,98,13,7); g.fillStyle = '#f39a3a'; g.fillRect(24,100,5,6);
  g.fillStyle = '#1d1d22'; g.fillRect(7,112,5,5); g.fillRect(20,112,5,5);
  g.fillStyle = '#ff3a10'; [[80,40],[85,44],[76,45],[82,50]].forEach(([x,y])=>{ g.beginPath(); g.arc(x,y,3,0,7); g.fill(); });
  g.fillStyle = '#3f7a2c'; g.fillRect(80,32,2,6);
  g.fillStyle = '#f9f7f2'; g.fillRect(70,110,16,7); g.fillRect(84,105,7,7); g.fillRect(71,117,3,5); g.fillRect(82,117,3,5);
  g.fillStyle = '#2a2420'; g.fillRect(88,107,2,2);
  g.fillStyle = '#fff3a0'; [[14,46],[20,40],[10,38]].forEach(([x,y])=>{ g.fillRect(x-1,y-3,2,6); g.fillRect(x-3,y-1,6,2); });
});
const kSkinM = L({map:kSkinTex}), kShirtM = L({map:kShirtTex}), kShortsM = L({map:kShortsTex}), kShoeM = L({map:kShoeTex});
const strapM = L({color:0xe9e4d8}), orangeSole = L({color:0xff6a2a});
const berryM = L({color:0xff5a1f}), berryHiM = L({color:0xffa060}), stemM = L({color:0x3f7a2c});
const berryGeo = new THREE.SphereGeometry(.22,7,5);
function berryBunch(s){
  const g = new THREE.Group();
  [[0,0,0],[.32,.18,.1],[-.3,.15,.12],[.12,.42,-.1],[-.1,-.3,.15],[.3,-.2,-.1]].forEach(([x,y,z],i)=>{
    const b = new THREE.Mesh(berryGeo, i%3 ? berryM : berryHiM); b.position.set(x,y,z); g.add(b);
  });
  g.add(at(cyl(.03,.03,.7,stemM,4),0,.6,0));
  const lf = new THREE.Mesh(new THREE.BoxGeometry(.35,.05,.18), stemM); lf.position.set(.15,.85,0); lf.rotation.z = .4; g.add(lf);
  g.scale.setScalar(s); return g;
}
function buildKarl(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:kFaces.normal});
  const c = buildChar({
    skinM:kSkinM, faceM, headW:1.02, headH:1.14, torsoMat:kShirtM, sleeveMat:()=>kShirtM, sleeve:[0.64,0.8],
    pantsM:kShortsM, shoeM:kShoeM, soleM:orangeSole,
    collar(chest){
      const cl = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.05,4,12), L({color:0x222226})); cl.rotation.x = Math.PI/2; chest.add(at(cl,0,2.22,0.02));
      // bead necklace
      const bw = L({color:0xf4f0e6}), bk = L({color:0x2a2420});
      for (let i=0;i<13;i++){ const a = -1.35 + i/12*2.7; const b = new THREE.Mesh(new THREE.SphereGeometry(0.05,5,4), i%3 ? bw : bk);
        b.position.set(Math.sin(a)*0.36, 2.18 - Math.cos(a)*0.1, Math.cos(a)*0.36 + 0.02); chest.add(b); }
      // white backpack straps + pack
      [-1,1].forEach(s=>{
        chest.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.2,1.75,0.07), strapM),s*0.52,1.25,0.48));
        chest.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.22,0.07,0.95), strapM),s*0.55,2.27,0));
      });
      chest.add(at(rbox(1.25,1.5,0.5,.35,strapM),0,1.25,-0.68));
    },
    hair(head){
      head.add(at(rbox(1.16,0.56,1.16,.62,hairM),0,0.47,-0.02));
      head.add(at(rbox(1.1,0.95,0.55,.6,hairM),0,0.08,-0.31));
      [-1,1].forEach(s=>head.add(at(rbox(0.1,0.3,0.36,.4,hairM),s*0.52,0.26,0.06)));
      // messy tufts
      [[-0.3,0.1,0.5],[0.05,-0.15,-0.4],[0.3,0.15,0.3],[-0.1,0.3,-0.2],[0.25,-0.3,0.6],[-0.35,-0.25,-0.5],[0.0,0.0,0.15]].forEach(([x,z,r])=>{
        const k = rbox(0.34,0.3,0.34,.6,hairM); k.position.set(x,0.78,z); k.rotation.set(r*0.5,r,r*0.6); head.add(k);
      });
      // fringe swept to one side
      [[-0.32,0.31,-0.35],[-0.1,0.27,-0.25],[0.12,0.25,-0.2],[0.32,0.29,-0.1]].forEach(([x,y,r])=>{
        const f = rbox(0.3,0.36,0.16,.5,hairM); f.position.set(x,y,0.47); f.rotation.z = r; head.add(f);
      });
    },
    face(head){
      const fr = L({color:0x3b2417}), lensM = new THREE.MeshBasicMaterial({color:0xdfe6ea,transparent:true,opacity:.14});
      const gl = new THREE.Group(); gl.position.set(0,-0.03,0.55); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17,0.035,4,14), fr); rim.position.x = s*0.21; gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.16,12), lensM); lens.position.set(s*0.21,0,-0.01); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.035,0.035,0.62), fr); arm.position.set(s*0.4,0.04,-0.31); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.035,0.035), fr),0,0.05,0));
    }
  }, parent);
  [c.joints.rKn, c.joints.lKn].forEach(kn=>{ kn.children[0].material = kSkinM; });   // shorts: bare shins
  const book = new THREE.Group(); book.position.set(0,-0.4,0.1); c.R.hd.add(book);
  const bM = L({map:kBookTex}), pageM = L({color:0xf3eee2});
  book.add(new THREE.Mesh(new THREE.BoxGeometry(1.0,1.3,0.28), [pageM,pageM,pageM,pageM,bM,bM]));
  const berries = berryBunch(1); berries.position.set(0,-0.45,0.15); c.R.hd.add(berries);
  const phone = new THREE.Group(); phone.position.set(0,-0.35,0.12); c.R.hd.add(phone);
  phone.add(new THREE.Mesh(new THREE.BoxGeometry(0.42,0.8,0.06), [black,black,black,black,L({color:0x7fc8ff, emissive:0x2a5a80}),black]));
  const can = new THREE.Group(); can.position.set(0,-0.32,0.12); c.R.hd.add(can);
  can.add(cyl(0.19,0.19,0.52,L({color:0xd8dde3}),10)); can.add(at(cyl(0.195,0.195,0.24,L({color:0xc8322a}),10),0,0,0)); can.add(at(cyl(0.15,0.19,0.05,L({color:0xd8dde3}),10),0,0.28,0));
  c.props = {book, berries, phone, can};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = kFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = kFaces[k]; faceM.needsUpdate = true; } };
  return c;
}
const dogM = L({color:0xf4f1ea}), dogDark = L({color:0x2a2420}), dogPink = L({color:0xe98a8a});
function buildDog(){
  const g = new THREE.Group();
  const body = rbox(1.9,0.9,0.85,.5,dogM); body.position.set(0,1.35,0); g.add(body);
  const head = new THREE.Group(); head.position.set(1.05,1.95,0); g.add(head);
  head.add(rbox(0.8,0.75,0.72,.6,dogM));
  head.add(at(rbox(0.45,0.36,0.46,.5,dogM),0.5,-0.12,0));
  head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.14,0.12,0.14),dogDark),0.75,-0.02,0));
  [-1,1].forEach(s=>{
    head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.1,0.08),dogDark),0.3,0.12,s*0.2));
    const ear = rbox(0.22,0.4,0.12,.4,dogM); ear.position.set(-0.1,0.42,s*0.24); ear.rotation.x = s*0.25; head.add(ear);
  });
  head.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.2,0.05,0.18),dogPink),0.55,-0.33,0));
  const tail = pivot(g,-0.95,1.6,0); tail.add(at(rbox(0.14,0.6,0.14,.5,dogM),0,0.3,0)); tail.rotation.z = 0.7;
  const legs = [[0.65,0.25],[0.65,-0.25],[-0.65,0.25],[-0.65,-0.25]].map(([x,z])=>{ const p = pivot(g,x,1.0,z); p.add(at(rbox(0.24,1.0,0.24,.4,dogM),0,-0.5,0)); return p; });
  const dog = {g, legs, tail, head, ph:Math.random()*6};
  body.onBeforeRender = ()=>{ const t = performance.now()/1000*14 + dog.ph;
    legs.forEach((l,i)=>{ l.rotation.z = Math.sin(t + (i%2 ? Math.PI : 0) + (i>1 ? .6 : 0))*0.6; }); tail.rotation.z = 0.7 + Math.sin(t*1.6)*0.4; };
  return dog;
}
function buildCar(col){
  const g = new THREE.Group(), paint = L({color:col}), tire = L({color:0x1d1d22});
  const glass = new THREE.MeshLambertMaterial({color:0x9fc4dc, transparent:true, opacity:.35, depthWrite:false});
  g.add(at(rbox(6.4,1.4,3.2,.25,paint),0,1.25,0));
  g.add(at(rbox(3.6,2.6,3.0,.2,glass),-0.4,3.1,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.7,0.16,3.1),paint),-0.4,4.45,0));
  [[2,1],[2,-1],[-2,1],[-2,-1]].forEach(([x,s])=>{ const w = cyl(0.7,0.7,0.5,tire,10); w.rotation.x = Math.PI/2; w.position.set(x,0.7,s*1.5); g.add(w); });
  [-1,1].forEach(s=>g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.35,0.6), L({color:0xfff2b0, emissive:0x806a20})),3.2,1.45,s*1.05)));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.15,0.25,3.0), L({color:0xcfd4da})),3.25,0.8,0));
  return g;
}

// 白狗's final 「活著真好」: falling rocks → coral berries → the car, all gifted to the opponent
function updateKarlFinal(F, dt){
  const v = F.target, f = F.owner;
  if (F.step < 3 && F.t > .25 + F.step*.35){
    const r = rbox(1.6,1.3,1.4,.4,rockM); r.position.set(v.x + (Math.random()-.5)*2, v.y + 20, 0); F.mesh.add(r);
    F.rocks.push({m:r, vy:-6, hit:false}); F.step++;
    if (F.step===1) pop('七星山落石！', v.x, v.y+9, 'red');
  }
  for (const R of F.rocks){
    if (R.done) continue;
    R.vy -= 70*dt; R.m.position.y += R.vy*dt; R.m.rotation.x += dt*5; R.m.rotation.z += dt*3;
    R.hitSet = R.hitSet || new Set();
    for (const w of G.fighters){                                       // a rock hits anyone it falls on
      if (w===f || R.hitSet.has(w) || !w.hittable()) continue;
      if (Math.abs(R.m.position.x - w.x) < 2.2 && R.m.position.y < w.y+6 && R.m.position.y > w.y-1){
        R.hitSet.add(w); w.pct += 6; w.meter = Math.min(100, w.meter+3); launch(w, 0, 0, F.dir); w.vx = F.dir*3; w.vy = 6; w.hitstun = .5;
        SFX.spike(); spark(w.x, w.y+5, 1.8); burst(R.m.position.x, R.m.position.y, 0x6d5844, 8, 8);
      }
    }
    if (R.m.position.y < -30){ R.done = true; R.m.visible = false; }
  }
  if (!F.berries && F.t > 1.35){
    F.berries = true; pop('珊瑚櫻吃到飽！', v.x, v.y+9, 'red');
    for (let i=0;i<5;i++) proj({owner:f, x:v.x + (i-2)*1.3, y:v.y + 16 + i*1.2, vx:0, vy:-4, g:30, r:.9, life:2.5, dmg:3, kb:2, sc:.1, ang:60, onHit:'poison', mesh:berryBunch(1.1), spin:1});
  }
  if (F.t > 2.1){
    if (!F.honk){ F.honk = true; SFX.horn(); pop('叭叭——！', v.x, v.y+8, 'big'); }
    F.car.position.x += F.dir*52*dt;
    F.carHit = F.carHit || new Set();
    for (const w of G.fighters){                                       // the car runs over everyone on its path
      if (w===f || F.carHit.has(w) || !w.hittable()) continue;
      if (Math.abs(w.x - (F.car.position.x + F.dir*2)) < 3.4 && w.y < 6 && w.y > -4){
        F.carHit.add(w); w.pct += 12; launch(w, 32 + w.pct*.11, 40, F.dir);
        SFX.crash(); G.shake = reduce ? .2 : 1.2; G.freeze = .14; spark(w.x, w.y+3, 4); pop('活著真好！', w.x, w.y+9, 'big');
      }
    }
  }
  return F.t > 2.1 && Math.abs(F.car.position.x) > 70;
}
function karlFinal(f, opp){
    f.finalT = 1.8; banner('活著真好！'); SFX.laugh(); SFX.horn();
    pop('這些都送你！', f.x, f.y+7.5, 'big');
    const dir = Math.sign(opp.x - f.x) || f.face;
    const grp = new THREE.Group(); scene.add(grp);
    const car = buildCar(0xd8d4cc); car.scale.set(dir,1,1); car.position.set(f.x - dir*48, 0, -0.6); grp.add(car);
    G.finals.push({type:'karl', owner:f, target:opp, dir, t:0, mesh:grp, car, rocks:[], step:0, update:updateKarlFinal});
}
function karlWinSetup(R){
  const W = R.W;
    const bush = new THREE.Group();
    bush.add(at(new THREE.Mesh(new THREE.SphereGeometry(1.4,8,6), L({color:0x3f7a2c})),0,1.2,0));
    for (let i=0;i<9;i++){ const b = berryBunch(.7); b.position.set(Math.cos(i*2.4)*1.1, 1.1+Math.sin(i*1.7)*.8, Math.sin(i*2.4)*1.1+.2); bush.add(b); }
    const shown = new THREE.Mesh(new THREE.BoxGeometry(1.7,2.25,0.25), [L({color:0xf3eee2}),L({color:0xf3eee2}),L({color:0xf3eee2}),L({color:0xf3eee2}),L({map:kCoverTex}),L({color:0x23365e})]);
    shown.position.set(0, 6.5, 0.6); shown.scale.setScalar(.001); W.m.holder.add(shown); R.items.push(shown); R.kBook = shown;
    bush.position.set(-0.2, RS_Y, 2.4); bush.scale.setScalar(.001); scene.add(bush); R.items.push(bush); R.bush = bush;
    R.dogs = [];
    for (let i=0;i<7;i++){ const d = buildDog(); d.i = i; const side = i%2 ? 1 : -1;
      d.g.position.set(-3.5 + side*(20 + i*1.5), RS_Y, -1 + (i%3)*1.2); scene.add(d.g); R.items.push(d.g); R.dogs.push(d); }
}
function karlLoseSetup(R){
    const car = buildCar(0x4a6fa8); car.rotation.y = -Math.PI/2; car.position.set(9.5, RS_Y, -4.1); scene.add(car); R.items.push(car); R.kCar = car;
    const hit = buildCar(0xc8402c); hit.rotation.y = Math.PI; hit.position.set(9.5+42, RS_Y, -4.1); scene.add(hit); R.items.push(hit); R.kHit = hit;
}
// 白狗 wins: eyes the poison berries, burns them instead, then white dogs swarm in
function karlWinUpdate(R, dt, k){
  const W = R.W, wp = W.m.holder.position, B = R.bush;
  if (R.t < 1.9){
    B.scale.setScalar(Math.max(.001, Math.min(1, R.t/.4)));
    applyPose(W.m, R.t > .4 ? POSE.ponder : STANCE, k);
    W.m.props.berries.visible = R.t > .4;
    once('kq1', .6, ()=>popAt('這個……可以吃嗎？', W, 8));
    once('kq2', 1.4, ()=>popAt('……還是算了', W, 8, 'blue'));
  } else if (R.t < 3.0){
    W.m.props.berries.visible = false;
    applyPose(W.m, POSE.throwHit, k);
    once('kfire', 1.9, ()=>{ SFX.fire(); SFX.boom(); popAt('燒掉！', W, 8.5, 'big'); });
    B.scale.setScalar(Math.max(.001, 1 - (R.t - 1.9)/1.1));
    if (Math.random() < dt*40){
      const p = spriteOf(puffTex, .8 + Math.random(), [0xff4a1a,0xff9a2a,0xffd04a][(Math.random()*3)|0]);
      p.position.set(B.position.x + (Math.random()-.5)*2.4, RS_Y + .5 + Math.random()*2, B.position.z + .5); scene.add(p);
      R.puffs.push({o:p, life:.7, vy:5, grow:-.6});
    }
  } else {
    B.visible = false;
    const lift = R.t > 4.0;
    applyPose(W.m, lift || Math.sin(R.t*14) > 0 ? POSE.cheer : POSE.laugh, k);
    W.m.body.position.y = lift ? 0 : Math.abs(Math.sin(R.t*14))*0.15;
    if (lift){ const u = Math.min(1, (R.t - 4.0)/.3); R.kBook.scale.setScalar(Math.max(.001, u*(1 + Math.sin(u*Math.PI)*.25))); R.kBook.position.y = 6.5 + Math.sin(R.t*3)*.1; }
    once('kbook', 4.5, ()=>{ SFX2.fanfare(); popAt('活著真好！', W, 8.6, 'big'); });
    once('kdog', 3.0, ()=>{ SFX.bark(); popAt('白狗們～！', W, 8.5, 'big'); });
    once('kdog2', 3.5, ()=>{ SFX.bark(); SFX2.cheer(); });
  }
  R.dogs.forEach(d=>{
    if (R.t < 2.7 + d.i*.08) return;
    const th = d.i/R.dogs.length*Math.PI*2 + Math.max(0, R.t - 3.6)*1.1;
    const tx = wp.x + Math.cos(th)*3.8, tz = wp.z + Math.sin(th)*2.8;
    const p = d.g.position, ox = p.x, oz = p.z;
    const kk = 1 - Math.exp(-dt*3.5);
    p.x += (tx - p.x)*kk; p.z += (tz - p.z)*kk;
    p.y = RS_Y + Math.abs(Math.sin(R.t*10 + d.i))*.4;
    const dx = p.x - ox, dz = p.z - oz;
    if (Math.abs(dx) + Math.abs(dz) > 1e-4) d.g.rotation.y = Math.atan2(-dz, dx);
    if (R.t > 3.6 && Math.random() < dt*.8){ const h = spriteOf(loveTex, 1.1); h.position.set(p.x, p.y + 3, p.z); scene.add(h); R.puffs.push({o:h, life:1.2, vy:3, grow:.2}); }
  });
}
// 白狗 loses: riding in the back seat, another car slams in — concussion
function karlLoseUpdate(R, dt, k){
  const Lz = R.Lz, hp = Lz.m.holder.position, C = R.kCar, H = R.kHit;
  if (!R.flyT){
    Lz.m.holder.rotation.set(0,0,0); hp.set(9.5, RS_Y + 0.55, -5);
    applyPose(Lz.m, POSE.sit, k);
    once('kl1', 1.6, ()=>popAt('今天要去哪玩？', Lz, 7));
    once('khonk', 2.9, ()=>SFX.horn());
    if (R.t > 2.6) H.position.x = Math.max(14.35, H.position.x - 45*dt);
    if (H.position.x <= 14.35){
      R.flyT = R.t; R.fv = {vx:-2.5, vy:17};
      SFX.crash(); SFX.boom(); G.shake = reduce ? .2 : 1; G.flash = .4;
      popAt('碰！', Lz, 8, 'big'); burst(11, RS_Y+2, 0xffffff, 18, 12); burst(11, RS_Y+2, 0xcfd4da, 12, 10);
    }
    return;
  }
  C.position.x += (7.3 - C.position.x)*Math.min(1, dt*6);
  C.rotation.y = -Math.PI/2 + Math.min(.35, (R.t - R.flyT)*1.2);
  if (!R.landed){
    R.fv.vy -= 40*dt; hp.x += R.fv.vx*dt; hp.y += R.fv.vy*dt; hp.z += 11*dt;
    Lz.m.holder.rotation.z += dt*9; applyPose(Lz.m, POSE.hurt, k); Lz.m.setFace('dizzy');
    if (hp.y <= RS_Y + .5 && R.fv.vy < 0){
      R.landed = true; hp.y = RS_Y + .5; Lz.m.holder.rotation.set(-Math.PI/2, 0, 0);
      SFX.soft(); burst(hp.x, RS_Y + .5, 0xcfc2a8, 10, 6); popAt('腦震盪……', Lz, 3, 'blue');
      R.stars = [0,1,2].map(()=>{ const s = spriteOf(starTex, .9, 0xfff3a0); scene.add(s); R.items.push(s); return s; });
    }
  } else {
    applyPose(Lz.m, POSE.flat, k); Lz.m.setFace('dizzy');
    once('kl2', 5.0, ()=>popAt('活著真好……', Lz, 3, 'blue'));
    R.stars.forEach((s,i)=>{ const a = R.t*4 + i*2.09; s.position.set(hp.x + Math.cos(a)*1.1, hp.y + 1.2, hp.z - 4.2 + Math.sin(a)*1.1); });
  }
}
/* ---------- shield: slumped in an armchair, drinking, watching his own emo confession video ---------- */
const kTvTex = tex(96,64,(g)=>{
  const sky = g.createLinearGradient(0,0,0,64); sky.addColorStop(0,'#0b1030'); sky.addColorStop(1,'#1d2350'); g.fillStyle = sky; g.fillRect(0,0,96,64);
  g.fillStyle = '#fbf3c8'; g.beginPath(); g.arc(80,11,6,0,7); g.fill(); g.fillStyle = '#0b1030'; g.beginPath(); g.arc(83,9,5,0,7); g.fill();   // crescent moon
  g.fillStyle = '#fff'; [[10,6],[24,12],[56,5],[68,15],[40,9]].forEach(([x,y])=>g.fillRect(x,y,1,1));
  g.fillStyle = '#0a1a14'; [[6,40,10],[20,36,12],[78,38,11],[90,42,9]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); g.fillRect(x-1,y,3,24); });   // trees
  g.fillStyle = '#16301f'; g.fillRect(0,52,96,12);                                                                  // grass
  g.fillStyle = '#3a3a44'; g.fillRect(66,24,2,30); g.fillStyle = 'rgba(255,214,120,.25)'; g.beginPath(); g.arc(67,24,12,0,7); g.fill(); g.fillStyle = '#ffd678'; g.fillRect(64,22,7,4);   // street lamp
  g.save(); g.translate(30,14); g.scale(.56,.56); karlFace(g,'cry'); g.restore();                                     // his face, crying
  g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(14,54,68,9);
  g.fillStyle = '#fff'; g.font = '700 7px sans-serif'; g.textAlign = 'center'; g.fillText('「對不起…我喜歡你」', 48, 61);
  g.fillStyle = '#ff3a3a'; g.beginPath(); g.arc(7,6,2.2,0,7); g.fill(); g.fillStyle = '#fff'; g.font = '700 5px sans-serif'; g.textAlign = 'left'; g.fillText('REC', 11, 8);
});
function karlShield(){
  const g = new THREE.Group();
  const fab = L({color:0x7a3b2e}), fabD = L({color:0x5e2c22}), wood = L({color:0x4a3020});
  const sofa = new THREE.Group(); g.add(sofa);                                // built facing +x (he looks toward +x)
  sofa.add(at(rbox(2.6,0.7,2.8,.3,fab),0,1.15,0));                           // seat cushion
  sofa.add(at(rbox(2.7,1.0,2.9,.25,fabD),0,0.5,0));                           // base
  sofa.add(at(rbox(0.8,3.2,2.9,.35,fab),-1.35,2.1,0));                        // backrest
  [-1,1].forEach(z=>sofa.add(at(rbox(2.6,1.3,0.6,.3,fabD),0,1.5,z*1.45)));   // armrests
  [[-1.1,-1.2],[-1.1,1.2],[1.1,-1.2],[1.1,1.2]].forEach(([x,z])=>sofa.add(at(cyl(0.12,0.09,0.3,wood,6),x,0.0,z)));
  const tv = new THREE.Group(); g.add(tv);
  tv.add(at(rbox(4.0,2.8,0.4,.12,L({color:0x1b1b20})),0,3.0,0));
  const scrM = new THREE.MeshBasicMaterial({map:kTvTex, fog:false});
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.4), scrM); scr.position.set(0,3.0,0.21); tv.add(scr);
  tv.add(at(rbox(2.4,1.4,1.4,.1,wood),0,0.7,0));                              // TV stand
  tv.add(at(cyl(0.08,0.08,0.3,L({color:0x1b1b20}),6),0,1.55,0));
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5,3.6), new THREE.MeshBasicMaterial({color:0x6f8bff, transparent:true, opacity:.14, depthWrite:false, fog:false})); glow.position.set(0,3.0,0.25); tv.add(glow);
  g.sofa = sofa; g.tv = tv; g.scr = scrM; g.glow = glow;
  return g;
}
function karlShieldAnim(f){
  const g = f.shieldMesh, face = f.face || 1, hp = Math.max(0, f.shieldHP)/50, t = performance.now()/1000;
  g.scale.setScalar(1); g.position.set(f.x, f.y, 0);                          // furniture keeps its size; strength shows on the TV
  g.sofa.position.set(-face*0.35, 0, -0.2); g.sofa.rotation.y = face > 0 ? 0 : Math.PI;
  g.tv.position.set(face*4.6, 0, 0.6); g.tv.rotation.y = Math.atan2(-face*0.6, 0.8);
  const flick = hp < .35 && Math.sin(t*40) > 0 ? .35 : 1;                    // weak shield: the TV starts flickering
  g.scr.color.setScalar(flick); g.glow.material.opacity = (.1 + Math.sin(t*6)*.04)*flick;
}
/* ---------- skin: 黃色玩偶服（額外造型；預設外觀完全不變。臉、眼鏡、劉海保留，其餘換成圓滾滾的黃色玩偶服） ---------- */
function karlCostume(c){
  const Y = L({color:0xf0b232}), TAN = L({color:0xdcb98a}), DK = L({color:0x6b5a36});
  const EW = L({color:0xe6f0b8}), EG = L({color:0x4c9a2f}), EB = L({color:0x101010}), EH = L({color:0xffffff}), EM = L({color:0x3a2412}), YD = L({color:0xd99a1e});
  // 1) 找出頭髮（頭上除了頭本身 [0] 以外的方塊；眼鏡是 Group 不會被選到），劉海是 z≈0.47 的那幾片
  const hair = c.head.children.slice(1).filter(o=>o.isMesh);
  const fringe = hair.filter(o=>Math.abs(o.position.z - 0.47) < 1e-3);
  // 2) 隱藏原本的衣服：髖部底下除了頭（臉、眼鏡、劉海）和招式道具以外全部藏起來
  const keep = new Set();
  c.head.traverse(o=>keep.add(o));
  Object.values(c.props).forEach(p=>p.traverse(o=>keep.add(o)));
  c.hips.traverse(o=>{ if (o.isMesh && !keep.has(o)) o.visible = false; });
  hair.forEach(o=>{ if (!fringe.includes(o)) o.visible = false; });                            // 只留劉海
  const add = (parent, mesh, x, y, z)=>{ mesh.position.set(x,y,z); parent.add(mesh); return mesh; };
  const ball = (r, mat, sx, sy, sz)=>{ const m = new THREE.Mesh(new THREE.SphereGeometry(r,12,8), mat); m.scale.set(sx,sy,sz); return m; };
  // 3) 頭套：圓頂＋臉頰＋後腦，臉的前面是開的，劉海垂在帽緣下
  add(c.head, rbox(1.3,0.62,1.32,.65,Y), 0, 0.77, -0.02);
  add(c.head, rbox(1.02,0.34,1.04,.8,Y), 0, 1.16, -0.02);
  [-1,1].forEach(s=>{
    add(c.head, rbox(0.2,1.0,1.0,.5,Y), s*0.6, 0.05, -0.05);
    add(c.head, ball(0.34,YD,.22,1,1), s*0.62, 0.78, 0.16);                               // 眼皮圈
    add(c.head, ball(0.3,EW,.3,1,1), s*0.66, 0.78, 0.16);                                  // 兩側的大眼睛：眼白
    add(c.head, ball(0.21,EG,.3,1,1), s*0.715, 0.78, 0.19);                                // 綠色眼珠
    add(c.head, ball(0.12,EB,.5,1,1), s*0.745, 0.78, 0.22);                                // 黑瞳孔（比眼珠更突出才看得到）
    add(c.head, ball(0.045,EH,.5,1,1), s*0.79, 0.84, 0.25);                                // 反光小白點
    for (let i=0;i<=14;i++){ const t=i/14; add(c.head, ball(0.03,EM,1,1,1), s*0.705, 0.32 - 0.03*Math.sin(Math.PI*t) + 0.05*t*t*t, 0.44 - 0.45*t); }   // 頭套側邊的細細嘴線，尾端微微上揚
  });
  add(c.head, rbox(1.34,0.08,1.36,.4,YD), 0, 0.49, -0.02);                                    // 帽緣深黃滾邊
  add(c.head, rbox(1.2,1.0,0.25,.5,Y), 0, 0.05, -0.58);
  add(c.head, rbox(1.0,0.5,0.95,.5,Y), 0, -0.62, -0.04);                                      // 脖子
  // 4) 梨形大肚子＋米色肚皮
  add(c.chest, ball(1.25,Y,1.0,1.15,0.9), 0, 0.85, 0);                                        // 上緣停在下巴下面，才不會蓋住大笑的嘴
  add(c.chest, ball(1.2,Y,1.0,.8,.95), 0, 0.05, 0);
  add(c.chest, ball(0.95,TAN,1,1.2,.4), 0, 0.6, 0.85);
  // 恐龍那種長尾巴：從屁股往後一路變細，中段微微上揚，尾端自然下垂
  for (let i=0;i<=10;i++){ const t=i/10; add(c.chest, ball(0.62*(1-t)+0.14*t,Y,1,1,1.5), 0, 0.22 - 0.52*t*t, -1.2 - 2.6*t); }   // 一節節變細，連起來像一條平滑的尾巴
  // 5) 手臂＋深色三指手
  [c.R, c.Lf].forEach(a=>{
    add(a.sh, rbox(0.74,1.35,0.74,.7,Y), 0, -0.6, 0);
    add(a.el, rbox(0.64,1.15,0.64,.7,Y), 0, -0.5, 0);
    add(a.hd, ball(0.36,DK,.95,1.05,.8), 0, -0.15, 0.05);
    [-1,0,1].forEach(i=>add(a.hd, rbox(0.12,0.3,0.14,.4,DK), i*0.14, -0.45, 0.08));
  });
  // 6) 粗腿＋深色三趾腳
  [c.joints.rHp, c.joints.lHp].forEach(h=>add(h, rbox(0.9,1.8,0.9,.7,Y), 0, -0.8, 0));
  [c.joints.rKn, c.joints.lKn].forEach(k=>{
    add(k, rbox(0.8,1.5,0.85,.7,Y), 0, -0.7, 0);
    add(k, rbox(0.85,0.4,1.2,.6,DK), 0, -1.5, 0.22);
    [-1,0,1].forEach(i=>add(k, rbox(0.22,0.24,0.3,.5,DK), i*0.27, -1.55, 0.88));
  });
}
// 選造型畫面的頭像：core.js 對所有造型都畫生日帽，這裡讓造型可以自己提供 portrait(g) 來取代
function karlCostumePortrait(g){
  g.fillStyle = '#f0b232';
  g.fillRect(0,59,64,5);                                                   // 玩偶服身體
  g.fillRect(0,8,10,46); g.fillRect(54,8,10,46);                           // 頭套臉頰
  g.fillRect(0,0,64,16);                                                   // 頭套圓頂（劉海和眼鏡是原本頭像畫的，保留）
  g.fillStyle = '#d99a1e'; g.fillRect(0,15,64,3);                          // 帽緣滾邊
  [14,50].forEach(x=>{                                                     // 兩側的綠色大眼睛
    g.fillStyle = '#e6f0b8'; g.beginPath(); g.arc(x,11,5.5,0,7); g.fill();
    g.fillStyle = '#4c9a2f'; g.beginPath(); g.arc(x,11,3.6,0,7); g.fill();
    g.fillStyle = '#101010'; g.beginPath(); g.arc(x,11,2,0,7); g.fill();
    g.fillStyle = '#ffffff'; g.fillRect(x+1,8,1.5,1.5);
  });
}
(function(){
  if (typeof portraitCanvas !== 'function' || portraitCanvas.skinHook) return;
  const base = portraitCanvas;
  const wrapped = function(kind, skin = 0){
    const S = skin > 0 && CHARS[kind] && CHARS[kind].skins && CHARS[kind].skins[skin-1];
    if (!S || !S.portrait) return base(kind, skin);                         // 其他造型照舊畫生日帽
    const cv = base(kind, 0); S.portrait(cv.getContext('2d')); return cv;
  };
  wrapped.skinHook = true;
  portraitCanvas = wrapped;
})();
registerChar('karl', {
  stats: { name:'白狗', en:'Karl', tag:'樂天大笑・物理・跑步・活著真好', weight:1.0, run:15.5, air:11.5, jumpV:30, djV:26, jumps:2 },
  skins: [{ name:'黃色玩偶服', apply: karlCostume, portrait: karlCostumePortrait }],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['laughIn','laugh'], box:[1.5,3.6,2.0], dmg:6, kb:8, sc:.7, ang:40, text:'哈哈！', sfx:'laughShort'},
    side:{t:[.18,.18,.32], pose:['sprint','sprint'], box:[1.9,3.4,1.6], dmg:14, kb:11, sc:1.05, ang:36, dash:26, text:'衝啊！', sfx:'swing'},
    up:{t:[.16,.12,.3], pose:['climbUp2','climbUp'], box:[0.4,6.6,1.8], dmg:12, kb:11, sc:1, ang:88, text:'攀岩！'},
    down:{t:[.22,.1,.32], pose:['bookUp','bookSlam'], box:[1.9,0.9,1.7], dmg:11, kb:9, sc:.85, ang:70, prop:'book', text:'F=ma！', sfx:'spike'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.12,.1,.2], pose:['batWind','batHit'], box:[2.3,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'book', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','climbUp'], box:[0.3,6.3,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['bookUp','bookSlam'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'book', sfx:'spike'},
    nB:{t:[.22,.05,.28], pose:['throwWind','throwHit'], prop0:'berries', fire:[[.22,'berry']], air:1, sfx:'swing'},
    sB:{t:[.15,.1,.3], pose:['throwWind','throwHit'], fire:[[.15,'whiteDog']], air:1},
    uB:{t:[.05,.55,.1], pose:['climbUp','climbUp2'], poseSwitch:.3, start:'climbJump', box:[0.4,4.8,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},
    dB:{t:[.2,.45,.3], pose:['selfie','selfie'], prop:'phone', box:[1.6,3.8,2.6], dmg:4, kb:2, sc:.1, ang:50, onHit:'cringe', air:1, text:'對不起……我喜歡你', textCls:'blue', sfx:'sob'},
  },
  fire: {
  berry(f){ proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.6, vx:f.face*16, vy:10, g:34, r:.8, life:2, bounce:1, dmg:5, kb:4, sc:.4, ang:45, onHit:'poison', mesh:berryBunch(1.2), spin:1}); pop('吃吃看？', f.x, f.y+7); },
  whiteDog(f){ const d = buildDog(); d.g.scale.set(f.face,1,1); proj({owner:f, x:f.x+f.face*1.8, y:f.y, vx:f.face*28, vy:0, g:0, wave:.5, r:1.4, life:.75, dmg:9, kb:10, sc:.8, ang:35, mesh:d.g}); pop('白狗！汪！', f.x, f.y+7); SFX.bark(); },
  },
  start: {
  climbJump(f){ f.vy = 32; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; pop('攀岩！', f.x, f.y+7); burst(f.x, f.y+1, 0x8a7a62, 8, 8); },
  },
  onhit: {
  poison(a,v){ v.slowT = 2.5; v.state = 'stun'; v.stunT = .45; v.move = null; pop('中毒了！', v.x, v.y+7.5, 'red'); burst(v.x, v.y+5, 0x7fd060, 8, 5); },
  cringe(a,v){ v.state = 'stun'; v.stunT = .8; v.move = null; v.vx *= .3; pop('好尷尬……', v.x, v.y+7.5, 'blue'); },
  },
  build: buildKarl, face: kFaces.normal, portraitBg: '#e9e4da',
  portrait(g){
    g.fillRect(4,6,56,14); g.fillRect(4,10,6,18); g.fillRect(54,10,6,18);
    for (let i=0;i<6;i++) g.fillRect(5+i*9, 1+(i%2)*3, 9, 7);
    g.fillRect(8,18,22,5); g.fillRect(28,18,16,3);
    g.strokeStyle = '#3b2417'; g.lineWidth = 3;
    g.beginPath(); g.arc(22,40,7,0,7); g.stroke(); g.beginPath(); g.arc(42,40,7,0,7); g.stroke();
    g.beginPath(); g.moveTo(29,39); g.lineTo(35,39); g.stroke();
  },
  breakText: '看到哭出來了…', shieldPose: 'kSofa', shieldProp: 'can', finalPose: 'cheer',
  shield: karlShield, shieldAnim: karlShieldAnim,
  poses: {
    kSofa: P({rHp:[-1.55,0,-0.1], lHp:[-1.55,0,0.1], rKn:[1.45], lKn:[1.5], chest:[0.15], head:[0.2,0,0.08], rSh:[-0.5,0,-0.15], rEl:[-1.1], lSh:[0,0,0.45], lEl:[-0.3], drop:-1.0}),
    kSip:  P({rHp:[-1.55,0,-0.1], lHp:[-1.55,0,0.1], rKn:[1.45], lKn:[1.5], chest:[-0.05], head:[-0.55], rSh:[-2.2,0,0.45], rEl:[-1.95], lSh:[0,0,0.45], lEl:[-0.3], drop:-1.0}),
  },
  animate(f, m, s, t, dt){
    if (s!=='shield'){ f.kSipT = 0; return; }
    f.kSipT = (f.kSipT || 0) + dt;
    const sip = (f.kSipT % 2.2) > 1.3;                                       // slump… sip… slump…
    applyPose(m, sip ? POSE.kSip : POSE.kSofa, 1 - Math.exp(-dt*10));
    m.setFace('cry');
    if (sip && Math.random() < dt*3) burst(f.x + (f.face||1)*.3, f.y + 4.4, 0xfff6d0, 1, 1);
  },
  readyPose: (t)=> Math.sin(t*14) > 0 ? POSE.laugh : POSE.cheer,
  selectSfx: ()=>SFX.bark(),
  winSub: '"Life is good!"',
  final: karlFinal, winSetup: karlWinSetup, winUpdate: karlWinUpdate, loseSetup: karlLoseSetup, loseUpdate: karlLoseUpdate, longWin: true, longLose: true,
});
