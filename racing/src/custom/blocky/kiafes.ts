/* 芭樂 Kiafes — ported from kiafes.js (model + textures only). */
// @ts-nocheck
import * as THREE from 'three'
import { L, at, buildChar, cyl, greySole, rbox, rnd, shadeFace, shoeM, speckle, spriteOf, tex } from './core'
void rnd
/* ---------- textures ---------- */
const KIA_SKIN = '#d6a27c', KIA_SKIN_C = ['#cc9672','#dfae8a','#d29c77'];
const kiaSkinTex = tex(16,16,(g)=>speckle(g,16,16,KIA_SKIN,KIA_SKIN_C,.4));
function kiaFace(g, mode){
  speckle(g,64,64,KIA_SKIN,KIA_SKIN_C,.35); shadeFace(g);
  // thick black mushroom fringe, a little parted in the middle
  g.fillStyle = '#141010'; g.fillRect(0,0,64,16);
  for (let i=0;i<11;i++){ const x = i*6, len = (i===5 ? 4 : 9) + (i%3)*2; g.beginPath(); g.moveTo(x-2,15); g.lineTo(x+7,15); g.lineTo(x+2+(i%2), 15+len); g.closePath(); g.fill(); }
  g.fillRect(0,0,5,40); g.fillRect(59,0,5,40);
  g.fillStyle = 'rgba(80,60,50,.5)'; [10,23,37,50].forEach(x=>g.fillRect(x,3,1,10));
  // eyes (narrow, calm)
  g.strokeStyle = '#1d1310'; g.lineWidth = 2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(15,37); g.lineTo(25,35); g.stroke(); g.beginPath(); g.moveTo(39,35); g.lineTo(49,37); g.stroke();
    g.fillStyle = 'rgba(150,205,255,.9)'; g.fillRect(17,39,3,14); g.fillRect(44,39,3,14);
  } else if (mode==='chew'){
    g.beginPath(); g.arc(20,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,39,4.5,Math.PI*1.15,Math.PI*1.85); g.stroke();
  } else if (mode==='smug'){
    g.beginPath(); g.moveTo(15,37); g.lineTo(25,37); g.stroke(); g.beginPath(); g.moveTo(39,37); g.lineTo(49,37); g.stroke();
    g.fillStyle = '#1d1310'; g.fillRect(21,37,3,2); g.fillRect(45,37,3,2);
  } else {
    g.fillStyle = '#1d1310'; g.beginPath(); g.ellipse(20,37,3.6,1.9,0,0,7); g.fill(); g.beginPath(); g.ellipse(44,37,3.6,1.9,0,0,7); g.fill();
    g.beginPath(); g.moveTo(15,36); g.quadraticCurveTo(20,33.5,25,36); g.stroke(); g.beginPath(); g.moveTo(39,36); g.quadraticCurveTo(44,33.5,49,36); g.stroke();
    g.fillStyle = '#fff'; g.fillRect(21,36,1,1); g.fillRect(45,36,1,1);
  }
  // nose
  g.fillStyle = 'rgba(130,75,50,.4)'; g.fillRect(29,40,6,5); g.fillStyle = 'rgba(85,42,28,.7)'; g.fillRect(28,44,2,1); g.fillRect(34,44,2,1);
  // mouth
  if (mode==='cry'){ g.fillStyle = '#4a1715'; g.beginPath(); g.moveTo(24,53); g.quadraticCurveTo(32,47,40,53); g.quadraticCurveTo(32,50,24,53); g.closePath(); g.fill(); }
  else if (mode==='chew'){ g.fillStyle = '#4a1715'; g.fillRect(27,49,10,4); g.fillStyle = '#f08aa0'; g.fillRect(35,50,4,2); g.fillStyle = 'rgba(215,105,85,.3)'; g.fillRect(8,42,9,5); g.fillRect(47,42,9,5); }
  else if (mode==='smug'){ g.strokeStyle = '#7a3a2c'; g.lineWidth = 2; g.beginPath(); g.moveTo(25,49); g.quadraticCurveTo(33,52,40,47); g.stroke(); }
  else { g.strokeStyle = '#8a4434'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(25,49); g.quadraticCurveTo(32,52,39,49); g.stroke(); }
}
const kiaFaces = {};
['normal','cry','chew','smug'].forEach(k=>kiaFaces[k] = tex(64,64,(g)=>kiaFace(g,k)));
const kiaHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#141010',['#221a18','#0a0808'],.5);
  g.fillStyle = '#3a3230'; for (let i=0;i<30;i++){ const x=(rnd()*32)|0, y=(rnd()*32)|0, l=3+((rnd()*5)|0); for (let k=0;k<l;k++) g.fillRect(x%32,(y+k)%32,1,1); }
});
// beige knit polo
function kiaKnit(g, w, h, base){ speckle(g,w,h,base,['#d9d1c2','#e9e3d6'],.35); g.fillStyle = 'rgba(150,135,110,.18)'; for (let y=0;y<h;y+=2) g.fillRect(0,y,w,1); }
const kiaPoloTex = tex(32,32,(g)=>kiaKnit(g,32,32,'#e2dbcd'));
const kiaPoloFront = tex(32,46,(g)=>{
  kiaKnit(g,32,46,'#e2dbcd');
  g.fillStyle = '#d4ccbc'; g.fillRect(14,0,4,15); g.fillStyle = 'rgba(120,105,85,.45)'; g.fillRect(14,0,1,15); g.fillRect(17,0,1,15);
  g.fillStyle = '#f2eee6'; g.fillRect(15,4,2,2); g.fillRect(15,10,2,2);
  g.fillStyle = 'rgba(150,135,110,.3)'; g.fillRect(0,42,32,4);
});
const kiaPoloSleeve = tex(16,16,(g)=>{ kiaKnit(g,16,16,'#e2dbcd'); g.fillStyle = 'rgba(150,135,110,.35)'; g.fillRect(0,12,16,4); });
// white shirt (costume)
const kiaWhiteTex = tex(32,32,(g)=>{ speckle(g,32,32,'#f4f3ef',['#ebe9e3','#fbfaf7'],.3); g.fillStyle = 'rgba(160,160,170,.12)'; for (let x=3;x<32;x+=7) g.fillRect(x,0,1,32); });
const kiaWhiteFront = tex(32,46,(g)=>{
  speckle(g,32,46,'#f4f3ef',['#ebe9e3','#fbfaf7'],.3);
  g.fillStyle = 'rgba(150,150,160,.35)'; g.fillRect(16,0,1,46); g.fillStyle = '#dcdcd6'; for (let y=5;y<46;y+=8) g.fillRect(15,y,3,2);
  g.strokeStyle = 'rgba(150,150,160,.45)'; g.lineWidth = 1; g.strokeRect(20.5,10.5,7,7);
});
const kiaPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#1d1d21',['#26262b','#15151a'],.5); g.fillStyle = 'rgba(255,255,255,.035)'; for (let x=0;x<32;x+=4) g.fillRect(x,0,1,32); });
const kiaGuavaTex = tex(16,16,(g)=>{ speckle(g,16,16,'#9ac553',['#86b244','#b0d66a','#c4dc74'],.5); g.fillStyle = '#d8e48a'; [[3,4],[9,2],[12,9],[5,11],[8,7]].forEach(([x,y])=>g.fillRect(x,y,1,1)); });
const kiaSlideTex = tex(64,40,(g)=>{
  g.fillStyle = '#fbfaf6'; g.fillRect(0,0,64,40); g.fillStyle = '#e8743c'; g.fillRect(0,0,64,9);
  g.fillStyle = '#fff'; g.font = '900 7px sans-serif'; g.fillText('芭樂冷知識', 3, 7);
  g.fillStyle = '#333'; g.font = '700 6px sans-serif'; g.fillText('・你很「芭」道', 4, 18); g.fillText('・「芭」不得你輸', 4, 26); g.fillText('・下課「芭」！', 4, 34);
  g.fillStyle = '#7fbf4a'; g.beginPath(); g.arc(55,28,6,0,7); g.fill();
});
const kiaBoardTex = tex(64,48,(g)=>{
  g.fillStyle = '#f7f8f6'; g.fillRect(0,0,64,48); g.strokeStyle = '#9aa0a6'; g.lineWidth = 3; g.strokeRect(1.5,1.5,61,45);
  g.strokeStyle = '#2a6fd6'; g.lineWidth = 2; g.beginPath(); g.arc(22,24,10,0,7); g.stroke();
  g.fillStyle = '#7fbf4a'; g.beginPath(); g.arc(22,24,8,0,7); g.fill(); g.fillStyle = '#4a8a2a'; g.fillRect(21,13,2,4);
  g.fillStyle = '#d63a3a'; g.font = '900 9px sans-serif'; g.fillText('擋！', 38, 22); g.fillStyle = '#2a6fd6'; g.font = '700 7px sans-serif'; g.fillText('不准過', 37, 34);
});

