/* 成自然 Newton — 健身・電機・半導體・存股. Loaded after js/core.js; everything this character needs lives here. */
'use strict';

// ---------------- textures ----------------
const NW_SKIN = '#c4916a', NW_SKIN_C = ['#b9875f','#cf9c76','#bd8b65','#c99770'];
const nwSkinTex = tex(16,16,(g)=>speckle(g,16,16,NW_SKIN,NW_SKIN_C,.4));
function nwFace(g, mode){
  speckle(g,64,64,NW_SKIN,NW_SKIN_C,.35); shadeFace(g);
  // cheeks + nose
  g.fillStyle='rgba(200,100,80,.22)'; g.beginPath(); g.ellipse(14,44,6,4,0,0,7); g.fill(); g.beginPath(); g.ellipse(50,44,6,4,0,0,7); g.fill();
  g.fillStyle='rgba(120,70,45,.4)'; g.fillRect(30,40,4,4); g.fillStyle='rgba(85,42,28,.7)'; g.fillRect(28,44,3,1); g.fillRect(33,44,3,1);
  // brows (mostly under the fringe)
  g.fillStyle='#1b1311'; g.fillRect(13,26,12,2); g.fillRect(39,26,12,2);
  g.strokeStyle='#1a120f'; g.lineWidth=2;
  if (mode==='cry'){
    g.beginPath(); g.moveTo(14,35); g.lineTo(25,38); g.stroke(); g.beginPath(); g.moveTo(50,35); g.lineTo(39,38); g.stroke();
    g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,39,3,15); g.fillRect(44,39,3,15);
    g.fillStyle='#4a1715'; g.beginPath(); g.ellipse(32,52,6,3,0,Math.PI,0); g.fill();
  } else if (mode==='shock'){
    g.fillStyle='#fff'; g.beginPath(); g.arc(20,37,4.5,0,7); g.fill(); g.beginPath(); g.arc(44,37,4.5,0,7); g.fill();
    g.fillStyle='#1a120f'; g.fillRect(19,36,3,3); g.fillRect(43,36,3,3);
    g.fillStyle='#4a1715'; g.beginPath(); g.ellipse(32,52,4,5,0,0,7); g.fill();
  } else if (mode==='ko'){
    [20,44].forEach(x=>{ g.beginPath(); g.moveTo(x-4,33); g.lineTo(x+4,41); g.stroke(); g.beginPath(); g.moveTo(x+4,33); g.lineTo(x-4,41); g.stroke(); });
    g.fillStyle='#4a1715'; g.fillRect(27,51,10,2);
  } else if (mode==='boss'){
    g.beginPath(); g.moveTo(15,37); g.lineTo(25,36); g.stroke(); g.beginPath(); g.moveTo(39,36); g.lineTo(49,37); g.stroke();   // smug half-closed eyes
    g.beginPath(); g.moveTo(24,50); g.quadraticCurveTo(34,54,42,47); g.stroke();
  } else {
    // smiling narrow eyes like the photo
    g.fillStyle='#1a120f'; g.beginPath(); g.ellipse(20,37,4.5,2.2,0,0,7); g.fill(); g.beginPath(); g.ellipse(44,37,4.5,2.2,0,0,7); g.fill();
    g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(21,36,1,1); g.fillRect(45,36,1,1);
    g.strokeStyle='rgba(110,60,40,.45)'; g.lineWidth=1; g.beginPath(); g.arc(20,39,5,Math.PI*.2,Math.PI*.8); g.stroke(); g.beginPath(); g.arc(44,39,5,Math.PI*.2,Math.PI*.8); g.stroke();
    // open smile with teeth
    g.beginPath(); g.moveTo(23,48); g.quadraticCurveTo(32,46,41,48); g.quadraticCurveTo(38,56,32,56); g.quadraticCurveTo(26,56,23,48); g.closePath();
    g.fillStyle='#8a2f2a'; g.fill(); g.save(); g.clip(); g.fillStyle='#f1ebe0'; g.fillRect(22,46,20,4); g.restore();
    g.fillStyle='rgba(190,90,80,.55)'; g.fillRect(27,56,10,1);
  }
}
const nwFaces = {};
['normal','cry','shock','ko','boss'].forEach(k=>nwFaces[k] = tex(64,64,(g)=>nwFace(g,k)));
// heather-oatmeal sleeveless muscle tee
function nwTeeBase(g, w, h){ speckle(g,w,h,'#e3ded4',['#d4cec3','#ece8e0','#c9c3b8','#f2efe9'],.5); }
const nwTeeTex = tex(32,32,(g)=>nwTeeBase(g,32,32));
const nwTeeFrontTex = tex(32,32,(g)=>{
  nwTeeBase(g,32,32);
  g.fillStyle='#cbc4b8'; g.beginPath(); g.ellipse(16,0,8,6,0,0,Math.PI); g.fill();                 // ribbed crew neck
  g.fillStyle='#e9e5dd'; for (let x=9;x<24;x+=2) g.fillRect(x,0,1,5);
  g.fillStyle=NW_SKIN; g.beginPath(); g.ellipse(16,0,6,4,0,0,Math.PI); g.fill();
  g.fillStyle='rgba(120,110,95,.18)'; g.fillRect(8,12,1,14); g.fillRect(23,12,1,14);               // fold shadows
});
const nwDenimTex = tex(32,32,(g)=>{ speckle(g,32,32,'#8fb1d2',['#7fa3c7','#a3c1dd','#86a9cc','#b5cee5'],.55); g.fillStyle='rgba(255,255,255,.08)'; for(let y=0;y<32;y+=2) g.fillRect(0,y,32,1); g.fillStyle='rgba(60,90,130,.25)'; g.fillRect(0,0,32,2); });
const nwShoeTex = tex(16,16,(g)=>{ g.fillStyle='#f4f2ee'; g.fillRect(0,0,16,16); g.fillStyle='#d9d5ce'; g.fillRect(0,12,16,4); g.fillStyle='#ffffff'; for(let x=4;x<12;x+=2) g.fillRect(x,3,1,6); });
// red windbreaker skin
const nwJacketTex = tex(32,32,(g)=>{ speckle(g,32,32,'#d8262b',['#c81e24','#e43a3a','#bd1b20'],.4); g.fillStyle='rgba(255,255,255,.08)'; g.fillRect(0,10,32,1); });
const nwJacketFrontTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#d8262b',['#c81e24','#e43a3a','#bd1b20'],.4);
  g.fillStyle='#f3f1ec'; g.beginPath(); g.moveTo(9,0); g.lineTo(16,7); g.lineTo(23,0); g.fill();     // white inner collar
  g.fillStyle='#8f8f96'; g.fillRect(15,6,2,26);                                                    // zipper
  g.fillStyle='#b5151b'; g.fillRect(4,20,8,1); g.fillRect(20,20,8,1);                              // pockets
});
const nwKnitTex = tex(16,16,(g)=>{ speckle(g,16,16,'#c79a98',['#b88987','#d6aba8','#bd908e'],.45); g.fillStyle='rgba(120,70,70,.25)'; for(let x=0;x<16;x+=3) g.fillRect(x,0,1,16); });
const nwHoodTex = tex(16,16,(g)=>speckle(g,16,16,'#9a9aa0',['#8c8c93','#a9a9ae'],.45));
// boss suit (final + win)
const nwSuitTex = tex(32,32,(g)=>speckle(g,32,32,'#202a44',['#1a2238','#26314f'],.35));
const nwSuitFrontTex = tex(32,32,(g)=>{
  speckle(g,32,32,'#202a44',['#1a2238','#26314f'],.35);
  g.fillStyle='#f6f6f2'; g.beginPath(); g.moveTo(9,0); g.lineTo(16,16); g.lineTo(23,0); g.fill();   // shirt
  g.fillStyle='#d01e2a'; g.beginPath(); g.moveTo(15,2); g.lineTo(17,2); g.lineTo(18,14); g.lineTo(16,17); g.lineTo(14,14); g.fill();   // red tie
  g.fillStyle='#141a2c'; g.beginPath(); g.moveTo(9,0); g.lineTo(13,11); g.lineTo(11,13); g.lineTo(7,2); g.fill(); g.beginPath(); g.moveTo(23,0); g.lineTo(19,11); g.lineTo(21,13); g.lineTo(25,2); g.fill();
  g.fillStyle='#c9a64a'; g.fillRect(15,20,2,2); g.fillRect(15,25,2,2);                             // buttons
  g.fillStyle='#f6f6f2'; g.fillRect(4,8,4,2);                                                       // pocket square
});
// silicon wafer (shield / chip dies)
const nwWaferTex = tex(64,64,(g)=>{
  const gr = g.createLinearGradient(0,0,64,64);
  gr.addColorStop(0,'#c9d1e0'); gr.addColorStop(.3,'#b8a6e6'); gr.addColorStop(.55,'#8fd6d0'); gr.addColorStop(.8,'#e6c98f'); gr.addColorStop(1,'#a9b4c8');
  g.fillStyle = gr; g.fillRect(0,0,64,64);
  g.fillStyle='rgba(40,45,70,.55)'; for (let i=1;i<64;i+=7){ g.fillRect(i,0,1,64); g.fillRect(0,i,64,1); }
  g.fillStyle='rgba(255,255,255,.35)'; [[8,15],[22,8],[36,29],[50,15],[15,43],[43,50],[29,22]].forEach(([x,y])=>g.fillRect(x,y,6,6));
  g.fillStyle='rgba(30,30,50,.6)'; [[29,36],[15,22],[50,36]].forEach(([x,y])=>g.fillRect(x,y,6,6));
});
const nwChipTex = tex(16,16,(g)=>{ g.fillStyle='#d9b24a'; g.fillRect(0,0,16,16); g.fillStyle='#22252c'; g.fillRect(2,2,12,12); g.fillStyle='#8fd6d0'; g.fillRect(5,5,6,6); g.fillStyle='#d9b24a'; g.fillRect(3,3,2,2); });
// original "護國神山" wafer emblem (stand-in for a company logo)
const nwEmblemTex = tex(128,128,(g)=>{
  g.fillStyle='#ffffff'; g.beginPath(); g.arc(64,52,46,0,7); g.fill();
  g.save(); g.beginPath(); g.arc(64,52,44,0,7); g.clip();
  g.fillStyle='#e9ecf2'; g.fillRect(0,0,128,128);
  g.fillStyle='#2a2c33'; for (let i=0;i<128;i+=9){ g.fillRect(i,0,2,128); g.fillRect(0,i,128,2); }
  g.fillStyle='#3a3d46'; [[47,20],[74,29],[38,65],[83,74],[56,83]].forEach(([x,y])=>g.fillRect(x,y,9,9));
  g.restore();
  g.strokeStyle='#2a2c33'; g.lineWidth=3; g.beginPath(); g.arc(64,52,44,0,7); g.stroke();
  // red mountain (護國神山) across the wafer
  g.fillStyle='#d6141e'; g.beginPath(); g.moveTo(20,72); g.lineTo(50,30); g.lineTo(62,44); g.lineTo(76,24); g.lineTo(108,72); g.closePath(); g.fill();
  g.fillStyle='#ffffff'; g.beginPath(); g.moveTo(70,32); g.lineTo(76,24); g.lineTo(82,33); g.lineTo(76,30); g.fill();
  g.fillStyle='#d6141e'; g.fillRect(14,100,100,6);
  g.fillStyle='#ffffff'; g.fillRect(8,108,112,20); g.fillStyle='#1d1d22'; g.font='900 18px sans-serif'; g.textAlign='center'; g.fillText('護國神山', 64, 124);
});
const nwPhoneTex = tex(64,64,(g)=>{
  g.fillStyle='#16161b'; g.fillRect(14,2,36,60); g.fillStyle='#f6f7fb'; g.fillRect(17,7,30,50);
  g.fillStyle='#20232c'; g.font='bold 7px sans-serif'; g.textAlign='center'; g.fillText('股票通知', 32, 15);
  g.strokeStyle='#18a34a'; g.lineWidth=2; g.beginPath(); g.moveTo(19,20); g.lineTo(26,24); g.lineTo(31,22); g.lineTo(37,34); g.lineTo(45,44); g.stroke();
  g.fillStyle='#18a34a'; g.beginPath(); g.moveTo(41,46); g.lineTo(47,46); g.lineTo(47,40); g.fill();
  g.font='900 10px sans-serif'; g.fillText('-9.9%', 32, 54);
});
const nwGhostTex = tex(32,32,(g)=>{
  g.fillStyle='rgba(235,245,255,.92)'; g.beginPath(); g.arc(16,12,10,Math.PI,0); g.lineTo(26,26); g.lineTo(22,23); g.lineTo(19,27); g.lineTo(16,23); g.lineTo(13,27); g.lineTo(10,23); g.lineTo(6,26); g.closePath(); g.fill();
  g.strokeStyle='#8a93a0'; g.lineWidth=1; g.beginPath(); g.arc(12,13,3,0,7); g.stroke(); g.beginPath(); g.arc(20,13,3,0,7); g.stroke();
  g.fillStyle='#2a2d36'; g.fillRect(11,13,2,1); g.fillRect(19,13,2,1); g.fillRect(14,19,4,1);
  g.fillStyle='#1d1512'; g.fillRect(7,4,18,4);
});
function nwTextTex(text, bg, fg){ return tex(128,32,(g)=>{ g.fillStyle=bg; g.fillRect(0,0,128,32); g.fillStyle=fg; g.font='900 20px sans-serif'; g.textAlign='center'; g.fillText(text,64,24); }); }
const nwPlateTex = nwTextTex('成 總 經 理','#2a1d14','#f2c14e');

