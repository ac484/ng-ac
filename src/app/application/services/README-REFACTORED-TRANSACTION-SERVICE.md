# 重構交易應用服務文檔

## 概覽

本文檔說明了 `OptimizedTransactionApplicationService` 的重構實作，該服務使用新的 `BaseApplicationService` 基類，整合交易處理的業務邏輯，簡化狀態管理和通知機制。

## 重構目標

根據任務 3.3 的要求：
- ✅ 使用新的基類重構 `TransactionApplicationService`
- ✅ 整合交易處理的業務邏輯
- ✅ 簡化狀態管理和通知機制
- ✅ 更新相關的整合測試

## 架構改進

### 1. 繼承基礎應用服務

```typescript
export class OptimizedTransactionApplicationService extends BaseApplicationService<
    OptimizedTransaction,
    CreateTransactionDto,
    UpdateTransactionDto,
    TransactionResponseDto
>
```

**優勢：**
- 統一的 CRUD 操作模式
- 標準化的錯誤處理
- 一致的日誌記錄
- 通用的分頁和搜尋功能

### 2. 簡化的 DTO 設計

#### 創建 DTO
```typescript
export interface CreateTransactionDto extends BaseCreateDto {
    accountId: string;
    userId: string;
    amount: number;
    currency?: string;
    transactionType: TransactionType;
    description: string;
    referenceNumber?: string;
    category?: string;
}
```

#### 回應 DTO
```typescript
export interface TransactionResponseDto extends BaseResponseDto {
    transactionNumber: string;
    accountId: string;
    userId: string;
    amount: number;
    currency: string;
    transactionType: TransactionType;
    status: TransactionStatus;
    description: string;
    referenceNumber?: string;
    category?: string;
    fees?: number;
    notes?: string;
    totalAmount: number;
}
```

### 3. 整合的業務邏輯

#### 狀態管理簡化
```typescript
async updateStatus(id: string, dto: UpdateTransactionStatusDto): Promise<TransactionResponseDto> {
    // 根據狀態執行相應的業務邏輯
    switch (dto.status) {
        case TransactionStatus.PROCESSING:
            entity.process();
            break;
        case TransactionStatus.COMPLETED:
            entity.complete();
            break;
        case TransactionStatus.FAILED:
            entity.fail(dto.reason);
            break;
        case TransactionStatus.CANCELLED:
            entity.cancel(dto.reason);
            break;
    }
}
```

#### 交易處理統一
```typescript
async processTransaction(id: string, dto: ProcessTransactionDto): Promise<TransactionResponseDto> {
    switch (dto.action) {
        case 'process':
            entity.process();
            break;
        case 'complete':
            entity.complete();
            break;
        case 'fail':
            entity.fail(dto.reason);
            break;
        case 'cancel':
            entity.cancel(dto.reason);
            break;
        case 'retry':
            entity.retry();
            break;
    }
}
```

## 核心功能

### 1. 基本 CRUD 操作
- `create(dto)` - 創建交易
- `getById(id)` - 根據 ID 獲取交易
- `update(id, dto)` - 更新交易
- `delete(id)` - 刪除交易
- `getList(criteria)` - 獲取交易列表

### 2. 交易特定操作
- `updateStatus(id, dto)` - 更新交易狀態
- `processTransaction(id, dto)` - 處理交易
- `addFees(id, amount, currency)` - 添加手續費
- `getByAccountId(accountId, criteria)` - 根據帳戶獲取交易
- `getByUserId(userId, criteria)` - 根據用戶獲取交易
- `getStatistics(criteria)` - 獲取交易統計

### 3. 高級搜尋和過濾
```typescript
export interface TransactionSearchCriteriaDto extends SearchCriteriaDto {
    accountId?: string;
    userId?: string;
    transactionType?: TransactionType;
    minAmount?: number;
    maxAmount?: number;
    referenceNumber?: string;
    category?: string;
}
```

## 錯誤處理改進

### 1. 統一的錯誤類型
- `ValidationError` - 驗證錯誤
- `NotFoundError` - 資源不存在
- `ApplicationError` - 應用程式錯誤

### 2. 自動錯誤處理
```typescript
try {
    // 業務邏輯
} catch (error) {
    this.logger.error(`操作失敗`, error);
    
    if (error instanceof BaseError) {
        throw error;
    }
    
    const appError = new ApplicationError('操作失敗', error as Error);
    this.errorHandler.handleError(appError, operation);
    throw appError;
}
```

### 3. 用戶友好的通知
- 成功操作自動顯示成功訊息
- 錯誤自動顯示用戶友好的錯誤訊息
- 避免重複顯示相同錯誤

## 驗證機制

