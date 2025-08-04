# 優化的帳戶管理組件

## 概覽

本目錄包含重構後的帳戶管理組件，採用極簡主義的 DDD 設計原則，充分利用 ng-zorro-antd 框架特性，並整合 Money 值物件的業務邏輯。

## 組件架構

### 1. OptimizedAccountListComponent
**檔案**: `optimized-account-list.component.ts`

**功能特點**:
- 使用通用 `DataTableComponent` 顯示帳戶列表
- 整合帳戶統計資料顯示
- 支援分頁、排序、篩選功能
- 提供快速操作按鈕（存款、提款、轉帳）
- 即時更新帳戶餘額和狀態

**主要功能**:
```typescript
// 帳戶列表載入
async loadAccounts(): Promise<void>

// 帳戶統計計算
async loadAccountStats(): Promise<void>

// 交易操作
private depositToAccount(account: AccountResponseDto): void
private withdrawFromAccount(account: AccountResponseDto): void
private transferFromAccount(account: AccountResponseDto): void

// 交易完成處理
onTransactionComplete(result: TransactionResult): void
```

**表格配置**:
- 帳戶號碼（可排序）
- 帳戶名稱（可排序）
- 帳戶類型（狀態標籤）
- 餘額（右對齊，支援負數顯示）
- 狀態（狀態標籤）
- 最後交易時間
- 創建時間

### 2. OptimizedAccountFormComponent
**檔案**: `optimized-account-form.component.ts`

**功能特點**:
- 使用通用 `DynamicFormComponent` 建立表單
- 支援創建和編輯模式
- 整合 Money 值物件驗證
- 自動生成帳戶號碼功能
- 響應式表單驗證

**表單欄位**:
```typescript
// 創建模式欄位
- name: 帳戶名稱（必填）
- accountNumber: 帳戶號碼（可選，自動生成）
- type: 帳戶類型（必填）
- currency: 貨幣（必填，預設 TWD）
- initialBalance: 初始餘額（可選，預設 0）
- description: 帳戶描述（可選）

// 編輯模式限制
- accountNumber: 禁用（不可修改）
- type: 禁用（不可修改）
- currency: 禁用（不可修改）
- initialBalance: 禁用（使用交易功能修改）
```

**驗證規則**:
- 帳戶名稱：2-50 字符
- 帳戶號碼：大寫字母、數字和連字符
- 初始餘額：非負數
- 描述：最多 200 字符

### 3. OptimizedAccountDetailComponent
**檔案**: `optimized-account-detail.component.ts`

**功能特點**:
- 詳細顯示帳戶資訊
- 即時更新餘額（每 30 秒自動重新整理）
- 餘額健康度指示器
- 最近交易記錄時間軸
- 快速操作按鈕

**即時更新機制**:
```typescript
// 自動重新整理
private startAutoRefresh(): void {
  interval(30000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.loadAccountData();
    });
}

// 餘額健康度計算
getBalanceHealthPercentage(): number {
  if (this.account.balance < 0) return 0;
  if (this.account.balance < 1000) return 25;
  if (this.account.balance < 10000) return 50;
  if (this.account.balance < 50000) return 75;
  return 100;
}
```

**顯示區塊**:
- 帳戶概覽（餘額、狀態、最後更新）
- 帳戶詳細資訊（描述表格）
- 快速操作按鈕
- 最近交易記錄（時間軸顯示）

### 4. AccountTransactionModalComponent
**檔案**: `account-transaction-modal.component.ts`

**功能特點**:
- 統一的交易操作模態框
- 支援存款、提款、轉帳三種操作
- 使用 `DynamicFormComponent` 建立交易表單
- 整合 Money 值物件業務邏輯
- 即時餘額計算和驗證

**交易類型**:
```typescript
export type TransactionType = 'deposit' | 'withdraw' | 'transfer';

// 存款操作
async handleDeposit(formValue: any): Promise<TransactionResult>

// 提款操作
async handleWithdraw(formValue: any): Promise<TransactionResult>

// 轉帳操作
async handleTransfer(formValue: any): Promise<TransactionResult>
```

