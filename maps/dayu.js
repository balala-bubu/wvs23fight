/* map: dayu — 大禹國小（花蓮山邊的操場籃球場）. Loaded after js/core.js and the characters. */
'use strict';
{
  const CJK = '"Noto Sans TC","Microsoft JhengHei","PingFang TC","Noto Sans CJK TC",sans-serif';
  const g = new THREE.Group(); scene.add(g);
  const W = 20;

  /* ---------- textures ---------- */
  const skyT = tex(4,64,(c)=>{ const gr = c.createLinearGradient(0,0,0,64); gr.addColorStop(0,'#8ea6b4'); gr.addColorStop(.55,'#bccbcd'); gr.addColorStop(1,'#e2e4dc'); c.fillStyle = gr; c.fillRect(0,0,4,64); });
  skyT.magFilter = THREE.LinearFilter;

  // 籃球場面：藍邊、綠場地、紅色禁區、白線
  const courtT = tex(128,64,(c,w,h)=>{
    speckle(c,w,h,'#4f7fae',['#5a89b6','#46739f'],.5);
    c.fillStyle = '#5f8a62'; c.fillRect(0,14,w,40);
    c.fillStyle = '#b4605c'; c.fillRect(0,18,50,32);
    for(let y=0;y<h;y++) for(let x=0;x<w;x++) if(rnd()<.25){ c.fillStyle='rgba(0,0,0,.07)'; c.fillRect(x,y,1,1); }
    c.strokeStyle = '#e8ece4'; c.lineWidth = 1;
    c.strokeRect(1.5,14.5,w-3,39);
    c.beginPath(); c.arc(50,34,14,-Math.PI/2,Math.PI/2); c.stroke();
    c.beginPath(); c.moveTo(50,18.5); c.lineTo(0,18.5); c.moveTo(50,49.5); c.lineTo(0,49.5); c.stroke();
    c.strokeStyle = '#e6c25a'; c.beginPath(); c.moveTo(0,12.5); c.lineTo(w,12.5); c.stroke();
  },[1,1]);
  courtT.magFilter = THREE.LinearFilter;

  const grassT = tex(32,32,(c,w,h)=>speckle(c,w,h,'#6f9a4c',['#7aa656','#628c42','#86ae5e'],.6),[70,18]);
  const trackT = tex(16,16,(c,w,h)=>speckle(c,w,h,'#b5684a',['#c07654','#a85c40'],.5),[60,2]);

  // 山：剪影＋樹冠斑點
  function ridgeTex(base, light, dark, amp, sd, mist){
    const T = tex(512,192,(c,w,h)=>{
      c.clearRect(0,0,w,h);
      const pts = []; let y = h*0.38;
      for(let x=0;x<=w;x+=6){ y += (Math.sin(x*.0225+sd)*.9 + Math.sin(x*.065+sd*2)*.5 + (rnd()-.5)*1.4)*amp*.35; y = Math.max(h*.12, Math.min(h*.62,y)); pts.push([x,y]); }
      c.beginPath(); c.moveTo(0,h); pts.forEach(p=>c.lineTo(p[0],p[1])); c.lineTo(w,h); c.closePath(); c.clip();
      speckle(c,w,h,base,[light,dark,light],.7);
      for(let i=0;i<500;i++){ c.fillStyle = rnd()<.5?light:dark; c.globalAlpha=.55; c.fillRect(rnd()*w,rnd()*h,2+rnd()*5,2+rnd()*3); } c.globalAlpha=1;
      const gr = c.createLinearGradient(0,0,0,h); gr.addColorStop(0,'rgba(210,222,218,'+(mist*.6)+')'); gr.addColorStop(1,'rgba(210,222,218,'+mist+')');
      c.fillStyle = gr; c.fillRect(0,0,w,h);
    });
    T.magFilter = T.minFilter = THREE.LinearFilter; return T;
  }
  function ridge(t, w, h, x, y, z, tint){
    const m = L({map:t, color:tint}); m.transparent = true; m.alphaTest = .5; m.depthWrite = true;
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w,h), m); p.position.set(x,y,z); g.add(p); return p;
  }
  ridge(ridgeTex('#4f7a5e','#5e8d6c','#42684f',6,1.2,.45), 640,130, 0, 14, -150, 0xa0b4a8);
  ridge(ridgeTex('#3f6e4c','#52825c','#33583e',7,3.1,.25), 560,100, 20, 4, -105, 0x93a994);
  ridge(ridgeTex('#33573a','#436b48','#27452e',5,5.4,.1), 480,64, -10, -4, -62, 0x84977f);

  // 教學樓壁畫（原創簡化：大樹、雲、小朋友、通風花磚）
  const muralT = tex(128,56,(c,w,h)=>{
    speckle(c,w,h,'#5b8a5a',['#66955f','#4f7e52'],.5);
    c.fillStyle = '#7fb3c6'; c.fillRect(0,0,w,20);
    c.fillStyle = '#f0f2ec'; [[18,8,14],[26,6,10],[100,10,12]].forEach(a=>{ c.beginPath(); c.arc(a[0],a[1],a[2]*.5,0,7); c.fill(); });
    c.fillStyle = '#a85d4a'; c.fillRect(6,12,12,44);                 // 樹幹
    c.fillStyle = '#3f7a43'; c.beginPath(); c.arc(32,10,13,0,7); c.fill(); c.beginPath(); c.arc(14,8,10,0,7); c.fill();
    c.fillStyle = '#b47a4a'; c.fillRect(0,31,w,5);                   // 樹枝／地面
    [[48,'#e6a0a8'],[66,'#8a6fb0'],[82,'#e8c04a']].forEach(a=>{ c.fillStyle=a[1]; c.fillRect(a[0],32,8,14); c.fillStyle='#f2d4b4'; c.fillRect(a[0]+1,26,6,6); c.fillStyle='#2a2220'; c.fillRect(a[0]+1,25,6,2); });
    c.fillStyle = '#d9604a'; c.fillRect(96,38,10,10); c.fillStyle='#f2d4b4'; c.fillRect(97,33,8,6); c.fillStyle='#e8c04a'; c.fillRect(95,31,12,3);
    for(let k=0;k<3;k++){ const px = [26,64,100][k], py = [6,38,6][k]; c.fillStyle = '#2f4a3a'; c.fillRect(px,py,18,13); c.fillStyle='#8fb6c0'; for(let a=0;a<6;a++) for(let b=0;b<4;b++) if((a+b)%2) c.fillRect(px+1+a*3,py+1+b*3,2,2); }
  });
  muralT.magFilter = THREE.LinearFilter;

  const signT = tex(160,40,(c,w,h)=>{
    c.fillStyle = '#6fb4dc'; c.fillRect(0,0,w,h);
    c.fillStyle = '#d6342f'; c.font = 'bold 28px '+CJK; c.textBaseline = 'middle'; c.textAlign = 'center';
    c.fillText('大 禹 國 小', w/2, h/2+1);
  });
  signT.magFilter = THREE.LinearFilter;
  const stripeT = tex(64,16,(c,w,h)=>{ ['#d9453a','#f3f0e6','#3f9a55','#f0c43c'].forEach((col,i)=>{ c.fillStyle=col; c.fillRect(0,i*4,w,4); }); });
  stripeT.magFilter = THREE.LinearFilter;

  /* ---------- 地面 ---------- */
  const far = new THREE.Mesh(new THREE.PlaneGeometry(700,500), L({color:0x5e7a48})); far.rotation.x = -Math.PI/2; far.position.y = -26; g.add(far);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(700,110), L({map:grassT, color:0xa4b090})); lawn.rotation.x = -Math.PI/2; lawn.position.set(0,-8,-67); g.add(lawn);
  const track = new THREE.Mesh(new THREE.PlaneGeometry(700,5), L({map:trackT, color:0xb09080})); track.rotation.x = -Math.PI/2; track.position.set(0,-7.95,-16); g.add(track);

  /* ---------- 舞台（籃球場）＋平台 ---------- */
  const topM = L({map:courtT, color:0xc2c8c8}), sideM = L({color:0x5d6f84}), lipM = L({color:0xe9dcb0});
  g.add(at(rbox(W*2+0.6,1.4,9,.05,[sideM,sideM,topM,sideM,sideM,sideM]),0,-0.7,0));
  g.add(at(new THREE.Mesh(new THREE.BoxGeometry(W*2+0.7,0.18,0.5), lipM),0,0.04,4.45));    // 前緣亮邊
  const under = new THREE.Mesh(new THREE.ConeGeometry(W,12,6), L({color:0x6a6a60})); under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);
  const plats = [ {x1:-16,x2:-8,y:7.5}, {x1:8,x2:16,y:7.5}, {x1:-3.5,x2:3.5,y:13} ];
  const pTop = L({color:0xf0cf86}), pSide = L({color:0xa8793a}), pEdge = L({color:0xf4e2b4});
  plats.forEach(p=>{
    addPlatform(g,p,pTop,pSide,L({color:0x7a6a56}));
    g.add(at(new THREE.Mesh(new THREE.BoxGeometry(p.x2-p.x1+.1,.12,.35),pEdge),(p.x1+p.x2)/2,p.y+0.02,1.95));
  });

  /* ---------- 籃框（左前，靠邊） ---------- */
  {
    const hoop = new THREE.Group(); hoop.position.set(-27,0,-7); g.add(hoop);
    hoop.add(at(cyl(0.45,0.45,12,L({color:0x9aa2a8}),10),0,5,0));
    hoop.add(at(cyl(0.55,0.55,5,L({color:0x2f6fb6}),10),0,-0.5,0));                 // 藍色護墊
    hoop.add(at(new THREE.Mesh(new THREE.BoxGeometry(5.2,0.35,0.35),L({color:0x9aa2a8})),2.4,9.4,0));
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.3,4.4,6.4), L({color:0x2f5a9a})); board.position.set(5,10.6,0); hoop.add(board);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.9,0.09,6,16), L({color:0xd8602a})); rim.rotation.x = Math.PI/2; rim.position.set(6,9.2,0); hoop.add(rim);
  }

  /* ---------- 遊樂設施（中後方） ---------- */
  {
    const pg = new THREE.Group(); pg.position.set(-4,-8,-26); g.add(pg);
    const blue = L({color:0x2f60a8}), org = L({color:0xe0803a}), yel = L({color:0xe8bd48});
    [[-4,0],[4,0],[-4,-4],[4,-4]].forEach(a=>pg.add(at(cyl(0.3,0.3,10,blue,6),a[0],5,a[1])));
    pg.add(at(new THREE.Mesh(new THREE.BoxGeometry(9,0.5,5),blue),0,6.5,-2));
    pg.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.4,3.4,3.4),yel),-6,2.2,-1));
    pg.add(at(new THREE.Mesh(new THREE.BoxGeometry(3.4,3.4,3.4),org),-3,1.2,1));
    const roof = at(new THREE.Mesh(new THREE.ConeGeometry(3.4,2.4,12),org),0,10.8,-2); pg.add(roof);
    const slide = at(new THREE.Mesh(new THREE.BoxGeometry(2.4,0.3,8),L({color:0xb8a890})),5.5,3.6,0); slide.rotation.x = .45; pg.add(slide);
    const bb = at(new THREE.Mesh(new THREE.BoxGeometry(5,3.6,0.3),L({color:0xdcdcd4})),0,12,-4.5); pg.add(bb);
    pg.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.4,1.8,0.34),L({color:0xc85a46})),0,11.8,-4.45));
  }

  /* ---------- 彩繪教學樓（右後方） ---------- */
  {
    const b = new THREE.Group(); b.position.set(24,-8,-32); g.add(b);
    const wallM = L({color:0xb09a88});
    b.add(at(new THREE.Mesh(new THREE.BoxGeometry(34,15,9),L({color:0x9a9488})),0,7.5,0));
    const mural = new THREE.Mesh(new THREE.PlaneGeometry(33,14), L({map:muralT, color:0x9aa89a})); mural.position.set(0,7.5,4.7); b.add(mural);
    b.add(at(new THREE.Mesh(new THREE.BoxGeometry(35,0.8,10),L({color:0xb8b4aa})),0,15.3,0));            // 屋簷
    b.add(at(new THREE.Mesh(new THREE.BoxGeometry(20,8,6),wallM),-4,19.7,0));                              // 上層
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(19,5), L({map:signT, color:0xa8b4b8})); sign.position.set(-4,21.2,3.2); b.add(sign);
    const stripes = new THREE.Mesh(new THREE.PlaneGeometry(19,2.8), L({map:stripeT, color:0xa8a8a0})); stripes.position.set(-4,17.4,3.2); b.add(stripes);
    b.add(at(new THREE.Mesh(new THREE.BoxGeometry(5,4,4),L({color:0x8a7a6c})),-8,25.5,-.5));              // 屋頂小屋
    const hat = at(new THREE.Mesh(new THREE.ConeGeometry(3.6,2,4),L({color:0x6a4a3a})),-8,28.5,-.5); hat.rotation.y = Math.PI/4; b.add(hat);
    // 一樓走廊
    b.add(at(new THREE.Mesh(new THREE.BoxGeometry(34,6,2.4),L({color:0x8a7468})),0,3,5.9));
    [-12,-4,4,12].forEach(x=>b.add(at(new THREE.Mesh(new THREE.BoxGeometry(.8,6,.8),L({color:0xb0a89a})),x,3,7.4)));
  }

  /* ---------- 樹與香蕉樹 ---------- */
  function tree(x,z,s){
    const t = new THREE.Group(); t.position.set(x,-8,z); g.add(t);
    t.add(at(cyl(.8*s,1.1*s,9*s,L({color:0x5a4030}),6),0,4.5*s,0));
    [[0,12,0,6],[-3.5,10,1,4.5],[3.5,10.5,-1,4.8],[0,15,0,4]].forEach(a=>{ const m = new THREE.Mesh(new THREE.IcosahedronGeometry(a[3]*s,0), L({color:0x3b5f3a})); m.position.set(a[0]*s,a[1]*s,a[2]*s); t.add(m); });
  }
  function banana(x,z,s){
    const t = new THREE.Group(); t.position.set(x,-8,z); g.add(t);
    t.add(at(cyl(.35*s,.5*s,5*s,L({color:0x7a8a4a}),6),0,2.5*s,0));
    for(let i=0;i<7;i++){ const l = new THREE.Mesh(new THREE.BoxGeometry(.2*s,.12*s,5.5*s), L({color:i%2?0x6a9a3e:0x78a84a})); l.position.set(0,5.2*s,0); l.rotation.set(-.5-(i%3)*.12,i*Math.PI*2/7,0,'YXZ'); l.translateZ(2.4*s); t.add(l); }
  }
  tree(58,-26,1.5); tree(-62,-38,1.2); tree(70,-40,1.3);
  [-40,-29,-18,14,24,-52,36].forEach((x,i)=>banana(x,-30-(i%3)*4,1.5+(i%2)*.3));
  // 低矮灌木
  for(let i=0;i<24;i++){ const x = -84+i*7.2+rnd()*3; const m = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2+rnd()*1.2,0), L({color:0x3d6038})); m.position.set(x,-7.4,-17-rnd()*3); m.scale.y = .62; g.add(m); }

  registerMap('dayu', { name:'大禹國小', group:g, W, plats, sky:skyT, fog:0xc4ced0, fogNear:60, fogFar:230,
    hemi:[0xe8eef0,0x5e6a56], sun:0xfff4e4, rim:0xb4cce0 });
}
