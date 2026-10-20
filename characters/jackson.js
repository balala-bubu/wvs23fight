/* 宇 Jackson — loaded after js/core.js. Everything this character needs lives in this file.
   Also exports hqShirt(c): the shared「豪情一中人」shirt skin used by 宇、偷米、秉寶 (called from their skins at runtime). */
'use strict';
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

// ---------------- 豪情一中人 shirt skin (shared) ----------------
let _hqTex = null;
function hqShirtTextures(){
  if (_hqTex) return _hqTex;
  const base = (g,w,h)=>speckle(g,w,h,'#17171a',['#1e1e22','#111114','#232328'],.4);
  const front = tex(128,128,(g)=>{
    base(g,128,128);
    g.fillStyle='#f4f4f4'; g.font = "bold 34px "+HQ_FONT; g.textAlign='center'; g.fillText('中',84,52);        // 正面：左胸一個「中」
    g.fillRect(83,58,3,30); g.fillRect(80,84,6,3);
    g.fillStyle='#d8d8dc'; g.font='bold 8px sans-serif'; g.fillText('40',64,10);
  });
  const back = tex(128,128,(g)=>{
    base(g,128,128);
    g.fillStyle='#f4f4f4'; g.font = "bold 30px "+HQ_FONT; g.textAlign='center';                              // 背面：豪情一中人（直排）
    ['豪','情','一','中','人'].forEach((ch,i)=>g.fillText(ch, 52+(i%2)*14, 28+i*19));
    g.fillStyle='#d8231f'; g.fillRect(78,106,12,12); g.fillRect(94,106,12,12);                              // 紅色落款印
    g.fillStyle='#fff'; g.font='bold 9px '+HQ_FONT; g.fillText('印',84,116); g.fillText('豪',100,116);
  });
  const side = tex(32,32,(g)=>base(g,32,32));
  return (_hqTex = {front, back, side});
}
function hqShirt(c){
  const T = hqShirtTextures();
  const torso = c.chest.children[0], old = Array.isArray(torso.material) ? torso.material[0] : torso.material;
  const sideM = L({map:T.side}), frontM = L({map:T.front}), backM = L({map:T.back}), sleeveM = L({map:T.side});
  torso.material = [sideM,sideM,sideM,sideM,frontM,backM];
  c.chest.children.forEach(o=>{ if (o !== torso && o.isMesh && o.material === old) o.material = sideM; });   // collars / lapels
  [c.R.sh, c.Lf.sh].forEach(sh=>{
    const first = sh.children[0]; if (!first || !first.isMesh) return;
    const oldS = first.material;                                                    // long-sleeve characters (e.g. 提姆熊) reuse it on the forearm too
    sh.traverse(o=>{ if (o.isMesh && o.material === oldS) o.material = sleeveM; });
  });
}

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

