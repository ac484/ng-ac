# NG-AC - Angular 20 + Material 20 極簡主義 DDD 架構應用

## 項目概述

NG-AC 是一個基於 Angular 20 和 @angular/material 20 的現代化單頁應用（SPA），採用極簡主義設計哲學和領域驅動設計（DDD）架構。該項目充分利用 Angular 20 的新特性，包括 `@if`、`@for` 等控制流語法，構建了一個高度模塊化、可維護且無縫擴展的組件體系。

## 🚀 技術特性

- **Angular 20**: 最新版本的 Angular 框架
- **@angular/material 20**: Material Design 組件庫
- **DDD 架構**: 領域驅動設計架構模式
- **新控制流語法**: 使用 `@if`、`@for`、`@switch` 等新語法
- **Standalone 組件**: 完全採用獨立組件架構
- **SCSS 主題**: 自定義 Material Design 主題
- **響應式設計**: 支持移動端和桌面端
- **TypeScript 5.4**: 最新的 TypeScript 版本

## 🏗️ 架構設計

### DDD 層次結構

```
src/app/
├── domain/           # 領域層
│   ├── entities/     # 領域實體
│   └── repositories/ # 倉儲接口
├── application/      # 應用層
│   └── services/     # 應用服務
├── infrastructure/   # 基礎設施層
│   └── repositories/ # 倉儲實現
├── interface/        # 接口層
│   ├── dashboard/    # 儀表板
│   ├── users/        # 用戶管理
│   ├── products/     # 產品目錄
│   ├── orders/       # 訂單管理
│   └── settings/     # 系統設置
└── shared/           # 共享層
    ├── components/   # 共享組件
    ├── services/     # 共享服務
    ├── pipes/        # 共享管道
    ├── directives/   # 共享指令
    ├── guards/       # 路由守衛
    ├── interceptors/ # HTTP 攔截器
    ├── models/       # 數據模型
    └── utils/        # 工具函數
```

### 核心特性

- **極簡主義設計**: 清晰的視覺層次和簡潔的用戶界面
- **模塊化架構**: 高度解耦的組件和服務
- **響應式佈局**: 適配各種屏幕尺寸
- **主題系統**: 可定制的 Material Design 主題
- **狀態管理**: 基於 RxJS 的響應式狀態管理
- **路由系統**: 懶加載的路由配置
- **表單驗證**: 完整的表單驗證系統
- **錯誤處理**: 全局錯誤處理和用戶通知

## 🛠️ 安裝和運行

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Angular CLI 20

### 安裝依賴

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 開發服務器

```bash
# 啟動開發服務器
npm start
# 或
yarn start

# 應用將在 http://localhost:4200 運行
```

### 構建項目

```bash
# 生產環境構建
npm run build
# 或
yarn build

# 開發環境構建（監視模式）
npm run watch
# 或
yarn watch
```

### 代碼檢查

```bash
# 運行 ESLint
npm run lint
# 或
yarn lint
```

## 📱 功能模塊

### 1. 儀表板 (Dashboard)
- 系統統計概覽
- 用戶分佈圖表
- 系統狀態監控
- 最近活動記錄

### 2. 用戶管理 (Users)
- 用戶列表展示
- 搜索和篩選功能
- 批量操作支持
- 用戶狀態管理
- 角色權限控制

### 3. 產品目錄 (Products)
- 產品信息管理
- 分類和標籤系統
- 庫存狀態追蹤
- 產品圖片管理

### 4. 訂單管理 (Orders)
- 訂單流程管理
- 訂單狀態追蹤
- 支付處理
- 發貨管理

### 5. 系統設置 (Settings)
- 應用配置管理
- 用戶偏好設置
- 系統參數配置
- 日誌和監控

## 🎨 設計系統

### Material Design 主題

項目使用自定義的 Material Design 主題，包括：

- **主色調**: Indigo (#3f51b5)
- **強調色**: Pink (#ff4081)
- **警告色**: Red (#f44336)
- **成功色**: Green (#4caf50)
- **信息色**: Blue (#2196f3)

### 響應式斷點

- **移動端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

### 組件庫

項目包含豐富的共享組件：

- **LoadingSpinner**: 加載指示器
- **EmptyState**: 空狀態顯示
- **ConfirmDialog**: 確認對話框
- **StatusColorPipe**: 狀態顏色管道
- **ClickOutsideDirective**: 點擊外部指令
- **HighlightDirective**: 文本高亮指令

## 🔧 開發指南

### 創建新組件

```bash
ng generate component path/to/component-name
```

### 創建新服務

```bash
ng generate service path/to/service-name
```

### 創建新管道

```bash
ng generate pipe path/to/pipe-name
```

### 創建新指令

```bash
ng generate directive path/to/directive-name
```

### 代碼規範

- 使用 TypeScript 嚴格模式
- 遵循 Angular 風格指南
- 組件使用 OnPush 變更檢測策略
- 服務使用 providedIn: 'root'
- 使用 RxJS 操作符進行數據轉換

## 📚 文檔和資源

### 官方文檔
- [Angular 官方文檔](https://angular.dev/)
- [Angular Material 文檔](https://material.angular.io/)
- [Angular CLI 文檔](https://angular.io/cli)

### 學習資源
- [Angular 教程](https://angular.dev/tutorials)
- [Material Design 指南](https://material.io/design)
- [RxJS 操作符](https://rxjs.dev/guide/operators)

## 🤝 貢獻指南

1. Fork 項目
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 許可證

本項目採用 MIT 許可證 - 查看 [LICENSE](LICENSE) 文件了解詳情。

## 📞 聯繫方式

- 項目維護者: [您的姓名]
- 郵箱: [您的郵箱]
- 項目地址: [GitHub 地址]

## 🙏 致謝

感謝所有為這個項目做出貢獻的開發者和設計師。

---

**注意**: 這是一個開發中的項目，某些功能可能仍在開發中。如果您發現任何問題或有改進建議，請隨時提出 Issue 或 Pull Request。
