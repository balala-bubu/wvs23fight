---
name: wvs-connection
description: 修改或除錯世志大亂鬥（balala-bubu/wvs23fight）手機當手把／大螢幕的連線：掃 QR 加入、等待畫面、取消、幽靈玩家（沒人卻佔位）、手機離開後大螢幕還顯示「手機選擇中」、房號生不出來、大螢幕卡頓。使用者說「連線」「手把」「掃碼」「房號」「卡位」「手機斷線」「等待畫面」時使用。
---

# 世志大亂鬥：手機連線（手把）修改與除錯

目標：一個問題只讀相關幾段、改完用 `tools/phone_test.py` 驗證、再發佈。**不要**整份讀 `js/core.js`，**不要**請使用者附 index.html。連線的程式都在 `js/core.js`，用下面的關鍵字 Grep。

## 1. 先 Grep 這些（行號會變）
| 要看什麼 | 搜尋字 |
|---|---|
| 直連通道（PeerJS）、離開／心跳 | `function peerChannel`、`STALE_MS`、`bye` |
| 選通道（claude.ai 房間或 PeerJS） | `async function openChannel` |
| 大螢幕開房、房號、QR | `async function hostParty`、`drawPartyQR`、`joinURL` |
| 大螢幕每格處理手機（分配／釋放位置） | `function partyHostTick`、`function padPeers`、`function readPad` |
| 手機加入 | `async function joinAsPad`、`joinAsPad0`、`joiningPad`、`joinAborted` |
| 掃碼等待畫面 | `function setAutoJoin`、`function waitingPicture`、`#waitPic`（index.html）、`boot()` 裡的 `roomQ` |
| 手機離開／心跳 | `function leavePad`、`pagehide`、`pageshow` |
| 手機送的狀態 | `function padTick`（`msg = { pad:1, ...}`） |
| 大螢幕選角板文字 | `手機選擇中`（`renderSel`）、`function slotCtrl` |
| 畫面效能保護 | `guardPerf`、`pxRatio`、`FPS_CAP`（`?fps=60`） |

## 2. 連線怎麼運作（讀這段就夠）
- 大螢幕開房：隨機 4 位數房號，PeerJS id = `shizhi-brawl-<房號>`。QR 的網址是 `index.html?room=<房號>`，手機開啟後 `boot()` 會自動填房號並 0.3 秒後呼叫 `joinAsPad()`。
- 每個連線（`conns`）有 `pres`（對方最後送來的「狀態」）和 `seen`（最後收到資料的時間）。**一支手機要「算數」，大螢幕必須收過它送來的 `pad:1`**（只有手機的 `party` 建好之後 `padTick` 才會送）。沒送過就不會佔位。
- `partyHostTick`：還活著的手機（`padPeers()`）依序分配到空位 `party.slots[]`；連線不見就把位置清成 `null`。大螢幕的「手機選擇中…」就是 `party.slots[i]` 有值。
- `presence(m)` 會把新欄位**合併**進 `myPres` 再整包送出，所以只送 `{hb:n}` 也不會洗掉別的欄位。
- 非 claude.ai（GitHub Pages）時一律走 PeerJS 直連（`peerChannel`）。`peerChannel` 的 `leave()` 只有手機會先送 `{bye:1}`，大螢幕收到就立刻釋放。

## 3. 已經做好的防護（改的時候不要弄壞）
1. **加入防連點**：`joinAsPad()` 有 `joiningPad` 鎖（連點、或點按鈕又按 Enter，只算一次）；成功後若 `party` 已存在，就把多出來的 `room.leave()`（不然會留下幽靈玩家）。
2. **取消真的取消**：按取消設 `joinAborted = true`，之後才連上的連線會被 `leave()` 丟掉，不會突然跳到手把畫面。
3. **掃碼等待畫面**：`setAutoJoin(true, 房號)` 藏起輸入框、連線鈕、說明字，標題改「正在連線到房間 ####…」，顯示 `waitingPicture()` 畫的固定圖（白狗 Karl 跑步 + 四隻小白狗追，用遊戲自己的模型渲染一次）。連不上時 `finally` 的 `setAutoJoin(false)` 會回到輸入表單並顯示錯誤。
4. **手機離開要讓大螢幕知道**：離開／`pagehide` 先送 `bye`；手機每 2 秒送心跳 `hb`；大螢幕對「`pres.pad` 且超過 `STALE_MS`（10 秒）沒收到資料」的連線視為已離開。`pageshow` 若是 bfcache 還原就 `location.reload()`。
5. **效能保護**：預設不限幀數（高更新率螢幕就跑高更新率）；平均每格超過 25 毫秒就把渲染解析度降一階（2 → 1.5 → 1 → 0.75，不再升回）；`?fps=60`（或 30）可手動限幀。

