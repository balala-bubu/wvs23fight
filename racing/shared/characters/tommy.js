/* 偷米 Tommy — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
const T_SKIN = '#cb9672', T_SKIN_C = ['#c08a66','#d4a07c','#c48f6b','#bd8762'];
const greyHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#a7a29a',['#c4bfb7','#8d887f'],.55);
  g.fillStyle='#e8e4dc';
  for(let i=0;i<34;i++){ let x=(rnd()*32)|0, y=(rnd()*32)|0, l=3+((rnd()*5)|0); for(let k=0;k<l;k++) g.fillRect((x+k)%32,(y+(k>>1))%32,1,1); }
});
const tSkinTex = tex(16,16,(g)=>speckle(g,16,16,T_SKIN,T_SKIN_C,.4));
function tommyFace(g, mode){
  speckle(g,64,64,T_SKIN,T_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(215,105,85,.34)';
  g.beginPath(); g.ellipse(15,41,7,5,0,0,7); g.fill();
  g.beginPath(); g.ellipse(49,41,7,5,0,0,7); g.fill();
  g.fillStyle='rgba(255,240,225,.45)'; g.fillRect(50,37,3,2); g.fillRect(13,38,2,1);
  if (mode==='normal'){
    g.fillStyle='#1d1512';
    g.fillRect(12,23,14,3); g.fillRect(14,22,10,1);
    g.fillRect(38,23,14,3); g.fillRect(40,22,10,1);
    g.strokeStyle='#1d1310'; g.lineWidth=2;
    g.beginPath(); g.arc(20,36,6,Math.PI*1.2,Math.PI*1.8); g.stroke();
    g.beginPath(); g.arc(44,36,6,Math.PI*1.2,Math.PI*1.8); g.stroke();
  } else if (mode==='cry'){
    g.fillStyle='#1d1512';
    g.fillRect(12,25,4,2); g.fillRect(16,24,5,2); g.fillRect(21,23,5,2);
    g.fillRect(38,23,5,2); g.fillRect(43,24,5,2); g.fillRect(48,25,4,2);
    g.strokeStyle='#1d1310'; g.lineWidth=2;
    g.beginPath(); g.moveTo(15,33); g.lineTo(20,35); g.lineTo(25,33); g.stroke();
    g.beginPath(); g.moveTo(39,33); g.lineTo(44,35); g.lineTo(49,33); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)';
    g.fillRect(16,36,3,16); g.fillRect(45,36,3,16); g.fillRect(15,50,4,3); g.fillRect(44,50,4,3);
  } else {
    g.fillStyle='rgba(110,62,40,.55)';
    [14,17,20].forEach((y,i)=>{ g.fillRect(19+i,y,26-i*2,1); });
    g.fillStyle='#cfc9bf';
    g.fillRect(13,24,13,2); g.fillRect(12,26,4,1); g.fillRect(24,23,3,1);
    g.fillRect(38,24,13,2); g.fillRect(48,26,4,1); g.fillRect(37,23,3,1);
    g.strokeStyle='#1d1310'; g.lineWidth=1;
    g.beginPath(); g.moveTo(15,33); g.lineTo(25,33); g.stroke();
    g.beginPath(); g.moveTo(39,33); g.lineTo(49,33); g.stroke();
    g.strokeStyle='rgba(110,62,40,.55)';
    g.beginPath(); g.arc(20,34,5,Math.PI*.15,Math.PI*.85); g.stroke();
    g.beginPath(); g.arc(44,34,5,Math.PI*.15,Math.PI*.85); g.stroke();
    g.fillStyle='rgba(110,62,40,.55)';
    [[11,31],[11,34],[52,31],[52,34]].forEach(([x,y])=>g.fillRect(x,y,2,1));
    g.fillStyle='rgba(120,72,45,.5)'; g.fillRect(46,27,2,2); g.fillRect(17,44,2,1); g.fillRect(41,16,1,1);
  }
  g.fillStyle='rgba(120,70,45,.4)'; g.fillRect(29,35,6,5);
  g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,41,3,1); g.fillRect(34,41,3,1);
  if (mode==='normal'){
    g.beginPath(); g.moveTo(17,46); g.quadraticCurveTo(32,43,47,46);
    g.quadraticCurveTo(42,56,32,56); g.quadraticCurveTo(22,56,17,46); g.closePath();
    g.fillStyle='#4a1715'; g.fill();
    g.save(); g.clip(); g.fillStyle='#f1eadf'; g.fillRect(16,43,32,6);
    g.fillStyle='#b9ab98'; g.fillRect(35,45,1,4); g.restore();
  } else if (mode==='cry'){
    g.beginPath(); g.moveTo(22,52); g.quadraticCurveTo(32,44,42,52); g.quadraticCurveTo(32,49,22,52); g.closePath();
    g.fillStyle='#4a1715'; g.fill();
    g.fillStyle='#4a1715'; g.fillRect(22,51,20,3);
  } else {
    g.fillStyle='#d8d2c7'; g.fillRect(24,44,16,2); g.fillRect(22,45,3,2); g.fillRect(39,45,3,2);
    g.fillStyle='#5a2420'; g.fillRect(25,49,14,1);
    g.strokeStyle='rgba(105,58,38,.65)'; g.lineWidth=1;
    g.beginPath(); g.moveTo(17,39); g.quadraticCurveTo(13,47,18,55); g.stroke();
    g.beginPath(); g.moveTo(47,39); g.quadraticCurveTo(51,47,46,55); g.stroke();
  }
}
const tFaces = { normal:tex(64,64,(g)=>tommyFace(g,'normal')), cry:tex(64,64,(g)=>tommyFace(g,'cry')), old:tex(64,64,(g)=>tommyFace(g,'old')) };
const CREAM = '#ebe2d0', CREAM_C = ['#e0d6c2','#f3ecde','#d9cfba'];
const tCreamTex = tex(32,32,(g)=>{ speckle(g,32,32,CREAM,CREAM_C,.45); g.fillStyle='rgba(150,130,100,.18)'; for(let i=0;i<8;i++) g.fillRect((rnd()*28)|0,(rnd()*32)|0,4,1); });
const tFrontTex = tex(32,46,(g)=>{
  speckle(g,32,46,CREAM,CREAM_C,.45);
  g.fillStyle='rgba(150,130,100,.18)'; for(let i=0;i<10;i++) g.fillRect((rnd()*28)|0,(rnd()*46)|0,4,1);
  g.beginPath(); g.moveTo(11,0); g.lineTo(21,0); g.lineTo(16,12); g.closePath(); g.fillStyle='#d6c4a6'; g.fill();
  g.fillStyle='#c4b090'; g.fillRect(13,0,6,1);
  g.fillStyle='#d3c8b2'; g.fillRect(16,12,1,34);
  g.fillStyle='#f8f4ec'; [17,25,33,41].forEach(y=>g.fillRect(17,y,1,1));
  g.strokeStyle='#d0c5ae'; g.lineWidth=1; g.strokeRect(21.5,16.5,6,6);
  const gr=g.createLinearGradient(0,0,32,0); gr.addColorStop(0,'rgba(120,100,70,.25)'); gr.addColorStop(.2,'rgba(0,0,0,0)'); gr.addColorStop(.8,'rgba(0,0,0,0)'); gr.addColorStop(1,'rgba(120,100,70,.25)');
  g.fillStyle=gr; g.fillRect(0,0,32,46);
});
const tStripeV = tex(16,16,(g)=>{ speckle(g,16,16,CREAM,CREAM_C,.45); g.fillStyle='#2a4fb0'; g.fillRect(5,0,2,16); g.fillRect(9,0,2,16); });
const tStripeH = tex(16,16,(g)=>{ speckle(g,16,16,CREAM,CREAM_C,.45); g.fillStyle='#2a4fb0'; g.fillRect(0,5,16,2); g.fillRect(0,9,16,2); });
const tPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#2d3650',['#37415e','#252c42','#3d4866'],.5); g.fillStyle='rgba(255,255,255,.05)'; for(let y=0;y<32;y+=3) g.fillRect(0,y,32,1); });
const ballTex = tex(32,16,(g)=>{
  const cols=['#f4c22f','#f6f3ea','#2a4fb0','#f6f3ea'];
  for(let i=0;i<8;i++){ g.fillStyle=cols[i%4]; g.fillRect(i*4,0,4,16); }
  g.fillStyle='rgba(0,0,0,.12)'; g.fillRect(0,0,32,1); g.fillRect(0,15,32,1);
});
const guitarTex = tex(16,16,(g)=>{ speckle(g,16,16,'#c4622c',['#b3541f','#d17437','#a94c1c'],.4); g.fillStyle='#2a1508'; g.beginPath(); g.arc(8,8,3,0,7); g.fill(); g.fillStyle='#e6dcc6'; g.fillRect(7,0,2,16); });
const heartTex = tex(16,16,(g)=>{
  const H=['0110000110','1111001111','1111111111','1111111111','0111111110','0011111100','0001111000','0000110000'];
  H.forEach((r,y)=>[...r].forEach((c,x)=>{ if(c==='1'){ g.fillStyle = y<2 ? '#ff7a8a' : '#e0283c'; g.fillRect(x+3,y+4,1,1); } }));
  g.fillStyle='#000'; [[8,4],[8,5],[7,6],[8,7],[9,8],[8,9],[8,10]].forEach(([x,y])=>{ g.clearRect(x,y,1,1); });
});
const ballM = L({map:ballTex});
const ballMesh = (r) => new THREE.Mesh(new THREE.SphereGeometry(r,10,8), ballM);
const tSkinM = L({map:tSkinTex}), tCreamM = L({map:tCreamTex}), tFrontM = L({map:tFrontTex}), tPantsM = L({map:tPantsTex});
const stripeV = L({map:tStripeV}), stripeH = L({map:tStripeH});
function buildTommy(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:tFaces.normal});
  const c = buildChar({
    skinM:tSkinM, faceM, headW:1.06, headH:1.12, watch:true,
    torsoMat:[tCreamM,tCreamM,tCreamM,tCreamM,tFrontM,tCreamM],
    sleeve:[0.68,0.95],
    sleeveMat:(s)=> s===1 ? [stripeV,tCreamM,stripeH,tCreamM,tCreamM,tCreamM] : [tCreamM,stripeV,stripeH,tCreamM,tCreamM,tCreamM],
    pantsM:tPantsM, shoeM, soleM:blueSole,
    collar(chest){
      [-1,1].forEach(s=>{ const l = rbox(0.34,0.55,0.07,.3,tCreamM); l.position.set(s*0.24,1.98,0.47); l.rotation.set(-0.12,0,s*0.42); chest.add(l); });
      chest.add(at(rbox(0.8,0.22,0.36,.4,tCreamM),0,2.28,-0.12));
    },
    hair(head){
      const cap = at(rbox(1.16,0.5,1.14,.62,hairM),0,0.47,-0.02); head.add(cap);
      head.add(at(rbox(1.12,0.95,0.55,.6,hairM),0,0.08,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.1,0.32,0.36,.4,hairM),s*0.53,0.24,0.06)));
      const crown = new THREE.Group(); head.add(crown);
      [[-0.2,0.05,0.4],[0.1,-0.1,-0.3],[0.28,0.12,0.5],[-0.05,-0.3,0.2],[0.3,-0.25,-0.4]].forEach(([x,z,r])=>{
        const k = new THREE.Mesh(new THREE.ConeGeometry(0.11,0.3,4), hairM); k.position.set(x,0.74,z); k.rotation.set(r*0.6,0,r); crown.add(k);
      });
      const fringe = new THREE.Group(); fringe.position.set(0,0.3,0.48); head.add(fringe);
      for(let i=0;i<7;i++){
        const k = new THREE.Mesh(new THREE.ConeGeometry(0.095,0.34,4), hairM);
        k.position.set(-0.4+i*0.133, -0.04 + (i%2)*0.03, 0); k.rotation.set(Math.PI+0.25,0,(i-3)*0.07); fringe.add(k);
      }
      return {cap, fringe, crown};
    }
  }, parent);
  const ball = ballMesh(0.5); ball.position.set(0,-0.6,0.05); c.R.hd.add(ball);
  const syringe = new THREE.Group(); c.R.hd.add(syringe);
  syringe.add(at(cyl(0.1,0.1,0.8,new THREE.MeshLambertMaterial({color:0xe6f2f6,transparent:true,opacity:.8}),8),0,-0.55,0));
  syringe.add(at(cyl(0.07,0.07,0.6,L({color:0x7fd0a0}),6),0,-0.6,0));
  syringe.add(at(cyl(0.015,0.015,0.45,L({color:0xbfc4c8}),4),0,-1.17,0));
  syringe.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.3,0.05,0.3),L({color:0xcfd6da})),0,-0.12,0));
  const guitar = new THREE.Group(); guitar.position.set(0.15,0.95,0.62); guitar.rotation.set(0.05,0,0.75); c.chest.add(guitar);
  const gM = L({map:guitarTex});
  guitar.add(rbox(1.0,0.78,0.28,.45,[gM,gM,gM,gM,gM,gM]));
  guitar.add(at(rbox(0.75,0.6,0.28,.45,gM),0,0.5,0));
  guitar.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.16,1.6,0.1),L({color:0x3a2416})),0,1.55,0.05));
  guitar.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.26,0.32,0.1),L({color:0x2a1a10})),0,2.45,0.05));
  const cane = new THREE.Group(); cane.position.set(-1.05,0,0.75); c.root.add(cane);
  const caneM = L({color:0x6b4423});
  cane.add(at(cyl(0.06,0.06,2.9,caneM,5),0,1.45,0));
  cane.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.4,0.09,0.09),caneM),0.16,2.9,0));
  cane.scale.y = 0.001;
  c.props = {ball, syringe, guitar};
  let faceNow = 'normal', hairOld = false;
  c.setOld = (k)=>{
    const ex = c.extra;
    ex.cap.position.y = 0.47 + 0.13*k;
    ex.fringe.scale.y = Math.max(0.001, 1-k);
    ex.crown.scale.setScalar(Math.max(0.001, 1-k*0.7));
    cane.scale.y = Math.max(0.001, k);
    const o = k>0.5;
    if (o !== hairOld){ hairOld = o; hairM.map = o ? greyHairTex : blackHairTex; hairM.needsUpdate = true; }
  };
  c.setFace = (f)=>{ if (f!==faceNow){ faceNow = f; faceM.map = tFaces[f]; faceM.needsUpdate = true; } };
  return c;
}
const armyM = L({color:0x55603a}), armyDark = L({color:0x2e3322});
const soldierFace = tex(16,16,(g)=>{ speckle(g,16,16,T_SKIN,T_SKIN_C,.3); g.fillStyle='#1d1512'; g.fillRect(4,7,2,1); g.fillRect(10,7,2,1); g.fillStyle='#5a2420'; g.fillRect(6,11,4,1); });
const soldierFaceM = L({map:soldierFace});
function buildSoldier(salute){
  const g = new THREE.Group();
  const b = new THREE.Group(); b.scale.setScalar(SC); g.add(b);
  b.add(at(rbox(1.3,1.9,0.85,.3,armyM),0,3.45,0));
  b.add(at(rbox(0.85,0.9,0.85,.6,[tSkinM,tSkinM,tSkinM,tSkinM,soldierFaceM,tSkinM]),0,4.85,0));
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.58,8,5,0,Math.PI*2,0,Math.PI/2), armyM); helm.position.set(0,5.05,0); helm.scale.set(1.05,0.9,1.1); b.add(helm);
  const legs = [-1,1].map(s=>{ const p = pivot(b,s*0.32,2.5,0); p.add(at(rbox(0.5,2.4,0.55,.3,armyDark),0,-1.2,0)); p.add(at(rbox(0.55,0.35,0.85,.4,black),0,-2.35,0.12)); return p; });
  if (salute){
    const ra = pivot(b,-0.72,4.2,0); const rUp = rbox(0.36,1.0,0.36,.4,armyM); rUp.position.y = -0.45; ra.add(rUp); ra.rotation.set(-0.35,0,-1.15);
    const rf = pivot(ra,0,-0.9,0); const rLo = rbox(0.32,1.0,0.32,.4,armyM); rLo.position.y = -0.45; rf.add(rLo); rf.rotation.set(0,0,-2.55);
    const hand = rbox(0.3,0.34,0.12,.4,tSkinM); hand.position.y = -1.0; rf.add(hand);
    const la = rbox(0.36,1.9,0.36,.4,armyM); la.position.set(0.72,3.3,0); b.add(la);
  } else {
    [-1,1].forEach(s=>{ const a = rbox(0.38,1.4,0.38,.4,armyM); a.position.set(s*0.6,3.6,0.45); a.rotation.x = -1.1; b.add(a); });
    b.add(at(ballMesh(0.5),0,3.7,1.15));
  }
  return {g, legs};
}

/* white dogs + cars for Karl（白狗） */
function buildJet(){
  const g = new THREE.Group(), m = L({color:0xc9ced6}), d = L({color:0x5d6672});
  const f = cyl(0.42,0.42,4.2,m,8); f.rotation.z = Math.PI/2; g.add(f);
  const n = new THREE.Mesh(new THREE.ConeGeometry(0.42,1.2,8), m); n.rotation.z = -Math.PI/2; n.position.x = 2.7; g.add(n);
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.5,0.1,4.2), d),0.1,0,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.9,1.1,0.1), d),-1.8,0.6,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.08,1.8), d),-1.9,0.1,0));
  return g;
}
function buildWheelchair(){
  const g = new THREE.Group(), frame = L({color:0x9aa3ad}), seatM = L({color:0x2a3550}), tire = L({color:0x1d1d22});
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.7,0.18,1.5), seatM),0,1.95,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(1.7,1.6,0.14), seatM),0,2.8,-0.72));
  [-1,1].forEach(s=>{
    const w = new THREE.Mesh(new THREE.TorusGeometry(1.15,0.1,5,16), tire); w.rotation.y = Math.PI/2; w.position.set(s*1.0,1.2,-0.25); g.add(w);
    const hub = cyl(0.12,0.12,0.15,frame,6); hub.rotation.z = Math.PI/2; hub.position.set(s*1.0,1.2,-0.25); g.add(hub);
    const cw = new THREE.Mesh(new THREE.TorusGeometry(0.28,0.07,4,10), tire); cw.rotation.y = Math.PI/2; cw.position.set(s*0.75,0.32,0.75); g.add(cw);
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,1.7,0.08), frame),s*0.8,1.2,0.72));
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,1.4), frame),s*0.88,2.55,0));
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.1,0.5), black),s*0.75,3.6,-0.95));
  });
  return g;
}
function tommyFinal(f, opp){
    f.finalT = 1.8; G.sepiaT = 3.6; SFX.whistle(); banner('想當年……全排出擊！');
    const squad = [];
    for (let i=0;i<6;i++){ const s = buildSoldier(); scene.add(s.g); squad.push({...s, x: -f.face*40 - f.face*i*3.6, hit:new Set(), i}); }
    G.finals.push({type:'squad', owner:f, dir:f.face, squad, t:0, update:tommyFinalUpdate, dispose:(F)=>F.squad.forEach(s=>scene.remove(s.g))});
}
function tommyFinalUpdate(F, dt, t){
      let alive = 0;
      for (const s of F.squad){
        s.x += F.dir*24*dt;
        if (Math.abs(s.x) < 46) alive++;
        s.g.position.set(s.x, 0, -.3 + (s.i%2)*.6);
        s.g.rotation.y = F.dir*(Math.PI/2 - .4);
        s.legs[0].rotation.x = Math.sin(t*16 + s.i)*.7; s.legs[1].rotation.x = -Math.sin(t*16 + s.i)*.7;
        s.g.position.y = Math.abs(Math.sin(t*16 + s.i))*.25;
        if (Math.floor(t*8)!==Math.floor((t-dt)*8) && s.i===0 && Math.abs(s.x)<30) SFX.march();
        for (const v of G.fighters){
          if (v===F.owner || !v.hittable() || s.hit.has(v)) continue;
          if (Math.abs(v.x - s.x) < 1.8 && v.y < 9 && v.y > -3){
            s.hit.add(v);
            if (s.i < 5){ v.pct += 5; v.meter = Math.min(100, v.meter+3); launch(v, 0, 0, F.dir); v.vx = F.dir*11; v.vy = 11; v.hitstun = .55; SFX.spike(); spark(v.x, v.y+3, 1.6); pop(['嘿！','哈！','殺！','一！','二！'][s.i], v.x, v.y+7); }
            else { launch(v, 32 + v.pct*.11, 42, F.dir); SFX.hit(40); G.shake = reduce ? .2 : 1.1; G.freeze = .14; spark(v.x, v.y+3, 4); pop('全排扣殺！', v.x, v.y+8, 'big'); }
          }
        }
      }
      return !alive && F.t > 1;
}
function tommyWinSetup(R){
  const W = R.W;
    R.jets = []; R.soldiers = [];
  for (let i=0;i<5;i++){ const j = buildJet(); j.position.set(-60 - i*4.5, RS_Y + 16 + Math.abs(i-2)*1.6, -14 - Math.abs(i-2)*2); scene.add(j); R.jets.push(j); R.items.push(j); }
    for (let i=0;i<6;i++){ const s = buildSoldier(true); const side = i<3 ? -1 : 1, k = i%3;
      s.g.position.set(W.m.holder.position.x + side*(3.6 + k*2.6), RS_Y, -2 - k*1.2); s.g.rotation.y = -side*0.55; scene.add(s.g); R.soldiers.push(s); R.items.push(s.g); }
    R.look.set(-6, RS_Y + 15, -10);
}
function tommyWinUpdate(R, dt, k){
  const W = R.W;
    once('jet', .1, ()=>SFX2.jet());
    R.jets.forEach((j, i)=>{
      j.position.x += dt*38;
      if (j.position.x > -50 && j.position.x < 60 && Math.random() < .45){
        const col = [0xe8483c,0xffffff,0x3c6fe8,0xf2c14e,0x5fc46a][i];
        const p = spriteOf(puffTex, 1.2, col); p.position.copy(j.position); p.position.x -= 2.4; scene.add(p);
        R.puffs.push({o:p, life:3.6, vy:-.3, grow:1.4});
      }
    });
    applyPose(W.m, R.t > 2.2 ? POSE.salute : POSE.stand, k);
    once('fan', 2.3, ()=>{ SFX2.fanfare(); popAt('敬禮！', W, 8, 'big'); });
    const up = Math.max(0, Math.min(1, (R.t - 1.4)/1.2)); const e = up*up*(3-2*up);
    R.look.set(-6 + 7.5*e, RS_Y + 15 - 11.6*e, -10 + 10*e);
}
function tommyLoseSetup(R){
  const Lz = R.Lz;
  R.chair = buildWheelchair(); R.chair.position.set(9, 0, 0); R.chair.scale.setScalar(1/SC); Lz.m.body.add(R.chair); R.attach.push(R.chair);
}
function tommyLoseUpdate(R, dt, k){
  const Lz = R.Lz;
    const age = Math.max(0, Math.min(1, (R.t - .4)/1.4));
    Lz.oldK = age; Lz.m.setOld(age); Lz.m.setFace(age > .5 ? 'old' : 'normal');
    once('old', 1.0, ()=>popAt('咦……腰……', Lz, 7.5, 'blue'));
    const cx = Math.max(0, 9 - Math.max(0, R.t - 2.0)*9);
    if (R.chair) R.chair.position.x = cx;
    if (R.t > 3.0){ applyPose(Lz.m, POSE.sit, k); once('sigh', 3.1, ()=>{ SFX2.sigh(); popAt('唉，年紀大了', Lz, 6.5, 'blue'); }); }
    else applyPose(Lz.m, age > .3 ? POSE.old : POSE.dizzy, k);
}
/* ---- 軍裝造型：軍樂隊制服（白胸襟、藏青長袖、金色穗帶／鈕釦／肩穗、白褲、白腰帶） ---- */
const TMIL_NAVY = '#1f2358', TMIL_NAVY_C = ['#1a1e4e','#262b66','#161a44'];
const TMIL_WHITE = '#ecebf3', TMIL_WHITE_C = ['#e2e1ec','#f5f4fa','#d8d7e4'];
const TMIL_GOLD = '#e3b22a', TMIL_GOLD_L = '#f4d460', TMIL_GOLD_D = '#a87a12';
let _tMil = null;
function tMilFace(g){                                   // 正面照的臉：黑短髮（髮型沿用偷米的）、粗直眉、平靜的眼神、嘴巴抿著
  speckle(g,64,64,T_SKIN,T_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(215,105,85,.22)';
  g.beginPath(); g.ellipse(15,42,6,4,0,0,7); g.fill();
  g.beginPath(); g.ellipse(49,42,6,4,0,0,7); g.fill();
  g.fillStyle='#161110';
  g.fillRect(11,24,5,2); g.fillRect(16,25,5,2); g.fillRect(21,26,5,2);                 // 眉：外高內低，有點酷
  g.fillRect(48,24,5,2); g.fillRect(43,25,5,2); g.fillRect(38,26,5,2);
  [19.5,44.5].forEach(cx=>{
    g.save(); g.beginPath(); g.ellipse(cx,35.5,6.5,2.8,0,0,7); g.clip();
    g.fillStyle='#efe9e0'; g.fillRect(cx-8,32,16,7);
    g.fillStyle='#2b1b13'; g.beginPath(); g.arc(cx,35.5,2.7,0,7); g.fill();
    g.fillStyle='#fff'; g.fillRect(cx-1,34,1,1);
    g.restore();
    g.strokeStyle='#120d0b'; g.lineWidth=1.6; g.beginPath(); g.ellipse(cx,35.6,6.6,2.9,0,Math.PI*1.05,Math.PI*1.95); g.stroke();
  });
  g.fillStyle='rgba(120,70,45,.4)'; g.fillRect(29,35,6,5);
  g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(27,41,3,1); g.fillRect(34,41,3,1);
  g.fillStyle='#6e342d'; g.fillRect(25,47,14,1);
  g.fillStyle='rgba(176,98,84,.8)'; g.fillRect(27,48,10,2);
  g.fillStyle='rgba(90,50,30,.2)'; g.fillRect(26,52,12,1);
}
function tMilAssets(){
  if (_tMil) return _tMil;
  const navy = (g,w,h)=>speckle(g,w,h,TMIL_NAVY,TMIL_NAVY_C,.4);
  const white = (g,w,h)=>speckle(g,w,h,TMIL_WHITE,TMIL_WHITE_C,.35);
  const panel = (g,w,h)=>{                              // 白色胸襟 + 兩側藏青肩袖，邊緣滾金邊（正面和背面共用）
    white(g,w,h);
    [false,true].forEach(m=>{
      const X = (x)=> m ? w-x : x;
      g.save(); g.beginPath(); g.moveTo(X(0),0); g.lineTo(X(36),0); g.lineTo(X(28),12); g.lineTo(X(22),34); g.lineTo(X(19),h); g.lineTo(X(0),h); g.closePath(); g.clip();
      navy(g,w,h); g.restore();
      g.strokeStyle=TMIL_GOLD; g.lineWidth=1.5; g.beginPath(); g.moveTo(X(36),0); g.lineTo(X(28),12); g.lineTo(X(22),34); g.lineTo(X(19),h); g.stroke();
    });
  };
  const A = {};
  A.front = tex(96,138,(g,w,h)=>{
    panel(g,w,h);
    g.fillStyle='rgba(120,120,150,.5)'; g.fillRect(48,14,1,100);                         // 拉鍊
    [34,52,70,88,106].forEach(y=>{                                                       // 五排金色橫飾帶 + 金鈕釦
      g.fillStyle=TMIL_GOLD; g.fillRect(23,y,24,2); g.fillRect(50,y,24,2);
      [24,72].forEach(x=>{ g.beginPath(); g.arc(x,y+1,2.8,0,7); g.fillStyle=TMIL_GOLD_L; g.fill(); g.strokeStyle='#8c6a10'; g.lineWidth=.8; g.stroke(); });
    });
    g.lineCap='round';                                                                   // 金色穗帶：從右肩垂下、斜過胸口、尾端兩串流蘇
    const cord = (path)=>{ g.strokeStyle=TMIL_GOLD; g.lineWidth=3; path(); g.stroke(); g.strokeStyle='#fbe58a'; g.lineWidth=1; g.setLineDash([1,3]); path(); g.stroke(); g.setLineDash([]); };
    cord(()=>{ g.beginPath(); g.moveTo(7,3); g.quadraticCurveTo(10,70,20,114); });
    cord(()=>{ g.beginPath(); g.moveTo(20,114); g.quadraticCurveTo(52,112,74,46); });
    g.fillStyle=TMIL_GOLD; g.fillRect(71,44,6,4);
    for (let k=0;k<2;k++){ const x=70+k*5, hh=16-k*4; g.fillStyle=TMIL_GOLD; g.fillRect(x,48,3,hh); g.fillStyle=TMIL_GOLD_D; for(let y=50;y<48+hh;y+=2) g.fillRect(x+1,y,1,1); }
  });
  A.back = tex(96,138,(g,w,h)=>{ panel(g,w,h); g.fillStyle='rgba(120,120,150,.4)'; g.fillRect(48,6,1,120); });
  A.side = tex(32,46,navy);
  A.navy = tex(16,16,navy);
  A.pants = tex(32,32,(g)=>{ speckle(g,32,32,'#e6e8f4',['#dcdeec','#f0f1f8','#d3d5e6'],.35); g.fillStyle='rgba(140,145,175,.45)'; g.fillRect(16,0,1,32); });
  A.belt = tex(64,16,(g)=>{
    speckle(g,64,16,'#eeeef4',['#e4e4ec','#f7f7fb'],.3);
    g.fillStyle='#a5a7b8'; for(let x=4;x<62;x+=6) g.fillRect(x,7,2,2);
    g.fillStyle='rgba(150,150,170,.5)'; g.fillRect(0,0,64,1); g.fillRect(0,15,64,1);
  });
  A.face = tex(64,64,tMilFace);
  A.faces = { normal:A.face, cry:tFaces.cry, old:tFaces.old };
  return (_tMil = A);
}
function tMilPortrait(g){                               // 選角小頭像：換成軍裝的臉，疊回偷米的瀏海，下方畫藏青金邊立領和白胸襟
  const A = tMilAssets();
  try { g.drawImage(A.face.image, 6, 12, 52, 52); } catch(_){}
  g.fillStyle = '#151110'; CHARS.tommy.portrait(g);
  g.fillStyle = TMIL_NAVY; g.fillRect(0,54,64,10);
  g.fillStyle = TMIL_GOLD; g.fillRect(0,54,64,1);
  g.fillStyle = TMIL_WHITE; g.beginPath(); g.moveTo(21,56); g.lineTo(43,56); g.lineTo(32,64); g.closePath(); g.fill();
  g.fillStyle = TMIL_GOLD_L; g.fillRect(31,59,2,2);
}
function tMilSetFace(c, A){                             // 頭部方塊第 5 面是這個角色專屬的材質，換圖就好；哭臉／老臉沿用偷米原本的
  const fm = c.head.children[0].material[4]; fm.map = A.faces.normal; fm.needsUpdate = true;
  let cur = 'normal';
  c.setFace = (f)=>{ if (f!==cur){ cur = f; fm.map = A.faces[f] || A.faces.normal; fm.needsUpdate = true; } };
}
function tMilApply(c){
  const A = tMilAssets();
  const gold = L({color:0xe3b22a}), goldL = L({color:0xf4d460}), navyM = L({map:A.navy});
  /* 臉：頭部方塊的第 5 面是這個角色專屬的材質，換圖就好；哭臉／老臉沿用偷米原本的 */
  tMilSetFace(c, A);
  /* 身體：白胸襟藏青肩、立領、金邊 */
  const meshes = c.chest.children.filter(o=>o.isMesh), torso = meshes[0];
  const sideM = L({map:A.side}), frontM = L({map:A.front}), backM = L({map:A.back});
  torso.material = [sideM,sideM,sideM,sideM,frontM,backM];
  meshes.slice(1).forEach(o=>{
    if (Math.abs(o.position.y-2.28) < .05){ o.material = navyM; o.scale.set(1.15,1.25,1.7); o.position.z = .02; }   // 立領
    else o.visible = false;                                                                                       // 原本的翻領拿掉
  });
  c.chest.add(at(rbox(0.94,0.04,0.64,.3,gold),0,2.43,0.02));
  /* 腰帶：白色寬皮帶 + 銀色帶扣 */
  c.chest.add(at(rbox(1.7,0.44,1.0,.3,L({map:A.belt})),0,0.13,0));
  c.chest.add(at(rbox(0.56,0.36,0.07,.3,L({color:0xcfd0d8})),0,0.13,0.52));
  [-0.36,-0.45].forEach(x=>c.chest.add(at(rbox(0.06,0.3,0.09,.2,black),x,0.13,0.52)));
  /* 長袖：藏青上臂和前臂，袖口兩道金條；手錶被袖子蓋住 */
  [c.R, c.Lf].forEach(a=>{
    a.sh.children[0].material = navyM;
    const up = a.sh.children[1]; up.material = navyM; up.scale.set(1.45,1,1.45);
    const fore = a.el.children[0]; fore.material = navyM; fore.scale.set(1.35,1,1.35);
    [-0.28,-0.4].forEach(y=>{ const r = 0.155 + 0.015*(y/0.525) + 0.012; fore.add(at(cyl(r,r,0.07,gold,8),0,y,0)); });
  });
  if (c.Lf.el.children[1]) c.Lf.el.children[1].visible = false;
  /* 肩上金穗：右肩一條金帶，左肩金色流蘇肩章（掛在肩膀上，跟著手臂動） */
  c.R.sh.add(at(rbox(0.74,0.07,0.16,.4,goldL),0,0.19,0.18));
  const ep = new THREE.Group(); c.Lf.sh.add(ep);
  ep.add(at(rbox(0.8,0.1,0.86,.4,gold),0,0.2,0));
  for (let i=0;i<9;i++) ep.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.05,0.55,0.05),goldL),0.42,-0.1,-0.36+i*0.09));
  /* 白長褲 + 黑皮鞋 */
  const pantsM = L({map:A.pants}), shoeB = L({color:0x1b1a1e}), soleB = L({color:0x0c0c0e});
  [c.joints.rHp, c.joints.lHp].forEach(h=>{ h.children[0].material = pantsM; });
  [c.joints.rKn, c.joints.lKn].forEach(k=>{ k.children[0].material = pantsM; k.children[1].material = shoeB; k.children[2].material = soleB; });
}
/* ---- 迷彩造型：迷彩衣褲、鋼盔、背槍（卡通方塊槍，槍口朝上掛在背後）、黑軍靴 ---- */
let _tCamo = null;
function tCamoAssets(){
  if (_tCamo) return _tCamo;
  const cols = ['#3b4726','#7b7a44','#2a301b','#8c7240'];
  const camo = (g,w,h)=>{
    g.fillStyle='#5b6a38'; g.fillRect(0,0,w,h);
    for (let i=0;i<w*h/22;i++){ g.fillStyle=cols[(rnd()*cols.length)|0]; g.fillRect((rnd()*w)|0,(rnd()*h)|0,2+((rnd()*5)|0),1+((rnd()*3)|0)); }
  };
  const A = {};
  A.camo = tex(48,48,camo);
  A.front = tex(96,138,(g,w,h)=>{
    camo(g,w,h);
    g.fillStyle='rgba(30,36,18,.55)'; g.fillRect(48,0,1,h);                               // 門襟
    [[12,44],[58,44]].forEach(([x,y])=>{                                                  // 兩個胸前口袋 + 蓋子
      g.strokeStyle='#232a14'; g.lineWidth=1.5; g.strokeRect(x+.5,y+.5,26,22);
      g.fillStyle='rgba(30,36,18,.45)'; g.fillRect(x+1,y+1,25,7);
      g.fillStyle='#c8b45a'; g.fillRect(x+12,y+9,3,3);
    });
    g.fillStyle='#e8e2c8'; g.fillRect(14,28,18,5); g.fillStyle='#2a301b'; g.fillRect(16,30,14,1);   // 名牌
    g.fillStyle='#232a14'; g.fillRect(0,0,96,2);
  });
  A.back = tex(96,138,(g,w,h)=>{ camo(g,w,h); g.fillStyle='rgba(30,36,18,.55)'; g.fillRect(48,0,1,h); });
  return (_tCamo = A);
}
function tCamoPortrait(g){                              // 頭像：照片的臉 + 迷彩鋼盔 + 迷彩領口
  const A = tMilAssets();
  g.fillStyle = CHARS.tommy.portraitBg; g.fillRect(0,0,64,64);
  try { g.drawImage(A.face.image, 6, 12, 52, 52); } catch(_){}
  g.fillStyle = '#4e5a31'; g.beginPath(); g.ellipse(32,27,30,23,0,Math.PI,0); g.closePath(); g.fill();
  g.fillStyle = '#2f3820'; g.fillRect(2,26,60,3);
  g.fillStyle = '#3b4726'; [[10,14,8,4],[26,9,10,4],[44,15,9,4],[20,20,9,3],[38,21,10,3]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
  g.fillStyle = '#7b7a44'; [[16,11,5,3],[34,15,6,3],[50,10,5,3]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
  g.fillStyle = '#5b6a38'; g.fillRect(0,56,64,8);
  g.fillStyle = '#3b4726'; [[4,58,8,3],[20,60,10,3],[40,57,9,3],[52,61,8,3]].forEach(([x,y,w,h])=>g.fillRect(x,y,w,h));
  g.fillStyle = '#232a14'; g.fillRect(0,56,64,1);
}
function tCamoApply(c){
  const A = tCamoAssets(), M = tMilAssets();
  const camoM = L({map:A.camo}), frontM = L({map:A.front}), backM = L({map:A.back});
  tMilSetFace(c, M);                                                                      // 還是照片裡那張臉
  const meshes = c.chest.children.filter(o=>o.isMesh), torso = meshes[0];
  torso.material = [camoM,camoM,camoM,camoM,frontM,backM];
  meshes.slice(1).forEach(o=>{ o.material = camoM; });                                    // 翻領／領口也換迷彩
  const dark = L({color:0x2b2d30}), wood = L({color:0x6b4423}), olive = L({color:0x3d4228}), strap = L({color:0x232a14});
  /* 腰帶：軍綠帆布帶 + 黃銅扣 */
  c.chest.add(at(rbox(1.7,0.4,1.0,.3,olive),0,0.12,0));
  c.chest.add(at(rbox(0.32,0.3,0.07,.3,L({color:0xc8b45a})),0,0.12,0.52));
  /* 長袖迷彩 */
  [c.R, c.Lf].forEach(a=>{
    a.sh.children[0].material = camoM;
    const up = a.sh.children[1]; up.material = camoM; up.scale.set(1.45,1,1.45);
    const fore = a.el.children[0]; fore.material = camoM; fore.scale.set(1.35,1,1.35);
  });
  if (c.Lf.el.children[1]) c.Lf.el.children[1].visible = false;
  /* 迷彩褲 + 黑軍靴 */
  const shoeB = L({color:0x1b1a1e}), soleB = L({color:0x0c0c0e});
  [c.joints.rHp, c.joints.lHp].forEach(h=>{ h.children[0].material = camoM; });
  [c.joints.rKn, c.joints.lKn].forEach(k=>{ k.children[0].material = camoM; k.children[1].material = shoeB; k.children[2].material = soleB; });
  /* 鋼盔：蓋住瀏海和頭頂的尖髮，下緣一圈帽簷，兩條下巴帶 */
  if (c.extra && c.extra.crown) c.extra.crown.visible = false;
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.6,12,8,0,Math.PI*2,0,Math.PI/2), L({map:A.camo}));
  helm.scale.set(1.12,0.95,1.1); helm.position.set(0,0.2,-0.02); c.head.add(helm);
  c.head.add(at(cyl(0.7,0.7,0.05,L({color:0x2f3820}),14),0,0.19,-0.02));
  [-1,1].forEach(s=>{ const st = rbox(0.04,0.5,0.04,.3,strap); st.position.set(s*0.52,-0.08,0.12); c.head.add(st); });
  /* 背槍：背帶斜過胸口，槍斜掛在背後，槍口從右肩上方露出來 */
  const sf = rbox(0.14,2.6,0.05,.3,strap); sf.position.set(0.05,1.1,0.5); sf.rotation.z = 0.62; c.chest.add(sf);
  const rifle = new THREE.Group(); rifle.position.set(0.1,1.3,-0.66); rifle.rotation.z = 0.62; c.chest.add(rifle);
  rifle.add(at(cyl(0.045,0.045,1.3,dark,6),0,0.95,0));
  rifle.add(at(rbox(0.14,0.7,0.14,.3,olive),0,0.3,0));
  rifle.add(at(rbox(0.17,0.6,0.19,.25,dark),0,-0.35,0));
  rifle.add(at(rbox(0.1,0.42,0.12,.25,dark),0,-0.38,-0.17));
  rifle.add(at(rbox(0.13,0.85,0.13,.3,wood),0,-1.1,0));
  rifle.add(at(rbox(0.05,0.12,0.05,.2,dark),0,1.55,0));
}
registerChar('tommy', {
  stats: { name:'偷米', en:'Tommy', tag:'排球・打針・失戀吉他・瞬間老化', weight:0.95, run:14, air:11, jumpV:31, djV:27, jumps:2 },
  skins: [
    { name:'生日帽', hat:['#3d8bff','#ffffff','#ffd166'], apply(c){ const h = birthdayHat('#3d8bff','#ffffff',0xffd166); h.position.set(0.05,0.64,-0.02); c.head.add(h); } },
    { name:'豪情一中人', apply(c){ if (typeof hqShirt==='function') hqShirt(c); }, portrait(g){ if (typeof hqShirtPortrait==='function') hqShirtPortrait(g); } },
    { name:'樂隊制服', apply: tMilApply, portrait: tMilPortrait },
    { name:'迷彩', apply: tCamoApply, portrait: tCamoPortrait },
  ],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.08,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:35, text:'莒拳！', dash:6},
    side:{t:[.28,.1,.35], pose:['spikeWind','spikeHit'], box:[2.5,4.6,1.7], dmg:15, kb:12, sc:1.1, ang:30, prop:'ball', hop:9, text:'扣殺！', sfx:'spike'},
    up:{t:[.16,.14,.3], pose:['upWind','block'], box:[0.5,6.8,1.9], dmg:12, kb:11, sc:1, ang:86, text:'攔網！'},
    down:{t:[.12,.25,.35], pose:['dive','dive'], box:[2.1,0.8,1.3], dmg:9, kb:8, sc:.7, ang:28, dash:18, text:'救球！'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.1,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[1.2,1.2,1.7], dmg:12, kb:7, sc:.8, ang:-60, air:1, prop:'ball', sfx:'spike'},
    nB:{t:[.3,.05,.25], pose:['serveWind','serveHit'], prop0:'ball', fire:[[.3,'serve']], air:1},
    sB:{t:[.12,.25,.3], pose:['inject','inject'], prop:'syringe', box:[1.8,3.6,1.3], dmg:5, kb:3, sc:.1, ang:40, dash:24, onHit:'vaccinate', text:'打針！', sfx:'inject', air:1},
    uB:{t:[.05,.55,.1], pose:['setUp','spikeHit'], poseSwitch:.38, prop:'ball', start:'setJump', box:[0.4,5.6,1.5], dmg:6, kb:7, sc:.5, ang:80,
        box2:{at:.38, dur:.15, box:[1.6,2.4,1.7], dmg:9, kb:9, sc:.8, ang:-45}, helpless:1, air:1},
    dB:{t:[.15,.9,.3], pose:['guitar','guitar'], prop:'guitar', fire:[[.15,'heart0'],[.45,'heart1'],[.75,'heart2']], air:1, cry:1, text:'嗚嗚……', textCls:'blue', sfx:'sob'},
  },
  fire: {
  serve(f){ proj({owner:f, x:f.x+f.face*2, y:f.y+4.8, vx:f.face*27, vy:3, g:8, r:.85, life:1.4, dmg:8, kb:8, sc:.7, ang:35, mesh:ballMesh(.55), spin:1}); SFX.spike(); pop('發球！', f.x, f.y+7); },
  heart0(f){ FIRE._heart(f,0); }, heart1(f){ FIRE._heart(f,1); }, heart2(f){ FIRE._heart(f,2); },
  _heart(f,i){
    const v = [[9,7],[13,1.5],[-8,8]][i];
    proj({owner:f, x:f.x+f.face*.5, y:f.y+5, vx:f.face*v[0], vy:v[1], g:0, drag:1.2, wave:.8, r:1.1, life:1.7, dmg:3, kb:2, sc:.1, ang:60, onHit:'sad', mesh:spriteOf(heartTex,1.7), pierce:0});
    SFX.guitar(i);
    for (let k=0;k<3;k++) drip(f.x+(Math.random()-.5), f.y+5.4, 0x9fd0ff);
  },
  },
  start: {
  setJump(f){ f.vy = 33; f.vx = f.face*7; f.onGround = false; f.jumps = 0; f.ff = false; pop('舉球！', f.x, f.y+7); burst(f.x, f.y+1, 0xf4c22f, 8, 8); },
  },
  onhit: {
  vaccinate(a,v){ v.feverT = 2; pop('中針了', v.x, v.y+7.5, 'blue'); },
  sad(a,v){ v.sadT = 3.5; v.state = 'stun'; v.stunT = .9; v.move = null; v.sobbing = .9; pop('跟著心碎……', v.x, v.y+7.5, 'blue'); SFX.sob(); },
  },
  build: buildTommy, face: tFaces.normal, portraitBg: '#6f9fe8',
  portrait(g){ g.fillRect(4,4,56,16); for (let i=0;i<7;i++){ g.beginPath(); g.moveTo(8+i*7,18); g.lineTo(15+i*7,18); g.lineTo(11+i*7,27); g.fill(); } },
  breakText: '閃到腰！', shieldPose: 'old', brokePose: 'old', finalPose: 'salute',
  oldTarget: (f, s)=> (s==='shield' || (s==='stun' && f.brokeShield)) ? 1 : 0,
  animate(f, m, s, t){ if (s==='move' && f.moveId==='dB') m.joints.rEl.rotation.x = -1.55 + Math.sin(t*30)*0.35; },
  winSub: '"Back in my day..."',
  final: tommyFinal, winSetup: tommyWinSetup, winUpdate: tommyWinUpdate, loseSetup: tommyLoseSetup, loseUpdate: tommyLoseUpdate,
});