// ---------------- the original suited influencer (win / lose scenes) ----------------
const hqSuitSkinM = L({color:0xe6b690}), hqSuitHairM = L({color:0x8a4a22}), hqSuitFaceM = L({map:tex(64,64,(g)=>{
  speckle(g,64,64,'#e6b690',['#dfab84','#edc29c'],.3); shadeFace(g);
  g.fillStyle='#4a2a14'; g.fillRect(12,24,14,3); g.fillRect(38,24,14,3);
  g.fillStyle='#1d1310'; g.fillRect(16,34,8,6); g.fillRect(40,34,8,6); g.fillStyle='#fff'; g.fillRect(17,35,3,2); g.fillRect(41,35,3,2);
  g.fillStyle='rgba(215,110,90,.35)'; g.fillRect(8,42,8,5); g.fillRect(48,42,8,5);
})});
const hqSuitFrontM = L({map:tex(32,32,(g)=>{ g.fillStyle='#1d2a4a'; g.fillRect(0,0,32,32); g.fillStyle='#f2f2f2'; g.beginPath(); g.moveTo(10,0); g.lineTo(22,0); g.lineTo(16,22); g.closePath(); g.fill(); g.fillStyle='#d8231f'; g.fillRect(13,2,6,3); g.fillStyle='#101a30'; g.fillRect(15,24,2,2); g.fillRect(15,28,2,2); })});
const hqSuitColors = [0x1d2a4a,0x2d2d33,0x40302a,0x24402f,0x452a48];
function hqBuildSuit(i){
  const g = new THREE.Group(), body = new THREE.Group(); body.scale.setScalar(SC); g.add(body);
  const jM = L({color:hqSuitColors[i%5]});
  const c = buildChar({
    skinM:hqSuitSkinM, faceM:hqSuitFaceM, headW:1.28, headH:1.08,
    torsoMat:[jM,jM,jM,jM,hqSuitFrontM,jM], sleeveMat:()=>jM, sleeve:[0.7,0.95],
    pantsM:L({color:0x15182a}), shoeM:L({color:0x15110f}), soleM:greySole,
    collar(chest){ const bt = L({color:0xd8231f}); chest.add(at(rbox(0.22,0.2,0.1,.4,bt),-0.17,2.02,0.5)); chest.add(at(rbox(0.22,0.2,0.1,.4,bt),0.17,2.02,0.5)); chest.add(at(rbox(0.12,0.14,0.12,.4,bt),0,2.02,0.52)); },
    hair(head){ const hm = hqSuitHairM;
      head.add(at(rbox(1.3,0.5,1.14,.62,hm),0,0.46,-0.02)); head.add(at(rbox(1.26,0.9,0.5,.6,hm),0,0.06,-0.32));
      head.add(at(rbox(0.9,0.3,0.7,.6,hm),0.1,0.7,0.15));                                // pompadour
    },
    face(head){ const hm = hqSuitHairM;
      head.add(at(rbox(1.3,0.38,0.5,.6,hm),0,-0.4,0.3)); head.add(at(rbox(0.6,0.1,0.12,.5,hm),0,-0.12,0.52));   // full beard + moustache
    }
  }, body);
  c.holder = g; c.body = body; c.props = {}; c.setOld = ()=>{}; c.setFace = ()=>{};
  return c;
}

// ---------------- poses ----------------
// scuba dance (reference: Nick-style sway): forearms folded up in front of the chest, fists tucked, shoulders/chest swaying side to side, knees bent
const HQ_POSES = {
  hqScubaA: S_({}), hqScubaB: S_({}),                                          // filled in below by Object.assign
  // angry-bird "listening": hand cupped at the ear (arm angles solved numerically so the palm really lands at the ear), head tilted into it
  hqEarL: S_({lSh:[-1.4,-0.6,2.0], lEl:[-2.4], rSh:[-0.25,0,-0.2], rEl:[-1.3], chest:[0.05,0,-0.08], head:[0.02,0.1,-0.3], rHp:[-0.15], lHp:[0.1], drop:-0.18}),
  hqEarR: S_({rSh:[-1.4,0.6,-2.0], rEl:[-2.4], lSh:[-0.25,0,0.2], lEl:[-1.3], chest:[0.05,0,0.08], head:[0.02,-0.1,0.3], rHp:[-0.15], lHp:[0.1], drop:-0.18}),
  hqSing: S_({rSh:[-1.5,0,-0.2], rEl:[-1.3], lSh:[-0.3,0,0.5], lEl:[-0.4], head:[-0.22], chest:[-0.12], drop:-0.1}),
  hqHigh: S_({rSh:[-2.2,0,-0.15], rEl:[-0.25], lSh:[-0.4,0,0.2], lEl:[-1.2], chest:[0.05,0.2,0], head:[-0.05,0.1,0]}),
  hqHighL: S_({lSh:[-2.2,0,0.15], lEl:[-0.25], rSh:[-0.4,0,-0.2], rEl:[-1.2], chest:[0.05,-0.2,0], head:[-0.05,-0.1,0]}),
  hqAngel: S_({rSh:[0,0,-2.0], lSh:[0,0,2.0], rEl:[-0.1], lEl:[-0.1], rHp:[0,0,-0.2], lHp:[0,0,0.2], drop:0}),
  hqLift: S_({rSh:[-2.8,0,-0.1], lSh:[-2.8,0,0.1], rEl:[-0.2], lEl:[-0.2], chest:[-0.1]}),
};

