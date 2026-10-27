# 世志賽車・AI 交接

## 先讀這份即可

本專案與其他四個遊戲位於同 repo，但程式與資產依賴隔離。`racing.html` → `racing/play/` 可直接在 GitHub Pages 試玩。原始碼在 `racing/src/`，來源角色快照在 `racing/shared/characters/`。不必讀整段舊對話。

## 已完成

- 角色 → 造型 → 車輛 → 地圖；18位角色、64種原版及造型、6種車色能力組合。
- 臺大總圖男八巡遊、糖果山谷、恐龍失落火山谷。臺大為遊戲化縮放試作，非精確實測。
- 23類賽車道具參考大亂鬥角色技能，保留原模型來源與授權。
- PeerJS v5 協定只傳操作和狀態；房主判定，客端補間。沒有畫面串流、房主遷移或自有 TURN。
- 手機左右鍵、漂移、道具、自動加速；可切換滑桿，調大小與透明度。59項單元測試。

## 按需讀檔

| 任務 | 入口 |
| --- | --- |
| 主流程、設定、換圖 | `src/main.ts` |
| UI、手機 | `src/ui/ui.ts`、`touch.ts`、`touchState.ts`、`src/styles/wvs.css` |
| 地圖 | `src/maps/catalog.ts`、`ntuCampus.ts`、`candyValley.ts`、`dinoValley.ts` |
| 地景 | `src/game/campusScenery.ts`、`scenery.ts`、`dinoScenery.ts` |
| 道具 | `src/game/itemCatalog.ts`、`items.ts`、`itemProjectiles.ts` |
| 角色 | `src/custom/sharedCharacters.ts`、`assets.config.ts`；再查所需角色快照 |
| 連線 | `src/network/`；勿改其他遊戲的連線程式 |
| 製圖／設計限制 | `public/map-guide.html`、`items-guide.html`、`design-plan.html` |

## 尚待驗證

手機新版觸控配置需實機多指及跨網路驗證；瀏覽器測試不能代表真實手機效能。角色來源目前 eager 打包，持續新增角色時應評估按需載入。部分道具以光圈／HUD 呈現，三連道具未有環繞防禦。

## 開發

在 `racing/` 執行 `npm ci`、`npm run dev`。驗證 `npm test`；發布成品 `npm run build -- --outDir play`。勿為省 token 讀 minified 成品；以 `rg` 找來源局部。

## 2026-10-27 賽車更新

- 使用使用者提供的 WVS KART WORLD／世志賽車世界原始 Logo。
- 雙道具欄：先使用第一格，次數耗盡自動遞補；滿格不破壞箱子。
- 道具箱刷新 1.2 秒、抽選 0.45 秒；偷取、封印與連線狀態包含第二格。
- 協定 v5、每車手狀態 53 欄，連線玩家需重新整理至相同版本。