const nwSkinM = L({map:nwSkinTex}), nwTeeM = L({map:nwTeeTex}), nwDenimM = L({map:nwDenimTex}), nwHairM = L({map:blackHairTex});
const nwShoeM = L({map:nwShoeTex}), nwSoleM = L({color:0xe8e4dc});
const nwIronM = L({color:0x3a3c42}), nwSteelM = L({color:0xb8bcc4});

// ---------------- props ----------------
function nwDumbbell(){
  const g = new THREE.Group();
  const bar = cyl(0.07,0.07,1.0,nwSteelM,6); bar.rotation.x = Math.PI/2; g.add(at(bar,0,-0.2,0));
  [-1,1].forEach(s=>{ const p = cyl(0.3,0.3,0.22,nwIronM,10); p.rotation.x = Math.PI/2; g.add(at(p,0,-0.2,s*0.45)); });
  return g;
}
function nwBarbell(){
  const g = new THREE.Group();
  const bar = cyl(0.06,0.06,4.4,nwSteelM,6); bar.rotation.z = Math.PI/2; g.add(at(bar,0.92,-0.2,0));
  [-1,1].forEach(s=>{ [0,1].forEach(j=>{ const p = cyl(0.62-j*.14,0.62-j*.14,0.16,j ? L({color:0xc0392b}) : nwIronM,12); p.rotation.z = Math.PI/2; g.add(at(p,0.92 + s*(1.75 + j*0.18),-0.2,0)); }); });
  return g;
}
function nwArrowMesh(len, mat){
  const g = new THREE.Group();
  g.add(at(rbox(0.5,len,0.5,.3,mat),0,len/2,0));
  g.add(at(new THREE.Mesh(new THREE.ConeGeometry(0.85,1.5,4), mat),0,len+0.7,0));
  return g;
}

