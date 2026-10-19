/* TEMPLATE — copy to characters/<kind>.js, rename everything "xx", then add a <script> tag in index.html.
   Not loaded by the game. Every hook below is optional unless marked REQUIRED. */
'use strict';

// ---- textures (64×64 face, 32×32 cloth). Face modes used by core: normal, cry (+ any of your own) ----
const XX_SKIN = '#d0a07c', XX_SKIN_C = ['#c8966f','#dcae8a'];
const xxSkinTex = tex(16,16,(g)=>speckle(g,16,16,XX_SKIN,XX_SKIN_C,.4));
function xxFace(g, mode){
  speckle(g,64,64,XX_SKIN,XX_SKIN_C,.35); shadeFace(g);
  g.fillStyle='#1d1512'; g.fillRect(14,25,11,2); g.fillRect(39,25,11,2);            // brows (y≈25; fringe usually covers above)
  g.strokeStyle='#1d1310'; g.lineWidth=2;
  if (mode==='cry'){ g.beginPath(); g.moveTo(15,35); g.lineTo(25,35); g.stroke(); g.beginPath(); g.moveTo(39,35); g.lineTo(49,35); g.stroke(); g.fillStyle='rgba(150,205,255,.9)'; g.fillRect(17,37,3,15); g.fillRect(44,37,3,15); }
  else { g.beginPath(); g.arc(20,37,5,Math.PI*1.15,Math.PI*1.85); g.stroke(); g.beginPath(); g.arc(44,37,5,Math.PI*1.15,Math.PI*1.85); g.stroke(); }   // eyes y≈37
  g.fillStyle='#4a1715'; g.fillRect(26,49,12,3);                                     // mouth y≈49
}
const xxFaces = { normal:tex(64,64,(g)=>xxFace(g,'normal')), cry:tex(64,64,(g)=>xxFace(g,'cry')) };
const xxShirtTex = tex(32,32,(g)=>speckle(g,32,32,'#335577',['#3a5f84','#2c4c6a'],.45));
const xxPantsTex = tex(32,32,(g)=>speckle(g,32,32,'#2a2a30',['#33333a','#222228'],.5));

// ---- model (REQUIRED). buildChar makes the jointed body; you add hair, glasses, props ----
function buildXx(parent){
  const hairM = L({map:blackHairTex}), faceM = L({map:xxFaces.normal}), skinM = L({map:xxSkinTex}), shirtM = L({map:xxShirtTex});
  const c = buildChar({
    skinM, faceM, headW:1.0, headH:1.15,
    torsoMat:shirtM, sleeveMat:()=>shirtM, sleeve:[0.64,0.85],        // torsoMat can be a 6-material array [+x,-x,+y,-y,front,back]
    pantsM:L({map:xxPantsTex}), shoeM, soleM:greySole,
    collar(chest){},                                                   // collar / lanyard / backpack straps
    hair(head){ head.add(at(rbox(1.14,0.56,1.14,.62,hairM),0,0.47,-0.02)); head.add(at(rbox(1.1,1.0,0.56,.6,hairM),0,0.06,-0.3)); },
    face(head){},                                                      // glasses etc.
  }, parent);
  // c.root.scale.set(1.15,1.1,1.15);   // bigger body
  // props in the right hand point down -y from c.R.hd; c.props names are what moves use in prop:/prop0:
  const stick = new THREE.Group(); stick.add(at(cyl(0.07,0.07,2.4,L({color:0x8a6a44}),6),0,-1.2,0)); c.R.hd.add(stick);
  c.props = {stick};
  c.setOld = ()=>{};
  let faceNow = 'normal';
  c.setFace = (f)=>{ const k = xxFaces[f] ? f : 'normal'; if (k!==faceNow){ faceNow = k; faceM.map = xxFaces[k]; faceM.needsUpdate = true; } };
  return c;
}

// ---- ultimate (REQUIRED). Push one entry into G.finals; update returns true when finished ----
function xxFinal(f, opp){
  f.finalT = 1.2; banner('大招名稱！'); SFX.boom(); pop('台詞', f.x, f.y+7.5, 'big');
  const mesh = new THREE.Group(); mesh.add(rbox(3,3,3,.5,L({color:0xffcc00}))); scene.add(mesh);
  G.finals.push({owner:f, target:opp, t:0, mesh, x:f.x, update(F, dt){
    F.x += f.face*20*dt; F.mesh.position.set(F.x, 2, 0);
    const v = F.target;
    if (!F.hit && v.hittable() && Math.abs(v.x - F.x) < 3 && v.y < 6){ F.hit = true; v.pct += 15; launch(v, 30 + v.pct*.11, 45, f.face); SFX.hit(40); spark(v.x, v.y+3, 4); }
    return F.t > 2;                                                    // mesh is removed automatically (or give dispose(F))
  }});
}

// ---- results: R.W winner, R.Lz loser, R.t time; add scene objects to R.items, model attachments to R.attach ----
function xxWinSetup(R){ }
function xxWinUpdate(R, dt, k){ applyPose(R.W.m, Math.sin(R.t*10) > 0 ? POSE.cheer : POSE.laugh, k); once('w1', .4, ()=>popAt('贏了！', R.W, 8.5, 'big')); }
function xxLoseSetup(R){ }
function xxLoseUpdate(R, dt, k){ applyPose(R.Lz.m, POSE.sob, k); R.Lz.m.setFace('cry'); }