### 1. DTO 驗證
```typescript
protected validateCreateDto(dto: CreateTransactionDto): void {
    if (!dto.accountId || dto.accountId.trim() === '') {
        throw new ValidationError('帳戶 ID 不能為空');
    }
    
    if (!dto.amount || dto.amount <= 0) {
        throw new ValidationError('交易金額必須大於零');
    }
    
    if (!dto.description || dto.description.trim() === '') {
        throw new ValidationError('交易描述不能為空');
    }
}
```

### 2. 業務規則驗證
```typescript
protected async beforeDelete(entity: OptimizedTransaction): Promise<void> {
    if (entity.isCompleted()) {
        throw new ValidationError('已完成的交易不能刪除');
    }
}
```

## 搜尋和過濾功能

### 1. 關鍵字搜尋
```typescript
protected async filterByKeyword(entities: OptimizedTransaction[], keyword: string): Promise<OptimizedTransaction[]> {
    const lowerKeyword = keyword.toLowerCase();
    return entities.filter(entity =>
        entity.description.toLowerCase().includes(lowerKeyword) ||
        entity.transactionNumber.toLowerCase().includes(lowerKeyword) ||
        entity.referenceNumber?.toLowerCase().includes(lowerKeyword) ||
        entity.category?.toLowerCase().includes(lowerKeyword) ||
        entity.notes?.toLowerCase().includes(lowerKeyword)
    );
}
```

### 2. 狀態過濾
```typescript
protected async filterByStatus(entities: OptimizedTransaction[], status: string): Promise<OptimizedTransaction[]> {
    return entities.filter(entity => entity.status === status);
}
```

### 3. 自定義過濾條件
- 帳戶 ID 過濾
- 用戶 ID 過濾
- 交易類型過濾
- 金額範圍過濾
- 參考編號過濾
- 分類過濾

## 統計功能

### 1. 交易統計
```typescript
export interface TransactionStatsDto {
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
    processingCount: number;
    failedCount: number;
    cancelledCount: number;
}
```

### 2. 統計計算
- 總交易數量和金額
- 按狀態分組統計
- 按類型分組統計
- 平均交易金額
- 各狀態交易數量

## 測試策略

### 1. 單元測試覆蓋
- ✅ 創建交易測試
- ✅ 更新交易測試
- ✅ 狀態更新測試
- ✅ 交易處理測試
- ✅ 手續費添加測試
- ✅ 搜尋和過濾測試
- ✅ 統計功能測試
- ✅ 錯誤處理測試

### 2. 測試工具
```typescript
function createMockTransaction(
    status: TransactionStatus = TransactionStatus.PENDING,
    type: TransactionType = TransactionType.DEPOSIT,
    amount: number = 1000
): OptimizedTransaction {
    const money = new Money(amount, 'TWD');
    return OptimizedTransaction.create(
        'TXN-123456789-ABC123',
        'account-123',
        'user-123',
        money,
        type,
        '測試交易',
        'transaction-123'
    );
}
```

## 效能優化

### 1. 記憶體管理
- 使用 Money 值物件進行金額計算
- 避免不必要的物件創建
- 適當的資料結構選擇

### 2. 查詢優化
- 分頁查詢支援
- 索引友好的搜尋條件
- 批量操作支援

### 3. 快取策略
- 錯誤訊息快取避免重複顯示
- 統計資料快取（可擴展）

## 向後相容性

### 1. DTO 相容性
- 保留原有 DTO 欄位
- 提供別名欄位支援
- 漸進式遷移支援

### 2. API 相容性
- 保持相同的方法簽名
- 相同的回應格式
- 相同的錯誤處理行為

## 使用範例

### 1. 創建交易
```typescript
const createDto: CreateTransactionDto = {
    accountId: 'account-123',
    userId: 'user-123',
    amount: 1000,
    currency: 'TWD',
    transactionType: TransactionType.DEPOSIT,
    description: '存款交易',
    category: '收入'
};

const transaction = await service.create(createDto);
```

### 2. 處理交易
```typescript
const processDto: ProcessTransactionDto = {
    action: 'complete'
};

const result = await service.processTransaction(transactionId, processDto);
```

### 3. 獲取統計
```typescript
const stats = await service.getStatistics({
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: TransactionStatus.COMPLETED
});
```

## 總結

重構後的交易應用服務實現了以下改進：

1. **架構簡化** - 使用基礎服務類別減少重複程式碼
2. **業務邏輯整合** - 統一的交易處理和狀態管理
3. **錯誤處理統一** - 標準化的錯誤處理和用戶通知
4. **功能增強** - 更強大的搜尋、過濾和統計功能
5. **測試完整** - 全面的單元測試覆蓋
6. **效能優化** - 更好的記憶體管理和查詢效能
7. **向後相容** - 保持與現有程式碼的相容性

這個重構符合 DDD 架構優化的目標，提供了更簡潔、高效且易於維護的交易管理解決方案。