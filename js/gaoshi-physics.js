/* 世志搞事 — pure 2D logic (no THREE). 1 unit = 1 grid cell, origin top-left, y grows downward.
 * Numbers follow PLAN.md §7.2. Loaded by gaoshi.html and by tools/gaoshi_test.cjs. */
'use strict';
var GaoshiPhysics = (function(){
  const G = 66;                                    // TODO(verify): 對照原作 — gravity not published
  // solved for the discrete 60 Hz step so the peak lands on the target height exactly
  const vFromApex = (h)=>{ const a = G/120; return a + Math.sqrt(a*a + 2*G*h); };
  const PHYSICS = {
    gravity:G, maxFallSpeed:38,
    walkSpeed:7.7, runSpeed:12, crawlSpeed:3,      // walk/run are official; crawl is ours
    accel:85, airAccel:60,                         // TODO(verify): 對照原作
    groundFrictionPer60:0.82, airDragPer60:0.94,
    jumpApex:5.05, jumpSpeed:vFromApex(5.05),
    springApex:8.0, springSpeed:vFromApex(8.0),
    wallJumpApex:3.15, wallJumpSpeedY:vFromApex(3.15),
    wallJumpSpeedXWalk:4.0, wallJumpSpeedXRun:8.5, // TODO(verify): 對照原作
    wallSlideSlow:3.8, wallSlideFast:12,
    player:{w:0.9, h:2.0, crouchH:0.95},
    coyoteTime:0.10, jumpBuffer:0.10, variableJump:true, jumpCutMultiplier:0.5,
    wallJumpInputLock:0.12, wallClimb:true, playersCollide:true,
  };
  const DT = 1/60, EPS = 1e-4, PROBE = 0.05;

  // ---------- world ----------
  // map: {size:[W,H], grid:[strings], goal, hazards, killY}; any char other than '.', 'S', 'F' is solid.
  function makeWorld(map){
    const [W,H] = map.size, spawns = [];
    const solid = map.grid.map((row,y)=>[...row].map((c,x)=>{ if (c==='S') spawns.push({x:x+0.5, y:y+1}); return !(c==='.'||c==='S'||c==='F'); }));
    return { W, H, map, solid, spawns, boxes:[], hazards:(map.hazards||[]).map(h=>Object.assign({angle:0}, h)), goal:map.goal, killY:map.killY, t:0, players:[], order:[] };
  }
  const tileSolid = (w,x,y)=> x<0 || x>=w.W ? true : (y<0 || y>=w.H ? false : w.solid[y][x]);
  const overlap = (a,b)=> a.l < b.r-EPS && a.r > b.l+EPS && a.t < b.b-EPS && a.b > b.t+EPS;
  // every solid rect touching r: tiles, placed boxes, and (optionally) other players as one-way tops
  function solidsIn(w, r, self, playersToo){
    const out = [];
    for (let y=Math.floor(r.t); y<=Math.floor(r.b-EPS); y++) for (let x=Math.floor(r.l); x<=Math.floor(r.r-EPS); x++)
      if (tileSolid(w,x,y)) out.push({l:x, r:x+1, t:y, b:y+1});
    for (const b of w.boxes) if (b.solid !== false){ const q = {l:b.x, r:b.x+b.w, t:b.y, b:b.y+b.h}; if (overlap(r,q)) out.push(q); }
    if (playersToo && PHYSICS.playersCollide) for (const p of w.players) if (p!==self && p.alive && !p.done){ const q = rectOf(p); if (overlap(r,q)) out.push(Object.assign(q,{player:p})); }
    return out;
  }
  const rectOf = (p)=>({l:p.x-p.w/2, r:p.x+p.w/2, t:p.y-p.h, b:p.y});

  // ---------- players ----------
  function addPlayer(w, i, spawn){
    const s = spawn || w.spawns[i % w.spawns.length];
    const p = { i, x:s.x, y:s.y, vx:0, vy:0, w:PHYSICS.player.w, h:PHYSICS.player.h, face:1, onGround:true, wall:0, crouch:false,
      coyote:0, buffer:0, jumping:false, lock:0, alive:true, done:false, finishT:0, deadT:0, cause:null, run:false, jumpPrev:false, events:[] };
    w.players.push(p); return p;
  }

  function moveX(w, p, dx){
    p.x += dx; const r = rectOf(p);
    if (p.x - p.w/2 < 0){ p.x = p.w/2; p.vx = 0; }
    if (p.x + p.w/2 > w.W){ p.x = w.W - p.w/2; p.vx = 0; }
    const hits = solidsIn(w, rectOf(p), p, false);
    if (!hits.length) return;
    if (dx > 0) p.x = Math.min(...hits.map(h=>h.l)) - p.w/2; else if (dx < 0) p.x = Math.max(...hits.map(h=>h.r)) + p.w/2;
    p.vx = 0; void r;
  }
  function moveY(w, p, dy){
    const prevB = p.y; p.y += dy;
    let hits = solidsIn(w, rectOf(p), p, dy > 0);
    // players only count as floor when we came from above them
    hits = hits.filter(h=>!h.player || prevB <= h.t + 0.05);
    if (!hits.length) return;
    if (dy > 0){ p.y = Math.min(...hits.map(h=>h.t)); p.vy = 0; p.onGround = true; }
    else if (dy < 0){ p.y = Math.max(...hits.map(h=>h.b)) + p.h; p.vy = 0; p.jumping = false; }
  }
  const probe = (w,p,dx,dy,players)=> solidsIn(w, (r=>({l:r.l+dx, r:r.r+dx, t:r.t+dy, b:r.b+dy}))(rectOf(p)), p, players)
    .filter(h=>!h.player || p.y <= h.t + 0.05).length > 0;

  // input: {left,right,jump,run,crouch} (booleans, held state)
  function stepPlayer(w, p, inp, dt){
    p.events.length = 0;
    if (!p.alive || p.done){
      if (!p.alive){ p.deadT += dt; p.vy = Math.min(p.vy + G*dt, PHYSICS.maxFallSpeed); p.vx *= Math.pow(0.9, dt*60); }
      else { p.vx = 0; p.vy = Math.min(p.vy + G*dt, PHYSICS.maxFallSpeed); }
      substep(w, p, dt); return;
    }
    const P = PHYSICS, dir = (inp.right?1:0) - (inp.left?1:0);
    const jumpPressed = inp.jump && !p.jumpPrev; p.jumpPrev = !!inp.jump; p.run = !!inp.run;

    // crouch (ground only); stand back up only if there is room
    const wantCrouch = !!inp.crouch && p.onGround;
    if (wantCrouch && !p.crouch){ p.crouch = true; p.h = P.player.crouchH; }
    else if (!wantCrouch && p.crouch){
      const hStand = P.player.h, r = {l:p.x-p.w/2, r:p.x+p.w/2, t:p.y-hStand, b:p.y-p.h};
      if (!solidsIn(w, r, p, false).length){ p.crouch = false; p.h = hStand; }
    }

    // horizontal
    if (dir) p.face = dir;
    if (p.lock > 0) p.lock -= dt;
    else {
      const max = p.crouch ? P.crawlSpeed : (inp.run ? P.runSpeed : P.walkSpeed);
      const acc = p.onGround ? P.accel : P.airAccel;
      if (dir){
        const target = dir*max;
        if (Math.sign(p.vx) === dir && Math.abs(p.vx) > max) p.vx += (target - p.vx) * (1 - Math.pow(p.onGround?0.82:0.97, dt*60));  // ease down from extra speed
        else p.vx += Math.sign(target - p.vx) * Math.min(Math.abs(target - p.vx), acc*dt);
      } else p.vx *= Math.pow(p.onGround ? P.groundFrictionPer60 : P.airDragPer60, dt*60);
      if (Math.abs(p.vx) < 0.01) p.vx = 0;
    }

    // jump: buffer + coyote + wall jump
    if (jumpPressed) p.buffer = P.jumpBuffer; else p.buffer -= dt;
    p.coyote = p.onGround ? P.coyoteTime : p.coyote - dt;
    if (p.buffer > 0 && !p.crouch){
      if (p.coyote > 0){ p.vy = -P.jumpSpeed; p.jumping = true; p.buffer = 0; p.coyote = 0; p.onGround = false; p.events.push('jump'); }
      else if (p.wall && !p.onGround && P.wallClimb){
        p.vy = -P.wallJumpSpeedY; p.vx = -p.wall * (inp.run ? P.wallJumpSpeedXRun : P.wallJumpSpeedXWalk);
        p.face = -p.wall; p.lock = P.wallJumpInputLock; p.jumping = true; p.buffer = 0; p.events.push('walljump');
      }
    }
    if (P.variableJump && p.jumping && !inp.jump && p.vy < 0){ p.vy *= P.jumpCutMultiplier; p.jumping = false; }
    if (p.vy >= 0) p.jumping = false;

    // gravity + wall slide
    p.vy = Math.min(p.vy + G*dt, P.maxFallSpeed);
    if (p.wall && !p.onGround && p.vy > 0) p.vy = Math.min(p.vy, dir === p.wall ? P.wallSlideSlow : P.wallSlideFast);

    const was = p.onGround; substep(w, p, dt);
    if (!was && p.onGround) p.events.push('land');
  }
  function substep(w, p, dt){
    const n = Math.max(1, Math.ceil(Math.max(Math.abs(p.vx), Math.abs(p.vy))*dt/0.25));
    p.onGround = false;
    for (let k=0; k<n; k++){ moveX(w, p, p.vx*dt/n); moveY(w, p, p.vy*dt/n); }
    p.onGround = p.vy >= 0 && probe(w, p, 0, PROBE, true);
    p.wall = p.onGround ? 0 : (probe(w,p,PROBE,0,false) ? 1 : probe(w,p,-PROBE,0,false) ? -1 : 0);
    if (p.x - p.w/2 <= EPS && !p.onGround) p.wall = -1;
    if (p.x + p.w/2 >= w.W - EPS && !p.onGround) p.wall = 1;
  }

  // players push each other sideways, half each
  function separatePlayers(w){
    if (!PHYSICS.playersCollide) return;
    const ps = w.players.filter(p=>p.alive && !p.done);
    for (let a=0; a<ps.length; a++) for (let b=a+1; b<ps.length; b++){
      const A = ps[a], B = ps[b], ra = rectOf(A), rb = rectOf(B);
      if (!overlap(ra, rb)) continue;
      const vOver = Math.min(ra.b, rb.b) - Math.max(ra.t, rb.t);
      if (vOver < 0.3) continue;                      // stacked: handled by landing
      const push = (Math.min(ra.r, rb.r) - Math.max(ra.l, rb.l)) / 2 + EPS, s = A.x < B.x ? -1 : 1;
      moveX(w, A, s*push); moveX(w, B, -s*push);
    }
  }

  // ---------- hazards ----------
  function bladeHits(h, r){
    const c = Math.cos(h.angle), s = Math.sin(h.angle), half = h.length/2;
    const sh = {l:r.l + (r.r-r.l)*0.1, r:r.r - (r.r-r.l)*0.1, t:r.t + (r.b-r.t)*0.1, b:r.b - (r.b-r.t)*0.1};  // ~80% damage box
    for (let d=-half; d<=half; d+=0.2){ const x = h.center[0] + c*d, y = h.center[1] + s*d;
      if (x > sh.l - h.thickness/2 && x < sh.r + h.thickness/2 && y > sh.t - h.thickness/2 && y < sh.b + h.thickness/2) return true; }
    return false;
  }
  function kill(p, cause){ if (!p.alive || p.done) return; p.alive = false; p.cause = cause; p.vy = -14; p.vx = -p.face*3; p.events.push('die'); }

  // ---------- world step (fixed 60 Hz) ----------
  function stepWorld(w, inputs, dt){
    dt = dt || DT; w.t += dt;
    for (const h of w.hazards) if (h.type === 'rotating_blade') h.angle = w.t / h.periodSec * Math.PI * 2;
    w.players.forEach((p,i)=>stepPlayer(w, p, inputs[i] || {}, dt));
    separatePlayers(w);
    for (const p of w.players){
      if (!p.alive || p.done) continue;
      const r = rectOf(p);
      if (p.y - p.h > w.killY) { kill(p, {type:'fall'}); continue; }
      for (const h of w.hazards) if (h.lethal && h.type === 'rotating_blade' && bladeHits(h, r)) kill(p, {type:'hazard', id:h.type});
      const g = w.goal;
      if (p.alive && overlap(r, {l:g.x, r:g.x+g.w, t:g.y, b:g.y+g.h})){ p.done = true; p.finishT = w.t; w.order.push(p.i); p.events.push('goal'); }
    }
  }
  const raceOver = (w)=> w.players.every(p=>!p.alive || p.done);

  return { PHYSICS, DT, makeWorld, addPlayer, stepPlayer, stepWorld, raceOver, rectOf, kill, solidsIn };
})();
if (typeof module !== 'undefined') module.exports = GaoshiPhysics;
