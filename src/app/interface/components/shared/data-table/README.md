# DataTableComponent - 可重用的資料表格組件

## 概覽

`DataTableComponent` 是一個基於 ng-zorro-antd 的可重用資料表格組件，提供了完整的表格功能，包括排序、篩選、分頁、自定義欄位類型和操作按鈕。

## 特性

- ✅ 支援多種欄位類型（文字、狀態、貨幣、日期、數字、布林）
- ✅ 內建排序和篩選功能
- ✅ 完整的分頁支援
- ✅ 可自定義操作按鈕
- ✅ 響應式設計
- ✅ TypeScript 類型安全
- ✅ 完整的測試覆蓋

## 安裝和導入

```typescript
import { DataTableComponent } from './shared/data-table/data-table.component';
import { TableColumn, TableAction, PaginationConfig } from './shared/data-table/table-column.interface';

@Component({
  imports: [DataTableComponent],
  // ...
})
```

## 基本用法

```typescript
@Component({
  template: `
    <app-data-table
      [data]="users"
      [columns]="columns"
      [loading]="loading"
      [pagination]="pagination"
      (view)="onView($event)"
      (edit)="onEdit($event)"
      (delete)="onDelete($event)">
    </app-data-table>
  `
})
export class UserListComponent {
  users = [
    { id: '1', name: '張三', email: 'zhang@example.com', status: 'active' }
  ];
  
  columns: TableColumn[] = [
    { key: 'name', title: '姓名', type: 'text', sortable: true },
    { key: 'email', title: '電子郵件', type: 'text' },
    { key: 'status', title: '狀態', type: 'status' }
  ];
  
  pagination: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 100
  };
}
```

## API 文檔

### 輸入屬性 (Inputs)

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `data` | `T[]` | `[]` | 表格資料 |
| `columns` | `TableColumn[]` | `[]` | 欄位配置 |
| `actions` | `TableAction[]` | 預設操作 | 操作按鈕配置 |
| `loading` | `boolean` | `false` | 載入狀態 |
| `pagination` | `PaginationConfig` | 預設配置 | 分頁配置 |
| `size` | `'default' \| 'middle' \| 'small'` | `'default'` | 表格大小 |
| `bordered` | `boolean` | `false` | 是否顯示邊框 |
| `scroll` | `{x?: string \| number; y?: string \| number}` | - | 滾動配置 |
| `showActions` | `boolean` | `true` | 是否顯示操作欄位 |
| `trackByKey` | `string` | `'id'` | 追蹤函數的鍵值 |

### 輸出事件 (Outputs)

| 事件 | 類型 | 說明 |
|------|------|------|
| `pageChange` | `EventEmitter<number>` | 分頁變更事件 |
| `pageSizeChange` | `EventEmitter<number>` | 每頁數量變更事件 |
| `view` | `EventEmitter<T>` | 檢視事件 |
| `edit` | `EventEmitter<T>` | 編輯事件 |
| `delete` | `EventEmitter<T>` | 刪除事件 |
| `customAction` | `EventEmitter<{action: TableAction; item: T}>` | 自定義操作事件 |

### TableColumn 介面

```typescript
interface TableColumn {
  key: string;                    // 欄位鍵值
  title: string;                  // 欄位標題
  type: 'text' | 'status' | 'currency' | 'date' | 'number' | 'boolean';
  width?: string;                 // 欄位寬度
  sortable?: boolean;             // 是否可排序
  sortFn?: (a: any, b: any) => number;  // 自定義排序函數
  filterable?: boolean;           // 是否可篩選
  filterFn?: (value: any, item: any) => boolean;  // 自定義篩選函數
  filters?: Array<{text: string; value: any}>;    // 篩選選項
  formatter?: (value: any, item: any) => string;  // 自定義格式化函數
  statusColors?: {[key: string]: string};         // 狀態顏色映射
  statusTexts?: {[key: string]: string};          // 狀態文字映射
  hidden?: boolean;               // 是否隱藏欄位
  align?: 'left' | 'center' | 'right';           // 對齊方式
}
```

### TableAction 介面

