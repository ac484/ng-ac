# 已整合的 ng-antd-admin-example 組件

本文檔記錄了從 ng-antd-admin-example 專案中整合到當前專案的所有有用組件和功能。

## 🌳 核心表格組件

### 1. TreeTableComponent (樹狀表格)
- **路徑**: `src/app/shared/components/tree-table/`
- **功能**: 支援樹狀結構的表格，包含展開/收合、排序、分頁、複選框等功能
- **使用範例**: `/dashboard/tree-list`

### 2. AntTableComponent (通用表格)
- **路徑**: `src/app/shared/components/ant-table/`
- **功能**: 通用表格組件，支援排序、分頁、複選框、列拖拽等功能

### 3. CardTableWrapComponent (卡片表格包裝)
- **路徑**: `src/app/shared/components/card-table-wrap/`
- **功能**: 為表格提供卡片式包裝，包含工具欄、列設置、密度調整等功能

## 📄 頁面組件

### 4. PageHeaderComponent (頁面標題)
- **路徑**: `src/app/shared/components/page-header/`
- **功能**: 統一的頁面標題組件，支援麵包屑、描述、額外內容等

### 5. WaterMarkComponent (浮水印)
- **路徑**: `src/app/shared/components/water-mark/`
- **功能**: 可自定義的浮水印組件

### 6. CopyTextComponent (文本複製)
- **路徑**: `src/app/shared/components/copy-text/`
- **功能**: 一鍵複製文本到剪貼板，支援自定義提示

## 🔧 實用指令

### 7. DebounceClickDirective (防抖點擊)
- **路徑**: `src/app/shared/directives/debounce-click.directive.ts`
- **功能**: 防止按鈕重複點擊，可自定義防抖時間
- **使用**: `<button appDebounceClick [debounceTime]="1000" (debounceClick)="handleClick()">點擊</button>`

### 8. ToggleFullscreenDirective (全螢幕切換)
- **路徑**: `src/app/shared/directives/toggle-fullscreen.directive.ts`
- **功能**: 一鍵切換全螢幕模式
- **使用**: `<button appToggleFullscreen #fullscreen="appToggleFullscreen">全螢幕</button>`

## 🔄 實用管道

### 9. MapPipe (數據映射)
- **路徑**: `src/app/shared/pipes/map.pipe.ts`
- **功能**: 將數據值映射為顯示文本，支援日期格式化

### 10. TableFiledPipe (表格欄位)
- **路徑**: `src/app/shared/pipes/table-filed.pipe.ts`
- **功能**: 安全地獲取對象深層屬性值

### 11. ChangNumberToChinesePipe (數字轉中文)
- **路徑**: `src/app/shared/pipes/chang-number-to-chinese.pipe.ts`
- **功能**: 將數字轉換為中文

### 12. HtmlPipe (HTML安全渲染)
- **路徑**: `src/app/shared/pipes/html.pipe.ts`
- **功能**: 安全地渲染HTML內容

## 🛠️ 工具函數

### 13. TreeTableTools (樹狀表格工具)
- **路徑**: `src/app/utils/treeTableTools.ts`
- **功能**: 處理樹狀數據的各種工具函數

### 14. Tools (通用工具)
- **路徑**: `src/app/utils/tools.ts`
- **功能**: 包含表單驗證、文件處理、UUID生成等實用函數

## 📝 使用範例

### 樹狀表格範例
訪問 `/dashboard/tree-list` 可以看到完整的樹狀表格使用範例，包含：
- 樹狀數據展示
- 搜索功能
- 防抖點擊
- 全螢幕切換
- 文本複製
- 浮水印

### 基本使用方式

```typescript
// 在組件中導入
import { 
  TreeTableComponent, 
  DebounceClickDirective,
  CopyTextComponent 
} from '@shared';

// 在模板中使用
<app-tree-table 
  [tableData]="dataList"
  [tableConfig]="tableConfig"
  (selectedChange)="onSelectionChange($event)">
</app-tree-table>

<button appDebounceClick (debounceClick)="handleClick()">
  防抖按鈕
</button>

<app-copy-text [text]="textToCopy">複製</app-copy-text>
```

## 🎯 路由配置

已添加樹狀表格範例路由：
- **路徑**: `/dashboard/tree-list`
- **標題**: 樹狀表格
- **功能**: 展示所有整合組件的使用方式

## 📦 依賴說明

整合的組件需要以下依賴：
- `lodash` - 用於深層對象屬性訪問
- `@angular/cdk/clipboard` - 用於複製功能
- `screenfull` - 用於全螢幕功能（需要安裝）

## 🚀 下一步

可以考慮進一步整合的組件：
1. 登錄相關組件
2. 系統管理組件（需要適配業務邏輯）
3. 圖表組件
4. 文件上傳下載組件
5. 富文本編輯器組件

所有組件都已經過測試並成功編譯，可以直接在專案中使用。