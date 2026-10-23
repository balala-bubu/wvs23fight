# 世志遊戲俱樂部：接續開發紀錄

- GitHub：balala-bubu/wvs23fight；使用者已試玩並授權本次匯入。
- index.html 是不載入 3D 的雙模式入口；brawl.html 保留匯入時最新 main 的大亂鬥頁面。
- 大亂鬥核心 js/core.js、characters/、maps/、audio/ 與最新 main 相同，包含其震動設定更新。
- 排球獨立入口 volleyball.html，資源版本 20261023-volley14。角色／造型沿用原資源。
- 固定二打二；單人與多人入口皆可選單人挑戰、雙人同隊、雙人分隊、四人對戰。
- 選角、原有造型、隨機抽定角色與造型、多人房號及 QR、手機選角／造型皆已實作。
- 手機直式為上方動作鍵、下方單一大搖桿；有防瀏覽器縮放處理。
- 放平上揮接球／起跳，背面朝上推舉球，下揮扣球；左右下揮瞄準。接球／攔網移動較慢，接近落點輕微輔助。
- 球場長寬各加大 10%；出界以最後觸球方失分；AI 放過明顯對方界外球。
- 殺球加寬時機、位置和高度容錯；時機影響球速。品質文字與球尾跡：失誤淡紫、普通白、NICE 綠、GOOD 黃、SUPER 亮紫。
- 好球接／舉／扣累積連段，攔網不加成；攔網降低不合理出界，保留極外側強攻 block-out。
- 物理、模擬感測與集中瀏覽器流程／尾跡檢查已通過；跨網路 WebRTC 和實機 iPhone／Android 手感仍需實機驗證。
- 詳細規格見 docs/volleyball-lobby-and-costumes.md；程式碼在 js/volleyball*.js、css/volleyball.css。
- 試玩站：https://wvs-volleyball-playtest-20261023.vilentino.chatgpt.site，維持原指定帳號權限。
- 測試：node tools/volleyball_rules_test.cjs；避免不必要地重跑長時間測試。

球本體依品質染色、文字跟隨球上方；已有連段的失準最多降一階。

手機單人更新：volley15 資源版；一個人玩流程不顯示手把入口，直接遊戲左大搖桿＋右單動作鍵，手機選角直橫式已截圖調整。詳見大廳與造型 MD。