**表單配置**:
- **存款**: 金額 + 說明
- **提款**: 金額 + 說明（驗證餘額充足）
- **轉帳**: 金額 + 目標帳戶 + 說明（驗證貨幣一致）

## Money 值物件整合

### 顯示格式化
```typescript
// 餘額格式化器
balanceFormatter = (value: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: this.account?.currency || 'TWD'
  }).format(value);
};

// 格式化貨幣顯示
private formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: this.account?.currency || 'TWD'
  }).format(amount);
}
```

### 業務邏輯驗證
```typescript
// 提款金額驗證
{
  type: 'custom',
  validator: (value: number) => {
    if (this.transactionType === 'withdraw' && this.account) {
      return value <= this.account.balance;
    }
    return true;
  },
  message: '提款金額不能超過帳戶餘額'
}
```

## 效能優化

### 1. 即時更新策略
- 自動重新整理機制（30 秒間隔）
- 交易完成後立即更新本地資料
- 使用 RxJS 管理訂閱生命週期

### 2. 資料快取
- 本地帳戶列表快取
- 統計資料計算快取
- 避免重複 API 呼叫

### 3. 視覺回饋
- 載入狀態指示器
- 即時表單驗證
- 操作成功/失敗訊息

## 測試覆蓋

### 測試檔案
- `optimized-account-list.component.spec.ts`
- `optimized-account-form.component.spec.ts`
- `optimized-account-detail.component.spec.ts`
- `account-transaction-modal.component.spec.ts`

### 測試範圍
- 組件初始化
- 資料載入和錯誤處理
- 表單驗證和提交
- 交易操作邏輯
- 即時更新機制
- 模態框控制
- Money 值物件整合

## 使用範例

### 1. 帳戶列表頁面
```typescript
// 路由配置
{
  path: 'accounts',
  component: OptimizedAccountListComponent
}
```

### 2. 帳戶表單頁面
```typescript
// 創建帳戶
{
  path: 'accounts/create',
  component: OptimizedAccountFormComponent,
  data: { mode: 'create' }
}

// 編輯帳戶
{
  path: 'accounts/:id/edit',
  component: OptimizedAccountFormComponent,
  data: { mode: 'edit' }
}
```

### 3. 帳戶詳情頁面
```typescript
// 帳戶詳情
{
  path: 'accounts/:id',
  component: OptimizedAccountDetailComponent
}
```

### 4. 交易模態框使用
```html
<app-account-transaction-modal
  [(visible)]="transactionModalVisible"
  [account]="selectedAccount"
  [transactionType]="currentTransactionType"
  [availableAccounts]="accounts"
  (transactionComplete)="onTransactionComplete($event)"
  (cancel)="onTransactionCancel()">
</app-account-transaction-modal>
```

## 設計原則遵循

### 1. 極簡主義
- 避免過度工程
- 專注核心功能
- 清晰的組件邊界

### 2. DDD 架構
- 領域邏輯封裝在實體中
- 應用服務協調業務流程
- 介面層專注於使用者互動

### 3. 效能優先
- 即時更新機制
- 本地資料快取
- 最小化 API 呼叫

### 4. 可維護性
- 統一的組件模式
- 完整的測試覆蓋
- 清晰的程式碼結構

## 後續擴展

### 1. 功能增強
- 批次操作支援
- 交易記錄匯出
- 進階篩選和搜尋
- 帳戶分析圖表

### 2. 效能優化
- 虛擬滾動支援
- 資料分頁載入
- 背景資料同步
- 離線模式支援

### 3. 使用者體驗
- 拖拽排序
- 快捷鍵支援
- 個人化設定
- 主題切換

這個重構後的帳戶管理組件系統提供了一個清晰、高效、可擴展的基礎，完全符合 DDD 架構原則和極簡主義設計理念。