// 世志搞事 logic tests: node tools/gaoshi_test.cjs
const P = require('../js/gaoshi-physics.js');
const M = require('../js/gaoshi-maps.js');
let fail = 0;
const ok = (name, cond, info='') => { console.log((cond ? 'ok   ' : 'FAIL ') + name + (info ? '  ' + info : '')); if (!cond) fail++; };

// flat test room: floor at row 16, optional extra columns
function room(extra){
  const W = 32, H = 18, g = Array.from({length:H}, ()=>Array(W).fill('.'));
  for (let x=0;x<W;x++){ g[16][x] = '#'; g[17][x] = '#'; }
  if (extra) extra(g);
  return { size:[W,H], grid:g.map(r=>r.join('')), goal:{x:-9,y:-9,w:0,h:0}, hazards:[], killY:99 };
}
function run(world, frames, inp){ for (let f=0; f<frames; f++) P.stepWorld(world, [typeof inp==='function' ? inp(f) : inp], P.DT); }

// jump height
{ const w = P.makeWorld(room()), p = P.addPlayer(w, 0, {x:5, y:16}); let top = 16;
  for (let f=0; f<90; f++){ P.stepWorld(w, [{jump:true}], P.DT); top = Math.min(top, p.y); }
  ok('站立跳高 5.0～5.1 格', Math.abs((16-top) - 5.05) < 0.1, (16-top).toFixed(3)); }
// short hop
{ const w = P.makeWorld(room()), p = P.addPlayer(w, 0, {x:5, y:16}); let top = 16;
  for (let f=0; f<90; f++){ P.stepWorld(w, [{jump:f<6}], P.DT); top = Math.min(top, p.y); }
  const h = 16-top; ok('提早 0.1 秒放開跳鍵：1 < 高度 < 5', h > 1 && h < 4.5, h.toFixed(3)); }
// speeds
for (const [run_, want, name] of [[false,7.7,'走速'],[true,12,'跑速']]){
  const w = P.makeWorld(room()), p = P.addPlayer(w, 0, {x:2, y:16});
  run(w, 60, {right:true, run:run_}); const x0 = p.x; run(w, 30, {right:true, run:run_});
  const v = (p.x - x0) / 0.5; ok(name + ' ' + want, Math.abs(v - want)/want < 0.02, v.toFixed(2)); }
// run-jump distance (info for tuning)
{ const w = P.makeWorld(room()), p = P.addPlayer(w, 0, {x:2, y:16}); run(w, 40, {right:true, run:true});
  const x0 = p.x; let f = 0; P.stepWorld(w, [{right:true, run:true, jump:true}], P.DT);
  while (p.y < 16 - 1e-6 || f < 3){ P.stepWorld(w, [{right:true, run:true, jump:true}], P.DT); if (++f > 200) break; }
  ok('跑跳水平距離（參考值約 9.4）', p.x - x0 > 8 && p.x - x0 < 11, (p.x - x0).toFixed(2)); }
// wall jump clearance: tall wall at x=20; how high above the jump-off point does one wall jump go
{ const w = P.makeWorld(room(g=>{ for (let y=0;y<16;y++) g[y][20] = '#'; })), p = P.addPlayer(w, 0, {x:17, y:16});
  run(w, 4, {right:true}); P.stepWorld(w, [{right:true, jump:true}], P.DT);
  let f = 0; while (!p.wall && f++ < 120) P.stepWorld(w, [{right:true, jump:true}], P.DT);
  // wait until sliding (falling) on the wall, then wall jump and measure rise
  run(w, 2, {right:true}); while (p.vy <= 0 && f++ < 200) P.stepWorld(w, [{right:true}], P.DT);
  const y0 = p.y; let top = y0; P.stepWorld(w, [{right:true, jump:true}], P.DT);
  for (let k=0;k<60;k++){ P.stepWorld(w, [{right:true, jump:true}], P.DT); top = Math.min(top, p.y); }
  ok('蹬牆最大翻越約 3.15', Math.abs((y0-top) - 3.15) < 0.2, (y0-top).toFixed(3)); }
// wall climb reaches higher by repeated wall jumps
{ const w = P.makeWorld(room(g=>{ for (let y=0;y<16;y++) g[y][20] = '#'; })), p = P.addPlayer(w, 0, {x:17, y:16}); let top = 16;
  for (let f=0; f<400; f++){ P.stepWorld(w, [{right:true, jump:(f%20)<12}], P.DT); top = Math.min(top, p.y); }
  ok('連續蹬同一面牆可以爬更高（> 7 格）', 16-top > 7, (16-top).toFixed(2)); }
// no tunnelling
{ const w = P.makeWorld(room(g=>{ for (let x=0;x<32;x++) g[10][x] = '#'; g[16].fill('.'); g[17].fill('.'); })); w.killY = 999;
  const p = P.addPlayer(w, 0, {x:5, y:-30}); p.vy = 38; run(w, 120, {});
  ok('從 40 格高落下不穿透 1 格平台', Math.abs(p.y - 10) < 1e-6, p.y.toFixed(3)); }
