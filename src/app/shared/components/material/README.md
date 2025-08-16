# Angular Material & CDK Wrapper Components

## 概述

本目錄包含所有Angular Material和Angular CDK組件的wrapper組件，用於統一管理和導出。這些組件遵循極簡主義設計原則，提供一致的API接口和樣式。

## 組件分類

### 1. Angular Material組件 (40個)

#### 表單組件 (Form Components) - 11個
- `mat-autocomplete` - 自動完成輸入框，支持搜索建議和選項過濾
- `mat-checkbox` - 複選框，支持三種狀態：選中、未選中、部分選中
- `mat-datepicker` - 日期選擇器，支持日期輸入和範圍選擇
- `mat-form-field` - 表單字段容器，提供標籤、提示和錯誤顯示
- `mat-input` - 文本輸入框，支持多種輸入類型和驗證
- `mat-optgroup` - 選項分組，用於組織下拉選項
- `mat-option` - 選項項目，用於下拉選擇和自動完成
- `mat-radio-button` - 單選按鈕，支持單選組
- `mat-select` - 下拉選擇框，支持單選和多選
- `mat-slide-toggle` - 滑動開關，用於布爾值選擇
- `mat-slider` - 滑塊，用於數值範圍選擇

#### 導航組件 (Navigation Components) - 6個
- `mat-menu-item` - 菜單項目，用於下拉菜單和導航
- `mat-menu` - 菜單容器，支持下拉和上下文菜單
- `mat-sidenav` - 側邊導航欄，支持響應式佈局
- `mat-stepper` - 步驟器，用於多步驟流程導航
- `mat-tabs` - 標籤頁，用於內容分類和切換
- `mat-toolbar` - 工具欄，用於頁面頂部導航和操作

#### 佈局組件 (Layout Components) - 11個
- `mat-action-list` - 操作列表，用於顯示操作按鈕列表
- `mat-card-title-group` - 卡片標題組，用於卡片頭部佈局
- `mat-card` - 卡片容器，用於內容分組和展示
- `mat-divider` - 分割線，用於視覺分隔
- `mat-expansion-panel` - 展開面板，用於可折疊內容
- `mat-grid-list` - 網格列表，用於響應式網格佈局
- `mat-grid-tile` - 網格項目，用於網格列表中的單個項目
- `mat-list-item` - 列表項目，用於列表中的單個項目
- `mat-list` - 列表容器，用於顯示項目列表
- `mat-nav-list` - 導航列表，用於導航菜單
- `mat-selection-list` - 選擇列表，支持多選和單選

#### 數據顯示組件 (Data Display Components) - 5個
- `mat-chip-listbox` - 標籤列表框，用於多選標籤
- `mat-chips` - 標籤組件，用於展示選項和過濾
- `mat-table` - 數據表格，支持排序、分頁和過濾
- `mat-text-column` - 文本列，用於表格中的文本顯示
- `mat-tree` - 樹形組件，用於層級數據展示

#### 按鈕和操作組件 (Button & Action Components) - 4個
- `mat-button-toggle` - 按鈕切換組，支持單選和多選
- `mat-button` - 按鈕組件，支持多種樣式和狀態
- `mat-fab` - 浮動操作按鈕，用於主要操作
- `mat-icon-button` - 圖標按鈕，用於工具操作

#### 反饋組件 (Feedback Components) - 3個
- `mat-dialog` - 對話框，用於模態交互和確認
- `mat-snack-bar` - 快照條，用於顯示簡短消息和通知
- `mat-tooltip` - 工具提示，用於顯示額外信息

### 2. Angular CDK組件 (26個)

#### 表格組件 (Table Components) - 7個
- `cdk-cell` - 表格單元格，提供表格基礎功能
- `cdk-column-def` - 列定義，用於配置表格列
- `cdk-footer-row` - 頁腳行，用於表格底部內容
- `cdk-header-row` - 表頭行，用於表格標題
- `cdk-row` - 數據行，用於表格數據行
- `cdk-table` - 表格基礎，提供無樣式表格功能
- `cdk-text-column` - 文本列基礎，用於自定義列

#### 手風琴組件 (Accordion Components) - 2個
- `cdk-accordion-item` - 手風琴項目，用於可折疊內容
- `cdk-accordion` - 手風琴容器，管理多個手風琴項目

#### 步驟器組件 (Stepper Components) - 2個
- `cdk-step` - 步驟項目，用於步驟器中的單個步驟
- `cdk-stepper` - 步驟器基礎，提供步驟導航功能

#### 樹形組件 (Tree Components) - 3個
- `cdk-tree-node-outlet` - 樹節點出口，用於渲染樹節點
- `cdk-tree-node` - 樹節點，用於樹形結構中的節點
- `cdk-tree` - 樹形基礎，提供層級數據展示功能

#### 列表框組件 (Listbox Components) - 2個
- `cdk-listbox` - 列表框基礎，提供選擇列表功能
- `cdk-option` - 選項基礎，用於列表框中的選項