## 4. 症狀 → 先查哪裡
| 症狀 | 常見原因 |
|---|---|
| 沒人卻佔了一個玩家位 | 有連線送過 `pad:1` 但沒被關掉：連點加入（防護 1）、手機沒說再見就消失（防護 4） |
| 手機按取消，大螢幕還顯示選擇中 | 取消時連線已經建好卻沒 `leave()`；或手機走掉沒送 `bye`／心跳 |
| 房號一直 `····` | `hostParty` 在等 PeerJS 配對伺服器；伺服器連不上時會顯示 `（network）` 錯誤，不是卡死 |
| 大螢幕（Chrome）整個卡住、CPU 很高 | 全螢幕後製 + 高更新率 + 大視窗；先試 `?fps=60`、縮小視窗；看 `chrome://gpu` 的 WebGL 是否 Hardware accelerated |
| 掃碼進來以為要點 | 等待畫面（防護 3）；不要再把輸入框露出來 |

## 5. 修改守則
- 沒完成連線的、或多出來的連線，**絕對不要**送 `pad:1` 的狀態，而且一定要 `leave()`。
- 手機端（`G.mode==='pad'`）的 `tick()` 不渲染 3D，保持輕量；不要在手機路徑加重的東西。
- three.js 渲染物件的 `onBeforeRender` 必須是函式（設成 `null` 會直接報錯）；要凍結動畫就設成 `()=>{}`。
- 要在場景暫時畫東西（像 `waitingPicture`）：先把非燈光物件 `visible=false`、用完全部還原（含 `scene.background`、霧、clearColor），用 `try/finally`。
- 角色／地圖檔不要碰連線；連線只改 `js/core.js`（和等待畫面用的 `index.html` CSS/HTML）。

## 6. 測試（改完一定要跑一次，不要反覆重跑）
```
python3 tools/phone_test.py        # 約 1～2 分鐘；全綠才算過（目前 8/8）
```
它會自己用 npm 抓 three、peerjs、peer，開本機配對伺服器，一個大螢幕分頁加幾個手機分頁，檢查：開房、手機連上、離開快速釋放、連點不留幽靈、突然沒反應 10 秒後釋放、掃碼等待畫面、連線中取消不留幽靈。若改到對戰／渲染核心，再照 `CLAUDE.md` 跑 `tools/smoke_test.py`。

自己寫臨時測試時的坑：
- 沙盒連不到 CDN：用 route 把 `three.min.js`、`peerjs.min.js` 換成本機 npm 版本。
- 要連本機配對伺服器：包一層 `Peer`，傳入 `{host:'127.0.0.1', port, path:'/', secure:false, config:{iceServers:[]}}`；伺服器綁 `127.0.0.1`（沙盒常沒有 IPv6）。
- 想讓「連線中」拉長：延遲手機的 `RTCPeerConnection.setLocalDescription`；**不要**延遲 `setRemoteDescription`（會打亂 ICE 順序，整個連不上）。
- 用 Playwright 內建的瀏覽器，不要用 `/opt/pw-browsers` 的完整 Chromium（沒有顯示卡時兩個 WebGL 分頁會慢到載入逾時）。
- 這是軟體渲染、電腦版 Chrome：**沒測過**真手機／iOS Safari／真顯示卡，回報時要說清楚。

## 7. 發佈
1. 每次發佈把 `index.html` 底部 `S()` 的預設 `?v=` 往上加（例如 `20261022g` → `20261022h`），否則瀏覽器可能用舊的 `core.js`。
2. 先 `add_repo`（owner `balala-bubu`、repo `wvs23fight`、access `push`），`git clone --depth 1`（timeout 10 分鐘），改完 `git fetch origin main` 確認沒人動過再 commit、push 到 `main`。使用者說「幫我推」才推。
3. 回覆：三句話內說明改了什麼；提醒使用者 1～2 分鐘後網址加 `?v=新數字` 開啟；老實說哪些只在模擬環境測過。

## 8. 使用者偏好（這個專案累積下來的）
- 測試不要一直重跑（他說過「test一次就好」）；先想清楚再跑。
- 不要擅自加硬性限制（例如強制 60 幀）：「能跑順就跑順，真的不行再下降」。
- 等待畫面不要用旋轉圖示；用固定畫面：白狗角色（Karl）在跑、後面小白狗（他的技能特效）在追。「白狗」是角色名，不是一隻狗。
- 他常常是在手機上操作、問「怎麼會」就是想知道原因，先用白話講原因再講怎麼改。
