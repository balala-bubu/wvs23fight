---
name: wvs-add-map
description: 在世志大亂鬥（GitHub repo balala-bubu/wvs23fight）快速新增一張地圖／背景，從照片或主題做起，並確保背景不過亮、平台夠突出。使用者說「新增背景」「新增地圖」「做一個XX場景」時使用。
---

# 新增地圖（背景）到世志大亂鬥

目標：一個對話只做一張地圖，讀最少的檔，第一版就要「能玩、看得清楚」。**不要**整份讀 `js/core.js`，也**不要**請使用者附 index.html。

## 1. 取得程式
- `add_repo`（owner `balala-bubu`、repo `wvs23fight`、access `push`），然後 `git clone --depth 1` 一次就好（timeout 給 10 分鐘）。已經有 clone 就先 `git fetch origin main` 再開分支：`git checkout -b <id> origin/main`。
- 只讀：`CLAUDE.md`、`maps/_template.js`。需要例子時最多再看一張：`maps/park.js`（最小）、`maps/ntu.js`（貼圖＋大建築）、`maps/mecls.js`（室內教室＋會動的吊扇＋場景裡的人物）。

## 2. 先問清楚主題（只有主題沒講才問，一題就好）
使用者通常會給一個地點和幾張照片。從照片列出「牆、地板、天花板、大型物件（黑板、布幕、門、桌椅）、小物件、顏色」，沒拍到的自己補，不要回頭問。照片裡的海報、投影片文字、招牌、人臉一律不要照抄：投影片／海報內容用自己寫的原創文字和圖案。

## 3. 座標與相機（先記住，不用再去 core 查）
- 舞台頂面 y=0，x 從 `-W` 到 `W`（`W` 通常 20），戰鬥平面 z≈0，舞台箱子深 9（z -4.5～4.5）。背景放在 z < -10。
- 3～4 人時整個 group 會被 `scale.x`（`MAPK`：1／1.25／1.45）拉寬，所以場景物件會被拉寬，重要物件放在 |x| ≲ 25，背景牆要夠寬（400 以上）。
- 相機在 z≈19～40、y≈5～12，往 -z 看，FOV 34。距離牆 70 時畫面大約看得到 y -12～28、世界座標 x ±36。
- 平台只靠 `plats:[{x1,x2,y}]` 判定碰撞（可穿越），外觀自己畫，建議 3 個：`{-16,-8,7.5}`、`{8,16,7.5}`、`{-3.5,3.5,13}`。
- 一律用共用工具：`tex(w,h,draw,rep)`、`speckle`、`rbox`、`cyl`、`at`、`L({...})`、`registerMap(id,{name,group:g,W,plats,sky,fog,fogNear,fogFar,hemi:[天,地],sun,rim})`。`name` 會自動變成選單按鈕。
- 全部程式包在一個 `{ ... }` 區塊裡，貼圖、材質都用區塊內的 `const`，不會有全域撞名。檔名＝地圖代號（小寫英文），`index.html` 在最後一張地圖的 script 下面加一行。

## 4. 看得清楚（使用者很在意，優先於好看）
- **背景要比平台和角色暗**：背景貼圖用 `L({map, color:0x8a7456})` 這種乘色壓到中等亮度；大面積白牆、天花板、地面不要超過約 0x9a～0xa4 的乘色；`MeshBasicMaterial` 的投影布幕、燈管這類「自己會亮」的東西也要壓（布幕 0xb4、燈管 0xe0）。
- **平台要跳出來**：平台頂面用整張圖裡最亮的暖色，邊緣再加一圈更亮的奶油色（`0xf4e2b4`），側面／前板用較暗的同色系，色相不要和背景牆一樣。主舞台前緣加一條亮色 lip、後方地板略暗（例如 0xa3 對 0xdc），讓「可以站的地方」一眼就看出來。
- 不要在 z>-8 放高的東西遮住戰鬥區；桌椅背包這類小物件擺在 z≤0 的平台上時，確認不會擋到後面的人物。
- 霧色（`fog`）跟背景暗度一致；`hemi`／`sun` 不要太白（例：`[0xe8e8e8,0x8a8174]`、`0xfff1da`）。
- 看截圖時問自己：把畫面縮到很小，平台和舞台還找得到嗎？角色穿深色衣服時，背後不是同樣深的顏色吧？