#### 對話框組件 (Dialog Components) - 2個
- `cdk-dialog-container` - 對話框容器，提供對話框基礎功能
- `cdk-dialog` - 對話框基礎，提供模態對話框功能

#### 菜單組件 (Menu Components) - 3個
- `cdk-menu-item` - 菜單項目基礎，提供菜單項目功能
- `cdk-menu-trigger` - 菜單觸發器，用於觸發菜單顯示
- `cdk-menu` - 菜單基礎，提供菜單容器功能

#### 測試組件 (Testing Components) - 3個
- `cdk-harness` - 測試工具，用於組件測試
- `cdk-testbed` - 測試環境，提供測試基礎設施
- `cdk-testing` - 測試組件，用於測試相關功能

#### 其他工具組件 (Utility Components) - 2個
- `cdk-keycodes` - 鍵碼工具，提供鍵盤事件處理
- `cdk-version` - 版本信息，顯示CDK版本

## 使用方法

### 1. 導入組件

```typescript
// 從統一導出點導入需要的組件
import {
  MatButtonComponent,
  MatInputComponent,
  MatFormFieldComponent,
  MatCardComponent,
  MatTableComponent
} from '@shared/components/material';
```

### 2. 在組件中使用

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // 導入我們的Material組件wrapper
    MatButtonComponent,
    MatInputComponent,
    MatFormFieldComponent,
    MatCardComponent
  ],
  template: `
    <mat-card>
      <mat-card-title>示例表單</mat-card-title>
      <mat-card-content>
        <mat-form-field appearance="outline">
          <mat-label>用戶名</mat-label>
          <mat-input
            [(ngModel)]="username"
            placeholder="請輸入用戶名">
          </mat-input>
        </mat-form-field>

        <mat-button
          (click)="onSubmit()"
          class="submit-button">
          提交
        </mat-button>
      </mat-card-content>
    </mat-card>
  `
})
export class ExampleComponent {
  username: string = '';

  onSubmit(): void {
    console.log('用戶名:', this.username);
  }
}
```

### 3. 樣式自定義

```scss
// 自定義組件樣式
.submit-button {
  background-color: #1976d2;
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1565c0;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
}
```

## 組件特性

### 1. 統一API
- 所有組件都遵循一致的命名規範
- 統一的導入和導出方式
- 一致的組件結構和接口

### 2. 極簡主義設計
- 組件實現簡潔明了
- 避免過度複雜化
- 專注於核心功能

### 3. Wrapper模式
- 每個組件都是對應Angular Material/CDK組件的wrapper
- 便於統一管理和維護
- 支持自定義擴展

### 4. 響應式支持
- 支持移動端和桌面端
- 響應式佈局和樣式
- 觸摸友好的交互

## 最佳實踐

### 1. 組件選擇
- 根據功能需求選擇合適的組件
- 優先使用Material組件，需要無樣式時使用CDK組件
- 考慮組件的可訪問性和用戶體驗

### 2. 樣式管理
- 使用CSS類名進行樣式自定義
- 遵循Material Design設計規範
- 保持樣式的一致性和可維護性

### 3. 性能優化
- 按需導入組件，避免導入未使用的組件
- 使用OnPush變更檢測策略
- 合理使用組件的生命週期鉤子

### 4. 測試
- 為組件編寫單元測試
- 使用Angular Testing Utilities進行組件測試
- 測試組件的各種狀態和交互

## 常見問題

### Q: 如何自定義組件樣式？
A: 可以通過CSS類名或深度選擇器來自定義組件樣式。建議使用CSS類名，避免破壞組件的封裝性。

### Q: 組件是否支持服務端渲染？
A: 是的，所有組件都支持Angular Universal的服務端渲染。

### Q: 如何處理組件的國際化？
A: 組件本身不包含文本內容，國際化需要在模板中處理，使用Angular的i18n功能。

### Q: 組件是否支持主題切換？
A: 是的，組件支持Angular Material的主題系統，可以通過CSS變量自定義主題。

## 更新日誌

### v3.0.0 (2024-01-01)
- 初始版本發布
- 包含66個Angular Material和CDK wrapper組件
- 統一的組件管理和導出系統
- 完整的JSDoc文檔註解

## 貢獻指南

1. 遵循現有的代碼風格和架構
2. 為新組件添加完整的JSDoc註解
3. 更新組件分類和導出
4. 編寫相應的測試用例
5. 更新README文檔

## 相關文檔

- [Angular Material官方文檔](https://material.angular.io/)
- [Angular CDK官方文檔](https://material.angular.io/cdk)
- [Material Design設計規範](https://material.io/design)
- [Angular組件開發指南](https://angular.io/guide/component-overview)

---

**注意**: 本目錄中的所有組件都是wrapper組件，用於統一管理和導出。組件的具體實現和樣式遵循Angular Material和CDK的官方規範。
