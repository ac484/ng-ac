# 統一的應用服務基類實作

## 概覽

本實作完成了任務 1.2：建立統一的應用服務基類，提供了以下功能：

## 已實作的功能

### 1. BaseApplicationService 抽象類別
- ✅ 創建了 `BaseApplicationService` 抽象類別
- ✅ 支援泛型，可適用於不同的實體、DTO 類型
- ✅ 提供統一的 CRUD 操作模式

### 2. 通用的 CRUD 操作
- ✅ `create(dto)` - 創建新實體
- ✅ `getById(id)` - 根據 ID 獲取實體
- ✅ `update(id, dto)` - 更新實體
- ✅ `delete(id)` - 刪除實體
- ✅ `getList(criteria)` - 獲取實體列表（支援分頁和搜尋）

### 3. 統一的錯誤處理機制
- ✅ 定義了 `BaseError` 抽象類別
- ✅ 實作了具體錯誤類型：
  - `ValidationError` - 驗證錯誤
  - `NotFoundError` - 資源不存在錯誤
  - `ApplicationError` - 應用程式錯誤
- ✅ 整合了 `ErrorHandlerService` 進行統一錯誤處理
- ✅ 提供了成功操作的通知機制

### 4. 標準化的日誌記錄
- ✅ 實作了 `Logger` 介面
- ✅ 提供了 `ConsoleLogger` 實作
- ✅ 在所有操作中記錄詳細的日誌資訊
- ✅ 支援不同日誌級別：info, warn, error, debug

### 5. 標準化的 DTO 模式
- ✅ 定義了基礎 DTO 介面：
  - `BaseCreateDto` - 創建 DTO
  - `BaseUpdateDto` - 更新 DTO
  - `BaseResponseDto` - 回應 DTO
- ✅ 定義了 `ListResponseDto` 用於列表回應
- ✅ 定義了 `SearchCriteriaDto` 用於搜尋條件

### 6. 可擴展的搜尋和過濾機制
- ✅ 支援關鍵字搜尋（子類別可覆寫）
- ✅ 支援狀態過濾（子類別可覆寫）
- ✅ 支援日期範圍過濾
- ✅ 支援排序功能
- ✅ 支援分頁功能

## 使用範例

### 1. 創建具體的應用服務

```typescript
@Injectable()
export class UserApplicationService extends BaseApplicationService<
  OptimizedUser,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
> {
  constructor(
    @Inject(USER_REPOSITORY) repository: Repository<OptimizedUser>,
    errorHandler: ErrorHandlerService
  ) {
    super(repository, errorHandler, 'UserApplicationService');
  }

  // 實作抽象方法
  protected async createEntity(dto: CreateUserDto): Promise<OptimizedUser> {
    // 實作創建邏輯
  }

  protected async updateEntity(entity: OptimizedUser, dto: UpdateUserDto): Promise<void> {
    // 實作更新邏輯
  }

  protected mapToResponseDto(entity: OptimizedUser): UserResponseDto {
    // 實作 DTO 轉換邏輯
  }
}
```

### 2. 使用統一的 CRUD 操作

```typescript
// 創建用戶
const user = await userService.create({
  email: 'user@example.com',
  displayName: 'Test User'
});

// 獲取用戶
const user = await userService.getById('user-id');

// 更新用戶
const updatedUser = await userService.update('user-id', {
  displayName: 'Updated Name'
});

// 刪除用戶
await userService.delete('user-id');

// 獲取用戶列表
const result = await userService.getList({
  keyword: 'test',
  status: 'active',
  page: 1,
  pageSize: 10
});
```

## 測試覆蓋

- ✅ 完整的單元測試套件
- ✅ 測試所有 CRUD 操作
- ✅ 測試錯誤處理機制
- ✅ 測試搜尋和過濾功能
- ✅ 測試分頁功能
- ✅ 測試驗證邏輯

## 符合需求

### 需求 2.2：架構複雜度簡化
- ✅ 統一了應用服務的實作模式
- ✅ 消除了重複的 CRUD 邏輯
- ✅ 提供了標準化的錯誤處理

### 需求 3.2：開發體驗提升
- ✅ 提供了清晰的抽象介面
- ✅ 標準化了開發模式
- ✅ 提供了完整的日誌記錄

### 需求 5.4：程式碼維護性提升
- ✅ 統一的錯誤處理機制
- ✅ 清晰的介面定義
- ✅ 完整的測試覆蓋

## 檔案結構

```
src/app/application/services/
├── base-application.service.ts              # 基礎應用服務類別
├── base-application.service.spec.ts         # 基礎應用服務測試
├── optimized-user-application.service.ts    # 用戶應用服務範例實作
└── optimized-user-application.service.spec.ts # 用戶應用服務測試
```

## 下一步

此實作為後續的應用服務重構提供了堅實的基礎。其他應用服務（如 Account、Transaction）可以按照相同的模式進行重構，從而實現整個應用層的統一化和簡化。