// ---------------- model ----------------
function buildNewton(parent){
  const faceM = L({map:nwFaces.normal});
  const c = buildChar({
    skinM:nwSkinM, faceM, headW:1.0, headH:1.15,
    torsoMat:[nwTeeM,nwTeeM,nwTeeM,nwTeeM,L({map:nwTeeFrontTex}),nwTeeM], sleeveMat:()=>nwTeeM, sleeve:[0.58,0.36],
    pantsM:nwDenimM, shoeM:nwShoeM, soleM:nwSoleM,
    collar(chest){},
    hair(head){
      const hm = nwHairM;
      head.add(at(rbox(1.2,0.6,1.18,.62,hm),0,0.5,-0.02));                       // crown volume
      head.add(at(rbox(1.16,1.0,0.6,.6,hm),0,0.1,-0.3));                          // back
      head.add(at(rbox(1.14,0.3,0.32,.5,hm),0,0.5,0.36));                         // front volume
      [-1,1].forEach(s=>{
        head.add(at(rbox(0.16,0.55,0.78,.45,hm),s*0.55,0.22,-0.02));               // sides over the ears
        const t = rbox(0.14,0.42,0.2,.5,hm); t.position.set(s*0.52,0.16,0.36); t.rotation.z = s*0.08; head.add(t);
      });
      // thick straight fringe down to the brows, split a little left of centre
      [[-0.4,.32,.46,-.06],[-0.2,.3,.5,-.03],[-0.03,.33,.44,.05],[0.15,.3,.5,.04],[0.34,.31,.47,.08],[0.46,.34,.36,.12]].forEach(([x,y,h,rz])=>{
        const f = rbox(0.24,h,0.16,.5,hm); f.position.set(x,y,0.47); f.rotation.z = rz; head.add(f);
      });
    },
    face(head){
      const metalM = L({color:0xc9ccd3}), lensM = new THREE.MeshBasicMaterial({color:0xe6eef2,transparent:true,opacity:.14});
      const gl = new THREE.Group(); gl.position.set(0,-0.09,0.56); head.add(gl);
      [-1,1].forEach(s=>{
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17,0.015,4,16), metalM); rim.scale.y = 0.84; rim.position.x = s*0.215; gl.add(rim);
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.16,14), lensM); lens.scale.y = 0.84; lens.position.set(s*0.215,0,-0.01); gl.add(lens);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.022,0.022,0.6), metalM); arm.position.set(s*0.41,0.04,-0.3); gl.add(arm);
      });
      gl.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.09,0.02,0.02), metalM),0,0.06,0));
    }
  }, parent);
  // gym arms + broad chest
  c.chest.children[0].scale.x = 1.08;
  [c.R, c.Lf].forEach(a=>{ a.sh.children[1].scale.set(1.25,1,1.25); a.el.children[0].scale.set(1.12,1,1.12); });
  // denim shorts: shins are bare skin
  c.joints.rKn.children[0].material = nwSkinM; c.joints.lKn.children[0].material = nwSkinM;
  // props
  const dumbbell = nwDumbbell(); c.R.hd.add(dumbbell);
  const barbell = nwBarbell(); c.R.hd.add(barbell);
  const chip = rbox(0.5,0.5,0.1,.2,L({map:nwChipTex})); chip.position.set(0,-0.35,0.15); c.R.hd.add(chip);
  const shaker = new THREE.Group(); c.R.hd.add(shaker);
  shaker.add(at(cyl(0.2,0.17,0.7,L({color:0xf2f2f5}),10),0,-0.3,0.15));
  shaker.add(at(cyl(0.21,0.21,0.16,L({color:0x2f6fd6}),10),0,0.08,0.15));
  c.props = {dumbbell, barbell, chip, shaker};
  // suit toggle (keeps whatever costume is on underneath)
  const suitTee = L({map:nwSuitTex}), suitFront = L({map:nwSuitFrontTex}), suitShoe = L({color:0x16161a}), suitPants = L({color:0x1d2540});
  const slots = ()=>[
    [c.chest.children[0], [suitTee,suitTee,suitTee,suitTee,suitFront,suitTee]],
    [c.R.sh.children[0], suitTee], [c.Lf.sh.children[0], suitTee], [c.R.sh.children[1], suitTee], [c.Lf.sh.children[1], suitTee],
    [c.R.el.children[0], suitTee], [c.Lf.el.children[0], suitTee],
    [c.joints.rHp.children[0], suitPants], [c.joints.lHp.children[0], suitPants], [c.joints.rKn.children[0], suitPants], [c.joints.lKn.children[0], suitPants],
    [c.joints.rKn.children[1], suitShoe], [c.joints.lKn.children[1], suitShoe],
  ];
  let saved = null;
  c.nwSuit = (on)=>{
    if (on && !saved){ saved = slots().map(([m, s])=>{ const old = m.material; m.material = s; return [m, old]; }); }
    else if (!on && saved){ saved.forEach(([m, old])=>m.material = old); saved = null; }
  };
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = nwFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = nwFaces[k]; faceM.needsUpdate = true; } };
  c.nwFaceLock = null;
  return c;
}

