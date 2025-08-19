# 檔案標頭驗證系統需求文件

## 簡介

建立一個自動化系統來檢查專案中所有 TypeScript 檔案是否遵守 `docs/04-file-header-convention.md` 中定義的 AI 優化檔案標頭註解規範。

## 需求

### 需求 1: 檔案標頭格式驗證

**用戶故事**: 作為開發者，我希望能夠自動檢查所有檔案的標頭註解格式，以確保團隊遵循統一的註解標準。

#### 驗收標準

1. WHEN 執行驗證腳本 THEN 系統 SHALL 掃描所有 TypeScript 檔案 (.ts)
2. WHEN 檢查檔案標頭 THEN 系統 SHALL 驗證是否包含必要的 @ai-context JSON 格式
3. WHEN 發現格式錯誤 THEN 系統 SHALL 報告具體的錯誤位置和原因
4. WHEN 檔案缺少標頭註解 THEN 系統 SHALL 列出所有缺少註解的檔案
5. WHEN 驗證完成 THEN 系統 SHALL 生成詳細的驗證報告

### 需求 2: 標頭內容驗證

**用戶故事**: 作為架構師，我希望驗證檔案標頭中的內容是否符合 DDD 分層架構規範，以確保代碼組織的一致性。

#### 驗收標準

1. WHEN 檢查 role 欄位 THEN 系統 SHALL 驗證是否符合預定義的分層角色對照表
2. WHEN 檢查 purpose 欄位 THEN 系統 SHALL 確保描述不為空且具有意義
3. WHEN 檢查 constraints 欄位 THEN 系統 SHALL 驗證是否為陣列格式
4. WHEN 檢查 dependencies 欄位 THEN 系統 SHALL 驗證是否為陣列格式
5. WHEN 檢查 security 欄位 THEN 系統 SHALL 驗證是否為有效的安全等級 (none|low|medium|high|critical)
6. WHEN 檢查 lastmod 欄位 THEN 系統 SHALL 驗證日期格式為 YYYY-MM-DD

### 需求 3: 自動修復建議

**用戶故事**: 作為開發者，我希望系統能夠提供自動修復建議，以快速修正不符合規範的檔案標頭。

#### 驗收標準

1. WHEN 發現格式錯誤 THEN 系統 SHALL 提供修復建議
2. WHEN 檔案缺少標頭 THEN 系統 SHALL 根據檔案路徑自動推斷適當的 role
3. WHEN 提供修復建議 THEN 系統 SHALL 生成符合規範的標頭模板
4. IF 使用者選擇自動修復 THEN 系統 SHALL 備份原檔案並應用修復
5. WHEN 自動修復完成 THEN 系統 SHALL 報告修復的檔案數量和詳情

### 需求 4: CI/CD 整合

**用戶故事**: 作為 DevOps 工程師，我希望將檔案標頭驗證整合到 CI/CD 流程中，以確保所有提交的代碼都符合規範。

#### 驗收標準

1. WHEN 在 CI 環境執行 THEN 系統 SHALL 以非互動模式運行
2. WHEN 發現違規檔案 THEN 系統 SHALL 返回非零退出碼
3. WHEN 所有檔案符合規範 THEN 系統 SHALL 返回零退出碼
4. WHEN 生成報告 THEN 系統 SHALL 支援 JSON 和 Markdown 格式輸出
5. WHEN 整合到 Git hooks THEN 系統 SHALL 只檢查變更的檔案

### 需求 5: 配置和自定義

**用戶故事**: 作為專案負責人，我希望能夠配置驗證規則和排除特定檔案，以適應專案的特殊需求。

#### 驗收標準

1. WHEN 使用配置檔案 THEN 系統 SHALL 支援 JSON 格式的配置檔案
2. WHEN 配置排除規則 THEN 系統 SHALL 支援 glob 模式的檔案排除
3. WHEN 自定義角色對照表 THEN 系統 SHALL 允許擴展預定義的角色列表
4. WHEN 配置安全等級 THEN 系統 SHALL 允許自定義安全等級選項
5. WHEN 更新配置 THEN 系統 SHALL 驗證配置檔案的有效性

### 需求 6: 報告和統計

**用戶故事**: 作為專案經理，我希望獲得詳細的合規性報告和統計資訊，以追蹤代碼品質改善進度。

#### 驗收標準

1. WHEN 生成報告 THEN 系統 SHALL 包含總檔案數、合規檔案數、違規檔案數
2. WHEN 統計違規類型 THEN 系統 SHALL 按違規類型分類統計
3. WHEN 顯示進度 THEN 系統 SHALL 計算合規性百分比
4. WHEN 生成趨勢報告 THEN 系統 SHALL 支援歷史數據比較
5. WHEN 輸出報告 THEN 系統 SHALL 支援控制台、檔案、和 HTML 格式

## 邊界條件

- 只處理 `.ts` 檔案，排除 `.d.ts` 類型定義檔案
- 排除 `node_modules`、`dist`、`.git` 等目錄
- 支援 Windows、macOS、Linux 作業系統
- 相容 Node.js 18+ 版本

## 非功能需求

- 性能: 能夠在 30 秒內處理 1000+ 檔案
- 可用性: 提供清晰的錯誤訊息和使用說明
- 可維護性: 模組化設計，易於擴展和修改
- 可靠性: 處理檔案讀取錯誤和權限問題
