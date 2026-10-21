/* map: space — 太空戰場. Loaded after js/core.js and the characters. */
'use strict';
{
  const g = new THREE.Group(); scene.add(g);
  const W = 20;
  const clock0 = performance.now();
  const now = () => (performance.now() - clock0) / 1000;

  /* ---------- textures ---------- */
  // 深空星空
  const spaceSkyT = tex(4, 64, (c) => {
    const gr = c.createLinearGradient(0, 0, 0, 64);
    gr.addColorStop(0, '#0a0618');
    gr.addColorStop(0.4, '#120a28');
    gr.addColorStop(0.7, '#1a0e30');
    gr.addColorStop(1, '#0e081c');
    c.fillStyle = gr; c.fillRect(0, 0, 4, 64);
  });
  spaceSkyT.magFilter = THREE.LinearFilter;

  // 金屬平台面
  const metalTopT = tex(64, 32, (c, w, h) => {
    speckle(c, w, h, '#6a7080', ['#7a8090', '#5a6070', '#8a90a0'], 0.4);
    c.fillStyle = 'rgba(180,200,255,0.15)';
    for (let x = 4; x < w; x += 8) c.fillRect(x, 2, 1, h - 4);
    for (let y = 4; y < h; y += 6) c.fillRect(2, y, w - 4, 1);
    // 發光邊
    c.fillStyle = '#80c0ff'; c.fillRect(0, 0, w, 2); c.fillRect(0, h - 2, w, 2);
  }, [4, 1]);
  metalTopT.magFilter = THREE.LinearFilter;

  const metalSideT = tex(32, 16, (c, w, h) => {
    speckle(c, w, h, '#3a4050', ['#4a5060', '#2a3040'], 0.45);
  }, [2, 1]);

  // 星雲貼圖（半透明彩色）
  function nebulaTex(c1, c2, c3) {
    const T = tex(128, 64, (c, w, h) => {
      c.clearRect(0, 0, w, h);
      for (let i = 0; i < 8; i++) {
        const x = rnd() * w, y = rnd() * h, r = 12 + rnd() * 28;
        const gr = c.createRadialGradient(x, y, 0, x, y, r);
        const col = [c1, c2, c3][i % 3];
        gr.addColorStop(0, col.replace(')', ',0.55)').replace('rgb', 'rgba'));
        gr.addColorStop(1, col.replace(')', ',0)').replace('rgb', 'rgba'));
        c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
      }
      // 星星點
      for (let i = 0; i < 40; i++) {
        c.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.7})`;
        c.fillRect((rnd() * w) | 0, (rnd() * h) | 0, 1, 1);
      }
    });
    T.magFilter = THREE.LinearFilter;
    return T;
  }

  // 行星貼圖
  function planetTex(base, band1, band2) {
    return tex(64, 64, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, 0, h);
      gr.addColorStop(0, base); gr.addColorStop(0.5, band1); gr.addColorStop(1, band2);
      c.fillStyle = gr; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 5; i++) {
        c.fillStyle = band1;
        c.globalAlpha = 0.3;
        c.fillRect(0, 10 + i * 10 + rnd() * 4, w, 2 + rnd() * 3);
      }
      c.globalAlpha = 1;
      // 暗面
      const sh = c.createLinearGradient(0, 0, w, 0);
      sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(0.5, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,0.2)');
      c.fillStyle = sh; c.fillRect(0, 0, w, h);
    });
  }

  // 小星星 sprite
  const starT = tex(16, 16, (c) => {
    c.fillStyle = '#fff';
    c.beginPath(); c.moveTo(8, 0); c.lineTo(9.5, 6.5); c.lineTo(16, 8); c.lineTo(9.5, 9.5);
    c.lineTo(8, 16); c.lineTo(6.5, 9.5); c.lineTo(0, 8); c.lineTo(6.5, 6.5); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.5)'; c.beginPath(); c.arc(8, 8, 2, 0, 7); c.fill();
  });

  /* ---------- 地面／舞台 ---------- */
  // 遠方深空「地板」用暗色
  const voidFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 500),
    L({ color: 0x0a0814 })
  );
  voidFloor.rotation.x = -Math.PI / 2; voidFloor.position.y = -26; g.add(voidFloor);

  const topM = L({ map: metalTopT });
  const sideM = L({ map: metalSideT });
  const underM = L({ color: 0x2a3040 });
  const glowM = L({ color: 0x60a0ff }); // 平台發光邊

  // 主舞台
  g.add(at(rbox(W * 2 + 0.6, 1.4, 9, 0.05, [sideM, sideM, topM, sideM, sideM, sideM]), 0, -0.7, 0));
  g.add(at(rbox(W * 2 + 0.4, 0.12, 0.3, 0.04, glowM), 0, 0.05, 4.35));
  g.add(at(rbox(W * 2 + 0.2, 0.1, 0.25, 0.02, L({ color: 0x3a4560 })), 0, 0.02, -4.2));
  const under = new THREE.Mesh(new THREE.ConeGeometry(W, 12, 6), underM);
  under.rotation.x = Math.PI; under.scale.z = 0.3; under.position.y = -7.3; g.add(under);

  const plats = [
    { x1: -16, x2: -8, y: 7.5 },
    { x1: 8, x2: 16, y: 7.5 },
    { x1: -3.5, x2: 3.5, y: 13 }
  ];
  const platTopM = L({ map: metalTopT, color: 0xc0d0e8 });
  plats.forEach(p => {
    addPlatform(g, p, platTopM, sideM, underM);
    // 發光邊
    const w = p.x2 - p.x1, cx = (p.x1 + p.x2) / 2;
    g.add(at(rbox(w + 0.1, 0.1, 0.18, 0.03, glowM), cx, p.y + 0.02, 1.95));
    g.add(at(rbox(w + 0.1, 0.1, 0.18, 0.03, glowM), cx, p.y + 0.02, -1.95));
  });

  /* ---------- 背景：星雲 ---------- */
  const neb1 = new THREE.Mesh(
    new THREE.PlaneGeometry(280, 120),
    new THREE.MeshBasicMaterial({
      map: nebulaTex('rgb(120,40,180)', 'rgb(40,80,200)', 'rgb(180,60,140)'),
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true
    })
  );
  neb1.position.set(-40, 20, -160); g.add(neb1);

  const neb2 = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 90),
    new THREE.MeshBasicMaterial({
      map: nebulaTex('rgb(40,140,180)', 'rgb(80,40,160)', 'rgb(200,100,60)'),
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true
    })
  );
  neb2.position.set(50, 8, -140); g.add(neb2);

  const neb3 = new THREE.Mesh(
    new THREE.PlaneGeometry(160, 70),
    new THREE.MeshBasicMaterial({
      map: nebulaTex('rgb(200,50,100)', 'rgb(100,40,180)', 'rgb(50,100,200)'),
      transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: true
    })
  );
  neb3.position.set(0, -5, -180); g.add(neb3);

  /* ---------- 背景：行星（會慢慢自轉） ---------- */
  const planets = [];
  function addPlanet(x, y, z, r, base, b1, b2, spin) {
    const t = planetTex(base, b1, b2);
    t.magFilter = THREE.LinearFilter;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 24, 16),
      L({ map: t })
    );
    mesh.position.set(x, y, z); g.add(mesh);
    planets.push({ m: mesh, spin });
  }
  addPlanet(-70, 28, -130, 14, '#c87840', '#e09050', '#a06030', 0.08);
  addPlanet(85, 12, -150, 9, '#6090c0', '#80b0e0', '#406090', -0.12);
  addPlanet(30, 40, -200, 6, '#c060a0', '#e080c0', '#804060', 0.15);
  // 小衛星繞大行星
  const moon = new THREE.Mesh(
    new THREE.SphereGeometry(2.2, 12, 10),
    L({ color: 0xa0a8b0 })
  );
  g.add(moon);
  planets.push({ m: moon, spin: 0, orbit: true });

  /* ---------- 會動的隕石群 ---------- */
  const rocks = [];
  const rockCols = [0x6a5a4a, 0x5a4a3a, 0x7a6a5a, 0x4a4038];
  for (let i = 0; i < 18; i++) {
    const s = 1.5 + rnd() * 3.5;
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(s, 0),
      L({ color: rockCols[i % 4] })
    );
    rock.position.set(-100 + rnd() * 200, -10 + rnd() * 50, -40 - rnd() * 100);
    rock.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
    g.add(rock);
    rocks.push({
      m: rock,
      rx: (rnd() - 0.5) * 0.4,
      ry: (rnd() - 0.5) * 0.5,
      drift: 1.5 + rnd() * 3,
      baseX: rock.position.x,
      baseY: rock.position.y,
      ph: rnd() * 6
    });
  }

  /* ---------- 閃爍星星（前景／中景） ---------- */
  const twinkles = [];
  for (let i = 0; i < 35; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: starT, color: 0xffffff, transparent: true, fog: true,
      blending: THREE.AdditiveBlending, depthWrite: false
    }));
    const s = 0.8 + rnd() * 2.5;
    sp.scale.set(s, s, 1);
    sp.position.set(-90 + rnd() * 180, -8 + rnd() * 55, -25 - rnd() * 90);
    g.add(sp);
    twinkles.push({ o: sp, ph: rnd() * 6, spd: 1.5 + rnd() * 3 });
  }

  /* ---------- 流星（偶爾劃過） ---------- */
  const streakT = tex(4, 32, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, 'rgba(200,230,255,0.9)');
    gr.addColorStop(1, 'rgba(200,230,255,0)');
    c.fillStyle = gr; c.fillRect(0, 0, w, h);
  });
  streakT.magFilter = THREE.LinearFilter;
  const streaks = [];
  for (let i = 0; i < 3; i++) {
    const st = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 18),
      new THREE.MeshBasicMaterial({
        map: streakT, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false
      })
    );
    st.position.set(0, 80, -60); st.visible = false; g.add(st);
    streaks.push({ m: st, t: -10 - i * 4, active: false });
  }

  /* ---------- 幽浮＋綠色大頭外星人（參考可愛大眼造型） ---------- */
  const ufoHullM = L({ color: 0xd0d6e0 });
  const ufoHullDarkM = L({ color: 0x8a92a0 });
  const ufoDomeM = new THREE.MeshLambertMaterial({ color: 0xa8f0ff, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
  const ufoGlowM = new THREE.MeshBasicMaterial({ color: 0x40ff80, transparent: true, opacity: 0.6, depthWrite: false });
  const ufoLightM = new THREE.MeshBasicMaterial({ color: 0x80ffc0 });
  const alienSkinM = L({ color: 0x5fdc4a });
  const alienSkinDarkM = L({ color: 0x3aa832 });
  const alienEyeM = L({ color: 0x0a0a0c });
  const alienHighlightM = L({ color: 0xffffff });

  function makeAlien() {
    const a = new THREE.Group();
    // 大頭（偏圓、略扁）
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.72, 14, 12), alienSkinM);
    head.scale.set(1.05, 1.0, 0.95); head.position.y = 0.85; a.add(head);
    // 兩根觸角＋頂部小球
    for (const sx of [-1, 1]) {
      const ant = cyl(0.04, 0.035, 0.45, alienSkinM, 6);
      ant.position.set(sx * 0.28, 1.45, 0); ant.rotation.z = sx * -0.15; a.add(ant);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), alienSkinM);
      ball.position.set(sx * 0.32, 1.72, 0); a.add(ball);
    }
    // 大黑杏仁眼（扁長橢圓）
    for (const sx of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), alienEyeM);
      eye.scale.set(0.85, 1.15, 0.45);
      eye.position.set(sx * 0.26, 0.88, 0.55);
      a.add(eye);
      // 兩點高光
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.07, 6, 5), alienHighlightM);
      h1.position.set(sx * 0.22, 0.98, 0.68); a.add(h1);
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 5), alienHighlightM);
      h2.position.set(sx * 0.32, 0.82, 0.68); a.add(h2);
    }
    // 小嘴巴（一條細縫）
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.04, 0.06), alienSkinDarkM);
    mouth.position.set(0, 0.55, 0.68); a.add(mouth);
    // 圓潤身體
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 12, 10), alienSkinM);
    body.scale.set(1.0, 1.15, 0.85); body.position.y = 0.15; a.add(body);
    // 短手臂
    for (const sx of [-1, 1]) {
      const arm = cyl(0.08, 0.06, 0.4, alienSkinM, 6);
      arm.position.set(sx * 0.42, 0.25, 0.05); arm.rotation.z = sx * 0.55; a.add(arm);
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), alienSkinM);
      hand.position.set(sx * 0.55, 0.05, 0.05); a.add(hand);
    }
    // 短腿
    for (const sx of [-1, 1]) {
      const leg = cyl(0.09, 0.07, 0.3, alienSkinM, 6);
      leg.position.set(sx * 0.16, -0.25, 0.02); a.add(leg);
      const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 5), alienSkinM);
      foot.scale.set(1.2, 0.7, 1.3); foot.position.set(sx * 0.16, -0.42, 0.06); a.add(foot);
    }
    return a;
  }

  function makeUFO(scale) {
    const u = new THREE.Group();
    // 主碟盤（上下兩層）
    const disc = new THREE.Mesh(new THREE.SphereGeometry(1.6, 20, 12), ufoHullM);
    disc.scale.set(1, 0.22, 1); u.add(disc);
    // 中層一圈細節
    const mid = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.12, 8, 24), ufoHullDarkM);
    mid.rotation.x = Math.PI / 2; mid.position.y = 0.02; u.add(mid);
    // 邊緣一圈小燈
    for (let i = 0; i < 12; i++) {
      const ang = (i / 12) * Math.PI * 2;
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 5), ufoLightM);
      lamp.position.set(Math.cos(ang) * 1.45, -0.05, Math.sin(ang) * 1.45); u.add(lamp);
    }
    // 上圓頂（半透明）
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10), ufoDomeM);
    dome.scale.set(1, 0.75, 1); dome.position.y = 0.4; u.add(dome);
    // 圓頂金屬框
    const domeRim = new THREE.Mesh(new THREE.TorusGeometry(0.82, 0.05, 6, 20), ufoHullDarkM);
    domeRim.rotation.x = Math.PI / 2; domeRim.position.y = 0.22; u.add(domeRim);
    // 底部光環
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.1, 6, 24), ufoGlowM);
    ring.rotation.x = Math.PI / 2; ring.position.y = -0.2; u.add(ring);
    // 底部中央核心
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 6), ufoLightM);
    core.position.y = -0.25; u.add(core);
    // 底部光束
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.2, 1.1, 4.0, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x40ff80, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false })
    );
    beam.position.y = -2.2; u.add(beam);
    // 外星人站在圓頂裡（略放大好認）
    const alien = makeAlien();
    alien.scale.setScalar(0.7); alien.position.set(0, 0.35, 0.1); u.add(alien);
    u.scale.setScalar(scale);
    return { group: u, beam, ring, alien };
  }

  const ufos = [];
  const ufoSpecs = [
    { scale: 2.4, y: 9, z: -36, R: 26, sp: 0.2, ph: 0 },
    { scale: 1.7, y: 17, z: -52, R: 38, sp: -0.14, ph: 2.1 },
    { scale: 2.0, y: 5, z: -45, R: 32, sp: 0.17, ph: 4.0 }
  ];
  ufoSpecs.forEach(spec => {
    const u = makeUFO(spec.scale);
    g.add(u.group);
    ufos.push({ ...u, ...spec });
  });

  /* ---------- 動畫驅動（單一 onBeforeRender） ---------- */
  const driver = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({ visible: false }));
  driver.position.set(0, 0, -20); driver.frustumCulled = false; g.add(driver);
  let lastT = now();
  driver.onBeforeRender = () => {
    if (typeof reduce !== 'undefined' && reduce) return;
    const t = now();
    const d = Math.min(0.05, t - lastT); lastT = t;

    // 行星自轉
    planets.forEach(p => {
      if (p.orbit) {
        p.m.position.set(-70 + Math.cos(t * 0.35) * 22, 28 + Math.sin(t * 0.35) * 4, -130 + Math.sin(t * 0.35) * 10);
      } else if (p.spin) {
        p.m.rotation.y += p.spin * d;
      }
    });

    // 隕石漂浮＋自轉
    rocks.forEach(r => {
      r.m.rotation.x += r.rx * d;
      r.m.rotation.y += r.ry * d;
      r.m.position.x = r.baseX + Math.sin(t * 0.15 + r.ph) * r.drift;
      r.m.position.y = r.baseY + Math.cos(t * 0.12 + r.ph) * r.drift * 0.6;
    });

    // 星星閃爍
    twinkles.forEach(s => {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.spd + s.ph));
      s.o.material.opacity = a;
    });

    // 星雲慢慢左右晃
    neb1.position.x = -40 + Math.sin(t * 0.08) * 6;
    neb2.position.x = 50 + Math.cos(t * 0.06) * 5;

    // 流星
    streaks.forEach((s, i) => {
      s.t += d;
      if (!s.active && s.t > 6 + i * 3) {
        s.active = true;
        s.m.visible = true;
        s.m.position.set(-60 + rnd() * 120, 30 + rnd() * 25, -50 - rnd() * 40);
        s.m.rotation.z = -0.6 - rnd() * 0.4;
        s.life = 0;
      }
      if (s.active) {
        s.life += d;
        s.m.position.x += 35 * d;
        s.m.position.y -= 22 * d;
        s.m.material.opacity = Math.max(0, 1 - s.life / 1.4);
        if (s.life > 1.4) {
          s.active = false; s.m.visible = false; s.t = 0;
        }
      }
    });

    // 幽浮飛來飛去
    ufos.forEach(u => {
      const a = t * u.sp + u.ph;
      u.group.position.set(
        Math.cos(a) * u.R,
        u.y + Math.sin(a * 1.7) * 2.5,
        u.z + Math.sin(a) * u.R * 0.35
      );
      u.group.rotation.y = -a + (u.sp > 0 ? Math.PI / 2 : -Math.PI / 2);
      u.group.rotation.z = Math.sin(t * 1.2 + u.ph) * 0.08;
      u.ring.rotation.z = t * 2;
      u.beam.material.opacity = 0.12 + 0.12 * (0.5 + 0.5 * Math.sin(t * 3 + u.ph));
      u.alien.rotation.y = Math.sin(t * 0.8 + u.ph) * 0.35;
    });
  };

  registerMap('space', {
    name: '太空戰場',
    group: g,
    W,
    plats,
    sky: spaceSkyT,
    fog: 0x120a28,
    fogNear: 50,
    fogFar: 220,
    hemi: [0xc0d0ff, 0x1a1030],
    sun: 0xe0e8ff,
    rim: 0x6080ff
  });
}
