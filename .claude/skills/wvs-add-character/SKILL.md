---
name: wvs-add-character
description: Add a new character or map to the 世志大亂鬥 game in GitHub repo balala-bubu/wvs23fight, using the per-file template, with minimal reading.
---

# 新增角色／地圖到世志大亂鬥

目標：用最少的讀取量完成，但外型品質要跟現有角色一樣好（使用者會拿秉寶 waffle 的精細度來比）。**不要**讓使用者附上 index.html，也**不要**整份讀 `js/core.js`。

使用者可能貼上舊的「單檔 index.html」說明（搜尋 `const wFaceTex`、`function makeModel`、「只給我一個新的 index.html」）。那是舊流程，現在的遊戲是多檔案結構，**照這份 skill 做**：新增角色檔、index.html 加一行、問過再推上 GitHub。回覆時用一句話說明「現在是多檔案，所以沒有單一 index.html 可下載」。

## 0. 角色暱稱 ↔ 檔名
使用者用中文名或暱稱叫角色，檔名常常不一樣（例：**Ten = `kelsey.js`**、秉寶 = waffle、偷米 = tommy、提姆熊 = bear、雲嵐 = seafood、睿睿 = serene、心瑩 = wxinyy、珍妮 = jennie）。找不到時：`grep -n "name:'" characters/*.js`。

## 1. 取得程式（永遠從 GitHub 最新版開始）
- 把 repo `balala-bubu/wvs23fight` 加進這個對話（add_repo，access: push），用 `git clone --depth 1` 抓下來（timeout 給長一點）。
- 如果本機已經有 clone：先 `git fetch origin main`，再 `git checkout -b <代號> origin/main`。使用者常常同時開好幾個對話在加角色，舊的本機版本可能已經落後。
- 只讀這兩個檔：`CLAUDE.md`（結構、共用函式、姿勢和音效清單）和範本 `characters/_template.js`（新增地圖時改讀 `maps/_template.js`）。
- 需要參考時，最多再讀一個相近的角色檔（重型角色看 `characters/bear.js`；有飛行道具和移動型大招看 `characters/seafood.js`；眼鏡看 `characters/waffle.js` 的 `face(head)`；**長髮女生、自訂防禦、結算畫面帶路人、落地留下一攤東西看 `characters/serene.js`**；**換整套衣服（短褲↔長褲、T恤↔帽T）、地上危險區、大招從天上掉喇叭看 `characters/jennie.js`**；**黑髮根漸層（布丁頭）、短褲＋短襪、天降大招物件看 `characters/pudding.js`**；**把人包住＋狂按掙脫看 `characters/wxinyy.js`** 的 `escapeMash`；**運氣／暫時強化弱化、地上的封印區、開襟外套露出內搭看 `characters/xuan.js`**；**召喚別的角色當投射物、整套換裝（T恤↔Polo）、全畫面濾鏡、結算畫面讓全部角色出場看 `characters/ichung.js`**）。真的需要核心細節才用 grep 找 `js/core.js` 的那一段（`function buildChar`、`function applyHit`、`function updateProjs`、`function startResults` 是最常需要的四段）。

## 2. 角色資料
使用者會給：代號（只能小寫英文字母；如果有大寫或空格，改成小寫連在一起並告訴使用者）、中文名／英文名、外型（或照片）、個性特色、體型速度跳躍、招式、大招、防禦樣子、勝敗動畫。沒寫的部分照特色自己設計，不要回頭問。使用者希望招式有角色自己的特色，不要只是把別人的招換皮：至少一兩招要有新機制（例如：把人包進泡泡浮起來再破掉、召喚小幫手跑過去撞人、放一支麥克風架讓附近的人被迫跟著跳、丟火鍋落地留一攤會燙人的湯）。

照片用來決定髮型、膚色、眼鏡、衣服顏色和款式、配件（牙套、髮圈、識別證掛繩）；第二張照片的不同穿搭做成第二套造型（skin）。臉畫成 64×64 小畫布（眼睛約 y=37、嘴巴約 y=49，瀏海通常蓋到 y≈25 以上）。

