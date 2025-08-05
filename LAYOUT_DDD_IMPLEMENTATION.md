# DDD 佈局系統實現

## 概述

本項目將 ng-antd-admin-17.1.0 的佈局系統轉換為 DDD (Domain-Driven Design) 架構，實現了極簡主義設計原則，專注於核心業務邏輯和清晰的模組邊界。

## 架構層次

### 1. Domain Layer (領域層)

#### 核心實體
- **Layout**: 佈局實體，管理佈局模式和狀態
- **Tab**: 標籤頁實體，管理標籤頁的生命週期
- **Menu**: 菜單實體，管理導航菜單結構

#### 領域特性
- 豐富的業務邏輯封裝在實體內部
- 不可變的狀態管理
- 清晰的業務規則表達

### 2. Application Layer (應用層)

#### 應用服務
- **LayoutApplicationService**: 佈局業務邏輯處理
- **TabApplicationService**: 標籤頁業務邏輯處理

#### 核心功能
- 佈局模式切換 (side/top/mixin)
- 主題切換 (light/dark)
- 標籤頁管理 (新增/關閉/刷新)
- 響應式佈局控制

### 3. Infrastructure Layer (基礎設施層)

#### 倉儲實現
- **LayoutRepository**: 佈局數據持久化
- **TabRepository**: 標籤頁數據持久化

#### 技術特性
- Firebase Firestore 集成
- 異步數據操作
- 錯誤處理機制

### 4. Presentation Layer (表現層)

#### 核心組件
- **DefaultLayoutComponent**: 主要佈局容器
- **SidebarComponent**: 側邊欄導航
- **HeaderComponent**: 頭部組件
- **TabComponent**: 標籤頁組件

#### UI 特性
- 基於 ng-zorro-antd 組件庫
- 響應式設計
- 主題支持
- 動畫效果

## 核心功能實現

### 1. 佈局模式管理

```typescript
// 支持三種佈局模式
type LayoutMode = 'side' | 'top' | 'mixin';

// 動態切換佈局
async setMode(mode: LayoutMode): Promise<void>
```

### 2. 標籤頁系統

```typescript
// 標籤頁操作
- addTab(): 新增標籤
- closeTab(): 關閉標籤
- closeOtherTabs(): 關閉其他標籤
- closeRightTabs(): 關閉右側標籤
- closeLeftTabs(): 關閉左側標籤
- refreshTab(): 刷新標籤
```

### 3. 主題系統

```typescript
// 主題切換
type ThemeMode = 'light' | 'dark';

// 動態主題應用
async setTheme(theme: ThemeMode): Promise<void>
```

### 4. 響應式設計

```typescript
// 側邊欄折疊
async toggleCollapsed(): Promise<void>

// 移動端適配
nzBreakpoint="lg"
```

## 技術特色

### 1. 極簡主義設計
- 避免過度工程化
- 專注核心業務邏輯
- 清晰的模組邊界

### 2. DDD 原則
- 領域驅動設計
- 業務邏輯封裝
- 清晰的層次結構

### 3. 現代化技術棧
- Angular 19
- TypeScript 嚴格模式
- ng-zorro-antd 組件庫
- Firebase 後端服務

### 4. 開發體驗
- 即時邏輯檢查
- 自動化代碼生成
- Context7 文檔支持

## 文件結構

```
src/app/
├── domain/
│   └── layout/
│       ├── layout.entity.ts
│       ├── tab.entity.ts
│       └── menu.entity.ts
├── application/
│   └── layout/
│       ├── layout.application.service.ts
│       ├── tab.application.service.ts
│       ├── layout.dto.ts
│       └── tab.dto.ts
├── infrastructure/
│   └── layout/
│       ├── layout.repository.ts
│       └── tab.repository.ts
├── presentation/
│   └── layout/
│       ├── default-layout/
│       ├── sidebar/
│       ├── header/
│       └── tab/
└── shared/
    └── services/
        └── layout.service.ts
```

## 使用方式

### 1. 基本使用

```typescript
// 注入佈局服務
constructor(private layoutService: LayoutService) {}

// 初始化佈局
async ngOnInit() {
  await this.layoutService.loadLayout();
  await this.layoutService.loadTabs();
}
```

### 2. 佈局操作

```typescript
// 切換佈局模式
await this.layoutService.setMode('top');

// 切換主題
await this.layoutService.setTheme('dark');

// 折疊側邊欄
await this.layoutService.toggleCollapsed();
```

### 3. 標籤頁操作

```typescript
// 新增標籤
await this.layoutService.addTab('Dashboard', '/dashboard');

// 關閉標籤
await this.layoutService.closeTab(tabId);

// 刷新標籤
await this.layoutService.refreshTab(tabId);
```

## 最佳實踐

### 1. 錯誤處理
- 統一的錯誤處理機制
- 用戶友好的錯誤提示
- 優雅的降級處理

### 2. 性能優化
- OnPush 變更檢測策略
- 異步數據加載
- 組件懶加載

### 3. 可維護性
- 清晰的代碼結構
- 完整的類型定義
- 詳細的文檔註釋

## 擴展性

### 1. 新佈局模式
- 實現新的 LayoutMode 類型
- 擴展佈局組件
- 更新路由配置

### 2. 新標籤頁功能
- 擴展 Tab 實體
- 添加新的標籤頁操作
- 更新 UI 組件

### 3. 新主題支持
- 實現新的 ThemeMode 類型
- 擴展主題配置
- 更新樣式系統

## 總結

這個 DDD 佈局系統實現了：

1. **清晰的架構層次**: 領域、應用、基礎設施、表現層分離
2. **極簡主義設計**: 避免過度工程化，專注核心功能
3. **現代化技術**: Angular 19 + TypeScript + ng-zorro-antd
4. **優秀的開發體驗**: 即時檢查、自動化生成、文檔支持
5. **良好的擴展性**: 模組化設計，易於維護和擴展

通過這個實現，我們建立了一個穩定、高效、且具良好擴展性的 DDD 架構基礎，為後續的維護與擴充提供了良好的基礎。 