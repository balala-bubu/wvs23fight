/* map: sea — loaded after js/core.js and the characters */
'use strict';
/* --- map 3: under the sea --- */
const seaSkyTex = tex(4,64,(g)=>{
  const gr=g.createLinearGradient(0,0,0,64);
  gr.addColorStop(0,'#7fd6e8'); gr.addColorStop(.3,'#2f9bc0'); gr.addColorStop(.6,'#17607f'); gr.addColorStop(1,'#0b3048');
  g.fillStyle=gr; g.fillRect(0,0,4,64);
});
seaSkyTex.magFilter = THREE.LinearFilter;
const sandTex = tex(32,32,(g)=>{ speckle(g,32,32,'#d8c48e',['#e6d4a0','#c9b37c','#efe0b4','#bfa66e'],.6); for(let i=0;i<6;i++){ g.fillStyle='#f6eee0'; g.fillRect((rnd()*30)|0,(rnd()*30)|0,2,1); } },[60,60]);
const sandTopTex = tex(32,32,(g)=>{ speckle(g,32,32,'#dcc896',['#e8d8a8','#ccb680','#f0e2b8'],.6); g.fillStyle='rgba(150,120,70,.25)'; for(let y=3;y<32;y+=6) for(let x=0;x<32;x++) g.fillRect(x,y+((Math.sin(x*.6)*1.5)|0),1,1); },[8,2]);
const reefTex = tex(32,32,(g)=>{ speckle(g,32,32,'#c86a6a',['#d9807a','#b35858','#e09a8a','#8a4a5a'],.6); for(let i=0;i<30;i++){ g.fillStyle=['#f2c14e','#7fd0a0','#f4f0e6'][(rnd()*3)|0]; g.fillRect((rnd()*32)|0,(rnd()*32)|0,1,1); } },[6,1]);
const bubbleTex = tex(16,16,(g)=>{ g.strokeStyle='#e8fbff'; g.lineWidth=1.5; g.beginPath(); g.arc(8,8,6,0,7); g.stroke(); g.fillStyle='rgba(232,251,255,.25)'; g.beginPath(); g.arc(8,8,5,0,7); g.fill(); g.fillStyle='#fff'; g.fillRect(5,4,2,2); });
const rayTex = tex(8,64,(g)=>{ const gr=g.createLinearGradient(0,0,0,64); gr.addColorStop(0,'rgba(220,250,255,.55)'); gr.addColorStop(1,'rgba(220,250,255,0)'); g.fillStyle=gr; g.fillRect(0,0,8,64); });
rayTex.magFilter = THREE.LinearFilter;
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(500,500), L({map:sandTex})); floor.rotation.x = -Math.PI/2; floor.position.y = -26; g.add(floor);
  const topM = L({map:sandTopTex}), sideM = L({map:reefTex}), underM = L({map:rockTex});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), underM); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-15,x2:-7,y:7}, {x1:7,x2:15,y:7}, {x1:-3.5,x2:3.5,y:13} ];
  const coralTopM = L({color:0xf09a8a});
  plats.forEach(p=>addPlatform(g,p,coralTopM,sideM,underM));
  const clock0 = performance.now();
  const now = ()=> (performance.now() - clock0)/1000;
  // swaying seaweed
  const weedM = [L({color:0x3f8a4a}), L({color:0x2e6f3c}), L({color:0x5aa85a})];
  const weed = (x, z, h, base)=>{
    const root = new THREE.Group(); root.position.set(x, base, z); g.add(root);
    let parent = root; const segs = [];
    for (let i=0;i<h;i++){ const sg = new THREE.Group(); sg.position.y = i ? 1.2 : 0; parent.add(sg); sg.add(at(rbox(0.35,1.3,0.15,.5,weedM[(i+(x|0))%3]),0,0.6,0)); segs.push(sg); parent = sg; }
    const ph = Math.random()*6;
    segs[0].children[0].onBeforeRender = ()=>{ const t = now(); segs.forEach((sg,i)=>{ sg.rotation.z = Math.sin(t*1.4 + ph + i*.5)*.13; }); };
  };
  [[-W+1.5,-3],[-W+3,-3.6],[W-1.6,-3.2],[W-3.2,-3.8],[-9,-3.6],[10,-3.4]].forEach(([x,z],i)=>weed(x,z,4+i%3,0));
  for (let i=0;i<26;i++) weed(-110 + rnd()*220, -30 - rnd()*70, 6 + ((rnd()*8)|0), -26);
  // corals
  const coralCols = [0xff6f61,0xffb347,0xc77dff,0x5fd3c8,0xff8fb1];
  for (let i=0;i<30;i++){
    const x = -120 + rnd()*240, z = -28 - rnd()*80, col = coralCols[i%5], cm = L({color:col});
    const c = new THREE.Group(); c.position.set(x,-26,z); g.add(c);
    const n = 3 + ((rnd()*4)|0);
    for (let k=0;k<n;k++){ const b = cyl(0.5,0.9,4+rnd()*6,cm,6); b.position.set((rnd()-.5)*4, 2.5, (rnd()-.5)*3); b.rotation.set((rnd()-.5)*.8,0,(rnd()-.5)*.9); c.add(b); }
    if (i%3===0) c.add(at(new THREE.Mesh(new THREE.SphereGeometry(2.4,8,6), L({color:coralCols[(i+2)%5]})),0,1.2,0));
  }
  // sunken ship
  const wreck = new THREE.Group(); wreck.position.set(-48,-24,-95); wreck.rotation.set(0,.4,.22); g.add(wreck);
  const woodM = L({color:0x5a3f28}), darkM = L({color:0x3a2818});
  wreck.add(at(rbox(30,7,9,.4,woodM),0,2,0));
  wreck.add(at(rbox(10,4,8,.3,darkM),-9,7,0));
  const mast = cyl(.5,.6,22,darkM,6); mast.position.set(3,14,0); mast.rotation.z = -.35; wreck.add(mast);
  // giant clam on the far floor
  const bigClam = clamMesh(10); bigClam.position.set(55,-23,-80); g.add(bigClam);
  // light rays from the surface
  const rayM = new THREE.MeshBasicMaterial({map:rayTex, transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, fog:false, side:THREE.DoubleSide});
  for (let i=0;i<7;i++){ const r = new THREE.Mesh(new THREE.PlaneGeometry(6+rnd()*6,90), rayM); r.position.set(-60 + i*20 + rnd()*8, 18, -40 - rnd()*30); r.rotation.z = .25; g.add(r); }
  // fish schools circling in the background
  const schoolCols = [0xffd23f,0x6fd3ff,0xff7a4a];
  for (let s=0;s<3;s++){
    const sch = new THREE.Group(); sch.position.set(-40 + s*40, 4 + s*5, -55 - s*12); g.add(sch);
    const R = 14 + s*4, sp = .25 + s*.07, dir = s%2 ? -1 : 1;
    for (let k=0;k<9;k++){ const f = fishMesh(1.1, schoolCols[s]); f.position.set((k%3)*1.6, ((k/3)|0)*1.2, (k%2)*1.4); sch.add(f); }
    const holder = sch.children[0].children[0];
    holder.frustumCulled = false;
    holder.onBeforeRender = ()=>{ const a = now()*sp*dir + s*2; sch.position.x = -40 + s*40 + Math.cos(a)*R; sch.position.z = -55 - s*12 + Math.sin(a)*R*.4; sch.rotation.y = -a*1 - dir*Math.PI/2; };
  }
  // rising bubbles
  const bubbles = [];
  for (let i=0;i<40;i++){ const b = spriteOf(bubbleTex, .5 + rnd()*1.2); b.material.fog = true; b.position.set(-60 + rnd()*120, -26 + rnd()*70, -8 - rnd()*60); g.add(b); bubbles.push({o:b, sp:2 + rnd()*4, ph:rnd()*6}); }
  let lastT = now();
  bubbles[0].o.frustumCulled = false;
  bubbles[0].o.onBeforeRender = ()=>{ const t = now(), d = Math.min(.05, t - lastT); lastT = t;
    bubbles.forEach(b=>{ b.o.position.y += b.sp*d; b.o.position.x += Math.sin(t*2 + b.ph)*d*.6; if (b.o.position.y > 46) b.o.position.y = -26; }); };
  registerMap('sea', { name:'海底王國', group:g, W, plats, sky:seaSkyTex, fog:0x1d6a8a, fogNear:45, fogFar:170, hemi:[0x9fe8ff,0x1a3a4a], sun:0xbfefff, rim:0x6fd3ff });
}
