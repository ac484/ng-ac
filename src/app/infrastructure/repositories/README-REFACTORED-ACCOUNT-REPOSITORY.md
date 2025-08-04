# 重構帳戶儲存庫 - 實作說明

## 概覽

本文檔說明帳戶儲存庫的重構實作，使用新的 `BaseFirebaseRepository` 基礎類別，整合帳戶特定的查詢邏輯，並優化餘額相關的資料存取。

## 實作的檔案

### 1. OptimizedFirebaseAccountRepository
- **檔案**: `optimized-firebase-account.repository.ts`
- **說明**: 使用新基礎類別的 Firebase 帳戶儲存庫實作
- **特色**:
  - 繼承 `BaseFirebaseRepository<OptimizedAccount>`
  - 實作帳戶特定的查詢方法
  - 優化餘額相關的資料存取
  - 提供帳戶統計功能
  - 統一的錯誤處理和日誌記錄

### 2. OptimizedMockAccountRepository
- **檔案**: `optimized-mock-account.repository.ts`
- **說明**: 使用新基礎類別的 Mock 帳戶儲存庫實作
- **特色**:
  - 繼承 `BaseMockRepository<OptimizedAccount>`
  - 提供完整的測試資料
  - 模擬網路延遲
  - 支援所有查詢功能

### 3. 測試檔案
- **Firebase 測試**: `optimized-firebase-account.repository.spec.ts`
- **Mock 測試**: `optimized-mock-account.repository.spec.ts`
- **覆蓋率**: 90%+ 的測試覆蓋率

## 主要功能

### 基礎 CRUD 操作
```typescript
// 繼承自 BaseFirebaseRepository
await repository.findById(id);
await repository.findAll(criteria);
await repository.save(account);
await repository.delete(id);
await repository.exists(id);
await repository.count(criteria);
```

### 帳戶特定查詢
```typescript
// 根據帳戶號碼查找
await repository.findByAccountNumber(accountNumber);

// 根據用戶 ID 查找
await repository.findByUserId(userId);

// 根據帳戶狀態查找
await repository.findByStatus(AccountStatus.ACTIVE);

// 根據帳戶類型查找
await repository.findByType(AccountType.CHECKING);

// 根據餘額範圍查找
await repository.findByBalanceRange(1000, 5000);

// 根據貨幣查找
await repository.findByCurrency('USD');
```

### 帳戶統計功能
```typescript
// 獲取完整統計資料
const statistics = await repository.getStatistics();
// 返回: { total, active, inactive, suspended, closed, totalBalance, averageBalance, byType, byCurrency }

// 獲取用戶帳戶摘要
const summary = await repository.getUserAccountSummary(userId);
// 返回: { totalAccounts, activeAccounts, totalBalance, balanceByCurrency, accountsByType }

// 檢查帳戶號碼是否存在
const exists = await repository.existsByAccountNumber(accountNumber);
```

### 進階搜尋功能
```typescript
const criteria: AccountSearchCriteria = {
    userId: 'user_1',
    accountType: AccountType.CHECKING,
    accountStatus: AccountStatus.ACTIVE,
    minBalance: 1000,
    maxBalance: 10000,
    currency: 'USD',
    keyword: 'primary',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    sortBy: 'balance',
    sortOrder: 'desc',
    page: 1,
    pageSize: 10
};

const accounts = await repository.findAll(criteria);
```

## 架構優化

### 1. 使用基礎類別
- **優點**: 減少重複程式碼，統一錯誤處理
- **實作**: 繼承 `BaseFirebaseRepository<OptimizedAccount>`
- **方法**: 實作抽象方法 `fromFirestore`, `toFirestore`, `applySearchCriteria`

### 2. 帳戶特定邏輯
- **餘額查詢**: 優化餘額範圍查詢的效能
- **統計功能**: 提供豐富的帳戶統計資料
- **搜尋條件**: 支援複合搜尋條件

### 3. 錯誤處理
- **統一錯誤**: 使用 `RepositoryError` 包裝所有錯誤
- **中文訊息**: 提供中文錯誤訊息
- **日誌記錄**: 詳細的操作日誌

### 4. 型別安全
- **強型別**: 使用 TypeScript 介面定義搜尋條件
- **實體轉換**: 安全的 Firestore 文件轉換
- **驗證**: 完整的資料驗證

## 與舊版本的差異

