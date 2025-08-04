# 重構帳戶應用服務 (RefactoredAccountApplicationService)

## 概覽

`RefactoredAccountApplicationService` 是基於新的 `BaseApplicationService` 重構的帳戶應用服務，遵循 DDD 架構優化的設計原則：

- **使用新的基礎類別**：繼承自 `BaseApplicationService`，獲得統一的 CRUD 操作模式
- **整合 Money 值物件**：充分利用 `Money` 值物件的業務邏輯進行餘額計算和驗證
- **簡化餘額計算**：移除重複的驗證邏輯，專注於業務協調
- **統一錯誤處理**：使用基礎類別的錯誤處理機制
- **標準化日誌記錄**：提供詳細的操作日誌

## 主要特性

### 1. 繼承基礎應用服務

```typescript
export class RefactoredAccountApplicationService extends BaseApplicationService<
    OptimizedAccount,
    CreateAccountDto,
    UpdateAccountDto,
    AccountResponseDto
> {
    // 實作抽象方法
    protected async createEntity(dto: CreateAccountDto): Promise<OptimizedAccount>
    protected async updateEntity(entity: OptimizedAccount, dto: UpdateAccountDto): Promise<void>
    protected mapToResponseDto(entity: OptimizedAccount): AccountResponseDto
}
```

### 2. 整合 Money 值物件業務邏輯

```typescript
// 存款操作
async deposit(accountId: string, dto: DepositDto): Promise<AccountResponseDto> {
    const account = await this.repository.findById(accountId);
    account.deposit(dto.amount); // 使用實體的業務邏輯
    await this.repository.save(account);
    return this.mapToResponseDto(account);
}

// 轉帳操作
async transfer(sourceAccountId: string, dto: TransferDto): Promise<TransferResultDto> {
    const sourceAccount = await this.repository.findById(sourceAccountId);
    const targetAccount = await this.repository.findById(dto.targetAccountId);
    
    sourceAccount.transferTo(targetAccount, dto.amount); // 使用實體的轉帳邏輯
    
    await this.repository.save(sourceAccount);
    await this.repository.save(targetAccount);
    
    return {
        sourceAccount: this.mapToResponseDto(sourceAccount),
        targetAccount: this.mapToResponseDto(targetAccount),
        transferAmount: dto.amount,
        timestamp: new Date().toISOString()
    };
}
```

### 3. 簡化的搜尋和過濾

```typescript
// 覆寫基礎類別的過濾方法
protected override async filterByKeyword(entities: OptimizedAccount[], keyword: string): Promise<OptimizedAccount[]> {
    const lowerKeyword = keyword.toLowerCase();
    return entities.filter(account => 
        account.name.toLowerCase().includes(lowerKeyword) ||
        account.accountNumber.toLowerCase().includes(lowerKeyword) ||
        account.description?.toLowerCase().includes(lowerKeyword)
    );
}

protected override async applySearchCriteria(
    entities: OptimizedAccount[],
    criteria?: SearchCriteriaDto
): Promise<OptimizedAccount[]> {
    // 先應用基礎搜尋條件
    let filtered = await super.applySearchCriteria(entities, criteria);

    // 應用帳戶特定的搜尋條件
    if (criteria && this.isAccountSearchCriteria(criteria)) {
        const accountCriteria = criteria as AccountSearchCriteriaDto;
        
        if (accountCriteria.userId) {
            filtered = filtered.filter(account => account.userId === accountCriteria.userId);
        }
        
        if (accountCriteria.minBalance !== undefined) {
            filtered = filtered.filter(account => account.getBalanceAmount() >= accountCriteria.minBalance!);
        }
        
        // 其他帳戶特定過濾條件...
    }

    return filtered;
}
```

## DTO 定義

### 創建帳戶 DTO

```typescript
export interface CreateAccountDto extends BaseCreateDto {
    userId: string;
    accountNumber?: string; // 可選，如果不提供會自動生成
    name: string;
    type: AccountType;
    initialBalance?: number;
    currency?: string;
    description?: string;
}
```

### 帳戶回應 DTO

```typescript
export interface AccountResponseDto extends BaseResponseDto {
    userId: string;
    accountNumber: string;
    name: string;
    type: AccountType;
    balance: number;
    formattedBalance: string; // 使用 Money 值物件格式化
    currency: string;
    status: AccountStatus;
    statusText: string;
    isActive: boolean;
    canPerformTransactions: boolean;
    description?: string;
    lastTransactionDate?: string;
}
```

### 帳戶搜尋條件 DTO

```typescript
export interface AccountSearchCriteriaDto extends SearchCriteriaDto {
    userId?: string;
    accountNumber?: string;
    accountName?: string;
    accountType?: AccountType;
    accountStatus?: AccountStatus;
    minBalance?: number;
    maxBalance?: number;
    currency?: string;
}
```

## 使用範例

### 基本 CRUD 操作

```typescript
// 創建帳戶
const createDto: CreateAccountDto = {
    userId: 'user-123',
    name: 'My Checking Account',
    type: AccountType.CHECKING,
    initialBalance: 1000,
    currency: 'USD'
};
const account = await service.create(createDto);

// 獲取帳戶
const account = await service.getById('account-id');

// 更新帳戶
const updateDto: UpdateAccountDto = {
    name: 'Updated Account Name',
    description: 'Updated description'
};
const updatedAccount = await service.update('account-id', updateDto);

// 刪除帳戶（需要餘額為零且狀態為已關閉）
await service.delete('account-id');
```