數值參考：輕 weight 0.85／中 1.0／重 1.4；速度 run 慢 11／中 14／快 16；跳躍 jumpV 低 26／中 30／高 33。均衡型就全用中。跳躍低的角色，上必殺的 `vy` 給高一點（約 36）補回來。比較矮的角色：`c.root.scale.set(0.92,0.88,0.92)`。

## 3. 外型品質（使用者在意這點）
- **丟出去的東西、手上的道具一律做成立體模型，不要用 sprite 貼圖**（使用者明確要求過；Ten 的野餐食物就是從貼圖改成立體）。sprite 只用在音符、愛心、特效這類「本來就是平面符號」的東西。
- 頭髮：用好幾塊有圓角的 rbox 組出輪廓（頂部、後腦、兩側、一片片瀏海），長髮要分側邊、後面、髮尾外翹或內彎；不要只放一兩塊大方塊。可以做「深色髮根」或「髮尾較淺」貼圖（`createLinearGradient` 疊上去）。**染髮長出黑髮根（布丁頭）這種對比要做得比直覺更狠**：漸層前 60% 直接壓到近黑（`rgba(8,6,6,1)`）再快速轉淺，臉部貼圖的瀏海和兩側也要用同一組漸層，不然在遊戲裡只會看起來像一顆棕色的頭。
- 側邊頭髮蓋住臉旁時，核心加的耳朵會從頭髮穿出來變成一條膚色線：build 完用 `c.head.children.forEach(o=>{ if (o.isMesh && Math.abs(o.position.x)>0.4 && Math.abs(o.position.y-0.02)<.01) o.visible=false; })` 藏起來。
- 衣服貼圖要有細節：針織橫紋、門襟和釦子、蕾絲波浪紋、領口、口袋、袖口條紋、識別證掛繩。正面用 `torsoMat` 陣列 `[+x,-x,+y,-y,front,back]` 放專屬正面貼圖。
- **貼圖上要寫字（衣服上的英文、招牌）畫布至少 96 寬**：`tex(96,128,(g)=>{ g.scale(2,2); ...照 48×64 座標畫... })`，48 寬的字在遊戲裡會糊成白線。
- 掛繩做成 V 字：兩條細 rbox，`position.x = s*0.33`、`rotation.z = -s*0.2`（正負號反了會變成往外開的八字）。
- 特殊服裝用自訂幾何：例如蓬蓬裙用開口 CylinderGeometry 把底邊做成波浪，疊 3～4 層，`side:DoubleSide`，掛在 `c.hips` 上。
- 長袖：把 `c.R.sh.children[1]` / `c.R.el.children[0]`（裸手臂）換成衣服材質；寬鬆帽T再把這兩段 `scale.set(1.4,1,1.4)`，並把袖子方塊 `sh.children[0]` 縮到 0.84，不然肩膀會鼓一包。短袖：`a.sh.children[0].scale.y = 0.6`。
- 短褲：大腿 `hp.children[0]`、小腿 `kn.children[0]` 換成膚色材質並 `scale` 0.9；在 `hp` 上加短褲 rbox(0.76,0.86,0.82) 於 y=-0.36、反摺褲管 y=-0.76；短襪加在 `kn` 的 y=-1.22（`kn` 直接用 `c.joints.rKn` / `lKn`）。
- 寬褲：`c.joints.rHp.children[0]`（大腿）和 `c.joints.rKn.children[0]`（小腿）`scale.set(1.2~1.4, 1, 1.2~1.3)`；靴子在 `kn` 上 y≈-1.36 加一段 cyl。
- 想換色或換衣服的造型：在 build 裡把會換的材質／mesh 存成 `c.xxx`（collar 裡建立的東西可以掛在 `chest.userData` 再取出），skin 的 `apply(c)` 改 `.material`、`.map` 或 `.color` 再 `needsUpdate = true`。**整套換裝**（上衣、袖子、褲子、配件全換）的做法：build 時兩套配件都建好，分別放進 `teeBits` / `hoodBits` 陣列，寫一個 `c.setOutfit(o)` 切換 `visible`、軀幹 `c.torso.material`（= `c.chest.children[0]`）和手腳材質，build 結尾先 `c.setOutfit('預設')`，skin 只呼叫 `c.setOutfit('另一套')`（見 `jennie.js`）。注意：非原版造型在小頭像上都會被核心加一頂生日帽。
- 路人（店員、小朋友等）用 `buildChar(...)` 做：`holder`（場景用）裡放 `body`（`scale.setScalar(SC*比例)`），回傳 `c` 並設 `c.holder`。小孩就用 SC*0.6、大頭（headW 1.3）。
- **真人角色可能已經在地圖裡建過模**：`maps/mecls.js` 有憶中老師、`maps/*.js` 裡也有其他路人。新增這種角色前先 `grep -n "<中文名>" maps/*.js`，直接把那段 `buildChar({...})` 搬進角色檔再加衣服和道具，省掉一輪外型來回。
- **召喚別的角色當投射物**（老師叫學生出來打人、召喚小幫手）：`CHARS[kind].build(body)` 是全域的，做一個 `holder`＋縮小的 `body`（`body.scale.setScalar(SC*0.72)`、`body.position.y = -r`），build 完把 `c.props` 全部 `visible=false`，`holder.rotation.y = face>0 ? Math.PI/2 : -Math.PI/2`，再丟進 `proj({mesh:holder})`，並把 `holder.kid` 存到 `p.kid`，在 `animate` 裡 `applyPose(p.kid, runPose(p.t*16), 1)` 讓他跑步。整份 `CHAR_ORDER.filter(k=>k!==自己)` 隨機抽一個就有「隨機學生」。記得 `CHARS[k].build` 要包 try/catch。
- **全畫面濾鏡（國旗色、黑白、夜視）**：做一片 `PlaneGeometry(46,17)` 的 `MeshBasicMaterial({transparent:true, depthTest:false, depthWrite:false, fog:false})`，`renderOrder=998`、`frustumCulled=false`，`camera.add(plane)`＋`plane.position.z = -11`，這樣鏡頭怎麼移都蓋滿畫面；`dispose` 時 `camera.remove()`。opacity 0.45 左右才看得出顏色，0.3 以下在遊戲裡幾乎看不到。
- **結算畫面讓全部角色出場**：`CHAR_ORDER` 逐一 build 成 `SC*0.46` 的小人排兩排（每排 9 個、間距 1.9，z 分別 -4.2 / -7.4），一開始 `visible=false`、`scale .001`，時間到再依序彈出來。17 隻一起建大約一瞬間，結算畫面跑得動。
- `buildChar` 內部結構速查（不用再讀 core）：`c.chest.children[0]` = 軀幹（collar 加的東西排在後面）；手臂 `sh.children[0]` = 袖子、`sh.children[1]` = 裸上臂、`el.children[0]` = 前臂；腿 `hp.children[0]` = 大腿、`kn.children[0]` = 小腿、`kn.children[1]` = 鞋；`c.joints.rHp/rKn/lHp/lKn` 可以直接拿，不用自己在 children 裡找。
- **開襟外套（cardigan）露出裡面的內搭**：32 寬的正面貼圖上，兩側門襟各只留 3～7px，內搭的 V 開口畫到 20px 寬以上。門襟畫太寬（各 11px）在遊戲裡整件就只是一塊米白，看不出有內搭。
- **掛在胸前的東西 z 要 ≥ 0.49**（軀幹深 0.92，半深 0.46），不然掛繩、項鍊會埋進身體裡只露出一個點。
- 核心加的耳朵在 `x = ±(headW/2 + 0.02)`，headW 不是 1.0 時座標就不是 0.52；判斷用 `Math.abs(o.position.x) > 0.4 && Math.abs(o.position.y - 0.02) < .01` 比寫死數字可靠。
- 手勢 `hR/hL` 只有 `fist`、`thumb`、`peace` 三種，其他名稱會讓 applyPose 出錯。
- 手持道具掛在 `c.R.hd`，「往手指方向」是 -y。手持麥克風：握把在 0～-0.5、麥克風頭在 -0.7，手舉到嘴邊時頭就會朝上靠近嘴巴。揮的武器（吉他、球棒）：握的那端在 0，重的那端往 -y。
- 立體食物小技巧：`cyl` 轉 `rotation.x = π/2` 可以讓切面朝鏡頭（蛋餅切段看得到蛋）；三角形（披薩、三明治）用 `THREE.Shape` + `ExtrudeGeometry`；半圓（折起來的餅）用 `CylinderGeometry(r,r,h,18,1,false,0,Math.PI)`；碗用 `SphereGeometry` 下半球 + `DoubleSide`；盤子、鍋子類整組 `rotation.x = 0.3~0.55` 讓上面的料看得到。

