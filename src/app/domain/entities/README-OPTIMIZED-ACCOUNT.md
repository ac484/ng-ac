# 優化帳戶實體 (OptimizedAccount)

## 概覽

`OptimizedAccount` 是基於新的 `OptimizedBaseEntity` 重構的帳戶實體，遵循 DDD 架構優化的設計原則：

- **簡化設計**：移除過度的 getter/setter 模式，使用直接屬性存取
- **保留複雜業務邏輯**：保留 `Money` 值物件用於金額計算和驗證
- **簡化狀態管理**：使用枚舉簡化帳戶狀態和類型管理
- **統一錯誤處理**：提供清晰的錯誤訊息和驗證機制

## 主要特性

### 1. 簡化的屬性存取

```typescript
// 優化前 (複雜)
get accountNumber(): AccountNumber { return this._accountNumber; }
get accountName(): AccountName { return this._accountName; }

// 優化後 (簡化)
accountNumber: string;
name: string;
```

### 2. 保留 Money 值物件

```typescript
// 保留 Money 值物件用於複雜業務邏輯
private _balance: Money;

// 提供便利方法
getBalance(): Money
getBalanceAmount(): number
getCurrency(): string
```

### 3. 簡化的狀態管理

```typescript
export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    CLOSED = 'closed'
}

export enum AccountType {
    CHECKING = 'checking',
    SAVINGS = 'savings',
    CREDIT = 'credit'
}
```

## 使用範例

### 創建帳戶

```typescript
// 使用指定帳戶號碼創建
const account = OptimizedAccount.create({
    userId: 'user-123',
    accountNumber: 'ACC-789',
    name: 'My Checking Account',
    type: AccountType.CHECKING,
    initialBalance: 1000,
    currency: 'USD',
    description: 'Primary checking account'
});

// 自動生成帳戶號碼
const account2 = OptimizedAccount.createWithGeneratedNumber({
    userId: 'user-123',
    name: 'My Savings Account',
    type: AccountType.SAVINGS,
    initialBalance: 5000,
    currency: 'USD'
});
```

### 帳戶操作

```typescript
// 存款
account.deposit(500);

// 提款
account.withdraw(200);

// 轉帳
account.transferTo(targetAccount, 300);

// 更新資訊
account.updateInfo('Updated Account Name', 'New description');

// 狀態管理
account.activate();
account.deactivate();
account.suspend();
account.close(); // 需要餘額為零
```

### 業務邏輯檢查

```typescript
// 檢查帳戶狀態
if (account.isActive()) {
    // 帳戶啟用中
}

if (account.canPerformTransactions()) {
    // 可以執行交易
}

if (account.hasSufficientFunds(amount)) {
    // 有足夠資金
}
```

### 獲取帳戶資訊

```typescript
// 獲取摘要
const summary = account.getSummary();
console.log(summary.formattedBalance); // "$1,000.00"

// 獲取顯示物件
const displayObj = account.toDisplayObject();
console.log(displayObj.statusText); // "啟用"

// 序列化
const json = account.toJSON();
```

## 領域事件

帳戶實體會自動產生以下領域事件：

- `AccountCreated`：帳戶創建時
- `AccountBalanceChanged`：餘額變更時
- `MoneyTransferred`：轉帳時
- `AccountUpdated`：帳戶資訊更新時
- `AccountStatusChanged`：狀態變更時
- `AccountClosed`：帳戶關閉時

```typescript
// 獲取領域事件
const events = account.getDomainEvents();
events.forEach(event => {
    console.log(`Event: ${event.type} at ${event.timestamp}`);
});

// 清除事件
account.clearDomainEvents();
```

## 驗證機制

```typescript
// 驗證帳戶資料
const validation = account.validate();
if (!validation.isValid) {
    console.log('Validation errors:', validation.errors);
}
```

## 與原始實體的差異

### 移除的複雜性

1. **值物件過度使用**：移除了 `AccountNumber`, `AccountName`, `AccountStatus`, `Currency` 等簡單值物件
2. **複雜的 getter/setter**：改用直接屬性存取
3. **過度抽象**：簡化了建構函數和工廠方法

### 保留的複雜業務邏輯

1. **Money 值物件**：保留用於金額計算、格式化和驗證
2. **業務規則驗證**：保留所有重要的業務邏輯檢查
3. **領域事件**：保留事件驅動的架構模式

### 新增的便利功能

1. **統一的基礎類別**：繼承自 `OptimizedAggregateRoot`
2. **簡化的工廠方法**：更直觀的創建方式
3. **改進的錯誤處理**：更清晰的錯誤訊息
4. **標準化的序列化**：統一的 JSON 轉換

## 測試覆蓋

實體包含完整的單元測試，涵蓋：

- 建構函數和工廠方法
- 所有業務操作（存款、提款、轉帳）
- 狀態管理和驗證
- 錯誤處理和邊界條件
- Money 值物件整合
- 領域事件生成
- 序列化和顯示功能

## 效能考量

1. **記憶體使用**：減少了不必要的值物件創建
2. **執行效能**：簡化了屬性存取路徑
3. **開發效率**：降低了認知複雜度，提高了可讀性

## 遷移指南

從原始 `Account` 實體遷移到 `OptimizedAccount`：

1. **屬性存取**：將 `account.accountName.getValue()` 改為 `account.name`
2. **餘額操作**：使用 `account.getBalance()` 獲取 Money 物件
3. **狀態檢查**：使用 `account.isActive()` 等便利方法
4. **創建方式**：使用新的工廠方法 `OptimizedAccount.create()`

這個優化版本在保持所有業務功能的同時，大幅簡化了程式碼結構，提升了開發體驗和維護性。