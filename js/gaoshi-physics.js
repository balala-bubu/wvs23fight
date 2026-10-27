/* 世志土木 — pure 2D logic (no THREE). 1 unit = 1 grid cell, origin top-left, y grows downward.
 * Numbers follow PLAN.md §7.2. Loaded by gaoshi.html and by tools/gaoshi_test.cjs. */
'use strict';
var GaoshiPhysics = (function(){
  const RL = (typeof GaoshiRules !== 'undefined') ? GaoshiRules : require('./gaoshi-rules.js');
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
  const FLAG = {pole:3.4, clothW:1.5, clothH:1.0};

  // ---------- world ----------
  // map: {size:[W,H], grid:[strings], goal, hazards, killY}; any char other than '.', 'S', 'F' is solid.
  function makeWorld(map){
    const [W,H] = map.size, spawns = [];
    let flag = null;
    const solid = map.grid.map((row,y)=>[...row].map((c,x)=>{ if (c==='S') spawns.push({x:x+0.5, y:y+1}); if (c==='F') flag = {x, y:y+1}; return !(c==='.'||c==='S'||c==='F'); }));
    // the goal is the flag itself: its pole and its cloth, so a runner has to really touch it
    const goalRects = flag ? [{x:flag.x+0.4, y:flag.y-FLAG.pole, w:0.2, h:FLAG.pole}, {x:flag.x+0.5, y:flag.y-FLAG.pole, w:FLAG.clothW, h:FLAG.clothH}] : [map.goal];
    const w = { W, H, map, solid, spawns, flag, goalRects, boxes:[], items:[], shots:[], ist:new Map(), hazards:(map.hazards||[]).map(h=>Object.assign({angle:0}, h)), killY:map.killY, t:0, players:[], order:[] };
    // elevator: a moving solid slab, parked at the top until someone stands on a button
    for (const h of w.hazards) if (h.type === 'elevator'){ h.y = h.top; h.state = 'idle'; h.wait = 0; h.pressed = h.buttons.map(()=>false); h.bi = w.boxes.length; w.boxes.push({x:h.x, y:h.y, w:h.w, h:0.5}); }
    return w;
  }
  const tileSolid = (w,x,y)=> x<0 || x>=w.W ? true : (y<0 || y>=w.H ? false : w.solid[y][x]);
  const overlap = (a,b)=> a.l < b.r-EPS && a.r > b.l+EPS && a.t < b.b-EPS && a.b > b.t+EPS;
  // every solid rect touching r: tiles, placed boxes, and (optionally) other players as one-way tops
  function solidsIn(w, r, self, playersToo){
    const out = [];
    for (let y=Math.floor(r.t); y<=Math.floor(r.b-EPS); y++) for (let x=Math.floor(r.l); x<=Math.floor(r.r-EPS); x++)
      if (tileSolid(w,x,y)) out.push({l:x, r:x+1, t:y, b:y+1});
    for (const b of w.boxes) if (b.solid !== false){ const q = {l:b.x, r:b.x+b.w, t:b.y, b:b.y+b.h}; if (overlap(r,q)) out.push(q); }
    for (const it of w.items) for (const q of solidsNow(w, it)) if (overlap(r,q)) out.push(q);
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
    const hits = solidsIn(w, rectOf(p), p, false).filter(h=>!h.oneway);
    if (!hits.length) return;
    for (const h of hits) if (h.item) shove(w, p, h.item, Math.sign(dx), 0);
    if (dx > 0) p.x = Math.min(...hits.map(h=>h.l)) - p.w/2; else if (dx < 0) p.x = Math.max(...hits.map(h=>h.r)) + p.w/2;
    p.vx = 0; void r;
  }
  function moveY(w, p, dy){
    const prevB = p.y; p.y += dy;
    let hits = solidsIn(w, rectOf(p), p, dy > 0);
    // players only count as floor when we came from above them
    hits = hits.filter(h=>!(h.player || h.oneway) || (dy > 0 && prevB <= h.t + 0.05));
    if (!hits.length) return;
    for (const h of hits) if (h.item) shove(w, p, h.item, 0, Math.sign(dy));
    if (dy > 0){ const t = Math.min(...hits.map(h=>h.t)), top = hits.find(h=>h.t === t); if (top && top.bounce && p.vy > 3) p.bounce = true; p.y = t; p.vy = 0; p.onGround = true; }
    else if (dy < 0){ p.y = Math.max(...hits.map(h=>h.b)) + p.h; p.vy = 0; p.jumping = false; }
  }
  const probe = (w,p,dx,dy,players)=> solidsIn(w, (r=>({l:r.l+dx, r:r.r+dx, t:r.t+dy, b:r.b+dy}))(rectOf(p)), p, players)
    .filter(h=>!(h.player || h.oneway) || (dy > 0 && p.y <= h.t + 0.05)).length > 0;

  // input: {left,right,jump,run,crouch} (booleans, held state)
  function stepPlayer(w, p, inp, dt){
    p.events.length = 0;
    if (!p.alive || p.done){
      if (!p.alive){ p.deadT += dt; p.vy = Math.min(p.vy + G*dt, PHYSICS.maxFallSpeed); p.vx *= Math.pow(0.9, dt*60); }
      else { p.vx = 0; p.vy = Math.min(p.vy + G*dt, PHYSICS.maxFallSpeed); }
      substep(w, p, dt); return;
    }
    const P = PHYSICS, dir = (inp.right?1:0) - (inp.left?1:0), gnd = p.onGround ? groundItem(w, p) : null;
    const slick = gnd && gnd.type === 'ice', sticky = !!p.honey;
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
      const max = (p.crouch ? P.crawlSpeed : (inp.run ? P.runSpeed : P.walkSpeed)) * (sticky ? 0.35 : 1);
      const acc = slick ? 18 : (p.onGround ? P.accel : P.airAccel);
      if (dir){
        const target = dir*max;
        if (Math.sign(p.vx) === dir && Math.abs(p.vx) > max) p.vx += (target - p.vx) * (1 - Math.pow(p.onGround?0.82:0.97, dt*60));  // ease down from extra speed
        else p.vx += Math.sign(target - p.vx) * Math.min(Math.abs(target - p.vx), acc*dt);
      } else p.vx *= Math.pow(slick ? 0.99 : (p.onGround ? P.groundFrictionPer60 : P.airDragPer60), dt*60);
      if (Math.abs(p.vx) < 0.01) p.vx = 0;
    }

    // jump: buffer + coyote + wall jump
    if (jumpPressed) p.buffer = P.jumpBuffer; else p.buffer -= dt;
    p.coyote = p.onGround ? P.coyoteTime : p.coyote - dt;
    if (p.buffer > 0 && !p.crouch){
      if (p.coyote > 0){ p.vy = -P.jumpSpeed * (sticky ? 0.6 : 1); p.jumping = true; p.buffer = 0; p.coyote = 0; p.onGround = false; p.events.push('jump'); }
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
    if (sticky && p.vy > 1) p.vy = 1;                                      // honey: you stick and slide slowly
    // jetpack: hold jump in the air (after the jump has topped out) to fly while the fuel lasts
    if (p.jet > 0 && inp.jump && !p.onGround && !p.jumping){ p.vy = Math.max(p.vy - 120*dt, -9); p.jet -= dt; if (p.jet <= 0) p.jet = 0; p.jetOn = true; } else p.jetOn = false;

    const was = p.onGround; substep(w, p, dt);
    // conveyor belts and gears carry whoever stands on them
    if (gnd && p.onGround && gnd.type === 'treadmill') moveX(w, p, ((gnd.r||0) === 2 ? -1 : 1) * 4.5 * dt);
    if (gnd && p.onGround && gnd.type === 'gear') moveX(w, p, ((gnd.r||0) % 2 ? -1 : 1) * 3 * dt);
    if (p.bounce){ p.bounce = false; p.vy = -P.springSpeed * (inp.jump ? 1 : 0.8); p.onGround = false; p.jumping = false; p.events.push('bounce'); }
    else if (!was && p.onGround) p.events.push('land');
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
      if (A.remote && B.remote) continue;
      const kA = B.remote ? 2 : 1, kB = A.remote ? 2 : 1;
      if (!A.remote) moveX(w, A, s*push*kA); if (!B.remote) moveX(w, B, -s*push*kB);
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
  // item hazards: barbed wire (lower part of its cells) and the saw disc around its hub
  function itemKills(it, r){
    const d = RL.ITEMS[it.type]; if (!d.lethal || d.lethal === 'dyn') return false;
    const sh = {l:r.l + (r.r-r.l)*0.1, r:r.r - (r.r-r.l)*0.1, t:r.t + (r.b-r.t)*0.1, b:r.b - (r.b-r.t)*0.05};   // ~80% damage box
    if (d.lethal === 'rect'){ const q = RL.itemLethalRect(it); return overlap(sh, {l:q.x, r:q.x+q.w, t:q.y, b:q.y+q.h}); }
    const D = RL.dims(it.type, it.r), cx = it.x + D.w/2, cy = it.y + D.h/2, nx = Math.max(sh.l, Math.min(cx, sh.r)), ny = Math.max(sh.t, Math.min(cy, sh.b));
    return (nx-cx)*(nx-cx) + (ny-cy)*(ny-cy) < d.radius*d.radius;
  }
  const rectBox = (q)=>({l:q.x, r:q.x+q.w, t:q.y, b:q.y+q.h});
  const shrink = (r)=>({l:r.l + (r.r-r.l)*0.1, r:r.r - (r.r-r.l)*0.1, t:r.t + (r.b-r.t)*0.1, b:r.b - (r.b-r.t)*0.05});   // ~80% damage box
  // elevator: idle at top → (button) down → wait at bottom → back up → idle. Riders move with it.
  function stepElevator(w, h, dt){
    h.pressed = h.buttons.map(bt=>w.players.some(p=>p.alive && !p.done && overlap(rectOf(p), {l:bt.x-0.55, r:bt.x+0.55, t:bt.y-0.4, b:bt.y+0.05})));
    let dy = 0;
    if (h.state === 'idle'){ if (h.pressed.some(Boolean)) h.state = 'down'; }
    else if (h.state === 'down'){ dy = Math.min(h.speed*dt, h.bottom - h.y); if (h.y + dy >= h.bottom - 1e-6){ h.state = 'wait'; h.wait = h.waitSec; } }
    else if (h.state === 'wait'){ h.wait -= dt; if (h.wait <= 0) h.state = 'up'; }
    else if (h.state === 'up'){ dy = -Math.min(h.speed*dt, h.y - h.top); if (h.y + dy <= h.top + 1e-6) h.state = 'idle'; }
    if (!dy) return;
    const riders = w.players.filter(p=>!p.remote && p.x + p.w/2 > h.x + EPS && p.x - p.w/2 < h.x + h.w - EPS && Math.abs(p.y - h.y) < 0.08 && p.vy >= 0);
    h.y += dy; w.boxes[h.bi].y = h.y;
    for (const p of riders){ p.y = h.y; if (dy < 0) p.vy = 0; }
    // the car shoves anyone it moves into; squeezed to less than half a body against something solid = crushed
    const car = {l:h.x, r:h.x + h.w, t:h.y, b:h.y + 0.5}, isCar = (q)=>Math.abs(q.l - car.l) < 1e-6 && Math.abs(q.t - car.t) < 1e-6;
    for (const p of w.players){
      if (p.remote || !p.alive || p.done) continue;
      const rider = riders.includes(p);
      if (!rider){ if (!overlap(rectOf(p), car)) continue; if (dy > 0){ p.y = car.b + p.h; p.vy = Math.max(p.vy, h.speed); } else { p.y = car.t; p.vy = 0; } }
      const pushedUp = rider || dy < 0, r = rectOf(p), hits = solidsIn(w, r, p, false).filter(q=>!isCar(q));
      if (!hits.length) continue;
      const edge = pushedUp ? Math.max(...hits.map(q=>q.b)) : Math.min(...hits.map(q=>q.t));   // ceiling above us / floor under us
      const depth = pushedUp ? edge - r.t : r.b - edge, gap = p.h - depth;
      if (gap >= PHYSICS.player.h/2){                 // squeezed but alive: crouch to fit, feet on the car or the floor
        p.crouch = true; p.h = Math.min(p.h, PHYSICS.player.crouchH); if (!pushedUp) p.y = edge;
      } else {                                        // flattened: crouched, then shoved out of the shaft sideways
        p.crouch = true; p.h = Math.max(0.3, Math.min(PHYSICS.player.crouchH, gap - 0.02)); if (!pushedUp) p.y = edge;
        kill(p, {type:'hazard', id:'crush'}); p.vx = (p.x < h.x + h.w/2 ? -1 : 1) * 8; p.vy = 0; p.face = p.vx > 0 ? -1 : 1;
      }
    }
  }
  const touchesGoal = (w, r)=> w.goalRects.some(g=>overlap(r, {l:g.x, r:g.x+g.w, t:g.y, b:g.y+g.h}));

  // ---------- placed items: moving parts, shooters, pickups (all clocked by w.t so every screen agrees) ----------
  const IT = RL.ITEMS, AIM = RL.AIM, UP = RL.UP;
  const tri = (u)=>{ u = ((u % 1) + 1) % 1; return u < .5 ? u*2 : 2 - u*2; };          // 0→1→0
  const ctr = (it)=>{ const D = RL.dims(it.type, it.r); return {x:it.x + D.w/2, y:it.y + D.h/2, w:D.w, h:D.h}; };
  const ptOf = (it, lx, ly)=>{ const q = RL.rotRect(it.type, it.r, {x:lx, y:ly, w:0, h:0}, it.x, it.y); return {x:q.x, y:q.y}; };
  const toBox = (q)=>({l:q.x, r:q.x+q.w, t:q.y, b:q.y+q.h});
  const phaseOf = (it)=> ((it.x*7 + it.y*13) % 10) / 10;                  // so two copies of a shooter don't fire in lockstep
  function ist(w, it){ let s = w.ist.get(it); if (!s){ s = {dx:0, dy:0, t0:0, off:false, open:0, hit:new Set()}; if (it.type === 'barrel'){ s.x = it.x; s.y = it.y; s.vx = 0; s.vy = 0; } w.ist.set(it, s); } return s; }
  // a band of thickness th sitting just outside the item's face in direction v (unit grid vector)
  function faceBand(it, v, th, len){
    const D = RL.dims(it.type, it.r), L = len || 0;
    if (v[1] < 0) return {l:it.x + .05, r:it.x + D.w - .05, t:it.y - th - L, b:it.y};
    if (v[1] > 0) return {l:it.x + .05, r:it.x + D.w - .05, t:it.y + D.h, b:it.y + D.h + th + L};
    if (v[0] > 0) return {l:it.x + D.w, r:it.x + D.w + th + L, t:it.y + .05, b:it.y + D.h - .05};
    return {l:it.x - th - L, r:it.x, t:it.y + .05, b:it.y + D.h - .05};
  }
  // solid rects of one item right now, tagged with what they are
  function solidsNow(w, it){
    const d = IT[it.type]; if (!d.solid) return [];
    const s = w.ist.get(it), tag = (q)=>Object.assign(toBox(q), {item:it, oneway:!!d.oneway, bounce:it.type === 'tire'});
    if (s && s.off) return [];
    if (s && s.solids) return s.solids.map(q=>Object.assign({}, q, {item:it, oneway:!!q.oneway}));
    if (it.type === 'barrel' && s){ const D = RL.dims(it.type, it.r); return [tag({x:s.x, y:s.y, w:D.w, h:D.h})]; }
    return RL.itemSolids(it).map(q=>tag({x:q.x + (s ? s.dx : 0), y:q.y + (s ? s.dy : 0), w:q.w, h:q.h}));
  }
  // what the runner is standing on (an item), if anything
  function groundItem(w, p){
    const r = {l:p.x - p.w/2 + .02, r:p.x + p.w/2 - .02, t:p.y, b:p.y + PROBE};
    for (const it of w.items) for (const q of solidsNow(w, it)) if (overlap(r, q)) return it;
    return null;
  }
  const standingOn = (w, it, p)=> p.alive && !p.done && p.onGround && groundItem(w, p) === it;
  // doors open when shoved, barrels get pushed
  function shove(w, p, it, sx, sy){
    if (p.remote) return; const s = ist(w, it);
    if (it.type === 'door' || it.type === 'onewaydoor'){
      const a = AIM[(it.r||0) % 4];
      if (it.type === 'door' || a[0]*sx + a[1]*sy > 0){ if (!s.open) p.events.push('door'); s.open = 0.9; }
    }
    if (it.type === 'barrel' && sx) s.vx = sx * Math.max(Math.abs(s.vx), 4.5);
  }
  // move a solid item by (dx,dy) and carry the runners standing on it
  function carry(w, it, s, nx, ny){
    const ddx = nx - s.dx, ddy = ny - s.dy; if (!ddx && !ddy) return;
    const riders = w.players.filter(p=>!p.remote && standingOn(w, it, p));
    const before = solidsNow(w, it); s.dx = nx; s.dy = ny;
    for (const p of riders){ p.y += ddy; if (ddy < 0) p.vy = Math.max(p.vy, 0); moveX(w, p, ddx); }
    // anyone the platform moved into is pushed out of the way
    const after = solidsNow(w, it);
    for (const p of w.players){ if (p.remote || !p.alive || p.done || riders.includes(p)) continue; const pr = rectOf(p);
      for (const q of after){ if (q.oneway || !overlap(pr, q)) continue;
        if (pr.b - q.t < 0.6 || ddy < 0) { p.y = q.t; p.vy = Math.min(p.vy, 0); } else if (ddy > 0) { p.y = q.b + p.h; p.vy = Math.max(p.vy, 0); } else moveX(w, p, ddx > 0 ? q.r - pr.l : q.l - pr.r); } }
    void before;
  }
  function fire(w, it, kind){
    const c = ctr(it), a = AIM[(it.r||0) % 4], sp = {cannon:9, crossbow:16, hockey:10, tennis:11, plane:5, bee:2}[kind];
    w.shots.push({kind, x:c.x + a[0]*.6, y:c.y + a[1]*.6, vx:a[0]*sp, vy:a[1]*sp, ttl:{cannon:6, crossbow:4, hockey:6, tennis:5, plane:9, bee:7}[kind], from:it, owner:it.owner,
      rad:{cannon:.35, crossbow:.2, hockey:.3, tennis:.25, plane:.3, bee:.22}[kind], lethal:kind !== 'tennis', trap:!!IT[it.type].trap, through:kind === 'plane' || kind === 'bee', grav:kind === 'hockey' || kind === 'tennis' ? 30 : 0, t:0});
    w.sfx = w.sfx || []; w.sfx.push(kind === 'bee' ? 'buzz' : 'shoot');
  }
  const shotSolid = (w, sh)=> solidsIn(w, {l:sh.x - sh.rad*.6, r:sh.x + sh.rad*.6, t:sh.y - sh.rad*.6, b:sh.y + sh.rad*.6}, null, false).filter(q=>q.item !== sh.from && !q.oneway);
  function slowAt(w, x, y){ for (const it of w.items) if (it.type === 'slowatch'){ const c = ctr(it); if (Math.hypot(x - c.x, y - c.y) < 4.5) return true; } return false; }
  function stepItems(w, dt){
    const t = w.t, live = (p)=>p.alive && !p.done;
    for (const it of w.items){
      const d = IT[it.type], s = ist(w, it), r = (it.r||0) % 4, c = ctr(it); s.kill = null;
      switch (it.type){
        case 'blueplat': { const k = (tri(t/5 + phaseOf(it)) - .5) * 6; carry(w, it, s, r % 2 ? 0 : k, r % 2 ? k : 0); break; }
        case 'redplat': { const k = (tri(t/2.6 + phaseOf(it)) - .5) * 6; carry(w, it, s, r % 2 ? k : 0, r % 2 ? 0 : k); break; }
        case 'purpleplat': { const a = (t/6 + phaseOf(it)) * Math.PI*2 * (r >= 2 ? -1 : 1); carry(w, it, s, Math.cos(a)*2 - 2, Math.sin(a)*2); break; }
        case 'dancer': { const P8 = [[0,0],[1,0],[2,0],[2,-1],[2,-2],[1,-2],[0,-2],[0,-1]], k = Math.floor(t/.55) % 8, q = P8[r >= 2 ? (8 - k) % 8 : k]; carry(w, it, s, q[0], q[1]); break; }
        case 'fanplat': { const ridden = w.players.some(p=>!p.remote && standingOn(w, it, p)); s.sink = Math.max(0, Math.min(3, (s.sink || 0) + (ridden ? 2.2 : -1.4) * dt)); carry(w, it, s, 0, s.sink); break; }
        case 'ferris': {
          const hub = RL.itemSolids(it)[0], a0 = t / 9 * Math.PI*2 * (r % 2 ? -1 : 1), seats = [];
          for (let k=0;k<4;k++){ const a = a0 + k*Math.PI/2, sx = c.x + Math.cos(a)*2, sy = c.y + Math.sin(a)*2; seats.push({x:sx, y:sy}); }
          const prev = s.seats; s.seats = seats;
          if (prev) for (let k=0;k<4;k++){ const o = prev[k], q = seats[k], top = {l:o.x - .8, r:o.x + .8, t:o.y - .2, b:o.y + .2};
            for (const p of w.players) if (!p.remote && live(p) && p.onGround && Math.abs(p.y - top.t) < .08 && p.x + p.w/2 > top.l && p.x - p.w/2 < top.r){ p.y += q.y - o.y; moveX(w, p, q.x - o.x); } }
          s.solids = [toBox(hub)].concat(seats.map(q=>({l:q.x - .8, r:q.x + .8, t:q.y - .2, b:q.y + .2, oneway:true})));
          break; }
        case 'crumble': {
          if (s.off){ s.back -= dt; if (s.back <= 0 && !w.players.some(p=>live(p) && overlap(rectOf(p), toBox({x:it.x, y:it.y, w:1, h:1})))){ s.off = false; s.crack = 0; } break; }
          if (s.crack > 0 || w.players.some(p=>standingOn(w, it, p))){ s.crack = (s.crack || 0) + dt; if (s.crack > .5){ s.off = true; s.back = 3; w.sfx = w.sfx || []; w.sfx.push('crumble'); } }
          break; }
        case 'fallblock': {
          if (s.off){ s.back -= dt; if (s.back <= 0){ s.off = false; s.fall = 0; s.vy = 0; s.dx = 0; s.dy = 0; } break; }
          if (!s.fall && w.players.some(p=>standingOn(w, it, p))) s.fall = .01;
          if (s.fall){ s.fall += dt; if (s.fall > .4){ s.vy = Math.min((s.vy || 0) + 30*dt, 20); carry(w, it, s, 0, s.dy + s.vy*dt); if (it.y + s.dy > w.H + 2){ s.off = true; s.back = 3; } } else s.shakeX = Math.sin(s.fall*80)*.06; }
          break; }
        case 'trigspike': {
          if (s.up > 0){ s.up -= dt; if (s.up <= 0) s.cool = .6; }
          else if (s.cool > 0) s.cool -= dt;
          else if (s.arm > 0){ s.arm -= dt; if (s.arm <= 0){ s.up = 1.2; w.sfx = w.sfx || []; w.sfx.push('spike'); } }
          else { const band = faceBand(it, UP[r], .3); if (w.players.some(p=>live(p) && overlap(rectOf(p), band))) s.arm = .35; }
          if (s.up > 0) s.kill = [faceBand(it, UP[r], .55)];
          break; }
        case 'flipblock': { s.side = Math.floor((t + phaseOf(it)*2.5) / 2.5) % 2; s.kill = [faceBand(it, s.side ? UP[(r + 2) % 4] : UP[r], .4)]; break; }
        case 'door': case 'onewaydoor': { if (s.open > 0){ s.open -= dt; const blocked = w.players.some(p=>live(p) && overlap(rectOf(p), toBox({x:it.x, y:it.y, w:ctr(it).w, h:ctr(it).h}))); if (s.open <= 0 && blocked) s.open = .1; } s.off = s.open > 0; break; }
        case 'barrel': {
          const D = RL.dims(it.type, it.r); if (s.off) break;
          const riders = w.players.filter(p=>!p.remote && standingOn(w, it, p));
          s.vy = Math.min(s.vy + 40*dt, 25);
          const hitsAt = (x, y)=> solidsIn(w, {l:x, r:x + D.w, t:y, b:y + D.h}, null, false).filter(q=>q.item !== it && !q.oneway);
          let nx = s.x + s.vx*dt; if (hitsAt(nx, s.y).length){ s.vx = 0; nx = s.x; }
          let ny = s.y + s.vy*dt, grounded = false; if (hitsAt(nx, ny).length){ if (s.vy > 0) grounded = true; s.vy = 0; ny = s.y; }
          if (grounded || hitsAt(nx, ny + .05).length) s.vx *= Math.pow(.93, dt*60);
          if (Math.abs(s.vx) < .05) s.vx = 0;
          const ddx = nx - s.x, ddy = ny - s.y; s.x = nx; s.y = ny; s.roll = (s.roll || 0) + ddx / (D.w/2);
          for (const p of riders){ p.y += ddy; moveX(w, p, ddx); }
          if (s.y > w.H + 3) s.off = true;
          break; }
        case 'linsaw': { const long = c.w >= c.h, u = tri(t/3 + phaseOf(it)), L = Math.max(c.w, c.h) - 1;
          s.sx = long ? it.x + .5 + u*L : c.x; s.sy = long ? c.y : it.y + .5 + u*L; s.kill = [{cx:s.sx, cy:s.sy, rad:.85}]; break; }
        case 'wrecking': { const piv = ptOf(it, 2.5, .5), a = Math.sin((t + phaseOf(it)*3.2) / 3.2 * Math.PI*2) * 1.05, base = Math.atan2(-UP[r][1], -UP[r][0]) * 0 + [Math.PI/2, Math.PI, -Math.PI/2, 0][r];
          // the chain hangs away from the pivot cell (down when unrotated)
          const ang = base + a; s.px = piv.x; s.py = piv.y; s.bx = piv.x + Math.cos(ang)*2.7; s.by = piv.y + Math.sin(ang)*2.7; s.swing = a; s.kill = [{cx:s.bx, cy:s.by, rad:.8}]; break; }
        case 'flame': { s.on = ((t + phaseOf(it)*3) % 3) < 1.2; if (s.on) s.kill = [faceBand(it, AIM[r], .1, 3.4)]; if (s.on && !s.was){ w.sfx = w.sfx || []; w.sfx.push('fire'); } s.was = s.on; break; }
        case 'blackhole': s.kill = [{cx:c.x, cy:c.y, rad:.55}]; s.spin = t*4; break;
        case 'spikeball': break;
        case 'cannon': case 'crossbow': case 'hockey': case 'tennis': case 'plane': {
          const per = {cannon:3, crossbow:2.2, hockey:3, tennis:2, plane:3}[it.type], k = Math.floor(t/per + phaseOf(it));
          if (s.last === undefined) s.last = k; else if (k > s.last){ s.last = k; fire(w, it, it.type); s.recoil = .2; }
          if (s.recoil > 0) s.recoil -= dt; break; }
        case 'beehive': { const k = Math.floor(t/4.5 + phaseOf(it)); if (s.last === undefined) s.last = k; else if (k > s.last){ s.last = k; fire(w, it, 'bee'); } break; }
        case 'glove': { const u = (t + phaseOf(it)*2) % 2; s.ext = u < .25 ? Math.sin(u/.25*Math.PI) : 0; if (u < .25){ if (!s.punching){ s.punching = true; s.hit.clear(); w.sfx = w.sfx || []; w.sfx.push('punch'); } s.zone = faceBand(it, AIM[r], .1, 2*s.ext); s.dir = AIM[r]; } else { s.punching = false; s.zone = null; } break; }
        case 'flower': {
          if (s.cd > 0) s.cd -= dt;
          if (s.wind > 0){ s.wind -= dt; if (s.wind <= 0){ s.punchT = .25; s.hit.clear(); w.sfx = w.sfx || []; w.sfx.push('punch'); } }
          else if (!(s.cd > 0) && !(s.punchT > 0)){ const near = w.players.find(p=>live(p) && Math.hypot(p.x - c.x, (p.y - 1) - c.y) < 2.6); if (near){ s.wind = .35; s.face = near.x < c.x ? -1 : 1; } }
          if (s.punchT > 0){ s.punchT -= dt; s.ext = Math.sin(Math.max(0, s.punchT)/.25*Math.PI); s.dir = [s.face, 0]; s.zone = faceBand(it, s.dir, .1, 1.8*s.ext + .4); if (s.punchT <= 0){ s.cd = 1.2; s.zone = null; s.ext = 0; } }
          break; }
        case 'hydrant': { const u = (t + phaseOf(it)*3) % 3; s.on = u < 1.1; s.zone = s.on ? faceBand(it, UP[r], .1, 5) : null; if (s.on && !s.was){ w.sfx = w.sfx || []; w.sfx.push('splash'); } s.was = s.on; break; }
        case 'fan': s.zone = faceBand(it, UP[r], .1, 7.5); s.spin = t*20; break;
        case 'gear': s.spin = t * ((it.r||0) % 2 ? 1 : -1) * 1.6; break;
        case 'treadmill': s.roll = t * ((it.r||0) === 2 ? -1 : 1) * 4.5; break;
        case 'teleporter': s.spin = t*3; break;
      }
    }
    // projectiles
    for (let i=w.shots.length-1; i>=0; i--){
      const sh = w.shots[i], k = slowAt(w, sh.x, sh.y) ? .4 : 1, ddt = dt*k; sh.t += ddt; sh.ttl -= ddt;
      if (sh.kind === 'bee'){ let best = null, bd = 1e9; for (const p of w.players) if (p.alive && !p.done){ const dd = Math.hypot(p.x - sh.x, p.y - 1 - sh.y); if (dd < bd){ bd = dd; best = p; } }
        if (best){ sh.vx += Math.sign(best.x - sh.x) * 6 * ddt; sh.vy += Math.sign(best.y - 1 - sh.y) * 6 * ddt; } const v = Math.hypot(sh.vx, sh.vy), mx = 4.2; if (v > mx){ sh.vx *= mx/v; sh.vy *= mx/v; } sh.vy += Math.sin(sh.t*9)*.15; }
      for (const it of w.items) if (it.type === 'blackhole'){ const c = ctr(it), dx = c.x - sh.x, dy = c.y - sh.y, dd = Math.hypot(dx, dy); if (dd < 6 && dd > .1){ const a = 40*(1 - dd/6) + 6; sh.vx += dx/dd*a*ddt; sh.vy += dy/dd*a*ddt; } if (dd < .6) sh.ttl = 0; }
      sh.vy += sh.grav * ddt;
      // move x then y so pucks slide along floors and tennis balls bounce off walls
      const ox = sh.x, oy = sh.y; sh.x += sh.vx*ddt;
      if (!sh.through && shotSolid(w, sh).length){ if (sh.kind === 'tennis'){ sh.x = ox; sh.vx *= -.85; } else sh.ttl = 0; }
      sh.y += sh.vy*ddt;
      if (!sh.through && sh.ttl > 0 && shotSolid(w, sh).length){
        if (sh.kind === 'tennis'){ sh.y = oy; sh.vy *= -.78; }
        else if (sh.kind === 'hockey' && sh.vy > 0){ sh.y = oy; sh.vy = 0; }
        else sh.ttl = 0; }
      if (sh.x < -2 || sh.x > w.W + 2 || sh.y > w.H + 2 || sh.y < -4) sh.ttl = 0;
      if (sh.ttl <= 0){ if (sh.kind === 'cannon' || sh.kind === 'crossbow' || sh.kind === 'hockey'){ w.puffs = w.puffs || []; w.puffs.push([sh.x, sh.y, sh.kind]); } w.shots.splice(i, 1); }
    }
  }
  // forces and pickups on one local runner (after it moved)
  function itemEffects(w, p, dt){
    const r = rectOf(p), cxp = p.x, cyp = p.y - p.h/2; p.honey = false; if (p.tpCD > 0) p.tpCD -= dt; if (p.springCD > 0) p.springCD -= dt;
    const knock = (vx, vy)=>{ p.vx = vx; p.vy = vy; p.lock = .3; p.onGround = false; p.jumping = false; p.events.push('knock'); };
    for (const it of w.items){
      const s = ist(w, it), c = ctr(it), box = toBox({x:it.x, y:it.y, w:c.w, h:c.h}), ro = (it.r||0) % 4;
      switch (it.type){
        case 'spring': if (!(p.springCD > 0) && overlap(r, {l:box.l + .1, r:box.r - .1, t:box.t + .3, b:box.b})){ const v = UP[ro]; p.springCD = .25; s.pop = .3;
          if (v[1]) { p.vy = v[1] * PHYSICS.springSpeed; p.onGround = false; p.jumping = false; } else { p.vx = v[0] * 17; p.vy = -9; p.lock = .3; }
          p.events.push('bounce'); } break;
        case 'honey': if (overlap(r, {l:box.l - .1, r:box.r + .1, t:box.t - .1, b:box.b + .1})) p.honey = true; break;
        case 'fan': case 'hydrant': if (s.zone && overlap(r, s.zone)){ const v = UP[ro], f = it.type === 'fan' ? 80 : 0;
          if (it.type === 'hydrant'){ if (v[1] < 0) p.vy = Math.min(p.vy, -15); else if (v[1] > 0) p.vy = Math.max(p.vy, 15); else p.vx = v[0]*14; p.onGround = false; p.jumping = false; }
          else { p.vx += v[0]*f*dt; if (v[1] < 0){ p.vy = Math.max(p.vy - (G + 40)*dt, -10); p.onGround = false; } else p.vy += v[1]*f*dt; } } break;
        case 'magnet': { const dx = c.x - cxp, dy = c.y - cyp, dd = Math.hypot(dx, dy); if (dd < 6 && dd > .5){ p.vx += dx/dd*30*dt; p.vy += dy/dd*30*dt; } break; }
        case 'blackhole': { const dx = c.x - cxp, dy = c.y - cyp, dd = Math.hypot(dx, dy); if (dd < 6.5 && dd > .2){ const a = 55*(1 - dd/6.5) + 10; p.vx += dx/dd*a*dt; p.vy += dy/dd*a*dt; } break; }
        case 'teleporter': if (!(p.tpCD > 0) && overlap(r, box)){ const tps = w.items.filter(q=>q.type === 'teleporter'), k = tps.indexOf(it), mate = tps[k ^ 1];
          if (mate){ const m = ctr(mate); p.x = m.x; p.y = mate.y + m.h; p.tpCD = .7; p.events.push('tp'); } } break;
        case 'jetpack': if (!s.taken && overlap(r, box)){ s.taken = true; p.jet = 3; p.events.push('jet'); } break;
        case 'jetdisp': if (overlap(r, {l:box.l - .12, r:box.r + .12, t:box.t - .12, b:box.b + .12}) && !(p.jet > 2.9)){ if (!(p.jet > 0)) p.events.push('jet'); p.jet = 3; } break;
        case 'glove': case 'flower': if (s.zone && !s.hit.has(p) && overlap(r, s.zone)){ s.hit.add(p); knock(s.dir[0]*16, s.dir[1] ? s.dir[1]*16 : -8); } break;
      }
    }
    for (const sh of w.shots) if (!sh.lethal && sh.ttl > 0 && Math.hypot(sh.x - cxp, sh.y - cyp) < sh.rad + .55){ knock(Math.sign(sh.vx || 1)*13, -8); sh.ttl = 0; }
  }
  // lethal parts of items that move or switch on and off, plus lethal projectiles
  function dynKills(w, p){
    const r = rectOf(p), sh = shrink(r), hitC = (cx, cy, rad)=>{ const nx = Math.max(sh.l, Math.min(cx, sh.r)), ny = Math.max(sh.t, Math.min(cy, sh.b)); return (nx-cx)*(nx-cx) + (ny-cy)*(ny-cy) < rad*rad; };
    for (const it of w.items){ const s = w.ist.get(it); if (!s || !s.kill) continue;
      for (const k of s.kill) if (k.rad ? hitC(k.cx, k.cy, k.rad) : overlap(sh, k)) return {type:'item', item:it.type, owner:it.owner, trap:!!IT[it.type].trap}; }
    for (const s of w.shots) if (s.lethal && s.ttl > 0 && hitC(s.x, s.y, s.rad)){ s.ttl = 0; return {type:'item', item:s.from.type, owner:s.owner, trap:s.trap}; }
    return null;
  }
  const itemState = (w, it)=> ist(w, it);

  // ---------- world step (fixed 60 Hz) ----------
  function stepWorld(w, inputs, dt){
    dt = dt || DT; w.t += dt;
    for (const h of w.hazards) if (h.type === 'rotating_blade') h.angle = w.t / h.periodSec * Math.PI * 2;
    for (const h of w.hazards) if (h.type === 'elevator') stepElevator(w, h, dt);
    // waterfall: anyone in the water is pushed down (falls faster, jumps lower)
    for (const h of w.hazards) if (h.type === 'push') for (const p of w.players) if (!p.remote && p.alive && !p.done && overlap(rectOf(p), rectBox(h.rect))) p.vy = Math.min(p.vy + h.accel*dt, Math.max(p.vy, h.maxVy));
    // online: other people's runners are puppets driven by the network, only local runners are simulated here
    stepItems(w, dt);
    // a slowatch nearby runs a runner at half speed
    w.players.forEach((p,i)=>{ if (!p.remote){ const slow = p.alive && !p.done && slowAt(w, p.x, p.y - 1); p.slow = slow; stepPlayer(w, p, inputs[i] || {}, slow ? dt*.5 : dt); if (p.alive && !p.done) itemEffects(w, p, dt); } else p.events.length = 0; });
    separatePlayers(w);
    for (const p of w.players){
      if (p.remote) continue;
      const r = rectOf(p);
      if (!p.alive){
        // 原作：屍體被彈到旗子上也算碰到旗子（死後碰旗）；掉出畫面的屍體就消失
        if (!p.postmortem && !p.gone && touchesGoal(w, r)){ p.postmortem = true; p.events.push('postmortem'); }
        if (!p.gone && p.y - p.h > w.killY){ p.gone = true; }
        continue;
      }
      if (p.done) continue;
      if (p.y - p.h > w.killY) { kill(p, {type:'fall'}); p.gone = true; continue; }
      for (const h of w.hazards) if (h.lethal && h.type === 'rotating_blade' && bladeHits(h, r)) kill(p, {type:'hazard', id:h.type});
      for (const h of w.hazards) if (h.lethal && h.type === 'spikes' && p.alive && overlap(shrink(r), rectBox(h.rect))) kill(p, {type:'hazard', id:h.look || h.type});
      for (const it of w.items) if (p.alive && itemKills(it, r)) kill(p, {type:'item', item:it.type, owner:it.owner, trap:!!RL.ITEMS[it.type].trap});
      if (p.alive){ const k = dynKills(w, p); if (k) kill(p, k); }
      if (!p.alive) continue;
      for (const it of w.items) if (it.type === 'coin' && it.carrier === undefined && overlap(r, {l:it.cx-0.4, r:it.cx+0.4, t:it.cy-0.4, b:it.cy+0.4})){ it.carrier = p.i; p.coin = it; p.events.push('coin'); }
      if (touchesGoal(w, r)){ p.done = true; p.finishT = w.t; w.order.push(p.i); p.events.push('goal'); }
    }
    // a coin follows its carrier; if the carrier dies it drops where they fell
    for (const it of w.items) if (it.type === 'coin' && it.carrier !== undefined){
      const p = w.players[it.carrier];
      if (p.alive || p.done){ it.cx = p.x; it.cy = p.y - p.h - 0.6; }
      else { it.carrier = undefined; p.coin = null; it.cx = Math.max(0.5, Math.min(w.W-0.5, p.x)); it.cy = Math.min(p.y - 0.5, w.H - 0.5); if (p.gone){ it.cx = it.x + 0.5; it.cy = it.y + 0.5; } }
    }
  }
  const raceOver = (w)=> w.players.every(p=>!p.alive || p.done);
  // §5 input: who finished, in which order, with a coin, and which trap killed whom
  const roundResult = (w)=> w.players.map(p=>({id:p.i, finished:p.done, order:p.done ? w.order.indexOf(p.i) : -1, coin:!!(p.done && p.coin), killedBy:p.cause && p.cause.type === 'item' ? {owner:p.cause.owner, trap:p.cause.trap} : null}));

  return { PHYSICS, DT, FLAG, itemState, solidsNow, roundResult, makeWorld, addPlayer, stepPlayer, stepWorld, raceOver, rectOf, kill, solidsIn };
})();
if (typeof module !== 'undefined') module.exports = GaoshiPhysics;
