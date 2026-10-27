/* 世志搞事 — rules (PLAN.md §4, §5, §6, §8, §12.2). Pure logic, no THREE; tested by tools/gaoshi_test.cjs. */
'use strict';
var GaoshiRules = (function(){
  const RULES = {
    pointsToWin:5, roundLimit:12, pickTimeSec:15, placeTimeSec:20, raceTimeSec:60, partyBoxSize:4,
    scoreFifths:{goal:5, solo:3, trap:1, coin:3, comeback:4, first:1},
  };
  RULES.winFifths = RULES.pointsToWin * 5;

  // solid: 'full' | 'hub' (center cell only) | null.  lethal: null | 'rect' | 'circle'.
  const ITEMS = {
    plank:{name:'木板', desc:'3 格長的平台，搭橋用', cat:'平台', w:3, h:1, solid:'full', weight:3},
    hay:{name:'稻草堆', desc:'2×2 的方塊，可以站、可以擋', cat:'平台', w:2, h:2, solid:'full', weight:2},
    wire:{name:'鐵絲網', desc:'碰到就倒下，要放在東西上面', cat:'危險物', w:2, h:1, needsSurface:true, lethal:'rect', trap:true, weight:2},
    saw:{name:'旋轉鋸', desc:'中間是方塊，周圍的鋸片碰到就倒下', cat:'危險物', w:3, h:3, solid:'hub', lethal:'circle', radius:1.35, trap:true, weight:2},
    bomb:{name:'炸彈', desc:'放下立刻炸掉 3×3 內的道具', cat:'炸彈', w:1, h:1, bomb:true, weight:1},
    coin:{name:'金幣', desc:'帶著它抵達終點，多拿 3/5 分', cat:'特殊', w:1, h:1, coin:true, weight:1},
  };

  // ---------- party box ----------
  function partyBox(rand, opts){
    opts = opts || {}; const ids = Object.keys(ITEMS), out = [];
    const weights = ids.map(id=>(opts.weights && opts.weights[id] !== undefined) ? opts.weights[id] : ITEMS[id].weight);
    const total = weights.reduce((a,b)=>a+b, 0);
    for (let k=0; k<RULES.partyBoxSize; k++){ let r = rand()*total, i = 0; while (r >= weights[i]){ r -= weights[i]; i++; } out.push(ids[Math.min(i, ids.length-1)]); }
    if (opts.guaranteeBomb && !out.includes('bomb')) out[Math.floor(rand()*out.length)] = 'bomb';   // §12.2 保底炸彈
    return out;
  }

  // ---------- placement ----------
  const rectsOverlap = (a,b)=> a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  // rotation r = number of 90° clockwise turns (0–3); odd turns swap width and height
  const dims = (type, r)=>{ const d = ITEMS[type]; return (r||0) % 2 ? {w:d.h, h:d.w} : {w:d.w, h:d.h}; };
  // turn a rect given in the item's unrotated local cells into world cells
  function rotRect(type, r, q, ox, oy){
    let W = ITEMS[type].w, H = ITEMS[type].h, x = q.x, y = q.y, w = q.w, h = q.h;
    for (let k=0; k<((r||0)%4); k++){ [x, y, w, h] = [H - y - h, x, h, w]; [W, H] = [H, W]; }
    return {x:ox + x, y:oy + y, w, h};
  }
  function itemSolids(it){
    const d = ITEMS[it.type], D = dims(it.type, it.r);
    if (d.solid === 'full') return [{x:it.x, y:it.y, w:D.w, h:D.h}];
    if (d.solid === 'hub') return [{x:it.x+Math.floor(D.w/2), y:it.y+Math.floor(D.h/2), w:1, h:1}];
    return [];
  }
  // barbed wire: the coil sits on its base side; the lethal strip is the coil, not the air above it
  const itemLethalRect = (it)=> rotRect(it.type, it.r, {x:0.05, y:0.3, w:ITEMS[it.type].w - 0.1, h:ITEMS[it.type].h - 0.3}, it.x, it.y);
  // world: {W,H,solid[y][x], items:[{type,x,y}], spawns, goalRects, map.noPlaceZones}
  function canPlace(world, type, x, y, r){
    const d0 = ITEMS[type], D = dims(type, r), d = Object.assign({}, d0, D), fp = {x, y, w:d.w, h:d.h};
    if (x < 0 || y < 0 || x + d.w > world.W || y + d.h > world.H) return {ok:false, why:'超出場地'};
    if (d.bomb) return {ok:true};
    for (let yy=y; yy<y+d.h; yy++) for (let xx=x; xx<x+d.w; xx++) if (world.solid[yy][xx]) return {ok:false, why:'和場景重疊'};
    for (const it of world.items){ const e = dims(it.type, it.r); if (rectsOverlap(fp, {x:it.x, y:it.y, w:e.w, h:e.h})) return {ok:false, why:'和道具重疊'}; }
    for (const z of (world.map.noPlaceZones || [])) if (rectsOverlap(fp, z)) return {ok:false, why:'這裡不能放'};
    for (const s of world.spawns) if (rectsOverlap(fp, {x:Math.floor(s.x)-1, y:s.y-3, w:3, h:3})) return {ok:false, why:'太靠近起點'};
    for (const g of world.goalRects) if (rectsOverlap(fp, {x:Math.floor(g.x)-1, y:Math.floor(g.y)-1, w:Math.ceil(g.w)+2, h:Math.ceil(g.h)+2})) return {ok:false, why:'太靠近終點旗'};
    if (d.needsSurface){
      // the base side turns with the item: 0 below, 1 left, 2 above, 3 right
      const solidCell = (cx, cy)=> cx < 0 || cx >= world.W || cy < 0 || cy >= world.H ? false : (world.solid[cy][cx] || world.items.some(it=>itemSolids(it).some(q=>rectsOverlap({x:cx, y:cy, w:1, h:1}, q))));
      const side = (r||0) % 4, cells = [];
      if (side === 0) for (let xx=x; xx<x+d.w; xx++) cells.push([xx, y+d.h]);
      if (side === 2) for (let xx=x; xx<x+d.w; xx++) cells.push([xx, y-1]);
      if (side === 1) for (let yy=y; yy<y+d.h; yy++) cells.push([x-1, yy]);
      if (side === 3) for (let yy=y; yy<y+d.h; yy++) cells.push([x+d.w, yy]);
      if (!cells.some(([cx,cy])=>solidCell(cx, cy))) return {ok:false, why: side === 0 ? '要放在東西上面' : '要貼著東西'};
    }
    return {ok:true};
  }
  function nearestLegal(world, type, x, y, rot){
    for (let r=0; r<40; r++) for (let dy=-r; dy<=r; dy++) for (let dx=-r; dx<=r; dx++){
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      if (canPlace(world, type, x+dx, y+dy, rot).ok) return {x:x+dx, y:y+dy};
    }
    return null;
  }
  // returns the items removed by a bomb at (x,y): everything touching the 3×3 around it
  function bombHits(world, x, y){
    const area = {x:x-1, y:y-1, w:3, h:3};
    return world.items.filter(it=>{ const d = dims(it.type, it.r); return rectsOverlap(area, {x:it.x, y:it.y, w:d.w, h:d.h}); });
  }

  // ---------- scoring (§5) ----------
  // ps: [{id, finished, order (0-based finish order or -1), coin, killedBy:{owner, trap} | null}]
  // streak: {id: rounds in a row this player missed while someone else finished}
  function scoreRound(ps, streak){
    const F = RULES.scoreFifths, n = ps.length, fin = ps.filter(p=>p.finished);
    const res = {}; ps.forEach(p=>res[p.id] = []);
    const nobody = fin.length === 0, everybody = fin.length === n;
    if (nobody || everybody){
      fin.forEach(p=>{ if (p.coin) res[p.id].push({k:'coin', v:F.coin}); });
      return {awards:res, verdict: everybody ? 'easy' : 'hard'};
    }
    const firstOrder = Math.min(...fin.map(p=>p.order));
    for (const p of fin){
      res[p.id].push({k:'goal', v:F.goal});
      if (fin.length === 1 && n >= 3) res[p.id].push({k:'solo', v:F.solo});
      if (p.order === firstOrder) res[p.id].push({k:'first', v:F.first});
      if (p.coin) res[p.id].push({k:'coin', v:F.coin});
      if ((streak[p.id] || 0) >= 2) res[p.id].push({k:'comeback', v:F.comeback});
    }
    for (const p of ps) if (p.killedBy && p.killedBy.trap && p.killedBy.owner !== undefined && p.killedBy.owner !== p.id && res[p.killedBy.owner])
      res[p.killedBy.owner].push({k:'trap', v:F.trap, victim:p.id});
    return {awards:res, verdict:'normal'};
  }
  function nextStreak(ps, streak){
    const anyone = ps.some(p=>p.finished), out = {};
    for (const p of ps) out[p.id] = (!p.finished && anyone) ? (streak[p.id] || 0) + 1 : 0;
    return out;
  }
  const total = (list)=>list.reduce((a,b)=>a + b.v, 0);
  // winners after adding this round; length > 1 means a tie (sudden death)
  function winners(scores, roundNo){
    const ids = Object.keys(scores), top = Math.max(...ids.map(i=>scores[i]));
    if (top >= RULES.winFifths || roundNo >= RULES.roundLimit) return ids.filter(i=>scores[i] === top).map(Number);
    return [];
  }
  const AWARD_NAME = {goal:'過關', first:'搶先', solo:'獨走', coin:'金幣', comeback:'逆襲', trap:'陷阱'};
  return { RULES, ITEMS, dims, rotRect, itemLethalRect, partyBox, canPlace, nearestLegal, bombHits, itemSolids, scoreRound, nextStreak, total, winners, AWARD_NAME, rectsOverlap };
})();
if (typeof module !== 'undefined') module.exports = GaoshiRules;