## 4. 寫檔
- 新增 `characters/<代號>.js`，照範本結構，所有特殊行為都放在 `registerChar` 的 hook 裡，**不要改 core**。
- 在 `index.html` 角色區最後一行後面加 `<script>S('characters/<代號>.js')</script>`（地圖則加在地圖區），並把 `S()` 那行預設的 `?v=` 版本號改掉。
- 範圍傷害、濺射：用 `applyHit(owner, v, {dmg, kb, sc, ang}, dirX, x, y)`，會自動處理防禦、集氣和擊飛；迴圈跑 `G.fighters`、跳過自己、用 `Set` 記錄打過誰。飛行道具物件本身也會被當成 `applyHit` 的參數，所以 `proj({... slow:1.2})` 就會讓被打到的人變慢、`soft:1` 會變成「噗」的軟打擊。
- 自訂防禦：`shield()` 回傳 mesh（核心每一幀會先 `scale.setScalar(依防禦值)`，所以 `shieldAnim(f)` 裡可以再乘上晃動倍率）；「撐太久會破」直接在 `animate` 裡 `if (s==='shield') f.shieldHP -= 6*dt;`，耗完核心會自動破防並顯示 `breakText`（可配 `breakColor`）。「防禦太久會暈」這類效果放在 `animate` 裡算時間，再把 `f.state='stun'`。
- **運氣／暫時的強化與弱化**不用自己做：core 的 `f.buffT`（秒）＋ `f.buffDmg` / `f.buffKb` 會直接乘在傷害和擊飛上，`buffDmg` 小於 1 就是削弱（`xuan.js` 的擲筊：聖筊 1.5、陰筊 0.72）。要**削弱對手**的攻擊力則設 `v.sadT`（core 已內建 ×0.7），配上 `v.slowT` 就能做「站進去會被封住運勢」的地面法陣。
- **需要每一幀更新的狀態或暫時物件**（把人包在泡泡裡、地上出現的道具、持續效果、往前推的聲波）：push 一個 `G.finals` 項目 `{owner, t:0, mesh, update(F,dt){... return 結束?}, dispose(F){...}}`。G.finals 每幀自動更新，進結算畫面會自動清掉，不會殘留；它不會影響其他系統。「定住並慢慢浮起」：在 update 裡每幀設 `v.state='stun'`、`v.vy = 2.6`、`v.vx *= Math.exp(-dt*4)`。
- **飛行道具落地後要留下東西**（一攤湯、黏液）：proj 沒有落地 hook，用一個 G.finals「看守」項目：每幀 `G.projs.indexOf(p) >= 0` 時記下 `p.x, p.y`；一消失就在最後的位置生成地上物件（`x` 在 `MAIN.x1～MAIN.x2` 之間才生成）。見 `jennie.js` 的 `jenSoup_watch` / `jenSoup_spawn`（持續傷害：每人各自計時 `F.tick[v.slot]`，直接 `v.pct += 2` 並 `v.vy = 12` 燙到跳起來；不要每幀呼叫 `applyHit`，會一直擊飛）。
- **把人包住／定住的招式一律要能「狂按掙脫」**（使用者明確要求過）：core 會把每次按鍵存成 `v.bAtk/bSp/bJump/bFin` 緩衝，按下那一幀數值會跳高，所以比較上一幀就能數出按了幾下。直接用 `wxinyy.js` 裡的共用函式 `escapeMash(F, v, need)`（F 是任何可以存狀態的物件，回傳 true 代表掙脫）和 `escapeK(F, need)`（0→1 進度，用來把泡泡縮小當進度條）。一般招式 5 下、大招 12 下是測過覺得合理的數字。掙脫時把 `v.state='idle'; v.stunT=0`，爆開但**不要擊飛**（掙脫是獎勵不是懲罰）。
- 「放在場上的裝置」（麥克風架、陷阱）：同一個角色只留一個，新放的時候把舊的 `F.t` 推到 `F.dur`；在空中放就讓它自己用 `vy` 掉到 `y=0`（超出 MAIN 範圍就掉出場、`y<-20` 結束）。
- 飛行道具 `proj()` 的 mesh 位置就是 `(p.x, p.y)`，落地反彈發生在 `p.y = p.r`。所以「腳在原點」的模型（小人、動物）要把模型往下移 `-r`（例如 `body.position.y = -1.3`、`r:1.3`），不然會浮在半空。proj 沒有每幀 hook；要讓小人跑步，在角色的 `animate` 裡跑 `G.projs` 找自己的（`p.owner===f`）再 `applyPose(p.kid, runPose(p.t*16), 1)`。`spin:1` 會讓立體模型一直翻滾；鍋子、盤子這種「翻了會灑」的東西不要加 spin。
- 結算：加到場景的東西放 `R.items`，掛在角色身上的放 `R.attach`；動畫要 6 秒左右就設 `longWin`／`longLose: true`。贏家在 x≈-3.5，輸家在 x≈9.5、z≈-5；約 5.8 秒後右下角會蓋上結算選單，所以戰敗動畫的重點要在 5.5 秒前演完。「燈光暗掉」：在角色前方 z+3.4 放一片黑色半透明 PlaneGeometry（`opacity` 從 0 漸變到 0.7，`depthWrite:false`），聚光燈用開口 `ConeGeometry` + 地上一個 `CircleGeometry` 光圈，熄燈前用 `Math.sin(R.t*60)>0` 閃兩下。
- 結算畫面要借別的角色出場（例如推偷米的輪椅）：其他角色檔的 build 函式和道具是全域的，可以直接用（`buildTommy(body)`、`buildWheelchair()`），但要先 `typeof buildTommy === 'function'` 防呆，並把借來模型的 `props` 全部 `visible=false`、用 `setFace` 換表情、`applyPose(tm, POSE.sit, 1)`。輪椅這種「世界尺寸」的物件加在 holder（不縮放），角色放在 holder 裡 `scale.setScalar(SC)` 的 body。

