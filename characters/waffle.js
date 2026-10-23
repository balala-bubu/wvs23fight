/* 秉寶 Waffle — loaded after js/core.js. Everything this character needs lives in this file. */
'use strict';
const W_SKIN = '#c69670', W_SKIN_C = ['#bb8a64','#cf9f79','#c08f6a','#b98762'];
const wSkinTex = tex(16,16,(g)=>speckle(g,16,16,W_SKIN,W_SKIN_C,.4));
const wFaceTex = tex(64,64,(g)=>{
  speckle(g,64,64,W_SKIN,W_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(205,105,85,.3)';
  g.beginPath(); g.ellipse(16,41,6,4,0,0,7); g.fill();
  g.beginPath(); g.ellipse(48,41,6,4,0,0,7); g.fill();
  g.fillStyle='#211814';
  g.fillRect(13,24,13,3); g.fillRect(15,23,9,1);
  g.fillRect(38,24,13,3); g.fillRect(40,23,9,1);
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  g.beginPath(); g.arc(20,34,5,Math.PI*1.12,Math.PI*1.88); g.stroke();
  g.beginPath(); g.arc(44,34,5,Math.PI*1.12,Math.PI*1.88); g.stroke();
  g.fillStyle='rgba(120,70,45,.45)'; g.fillRect(30,36,4,4);
  g.fillStyle='rgba(85,42,28,.75)'; g.fillRect(28,40,3,1); g.fillRect(33,40,3,1);
  g.beginPath(); g.moveTo(20,46); g.quadraticCurveTo(32,43.5,44,46);
  g.quadraticCurveTo(41,57,32,57); g.quadraticCurveTo(23,57,20,46); g.closePath();
  g.fillStyle='#4a1715'; g.fill();
  g.save(); g.clip(); g.fillStyle='#eee7da'; g.fillRect(18,43,28,6);
  g.fillStyle='rgba(175,70,70,.7)'; g.fillRect(27,53,10,3); g.restore();
  g.strokeStyle='rgba(110,60,40,.4)'; g.lineWidth=1;
  g.beginPath(); g.moveTo(19,42); g.quadraticCurveTo(16,46,19,50); g.stroke();
  g.beginPath(); g.moveTo(45,42); g.quadraticCurveTo(48,46,45,50); g.stroke();
});
const wShirtTex = tex(32,32,(g)=>speckle(g,32,32,'#1f1e22',['#29282d','#161518','#2e2d33'],.5));
const wPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#2b2d34',['#34363e','#22242a','#3a3c45'],.5); g.fillStyle='rgba(255,255,255,.05)'; for(let y=0;y<32;y+=3) g.fillRect(0,y,32,1); });
function drawWaffle(g){
  g.fillStyle='#dba04a'; g.fillRect(0,0,16,16);
  g.fillStyle='#a8641c'; for(let i=0;i<16;i+=4){ g.fillRect(i,0,1,16); g.fillRect(0,i,16,1); }
  g.fillStyle='rgba(255,232,170,.55)'; for(let y=1;y<16;y+=4) for(let x=1;x<16;x+=4) g.fillRect(x,y,2,1);
}
const waffleTexS = tex(16,16,drawWaffle);
const waffleTexB = tex(16,16,drawWaffle,[5,5]);
const keysTex = tex(32,8,(g)=>{
  g.fillStyle='#f4f0e6'; g.fillRect(0,0,32,8);
  g.fillStyle='#8b857a'; for(let x=0;x<32;x+=2) g.fillRect(x,0,1,8);
  g.fillStyle='#141210'; [1,3,7,9,11,15,17,21,23,25,29,31].forEach(x=>{ if(x<32) g.fillRect(x-1,0,2,4); });
});
const noteTex = tex(16,16,(g)=>{
  g.fillStyle='#fff7d6';
  g.fillRect(9,2,2,9); g.fillRect(11,2,3,2); g.fillRect(13,4,1,2);
  g.fillRect(5,10,5,3); g.fillRect(6,13,3,1); g.fillRect(6,9,3,1);
});
const wSideM = L({color:0xb5762a}), wTopS = L({map:waffleTexS}), wTopB = L({map:waffleTexB});
function waffleMesh(r){ const top = r>2 ? wTopB : wTopS; return new THREE.Mesh(new THREE.CylinderGeometry(r,r,Math.max(.12,r*.28),10), [wSideM, top, top]); }
const wSkinM = L({map:wSkinTex}), wShirtM = L({map:wShirtTex}), wFaceM = L({map:wFaceTex}), wPantsM = L({map:wPantsTex});
const wHairM = L({map:blackHairTex});
// ---- 長方形鬆餅裝（造型）: a big rectangular waffle slab worn over the torso ----
function wfSlabDraw(g, w, h){
  g.fillStyle='#dba04a'; g.fillRect(0,0,w,h);
  g.fillStyle='#a8641c'; for(let x=0;x<w;x+=8) g.fillRect(x,0,1,h); for(let y=0;y<h;y+=8) g.fillRect(0,y,w,1);
  g.fillStyle='rgba(255,232,170,.55)'; for(let y=2;y<h;y+=8) for(let x=2;x<w;x+=8) g.fillRect(x,y,4,2);
  g.fillStyle='rgba(120,64,16,.35)'; for(let y=5;y<h;y+=8) for(let x=5;x<w;x+=8) g.fillRect(x,y,2,2);
  g.fillStyle='#b5762a'; g.fillRect(0,0,w,2); g.fillRect(0,h-2,w,2); g.fillRect(0,0,2,h); g.fillRect(w-2,0,2,h);   // toasted rim
}
const wfSlabTex = tex(40,48,wfSlabDraw);
function wfSlabPortrait(g){
  g.fillStyle='#dba04a'; g.fillRect(8,52,48,12);
  g.fillStyle='#a8641c'; for(let x=8;x<56;x+=8) g.fillRect(x,52,1,12); g.fillRect(8,58,48,1);
  g.fillStyle='#b5762a'; g.fillRect(8,52,48,2);
  g.fillStyle='#ffe28a'; g.fillRect(36,53,8,4);   // butter
}
function wfSlab(c){
  const edgeM = L({color:0xb5762a}), faceM = L({map:wfSlabTex}), syrupM = L({color:0x7a3e12});
  const slab = rbox(2.0,2.4,1.3,.18,[edgeM,edgeM,edgeM,edgeM,faceM,faceM]);
  slab.position.set(0,0.95,0); c.chest.add(slab);
  c.chest.add(at(rbox(2.04,0.14,1.34,.5,syrupM),0,2.12,0));                       // syrup along the top edge
  [[-0.7,.5],[-0.1,.8],[0.55,.4],[0.8,.65]].forEach(([x,len])=>c.chest.add(at(rbox(0.2,len,0.06,.5,syrupM),x,2.05-len/2,0.67)));   // drips on the front
  c.chest.add(at(rbox(0.7,0.3,0.14,.25,L({color:0xffe28a})),0.2,1.85,0.72));    // butter pat
  c.R.sh.position.x = 1.25; c.Lf.sh.position.x = -1.25;                           // arms out past the slab
}
// ---- 刮鬍泡夯哥（造型）: sprayed head to toe with shaving foam; the waffle throws / final turn into foam ----
// 只以「實際選中的造型名稱」判斷，原版秉寶與其他造型完全不受影響
function wfIsFoam(f){
  const skins = CHARS.waffle && CHARS.waffle.skins;
  return !!(f && f.m && f.m.skin > 0 && skins && skins[f.m.skin-1] && skins[f.m.skin-1].name === '刮鬍泡夯哥');
}
function wfFoamBlobs(g, w, h, n, rMin, rMax, seed){
  let s = seed; const r = ()=>{ s = (s*16807) % 2147483647; return s/2147483647; };
  for (let i=0;i<n;i++){
    const x = r()*w, y = r()*h, rad = rMin + r()*(rMax-rMin);
    g.fillStyle = '#c9d1db'; g.beginPath(); g.ellipse(x, y+1, rad, rad*.8, 0, 0, 7); g.fill();
    g.fillStyle = '#ffffff'; g.beginPath(); g.ellipse(x, y, rad, rad*.8, 0, 0, 7); g.fill();
  }
}
let _wfFoamT = null;
function wfFoamTextures(){
  if (_wfFoamT) return _wfFoamT;
  const foam = tex(16,16,(g)=>speckle(g,16,16,'#fbfbfb',['#e8edf2','#ffffff','#dde4ec'],.45));
  const tee = (n,seed)=>(g,w,h)=>{ speckle(g,w,h,'#ecebe5',['#e2e0d8','#f4f3ee','#d9d7ce'],.35); wfFoamBlobs(g,w,h,n,w*.05,w*.13,seed); };
  const front = tex(64,64,tee(26,11)), back = tex(64,64,tee(12,23)), side = tex(32,32,tee(8,37));
  const pants = tex(32,32,(g,w,h)=>{ speckle(g,w,h,'#b9a782',['#c4b28d','#ae9c78','#bfae8a'],.45); wfFoamBlobs(g,w,h,8,1.2,3.4,51); });
  return (_wfFoamT = {foam, front, back, side, pants});
}
function wfFoamBlob(r){
  const g = new THREE.Group(), m = L({map:wfFoamTextures().foam});
  [[0,0,0,1],[.55,.25,.1,.62],[-.5,.3,-.1,.58],[.1,.55,.2,.5],[-.15,-.35,.25,.45]].forEach(([x,y,z,s])=>{
    const sp = new THREE.Mesh(new THREE.SphereGeometry(r*s,8,6), m); sp.position.set(x*r,y*r,z*r); g.add(sp);
  });
  return g;
}
function wfFoamPile(){                                                   // 大招：一大坨刮鬍泡（像擠出來的一圈圈鮮奶油）
  const g = new THREE.Group(), m = L({map:wfFoamTextures().foam});
  [[-1.5,4.1,1.5],[0,3.0,0.9],[1.5,2.2,0.6],[2.9,1.3,.3],[3.9,0.5,0.0]].forEach(([y,rx,sy],i)=>{
    const sp = new THREE.Mesh(new THREE.SphereGeometry(rx,12,8), m); sp.scale.set(1,.62,1); sp.position.set(i%2?.25:-.2,y,0); g.add(sp);
  });
  [[-2.8,-0.9,1.3,1.4],[2.9,-1.0,-.5,1.3],[-1.0,-1.3,2.9,1.2],[1.4,-1.2,-2.6,1.2]].forEach(([x,y,z,r])=>{
    const sp = new THREE.Mesh(new THREE.SphereGeometry(r,8,6), m); sp.position.set(x,y,z); g.add(sp);
  });
  return g;
}
function wfFoamPortrait(g){
  g.fillStyle = '#151516'; g.fillRect(3,5,58,12); g.fillRect(8,16,48,4);                 // 黑帽
  g.fillStyle = '#ffffff';
  [[14,4,8],[26,2,9],[38,3,9],[50,4,7]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); });   // 帽上的泡
  g.fillRect(40,17,10,4);
  [[6,44,6],[58,44,6],[20,39,3]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); });         // 臉頰 / 鏡片上的泡
  [[8,59,8],[20,60,8],[32,61,9],[44,60,8],[56,59,8]].forEach(([x,y,r])=>{ g.beginPath(); g.arc(x,y,r,0,7); g.fill(); });   // 泡泡鬍子
  g.fillStyle = '#c9d1db'; g.fillRect(4,62,56,2);
}
function wfFoamCostume(c){
  const T = wfFoamTextures(), foamM = L({map:T.foam});
  const sideM = L({map:T.side}), frontM = L({map:T.front}), backM = L({map:T.back}), pantsM = L({map:T.pants});
  const sandalM = L({color:0x8e8f92}), capM = L({color:0x151516});
  // white tee covered in foam (前後左右都沾)
  const torso = c.chest.children[0];
  torso.material = [sideM,sideM,sideM,sideM,frontM,backM];
  c.chest.children.forEach(o=>{ if (o !== torso && o.isMesh && o.geometry.type === 'TorusGeometry') o.material = L({color:0xecebe5}); });
  [c.R.sh, c.Lf.sh].forEach(sh=>{ if (sh.children[0] && sh.children[0].isMesh) sh.children[0].material = sideM; });
  // khaki pants + grey sandals
  c.hips.traverse(o=>{ if (o.isMesh){ if (o.material === wPantsM) o.material = pantsM; else if (o.material === shoeM) o.material = sandalM; } });
  // foam on the body
  c.chest.add(at(rbox(1.0,0.32,0.55,.85,foamM),0,2.05,0.28));
  [-1,1].forEach(s=>c.chest.add(at(rbox(0.55,0.3,0.55,.85,foamM),s*0.55,2.15,0.05)));
  c.chest.add(at(rbox(0.7,0.45,0.14,.85,foamM),-0.2,1.3,0.5));
  [c.R, c.Lf].forEach(a=>{
    a.sh.add(at(rbox(0.38,0.5,0.38,.85,foamM),0,-0.75,0));
    a.el.add(at(rbox(0.38,0.78,0.38,.85,foamM),0,-0.45,0));
    a.el.add(at(rbox(0.26,0.26,0.26,.9,foamM),0.05,-0.95,0.08));
  });
  c.joints.rKn.add(at(rbox(0.3,0.5,0.12,.85,foamM),0.1,-0.5,0.3));
  c.joints.lHp.add(at(rbox(0.35,0.4,0.12,.85,foamM),-0.1,-0.6,0.38));
  c.joints.lKn.add(at(rbox(0.4,0.18,0.5,.85,foamM),0,-1.4,0.35));
  // black cap with a foam mound on top
  const head = c.head;
  head.add(at(rbox(1.2,0.5,1.2,.5,capM),0,0.62,-0.02));
  const brim = rbox(0.92,0.07,0.5,.3,capM); brim.position.set(0,0.44,0.72); brim.rotation.x = -0.12; head.add(brim);
  head.add(at(rbox(0.95,0.4,0.95,.9,foamM),0,0.98,-0.02));
  head.add(at(rbox(0.5,0.32,0.5,.9,foamM),-0.28,1.2,0.1));
  head.add(at(rbox(0.46,0.3,0.46,.9,foamM),0.3,1.15,-0.1));
  head.add(at(rbox(0.34,0.22,0.2,.9,foamM),0.12,0.5,0.66));
  // foam on the face: beard, cheeks, a blob on the lens
  head.add(at(rbox(0.88,0.26,0.24,.85,foamM),0,-0.56,0.46));
  [-1,1].forEach(s=>head.add(at(rbox(0.26,0.36,0.2,.85,foamM),s*0.38,-0.2,0.47)));
  head.add(at(rbox(0.22,0.16,0.14,.85,foamM),-0.22,0.02,0.6));
  head.add(at(rbox(0.16,0.12,0.12,.85,foamM),0.28,-0.04,0.6));
  // the bat becomes a big can of shaving foam (側重擊／上重擊／空中攻擊／側必殺揮出去的都是罐子)
  const bat = c.props.bat;
  while (bat.children.length) bat.remove(bat.children[0]);
  const bodyM = L({color:0xe8f0f8}), capM2 = L({color:0xb8bcc2}), blueM = L({color:0x3a8fe0});
  bat.add(at(cyl(0.3,0.3,1.9,bodyM,12),0,-1.3,0));
  bat.add(at(cyl(0.305,0.305,0.5,blueM,12),0,-1.25,0));                 // 藍色標籤
  bat.add(at(cyl(0.26,0.3,0.14,capM2,12),0,-2.32,0));                   // 罐底（打出去的那頭）
  bat.add(at(cyl(0.2,0.3,0.22,capM2,12),0,-0.28,0));                    // 罐肩
  bat.add(at(cyl(0.09,0.09,0.3,blueM,8),0,-0.05,0));                    // 噴嘴（握把那頭）
  bat.add(at(rbox(0.5,0.28,0.4,.85,foamM),0,-2.45,0.05));               // 打出去那頭沾著一坨泡
  // the waffle in his hand becomes a can of shaving foam
  const can = c.props.waffle;
  can.geometry = new THREE.CylinderGeometry(0.2,0.2,0.85,10);
  can.material = [L({color:0xe8f0f8}), L({color:0xb8bcc2}), L({color:0xb8bcc2})];
  can.add(at(cyl(0.07,0.07,0.22,L({color:0x3a8fe0}),6),0,0.52,0));
  can.add(at(cyl(0.205,0.205,0.18,L({color:0x3a8fe0}),10),0,0.1,0));
}
function buildWaffle(parent){
  const c = buildChar({
    skinM:wSkinM, faceM:wFaceM, torsoMat:wShirtM, sleeveMat:()=>wShirtM, sleeve:[0.6,0.75],
    pantsM:wPantsM, shoeM, soleM:greySole, headW:1, headH:1.15,
    collar(chest){ const c = new THREE.Mesh(new THREE.TorusGeometry(0.28,0.05,4,12), L({color:0x2a292e})); c.rotation.x=Math.PI/2; chest.add(at(c,0,2.22,0.02)); },
    hair(head){
      const hm = wHairM;
      head.add(at(rbox(1.12,0.52,1.12,.62,hm),0,0.45,-0.02));
      head.add(at(rbox(1.08,0.95,0.55,.6,hm),0,0.08,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.1,0.34,0.38,.4,hm),s*0.5,0.24,0.06)));
      [[-0.3,.22],[-0.08,.19],[0.14,.21],[0.33,.23]].forEach(([x,y],i)=>{
        const f = rbox(0.28,0.2+i%2*.05,0.14,.5,hm); f.position.set(x,y,0.46); f.rotation.z=(i-1.5)*.08; head.add(f);
      });
    },
    face(head){
      const metalM = L({color:0x4a4a50}), lensM = new THREE.MeshBasicMaterial({color:0xdfe6ea,transparent:true,opacity:.12});
      const gl = new THREE.Group(); gl.position.set(0,0,0.56); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.155,0.016,4,14), metalM); rim.position.x = s*0.2; gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.15,12), lensM); lens.position.set(s*0.2,0,-0.01); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.025,0.025,0.6), metalM); arm.position.set(s*0.4,0.04,-0.3); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.022,0.022), metalM),0,0.04,0));
    }
  }, parent);
  const wood = L({color:0xb9874f});
  const bat = new THREE.Group(); bat.position.y = -0.15; c.R.hd.add(bat);
  bat.add(at(cyl(0.07,0.17,2.4,wood,7),0,-1.25,0));
  bat.add(at(cyl(0.12,0.12,0.1,wood,7),0,0.0,0));
  const hw = waffleMesh(0.45); hw.position.set(0,-0.45,0.1); hw.rotation.x = Math.PI/2; c.R.hd.add(hw);
  const piano = new THREE.Group(); piano.position.set(0,3.95,2.1); c.root.add(piano);
  piano.add(new THREE.Mesh(new THREE.BoxGeometry(3.2,0.22,1.0), [black,black,L({map:keysTex}),black,black,black]));
  piano.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.3,0.6,0.25), black),0,0.25,-0.55));
  c.props = {bat, waffle:hw, piano};
  c.setOld = ()=>{}; c.setFace = ()=>{};
  return c;
}