// ---------------- final: suit up, 護國神山 rally wave ----------------
function nwFinal(f, opp){
  f.finalT = 1.0; banner('護國神山・漲停！'); SFX.nwCash(); setTimeout(()=>SFX.horn(), 250);
  pop('西裝穿起來！', f.x, f.y+7.5, 'big');
  f.m.nwSuit(true);
  const logo = spriteOf(nwEmblemTex, 0.1); logo.position.set(f.x - f.face*3.2, f.y + 8.5, -1); scene.add(logo);
  const redM = new THREE.MeshBasicMaterial({color:0xe8202a}), wallM = new THREE.MeshBasicMaterial({color:0xff3b3b, transparent:true, opacity:.28, depthWrite:false});
  const fronts = [-1,1].map(dir=>{
    const g = new THREE.Group(); g.visible = false; scene.add(g);
    const arrows = [0,1,2,3,4].map(i=>{ const a = nwArrowMesh(2.2 + (i%2)*.8, redM); a.position.set(-dir*(i%2)*1.2, 0.3 + i*1.9, 0.5); g.add(a); return a; });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 11), wallM); wall.position.set(-dir*1.6, 5.5, 0); g.add(wall);
    return {g, arrows, dir, x:f.x};
  });
  G.finals.push({owner:f, target:opp, t:0, logo, fronts, hit:new Set(), update(F, dt){
    const s = Math.min(1, F.t/0.5); F.logo.scale.set(7*s, 7*s, 1); F.logo.material.opacity = F.t > 3.3 ? Math.max(0, 1-(F.t-3.3)*3) : 1;
    if (F.t > 0.8){
      if (!F.waved){ F.waved = true; SFX.nwRally(); G.shake = reduce ? .2 : .9; pop('+9.9%', f.x, f.y+9, 'red'); }
      for (const fr of F.fronts){
        fr.g.visible = true; fr.x += fr.dir*26*dt; fr.g.position.set(fr.x, f.y >= 0 ? 0 : f.y, 0);
        fr.arrows.forEach((a,i)=>{ a.rotation.z = -fr.dir*(0.75 + Math.sin(F.t*18 + i*1.7)*0.35); a.scale.setScalar(1 + Math.sin(F.t*20+i)*.12); });
        for (const v of G.fighters){
          if (v===f || F.hit.has(v) || !v.hittable()) continue;
          if (Math.abs(v.x - fr.x) < 2.8 && v.y < fr.g.position.y + 11 && v.y > fr.g.position.y - 3){
            F.hit.add(v); v.pct += 20; launch(v, 32 + v.pct*.12, 62, fr.dir);
            SFX.hit(42); spark(v.x, v.y+3, 4); pop('漲停！', v.x, v.y+8, 'red'); G.freeze = .12;
          }
        }
      }
    }
    return F.t > 3.6;
  }, dispose(F){ scene.remove(F.logo); F.fronts.forEach(fr=>scene.remove(fr.g)); F.owner.m.nwSuit(false); }});
}