## 5. 常見錯誤（這幾個踩過，寫之前先避開）
- **左手是 `c.Lf`，不是 `c.L`**：`buildChar` 回傳的是 `{root, hips, chest, head, R, Lf, extra, joints}`。寫 `c.L.sh` 會在 `makeModel` 直接丟 `Cannot read properties of undefined`，整個遊戲開不起來。保險作法是用 `c.joints.lSh / lEl / lHd / rHp / rKn...`。
- **`g.add(at(mesh,...)).rotation.x = ...` 會轉到整個 group**：`Group.add()` 回傳的是 group 本身不是那個 mesh。要轉單一片就先存成變數再 `.rotation.x = ...`，不然整盤咖哩會躺著。
- **`tone()` 只有 6 個參數**（freq,dur,type,vol,slide,when）：多傳一個 0 會把 `when` 擠掉，延遲音完全不會響。
- **全域撞名會讓整個遊戲打不開**，不是只有新角色壞掉：所有角色檔共用同一個全域範圍，重複的頂層 `const` 一拋錯，後面每一個角色檔都不會載入。所有頂層 const／function 都加角色前綴，而且前綴要**先確認沒人用過**：
  `grep -ln "\bkt[A-Z]\|\bKT_" characters/*.js js/core.js maps/*.js`（把 kt／KT 換成你的前綴，沒有輸出才能用）。
