# 簡化的儲存庫基類 (BaseFirebaseRepository)

## 概覽

`BaseFirebaseRepository` 是一個抽象基類，提供了標準化的 Firestore 操作、統一的錯誤處理和日誌記錄功能。這個設計大幅簡化了儲存庫的實作，減少了重複程式碼，並提供了一致的開發體驗。

## 主要特性

### 1. 通用 CRUD 操作
- `findById(id: string)` - 根據 ID 查詢實體
- `findAll(criteria?: SearchCriteria)` - 查詢所有實體，支援搜尋條件
- `findWithPagination(criteria?: SearchCriteria)` - 分頁查詢
- `save(entity: T)` - 儲存實體（新增或更新）
- `delete(id: string)` - 刪除實體
- `exists(id: string)` - 檢查實體是否存在
- `count(criteria?: SearchCriteria)` - 計算實體數量

### 2. 標準化搜尋條件處理
支援以下搜尋條件：
- `keyword` - 關鍵字搜尋
- `status` - 狀態篩選
- `startDate/endDate` - 日期範圍篩選
- `page/pageSize` - 分頁參數
- `sortBy/sortOrder` - 排序設定
- `filters` - 自定義篩選條件

### 3. 統一錯誤處理
- 所有操作都包裝在 try-catch 中
- 拋出標準化的 `RepositoryError`
- 包含詳細的錯誤上下文資訊

### 4. 完整的日誌記錄
- 記錄所有操作的輸入參數和結果
- 記錄錯誤詳情和堆疊追蹤
- 便於除錯和監控

## 使用方式

### 1. 創建具體儲存庫類別

```typescript
import { Injectable } from '@angular/core';
import { Firestore, DocumentData } from '@angular/fire/firestore';
import { BaseFirebaseRepository } from './base-firebase.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseFirebaseRepository<User> {
  
  constructor(firestore: Firestore) {
    super(firestore, 'users'); // 指定 Firestore 集合名稱
  }

  // 實作必要的抽象方法
  protected fromFirestore(data: DocumentData, id: string): User {
    return new User({
      id,
      email: data['email'],
      displayName: data['displayName'],
      createdAt: data['createdAt']?.toDate(),
      updatedAt: data['updatedAt']?.toDate()
    });
  }

  protected toFirestore(entity: User): DocumentData {
    return {
      email: entity.email,
      displayName: entity.displayName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  // 可選：覆寫搜尋條件處理以支援特定需求
  protected applySearchCriteria(q: Query<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
    let query = super.applySearchCriteria(q, criteria);
    
    // 添加特定的搜尋邏輯
    if (criteria.keyword) {
      query = query(q, where('displayName', '>=', criteria.keyword));
    }
    
    return query;
  }

  // 添加特定的業務方法
  async findByEmail(email: string): Promise<User | null> {
    const criteria: SearchCriteria = {
      filters: { email: email.toLowerCase() }
    };
    
    const users = await this.findAll(criteria);
    return users.length > 0 ? users[0] : null;
  }
}
```

### 2. 在應用服務中使用

```typescript
@Injectable()
export class UserApplicationService {
  
  constructor(private userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = new User({
      id: generateId(),
      email: dto.email,
      displayName: dto.displayName,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.userRepository.save(user);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUsersByStatus(status: string): Promise<User[]> {
    const criteria: SearchCriteria = {
      status,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    return await this.userRepository.findAll(criteria);
  }

  async getUsersWithPagination(page: number, pageSize: number): Promise<PaginatedResult<User>> {
    const criteria: SearchCriteria = {
      page,
      pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    return await this.userRepository.findWithPagination(criteria);
  }
}
```

## 搜尋條件範例

### 基本篩選
```typescript
const criteria: SearchCriteria = {
  status: 'active',
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

const users = await userRepository.findAll(criteria);
```

### 日期範圍篩選
```typescript
const criteria: SearchCriteria = {
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-12-31'),
  sortBy: 'createdAt',
  sortOrder: 'asc'
};

const users = await userRepository.findAll(criteria);
```

### 自定義篩選
```typescript
const criteria: SearchCriteria = {
  filters: {
    email: 'user@example.com',
    isEmailVerified: true
  }
};

const users = await userRepository.findAll(criteria);
```

### 分頁查詢
```typescript
const criteria: SearchCriteria = {
  page: 1,
  pageSize: 10,
  sortBy: 'displayName',
  sortOrder: 'asc'
};

const result = await userRepository.findWithPagination(criteria);
console.log(`找到 ${result.total} 個用戶，目前第 ${result.page} 頁`);
```

## 錯誤處理

所有儲存庫操作都會拋出 `RepositoryError`，包含詳細的錯誤資訊：

```typescript
try {
  const user = await userRepository.findById('invalid-id');
} catch (error) {
  if (error instanceof RepositoryError) {
    console.error('儲存庫錯誤:', error.message);
    console.error('原始錯誤:', error.cause);
  }
}
```

## 日誌記錄

基類會自動記錄所有操作：

```
[usersRepository] findById: { id: 'user-123' }
[usersRepository] findById: { id: 'user-123', found: true }

[usersRepository] findAll: { criteria: { status: 'active' } }
[usersRepository] findAll: { criteria: { status: 'active' }, count: 5 }

[usersRepository] save: { id: 'user-123' }
[usersRepository] save: { id: 'user-123', success: true }
```

錯誤也會被詳細記錄：

```
[usersRepository] findById failed: {
  error: 'Permission denied',
  context: { id: 'user-123' },
  stack: '...'
}
```

## 測試支援

基類設計便於單元測試：

```typescript
describe('UserRepository', () => {
  let repository: UserRepository;
  let mockFirestore: jasmine.SpyObj<Firestore>;

  beforeEach(() => {
    mockFirestore = jasmine.createSpyObj('Firestore', []);
    repository = new UserRepository(mockFirestore);
  });

  it('should convert Firestore data to User entity', () => {
    const mockData = {
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: { toDate: () => new Date() }
    };

    const result = (repository as any).fromFirestore(mockData, 'test-id');

    expect(result).toBeInstanceOf(User);
    expect(result.email).toBe('test@example.com');
  });
});
```

## 最佳實踐

1. **集合命名**: 使用複數形式的小寫名稱（如 'users', 'accounts'）
2. **錯誤處理**: 總是捕獲並處理 `RepositoryError`
3. **搜尋優化**: 為常用的搜尋條件創建索引
4. **分頁**: 對大量資料使用分頁查詢
5. **日誌監控**: 在生產環境中監控儲存庫操作日誌

## 與舊版本的差異

### 優化前（複雜）
```typescript
export class FirebaseUserRepository implements UserRepository {
  // 大量重複的錯誤處理程式碼
  // 複雜的值物件轉換
  // 沒有統一的日誌記錄
  // 每個方法都需要手動處理 Firestore 操作
}
```

### 優化後（簡化）
```typescript
export class UserRepository extends BaseFirebaseRepository<User> {
  // 只需實作兩個抽象方法
  // 自動獲得所有 CRUD 操作
  // 統一的錯誤處理和日誌記錄
  // 標準化的搜尋條件支援
}
```

這個設計大幅減少了程式碼複雜度，提高了開發效率，同時保持了功能的完整性。