```typescript
interface TableAction {
  type: 'view' | 'edit' | 'delete' | 'custom';
  title: string;                  // 操作標題
  icon: string;                   // 圖示類型
  danger?: boolean;               // 是否為危險操作
  disabled?: (item: any) => boolean;  // 是否禁用
  visible?: (item: any) => boolean;   // 是否顯示
  handler?: (item: any) => void;      // 自定義點擊處理
}
```

### PaginationConfig 介面

```typescript
interface PaginationConfig {
  pageIndex: number;              // 當前頁碼
  pageSize: number;               // 每頁顯示數量
  total: number;                  // 總數據量
  showSizeChanger?: boolean;      // 是否顯示每頁數量選擇器
  showQuickJumper?: boolean;      // 是否顯示快速跳轉
  pageSizeOptions?: number[];     // 每頁數量選項
}
```

## 欄位類型說明

### 1. 文字類型 (text)
```typescript
{ key: 'name', title: '姓名', type: 'text' }
```

### 2. 狀態類型 (status)
```typescript
{
  key: 'status',
  title: '狀態',
  type: 'status',
  statusColors: { active: 'green', inactive: 'red' },
  statusTexts: { active: '啟用', inactive: '停用' }
}
```

### 3. 貨幣類型 (currency)
```typescript
{ key: 'amount', title: '金額', type: 'currency', align: 'right' }
```

### 4. 日期類型 (date)
```typescript
{ key: 'createdAt', title: '建立時間', type: 'date' }
```

### 5. 數字類型 (number)
```typescript
{ key: 'count', title: '數量', type: 'number', align: 'right' }
```

### 6. 布林類型 (boolean)
```typescript
{ key: 'isActive', title: '是否啟用', type: 'boolean' }
```

## 自定義操作按鈕

### 基本操作
```typescript
actions: TableAction[] = [
  { type: 'view', title: '檢視', icon: 'eye' },
  { type: 'edit', title: '編輯', icon: 'edit' },
  { type: 'delete', title: '刪除', icon: 'delete', danger: true }
]
```

### 條件顯示/禁用
```typescript
actions: TableAction[] = [
  {
    type: 'edit',
    title: '編輯',
    icon: 'edit',
    visible: (item) => item.status === 'draft',
    disabled: (item) => item.locked
  }
]
```

### 自定義操作
```typescript
actions: TableAction[] = [
  {
    type: 'custom',
    title: '發送郵件',
    icon: 'mail',
    handler: (item) => this.sendEmail(item)
  }
]
```

## 進階用法

### 自定義格式化
```typescript
columns: TableColumn[] = [
  {
    key: 'status',
    title: '狀態',
    type: 'text',
    formatter: (value, item) => {
      return `${value} (${item.updatedAt})`;
    }
  }
]
```

### 自定義排序
```typescript
columns: TableColumn[] = [
  {
    key: 'priority',
    title: '優先級',
    type: 'text',
    sortable: true,
    sortFn: (a, b) => {
      const priorities = { high: 3, medium: 2, low: 1 };
      return priorities[a.priority] - priorities[b.priority];
    }
  }
]
```

### 自定義篩選
```typescript
columns: TableColumn[] = [
  {
    key: 'category',
    title: '分類',
    type: 'text',
    filterable: true,
    filters: [
      { text: '重要', value: 'important' },
      { text: '一般', value: 'normal' }
    ],
    filterFn: (value, item) => item.category === value
  }
]
```

## 樣式自定義

組件支援通過 CSS 變數進行樣式自定義：

```css
app-data-table {
  --table-header-bg: #f5f5f5;
  --table-row-hover-bg: #e6f7ff;
  --action-button-color: #1890ff;
}
```

## 最佳實踐

1. **效能優化**：使用 `trackByKey` 提升大量資料的渲染效能
2. **類型安全**：使用 TypeScript 泛型確保資料類型安全
3. **響應式設計**：使用 `scroll` 屬性處理大量欄位的水平滾動
4. **用戶體驗**：合理使用 `loading` 狀態和分頁功能
5. **無障礙功能**：操作按鈕包含適當的 `title` 和 `tooltip`

## 測試

組件包含完整的單元測試，覆蓋所有主要功能：

```bash
ng test --include="**/data-table.component.spec.ts"
```

## 相關組件

- `DynamicFormComponent` - 動態表單組件
- `ModalService` - 模態框服務
- `ErrorHandlerService` - 錯誤處理服務