- **自訂音效、姿勢的名稱也要加前綴**：`sfx:{}` 和 `poses:{}` 會合併進全域的 `SFX` / `POSE`，取名 `chomp`、`splash`、`eat` 會蓋掉別的角色的同名音效／姿勢。用 `jenChomp`、`jenEat` 這種名字。
- **`SFX.note` 要傳數字**（`note(i)`），不傳會丟 non-finite AudioParam，整個畫面停住。音效簽名沒把握就別用現成的，自己在 `sfx:{}` 寫一個（`tone(freq,dur,type,vol,slide,when)` / `noise(dur,vol,freq,when)`，音高用 `NOTE(半音)`）。自訂音效會合併進 `SFX`，招式的 `sfx:'名稱'` 和程式裡 `SFX.名稱()` 都能用。
- **`sfx:'hit'` 會壞掉**（hit 需要數字），換別的音效。
- **`freeObj` 會 dispose 掉 geometry**：飛行道具的 mesh 每次都要新建，不要共用同一個 geometry；自己寫的 `dispose(F)` 裡若有共用的貼圖（音符、招牌），不要把它的 material.map 一起丟掉。
- **結算畫面每個時間分支都要把前一段的物件關掉**：在 update 開頭統一 `for (const n in m.props) m.props[n].visible = false;` 再把自訂物件也設 `visible = false`，然後該段再打開。漏關會疊在後面的畫面上擋住海報。
- **要給觀眾看的東西不要用手上的 prop**：掛在 `c.R.hd` 的道具在結算畫面常常背對鏡頭、看起來像一塊黑板。平板、卡片、海報這類「畫面要看清楚」的物件，改成 scene 物件、正面朝 +z、擺在角色身邊（x 往右 2～3、y 約 RS_Y+5），並放進 `R.items`。
- 角色的 `animate(f,m,s,t,dt)` 想加快出招速度，就直接推進 `f.moveT`，但別推過 `m.t[0]`（startup），否則會跳過出招判定。
- **大招先把人困住或抬高、再擊飛的，很容易太強**：被抬高的人再用接近垂直的角度打出去，20% 就會從上面飛出場。這類擊飛用 `launch(v, 22 + v.pct*.11, 55, dir)` 左右，測試時印 `pct` 並看有沒有直接出現 KO。連續好幾拍的大招，前面幾拍用 `kb:4, sc:0` 讓人小跳就好，最後一拍才擊飛。
- **天降大招物件不要做太大**：半徑超過 ~5 就會佔掉半個畫面、擋住所有人和標語。整顆布丁 scale 8.5 太誇張，5.4 剛好；落地高度要跟著改（物件半高），判定半徑也要一起縮，不然看起來小、打擊範圍卻還是超大。
- **共用函式放在先載入的那個角色檔**：script 順序照 index.html，被晚載入的檔案「在函式裡呼叫」沒問題（執行時才查全域），但不要在頂層就呼叫別的角色檔定義的東西。
- **從天上掉下來的大招物件**：鏡頭上緣大約在 y≈20，起始高度放 15～24、速度 8～12，大招開始 1.5 秒內就要看得到，不然玩家以為大招沒反應。左右兩邊的物件 x 用 `Math.max(MAIN.x1+3, f.x-11)` / `Math.min(MAIN.x2-3, f.x+11)` 夾在舞台內。
- 寫完把整份檔案掃一遍有沒有「打到一半的奇怪行」（例如 `.rotateY(0) && new THREE.Group()` 這種），`node --check` 抓不到語意錯誤。

