# 賽車工作範圍

先讀 `AI_HANDOFF.md`，再按任務查找個別檔案。不要一次讀整個專案、壓縮包、`play/assets/` 或大型角色來源。

- 只修改 `racing/` 的賽車來源；首頁入口僅在使用者授權時修改根目錄 `index.html`、`racing.html`。
- 不修改原 repo 的 `characters/`、`js/`、`maps/`、排球、大亂鬥、阿 Wa 隆、土木的來源與版本。
- `shared/characters/` 是賽車獨立角色快照，`shared/vendor/` 是賽車獨立連線依賴；不自動同步或反向寫回其他遊戲。
- 發布前確認最新遠端與只涉及本任務的差異，保留其他對話的變更。不強制推送。
- 檢查：`npm test`、`npm run build -- --outDir play`。來源更新後須同步更新 GitHub Pages 使用的 `play/` 成品。