// crouch through 1-high gap: ceiling at row 14 from x=10
{ const mk = ()=>P.makeWorld(room(g=>{ for (let x=10;x<20;x++) g[14][x] = '#'; }));
  let w = mk(), p = P.addPlayer(w, 0, {x:5, y:16}); run(w, 120, {right:true});
  ok('站著進不去 1 格高縫隙', p.x < 10, p.x.toFixed(2));
  w = mk(); p = P.addPlayer(w, 0, {x:5, y:16}); run(w, 240, {right:true, crouch:true});
  ok('蹲下可以爬進去', p.x > 12, p.x.toFixed(2)); }
// coyote + buffer
{ const w = P.makeWorld(room(g=>{ for (let x=10;x<32;x++){ g[16][x]='.'; g[17][x]='.'; } })), p = P.addPlayer(w, 0, {x:8, y:16});
  let jumped = false;
  for (let f=0; f<120 && !jumped; f++){ const off = p.x - p.w/2 > 10; P.stepWorld(w, [{right:true, jump: off && !p.onGround}], P.DT); if (p.vy < -5) jumped = true; }
  ok('離開邊緣後短時間內按跳仍可起跳（土狼時間）', jumped); }
{ const w = P.makeWorld(room()), p = P.addPlayer(w, 0, {x:5, y:12}); let jumped = false;
  for (let f=0; f<120; f++){ const press = !p.onGround && p.y > 15.2; P.stepWorld(w, [{jump: press || (jumped===false && p.onGround && f>0 && false)}], P.DT); if (p.vy < -5) { jumped = true; break; } }
  ok('落地前按跳會在落地時起跳（緩衝跳）', jumped); }
// stacking
{ const w = P.makeWorld(room()), a = P.addPlayer(w, 0, {x:5, y:16}), b = P.addPlayer(w, 1, {x:5, y:12}); for (let f=0; f<60; f++) P.stepWorld(w, [{},{}], P.DT);
  ok('上方玩家可以站在下方玩家頭上', Math.abs(b.y - (a.y - a.h)) < 0.05, b.y.toFixed(3)); }
// maps
for (const m of M.LIST){
  ok(m.name + '：18 列 × 32 欄', m.grid.length === 18 && m.grid.every(r=>r.length === 32));
  const w = P.makeWorld(m); ok(m.name + '：4 個出生點，腳下是實心', w.spawns.length === 4 && w.spawns.every(s=>w.solid[s.y][Math.floor(s.x)]));
}
// rooftops: no items → nobody gets across; two planks → a scripted run reaches and touches the flag
const R = require('../js/gaoshi-rules.js');
function rooftopRun(withPlanks){
  const m = M.byId.rooftops, w = P.makeWorld(m); if (withPlanks) w.items = [{type:'plank',x:10,y:10,owner:0},{type:'plank',x:15,y:9,owner:0}];
  const p = P.addPlayer(w, 0);
  for (let f=0; f<600 && !p.done && p.alive; f++){ const fr = p.x - p.w/2; P.stepWorld(w, [{right:true, run:true, jump: (p.onGround && (fr > 5.6 && fr < 6.5 || fr > 12.4 && fr < 13.4 || fr > 17.4 && fr < 18.6 || fr > 24.0 && fr < 25.2)) || (!p.onGround && p.vy < 0)}], P.DT); }
  return p;
}
ok('屋頂：不放道具過不去', !rooftopRun(false).done);
{ const p = rooftopRun(true); ok('屋頂：放兩塊木板可以碰到旗子', p.done, 'x=' + p.x.toFixed(1)); }
// flag must really be touched: jumping high over the pole does not count
{ const m = M.byId.rooftops, w = P.makeWorld(m); const p = P.addPlayer(w, 0, {x:24, y:8}); w.goalRects.forEach(g=>{}); p.y = 2; p.vy = 0;
  for (let f=0; f<4; f++) P.stepWorld(w, [{}], P.DT); p.x = 29.5; p.y = 3.0; P.stepWorld(w, [{}], P.DT);
  ok('從旗子上方經過、沒碰到不算抵達', !p.done, 'y=' + p.y.toFixed(2)); }
// corpse touching the flag
{ const m = M.byId.rooftops, w = P.makeWorld(m); const p = P.addPlayer(w, 0, {x:28.6, y:8}); P.kill(p, {type:'fall'}); p.vx = 6; p.vy = 0;
  for (let f=0; f<60; f++) P.stepWorld(w, [{}], P.DT);
  ok('屍體碰到旗子：記錄死後碰旗，但不算抵達', p.postmortem && !p.done); }