## 6. 測試（分三層，由便宜到貴，不要一開始就開瀏覽器）
**第一層：不用跑，先做完（幾乎免費，抓到的卻是最致命的錯）**
- `node --check characters/<代號>.js`
- 上面的撞名 grep。

**第二層：smoke test，最後跑一次就好**
- 新角色：`python3 tools/smoke_test.py --only=<代號>`（約 20 秒）；有改到別的角色就一起跑：`--only=<代號>,kelsey`。只看 `errors: 0`。
- `--only` 只跑新角色**贏**的那場；戰敗動畫在第三層的截圖工具裡跑。
- 不要改一行就重跑；把能改的都改完再跑。
- 看到 `RESULT SCREEN DID NOT FINISH` 但 `errors: 0`：那是等待時間的誤報，不是角色的問題，不要去 debug 角色。

**第三層：截圖——直接用 `tools/char_shots.py`，不要再自己寫 playwright 腳本**
- `python3 tools/char_shots.py <代號> [模式] [輸出資料夾]`，最後印出一張拼貼圖 `sheet.png` 的路徑，**只讀那一張**。
- 模式（預設 `cfwl`）：`c` 近拍（原版＋第二套造型的正面、四人一排側面，另外可用環境變數 `PROPS_JS` 放道具特寫，例如 `PROPS_JS="['danbing','hotpot'].map(k=>jenFood(k,1))"`）、`a` 對戰中所有人同時放中必殺／側下必殺、`f` 大招 1.3 秒和 2.8 秒（會印出大家的 %，順便確認大招有打到）、`w` 勝利動畫前段和後段、`l` 戰敗動畫前段和後段。
- **一定要看 `c` 的正面近拍**：遊戲鏡頭太遠，640×360 的對戰截圖看不出臉、牙套、頭髮有沒有穿模、衣服上的字糊不糊。近拍是用另一台相機直接 render，不受遊戲鏡頭影響。
- 結算畫面：`R.t` 大約在 KO 後 2 秒才從 0 開始，所以工具裡的 `w2` 約是 `R.t≈4.5`；要看別的時間點就改等待毫秒數。
- 對手不要選 tommy（他的勝利動畫有一排士兵會擋住畫面）；工具固定用 waffle 和 kelsey。
- 戰敗動畫的截圖常常被**對手的勝利動畫**擋住（waffle 會帶一群小朋友站在輸家前面），看不到新角色不是角色壞掉，不用 debug；想看清楚就改用別的對手。
- 用 evaluate 直接設 `f.state='shield'` 撐不住（下一幀就被改回去），防禦外型不用為此截圖。
- 只有拼貼圖上看到問題，才針對那一段多截幾張。