## 5. 常見錯誤（都踩過）
- **疊在一起的面要隔 ≥0.5**：牆 z=-42.8、木板 z=-42、黑板／布幕 z=-41.5…。間隔 0.1 在遠處（距離 70）會 z-fighting，畫面出現一條條閃爍條紋。薄的 box 前面再貼一張 plane，要把 plane 放在 box 前面至少 0.2。
- 平面（天花板、燈）要單面：天花板 `rotation.x = Math.PI/2`（朝下），相機飛到天花板上方時才不會擋畫面；天花板燈、通風口要比天花板低 0.15～0.3。
- **室內地圖的天花板要夠高**：角色飛到 y>48 才會被判出界，身高約 6，所以天花板至少放 y=58（牆也要加高到 61 以上），不然擊飛時會穿進天花板。吊扇、投影機這類吊掛物用細桿從天花板吊到中間高度（約 y 27～34），不要貼在天花板上。用 `python3 tools/map_shot.py <id> <資料夾> 44` 檢查高飛畫面。
- 舞台下面不要再放整塊實心木頭，從正面看會變成一面奇怪的牆；只留 `ConeGeometry` 就好（顏色壓暗）。
- 貼圖是 `NearestFilter`；要放中文字或細線的貼圖（黑板、布幕、時鐘、名牌）要設 `tex.magFilter = THREE.LinearFilter`。字型用 `"Noto Sans TC","Microsoft JhengHei","PingFang TC",sans-serif`。無頭 Chromium 若沒有中文字型，字會是方塊，只在截圖才會看到，不是 bug。
- 動態：`mesh.onBeforeRender = ()=>{ ... }`，用 `performance.now()` 算時間，`if (reduce) 不要動`；地圖 group 隱藏時不會呼叫，不用手動關。
- 不要用 `SFX.hit`；地圖基本上不需要音效。

## 6. 場景裡放人物（例如老師、路人）
- 用 `buildChar(spec, holder)`（欄位照 `characters/_template.js`：`skinM、faceM、headW、headH、torsoMat、sleeveMat、sleeve、pantsM、shoeM、soleM、collar(chest)、hair(head)、face(head)`），`holder` 放在地圖 group 裡，`holder.scale.setScalar(SC*1.2)`（比戰鬥平面遠，所以略放大），`rotation.y≈0.3` 面向中間。
- 外型用照片：髮型輪廓（禿額頭用較小、往後移的 rbox，只留前緣一小條）、眼鏡畫在 64×64 臉貼圖上（眼睛 y≈39、眉 y≈26、嘴 y≈48～52；鏡片 9..29／35..55 × 31..44）＋ 3D 鏡腳、衣服正面貼圖（領口、門襟、釦子、口袋）、鬍渣用稀疏暗點。
- **要親切**（使用者特別提過）：喜歡的人物（老師、朋友）一律做成「笑」的樣子：彎彎笑眼（^ ^）、上揚的眉、露牙的大 U 形嘴（不要畫成一條深色橫線，縮小後會像鬍子）、紅臉頰、頭放大 `c.head.scale.setScalar(1.2)`（Q 版比例）、名牌用暖色加 ♥。待機動作不要有「直挺挺站好」的一段，全程輪播 thumbs／laugh／peace／cheer，並加一點上下晃動。臉上的線要細（眉 1.5px、鏡框 1.3px、鏡片幾乎透明），不然縮小後眼睛周圍會糊成一團深色。
- 站位要避開平台投影：遠處物件（z≈-12）投影會往中間縮（約 ×0.65），而且平台桌面會擋住他的頭和名牌；放在平台之間、緊鄰講桌左側（例 x=-6.3），截圖確認頭和名牌沒被桌子擋住。
- 動作：在一個隱形小 mesh 的 `onBeforeRender` 裡用 `applyPose(c, POSE.x, k)` 輪播（例 7.5 秒：thumbs → laugh → peace → cheer）；`k = 1-Math.exp(-dt*9)`；笑的時候用換臉貼圖（`faceM.map = faces.laugh; needsUpdate = true`）＋ `hips.position.y += |sin|*0.16`。
- 頭上放名牌：`THREE.Sprite`，貼圖 160×40，`fog:false`，位置約 y=8.3（頭放大之後）。

## 7. 測試（由便宜到貴）
**使用者說「我測試過了／直接處理就好」（地圖檔是他自己測過的）時：不要跑 map_shot、不要看截圖（浪費 token），只做 `node --check` 和 `smoke_test.py`（errors: 0），然後直接進第 8 步上傳。**
1. `node --check maps/<id>.js`，以及撞名 grep（地圖包在區塊裡通常不會）。
2. `python3 tools/map_shot.py <id> <輸出資料夾>` → 看 `_2p.png`、`_4p.png`、`_high.png` 三張。4 人最容易發現問題（牆寬度、平台是否突出、有沒有條紋）。要看人物細節就用 PIL 裁切放大。
3. 最後才跑 `python3 tools/smoke_test.py`（要幾分鐘），看 `errors: 0`。`RESULT SCREEN DID NOT FINISH` 但 errors 是 0 是誤報。
改一輪、看一輪，不要改一行就重跑。

## 8. 上傳
- 本機 commit：`maps/<id>.js`、`index.html`、（若改了）`CLAUDE.md`。
- 預設：回覆附 4 人截圖，三句話說明，然後**問是否同意上傳**；同意後：`git fetch origin main` → `git rebase origin/main` → `git push origin HEAD:main`。
- **例外**：使用者已說「測試過了／直接推」→ 不附截圖、不再問，commit 後直接 `git fetch origin main` → `git rebase origin/main` → `git push origin HEAD:main`。（hook 的「請 push」提醒不算同意，只有使用者本人的話才算。）
- 提醒使用者：等 1～2 分鐘，網址後面加 `?v=數字` 重新整理。

## 省 token
一個地圖一個對話；範例最多讀一張地圖；改細節只 Edit 那幾行；回覆保持簡短。