// item hazards & trap attribution
{ const w = P.makeWorld(room()); w.items = [{type:'wire', x:10, y:15, owner:1}]; const p = P.addPlayer(w, 0, {x:5, y:16}); P.addPlayer(w, 1, {x:2, y:16});
  for (let f=0; f<90; f++) P.stepWorld(w, [{right:true},{}], P.DT);
  ok('碰到鐵絲網會倒下，死因記到放的人', !p.alive && p.cause.owner === 1 && p.cause.trap); }
{ const w = P.makeWorld(room()); w.items = [{type:'saw', x:10, y:13, owner:1}]; const p = P.addPlayer(w, 0, {x:5, y:16});
  for (let f=0; f<90; f++) P.stepWorld(w, [{right:true}], P.DT);
  ok('碰到旋轉鋸會倒下', !p.alive); }
// coin
{ const w = P.makeWorld(room()); const c = {type:'coin', x:8, y:15, owner:0, cx:8.5, cy:15.5}; w.items = [c]; const p = P.addPlayer(w, 0, {x:5, y:16});
  for (let f=0; f<40; f++) P.stepWorld(w, [{right:true}], P.DT);
  ok('碰到金幣會帶著走', c.carrier === 0 && Math.abs(c.cx - p.x) < 0.01);
  P.kill(p, {type:'fall'}); P.stepWorld(w, [{}], P.DT); ok('帶著金幣倒下會掉下金幣', c.carrier === undefined); }
// placement
{ const w = P.makeWorld(M.byId.rooftops);
  ok('放置：和場景重疊不行', !R.canPlace(w, 'plank', 0, 12).ok);
  ok('放置：空中的木板可以', R.canPlace(w, 'plank', 10, 10).ok);
  ok('放置：鐵絲網在空中不行', R.canPlace(w, 'wire', 10, 5).why === '要放在東西上面');
  ok('放置：鐵絲網放在屋頂上可以', R.canPlace(w, 'wire', 22, 7).ok);
  ok('放置：起點旁邊不行', !R.canPlace(w, 'plank', 1, 8).ok);
  ok('放置：終點旗旁邊不行', !R.canPlace(w, 'hay', 28, 6).ok);
  w.items.push({type:'plank', x:10, y:10}); ok('放置：和道具重疊不行', R.canPlace(w, 'hay', 11, 9).why === '和道具重疊');
  ok('放置：鐵絲網可以放在木板上', R.canPlace(w, 'wire', 10, 9).ok);
  ok('炸彈炸到 3×3 內的道具', R.bombHits(w, 13, 11).length === 1 && R.bombHits(w, 15, 11).length === 0);
  const n = R.nearestLegal(w, 'plank', 0, 12); ok('逾時會找最近的合法位置', n && R.canPlace(w, 'plank', n.x, n.y).ok); }
// scoring §5.1
{ const sc = (ps, st)=>{ const r = R.scoreRound(ps, st || {}); const o = {}; for (const id in r.awards) o[id] = R.total(r.awards[id]); return o; };
  const P0 = (id, fin, order, extra)=>Object.assign({id, finished:fin, order:fin ? order : -1, coin:false, killedBy:null}, extra || {});
  let r = sc([P0(0,true,0), P0(1,false), P0(2,false)]); ok('3 人 A 獨自先到 = 9/5', r[0] === 9);
  r = sc([P0(0,true,0), P0(1,true,1), P0(2,false)]); ok('3 人 A、B 到，A 先 = 6/5、5/5', r[0] === 6 && r[1] === 5);
  r = sc([P0(0,true,0), P0(1,false)]); ok('2 人 A 到 = 6/5（沒有獨走）', r[0] === 6);
  r = sc([P0(0,true,0), P0(1,true,1)]); ok('全員到達 = 0', r[0] === 0 && r[1] === 0);
  r = sc([P0(0,false), P0(1,false)]); ok('全員倒下 = 0', r[0] === 0 && r[1] === 0);
  r = sc([P0(0,true,0,{coin:true}), P0(1,true,1)]); ok('全員到達、A 帶金幣 = 只有 A 3/5', r[0] === 3 && r[1] === 0);
  r = sc([P0(0,true,1), P0(1,true,0), P0(2,false)], {0:2}); ok('A 連兩回合沒到，這回合到 = 加逆襲', r[0] === 9);
  r = sc([P0(0,false,-1,{killedBy:{owner:1,trap:true}}), P0(1,true,0), P0(2,false,-1,{killedBy:{owner:1,trap:true}})]); ok('B 的陷阱殺死 A、C 且 B 到 = 5+3+1+2', r[1] === 11);
  r = sc([P0(0,false,-1,{killedBy:{owner:0,trap:true}}), P0(1,true,0)]); ok('死在自己的陷阱上不算陷阱分', r[0] === 0);
  ok('兩人同分同回合達標 = 平手', R.winners({0:25, 1:25, 2:10}, 4).length === 2);
  ok('連續兩回合沒人得分 → 派對盒保證有炸彈', R.partyBox(()=>0.01, {guaranteeBomb:true}).includes('bomb')); }
console.log(fail ? fail + ' failed' : 'all passed'); process.exit(fail ? 1 : 0);