// ---------------- results ----------------
const nwWorkerSuitM = L({color:0xf3f4f7}), nwWorkerMaskM = L({color:0x6fa6e8});
const nwWorkerFaceTex = tex(16,16,(g)=>{ g.fillStyle='#f3f4f7'; g.fillRect(0,0,16,16); g.fillStyle='#e3b48e'; g.fillRect(2,3,12,6); g.fillStyle='#1d1310'; g.fillRect(4,5,2,2); g.fillRect(10,5,2,2); g.fillStyle='#6fa6e8'; g.fillRect(2,9,12,5); });
const nwWorkerFaceM = L({map:nwWorkerFaceTex});
function nwBuildWorker(i){   // cleanroom bunny-suit fab engineer
  const g = new THREE.Group(), b = new THREE.Group(); b.scale.setScalar(SC*0.82); g.add(b);
  const up = pivot(b,0,2.4,0);
  up.add(at(rbox(1.2,1.6,0.75,.35,nwWorkerSuitM),0,0.8,0));
  up.add(at(rbox(0.95,1.0,0.92,.6,[nwWorkerSuitM,nwWorkerSuitM,nwWorkerSuitM,nwWorkerSuitM,nwWorkerFaceM,nwWorkerSuitM]),0,2.15,0));
  up.add(at(rbox(0.5,0.12,0.5,.4,L({color:[0x6fa6e8,0xf2c14e,0xff7aa8][i%3]})),0,2.66,0));   // little badge on the hood
  const legs = [-1,1].map(s=>{ const p = pivot(b,s*0.3,2.4,0); p.add(at(rbox(0.38,2.2,0.42,.4,nwWorkerSuitM),0,-1.1,0)); p.add(at(rbox(0.42,0.26,0.62,.4,nwWorkerMaskM),0,-2.25,0.1)); return p; });
  const arms = [-1,1].map(s=>{ const p = pivot(up,s*0.72,1.45,0); p.add(at(rbox(0.28,1.4,0.28,.4,nwWorkerSuitM),0,-0.65,0)); return p; });
  return {g, b, up, legs, arms};
}
function nwWinSetup(R){
  const W = R.W, wp = W.m.holder.position;
  W.m.nwSuit(true);
  R.look.set(1.5, RS_Y + 5, 0);
  const x0 = wp.x;
  const deskM = L({color:0x4a3324}), stepM = L({color:0x8a8f99});
  const stage = new THREE.Group(); stage.position.set(x0, RS_Y, -1.5); scene.add(stage); R.items.push(stage);
  stage.add(at(rbox(7,2.6,5,.08,stepM),0,1.3,0));                                    // podium
  stage.add(at(rbox(1.8,3.2,0.4,.2,L({color:0x1d1d22})),0,5.6,-1.0));                // high chair back
  stage.add(at(rbox(1.8,0.4,1.6,.2,L({color:0x1d1d22})),0,3.9,-0.2));
  stage.add(at(cyl(0.15,0.15,1.2,nwSteelM,6),0,3.2,-0.2));
  const desk = at(rbox(5.2,2.6,1.6,.06,deskM),0,3.9,1.9); stage.add(desk);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(3.2,0.8), new THREE.MeshBasicMaterial({map:nwPlateTex})); plate.position.set(0,4.4,2.72); stage.add(plate);
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(7.5,7.5), new THREE.MeshBasicMaterial({map:nwEmblemTex, transparent:true, alphaTest:.3})); wall.position.set(5.2,8.6,-4.2); stage.add(wall);
  W.m.holder.position.set(x0, RS_Y + 2.6 + 0.75, -1.7); W.m.holder.rotation.set(0, 0.1, 0);
  W.m.setFace('boss');
  R.nwWorkers = [];
  for (let i=0;i<8;i++){
    const w = nwBuildWorker(i), side = i%2 ? 1 : -1; w.side = side; w.i = i;
    w.g.position.set(x0 + side*(15 + i), RS_Y, 4.5); w.g.rotation.y = -side*Math.PI/2; scene.add(w.g); R.items.push(w.g); R.nwWorkers.push(w);
  }
}
function nwWinUpdate(R, dt, k){
  const W = R.W, x0 = W.m.holder.position.x;
  applyPose(W.m, R.t > 2.6 ? POSE.nwBossCheer : POSE.nwBoss, k);
  W.m.setFace('boss');
  once('b1', .3, ()=>{ SFX.nwCash(); popAt('我是成總了', W, 9, 'big'); });
  once('b2', 1.0, ()=>{ SFX2.cheer(); });
  once('b3', 2.2, ()=>{ SFX2.fanfare(); popAt('成總好！', W, 11, 'red'); });
  once('b4', 3.6, ()=>{ SFX2.cheer(); popAt('萬歲——！', W, 12, 'big'); });
  R.nwWorkers.forEach(w=>{
    const i = w.i, side = w.side, tx = x0 + side*(1.6 + (i>>1)*2.0), tz = 4.5 + (i>>1)%2*1.4, run0 = .5 + i*.08, arrive = 1.9 + i*.05;
    if (R.t < run0) return;
    if (R.t < arrive){
      const u = (R.t - run0)/(arrive - run0), sx = x0 + side*(15 + i);
      w.g.position.set(sx + (tx - sx)*u, RS_Y, 4.5 + (tz - 4.5)*u);
      w.legs[0].rotation.x = Math.sin(R.t*22)*.9; w.legs[1].rotation.x = -Math.sin(R.t*22)*.9;
      w.arms[0].rotation.set(0,0,-2.5); w.arms[1].rotation.set(0,0,2.5);
    } else {
      // kneel facing the boss and bow up/down
      const e = Math.min(1, (R.t - arrive)/.25);
      w.g.position.set(tx, RS_Y - 1.1*e, tz);
      w.g.rotation.y += (Math.atan2(x0 - tx, -1.5 - tz) - w.g.rotation.y)*Math.min(1, dt*12);
      w.legs.forEach(l=>l.rotation.x = 1.45*e);
      const bow = Math.max(0, Math.sin(R.t*6 + i));
      w.up.rotation.x = bow*0.9*e;
      w.arms[0].rotation.set(-2.9 + bow*1.2, 0, -0.3); w.arms[1].rotation.set(-2.9 + bow*1.2, 0, 0.3);
    }
  });
  if (R.t > 2 && Math.random() < dt*4){ const h = spriteOf(loveTex, 1.2); h.position.set(x0 + (Math.random()-.5)*10, RS_Y + 3 + Math.random()*2, 5); scene.add(h); R.puffs.push({o:h, life:1.4, vy:3, grow:.2}); }
}
function nwLoseSetup(R){
  const Lz = R.Lz, lp = Lz.m.holder.position, m = Lz.m;
  const bx = lp.x, bz = lp.z;
  const bench = new THREE.Group(); bench.position.set(bx, RS_Y, bz); scene.add(bench); R.items.push(bench);
  bench.add(at(rbox(5.6,0.45,1.5,.3,L({color:0x1c1c22})),-3.6,1.55,0));
  [-5.6,-1.8].forEach(x=>bench.add(at(rbox(0.3,1.35,0.9,.1,nwSteelM),x,0.65,0)));
  [-1,1].forEach(s=>bench.add(at(rbox(0.25,4.4,0.25,.1,nwSteelM),-5.4,2.2,s*1.9)));   // rack uprights
  // lie on the back: body up → world -x, front → world up
  const X = new THREE.Vector3(0,0,-1), Y = new THREE.Vector3(-1,0,0), Z = new THREE.Vector3(0,1,0);
  m.holder.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z));
  m.holder.position.set(bx - 0.6, RS_Y + 2.1, bz);
  const bb = nwBarbell(); bb.children.forEach(o=>o.position.x -= 0.92); bb.rotation.y = Math.PI/2; bb.position.set(bx - 4.7, RS_Y + 4.4, bz); scene.add(bb); R.items.push(bb);
  R.nwBar = bb; R.nwBarVy = 0;
  R.nwBench = {bx, bz};
}
function nwLoseUpdate(R, dt, k){
  const Lz = R.Lz, m = Lz.m, B = R.nwBench, t = R.t;
  if (t < 1.8){
    const up = (Math.sin(t*5.5 - 1.5) + 1)/2;   // rep: arms extend / lower
    applyPose(m, POSE.nwBench, 1); m.joints.rSh.rotation.x = m.joints.lSh.rotation.x = -1.0 - up*0.57; m.joints.rEl.rotation.x = m.joints.lEl.rotation.x = -1.4*(1-up);
    R.nwBar.position.y = RS_Y + 3.0 + up*1.4;
    once('n1', .3, ()=>popAt('嘿咻！', Lz, 6)); once('n2', 1.1, ()=>popAt('再一下！', Lz, 6));
  } else if (t < 2.6){
    applyPose(m, POSE.nwBench, k); m.joints.rSh.rotation.x = m.joints.lSh.rotation.x = -1.57; m.joints.rEl.rotation.x = m.joints.lEl.rotation.x = 0;
    once('ph', 1.8, ()=>{
      SFX.nwPing(); m.setFace('shock');
      const ph = spriteOf(nwPhoneTex, 3.6); ph.position.set(B.bx - 3, RS_Y + 7, B.bz + 1); scene.add(ph); R.items.push(ph); R.nwPhone = ph;
      popAt('跌停！？', Lz, 9.5, 'big');
    });
    if (R.nwPhone) R.nwPhone.position.y = RS_Y + 7 + Math.sin(t*30)*0.12;
    R.nwBar.position.y = RS_Y + 4.4 + Math.sin(t*40)*0.06;
  } else {
    once('drop', 2.6, ()=>{ m.setFace('ko'); popAt('手軟了…', Lz, 7); });
    applyPose(m, POSE.nwBenchFail, k);
    if (R.nwBar){
      const floorY = RS_Y + 2.55;
      if (R.nwBar.position.y > floorY){ R.nwBarVy -= 60*dt; R.nwBar.position.y = Math.max(floorY, R.nwBar.position.y + R.nwBarVy*dt); }
      else if (!R.nwSquashed){ R.nwSquashed = true; SFX.boom(); SFX.crash(); G.shake = reduce ? .2 : .8; popAt('壓扁了…', Lz, 6, 'big'); burst(B.bx - 4.7, RS_Y + 2.6, 0xb8bcc4, 16, 9); }
      if (R.nwSquashed) m.body.scale.z += (SC*0.35 - m.body.scale.z)*Math.min(1, dt*18);
    }
    once('soul', 3.3, ()=>{ const s = spriteOf(nwGhostTex, 3); s.material.opacity = .85; s.position.set(B.bx - 4.5, RS_Y + 3, B.bz + 0.5); scene.add(s); R.items.push(s); R.nwSoul = s; SFX2.sigh(); popAt('靈魂出竅～', Lz, 10, 'blue'); });
    if (R.nwSoul){ R.nwSoul.position.y += dt*1.6; R.nwSoul.position.x = B.bx - 4.5 + Math.sin(t*3)*0.7; }
    if (R.nwPhone) R.nwPhone.material.opacity = Math.max(0, 1 - (t-2.6)*1.5);
  }
}

