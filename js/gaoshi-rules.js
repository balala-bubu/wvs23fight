/* 世志土木 — rules (PLAN.md §4, §5, §6, §8, §12.2). Pure logic, no THREE; tested by tools/gaoshi_test.cjs. */
'use strict';
var GaoshiRules = (function(){
  const RULES = {
    pointsToWin:5, roundLimit:12, pickTimeSec:15, placeTimeSec:20, raceTimeSec:60, partyBoxSize:4,
    scoreFifths:{goal:5, solo:3, trap:1, coin:3, comeback:4, first:1},
  };
  RULES.winFifths = RULES.pointsToWin * 5;

  // solid: 'full' | 'hub' (center cell only) | null.  lethal: null | 'rect' | 'circle'.
  // cells: solid cells in unrotated local coords. dyn: physics moves/toggles its solids during the race.
  // aim: shooters point right at r=0 and turn clockwise; things with a base (springs, fans…) point up at r=0.
  const ITEMS = {
    // —— 平台 ——
    plank:{name:'木板', desc:'3 格長的平台，搭橋用', cat:'平台', w:3, h:1, solid:'full', weight:3},
    wood1:{name:'小木塊', desc:'1 格的木頭方塊', cat:'平台', w:1, h:1, solid:'full', weight:2},
    hay:{name:'稻草堆', desc:'2×2 的方塊，可以站、可以擋', cat:'平台', w:2, h:2, solid:'full', weight:2},
    girder:{name:'L 型鋼樑', desc:'L 形的鋼樑，可以站、可以擋', cat:'平台', w:3, h:2, solid:'cells', cells:[[0,0],[0,1],[1,1],[2,1]], weight:2},
    stairs:{name:'樓梯', desc:'一階一階往上爬', cat:'平台', w:3, h:3, solid:'cells', cells:[[2,0],[1,1],[2,1],[0,2],[1,2],[2,2]], weight:2},
    scaffold:{name:'鷹架', desc:'可以從下面跳上去的平台', cat:'平台', w:3, h:1, solid:'full', oneway:true, weight:2},
    ice:{name:'冰塊', desc:'很滑的平台，停不下來', cat:'平台', w:3, h:1, solid:'full', weight:2},
    tire:{name:'輪胎', desc:'踩上去會彈很高', cat:'平台', w:2, h:1, solid:'full', weight:2},
    crumble:{name:'碎裂磚', desc:'站上去一下就碎掉，過一陣子復原', cat:'平台', w:1, h:1, solid:'full', dyn:true, weight:2},
    fallblock:{name:'掉落方塊', desc:'站上去就往下掉', cat:'平台', w:2, h:1, solid:'full', dyn:true, weight:2},
    flipblock:{name:'翻轉方塊', desc:'帶刺的方塊，每隔一下翻面', cat:'危險物', w:1, h:1, solid:'full', dyn:true, trap:true, weight:1},
    blueplat:{name:'藍色平台', desc:'左右來回移動（轉向可改上下）', cat:'移動平台', w:3, h:1, solid:'full', dyn:true, weight:2},
    redplat:{name:'紅色平台', desc:'快速上下來回移動', cat:'移動平台', w:2, h:1, solid:'full', dyn:true, weight:2},
    purpleplat:{name:'紫色平台', desc:'繞著圓圈轉', cat:'移動平台', w:2, h:1, solid:'full', dyn:true, weight:2},
    dancer:{name:'跳舞平台', desc:'跟著節拍一步一步走方形', cat:'移動平台', w:2, h:1, solid:'full', dyn:true, weight:1},
    fanplat:{name:'風扇平台', desc:'靠風扇浮著，站上去會往下沉', cat:'移動平台', w:3, h:1, solid:'full', dyn:true, weight:1},
    ferris:{name:'摩天輪', desc:'四個座位繞著轉，可以搭', cat:'移動平台', w:5, h:5, solid:'hub', dyn:true, weight:1},
    gear:{name:'齒輪', desc:'會轉，站在上面會被帶著走', cat:'移動平台', w:3, h:3, solid:'full', dyn:true, weight:1},
    treadmill:{name:'輸送帶', desc:'站上去會被送往箭頭方向', cat:'機關', w:3, h:1, solid:'full', weight:2},
    barrel:{name:'木桶', desc:'推得動、會滾、會掉', cat:'機關', w:2, h:2, solid:'full', dyn:true, weight:1},
    door:{name:'門', desc:'擋路的門，用力推就打開', cat:'機關', w:1, h:3, solid:'full', dyn:true, weight:1},
    onewaydoor:{name:'單向門', desc:'只能往箭頭方向推開', cat:'機關', w:1, h:3, solid:'full', dyn:true, weight:1},
    teleporter:{name:'傳送門', desc:'兩個一組，走進去從另一個出來', cat:'機關', w:1, h:2, weight:2},
    spring:{name:'彈簧', desc:'碰到就彈飛，可以轉方向', cat:'機關', w:1, h:1, needsSurface:true, weight:2},
    fan:{name:'電風扇', desc:'把人吹往風的方向', cat:'機關', w:2, h:1, solid:'full', weight:2},
    hydrant:{name:'消防栓', desc:'定時噴水把人往上沖', cat:'機關', w:1, h:1, solid:'full', weight:1},
    magnet:{name:'磁鐵平台', desc:'把附近的人吸過來', cat:'機關', w:3, h:1, solid:'full', weight:1},
    blackhole:{name:'黑洞', desc:'把人吸進去，碰到中心就倒下', cat:'危險物', w:2, h:2, lethal:'dyn', trap:true, weight:1},
    honey:{name:'蜂蜜', desc:'黏黏的，碰到會變慢、跳不高', cat:'機關', w:1, h:1, needsSurface:true, weight:2},
    slowatch:{name:'慢速錶', desc:'附近的人和子彈都變慢', cat:'機關', w:1, h:1, weight:1},
    jetpack:{name:'噴射背包', desc:'撿起來後按住跳可以飛一下', cat:'特殊', w:1, h:1, weight:1},
    jetdisp:{name:'背包販賣機', desc:'碰它就裝滿噴射背包，可以一直拿', cat:'特殊', w:1, h:2, solid:'full', weight:1},
    // —— 危險物 ——
    wire:{name:'鐵絲網', desc:'碰到就倒下，要放在東西上面', cat:'危險物', w:2, h:1, needsSurface:true, lethal:'rect', trap:true, weight:2},
    saw:{name:'旋轉鋸', desc:'鋸片繞著中間的方塊轉圈，碰到就倒下', cat:'危險物', w:3, h:3, solid:'hub', lethal:'dyn', radius:1.5, trap:true, weight:2},
    linsaw:{name:'直線鋸', desc:'鋸片沿著軌道來回跑', cat:'危險物', w:5, h:1, lethal:'dyn', trap:true, weight:1},
    spikeball:{name:'刺球', desc:'全身是刺，碰到就倒下', cat:'危險物', w:1, h:1, lethal:'circle', radius:.48, trap:true, weight:2},
    trigspike:{name:'陷阱尖刺', desc:'踩上去一下就冒出尖刺', cat:'危險物', w:1, h:1, solid:'full', dyn:true, trap:true, weight:2},
    wrecking:{name:'破壞球', desc:'大鐵球左右擺盪', cat:'危險物', w:5, h:4, solid:'pivot', lethal:'dyn', trap:true, weight:1},
    flame:{name:'噴火器', desc:'定時噴出火焰', cat:'危險物', w:1, h:1, solid:'full', lethal:'dyn', trap:true, weight:1},
    beehive:{name:'蜂窩', desc:'蜜蜂飛出來追人', cat:'危險物', w:1, h:1, solid:'full', trap:true, weight:1},
    // —— 發射器 ——
    cannon:{name:'大砲', desc:'走進去就被裝填，再以 45 度仰角射出去', cat:'機關', w:1, h:1, solid:'full', weight:1},
    crossbow:{name:'十字弓', desc:'定時射出很快的箭', cat:'發射器', w:1, h:1, solid:'full', trap:true, weight:1},
    hockey:{name:'冰球發射器', desc:'射出沿著地面滑的冰球', cat:'發射器', w:1, h:1, solid:'full', trap:true, weight:1},
    tennis:{name:'網球發射器', desc:'射出會彈跳的網球，打到會被撞飛', cat:'發射器', w:1, h:1, solid:'full', weight:1},
    plane:{name:'紙飛機發射器', desc:'紙飛機會穿過牆壁', cat:'發射器', w:1, h:1, solid:'full', trap:true, weight:1},
    glove:{name:'拳擊手套', desc:'定時出拳把人打飛', cat:'發射器', w:1, h:1, solid:'full', weight:1},
    flower:{name:'拳擊花', desc:'有人靠近就出拳', cat:'發射器', w:1, h:1, solid:'full', weight:1},
    // —— 炸彈 ——
    bomb:{name:'炸彈', desc:'放下立刻炸掉 3×3 內的道具', cat:'炸彈', w:1, h:1, bomb:1, weight:1},
    minibomb:{name:'小炸彈', desc:'只炸掉這一格的道具', cat:'炸彈', w:1, h:1, bomb:0, weight:1},
    megabomb:{name:'超級炸彈', desc:'炸掉 5×5 內的道具', cat:'炸彈', w:1, h:1, bomb:2, weight:1},
    coin:{name:'金幣', desc:'帶著它抵達終點，多拿 3/5 分', cat:'特殊', w:1, h:1, coin:true, weight:1},
  };
  // direction helpers: aim = shooters (r0 → right), up = things with a base (r0 → up)
  const AIM = [[1,0],[0,1],[-1,0],[0,-1]], UP = [[0,-1],[1,0],[0,1],[-1,0]];
  const isBomb = (type)=> ITEMS[type] && ITEMS[type].bomb !== undefined && ITEMS[type].bomb !== false;

  // ---------- party box ----------
  function partyBox(rand, opts){
    opts = opts || {}; const ids = Object.keys(ITEMS), out = [];
    const weights = ids.map(id=>(opts.weights && opts.weights[id] !== undefined) ? opts.weights[id] : ITEMS[id].weight);
    const total = weights.reduce((a,b)=>a+b, 0);
    for (let k=0; k<RULES.partyBoxSize; k++){ let r = rand()*total, i = 0; while (r >= weights[i]){ r -= weights[i]; i++; } out.push(ids[Math.min(i, ids.length-1)]); }
    if (opts.guaranteeBomb && !out.some(isBomb)) out[Math.floor(rand()*out.length)] = 'bomb';   // §12.2 保底炸彈
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
    if (d.solid === 'cells') return d.cells.map(([cx,cy])=>rotRect(it.type, it.r, {x:cx, y:cy, w:1, h:1}, it.x, it.y));
    if (d.solid === 'pivot') return [rotRect(it.type, it.r, {x:Math.floor(d.w/2), y:0, w:1, h:1}, it.x, it.y)];
    return [];
  }
  // barbed wire: the coil sits on its base side; the lethal strip is the coil, not the air above it
  const itemLethalRect = (it)=> rotRect(it.type, it.r, {x:0.05, y:0.3, w:ITEMS[it.type].w - 0.1, h:ITEMS[it.type].h - 0.3}, it.x, it.y);
  // world: {W,H,solid[y][x], items:[{type,x,y}], spawns, goalRects, map.noPlaceZones}
  function canPlace(world, type, x, y, r){
    const d0 = ITEMS[type], D = dims(type, r), d = Object.assign({}, d0, D), fp = {x, y, w:d.w, h:d.h};
    if (x < 0 || y < 0 || x + d.w > world.W || y + d.h > world.H) return {ok:false, why:'超出場地'};
    if (isBomb(type)) return {ok:true};
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
  function bombHits(world, x, y, type){
    const k = ITEMS[type || 'bomb'].bomb, area = {x:x-k, y:y-k, w:2*k+1, h:2*k+1};
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
  return { RULES, ITEMS, AIM, UP, isBomb, dims, rotRect, itemLethalRect, partyBox, canPlace, nearestLegal, bombHits, itemSolids, scoreRound, nextStreak, total, winners, AWARD_NAME, rectsOverlap };
})();
if (typeof module !== 'undefined') module.exports = GaoshiRules;