// scuba dance: base steps from the supplied Scuba_Face_IK pack (one hand pinched to the nose, other arm sweeping, knees bouncing);
// js/scuba_face_ik.js then re-solves the hand onto the nose every frame. `mirror` = use the left hand (when the camera sees his left side).
function hqScubaBase(t, mirror){
  const sw = Math.sin(t*Math.PI*4), flip = (a)=>a ? [a[0], -(a[1]||0), -(a[2]||0)] : a;
  const o = { head:[-0.12,0,-0.15], chest:[0.05,0,sw*.06],
    rSh:[-1.4,0,-0.5], rEl:[-1.45], lSh:[-0.55,0,.55+sw*.48], lEl:[-.55],
    rHp:[-.2,0,-.08], lHp:[-.2,0,.08], rKn:[.45+Math.max(0,sw)*.2], lKn:[.45+Math.max(0,-sw)*.2], drop:-.1 };
  if (mirror){
    const m = {};
    [['rSh','lSh'],['rEl','lEl'],['rHp','lHp'],['rKn','lKn']].forEach(([r,l])=>{ m[r] = flip(o[l]); m[l] = flip(o[r]); });
    m.head = flip(o.head); m.chest = flip(o.chest); m.drop = o.drop; return P(m);
  }
  return P(o);
}
function hqScubaDance(m, t, dt, mirror){
  m._hqIK = m._hqIK || {};
  const key = mirror ? 'L' : 'R', arm = mirror ? m.Lf : m.R;
  if (!m._hqIK[key]) m._hqIK[key] = ScubaFaceIK.create({
    head:m.head, shoulder:arm.sh, elbow:arm.el, hand:arm.hd,
    noseLocal:[0,-0.08,0.5], handLocal:[0,-0.15,0.05], noseAxis:[0,0,1], faceGap:0.14, iterations:14, tolerance:0.025,
    danceBasePose:(tt)=>applyPose(m, hqScubaBase(tt, mirror), 1)
  });
  return m._hqIK[key].update(t, dt);
}
Object.assign(HQ_POSES, { hqScubaA: hqScubaBase(.125,false), hqScubaB: hqScubaBase(.375,false) });
// idle "cool" slouch: weight on one leg, one hand half in pocket, slow sway
function hqCool(t){
  const s = Math.sin(t*1.5);
  return S_({lSh:[0.05,-0.15,0.14], lEl:[-1.0], rSh:[-0.3,0,-0.15], rEl:[-1.3], chest:[0.07,0.12 + s*0.05,0.04 + s*0.03], head:[-0.05,0.2 - s*0.06,0.1],
    rHp:[-0.2], lHp:[0.12], lKn:[0.2], drop:-0.14, turn:s*0.06});
}
// tripping mid-dance: arms windmill, torso pitched forward
function hqStumble(t){
  return S_({rSh:[Math.sin(t*22)*1.5,0,-0.9], lSh:[-Math.sin(t*22)*1.5,0,0.9], rEl:[-0.3], lEl:[-0.3], chest:[0.5], head:[0.25], rHp:[-0.8], lKn:[1.0], drop:-0.3});
}

