/* 宇 Jackson — ported from jackson.js (model + textures only; fight poses/finals are not used in the kart game). */
// @ts-nocheck
import * as THREE from 'three'
import { L, at, blackHairTex, buildChar, cyl, greySole, rbox, rnd, shadeFace, shoeM, speckle, spriteOf, tex } from './core'
void rnd
const HQ_FONT = "'KaiTi','Kaiti TC','STKaiti','DFKai-SB','Noto Serif CJK TC','Noto Serif TC',serif";

// ---------------- textures ----------------
const HQ_SKIN = '#d9ab85', HQ_SKIN_C = ['#d0a07a','#e2b690','#cb9b75'];
const hqSkinTex = tex(16,16,(g)=>speckle(g,16,16,HQ_SKIN,HQ_SKIN_C,.4));
function hqFace(g, mode){
  speckle(g,64,64,HQ_SKIN,HQ_SKIN_C,.35); shadeFace(g);
  g.fillStyle='rgba(120,70,45,.55)'; g.fillRect(48,43,2,2);                         // little mole
  g.fillStyle='#1d1512';
  if (mode==='angry'){                                                              // angry-bird brows
    g.save(); g.translate(0,0);
    g.beginPath(); g.moveTo(12,21); g.lineTo(27,28); g.lineTo(27,31); g.lineTo(12,25); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(52,21); g.lineTo(37,28); g.lineTo(37,31); g.lineTo(52,25); g.closePath(); g.fill();
    g.restore();
  } else { g.fillRect(13,25,13,2); g.fillRect(38,24,13,2); }                       // flat, cool brows
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(15,36); g.lineTo(25,36); g.stroke(); g.beginPath(); g.moveTo(39,36); g.lineTo(49,36); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,38,3,15); g.fillRect(44,38,3,15);
    g.fillStyle='#4a1715'; g.fillRect(27,50,10,4);
  } else if (mode==='angry'){
    g.fillStyle='#fff'; g.fillRect(15,34,9,6); g.fillRect(40,34,9,6);
    g.fillStyle='#1d1310'; g.fillRect(19,35,4,5); g.fillRect(41,35,4,5);
    g.fillStyle='#4a1715'; g.fillRect(25,47,14,7); g.fillStyle='#e9e0d2'; g.fillRect(26,47,12,2);
  } else if (mode==='grin'){
    g.fillStyle='#1d1310'; g.fillRect(15,36,10,2); g.fillRect(39,36,10,2); g.fillRect(17,34,6,1); g.fillRect(41,34,6,1);
    g.beginPath(); g.moveTo(21,46); g.quadraticCurveTo(32,44,43,46); g.quadraticCurveTo(40,57,32,57); g.quadraticCurveTo(24,57,21,46); g.closePath();
    g.fillStyle='#4a1715'; g.fill(); g.save(); g.clip(); g.fillStyle='#eee7da'; g.fillRect(20,45,24,5); g.restore();
  } else {                                                                          // half-lidded "cool" eyes + smirk
    g.fillStyle='#1d1310'; g.fillRect(15,36,10,3); g.fillRect(39,36,10,3);
    g.fillStyle='rgba(255,255,255,.55)'; g.fillRect(20,38,3,1); g.fillRect(44,38,3,1);
    g.fillStyle='#1d1310'; g.fillRect(14,35,12,1); g.fillRect(38,35,12,1);
    g.strokeStyle='rgba(95,45,35,.9)'; g.lineWidth=2; g.beginPath(); g.moveTo(26,50); g.quadraticCurveTo(33,52,41,47); g.stroke();
  }
}
const hqFaces = {}; ['normal','cry','angry','grin'].forEach(m=>{ hqFaces[m] = tex(64,64,(g)=>hqFace(g,m)); });
const hqGoldHairTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#d9b24a',['#e8c864','#c79a38','#f0d67e'],.5);
  g.fillStyle='#fff0a8'; for(let i=0;i<24;i++){ const x=(Math.random()*32)|0, y=(Math.random()*32)|0; g.fillRect(x,y,3,1); }
});
// grey washed tee with blue college print
const hqTeeFront = tex(64,64,(g)=>{
  speckle(g,64,64,'#8e8f93',['#85868a','#96979b','#8a8b8f'],.45);
  g.fillStyle='#2f55a8'; g.font='bold 9px sans-serif'; g.textAlign='center'; g.fillText('DESIGN ST.',32,46);
  g.strokeStyle='#2f55a8'; g.lineWidth=2; g.strokeRect(22,18,20,20); g.font='bold 14px serif'; g.fillText('S',32,34);
  g.fillStyle='rgba(120,160,230,.7)'; g.fillRect(14,50,36,1);
});
const hqTeeSide = tex(32,32,(g)=>speckle(g,32,32,'#8e8f93',['#85868a','#96979b','#8a8b8f'],.45));
const hqPantsTex = tex(32,32,(g)=>{ speckle(g,32,32,'#b9b9b3',['#c4c4be','#aeaea8','#bdbdb7'],.5); g.fillStyle='rgba(0,0,0,.05)'; for(let y=0;y<32;y+=4) g.fillRect(0,y,32,1); });
const hqReelTex = tex(16,16,(g)=>{
  const gr = g.createLinearGradient(0,0,16,16); gr.addColorStop(0,'#ff4fa0'); gr.addColorStop(1,'#7a4dff');
  g.fillStyle=gr; g.fillRect(2,0,12,16); g.fillStyle='#fff'; g.fillRect(6,4,1,8); g.fillRect(7,5,1,6); g.fillRect(8,6,1,4); g.fillRect(9,7,1,2);
  g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(3,13,7,1);
});
const hqNoteTex = tex(16,16,(g)=>{ g.fillStyle='#fff7d6'; g.fillRect(9,2,2,9); g.fillRect(11,2,3,2); g.fillRect(13,4,1,2); g.fillRect(5,10,5,3); g.fillRect(6,13,3,1); g.fillRect(6,9,3,1); });