// Waffle shield gets its own materials so its "burn" tint doesn't touch other waffles
function ownWaffleMats(mesh){ mesh.material = mesh.material.map(mm=>mm.clone()); }
const fanFaceTex = tex(16,16,(g)=>{ speckle(g,16,16,'#e8b896',['#dfae8a','#efc2a2'],.3); g.fillStyle='#1d1310'; g.fillRect(3,7,3,1); g.fillRect(4,6,1,1); g.fillRect(10,7,3,1); g.fillRect(11,6,1,1); g.fillStyle='#7a2020'; g.fillRect(6,10,4,2); g.fillStyle='rgba(255,110,130,.6)'; g.fillRect(2,9,2,1); g.fillRect(12,9,2,1); });
const fanSkinM = L({color:0xe8b896}), fanFaceM = L({map:fanFaceTex});
function buildFan(i){
  const tops = [0xff7aa8,0xffd166,0x8fd3ff,0xc89bff,0xff9f68,0x9be3b0], skirts = [0x3a3f6b,0xf0e8d8,0x6b2f3a], hairs = [0x1a1210,0x4a2c18,0x14100e];
  const g = new THREE.Group(), b = new THREE.Group(); b.scale.setScalar(SC*0.9); g.add(b);
  const top = L({color:tops[i%6]}), sk = L({color:skirts[i%3]}), hm = L({color:hairs[i%3]});
  b.add(at(rbox(1.15,1.5,0.72,.35,top),0,4.05,0));
  b.add(at(new THREE.Mesh(new THREE.CylinderGeometry(0.62,1.05,1.3,8), sk),0,2.85,0));
  b.add(at(rbox(0.86,0.95,0.86,.6,[fanSkinM,fanSkinM,fanSkinM,fanSkinM,fanFaceM,fanSkinM]),0,5.35,0));
  b.add(at(rbox(0.98,0.48,0.96,.6,hm),0,5.72,-0.04));
  b.add(at(rbox(0.94,1.6,0.34,.4,hm),0,4.95,-0.4));
  const legs = [-1,1].map(s=>{ const p = pivot(b,s*0.28,2.3,0); p.add(at(rbox(0.3,2.1,0.32,.4,fanSkinM),0,-1.05,0)); p.add(at(rbox(0.36,0.25,0.6,.4,L({color:0xf4f0e8})),0,-2.15,0.1)); return p; });
  const arms = [-1,1].map(s=>{ const p = pivot(b,s*0.7,4.65,0); p.add(at(rbox(0.26,1.45,0.26,.4,fanSkinM),0,-0.7,0)); return p; });
  return {g, legs, arms};
}
function waffleFinal(f, opp){
    const foam = wfIsFoam(f);                                              // 刮鬍泡夯哥：從天而降一大坨刮鬍泡（判定、傷害、時間與鬆餅完全相同）
    f.finalT = 1.4; banner(foam ? '刮鬍泡大噴發！' : '鬆餅大滿貫！'); SFX.laugh(); setTimeout(()=>SFX.laugh(), 800);
    pop('哈哈哈哈哈哈', f.x, f.y+7.5, 'big');
    const mesh = new THREE.Group();
    if (foam){ mesh.add(wfFoamPile()); }
    else {
      const w = waffleMesh(4.2); mesh.add(w);
      const syrup = new THREE.Mesh(new THREE.CylinderGeometry(2.9,3.2,.35,10), new THREE.MeshLambertMaterial({color:0x7a3e12, transparent:true, opacity:.85})); syrup.position.y = .6; mesh.add(syrup);
      const butter = rbox(1.2,.7,1.2,.2,L({color:0xffe28a})); butter.position.y = 1.05; mesh.add(butter);
    }
    mesh.rotation.x = .25; scene.add(mesh);
    G.finals.push({type:'waffle', foam, owner:f, target:opp, x:opp.x, y:opp.y+36, vy:-12, phase:'fall', t:0, mesh, update:waffleFinalUpdate});
}
function waffleFinalUpdate(F, dt, t){
      const v = F.target;
      if (F.phase==='fall'){
        F.vy -= 140*dt; F.y += F.vy*dt;
        if (v.state!=='dead' && Math.abs(v.x - F.x) < 4.8 && F.y <= v.y + 6.2 && F.y >= v.y - 1){
          F.phase = 'hold'; F.t = 0; F.y = v.y + 3.2;
          v.state = 'stuck'; v.vx = v.vy = 0; v.move = null; v.pct += 18; v.squish = .9; v.slowT = 3;
          SFX.soft(); SFX.boom(); G.shake = reduce ? .2 : 1; pop(F.foam ? '糊住了！' : '黏住了！', v.x, v.y+8, 'big'); burst(F.x, F.y, F.foam ? 0xffffff : 0xdba04a, 24, 14);
        } else if (F.y <= (F.foam ? 4 : 0.5) && Math.abs(F.x) < MAIN.x2 + 4){ F.phase = 'land'; F.t = 0; F.y = F.foam ? 4 : .5; SFX.soft(); burst(F.x, 1, F.foam ? 0xffffff : 0xdba04a, 16, 10); }
        else if (F.y < -40) F.phase = 'gone';
      } else if (F.phase==='hold'){
        v.squish = Math.max(v.squish, .3);
        if (F.t > 1.2){
          F.phase = 'land'; F.t = 0;
          const dir = Math.sign(v.x - F.owner.x) || F.owner.face;
          v.state = 'idle'; launch(v, 30 + v.pct*.11, 55, dir);
          SFX.hit(40); G.shake = reduce ? .2 : 1.2; G.freeze = .15; spark(v.x, v.y+3, 4);
        }
      } else if (F.phase==='land'){
        if (F.foam){                                                       // 刮鬍泡：融化——越壓越扁、往兩側攤開、貼著地面慢慢消失
          if (F.meltY === undefined) F.meltY = F.y - 4;
          const k = Math.min(1, F.t/1.3), sy = Math.max(.03, (1-k)*(1-k)), sxz = 1 + .45*k;
          F.mesh.scale.set(sxz, sy, sxz);
          F.mesh.traverse(o=>{ if (o.isMesh){ o.material.transparent = true; o.material.opacity = Math.min(1, (1-k)*2.2); } });
          F.y = F.meltY + 4*sy;
          if (Math.random() < dt*14) burst(F.x + (Math.random()-.5)*5*sxz, F.meltY + .6, 0xffffff, 1, 2);
          if (F.t > 1.3) F.phase = 'gone';
        } else {
          F.y += 10*dt; F.mesh.scale.multiplyScalar(Math.exp(-2.5*dt));
          if (F.t > 1) F.phase = 'gone';
        }
      }
      F.mesh.position.set(F.x, F.y, 0); F.mesh.rotation.y += dt*.6;
      return F.phase==='gone';
}
function waffleWinSetup(R){
  const W = R.W; R.fans = [];
    for (let i=0;i<8;i++){ const fan = buildFan(i); const side = i%2 ? 1 : -1; fan.side = side; fan.i = i;
      fan.g.position.set(W.m.holder.position.x + side*(16 + i*1.4), RS_Y, -1 + (i%3)); fan.g.rotation.y = -side*Math.PI/2; scene.add(fan.g); R.fans.push(fan); R.items.push(fan.g); }
}
function waffleWinUpdate(R, dt, k){
  const W = R.W, wp = W.m.holder.position;
    applyPose(W.m, Math.sin(R.t*14) > 0 ? POSE.laugh : POSE.laughIn, k);
    W.m.body.position.y = Math.abs(Math.sin(R.t*14))*0.15;
    once('l1', .2, ()=>{ SFX.laugh(); popAt('嘿嘿嘿', W); });
    once('l2', 1.1, ()=>{ SFX.laugh(); popAt('哈哈哈哈哈', W, 8, 'big'); });
    once('c1', 1.4, ()=>{ SFX2.cheer(); popAt('秉寶～！', W, 9.5, 'red'); });
    once('c2', 2.6, ()=>{ SFX2.cheer(); SFX.soft(); popAt('哇——！', W, 10, 'big'); });
    R.fans.forEach((fan)=>{
      const i = fan.i, side = fan.side, run0 = 1.2 + (i>>1)*.12, jump0 = 2.4 + i*.07;
      // [x, y, z, lying?] around the winner: 5 huggers on the ground, 3 divers lying on top
      const pile = [[-1.7,0,0.5,0],[1.7,0,0.5,0],[-0.9,0,1.7,0],[1.0,0,1.6,0],[0,0,-1.5,0],[-0.6,4.1,0.6,1],[0.7,4.8,0.9,-1],[0,5.6,1.2,1]][i];
      const tx = wp.x + side*2.8, startX = wp.x + side*(16 + i*1.4);
      if (R.t < run0){ fan.g.position.x = startX; }
      else if (R.t < jump0){
        const u = Math.min(1, (R.t - run0)/(jump0 - run0));
        fan.g.position.x = startX + (tx - startX)*u;
        fan.legs[0].rotation.x = Math.sin(R.t*22)*.9; fan.legs[1].rotation.x = -Math.sin(R.t*22)*.9;
        fan.arms[0].rotation.z = -2.6; fan.arms[1].rotation.z = 2.6;
        if (Math.random() < dt*3) { const h = spriteOf(loveTex, 1.2); h.position.set(fan.g.position.x, RS_Y + 6.5, 0); scene.add(h); R.puffs.push({o:h, life:1.4, vy:3, grow:.2}); }
      } else {
        const lying = pile[3];
        const u = Math.min(1, (R.t - jump0)/(lying ? .5 : .3));
        const e = u*u*(3-2*u);
        const x0 = tx, x1 = wp.x + pile[0], y1 = pile[1];
        fan.g.position.x = x0 + (x1 - x0)*e;
        fan.g.position.y = RS_Y + y1*e + Math.sin(u*Math.PI)*(lying ? 3.5 : 0.8) + (u>=1 && !lying ? Math.abs(Math.sin(R.t*9+i))*0.25 : 0);
        fan.g.position.z = -1 + (pile[2]+1)*e;
        const faceY = Math.atan2(-pile[0], -pile[2]);   // look at the winner
        fan.g.rotation.y = -side*Math.PI/2*(1-e) + faceY*e;
        if (lying){
          // dive flat across the heap
          fan.g.rotation.z = lying*1.45*e; fan.g.rotation.x = 0.25*e;
          fan.arms[0].rotation.set(0,0,-2.8); fan.arms[1].rotation.set(0,0,2.8);
          fan.legs[0].rotation.x = 0.4*Math.sin(R.t*8+i); fan.legs[1].rotation.x = -0.4*Math.sin(R.t*8+i);
        } else {
          // hug: arms wrap forward around him
          fan.g.rotation.z = 0; fan.g.rotation.x = 0.15*e;
          fan.arms[0].rotation.set(-1.45*e, 0, 0.45*e); fan.arms[1].rotation.set(-1.45*e, 0, -0.45*e);
          fan.legs[0].rotation.x = 0; fan.legs[1].rotation.x = 0;
        }
        if (u >= 1 && Math.random() < dt*2){ const h = spriteOf(loveTex, 1.4); h.position.set(wp.x + (Math.random()-.5)*5, RS_Y + 5 + Math.random()*3, 2); scene.add(h); R.puffs.push({o:h, life:1.6, vy:3.5, grow:.3}); }
      }
    });
    if (R.t > 3.3){ W.m.joints.rSh.rotation.set(-3.0,0,-0.2); W.m.joints.rEl.rotation.x = 0; }   // hand sticking out of the pile
}
function waffleLoseUpdate(R, dt, k){
  const Lz = R.Lz, lp = Lz.m.holder.position;
    if (!R.bigW && R.t > .7){
      const w = new THREE.Group(); w.add(waffleMesh(3.4));
      const sy = new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.6,.3,10), new THREE.MeshLambertMaterial({color:0x7a3e12})); sy.position.y = .5; w.add(sy);
      w.position.set(lp.x, lp.y + 30, lp.z); scene.add(w); R.items.push(w); R.bigW = w; R.bigVy = 0;
    }
    if (R.bigW){
      const floorY = lp.y + 1.1 + (R.squashed ? 0 : 5.4);
      if (R.bigW.position.y > floorY){ R.bigVy -= 90*dt; R.bigW.position.y = Math.max(floorY, R.bigW.position.y + R.bigVy*dt); }
      if (!R.squashed && R.bigW.position.y <= lp.y + 6.5){ R.squashed = true; SFX.soft(); SFX.boom(); G.shake = reduce ? .2 : .8; popAt('噗嘰', Lz, 4, 'big'); burst(lp.x, lp.y+1, 0xdba04a, 20, 12); }
      if (R.squashed){ Lz.m.body.scale.y += (SC*0.14 - Lz.m.body.scale.y)*Math.min(1, dt*18); Lz.m.body.scale.x = Lz.m.body.scale.z = SC*1.25; applyPose(Lz.m, POSE.flat, k); }
      else applyPose(Lz.m, POSE.dizzy, k);
    } else applyPose(Lz.m, POSE.dizzy, k);
}
registerChar('waffle', {
  stats: { name:'秉寶', en:'Waffle', tag:'魔性笑聲・棒壘球・鋼琴・鬆餅', weight:1.15, run:12.5, air:10, jumpV:29, djV:25, jumps:2 },
  skins: [
    { name:'生日帽', hat:['#ff5fa2','#ffe066'], apply(c){ const h = birthdayHat('#ff5fa2','#ffe066'); h.position.set(0.05,0.6,0); c.head.add(h); } },
    { name:'豪情一中人', apply(c){ if (typeof hqShirt==='function') hqShirt(c); }, portrait(g){ if (typeof hqShirtPortrait==='function') hqShirtPortrait(g); } },
    { name:'長方形鬆餅裝', apply(c){ wfSlab(c); }, portrait(g){ wfSlabPortrait(g); } },
    { name:'刮鬍泡夯哥', apply(c){ wfFoamCostume(c); }, portrait(g){ wfFoamPortrait(g); } },
  ],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.12,.1,.3], pose:['laughIn','laugh'], box:[1.3,3.6,2.1], dmg:6, kb:9, sc:.7, ang:40, text:'哈！', sfx:'laughShort'},
    side:{t:[.3,.1,.35], pose:['batWind','batHit'], box:[2.8,3.4,1.7], dmg:16, kb:12, sc:1.12, ang:38, prop:'bat', armor:1, sfx:'swing', hr:1},
    up:{t:[.2,.12,.3], pose:['upWind','upHit'], box:[0.5,6.4,1.8], dmg:13, kb:11, sc:1, ang:88, prop:'bat', sfx:'swing'},
    down:{t:[.1,.25,.3], pose:['slide','slide'], box:[1.9,0.8,1.3], dmg:9, kb:8, sc:.7, ang:25, dash:16, text:'滑壘！'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.2], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.12,.1,.2], pose:['batWind','batHit'], box:[2.4,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'bat', sfx:'swing'},
    uair:{t:[.1,.12,.2], pose:['air','upHit'], box:[0.3,6.2,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.2,.1,.25], pose:['dair','dairHit'], box:[0.6,0.4,1.6], dmg:12, kb:7, sc:.8, ang:-70, air:1, text:'♪', sfx:'chord', prop:'piano'},
    nB:{t:[.2,.05,.3], pose:['throwWind','throwHit'], prop0:'waffle', fire:[[.2,'waffleLob']], air:1, sfx:'swing'},
    sB:{t:[.3,.05,.3], pose:['batWind','batHit'], prop:'bat', prop0:'waffle', fire:[[.3,'waffleDrive']], air:1, sfx:'batCrack'},
    uB:{t:[.06,.4,.1], pose:['laughUp','laughUp'], box:[0,3.5,2.3], dmg:5, kb:9, sc:.4, ang:80, start:'laughJump', helpless:1, air:1, text:'哈哈哈哈哈', sfx:'laugh'},
    dB:{t:[.12,.65,.25], pose:['piano','piano'], prop:'piano', fire:[[.12,'note0'],[.3,'note1'],[.48,'note2'],[.68,'chord']], air:1},
  },
  fire: {
  waffleLob(f){
    if (wfIsFoam(f)){                                                      // 刮鬍泡夯哥：丟出一坨刮鬍泡，傷害/速度/擊退不變
      proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.6, vx:f.face*13, vy:12, g:30, r:.95, life:2.4, bounce:1, dmg:6, kb:5, sc:.5, ang:50, slow:2.2, onHit:'wfFoamSplat', mesh:wfFoamBlob(.65), spin:1});
      burst(f.x+f.face*1.4, f.y+4.6, 0xffffff, 6, 6); pop('噗咻～', f.x, f.y+7); SFX.soft(); return;
    }
    proj({owner:f, x:f.x+f.face*1.4, y:f.y+4.6, vx:f.face*13, vy:12, g:30, r:.95, life:2.4, bounce:1, dmg:6, kb:5, sc:.5, ang:50, soft:1, slow:2.2, mesh:waffleMesh(.65), spin:1});
  },
  waffleDrive(f){
    if (wfIsFoam(f)){
      proj({owner:f, x:f.x+f.face*2.6, y:f.y+3.5, vx:f.face*30, vy:0, g:0, r:1.05, life:.8, dmg:10, kb:10, sc:.85, ang:32, onHit:'wfFoamSplat', mesh:wfFoamBlob(.8), spin:1});
      burst(f.x+f.face*2.6, f.y+3.5, 0xffffff, 8, 8); pop('刮鬍泡打擊！', f.x, f.y+7); return;
    }
    proj({owner:f, x:f.x+f.face*2.6, y:f.y+3.5, vx:f.face*30, vy:0, g:0, r:1.05, life:.8, dmg:10, kb:10, sc:.85, ang:32, soft:1, mesh:waffleMesh(.75), spin:1}); pop('鬆餅打擊！', f.x, f.y+7);
  },
  note0(f){ FIRE._note(f,0); }, note1(f){ FIRE._note(f,1); }, note2(f){ FIRE._note(f,2); },
  _note(f,i){ proj({owner:f, x:f.x+f.face*2.2, y:f.y+3.6+i*.4, vx:f.face*17, vy:0, g:0, wave:1.2, r:.85, life:1, dmg:4, kb:3, sc:.2, ang:45, mesh:spriteOf(noteTex,1.4)}); SFX.note(i); },
  chord(f){ proj({owner:f, x:f.x+f.face*2.4, y:f.y+4, vx:f.face*20, vy:0, g:0, r:1.5, life:.9, dmg:7, kb:10, sc:.7, ang:45, mesh:spriteOf(noteTex,2.6,0xffd27a)}); SFX.chord(); pop('♪♪♪', f.x+f.face*2, f.y+7); },
  },
  onhit: {
  wfFoamSplat(a,v){ v.squish = .4; SFX.soft(); burst(v.x, v.y+4, 0xffffff, 10, 7); pop('噗滋', v.x, v.y+6.5); },
  },
  start: {
  laughJump(f){ f.vy = 32; f.vx = f.face*7; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xfff3a0, 8, 8); },
  },
  build: buildWaffle, face: wFaceTex, portraitBg: '#dba04a',
  portrait(g){ g.fillRect(6,6,52,18); g.fillRect(4,10,6,22); g.fillRect(54,10,6,22); g.strokeStyle = '#3c3c42'; g.lineWidth = 2; g.beginPath(); g.arc(22,39,6,0,7); g.stroke(); g.beginPath(); g.arc(42,39,6,0,7); g.stroke(); g.beginPath(); g.moveTo(28,39); g.lineTo(36,39); g.stroke(); },
  shield(){ const m = waffleMesh(2.4); m.rotation.z = Math.PI/2; return m; },
  shieldAnim(f){
    const sm = f.shieldMesh;
    sm.rotation.order = 'YXZ'; sm.rotation.set(Math.PI/2, f.face*0.55, 0);
    sm.position.set(f.x + f.face*1.1, f.y+3.2, 1.2);
    const burnt = 1 - Math.max(0, f.shieldHP)/50;
    sm.material.forEach(mm=>mm.color.setRGB(1-burnt*.6, 1-burnt*.7, 1-burnt*.75));
  },
  onSpawn(f){ ownWaffleMats(f.shieldMesh); },
  breakText: '鬆餅碎了！', breakColor: 0xdba04a,
  finalPose: 'laughUp', introPose: 'thumbs',
  readyPose: (t)=> Math.sin(t*14) > 0 ? POSE.laugh : POSE.laughUp,
  selectSfx: ()=>SFX.laugh(),
  winSub: '"Leave it to me."',
  final: waffleFinal, winSetup: waffleWinSetup, winUpdate: waffleWinUpdate, loseUpdate: waffleLoseUpdate,
});