// ---------------- ultimate: scuba + reels spam ----------------
const HQ_REEL_LINES = ['轉傳給你','這個超好笑','已讀不回','看完這個','第47則 Reels','Scuba!'];
function hqFinal(f, opp){
  f.finalT = 3.0; banner('Scuba！Reels 洗版！'); SFX.whistle(); pop('這個你一定要看', f.x, f.y+7.5, 'big');
  const reels = [];
  G.finals.push({type:'reels', owner:f, t:0, spawn:0, big:false, reels, update:hqFinalUpdate, dispose:(F)=>F.reels.forEach(r=>scene.remove(r.o))});
}
function hqFinalUpdate(F, dt, t){
  const f = F.owner;
  F.spawn -= dt;
  if (t < 2.5 && F.spawn <= 0){
    F.spawn = .1;
    const o = spriteOf(hqReelTex, 1.6), dir = Math.random() < .5 ? -1 : 1;
    o.position.set(f.x, f.y+4.5, .6); scene.add(o);
    F.reels.push({o, x:f.x, y:f.y+4.5, vx:dir*(10+Math.random()*16), vy:6+Math.random()*10, life:1.8, hit:new Set()});
    if (Math.random() < .35) SFX.note(Math.floor(Math.random()*3));
  }
  for (let i=F.reels.length-1;i>=0;i--){
    const r = F.reels[i];
    r.life -= dt; r.vy -= 22*dt; r.x += r.vx*dt; r.y += r.vy*dt; r.o.position.set(r.x, r.y, .6); r.o.material.rotation += dt*6;
    for (const v of G.fighters){
      if (v===f || r.hit.has(v) || !v.hittable()) continue;
      if (Math.abs(v.x - r.x) < 1.8 && Math.abs(v.y+3 - r.y) < 3.4){
        r.hit.add(v); v.pct += 3; v.meter = Math.min(100, v.meter+2);
        const dir = Math.sign(v.x - f.x) || f.face; launch(v, 0, 0, dir); v.vx = dir*5; v.vy = 7; v.hitstun = .35;
        SFX.soft(); spark(v.x, v.y+3, 1.4); if (Math.random() < .5) pop(HQ_REEL_LINES[(Math.random()*HQ_REEL_LINES.length)|0], v.x, v.y+7, 'blue');
      }
    }
    if (r.life <= 0 || r.y < -30){ scene.remove(r.o); F.reels.splice(i,1); }
  }
  if (t > 2.6 && !F.big){
    F.big = true; SFX.boom(); G.shake = reduce ? .2 : 1.2; G.freeze = .12; pop('已讀！', f.x, f.y+8, 'big');
    for (const v of G.fighters){
      if (v===f || !v.hittable() || Math.abs(v.x - f.x) > 18) continue;
      v.pct += 8; launch(v, 28 + v.pct*.11, 48, Math.sign(v.x - f.x) || f.face); SFX.hit(40); spark(v.x, v.y+3, 4);
    }
  }
  return t > 3.0 && F.reels.length === 0;
}

