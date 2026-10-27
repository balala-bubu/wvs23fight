# 世志搞事：修改指引

派對平台建造遊戲：每回合大家先從派對盒抓道具、放到場上坑人，再一起跑到終點旗。遊戲是自己獨立的一組檔案，**不讀取也不修改**大亂鬥、排球、阿 Wa 隆的程式。開始修改前，請先讀 [AGENTS.md](../AGENTS.md)。

## 給新對話的開場白（直接複製）

> 我要改世志搞事（GitHub repo balala-bubu/wvs23fight 的 `gaoshi.html`）。請先讀 `docs/gaoshi.md`，只讀要改的那個檔案的相關段落，不要整份讀。不要動其他遊戲。改完跑 `node tools/gaoshi_test.cjs`，回覆用三句話說明改了什麼。
> 這次要改的是：____

## 檔案在哪裡

| 檔案 | 內容 | 什麼時候要改 |
|---|---|---|
| `gaoshi.html` | 畫面、按鈕、樣式、載入順序 | 改介面文字或顏色、發佈時換版本號 |
| `js/gaoshi-maps.js` | 地圖的格子配置 | 新增或修改地圖 |
| `js/gaoshi-art.js` | 場景和道具的 3D 外觀、背景、粒子特效 | 讓地圖或道具變好看 |
| `js/gaoshi-rules.js` | 道具清單、放置規則、計分規則 | 新增道具、調整分數 |
| `js/gaoshi-physics.js` | 走、跑、跳、蹬牆、碰撞、死亡、旗子 | 調手感（照 PLAN.md 第 7 節） |
| `js/gaoshi.js` | 遊戲流程：選角、派對盒、放置、跑關、計分、連線房間 | 改流程或操作 |
| `js/gaoshi-net.js` | PeerJS 連線（開房、加入、QR） | 一般不用改 |
| `js/gaoshi-models.js` | 角色模型與動作的副本，抄自排球的模型檔 | 一般不用改 |
| `tools/gaoshi_test.cjs` | 物理、放置、計分的自動測試 | 每次修改後都要跑 |
| `tools/gaoshi_shot.py` | 用無頭瀏覽器跑完一回合並截圖 | 改了畫面時跑 |
| `tools/gaoshi_online_test.py` | 開兩個瀏覽器測試連線 | 改了連線時跑 |

## 角色

**角色不用另外做。** 遊戲啟動時會讀取 `brawl.html` 的角色清單，大亂鬥有的角色和造型，這裡會自動出現。選角頭像也是從 3D 模型即時畫出來的。

- 要新增角色：照大亂鬥的流程做（`characters/<代號>.js`，再在 `brawl.html` 加一行），這裡就會自動有。
- 要新增造型：同上，在大亂鬥角色檔的 `skins:[...]` 加就好。
- 角色在場上的身高固定是 2 格，由 `gaoshi.js` 的 `MODEL_H` 控制。
- 動作用的是 `POSE`（站、跑、跳、蹲、倒下、比讚）。貼牆的動作是 `gaoshi.js` 裡的 `WALL_POSE`。
- 角色要在搞事裡做特別的動作，例如勝利舞，請改 `gaoshi.js` 的 `animateFighters`。**不要**去改角色檔，以免影響大亂鬥。

## 地圖

地圖在 `js/gaoshi-maps.js`。每張地圖是 **32 欄 × 18 列**的格子，一格 = 1 單位，角色站著是 2 格高。

```js
function buildMyMap(){
  const W = 32, H = 18, {g, fill} = grid(W, H);
  fill(0, 10, 6, 17, '#');          // fill(x0, y0, x1, y1, 字母)：把這個範圍填成實心
  fill(21, 8, 31, 17, '#');
  g[7][29] = 'F';                   // 終點旗（插在下一列的地面上）
  [1,2,4,5].forEach(x=>g[9][x]='S'); // 4 個出生點（腳下那一格要是實心）
  return { id:'mymap', name:'我的地圖', size:[W,H], grid:g.map(r=>r.join('')),
    hazards:[], noPlaceZones:[], killY:20, solidBounds:true,
    sky:[0x2b3a66, 0xe8946a], look:'city', testBoxes:[] };
}
```

最後把它加進檔案底部的 `const LIST = [...]`。

- **座標**：原點在左上角，x 往右、y 往下。
- **格子字母**：`.` 是空氣，`S` 是出生點，`F` 是終點旗，其他字母都是實心。字母決定外觀，例如 `#` 大樓、`C` 磚、`G` 草地、`B` 穀倉、`T` 拖拉機、`M` 機器、`P` 木箱、`O` 筒倉。要新外觀，在 `gaoshi-art.js` 的 `looks()` 加一個字母。
- **killY**：掉到這一列以下就算墜落死亡。有地面的地圖設 99。
- **hazards**：地圖本身的危險物，目前有 `rotating_blade`（旋轉葉片），可以照農場的寫法加。
- **noPlaceZones**：不能放道具的範圍，例如 `{x:0, y:8, w:8, h:8}`。起點和終點旁邊會自動禁放，不用另外寫。
- **sky / look**：天空的上下兩個顏色；`look:'city'` 或 `'farm'` 決定背景和裝飾。要新風格，在 `gaoshi-art.js` 寫新的 `xxxBackdrop()` 和 `xxxProps()`，再接到 `buildMap()`。
- **背景要比平台暗**，平台上緣要亮，玩家才看得清楚（大亂鬥的地圖也是這個原則）。
- 新地圖至少要確認：不放道具時太難或剛好、跳得到終點。跑 `node tools/gaoshi_test.cjs` 會檢查 18 列 × 32 欄、4 個出生點。