## 7. 上傳（一定要先問）
- 在本機 commit。
- 回覆時附上新角色檔和那張拼貼圖，用簡短條列說明設計（外型、每招在做什麼、勝敗動畫、順便改了哪些舊角色），然後**詢問使用者是否同意上傳**。使用者說不要上傳，或說另一個對話還在跑，就先不要推（stop hook 提醒有未推送的 commit 也一樣，跟使用者說明原因即可）。
- 同意後：`git fetch origin main` → `git rebase origin/main` → 再跑一次 smoke test（如果 rebase 有拉到新東西）→ `git push origin HEAD:main`。
- 提醒使用者：等 1～2 分鐘，網址後面加 `?v=數字` 重新整理。

## 8. 收尾：把這次學到的寫回這份 skill
使用者希望每做完一個段落就更新 skill，讓下一次更快、更少踩雷。push 完之後：
- 回顧這次：哪裡花了最多來回？哪個坑是新踩到的？使用者有沒有提出新的偏好（例如「道具要立體」）？有沒有寫了可以重複用的工具或做法？
- 只寫「下次會用到」的東西：新的坑放第 5 節、新的做法放第 3／4 節、新的參考角色寫進第 1 節的清單、使用者偏好寫在最相關的那一節。不要寫流水帳，不要重複已經有的條目；舊條目錯了就直接改掉。
- 可以重複用的腳本放進 `tools/`，skill 裡只寫一行怎麼用。
- 更新 repo 裡的 `.claude/skills/wvs-add-character/SKILL.md`（跟著角色一起 commit／push），並用 propose_skills 把同樣的完整內容提給使用者帳號裡的 skill（kind: improvement）。

## 省 token 原則
- 一個角色一個新對話。
- 參考用的角色檔最多讀一個，而且用 grep 或 sed 只讀需要的那段，不要整份讀。
- 截圖一律用 `tools/char_shots.py`，不要每次重寫 playwright 腳本。
- 微調時只改該角色檔案裡的那幾行，不要重讀別的檔案。
- 回覆保持簡短。