// ---------------- results ----------------
function hqWinSetup(R){
  const wp = R.W.m.holder.position;
  const s = hqBuildSuit(0); s.holder.position.set(wp.x + 16, RS_Y, -1); s.holder.rotation.y = -1.0; scene.add(s.holder); R.items.push(s.holder);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.5,0.07,6,16), new THREE.MeshBasicMaterial({color:0xffe066})); halo.rotation.x = Math.PI/2; s.head.add(at(halo,0,0.95,0)); halo.visible = false;
  const wingM = new THREE.MeshBasicMaterial({color:0xffffff}), wings = [];
  [-1,1].forEach(side=>{ const w = rbox(1.9,0.14,0.9,.4,wingM); w.position.set(side*1.3,1.4,-0.6); w.rotation.set(0,0,side*0.5); s.chest.add(w); w.visible = false; wings.push(w); });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,60,12,1,true), new THREE.MeshBasicMaterial({color:0xfff2a8,transparent:true,opacity:.28,side:THREE.DoubleSide}));
  beam.position.set(wp.x + 3.6, RS_Y + 30, -1); beam.visible = false; scene.add(beam); R.items.push(beam);
  R.suit = s; R.halo = halo; R.wings = wings; R.beam = beam; R.sx = wp.x + 3.6;
}
function hqWinUpdate(R, dt, k){
  const W = R.W, wp = W.m.holder.position, S = R.suit, t = R.t;
  W.m.holder.rotation.y += (1.0 - W.m.holder.rotation.y)*Math.min(1, dt*6);
  if (t < 1.1){
    const u = t/1.1; S.holder.position.x = R.sx + 12.4*(1-u); S.holder.position.y = RS_Y + Math.abs(Math.sin(t*16))*.2;
    applyPose(S, runPose(t*16), k); applyPose(W.m, POSE.thumbs, k); once('hi', .2, ()=>popAt('嗨～', W, 8, 'blue'));
  } else if (t < 1.9){
    S.holder.position.set(R.sx, RS_Y, -1); S.holder.rotation.y += (-1.0 - S.holder.rotation.y)*Math.min(1, dt*6);
    applyPose(S, POSE.hqHighL, k); applyPose(W.m, POSE.hqHigh, k);
    once('hf', 1.3, ()=>{ spark(wp.x + 1.9, RS_Y + 5.6, 3); SFX.hit(25); popAt('擊掌！', W, 8.5, 'big'); });
  } else {
    const u = t - 1.9;
    once('up', 1.95, ()=>{ R.halo.visible = true; R.wings.forEach(w=>w.visible = true); R.beam.visible = true; SFX.chord(); SFX2.cheer(); pop('升天了～', R.sx, RS_Y + 9, 'big'); });
    S.holder.position.y = RS_Y + u*u*5 + u*2; S.holder.rotation.y += dt*(2 + u*5);
    applyPose(S, POSE.hqAngel, k); R.wings.forEach((w,i)=>w.rotation.z = (i?1:-1)*(0.5 + Math.sin(t*10)*.35));
    if (Math.random() < dt*10){ const p = spriteOf(starTex, 1.0, 0xfff2a8); p.position.set(R.sx + (Math.random()-.5)*4, S.holder.position.y + 2, -.5); scene.add(p); R.puffs.push({o:p, life:1.0, vy:3, grow:.3}); }
    hqScubaDance(W.m, t, dt, false); W.m.setFace('grin');
    once('s1', 2.4, ()=>{ SFX.laughShort(); popAt('Scuba！', W, 8.5, 'big'); });
    once('s2', 3.9, ()=>{ SFX2.cheer(); popAt('Scuba Scuba～', W, 9, 'red'); });
  }
}
function hqLoseSetup(R){
  R.crowd = []; R.lx0 = R.Lz.m.holder.position.x;
  for (let i=0;i<5;i++){
    const s = hqBuildSuit(i); s.holder.position.set(R.lx0 + 30 + i*3, RS_Y, -5 + (i%3-1)*1.2); s.holder.rotation.y = -Math.PI/2 + .3; scene.add(s.holder); R.items.push(s.holder); R.crowd.push(s);
  }
}
function hqLoseUpdate(R, dt, k){
  const Lz = R.Lz, h = Lz.m.holder, t = R.t, x0 = R.lx0;
  if (t < 1.3){
    hqScubaDance(Lz.m, t, dt, false); Lz.m.setFace('grin'); once('d1', .2, ()=>popAt('Scuba～', Lz, 8, 'big'));
  } else {
    Lz.m.body.position.y = 0;
    once('trip', 1.3, ()=>{ popAt('嗚哇！', Lz, 7, 'big'); SFX.soft(); });
    Lz.m.setFace('cry');
    if (t < 1.9) applyPose(Lz.m, hqStumble(t), 1 - Math.exp(-dt*20)); else applyPose(Lz.m, POSE.flat, k);
  }
  R.crowd.forEach((s,i)=>{
    const tx = x0 + (i - 2)*1.25, run0 = 1.5 + i*.08, lift = t > 2.6;
    if (t < run0) return;
    const u = Math.min(1, (t - run0)/1.2);
    if (u < 1 && !lift){ s.holder.position.x = (x0 + 30 + i*3) + (tx - (x0 + 30 + i*3))*u; applyPose(s, runPose(t*16 + i), k); s.holder.position.y = RS_Y + Math.abs(Math.sin(t*16+i))*.2; }
    else { s.holder.position.x = tx; s.holder.position.y = RS_Y; s.holder.rotation.y += (-.6 - s.holder.rotation.y)*Math.min(1,dt*6); applyPose(s, t > 2.6 ? POSE.hqLift : POSE.stand, k); }
  });
  if (t >= 2.6 && t < 3.9){
    const e = Math.min(1, (t - 2.6)/.7); h.position.set(x0, RS_Y + 4.2*e + Math.sin(t*8)*.15, -5);
    once('lift', 2.6, ()=>{ pop('舉起來！', x0, RS_Y + 9, 'blue'); SFX2.cheer(); });
  } else if (t >= 3.9){
    R.vx = R.vx !== undefined ? R.vx : 16; R.vy = R.vy !== undefined ? R.vy : 24;
    R.vy -= 40*dt; h.position.x += R.vx*dt; h.position.y += R.vy*dt; h.rotation.z += dt*9;
    once('toss', 3.9, ()=>{ popAt('啊啊啊——', Lz, 6, 'big'); SFX.boom(); });
  }
}

