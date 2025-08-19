# Angular 20 文件組織架構

## 📚 **文檔結構**

### 00. **基礎配置與結構**
- `00_file_structure_now.json` - 當前專案檔案結構
- `00-file-header-convention.md` - 檔案標頭註解規範
- `00.angular_dev_config.json` - Angular 開發配置
- `00.cognition.md` - 架構認知與問題記錄

### 01. **Angular 20 核心文檔**
- `01-angular20-architecture.md` - Angular 20 架構指南
- `01-angular20-best-practices.md` - Angular 20 最佳實踐
- `01-angular20-layout-implementation.md` - 佈局實現指南
- `01-angular20-quick-reference.md` - 快速參考手冊

### 07. **功能設計文檔**
- `07-features-design/` - 功能設計文檔目錄
  - `app-shell/` - 應用殼層設計
  - `tab-navigation/` - 標籤導航設計

### 08. **Angular API 參考**
- `08-angular-api-reference/` - Angular API 參考文檔
  - `angular_animations.json` - 動畫 API 參考
  - `angular_common.json` - 通用 API 參考
  - `angular_components-cdk.json` - 組件與 CDK API 參考
  - `angular_core_globals.json` - 核心全域 API 參考
  - `angular_core.json` - 核心 API 參考
  - `angular_elements.json` - 元素 API 參考
  - `angular_forms.json` - 表單 API 參考
  - `angular_platform-browser.json` - 平台瀏覽器 API 參考
  - `angular_router.json` - 路由 API 參考
  - `angular_service-worker.json` - 服務工作者 API 參考
  - `angular_upgrade_static.json` - 升級靜態 API 參考
  - `angular_url.json` - URL API 參考
  - `angular_ddd_core_guide.md` - **DDD 核心庫使用指南**
  - `angular_ddd_core.json` - **DDD 核心庫 API 參考**

### 11-15. **業務領域文檔**
- `11.security_plan.md` - 安全計劃
- `12.construct-v1.md` - 建構版本 1
- `12.construct-v2.md` - 建構版本 2
- `12.construct.md` - 建構文檔
- `12.contract.md` - 合約文檔
- `13.project.md` - 專案文檔
- `14.partners.md` - 合作夥伴文檔
- `15.documents.md` - 文檔管理

## 🆕 **新增 DDD 核心庫文檔**

### DDD 核心庫使用指南
- **文件位置**: `docs/08-angular-api-reference/angular_ddd_core_guide.md`
- **內容**: 完整的 `@type-ddd/core` 和 `rich-domain` 使用指南
- **適用對象**: 開發團隊、架構師、AI 助手

### DDD 核心庫 API 參考
- **文件位置**: `docs/08-angular-api-reference/angular_ddd_core.json`
- **內容**: 結構化的 API 參考，包含所有類別、方法和屬性
- **適用對象**: AI 助手、開發者查詢 API 使用

## 🎯 **AI 使用指南**

### 如何使用 DDD 核心庫文檔

1. **查詢使用方法**: 參考 `angular_ddd_core_guide.md` 中的完整使用指南
2. **查詢 API 細節**: 使用 `angular_ddd_core.json` 中的結構化 API 參考
3. **實現代碼**: 根據指南中的示例和最佳實踐來實現 DDD 架構

### 主要功能模組

- **Result 模式**: 處理成功/失敗的操作結果
- **Value Object**: 封裝業務規則的值物件
- **Entity**: 具有身份和生命週期的業務物件
- **Aggregate**: 管理相關實體和值物件的集合
- **領域事件**: 解耦業務邏輯的事件驅動架構

### 安裝命令

```bash
# 安裝核心依賴
npm install @type-ddd/core rich-domain

# 安裝特定模組（可選）
npm install @type-ddd/email @type-ddd/money @type-ddd/date @type-ddd/password
```

## 📖 **學習路徑**

1. **基礎概念**: 閱讀 `00.cognition.md` 了解架構問題
2. **DDD 實踐**: 學習 `angular_ddd_core_guide.md` 中的 DDD 實現
3. **API 查詢**: 使用 `angular_ddd_core.json` 查詢具體 API 用法
4. **實戰應用**: 參考指南中的示例代碼進行實際開發

## 🔗 **相關資源**

- [@type-ddd/core 官方文檔](https://github.com/4lessandrodev/type-ddd)
- [rich-domain 官方文檔](https://github.com/4lessandrodev/rich-domain)
- [Domain-Driven Design 官方網站](https://domainlanguage.com/)
- [Angular 官方文檔](https://angular.io/docs)
