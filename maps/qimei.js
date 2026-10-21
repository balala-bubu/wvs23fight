/* map: qimei — 奇美國小（花蓮海岸小學操場）. Loaded after js/core.js and the characters. */
'use strict';
{
  const CJK = '"Noto Sans TC","Microsoft JhengHei","PingFang TC","Noto Sans CJK TC",sans-serif';
  const g = new THREE.Group(); scene.add(g);
  const W = 20;

  /* ---------- textures ---------- */
  // 晴朗藍天（接近照片）
  const skyT = tex(4, 64, (c) => {
    const gr = c.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, '#5ba3d9');
    gr.addColorStop(0.45, '#8ec4e8');
    gr.addColorStop(0.7, '#c5dff0');
    gr.addColorStop(1, '#e8f2f8');
    c.fillStyle = gr; c.fillRect(0, 0, 4, 64);
  });
  skyT.magFilter = THREE.LinearFilter;

  // 草地
  const grassT = tex(32, 32, (c, w, h) =>
    speckle(c, w, h, '#6a9a4a', ['#78a856', '#5e8c40', '#82b05e'], 0.55), [80, 30]);

  // 水泥牆／柱面
  const concT = tex(64, 64, (c, w, h) => {
    speckle(c, w, h, '#9a9a92', ['#a8a89e', '#8c8c84', '#b0b0a6'], 0.45);
    for (let i = 0; i < 80; i++) {
      c.fillStyle = 'rgba(0,0,0,0.04)';
      c.fillRect((rnd() * w) | 0, (rnd() * h) | 0, 2 + rnd() * 4, 1);
    }
  }, [8, 8]);

  // 欄杆幾何花紋（X 形）
  const railT = tex(64, 32, (c, w, h) => {
    c.fillStyle = '#7a7a72'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#c8c8be'; c.lineWidth = 2.2;
    for (let x = 0; x < w; x += 16) {
      c.beginPath(); c.moveTo(x + 2, 4); c.lineTo(x + 14, h - 4); c.stroke();
      c.beginPath(); c.moveTo(x + 14, 4); c.lineTo(x + 2, h - 4); c.stroke();
    }
    c.fillStyle = '#a0a098'; c.fillRect(0, 0, w, 3); c.fillRect(0, h - 3, w, 3);
  }, [4, 1]);

  // 校舍立面（弧形兩層樓，原創簡化）
  const facadeT = tex(256, 128, (c, w, h) => {
    // 天空背景（透明感）
    c.clearRect(0, 0, w, h);
    // 主牆體（灰白水泥）
    const wall = (x, y, ww, hh) => {
      c.fillStyle = '#a8a8a0'; c.fillRect(x, y, ww, hh);
      for (let i = 0; i < ww * hh * 0.08; i++) {
        c.fillStyle = ['#9c9c94', '#b4b4ac', '#94948c'][(rnd() * 3) | 0];
        c.fillRect(x + ((rnd() * ww) | 0), y + ((rnd() * hh) | 0), 1, 1);
      }
    };
    wall(0, 28, 256, 90);

    // 二樓走廊地板線
    c.fillStyle = '#8a8a82'; c.fillRect(0, 58, 256, 4);
    // 二樓欄杆
    c.fillStyle = '#6e6e66'; c.fillRect(0, 28, 256, 30);
    c.strokeStyle = '#c0c0b6'; c.lineWidth = 1.5;
    for (let x = 4; x < 252; x += 12) {
      c.beginPath(); c.moveTo(x, 30); c.lineTo(x + 10, 56); c.stroke();
      c.beginPath(); c.moveTo(x + 10, 30); c.lineTo(x, 56); c.stroke();
    }
    c.fillStyle = '#b8b8b0'; c.fillRect(0, 28, 256, 3); c.fillRect(0, 55, 256, 3);

    // 一樓柱子與開放走廊
    c.fillStyle = '#7a7a72';
    for (let x = 10; x < 250; x += 28) {
      c.fillRect(x, 62, 8, 56);
      // 菱形裝飾
      c.fillStyle = '#c8a030';
      c.beginPath();
      c.moveTo(x + 4, 78); c.lineTo(x + 8, 82); c.lineTo(x + 4, 86); c.lineTo(x, 82);
      c.closePath(); c.fill();
      c.fillStyle = '#7a7a72';
    }
    // 一樓地面陰影
    c.fillStyle = 'rgba(0,0,0,0.12)'; c.fillRect(0, 110, 256, 18);

    // 中央三角山牆
    c.fillStyle = '#d0d0c8';
    c.beginPath(); c.moveTo(88, 28); c.lineTo(128, 4); c.lineTo(168, 28); c.closePath(); c.fill();
    c.strokeStyle = '#8a8a80'; c.lineWidth = 2; c.stroke();
    // 山牆內飾
    c.fillStyle = '#e8e8e0';
    c.beginPath(); c.moveTo(100, 26); c.lineTo(128, 10); c.lineTo(156, 26); c.closePath(); c.fill();
    // 校名字樣（簡化）
    c.fillStyle = '#c83028';
    c.font = 'bold 11px ' + CJK;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('奇 美 國 小', 128, 20);

    // 窗戶（一樓柱間）
    for (let x = 22; x < 240; x += 28) {
      c.fillStyle = '#5a6a78'; c.fillRect(x, 72, 14, 18);
      c.fillStyle = '#8aa0b0'; c.fillRect(x + 1, 73, 12, 7);
      c.fillStyle = '#4a5a68'; c.fillRect(x + 6, 72, 1, 18);
    }
    // 二樓窗戶
    for (let x = 16; x < 240; x += 20) {
      c.fillStyle = '#4a5a68'; c.fillRect(x, 36, 12, 14);
      c.fillStyle = '#7a90a0'; c.fillRect(x + 1, 37, 10, 5);
    }
  });
  facadeT.magFilter = THREE.LinearFilter;

  // 黃溜滑梯
  const slideT = tex(32, 64, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#f0c040'); gr.addColorStop(0.5, '#e8a820'); gr.addColorStop(1, '#d09018');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,0.15)'; c.fillRect(2, 0, 6, h);
    c.fillStyle = 'rgba(0,0,0,0.08)'; c.fillRect(w - 6, 0, 4, h);
  });

  // 紅色花叢
  const flowerT = tex(32, 32, (c, w, h) => {
    c.fillStyle = '#3a6a30'; c.fillRect(0, 18, w, 14);
    for (let i = 0; i < 40; i++) {
      const x = rnd() * w, y = 4 + rnd() * 22;
      c.fillStyle = ['#d03028', '#e04030', '#c02820', '#e86050'][(rnd() * 4) | 0];
      c.beginPath(); c.arc(x, y, 1.5 + rnd() * 2, 0, 7); c.fill();
    }
  }, [2, 2]);

  /* ---------- 地面 ---------- */
  const far = new THREE.Mesh(new THREE.PlaneGeometry(600, 500), L({ map: grassT, color: 0x7a9a5a }));
  far.rotation.x = -Math.PI / 2; far.position.y = -26; g.add(far);

  /* ---------- 主舞台＋大小平台（操場風格） ---------- */
  // 主舞台頂面：PU 操場＋簡單線條（中線、邊線、中圈）
  const stageTopT = tex(128, 64, (c, w, h) => {
    speckle(c, w, h, '#c8c0a8', ['#d4ccb4', '#bcb498', '#dcd4bc'], 0.35);
    c.fillStyle = '#f0d060'; c.fillRect(0, 0, w, 4); c.fillRect(0, h - 4, w, 4);
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(w / 2, 6); c.lineTo(w / 2, h - 6); c.stroke();
    c.beginPath(); c.moveTo(8, 6); c.lineTo(8, h - 6); c.stroke();
    c.beginPath(); c.moveTo(w - 8, 6); c.lineTo(w - 8, h - 6); c.stroke();
    c.beginPath(); c.arc(w / 2, h / 2, 10, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.arc(8, h / 2, 7, -Math.PI / 2, Math.PI / 2); c.stroke();
    c.beginPath(); c.arc(w - 8, h / 2, 7, Math.PI / 2, -Math.PI / 2); c.stroke();
  }, [2, 1]);
  stageTopT.magFilter = THREE.LinearFilter;

  const platTopT = tex(64, 32, (c, w, h) => {
    speckle(c, w, h, '#d0c8b0', ['#dcd4bc', '#c4bc9e', '#e4dcc4'], 0.35);
    c.fillStyle = '#f0d060'; c.fillRect(0, 0, w, 3); c.fillRect(0, h - 3, w, 3);
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(0, h / 2 - 0.5, w, 1);
  }, [3, 1]);

  const courtSideT = tex(32, 16, (c, w, h) => {
    speckle(c, w, h, '#8a8268', ['#968e74', '#7e765c'], 0.45);
  }, [2, 1]);

  const topM = L({ map: stageTopT });
  const platTopM = L({ map: platTopT });
  const sideM = L({ map: courtSideT });
  const underM = L({ map: rockTex, color: 0x6a5a48 });
  const lipM = L({ color: 0xf4e2b4 });
  const yellowM = L({ color: 0xf0c830 });
  const metalM = L({ color: 0x5a5e66 });
  const metalDarkM = L({ color: 0x3a3e46 });

  // 主舞台
  g.add(at(rbox(W * 2 + 0.6, 1.4, 9, 0.05, [sideM, sideM, topM, sideM, sideM, sideM]), 0, -0.7, 0));
  g.add(at(rbox(W * 2 + 0.4, 0.18, 0.35, 0.04, lipM), 0, 0.05, 4.35));
  g.add(at(rbox(W * 2 + 0.2, 0.12, 0.4, 0.02, L({ color: 0xa39878 })), 0, 0.02, -4.2));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W, 12, 6), underM);
  under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);

  const plats = [
    { x1: -16, x2: -8, y: 7.5 },
    { x1: 8, x2: 16, y: 7.5 },
    { x1: -3.5, x2: 3.5, y: 13 }
  ];

  // 自訂平台：黃邊＋金屬管腳
  function schoolPlat(p, isHigh) {
    const w = p.x2 - p.x1;
    const cx = (p.x1 + p.x2) / 2;
    const y = p.y;
    g.add(at(rbox(w, 0.55, 4, 0.15, [sideM, sideM, platTopM, sideM, sideM, sideM]), cx, y - 0.28, 0));
    g.add(at(rbox(w + 0.15, 0.12, 0.22, 0.04, yellowM), cx, y + 0.02, 1.95));
    g.add(at(rbox(w + 0.15, 0.12, 0.22, 0.04, yellowM), cx, y + 0.02, -1.95));
    g.add(at(rbox(0.18, 0.12, 4.1, 0.04, yellowM), cx - w / 2 - 0.05, y + 0.02, 0));
    g.add(at(rbox(0.18, 0.12, 4.1, 0.04, yellowM), cx + w / 2 + 0.05, y + 0.02, 0));
    g.add(at(rbox(w - 0.4, 1.1, 0.2, 0.08, sideM), cx, y - 1.0, 1.85));
    const legH = isHigh ? 11.5 : 6.2;
    const legR = 0.22;
    for (const sx of [-1, 1]) {
      const leg = cyl(legR, legR * 1.05, legH, metalM, 10);
      leg.position.set(cx + sx * (w * 0.32), y - 0.55 - legH / 2, 0);
      g.add(leg);
      const ring = cyl(legR * 1.35, legR * 1.35, 0.18, metalDarkM, 10);
      ring.position.set(cx + sx * (w * 0.32), y - 0.48, 0);
      g.add(ring);
      const base = cyl(legR * 1.6, legR * 1.2, 0.25, metalDarkM, 10);
      base.position.set(cx + sx * (w * 0.32), y - 0.55 - legH + 0.1, 0);
      g.add(base);
    }
    if (isHigh) {
      const bar = cyl(0.12, 0.12, w * 0.64, metalM, 8);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(cx, y - 4.5, 0);
      g.add(bar);
    }
    const r = new THREE.Mesh(new THREE.ConeGeometry(w * 0.4, 2.0, 5), underM);
    r.rotation.x = Math.PI; r.scale.z = 0.4;
    r.position.set(cx, y - 1.8, 0); g.add(r);
  }
  schoolPlat(plats[0], false);
  schoolPlat(plats[1], false);
  schoolPlat(plats[2], true);

  /* ---------- 校舍（背景 z < -10） ---------- */
  // 主立面（寬一點覆蓋 4 人視野）
  const facadeM = L({ map: facadeT, color: 0x9a9080 }); // 壓暗
  const facade = new THREE.Mesh(new THREE.PlaneGeometry(140, 55), facadeM);
  facade.position.set(0, -26 + 22, -95); g.add(facade);

  // 立面後方實心體積
  const body = new THREE.Mesh(new THREE.BoxGeometry(130, 40, 18), L({ map: concT, color: 0x888880 }));
  body.position.set(0, -26 + 16, -110); g.add(body);

  // 二樓走廊地板（往前凸一點）
  const balcony = new THREE.Mesh(new THREE.BoxGeometry(132, 1.2, 8), L({ map: concT, color: 0x8a8a82 }));
  balcony.position.set(0, -26 + 28, -98); g.add(balcony);

  // 一樓柱子（3D）
  const pillarM = L({ map: concT, color: 0x8e8e86 });
  for (let i = -4; i <= 4; i++) {
    const px = i * 14;
    const pillar = cyl(1.1, 1.3, 14, pillarM, 8);
    pillar.position.set(px, -26 + 7, -92); g.add(pillar);
    // 菱形裝飾
    const diam = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.7, 0),
      L({ color: 0xc8a030 })
    );
    diam.position.set(px, -26 + 5.5, -90.5); diam.scale.set(1, 1.3, 0.4); g.add(diam);
  }

  // 中央三角屋頂
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(22, 10, 3),
    L({ color: 0xb8b8b0 })
  );
  roof.rotation.y = Math.PI; roof.position.set(0, -26 + 48, -102); g.add(roof);

  /* ---------- 溜滑梯與遊樂設施 ---------- */
  // 黃色溜滑梯（右側）
  const slideGroup = new THREE.Group();
  slideGroup.position.set(18, -26 + 2, -28);
  // 滑道
  const slideMesh = new THREE.Mesh(
    new THREE.BoxGeometry(3.5, 0.4, 14),
    L({ map: slideT, color: 0xe8b020 })
  );
  slideMesh.rotation.x = -0.55; slideMesh.position.set(0, 4, -2); slideGroup.add(slideMesh);
  // 扶手
  const railM = L({ color: 0xd0a018 });
  [[-1.9, 0], [1.9, 0]].forEach(([ox]) => {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 13), railM);
    r.rotation.x = -0.55; r.position.set(ox, 4.5, -2); slideGroup.add(r);
  });
  // 頂部平台
  const topPlat = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 4), L({ color: 0xc8a820 }));
  topPlat.position.set(0, 8.2, -8); slideGroup.add(topPlat);
  // 支柱
  for (const sx of [-1.8, 1.8]) {
    const leg = cyl(0.25, 0.3, 8.5, L({ color: 0x6a6a62 }), 6);
    leg.position.set(sx, 4, -8); slideGroup.add(leg);
  }
  g.add(slideGroup);

  // 簡易鞦韆架（左側）
  const swingFrame = new THREE.Group();
  swingFrame.position.set(-20, -26 + 0.5, -32);
  const barM = L({ color: 0xd8c030 });
  // 橫桿
  const bar = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 0.35), barM);
  bar.position.y = 7; swingFrame.add(bar);
  // 兩側腳
  [[-4.5, 0], [4.5, 0]].forEach(([ox]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.35, 7.5, 0.35), barM);
    leg.position.set(ox, 3.5, 0); swingFrame.add(leg);
    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 7.5, 0.35), barM);
    leg2.position.set(ox, 3.5, 2.5); swingFrame.add(leg2);
  });
  // 座椅（簡單）
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.15, 0.7), L({ color: 0x4a4a48 }));
  seat.position.set(0, 2.8, 1.2); swingFrame.add(seat);
  // 繩子
  [[-0.6, 0], [0.6, 0]].forEach(([ox]) => {
    const rope = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.2, 0.08), L({ color: 0x3a3a38 }));
    rope.position.set(ox, 4.9, 1.2); swingFrame.add(rope);
  });
  g.add(swingFrame);

  /* ---------- 花叢與樹 ---------- */
  // 紅色花叢（照片左側）
  const bush = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 8),
    L({ map: flowerT, color: 0xb0a090, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide })
  );
  bush.position.set(-14, -26 + 3, -22); g.add(bush);

  // 幾棵椰子／樹（用 sprite 簡化）
  const trunkM = L({ color: 0x7a6a50 });
  const tree = (x, z, h) => {
    const t = cyl(0.5, 0.7, h, trunkM, 6);
    t.position.set(x, -26 + h / 2, z); g.add(t);
    // 樹冠（幾片綠）
    for (let i = 0; i < 5; i++) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(2.2 + rnd() * 1.5, 6, 5),
        L({ color: 0x4a8a38 })
      );
      leaf.position.set(x + (rnd() - 0.5) * 3, -26 + h + 1 + rnd() * 2, z + (rnd() - 0.5) * 2);
      leaf.scale.y = 0.6; g.add(leaf);
    }
  };
  tree(-32, -55, 18);
  tree(28, -60, 20);
  tree(-40, -80, 22);
  tree(38, -85, 16);

  // 遠景樹點綴
  for (let i = 0; i < 18; i++) {
    const x = -100 + rnd() * 200;
    const z = -120 - rnd() * 60;
    const s = 10 + rnd() * 14;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: folTex ? folTex[(rnd() * 4) | 0] : null,
      color: new THREE.Color(0.55 + rnd() * 0.2, 0.65 + rnd() * 0.15, 0.4),
      alphaTest: 0.5, fog: true
    }));
    if (sp.material.map) {
      sp.scale.set(s, s, 1);
      sp.position.set(x, -26 + s * 0.45, z);
      g.add(sp);
    }
  }

  registerMap('qimei', {
    name: '奇美國小',
    group: g,
    W,
    plats,
    sky: skyT,
    fog: 0xc8dce8,
    fogNear: 70,
    fogFar: 240,
    hemi: [0xe8f0f8, 0x6a7a50],
    sun: 0xfff0d0,
    rim: 0xa0c0e0
  });
}