### 帳戶特定操作

```typescript
// 存款
const depositDto: DepositDto = {
    amount: 500,
    description: 'Salary deposit'
};
const result = await service.deposit('account-id', depositDto);

// 提款
const withdrawDto: WithdrawDto = {
    amount: 200,
    description: 'ATM withdrawal'
};
const result = await service.withdraw('account-id', withdrawDto);

// 轉帳
const transferDto: TransferDto = {
    targetAccountId: 'target-account-id',
    amount: 300,
    description: 'Transfer to savings'
};
const result = await service.transfer('source-account-id', transferDto);

// 更新帳戶狀態
const statusDto: UpdateAccountStatusDto = {
    status: AccountStatus.INACTIVE
};
const result = await service.updateAccountStatus('account-id', statusDto);
```

### 搜尋和查詢

```typescript
// 根據帳戶號碼查找
const account = await service.findByAccountNumber('ACC-12345');

// 根據用戶 ID 獲取帳戶列表
const userAccounts = await service.getAccountsByUserId('user-123');

// 搜尋帳戶
const searchCriteria: AccountSearchCriteriaDto = {
    keyword: 'checking',
    userId: 'user-123',
    accountType: AccountType.CHECKING,
    minBalance: 1000,
    page: 1,
    pageSize: 10
};
const result = await service.getList(searchCriteria);

// 獲取帳戶統計
const stats = await service.getAccountStats();
```

## 錯誤處理

服務使用統一的錯誤處理機制：

```typescript
// ValidationError - 驗證錯誤
try {
    await service.create(invalidDto);
} catch (error) {
    if (error instanceof ValidationError) {
        console.log('驗證失敗:', error.message);
    }
}

// NotFoundError - 資源不存在
try {
    await service.getById('non-existent-id');
} catch (error) {
    if (error instanceof NotFoundError) {
        console.log('帳戶不存在');
    }
}

// ApplicationError - 應用程式錯誤
try {
    await service.withdraw('account-id', { amount: 10000 });
} catch (error) {
    if (error instanceof ApplicationError) {
        console.log('業務邏輯錯誤:', error.message);
    }
}
```

## 日誌記錄

服務提供詳細的操作日誌：

```typescript
// 成功操作日誌
LOG: '[AccountApplicationService] INFO: 開始存款操作', {accountId: 'xxx', amount: 500}
LOG: '[AccountApplicationService] INFO: 存款成功', {accountId: 'xxx', amount: 500, newBalance: 1500}

// 錯誤操作日誌
ERROR: '[AccountApplicationService] ERROR: 存款失敗', ValidationError: 存款金額必須大於零

// 警告日誌
WARN: '[AccountApplicationService] WARN: 實體不存在', {id: 'non-existent-id'}
```

## 與原始服務的差異

### 移除的複雜性

1. **重複的驗證邏輯**：移除了應用服務層的重複驗證，依賴實體的業務邏輯
2. **手動錯誤處理**：使用基礎類別的統一錯誤處理機制
3. **重複的 CRUD 模式**：繼承基礎類別的標準 CRUD 操作

### 新增的功能

1. **統一的搜尋和過濾**：支援關鍵字搜尋、狀態過濾、日期範圍過濾等
2. **標準化的分頁**：使用 `ListResponseDto` 提供統一的分頁回應
3. **詳細的日誌記錄**：提供操作追蹤和除錯資訊
4. **類型安全的 DTO**：使用 TypeScript 介面確保類型安全

### 保留的業務邏輯

1. **Money 值物件整合**：充分利用 Money 值物件的業務邏輯
2. **帳戶特定驗證**：保留帳戶相關的業務規則驗證
3. **領域事件**：保持實體的領域事件機制
4. **複雜業務操作**：如轉帳、狀態管理等複雜操作

## 測試覆蓋

服務包含完整的單元測試，涵蓋：

- 基本 CRUD 操作測試
- 帳戶特定操作測試（存款、提款、轉帳）
- 錯誤處理測試
- 搜尋和過濾測試
- 統計功能測試
- 邊界條件和異常情況測試

測試使用 Jasmine 框架，包含 13 個測試案例，全部通過。

## 效能考量

1. **減少重複驗證**：避免在應用服務層重複實體已有的驗證邏輯
2. **統一的搜尋機制**：提供高效的搜尋和過濾功能
3. **日誌記錄優化**：使用結構化日誌，便於監控和除錯
4. **記憶體管理**：適當的實體生命週期管理

## 遷移指南

從原始 `AccountApplicationService` 遷移到 `RefactoredAccountApplicationService`：

1. **更新依賴注入**：使用新的服務類別
2. **DTO 結構調整**：使用新的 DTO 介面
3. **錯誤處理更新**：使用新的錯誤類型
4. **搜尋 API 更新**：使用新的搜尋條件介面
5. **回應格式調整**：使用新的回應 DTO 格式

這個重構版本在保持所有業務功能的同時，大幅簡化了程式碼結構，提升了可維護性和可測試性。