registerChar('jackson', {
  stats: { name:'宇', en:'Yu', tag:'悶騷・唱跳・Scuba・奇怪Reels', weight:1.0, run:14, air:11, jumpV:30, djV:26, jumps:2 },
  skins: [
    { name:'金髮', apply(c){ c.hairM.map = hqGoldHairTex; c.hairM.needsUpdate = true; } },
    { name:'豪情一中人', apply(c){ hqShirt(c); } },
    { name:'生日帽', apply(c){ const h = birthdayHat('#7ec8ff','#ffe066',0xff6a8a); h.position.set(0.05,0.66,-0.02); c.head.add(h); } },
  ],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'帥吧'},
    side:{t:[.24,.1,.32], pose:['batWind','batHit'], box:[2.6,3.4,1.6], dmg:14, kb:12, sc:1.05, ang:36, prop:'phone', text:'傳給你！', sfx:'swing'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,6.4,1.8], dmg:12, kb:11, sc:1, ang:88, sfx:'swing'},
    down:{t:[.12,.22,.3], pose:['hqScubaA','hqScubaB'], poseSwitch:.2, box:[2.0,0.9,1.5], dmg:9, kb:8, sc:.7, ang:28, dash:13, text:'Scuba！'},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.1,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1},
    nB:{t:[.2,.05,.28], pose:['throwWind','throwHit'], prop0:'phone', fire:[[.2,'hqReel']], air:1, sfx:'swing'},
    sB:{t:[.12,.25,.3], pose:['sprint','sprint'], prop:'phone', box:[1.8,3.6,1.4], dmg:8, kb:6, sc:.4, ang:40, dash:24, air:1, onHit:'hqDizzy', text:'看這個！'},
    uB:{t:[.05,.5,.1], pose:['hqScubaA','laughUp'], poseSwitch:.25, start:'hqUp', box:[0.4,5,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1, text:'Scuba跳！'},
    dB:{t:[.12,.7,.3], pose:['hqSing','hqSing'], prop:'mic', fire:[[.12,'hqNote0'],[.3,'hqNote1'],[.48,'hqNote2'],[.66,'hqHigh']], air:1, text:'♪'},
  },
  fire: {
    hqReel(f){ proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.4, vx:f.face*21, vy:0, g:0, r:.95, life:1.2, dmg:6, kb:6, sc:.5, ang:40, mesh:spriteOf(hqReelTex,1.6), spin:1}); pop(HQ_REEL_LINES[(Math.random()*HQ_REEL_LINES.length)|0], f.x, f.y+7); },
    hqNote0(f){ FIRE._hqNote(f,0); }, hqNote1(f){ FIRE._hqNote(f,1); }, hqNote2(f){ FIRE._hqNote(f,2); },
    _hqNote(f,i){ proj({owner:f, x:f.x+f.face*2.0, y:f.y+4+i*.4, vx:f.face*17, vy:0, g:0, wave:1.2, r:.85, life:1, dmg:4, kb:3, sc:.2, ang:45, mesh:spriteOf(hqNoteTex,1.4)}); SFX.note(i); },
    hqHigh(f){ proj({owner:f, x:f.x+f.face*2.4, y:f.y+4.2, vx:f.face*20, vy:0, g:0, r:1.5, life:.9, dmg:7, kb:10, sc:.7, ang:45, mesh:spriteOf(hqNoteTex,2.6,0xffd27a)}); SFX.chord(); pop('We are～♪', f.x+f.face*2, f.y+7); },
  },
  start: { hqUp(f){ f.vy = 31; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xff8fc0, 8, 8); } },
  onhit: { hqDizzy(att, v){ v.state = 'stun'; v.stunT = .6; v.move = null; pop('看傻了', v.x, v.y+7.5, 'blue'); } },
  poses: HQ_POSES,
  build: buildJackson, face: hqFaces.normal, portraitBg: '#8fb6d9',
  portrait(g){
    g.fillRect(6,7,52,16); g.fillRect(4,12,6,16); g.fillRect(54,12,6,16);
    g.strokeStyle = '#c9a85a'; g.lineWidth = 1.5; g.strokeRect(14,35,16,10); g.strokeRect(34,35,16,10); g.beginPath(); g.moveTo(30,38); g.lineTo(34,38); g.stroke();
  },
  shield(){
    const g = new THREE.Group();
    g.add(new THREE.Mesh(new THREE.SphereGeometry(2.7,14,10), new THREE.MeshBasicMaterial({color:0xff5a3c,transparent:true,opacity:.22})));
    g.userData.rings = [0,1,2].map(()=>{ const r = new THREE.Mesh(new THREE.TorusGeometry(1.0,0.07,6,20), new THREE.MeshBasicMaterial({color:0xffd27a,transparent:true,opacity:.8})); g.add(r); return r; });
    return g;
  },
  shieldAnim(f){                                                        // sound-wave rings rush in toward the ear
    const sm = f.shieldMesh, tt = performance.now()/1000;
    sm.position.set(f.x, f.y+3.2, 0.2);
    sm.userData.rings.forEach((r,i)=>{ const u = (tt*1.6 + i/3) % 1; r.position.set(0, 1.5, 3.4*(1-u)); r.scale.setScalar(1.5 - u*1.0); r.material.opacity = .85*(1-u); });
  },
  shieldPose: 'hqEarL', shieldProp: 'bird', breakText: '耳朵聽爆了！', breakColor: 0xff5a3c,
  finalPose: 'hqScubaA', finalProp: null,
  animate(f, m, s, t, dt){
    if (s==='final'){ hqScubaDance(m, t, dt, f.face < 0); m.setFace('grin'); }
    else if (s==='shield'){                                              // use the arm nearest the camera
      applyPose(m, f.face > 0 ? POSE.hqEarR : POSE.hqEarL, 1 - Math.exp(-dt*20)); m.head.rotation.z += Math.sin(t*9)*.05; m.setFace('angry');
      const bd = m.props.bird;                                           // sits behind the head, on the hand's side, turned to face the camera
      bd.position.set((f.face > 0 ? -0.95 : 0.95), 0.55 + Math.sin(t*8)*.06, -0.5); bd.rotation.y = -m.holder.rotation.y;
      bd.userData.ears.forEach((e,i)=>{ e.rotation.y = Math.sin(t*10 + i*Math.PI)*.18; });
    }
    else if (s==='idle') applyPose(m, hqCool(t), 1 - Math.exp(-dt*8));
  },
  introPose: 'thumbs', readyPose: (t)=> hqScubaBase(t, false), selectSfx: ()=>SFX.laughShort(),
  winSub: '"Scuba scuba～"',
  final: hqFinal, winSetup: hqWinSetup, winUpdate: hqWinUpdate, loseSetup: hqLoseSetup, loseUpdate: hqLoseUpdate,
  longWin: true, longLose: true,
});
