# 優化交易實體 (OptimizedTransaction)

## 概覽

`OptimizedTransaction` 是基於 DDD 架構優化需求重構的交易實體，使用新的 `OptimizedAggregateRoot` 基類，保留 `Money` 值物件用於金額計算，並簡化了交易狀態轉換邏輯。

## 主要改進

### 1. 簡化的實體設計
- 使用直接屬性存取，移除過度的 getter/setter 模式
- 繼承自 `OptimizedAggregateRoot` 基類
- 保持領域事件支援

### 2. 保留 Money 值物件
- 交易金額使用 `Money` 值物件，確保貨幣計算的正確性
- 手續費也使用 `Money` 值物件，支援複雜的金額運算
- 提供 `getTotalAmount()` 方法計算包含手續費的總金額

### 3. 簡化的狀態轉換邏輯
- 使用狀態機模式，明確定義允許的狀態轉換
- 提供 `canTransitionTo()` 私有方法驗證狀態轉換
- 簡化的狀態轉換方法：`process()`, `complete()`, `fail()`, `cancel()`, `retry()`

## 狀態轉換規則

```
PENDING → PROCESSING, CANCELLED, FAILED
PROCESSING → COMPLETED, FAILED
COMPLETED → (無法轉換)
FAILED → PENDING (重試)
CANCELLED → (無法轉換)
```

## 使用範例

### 創建交易

```typescript
// 使用工廠方法創建
const amount = new Money(100, 'USD');
const transaction = OptimizedTransaction.createDeposit(
  'DEP-001',
  'account-123',
  'user-456',
  amount,
  'Salary deposit'
);

// 或使用通用創建方法
const transaction = OptimizedTransaction.create(
  'TXN-001',
  'account-123',
  'user-456',
  amount,
  TransactionType.WITHDRAWAL,
  'ATM withdrawal'
);
```

### 狀態轉換

```typescript
// 處理交易
transaction.process();
console.log(transaction.isProcessing()); // true

// 完成交易
transaction.complete();
console.log(transaction.isCompleted()); // true

// 失敗處理
if (someError) {
  transaction.fail('Insufficient funds');
  console.log(transaction.isFailed()); // true
  
  // 重試失敗的交易
  transaction.retry();
  console.log(transaction.isPending()); // true
}
```

### 金額計算

```typescript
const transaction = OptimizedTransaction.createTransfer(
  'TRF-001',
  'account-123',
  'user-456',
  new Money(100, 'USD'),
  'Transfer to savings'
);

// 添加手續費
transaction.addFees(new Money(5, 'USD'));

// 獲取總金額
const total = transaction.getTotalAmount();
console.log(total.toDisplayString()); // "$105.00"
```

### 業務方法

```typescript
// 更新描述（只有未完成的交易可以修改）
if (transaction.canBeModified()) {
  transaction.updateDescription('Updated description');
  transaction.updateCategory('Food & Dining');
}

// 驗證交易
const validation = transaction.validate();
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}

// 獲取交易摘要
const summary = transaction.getSummary();
console.log(summary);
```

## 領域事件

交易實體會在以下情況發出領域事件：

- `TransactionCreatedEvent` - 創建交易時
- `TransactionProcessedEvent` - 完成交易時
- `TransactionFailedEvent` - 交易失敗時
- `TransactionCancelledEvent` - 取消交易時

```typescript
// 檢查領域事件
if (transaction.hasDomainEvents()) {
  const events = transaction.getDomainEvents();
  // 處理事件...
  transaction.clearDomainEvents();
}
```

## 驗證規則

交易實體包含以下驗證規則：

- 交易編號不能為空
- 帳戶 ID 不能為空
- 用戶 ID 不能為空
- 交易金額必須大於零
- 交易描述不能為空且不能超過 500 個字元
- 手續費不能為負數
- 手續費貨幣必須與交易金額貨幣一致

## 測試覆蓋

實體包含完整的單元測試，涵蓋：

- 實體創建和初始化
- 所有狀態轉換場景
- 業務方法功能
- 驗證邏輯
- 領域事件發出
- 錯誤處理

測試文件：`optimized-transaction.entity.spec.ts`

## 與原始實體的差異

### 簡化的設計
- 移除複雜的 getter/setter 模式
- 直接屬性存取
- 使用新的基類架構

### 改進的狀態管理
- 明確的狀態轉換規則
- 更好的錯誤訊息
- 支援交易重試

### 保留的複雜性
- Money 值物件用於金額計算
- 領域事件支援
- 完整的驗證邏輯

## 相關文件

- [優化基礎實體](./README-OPTIMIZED.md)
- [Money 值物件](../value-objects/account/money.value-object.ts)
- [交易領域事件](../events/transaction-events.ts)