// ---------------- 柚子裝（造型）：柚子皮玩偶服套在身上，露出頭和四肢，切開的柚子頂蓋在頭上 ----------------
let nwPmCache = null;
function nwPm(){   // 貼圖第一次用到才畫；前後存取亂數種子，才不會改到其他角色的貼圖
  if (nwPmCache) return nwPmCache;
  const keepSeed = seed;
  const YEL = '#ecd278', YC = ['#e2c76a','#f3dd88','#d9bd5c','#f6e49a'];
  const pores = (g,w,h)=>{ g.fillStyle = 'rgba(150,115,40,.35)'; for (let i=0;i<w*h/26;i++) g.fillRect((rnd()*w)|0,(rnd()*h)|0,1,1); };
  const body = tex(256,80,(g,w,h)=>{
    speckle(g,w,h,YEL,YC,.5); pores(g,w,h);
    g.fillStyle = 'rgba(168,120,60,.55)';                                              // 柚子皮上的咖啡色斑點
    [[92,64,6,2],[96,66,4,2],[170,60,5,2],[40,50,4,2],[212,38,5,2],[70,30,3,2]].forEach(([x,y,a,b])=>g.fillRect(x,y,a,b));
    // 臉：貼在柚子的正面（texture 中央 = 正前方）
    const ring = (x,y)=>{
      g.fillStyle = '#f4e6a0'; g.beginPath(); g.ellipse(x,y,5,4.6,0,0,7); g.fill();
      g.strokeStyle = '#5b3320'; g.lineWidth = 2; g.beginPath(); g.ellipse(x,y,5,4.6,0,0,7); g.stroke();
    };
    ring(114,27); ring(145,19);                                                        // 兩顆空心圓眼睛（右眼比較高）
    g.fillStyle = 'rgba(244,190,190,.92)';                                             // 淡粉色腮紅
    g.beginPath(); g.ellipse(108,43,5.5,3.6,0,0,7); g.fill(); g.beginPath(); g.ellipse(152,42,5.5,3.6,0,0,7); g.fill();
    g.fillStyle = '#7ec3de'; g.strokeStyle = '#4f9ab8'; g.lineWidth = 0.8;             // 右眼流下來的藍色眼淚
    g.beginPath(); g.moveTo(154,28); g.quadraticCurveTo(158.5,35,158,38); g.arc(154,38,4,0,Math.PI); g.quadraticCurveTo(149.5,35,154,28); g.fill(); g.stroke();
    g.fillStyle = '#d6f1f8'; g.fillRect(155,35,1,3);
    g.fillStyle = '#c93a20'; g.strokeStyle = '#fbf0d6'; g.lineWidth = 1;               // 紅色驚慌的「ㄇ」形嘴巴
    g.beginPath(); g.moveTo(125,57); g.bezierCurveTo(125,46,139,46,139,57); g.closePath(); g.fill(); g.stroke();
    g.fillStyle = '#a82a16'; g.fillRect(127,55,10,2);
  });
  const peel = tex(32,32,(g,w,h)=>{ speckle(g,w,h,YEL,YC,.5); pores(g,w,h); });
  seed = keepSeed;
  return (nwPmCache = { body, peel });
}
function nwPomeloSuit(c){
  const P = nwPm();
  const bodyM = L({map:P.body, side:THREE.DoubleSide}), peelM = L({map:P.peel}), pithM = L({color:0xf6f0d2});
  // 1) 藏起原本的上衣，四肢露出皮膚（袖子、短褲都換成膚色）
  c.chest.children[0].visible = false;
  [c.R, c.Lf].forEach(a=>{ a.sh.children[0].material = nwSkinM; });
  [c.joints.rHp, c.joints.lHp].forEach(j=>j.children[0].material = nwSkinM);
  // 2) 梨形柚子身體（Lathe：中間最寬，上下收窄；前後壓扁一點）
  const pts = [], N = 26, y0 = -0.8, y1 = 2.15;
  for (let i=0;i<=N;i++){
    const t = i/N;
    pts.push(new THREE.Vector2(1.1 + 0.45*Math.sin(Math.PI*Math.pow(t,0.75)) - 0.38*t*t, y0 + (y1-y0)*t));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 28, -Math.PI, Math.PI*2), bodyM);   // phiStart=-π：貼圖正中央剛好在正前方
  body.scale.z = 0.8; c.chest.add(body);
  [[1.1,y0],[0.7,y1]].forEach(([r,y])=>{                                              // 下擺和領口的白色果皮邊
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r,0.08,6,28), pithM);
    rim.scale.set(1,0.8,1); rim.rotation.x = Math.PI/2; rim.position.y = y; c.chest.add(rim);
  });
  // 3) 手臂從柚子兩側的洞伸出來：肩膀往外移，中間補一小段膚色肩膀
  c.R.sh.position.set(-1.65,1.55,0); c.Lf.sh.position.set(1.65,1.55,0);
  [-1,1].forEach(s=>{ const stub = cyl(0.3,0.26,0.62,nwSkinM,8); stub.rotation.z = Math.PI/2; stub.position.set(s*1.36,1.55,0); c.chest.add(stub); });
  // 4) 切開的柚子頂：圓頂＋白色果皮切面，歪歪蓋在頭上，頂端有小蒂頭
  const cap = new THREE.Group();
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.9,18,10,0,Math.PI*2,0,Math.PI/2), peelM); dome.scale.set(1,0.8,0.95); cap.add(dome);
  const pith = new THREE.Mesh(new THREE.CylinderGeometry(0.9,0.9,0.07,18), pithM); pith.scale.set(1,1,0.95); pith.position.y = -0.02; cap.add(pith);
  cap.add(at(cyl(0.06,0.09,0.1,L({color:0x7a5a2c}),6),0,0.72,0));
  cap.position.set(0.12,0.5,0.02); cap.rotation.set(0.1,0,-0.3);
  c.head.add(cap);
}