/* ---------- meshes ---------- */
const kiaGuavaM = L({map:kiaGuavaTex}), kiaPinkM = L({color:0xf2849a}), kiaLeafM = L({color:0x3f8a34}), kiaStemM = L({color:0x5a3e24});
function kiaGuava(s){
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.5,10,8), kiaGuavaM); b.scale.set(1,0.92,1); g.add(b);
  g.add(at(cyl(0.03,0.04,0.16,kiaStemM,5),0,0.52,0));
  const leaf = rbox(0.34,0.05,0.16,.4,kiaLeafM); leaf.position.set(0.15,0.56,0); leaf.rotation.z = 0.4; g.add(leaf);
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.09,6,4), L({color:0x6a7a3a})),0,-0.47,0));
  g.scale.setScalar(s || 1); return g;
}
function kiaBrush(){
  const g = new THREE.Group();
  g.add(at(cyl(0.06,0.08,2.0,L({color:0xd9a441}),6),0,-1.0,0));
  g.add(at(cyl(0.11,0.09,0.32,L({color:0xbfc4c8}),8),0,-2.1,0));
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15,0.55,8), L({color:0xe8743c})); tip.rotation.x = Math.PI; tip.position.y = -2.5; g.add(tip);
  return g;
}
function kiaPointer(){
  const g = new THREE.Group();
  g.add(at(cyl(0.035,0.05,2.8,L({color:0x6a4a2a}),6),0,-1.4,0));
  g.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.08,6,4), L({color:0xd63a3a})),0,-2.82,0));
  return g;
}
function kiaHandBoard(){
  const g = new THREE.Group(), face = L({map:kiaBoardTex}), frame = L({color:0x9aa0a6});
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,1.5,2.0), [frame,frame,frame,frame,face,face]),0,-0.95,0.3));
  return g;
}
// a little kid in a yellow kindergarten hat
const kiaKidSkin = L({color:0xe8b893}), kiaKidHat = L({color:0xf5c518}), kiaKidPants = L({color:0x2f4a7a});
const kiaKidFace = tex(16,16,(g)=>{ g.fillStyle = '#e8b893'; g.fillRect(0,0,16,16); g.fillStyle = '#1d1310'; g.fillRect(4,7,2,2); g.fillRect(10,7,2,2); g.fillStyle = '#c0504a'; g.fillRect(6,11,4,2); g.fillStyle = 'rgba(240,120,120,.4)'; g.fillRect(2,10,2,2); g.fillRect(12,10,2,2); });
const kiaKidShirts = [0xff6b6b,0x5fc0ef,0x6fe08a,0xb08cff,0xffa64a,0xff7ac2,0x4ad0c0].map(c=>L({color:c}));
function kiaKid(i){
  const g = new THREE.Group();
  [-1,1].forEach(s=>g.add(at(rbox(0.26,0.55,0.28,.4,kiaKidPants),s*0.17,0.3,0)));
  g.add(at(rbox(0.7,0.72,0.46,.4,kiaKidShirts[i % kiaKidShirts.length]),0,0.9,0));
  [-1,1].forEach(s=>{ const a = rbox(0.18,0.55,0.2,.4,kiaKidSkin); a.position.set(s*0.46,1.05,0); a.rotation.z = s*2.4; g.add(a); });
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.62,0.6,0.56), [kiaKidSkin,kiaKidSkin,kiaKidSkin,kiaKidSkin,L({map:kiaKidFace}),kiaKidSkin]),0,1.58,0));
  g.add(at(cyl(0.38,0.4,0.22,kiaKidHat,10),0,1.95,0));
  g.add(at(cyl(0.5,0.5,0.04,kiaKidHat,12),0,1.86,0.06));
  return g;
}