registerChar('xx', {
  stats: { name:'中文名', en:'English', tag:'特色・特色・特色', weight:1.0, run:14, air:11, jumpV:30, djV:26, jumps:2 },   // light .85 / heavy 1.4; run 11 slow – 16 fast; jumpV 26 low – 33 high
  // t:[startup, active, recovery] s · box:[forward, height, radius] · ang: launch angle (negative = spike) · kb base knockback · sc knockback growth
  // optional: prop/prop0 (prop0 = before startup), fire:[[time,'fireName']], start:'startName', onHit:'onhitName', dash, hop, armor, helpless, air,
  //           text, textCls ('big'|'red'|'blue'), sfx, poseSwitch, box2:{at,dur,box,dmg,kb,sc,ang}, cry
  moves: {
    jab1:JAB1, jab2:JAB2,
    jab3:{t:[.1,.1,.28], pose:['jabR','punch2'], box:[2.0,3.8,1.4], dmg:6, kb:8, sc:.7, ang:38, text:'台詞！'},
    side:{t:[.25,.1,.32], pose:['batWind','batHit'], box:[2.8,3.4,1.7], dmg:15, kb:12, sc:1.1, ang:36, prop:'stick', sfx:'swing'},
    up:{t:[.16,.12,.3], pose:['upWind','upHit'], box:[0.5,6.6,1.8], dmg:12, kb:11, sc:1, ang:88},
    down:{t:[.2,.1,.3], pose:['bookUp','bookSlam'], box:[1.9,0.9,1.7], dmg:11, kb:9, sc:.85, ang:70},
    nair:{t:[.06,.2,.15], pose:['nair','nair'], box:[0,3,2.1], dmg:7, kb:6, sc:.6, ang:45, air:1},
    fair:{t:[.1,.1,.2], pose:['jabR','fair'], box:[2.1,3.4,1.4], dmg:9, kb:8, sc:.9, ang:40, air:1},
    uair:{t:[.1,.12,.2], pose:['air','block'], box:[0.3,6.4,1.6], dmg:8, kb:8, sc:.8, ang:85, air:1},
    dair:{t:[.18,.1,.25], pose:['spikeWind','spikeHit'], box:[0.6,0.4,1.7], dmg:12, kb:7, sc:.8, ang:-65, air:1},
    nB:{t:[.2,.05,.28], pose:['throwWind','throwHit'], fire:[[.2,'xxShot']], air:1, sfx:'swing'},
    sB:{t:[.12,.25,.3], pose:['sprint','sprint'], box:[1.8,3.6,1.4], dmg:8, kb:6, sc:.4, ang:40, dash:24, air:1, onHit:'xxDizzy'},
    uB:{t:[.05,.55,.1], pose:['setUp','upHit'], poseSwitch:.3, start:'xxUp', box:[0.4,5,1.7], dmg:7, kb:8, sc:.5, ang:80, helpless:1, air:1},   // recovery
    dB:{t:[.15,.5,.3], pose:['guitar','guitar'], box:[1.6,3.8,2.6], dmg:5, kb:3, sc:.2, ang:50, air:1, text:'下必殺！'},
  },
  fire: { xxShot(f){ proj({owner:f, x:f.x+f.face*1.6, y:f.y+4.4, vx:f.face*22, vy:0, g:0, r:.9, life:1.1, dmg:6, kb:6, sc:.5, ang:40, mesh:spriteOf(starTex,1.4)}); } },
  start: { xxUp(f){ f.vy = 32; f.vx = f.face*6; f.onGround = false; f.jumps = 0; f.ff = false; } },
  onhit: { xxDizzy(att, v){ v.state = 'stun'; v.stunT = .6; v.move = null; pop('暈了', v.x, v.y+7.5, 'blue'); } },
  // poses: { myPose: S_({...}) },  sfx: { mySound(){ tone(440,.2,'square',.1); } },
  build: buildXx, face: xxFaces.normal, portraitBg: '#7fb8e0',
  portrait(g){ g.fillRect(4,4,56,18); },                               // draw hair over the 64×64 portrait (fillStyle is already dark)
  shieldPose: 'shieldW', shieldProp: null, breakText: '破防了！',        // shield look; also shield(), shieldAnim(f), brokePose
  finalPose: 'cheer', finalProp: null,
  // animate(f, m, s, t, dt){},   oldTarget(f, s){ return 0; },   onSpawn(f){},
  introPose: 'peace', readyPose: (t)=> Math.sin(t*12) > 0 ? POSE.cheer : POSE.laugh, selectSfx: ()=>SFX.whistle(),
  winSub: '"English catchphrase"',
  final: xxFinal, winSetup: xxWinSetup, winUpdate: xxWinUpdate, loseSetup: xxLoseSetup, loseUpdate: xxLoseUpdate,
  longWin: false, longLose: false,                                     // true = results animation needs ~6 s
});