## 道具

1. **規則**：在 `js/gaoshi-rules.js` 的 `ITEMS` 加一筆，例如：
   ```js
   spring:{name:'彈簧', desc:'踩上去跳 8 格高', cat:'移動物', w:2, h:1, solid:'full', weight:2},
   ```
   各欄位的意思：
   - `w`、`h`：佔幾格。
   - `solid`：`'full'` 整塊實心、`'hub'` 只有中心實心，不寫就是可以穿過。
   - `lethal`：`'rect'` 方形碰到就死、`'circle'` 圓形碰到就死（要加 `radius`）。
   - `trap:true`：陷阱類，殺到人的放置者得陷阱分。
   - `needsSurface:true`：要貼著東西才能放。
   - `weight`：在派對盒出現的機率。
2. **外觀**：在 `js/gaoshi-art.js` 的 `itemModel()` 加 3D 外觀，在 `js/gaoshi.js` 的 `itemIcon()` 加派對盒裡的小圖。
3. **特殊行為**：例如彈簧、射擊，要在 `js/gaoshi-physics.js` 的 `stepWorld` 加。
4. **測試**：在 `tools/gaoshi_test.cjs` 加一個測試，再跑一次。

所有道具都可以在放置時旋轉 90 度，碰撞範圍會跟著轉。還沒做的道具清單，請看 PLAN.md 第 8 節，以及 wiki 的 Object weight 頁。

## 規則數字

| 要改的東西 | 位置 |
|---|---|
| 幾分獲勝、回合上限、每個階段的秒數、各種得分 | `gaoshi-rules.js` 的 `RULES` |
| 走速、跑速、跳高、重力、蹬牆 | `gaoshi-physics.js` 的 `PHYSICS` |

改完 `PHYSICS` 要跑測試，確認跳高 5.05 格、跑速 12 格/秒這些數字還在。

## 操作

| 方式 | 移動 | 跳 | 跑 | 蹲 | 選道具 | 放道具 | 旋轉 |
|---|---|---|---|---|---|---|---|
| 鍵盤 P1 | `A` `D` | `W` 或空白鍵 | 左 Shift | `S` | `WASD` 移動，空白鍵抓 | `WASD` 移動，空白鍵放 | `Q` `E` |
| 鍵盤 P2 | 方向鍵 | `↑` 或 Enter | 右 Shift | `↓` | 方向鍵移動，Enter 抓 | 方向鍵移動，Enter 放 | `.` |
| 滑鼠（幫 P1） | — | — | — | — | 點道具 | 點一下放 | 右鍵或滾輪 |
| 手機 | 左下方向鍵 | 右下按鈕 | 開關式，預設開著 | 右下按鈕 | 直接點道具 | 手指拖曳，道具顯示在手指上方，按「放下」 | 「轉」按鈕 |

## 連線（阿 Wa 隆模式）

- **流程**：標題 →「跟朋友連線」→ 開房間或加入房間（4 位數房號，也可以掃 QR code 或點 `gaoshi.html?room=1234`）→ 各自選角色 → 大廳 → 房主按開始 → 房主選地圖 → 開打。最多 4 個人。
- **每台裝置都顯示完整畫面**，自己的角色在自己的裝置上計算，所以操作沒有延遲；別人的角色由網路同步。不是分享畫面。
- **房主決定規則**：派對盒抽什麼、誰先抓到、放置合不合法、金幣給誰、計分、換回合，都由房主決定，再廣播給大家。
- **有人中途離開**：這一局他會被當作倒下，其他人可以繼續玩。
- **連線用的伺服器**：PeerJS 公用伺服器，房間 ID 前綴是 `wvs-gaoshi-v1-`。連線協定有改時，把前綴的 v1 往上加，避免新舊版本互連。
- **Claude 的預覽頁不能測連線**，因為預覽視窗不允許 WebRTC。請用 GitHub Pages 的正式網址測試。
- **自動測試**：要先在本機開一個 PeerJS 伺服器，再跑 `tools/gaoshi_online_test.py`，網址會帶 `?peerhost=127.0.0.1&peerport=9000`。

## 測試與發佈

```bash
node tools/gaoshi_test.cjs              # 物理、放置、旋轉、計分（每次都跑）
python3 tools/gaoshi_shot.py /tmp/gs    # 跑完一回合並截圖（改畫面時）
```

- **發佈時換版本號**：每次發佈，都要把 `gaoshi.html` 載入程式裡的 `'20261027a'` 改成新的版本號，避免瀏覽器把新版 html 和舊的 js 混在一起用。
- **首頁入口**：`index.html` 的第 4 張卡片「世志搞事」。
- **不要動的東西**：其他遊戲的檔案，以及 `brawl.html`、`js/core.js`、`characters/*`。搞事只「讀」大亂鬥的角色清單。
- **推送前**：照 AGENTS.md 先 fetch，檢查 `git diff --name-status origin/main...HEAD`，只能出現搞事的檔案、`index.html` 和這份文件。
