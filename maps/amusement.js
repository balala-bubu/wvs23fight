/* map: amusement — 遊樂園（摩天輪會轉、雲霄飛車會跑、氣球往上飄、燈泡閃爍） */
'use strict';
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const GY = -10;                                   // 背景地面高度

  /* --- 貼圖 --- */
  const skyT = tex(4,64,(c)=>{ const gr = c.createLinearGradient(0,0,0,64);
    gr.addColorStop(0,'#2e3166'); gr.addColorStop(.5,'#6a4f7e'); gr.addColorStop(.8,'#b0707a'); gr.addColorStop(1,'#d39a74');
    c.fillStyle = gr; c.fillRect(0,0,4,64); });
  skyT.magFilter = THREE.LinearFilter;
  const groundT = tex(32,32,(c)=>speckle(c,32,32,'#4f5a46',['#58644e','#465040'],.5),[50,50]);
  const stripeT = (a,b)=>tex(16,4,(c)=>{ for(let i=0;i<16;i++){ c.fillStyle = (i>>1)%2 ? a : b; c.fillRect(i,0,1,4); } });
  const tentRed = stripeT('#c8484a','#e8dcc8'), tentBlue = stripeT('#3f6ab0','#e8dcc8');
  const stageTopT = tex(32,8,(c)=>{ for(let i=0;i<32;i++){ c.fillStyle = (i>>2)%2 ? '#f7d9a2' : '#f2b28a'; c.fillRect(i,0,1,8); } },[6,1]);

  /* --- 背景地面 --- */
  const far = new THREE.Mesh(new THREE.PlaneGeometry(600,600), L({map:groundT, color:0x9a9a9a}));
  far.rotation.x = -Math.PI/2; far.position.y = GY; g.add(far);

  /* --- 主舞台與平台（最亮的暖色） --- */
  const topM = L({map:stageTopT}), sideM = L({color:0x9c5a48}), lipM = L({color:0xf4e2b4});
  const coneM = L({color:0x4a3438});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  g.add(at(rbox(W*2+0.9,0.22,0.35,.05,lipM),0,-0.04,4.4));                // 前緣亮邊
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), coneM); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-16,x2:-8,y:7.5}, {x1:8,x2:16,y:7.5}, {x1:-3.5,x2:3.5,y:13} ];
  const pTop = L({color:0xf6c45a}), pSide = L({color:0xa8603a});
  plats.forEach(p=>{
    addPlatform(g,p,pTop,pSide,coneM);
    const w = p.x2-p.x1, cx = (p.x1+p.x2)/2;
    g.add(at(rbox(w+0.15,0.14,0.3,.04,lipM),cx,p.y+0.01,1.95));
    g.add(at(rbox(w+0.15,0.14,0.3,.04,lipM),cx,p.y+0.01,-1.95));
  });

  /* --- 摩天輪（左後方） --- */
  const FW = { x:-24, y:9, z:-58, R:17 };
  const steelM = L({color:0x7c7a8e}), hubM = L({color:0x5a5870});
  [-1,1].forEach(s=>{                                                     // A 字支架
    [-1,1].forEach(side=>{
      const len = Math.hypot(9, FW.y-GY);
      const leg = cyl(0.45,0.55,len,steelM,6);
      leg.position.set(FW.x+side*4.5, (FW.y+GY)/2, FW.z+s*2.2);
      leg.rotation.z = side*Math.atan2(9,FW.y-GY); g.add(leg);
    });
  });
  const wheel = new THREE.Group(); wheel.position.set(FW.x,FW.y,FW.z); g.add(wheel);
  [-1.6,1.6].forEach(dz=>{ const rim = new THREE.Mesh(new THREE.TorusGeometry(FW.R,0.32,6,56), steelM); rim.position.z = dz; wheel.add(rim);
    const inner = new THREE.Mesh(new THREE.TorusGeometry(FW.R*0.55,0.2,6,40), steelM); inner.position.z = dz; wheel.add(inner); });
  const hub = cyl(1.4,1.4,4,hubM,12); hub.rotation.x = Math.PI/2; wheel.add(hub);
  const NG = 12, gondolas = [], bulbs = [];
  const gCols = [0xc85a5a,0xd8a040,0x5a9ac8,0x7ab060,0xb070b8,0xe08a60];
  for(let i=0;i<NG;i++){
    const a = i/NG*Math.PI*2;
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.25,FW.R,0.25), steelM);
    sp.position.set(Math.cos(a)*FW.R/2, Math.sin(a)*FW.R/2, 0); sp.rotation.z = a - Math.PI/2; wheel.add(sp);
    const piv = new THREE.Group(); piv.position.set(Math.cos(a)*FW.R, Math.sin(a)*FW.R, 0); wheel.add(piv);
    const cab = new THREE.Group(); piv.add(cab);
    const cm = L({color:gCols[i%gCols.length]});
    cab.add(at(cyl(0.08,0.08,1.2,steelM,4),0,-0.6,0));
    cab.add(at(rbox(2.4,2.0,2.2,.35,cm),0,-2.0,0));
    cab.add(at(rbox(2.6,0.3,2.4,.1,cm),0,-0.9,0));
    gondolas.push(cab);
  }
  for(let i=0;i<36;i++){                                                  // 輪框燈泡
    const a = i/36*Math.PI*2;
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.32,6,4), new THREE.MeshBasicMaterial({color:0xd8c070}));
    b.position.set(Math.cos(a)*FW.R, Math.sin(a)*FW.R, 1.9); wheel.add(b); bulbs.push(b);
  }

  /* --- 雲霄飛車（右後方） --- */
  const pts = [[4,-6,-72],[10,16,-74],[15,19,-73],[20,8,-71],[25,-4,-70],[31,-2,-71],[36,13,-74],[41,15,-74],
               [46,6,-73],[48,-4,-76],[44,-7,-84],[32,-5,-88],[20,-7,-88],[8,-7,-82]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.4);
  const railM = L({color:0xb04a50}), postM = L({color:0x6a6878});
  [-0.7,0.7].forEach(off=>{
    const rp = curve.getSpacedPoints(200).map(p=>p.clone().add(new THREE.Vector3(0,off*0.3,off)));
    const rc = new THREE.CatmullRomCurve3(rp.slice(0,-1), true);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(rc,240,0.22,5,true), railM));
  });
  for(let i=0;i<34;i++){                                                  // 支柱
    const p = curve.getPointAt(i/34); const h = p.y - GY; if(h < 1) continue;
    const post = cyl(0.18,0.22,h,postM,5); post.position.set(p.x,GY+h/2,p.z); g.add(post);
  }
  const train = [], carCols = [0xe0c050,0x58a0c8,0xe0c050,0x58a0c8];
  for(let i=0;i<4;i++){
    const car = new THREE.Group(); g.add(car);
    const m = L({color:carCols[i]});
    car.add(at(rbox(1.7,1.0,2.6,.3,m),0,0.7,0));
    car.add(at(rbox(1.2,0.5,0.25,.1,L({color:0x403848})),0,1.3,0.9));
    train.push(car);
  }

  /* --- 中景：帳篷攤位 --- */
  [[-33,-30,tentRed],[-17,-36,tentBlue],[17,-34,tentRed],[33,-30,tentBlue],[0,-44,tentRed]].forEach(([x,z,t],i)=>{
    const m = L({map:t, color:0x9a9090});
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4,4,5,16,1,true), m); base.position.set(x,GY+2.5,z); g.add(base);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(5,4.5,16), m); roof.position.set(x,GY+7.2,z); g.add(roof);
    g.add(at(cyl(0.08,0.08,1.5,steelM,4),x,GY+10.1,z));
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.2,0.7), L({color:i%2?0xd8b040:0xc85050, side:THREE.DoubleSide}));
    flag.position.set(x+0.6,GY+10.6,z); g.add(flag);
  });

  /* --- 往上飄的氣球 --- */
  const balloonT = tex(32,40,(c)=>{ c.fillStyle='#fff'; c.beginPath(); c.ellipse(16,15,12,14,0,0,Math.PI*2); c.fill();
    c.fillRect(15,28,2,3); c.strokeStyle='#ddd'; c.lineWidth=1; c.beginPath(); c.moveTo(16,31); c.quadraticCurveTo(12,35,16,40); c.stroke(); });
  const balloons = [], bCols = [0xd05858,0xe0b848,0x5890d0,0x70b068,0xc070c0];
  for(let i=0;i<9;i++){
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:balloonT, color:bCols[i%5], fog:true}));
    sp.scale.set(2.2,2.75,1);
    sp.userData = { x:-50 + rnd()*100, z:-24 - rnd()*30, y0:rnd()*50, spd:1.2 + rnd()*1.2, ph:rnd()*6 };
    sp.position.set(sp.userData.x, GY + sp.userData.y0, sp.userData.z); g.add(sp); balloons.push(sp);
  }

  /* --- 動畫 --- */
  const tick = new THREE.Mesh(new THREE.BoxGeometry(0.01,0.01,0.01), new THREE.MeshBasicMaterial({visible:false}));
  tick.frustumCulled = false; g.add(tick);
  let last = performance.now(), u = 0, ang = 0;
  const tmp = new THREE.Vector3();
  const place = (car,s)=>{
    const p = curve.getPointAt(s); tmp.copy(curve.getTangentAt(s)).add(p);
    car.position.copy(p); car.lookAt(tmp);
  };
  train.forEach((c,i)=>place(c,(1 - i*0.012)%1));
  tick.onBeforeRender = ()=>{
    const now = performance.now(), dt = Math.min(0.05,(now-last)/1000); last = now;
    if(reduce) return;
    const t = now/1000;
    ang += dt*0.12; wheel.rotation.z = ang;
    gondolas.forEach(c=>{ c.rotation.z = -ang + Math.sin(t*1.3 + c.id)*0.06; });
    bulbs.forEach((b,i)=>{ const on = (Math.floor(t*3) + i) % 3 === 0; b.material.color.setHex(on ? 0xe0d8a0 : 0x8a7048); });
    const y = curve.getPointAt(u).y;                                       // 低處快、高處慢
    u = (u + dt*(0.035 + 0.05*Math.max(0,(14 - y)/22))) % 1;
    train.forEach((c,i)=>place(c,(u - i*0.012 + 1)%1));
    balloons.forEach(b=>{ const d = b.userData; d.y0 += dt*d.spd; if(d.y0 > 55) d.y0 = 0;
      b.position.set(d.x + Math.sin(t*0.7 + d.ph)*1.2, GY + d.y0, d.z); });
  };

  registerMap('amusement', { name:'遊樂園', group:g, W, plats, sky:skyT, fog:0x6e5670, fogNear:60, fogFar:210,
    hemi:[0xe8dce8,0x6a5a68], sun:0xffe6c8, rim:0xffa0c8 });
}