// ---------------- model ----------------
function buildJackson(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:hqFaces.normal}), skinM = L({map:hqSkinTex});
  const teeM = L({map:hqTeeSide}), frontM = L({map:hqTeeFront});
  const c = buildChar({
    skinM, faceM, headW:1.0, headH:1.15,
    torsoMat:[teeM,teeM,teeM,teeM,frontM,teeM], sleeveMat:()=>teeM, sleeve:[0.66,0.8],
    pantsM:L({map:hqPantsTex}), shoeM, soleM:greySole,
    collar(chest){
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3,0.05,4,12), teeM); ring.rotation.x = Math.PI/2; chest.add(at(ring,0,2.22,0.02));
      const strapM = L({color:0x2b2a58});                                              // navy cross-body strap
      const f = rbox(0.16,2.7,0.07,.3,strapM); f.position.set(0.05,1.1,0.5); f.rotation.z = 0.62; chest.add(f);
      const b = rbox(0.16,2.7,0.07,.3,strapM); b.position.set(0.05,1.1,-0.5); b.rotation.z = -0.62; chest.add(b);
    },
    hair(head){
      const hm = hairM;
      head.add(at(rbox(1.12,0.54,1.12,.62,hm),0,0.46,-0.02));
      head.add(at(rbox(1.08,0.98,0.55,.6,hm),0,0.08,-0.3));
      [-1,1].forEach(s=>head.add(at(rbox(0.1,0.34,0.38,.4,hm),s*0.52,0.22,0.06)));
      [[-0.34,.22,.14],[-0.12,.2,.1],[0.1,.23,.06],[0.32,.2,-.05]].forEach(([x,y,r],i)=>{
        const f = rbox(0.26,0.2+(i%2)*.05,0.14,.5,hm); f.position.set(x,y,0.47); f.rotation.z = r; head.add(f);
      });
      head.add(at(rbox(0.56,0.2,0.34,.5,hm),0.12,0.64,0.2));
    },
    face(head){
      const metalM = L({color:0xc9a85a}), lensM = new THREE.MeshBasicMaterial({color:0xdfe6ea,transparent:true,opacity:.12});
      const gl = new THREE.Group(); gl.position.set(0,0,0.56); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.16,0.016,4,14), metalM); rim.position.x = s*0.21; rim.scale.set(1.2,.85,1); gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.16,12), lensM); lens.position.set(s*0.21,0,-0.01); lens.scale.set(1.2,.85,1); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.025,0.025,0.6), metalM); arm.position.set(s*0.43,0.04,-0.3); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1,0.022,0.022), metalM),0,0.05,0));
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.07,0.018,4,10), metalM); ear.rotation.y = Math.PI/2; head.add(at(ear,-0.58,-0.08,0.02));   // earring
    }
  }, parent);
  [c.joints.rHp, c.joints.lHp].forEach(h=>h.scale.set(1.22,1,1.28));                   // wide trousers
  const phone = new THREE.Group(); c.R.hd.add(phone);
  phone.add(at(rbox(0.5,0.9,0.08,.3,L({color:0x16161a})),0,-0.55,0.12));
  phone.add(at(new THREE.Mesh(new THREE.PlaneGeometry(0.4,0.78), new THREE.MeshBasicMaterial({map:hqReelTex})),0,-0.55,0.17));
  const mic = new THREE.Group(); c.R.hd.add(mic);
  mic.add(at(cyl(0.05,0.05,0.7,L({color:0x222226}),6),0,-0.4,0));
  mic.add(at(new THREE.Mesh(new THREE.SphereGeometry(0.13,8,6),L({color:0xb8b8c0})),0,-0.03,0));
  // original round little bird with huge ears — shows up behind the head (on the hand's side) while he is "listening" (shield)
  const bird = new THREE.Group(); c.head.add(bird);
  const bBody = L({color:0x39c4b0}), bBelly = L({color:0xe9fff6}), bBeak = L({color:0xffb23d}), bEar = L({color:0xff9fbd}), bEarIn = L({color:0xd9507f}), bDark = L({color:0x1f9a8a});
  const bEyeW = new THREE.MeshBasicMaterial({color:0xffffff}), bPupil = new THREE.MeshBasicMaterial({color:0x14110f});
  const sph = (r,m,sx,sy,sz,x,y,z)=>{ const o = new THREE.Mesh(new THREE.SphereGeometry(r,12,10), m); o.scale.set(sx,sy,sz); o.position.set(x,y,z); bird.add(o); return o; };
  sph(.55,bBody,1,.95,.95,0,0,0); sph(.42,bBelly,1,1,.5,0,-0.12,.36);
  [-1,1].forEach(sd=>{ sph(.17,bEyeW,1,1.1,.8,sd*.21,.14,.44); sph(.085,bPupil,1,1,.8,sd*.21,.12,.56); sph(.15,bDark,.5,1,.8,sd*.52,-0.12,.05); });
  const beak = new THREE.Mesh(new THREE.ConeGeometry(.13,.3,6), bBeak); beak.rotation.x = Math.PI/2; beak.position.set(0,-0.03,.62); bird.add(beak);
  [[-0.14,.08],[0,0],[0.14,-.08]].forEach(([x,r],i)=>{ const f = new THREE.Mesh(new THREE.ConeGeometry(.07,.32+(i===1?.1:0),5), bDark); f.position.set(x,.62,0); f.rotation.z = r*2; bird.add(f); });
  const ears = [-1,1].map(sd=>{                                                   // the huge ears
    const g = new THREE.Group(); g.position.set(sd*.66,.18,-0.02); bird.add(g);
    const o = new THREE.Mesh(new THREE.SphereGeometry(.62,12,10), bEar); o.scale.set(.26,1.0,.82); g.add(o);
    const i2 = new THREE.Mesh(new THREE.SphereGeometry(.4,10,8), bEarIn); i2.scale.set(.2,1.0,.82); i2.position.set(sd*.07,-0.02,.04); g.add(i2);
    g.rotation.z = -sd*.28; return g;
  });
  [[-1.0,.95,.3],[1.05,.65,.35]].forEach(([x,y,z])=>{ const n = spriteOf(hqNoteTex,.75,0xffe08a); n.position.set(x,y,z); bird.add(n); });
  bird.userData.ears = ears; bird.position.set(-0.95,0.55,-0.5);
  c.props = {phone, mic, bird};
  c.hairM = hairM; c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = hqFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = hqFaces[k]; faceM.needsUpdate = true; } };
  return c;
}
export { buildJackson }