/* ---------- model ---------- */
function buildKiafes(parent){
  const hairM = L({map:kiaHairTex}), faceM = L({map:kiaFaces.normal}), skinM = L({map:kiaSkinTex});
  const shirtM = L({map:kiaPoloTex}), frontM = L({map:kiaPoloFront}), sleeveM = L({map:kiaPoloSleeve});
  const c = buildChar({
    skinM, faceM, headW:0.98, headH:1.16,
    torsoMat:[shirtM,shirtM,shirtM,shirtM,frontM,shirtM], sleeveMat:()=>[sleeveM,sleeveM,shirtM,shirtM,sleeveM,sleeveM], sleeve:[0.66,0.78],
    pantsM:L({map:kiaPantsTex}), shoeM, soleM:greySole,
    collar(chest){
      [-1,1].forEach(s=>{ const fl = rbox(0.44,0.12,0.36,.3,shirtM); fl.position.set(s*0.22,2.25,0.3); fl.rotation.set(0.5,0,s*-0.35); chest.add(fl); });
      const band = new THREE.Mesh(new THREE.TorusGeometry(0.32,0.07,4,12), shirtM); band.rotation.x = Math.PI/2; chest.add(at(band,0,2.24,-0.02));
    },
    hair(head){
      head.add(at(rbox(1.18,0.62,1.18,.7,hairM),0,0.47,-0.02));                         // round mushroom top
      head.add(at(rbox(1.14,1.0,0.56,.6,hairM),0,0.04,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.14,0.62,0.7,.45,hairM),s*0.55,0.14,0.0)));      // sides over the ears
      [[-0.38,0.24,-0.1],[-0.16,0.2,0.06],[0.06,0.23,-0.04],[0.28,0.19,0.1],[0.44,0.24,0.14]].forEach(([x,y,r])=>{
        const f = rbox(0.24,0.36,0.14,.5,hairM); f.position.set(x,y,0.48); f.rotation.z = r; head.add(f);
      });
    },
    face(head){
      const metalM = L({color:0xc9a86a}), lensM = new THREE.MeshBasicMaterial({color:0xf0e8e0,transparent:true,opacity:.14});
      const gl = new THREE.Group(); gl.position.set(0,-0.04,0.56); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18,0.014,4,8), metalM); rim.position.x = s*0.21; rim.rotation.z = Math.PI/8; gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.17,8), lensM); lens.position.set(s*0.21,0,-0.01); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.02,0.02,0.6), metalM); arm.position.set(s*0.42,0.05,-0.3); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.08,0.02,0.02), metalM),0,0.06,0));
    },
  }, parent);
  const guava = kiaGuava(0.75); guava.position.set(0,-0.42,0.18); c.R.hd.add(guava);
  const brush = kiaBrush(); c.R.hd.add(brush);
  const pointer = kiaPointer(); c.R.hd.add(pointer);
  const board = kiaHandBoard(); c.R.hd.add(board);
  c.props = {guava, brush, pointer, board};
  c.kiaShirt = {shirtM, frontM, sleeveM};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = kiaFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = kiaFaces[k]; faceM.needsUpdate = true; } };
  return c;
}
export { buildKiafes, kiaGuava }