// 選造型頭像：歪歪的柚子頂（蓋住毛帽／頭髮）＋柚子身體白色果皮邊
function nwPomeloPortrait(g){
  g.save(); g.translate(33,14); g.rotate(-0.12);
  g.fillStyle = '#ecd278'; g.beginPath(); g.ellipse(0,2,27,17,0,Math.PI,0); g.fill();       // 圓頂
  g.fillRect(-27,2,54,4);
  g.fillStyle = '#f6e49a'; g.fillRect(-18,-9,12,2); g.fillRect(4,-12,10,2);                 // 高光
  g.fillStyle = 'rgba(168,120,60,.6)'; [[-14,-3],[8,-6],[18,0],[-4,-10]].forEach(([x,y])=>g.fillRect(x,y,3,2));   // 斑點
  g.fillStyle = '#f6f0d2'; g.fillRect(-28,5,56,4);                                          // 白色果皮切面
  g.fillStyle = '#7a5a2c'; g.fillRect(-2,-19,4,5);                                          // 蒂頭
  g.restore();
  g.fillStyle = '#ecd278'; g.fillRect(0,57,64,7);                                           // 柚子身體
  g.fillStyle = '#f6f0d2'; g.fillRect(0,55,64,3);                                           // 領口果皮邊
  g.fillStyle = 'rgba(168,120,60,.55)'; g.fillRect(10,61,3,2); g.fillRect(48,60,3,2);
}
// ---------------- register ----------------
registerChar('newton', {
  stats: { name:'成自然', en:'Newton', tag:'健身・電機・半導體・存股', weight:1.15, run:13, air:10.5, jumpV:29, djV:25, jumps:2 },
  skins: [{ name:'冬季紅外套', apply(c){
    const jM = L({map:nwJacketTex}), knitM = L({map:nwKnitTex}), hoodM = L({map:nwHoodTex}), pantsM = L({color:0x3a3f4a});
    c.chest.children[0].material = [jM,jM,jM,jM,L({map:nwJacketFrontTex}),jM];
    [c.R, c.Lf].forEach(a=>{ a.sh.children[0].material = jM; a.sh.children[1].material = jM; a.el.children[0].material = jM; a.el.children[0].scale.set(1.25,1,1.25); });
    [c.joints.rHp, c.joints.lHp, c.joints.rKn, c.joints.lKn].forEach(j=>j.children[0].material = pantsM);
    c.chest.add(at(rbox(1.3,0.6,0.55,.45,hoodM),0,2.15,-0.5));                          // grey hoodie hood out the back
    c.chest.add(at(rbox(1.0,0.22,0.95,.4,hoodM),0,2.3,-0.05));                          // hoodie collar
    const hat = new THREE.Group(); c.head.add(hat);
    hat.add(at(rbox(1.24,0.6,1.22,.62,knitM),0,0.66,-0.02));
    hat.add(at(rbox(1.28,0.24,1.26,.45,knitM),0,0.42,-0.02));
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.26,8,6), knitM); pom.position.set(0,1.05,0); hat.add(pom);
  },
    portrait(g){                                                                    // 粉褐色毛帽蓋住頭髮 + 紅色外套
      g.fillStyle = '#c79a98'; g.fillRect(3,5,58,11); g.fillRect(0,13,64,6);
      g.fillStyle = 'rgba(120,70,70,.3)'; for (let x=5;x<59;x+=4) g.fillRect(x,5,1,8);
      g.fillStyle = '#d6aba8'; g.beginPath(); g.arc(32,5,5,0,7); g.fill();           // 毛球
      g.fillStyle = '#d8262b'; g.fillRect(0,54,64,10);
      g.fillStyle = '#9b9ea6'; g.fillRect(24,54,16,5);                               // 帽 T 的領子
      g.fillStyle = '#bd1b20'; g.fillRect(30,58,4,6);
    } },
  { name:'生日帽', hat:['#ff8f6b','#ffe066','#7fd0ff'], apply(c){ const h = birthdayHat('#ff8f6b','#ffe066',0x7fd0ff); h.position.set(0.05,0.68,-0.02); c.head.add(h); } },
  { name:'柚子裝', apply: nwPomeloSuit, portrait: nwPomeloPortrait }],
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.5], dmg:7, kb:9, sc:.75, ang:38, text:'肌肉！'},
    side:{t:[.28,.1,.34], pose:['batWind','batHit'], box:[2.8,3.4,1.7], dmg:16, kb:12, sc:1.12, ang:36, prop:'dumbbell', sfx:'swing', armor:1, text:'啞鈴！'},
    up:{t:[.18,.14,.32], pose:['upWind','upHit'], box:[0.4,6.8,2.3], dmg:13, kb:11, sc:1, ang:88, prop:'barbell', sfx:'swing', text:'肩推！'},
    down:{t:[.22,.12,.32], pose:['nwSquatDown','squat'], box:[0,1.2,3.3], dmg:12, kb:10, sc:.85, ang:62, fire:[[.22,'nwQuake']], text:'深蹲震地！'},
    nair:{t:[.06,.2,.15], pose:['nwFlex','nwFlex'], box:[0,3,2.2], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.2,3.4,1.5], dmg:10, kb:8, sc:.9, ang:40, air:1, prop:'dumbbell'},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1, prop:'dumbbell'},
    nB:{t:[.18,.05,.28], pose:['throwWind','throwHit'], prop0:'chip', fire:[[.18,'nwChip']], air:1, sfx:'swing'},
    sB:{t:[.12,.28,.3], pose:['sprint','punch2'], poseSwitch:.25, box:[1.8,3.6,1.5], dmg:9, kb:7, sc:.45, ang:40, dash:24, air:1, onHit:'nwTrapped', text:'追高！'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, start:'nwRally', box:[0.4,5,1.8], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1, text:'漲停板！'},
    dB:{t:[.15,.6,.25], pose:['nwDrink','nwFlex'], poseSwitch:.45, prop:'shaker', fire:[[0,'nwProtein']], armor:1, air:1, text:'喝高蛋白！'},
  },
  fire: {
    nwChip(f){
      [0,1].forEach(i=>proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.3 + i*.5, vx:f.face*(26 - i*4), vy:i*2, g:0, r:.8, life:1.0, dmg:6, kb:6, sc:.5, ang:40, spin:1, mesh:rbox(0.9,0.9,0.15,.15,L({map:nwChipTex}))}));
      pop('3奈米！', f.x, f.y+7);
    },
    // 下必殺：放 fire 時間 0，不放 start —— core 會讓有 start hook 的招式前 .32 秒強制上浮
    nwProtein(f){ f.buffT = 6; f.buffDmg = 1.3; pop('肌力 +30%', f.x, f.y+8.5, 'red'); SFX.nwCash(); },
    nwQuake(f){ SFX.boom(); G.shake = Math.max(G.shake, reduce ? .1 : .45); burst(f.x - 2, f.y+0.4, 0xc9b79a, 8, 8); burst(f.x + 2, f.y+0.4, 0xc9b79a, 8, 8); },
  },
  start: {
    nwRally(f){ f.vy = 33; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; burst(f.x, f.y+1, 0xff3b3b, 12, 10); SFX.nwCash(); },
  },
  onhit: { nwTrapped(att, v){ v.state = 'stun'; v.stunT = .7; v.move = null; pop('被套牢了！', v.x, v.y+7.5, 'blue'); } },
  poses: {
    nwFlex: S_({rSh:[0,0,-1.45], lSh:[0,0,1.45], rEl:[0,0,-1.6], lEl:[0,0,1.6], chest:[-0.1], head:[-0.1], drop:-0.1}),
    nwDrink: S_({rSh:[-1.7,0,0.35], rEl:[-1.85], lSh:[0,0,0.5], lEl:[-0.3], head:[-0.45], chest:[-0.15], drop:-0.05}),
    nwSquatDown: S_({rHp:[-1.1], lHp:[-1.1], rKn:[1.5], lKn:[1.5], chest:[0.5], rSh:[-1.3,0,-0.1], lSh:[-1.3,0,0.1], rEl:[-0.3], lEl:[-0.3], drop:-1.3}),
    nwPoint: S_({rSh:[-1.6,0,-0.1], rEl:[0], lSh:[0,0,0.3], lEl:[-2.0], chest:[0.05,0.3,0], head:[-0.1], hR:'thumb', drop:0}),
    nwBoss: P({rHp:[-1.55,0,-0.2], lHp:[-1.55,0,0.2], rKn:[1.55], lKn:[1.55], rSh:[-0.9,0,-0.3], lSh:[-0.9,0,0.3], rEl:[-1.2], lEl:[-1.2], chest:[0.05], head:[-0.1], drop:-1.0}),
    nwBossCheer: P({rHp:[-1.55,0,-0.2], lHp:[-1.55,0,0.2], rKn:[1.55], lKn:[1.55], rSh:[-2.9,0,-0.4], lSh:[-0.9,0,0.3], rEl:[-0.2], lEl:[-1.2], chest:[-0.1], head:[-0.25], hR:'thumb', drop:-1.0}),
    nwBench: P({rSh:[-1.57,0,-0.12], lSh:[-1.57,0,0.12], rHp:[-0.2,0,-0.25], lHp:[-0.2,0,0.25], rKn:[1.5], lKn:[1.5], head:[0.1]}),
    nwBenchFail: P({rSh:[-0.4,0,-0.9], lSh:[-0.4,0,0.9], rEl:[-0.2], lEl:[-0.2], rHp:[-0.2,0,-0.4], lHp:[-0.2,0,0.4], rKn:[1.3], lKn:[1.3], head:[0,0,0.4]}),
  },
  sfx: {
    nwCash(){ tone(1568,.07,'square',.07); tone(2093,.25,'triangle',.1,1,.07); },
    nwPing(){ tone(1319,.12,'sine',.12); tone(988,.3,'sine',.12,1,.14); },
    nwRally(){ [0,4,7,12,16].forEach((n,i)=>tone(NOTE(n+5), .14, 'sawtooth', .07, 1, i*.07)); noise(.6,.2,900); },
  },
  build: buildNewton, face: nwFaces.normal, portraitBg: '#d6141e',
  portrait(g){
    g.fillRect(6,4,52,12); g.fillRect(3,9,9,24); g.fillRect(52,9,9,24);
    g.beginPath(); g.moveTo(8,14); g.lineTo(56,14); g.lineTo(55,32); g.lineTo(49,29); g.lineTo(44,33); g.lineTo(38,29); g.lineTo(32,33); g.lineTo(26,29); g.lineTo(20,33); g.lineTo(14,29); g.lineTo(9,32); g.closePath(); g.fill();
    g.strokeStyle = '#d4d7de'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(22,42,7,6,0,0,7); g.stroke(); g.beginPath(); g.ellipse(42,42,7,6,0,0,7); g.stroke(); g.beginPath(); g.moveTo(29,41); g.lineTo(35,41); g.stroke();
  },
  shield(){ const t = L({map:nwWaferTex}); const m = new THREE.Mesh(new THREE.CylinderGeometry(2.7,2.7,0.14,28), [nwSteelM, t, t]); return m; },
  shieldAnim(f){ const sm = f.shieldMesh; sm.rotation.order = 'YXZ'; sm.rotation.set(Math.PI/2, f.face*0.5, 0); sm.position.set(f.x + f.face*1.3, f.y+3.4, 1.0); },
  shieldPose: 'shieldW', breakText: '晶圓碎了！', breakColor: 0xb8a6e6,
  finalPose: 'nwPoint',
  animate(f, m, s, t, dt){
    if (f.buffT > 0) f.buffT = Math.max(0, f.buffT - dt);
    const big = f.buffT > 0 ? 1.6 : 1.25;
    [m.R, m.Lf].forEach(a=>{ const u = a.sh.children[1].scale; u.x += (big - u.x)*Math.min(1, dt*8); u.z = u.x; });
  },
  introPose: 'nwFlex', readyPose: (t)=> Math.sin(t*8) > 0 ? POSE.nwFlex : POSE.cheer, selectSfx: ()=>SFX.nwCash(),
  winSub: '"Buy the dip."',
  final: nwFinal, winSetup: nwWinSetup, winUpdate: nwWinUpdate, loseSetup: nwLoseSetup, loseUpdate: nwLoseUpdate,
  longWin: true, longLose: true,
});