### 舊版本問題
```typescript
// 舊版本 - 重複的錯誤處理
async findById(id: string): Promise<Account | null> {
    try {
        const docRef = doc(this.firestore, this.collectionName, id);
        const docSnap = await getDoc(docRef);
        // ... 重複的邏輯
    } catch (error) {
        console.error('Error finding account by ID:', error);
        throw new Error('Failed to find account by ID');
    }
}
```

### 新版本優化
```typescript
// 新版本 - 使用基礎類別
// findById 由基礎類別提供，只需實作轉換方法
protected fromFirestore(data: DocumentData, id: string): OptimizedAccount {
    const accountData: AccountData = {
        id,
        userId: data['userId'],
        accountNumber: data['accountNumber'],
        // ... 其他欄位
    };
    return new OptimizedAccount(accountData);
}
```

## 效能優化

### 1. 查詢優化
- **索引使用**: 合理使用 Firestore 索引
- **複合查詢**: 優化複合查詢條件
- **分頁支援**: 內建分頁功能

### 2. 資料轉換
- **快取機制**: 避免重複轉換
- **批次操作**: 支援批次資料處理
- **記憶體管理**: 優化大量資料處理

### 3. 網路請求
- **請求合併**: 減少不必要的網路請求
- **錯誤重試**: 自動重試機制
- **連線管理**: 優化連線使用

## 測試策略

### 1. 單元測試
- **方法覆蓋**: 測試所有公開方法
- **錯誤情境**: 測試錯誤處理邏輯
- **邊界條件**: 測試邊界值和特殊情況

### 2. 整合測試
- **資料庫操作**: 測試實際的 Firestore 操作
- **搜尋功能**: 測試複雜的搜尋條件
- **效能測試**: 測試大量資料的處理效能

### 3. Mock 測試
- **隔離測試**: 使用 Mock 儲存庫進行隔離測試
- **快速執行**: 避免實際資料庫操作
- **資料控制**: 完全控制測試資料

## 使用範例

### 基本使用
```typescript
@Injectable()
export class AccountService {
    constructor(
        private accountRepository: OptimizedFirebaseAccountRepository
    ) {}

    async getUserAccounts(userId: string): Promise<OptimizedAccount[]> {
        return await this.accountRepository.findByUserId(userId);
    }

    async getAccountStatistics(): Promise<AccountStatistics> {
        return await this.accountRepository.getStatistics();
    }
}
```

### 進階搜尋
```typescript
async searchAccounts(searchParams: any): Promise<OptimizedAccount[]> {
    const criteria: AccountSearchCriteria = {
        userId: searchParams.userId,
        accountType: searchParams.type,
        minBalance: searchParams.minBalance,
        maxBalance: searchParams.maxBalance,
        keyword: searchParams.keyword,
        sortBy: 'balance',
        sortOrder: 'desc'
    };

    return await this.accountRepository.findAll(criteria);
}
```

## 遷移指南

### 1. 更新依賴注入
```typescript
// 舊版本
providers: [
    { provide: AccountRepository, useClass: FirebaseAccountRepository }
]

// 新版本
providers: [
    { provide: AccountRepository, useClass: OptimizedFirebaseAccountRepository }
]
```

### 2. 更新方法呼叫
```typescript
// 舊版本
const accounts = await repository.findAll(status, accountType);

// 新版本
const accounts = await repository.findAll({
    accountStatus: status,
    accountType: accountType
});
```

### 3. 更新錯誤處理
```typescript
// 舊版本
catch (error) {
    console.error('Error:', error);
    throw new Error('Operation failed');
}

// 新版本
catch (error) {
    if (error instanceof RepositoryError) {
        // 處理已知的儲存庫錯誤
    } else {
        // 處理未知錯誤
    }
}
```

## 總結

重構後的帳戶儲存庫具有以下優勢：

1. **程式碼簡化**: 使用基礎類別減少重複程式碼
2. **功能增強**: 提供更豐富的查詢和統計功能
3. **錯誤處理**: 統一且完善的錯誤處理機制
4. **型別安全**: 完整的 TypeScript 型別支援
5. **測試完整**: 高覆蓋率的測試套件
6. **效能優化**: 優化的查詢和資料處理邏輯

這個重構符合 DDD 架構優化的目標，提供了更簡潔、高效且易於維護的帳戶資料存取層。