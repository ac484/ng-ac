# 🏗️ DDD 開發規範與標準

## 📋 概述

本文檔整合了專案中的 DDD (Domain-Driven Design) 架構規範、極簡主義設計原則，以及具體的開發標準，確保代碼品質、架構一致性和開發效率。

---

## 🎯 核心設計原則

### 1. 極簡主義設計 (Minimalist Design)

#### ✅ 核心原則
- **避免過度工程** - 不要為了設計而設計，專注解決實際問題
- **避免不必要的依賴** - 只引入真正需要的套件和抽象
- **樣式優先使用 ng-zorro-antd** - 不要重複造輪子，充分利用現有組件庫
- **專注核心邏輯** - 將精力投入在業務邏輯而非技術炫技
- **清晰邊界** - 每個模組、類別、方法都有明確的職責

#### ❌ 避免的反模式
```typescript
// ❌ 過度抽象
abstract class BaseAbstractFactoryProvider<T> {
  abstract createFactory(): AbstractFactory<T>;
}

// ✅ 簡潔直接
class UserService {
  createUser(data: CreateUserData): User {
    return new User(data);
  }
}
```

#### ✅ 推薦做法
```typescript
// ✅ 使用 ng-zorro-antd 組件
@Component({
  template: `
    <nz-table [nzData]="users">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
        </tr>
      </tbody>
    </nz-table>
  `,
  imports: [NzTableModule]
})
export class UserListComponent {}
```

### 2. 即時邏輯檢查

#### 開發流程
1. **每次生成後立即檢查** - 確保代碼符合預期流程與業務規則
2. **避免錯誤累積** - 發現問題立即修正，不要拖延
3. **業務規則驗證** - 確保實現符合領域專家的期望
4. **架構一致性檢查** - 驗證是否遵循 DDD 分層原則

#### 檢查清單
- [ ] 業務邏輯是否正確實現
- [ ] 依賴關係是否符合 DDD 原則
- [ ] 是否使用了不必要的抽象
- [ ] 是否重複造輪子（特別是 UI 組件）
- [ ] 錯誤處理是否完整
- [ ] 類型安全是否保證

---

## 🏛️ DDD 架構標準

### 架構層次與依賴方向

```
┌─────────────────┐
│   Presentation  │ ← UI 組件、頁面、路由
├─────────────────┤
│ Infrastructure  │ ← 外部服務、資料庫、API
├─────────────────┤
│   Application   │ ← 用例、DTO、應用服務
├─────────────────┤
│     Domain      │ ← 實體、值物件、領域服務
└─────────────────┘
```

**依賴規則**: Domain ← Application ← Infrastructure ← Presentation

### 1. Domain Layer (領域層)

#### 職責
- 封裝核心業務邏輯
- 定義業務規則和約束
- 不依賴任何外部技術

#### 結構
```
domain/
├── entities/           # 業務實體
├── value-objects/      # 值物件
├── repositories/       # 儲存庫介面
├── services/          # 領域服務
├── events/            # 領域事件
├── specifications/    # 業務規則
└── exceptions/        # 領域異常
```

#### 範例
```typescript
// ✅ 好的領域實體
export class User extends BaseAggregateRoot<UserId> {
  private constructor(
    id: UserId,
    private _email: Email,
    private _profile: UserProfile
  ) {
    super(id);
  }

  static create(email: Email, profile: UserProfile): User {
    // 業務規則驗證
    if (!email.isValid()) {
      throw new InvalidEmailException(email.value);
    }
    
    const user = new User(UserId.generate(), email, profile);
    user.addDomainEvent(new UserCreatedEvent(user.id));
    return user;
  }

  changeEmail(newEmail: Email): void {
    if (!this._email.equals(newEmail)) {
      this._email = newEmail;
      this.addDomainEvent(new UserEmailChangedEvent(this.id, newEmail));
    }
  }
}
```

### 2. Application Layer (應用層)

#### 職責
- 協調領域物件執行業務用例
- 處理事務邊界
- 不包含業務邏輯

#### 結構
```
application/
├── use-cases/         # 用例實現
├── dto/
│   ├── commands/      # 命令 DTO
│   ├── queries/       # 查詢 DTO
│   └── responses/     # 回應 DTO
└── services/          # 應用服務
```

#### 範例
```typescript
// ✅ 好的用例實現
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    return await this.unitOfWork.execute(async () => {
      // 檢查業務規則
      const emailExists = await this.userRepository.existsByEmail(command.email);
      if (emailExists) {
        throw new UserEmailAlreadyExistsException(command.email);
      }

      // 創建領域物件
      const user = User.create(command.email, command.profile);

      // 持久化
      await this.userRepository.save(user);

      // 發布事件
      await this.eventBus.publishAll(user.getDomainEvents());

      return CreateUserResponse.success(user.id);
    });
  }
}
```

### 3. Infrastructure Layer (基礎設施層)

#### 職責
- 實現技術細節
- 對接外部系統
- 提供技術服務

#### 結構
```
infrastructure/
├── repositories/      # 儲存庫實現
├── mappers/          # 資料映射
├── adapters/         # 外部服務適配器
├── interceptors/     # HTTP 攔截器
├── guards/           # 路由守衛
└── services/         # 基礎設施服務
```

#### 範例
```typescript
// ✅ 好的儲存庫實現
@Injectable()
export class UserFirebaseRepository implements UserRepository {
  constructor(
    private readonly firestore: AngularFirestore,
    private readonly mapper: UserMapper
  ) {}

  async save(user: User): Promise<void> {
    const doc = this.mapper.toFirestore(user);
    await this.firestore.collection('users').doc(user.id.value).set(doc);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const query = await this.firestore
      .collection('users', ref => ref.where('email', '==', email.value))
      .get()
      .toPromise();
    
    return query?.docs.length > 0 
      ? this.mapper.toDomain(query.docs[0].data()) 
      : null;
  }
}
```

### 4. Presentation Layer (表現層)

#### 職責
- 處理用戶介面
- 路由管理
- 用戶互動

#### 結構
```
presentation/
├── components/       # 可重用組件
├── pages/           # 路由頁面
├── guards/          # 路由守衛
├── resolvers/       # 資料解析器
└── *.routes.ts      # 路由配置
```

#### 範例
```typescript
// ✅ 好的組件實現
@Component({
  selector: 'app-user-form',
  template: `
    <nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label>Email</nz-form-label>
        <nz-form-control>
          <input nz-input formControlName="email" type="email">
        </nz-form-control>
      </nz-form-item>
      
      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading">
            Create User
          </button>
        </nz-form-control>
      </nz-form-item>
    </nz-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ]
})
export class UserFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly message: NzMessageService
  ) {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const { email, firstName, lastName } = this.form.value;
      const command = new CreateUserCommand(
        Email.create(email!),
        UserProfile.create(firstName!, lastName!)
      );

      await this.createUserUseCase.execute(command);
      this.message.success('User created successfully');
      this.form.reset();
    } catch (error) {
      this.message.error('Failed to create user');
    } finally {
      this.loading = false;
    }
  }
}
```

---

## 📁 目錄結構標準

### 專案整體結構
```
src/app/
├── shared/                    # 跨領域共享
│   ├── domain/               # 共享領域原語
│   ├── application/          # 共享應用服務
│   ├── infrastructure/       # 共享基礎設施
│   └── presentation/         # 共享 UI 組件
├── domain/                   # 業務領域
│   ├── user/                # 用戶領域
│   ├── auth/                # 認證領域
│   ├── dashboard/           # 儀表板領域
│   └── contract/            # 合約領域 (範例)
├── app.component.ts
├── app.config.ts
├── app.routes.ts
└── main.ts
```

### 領域模組結構
```
domain/user/
├── domain/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── user.entity.spec.ts
│   ├── value-objects/
│   │   ├── user-id.vo.ts
│   │   ├── email.vo.ts
│   │   └── user-profile.vo.ts
│   ├── repositories/
│   │   └── user.repository.ts
│   ├── services/
│   │   └── user-domain.service.ts
│   ├── events/
│   │   ├── user-created.event.ts
│   │   └── user-updated.event.ts
│   ├── specifications/
│   │   └── user-email-unique.spec.ts
│   └── exceptions/
│       ├── user-not-found.exception.ts
│       └── invalid-email.exception.ts
├── application/
│   ├── use-cases/
│   │   ├── create-user.use-case.ts
│   │   ├── update-user.use-case.ts
│   │   └── delete-user.use-case.ts
│   ├── dto/
│   │   ├── commands/
│   │   │   ├── create-user.command.ts
│   │   │   └── update-user.command.ts
│   │   ├── queries/
│   │   │   ├── get-user-by-id.query.ts
│   │   │   └── get-users-list.query.ts
│   │   └── responses/
│   │       ├── user.response.ts
│   │       └── user-list.response.ts
│   └── services/
│       ├── user-command.service.ts
│       └── user-query.service.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── user-firebase.repository.ts
│   │   └── user-cache.repository.ts
│   ├── mappers/
│   │   └── user.mapper.ts
│   └── adapters/
│       └── email-service.adapter.ts
└── presentation/
    ├── components/
    │   ├── user-list/
    │   ├── user-form/
    │   └── user-detail/
    ├── pages/
    │   ├── user-management/
    │   └── user-profile/
    ├── guards/
    │   └── user-exists.guard.ts
    ├── resolvers/
    │   └── user.resolver.ts
    └── user.routes.ts
```

---

## 🏷️ 命名規範

### 檔案命名
| 類型 | 格式 | 範例 |
|------|------|------|
| 實體 | `{name}.entity.ts` | `user.entity.ts` |
| 值物件 | `{name}.vo.ts` | `email.vo.ts` |
| 用例 | `{action}-{entity}.use-case.ts` | `create-user.use-case.ts` |
| 命令 | `{action}-{entity}.command.ts` | `create-user.command.ts` |
| 查詢 | `{action}.query.ts` | `get-user-by-id.query.ts` |
| 回應 | `{entity}.response.ts` | `user.response.ts` |
| 儲存庫介面 | `{entity}.repository.ts` | `user.repository.ts` |
| 儲存庫實現 | `{entity}-{impl}.repository.ts` | `user-firebase.repository.ts` |
| 組件 | `{name}.component.ts` | `user-form.component.ts` |
| 服務 | `{name}.service.ts` | `user-command.service.ts` |

### 類別命名
```typescript
// 實體
export class User extends BaseAggregateRoot<UserId> {}

// 值物件
export class Email extends ValueObject<{ value: string }> {}

// 用例
export class CreateUserUseCase {}

// 命令
export class CreateUserCommand {}

// 回應
export class UserResponse {}

// 儲存庫
export interface UserRepository {}
export class UserFirebaseRepository implements UserRepository {}

// 服務
export class UserCommandService {}

// 組件
export class UserFormComponent {}
```

---

## 🔧 技術標準

### 1. TypeScript 配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. Angular 最佳實踐
```typescript
// ✅ 使用 OnPush 變更檢測
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ✅ 使用 Standalone 組件
@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule]
})

// ✅ 使用依賴注入
constructor(
  private readonly userService: UserService,
  private readonly router: Router
) {}
```

### 3. ng-zorro-antd 使用標準
```typescript
// ✅ 只匯入需要的模組
imports: [
  NzButtonModule,
  NzFormModule,
  NzInputModule,
  NzTableModule
]

// ✅ 使用 ng-zorro 組件而非自製
template: `
  <nz-button nzType="primary">Submit</nz-button>
  <nz-table [nzData]="data"></nz-table>
  <nz-form-item>
    <nz-form-control>
      <input nz-input>
    </nz-form-control>
  </nz-form-item>
`
```

---

## 🧪 測試標準

### 1. 單元測試
```typescript
// 領域實體測試
describe('User Entity', () => {
  it('should create user with valid data', () => {
    const email = Email.create('test@example.com');
    const profile = UserProfile.create('John', 'Doe');
    
    const user = User.create(email, profile);
    
    expect(user.email).toEqual(email);
    expect(user.getDomainEvents()).toHaveLength(1);
  });
});

// 用例測試
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = createMockRepository();
    useCase = new CreateUserUseCase(mockRepository, mockEventBus, mockUnitOfWork);
  });

  it('should create user successfully', async () => {
    mockRepository.existsByEmail.mockResolvedValue(false);
    
    const result = await useCase.execute(command);
    
    expect(result.success).toBe(true);
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

### 2. 組件測試
```typescript
describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [UserFormComponent]
    });
    
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
  });

  it('should submit valid form', async () => {
    component.form.patchValue({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe'
    });

    await component.onSubmit();

    expect(mockCreateUserUseCase.execute).toHaveBeenCalled();
  });
});
```

---

## 🚀 開發工具與流程

### 1. MCP 服務自動化
- 使用 MCP 服務生成符合 DDD 架構的代碼
- 自動生成實體、用例、儲存庫等樣板代碼
- 確保生成的代碼符合命名規範

### 2. Context7 文檔支援
- 實時查閱 Angular、ng-zorro-antd 官方文檔
- 獲取最新的 API 和最佳實踐
- 確保使用現代化的語法和模式

### 3. 開發檢查清單
每次開發新功能時，請檢查：

#### 架構檢查
- [ ] 是否遵循 DDD 分層原則
- [ ] 依賴方向是否正確
- [ ] 是否有循環依賴

#### 極簡主義檢查
- [ ] 是否避免了過度工程
- [ ] 是否重複使用了 ng-zorro-antd 組件
- [ ] 是否有不必要的抽象

#### 代碼品質檢查
- [ ] TypeScript 類型是否完整
- [ ] 錯誤處理是否充分
- [ ] 是否有適當的測試覆蓋

#### 業務邏輯檢查
- [ ] 業務規則是否正確實現
- [ ] 領域事件是否適當發布
- [ ] 異常處理是否符合業務需求

---

## 📚 參考資源

### 內部文檔
- [功能開發指南](./FEATURE_DEVELOPMENT_GUIDELINES.md)
- [共享層架構說明](../src/app/shared/README.md)

### 外部資源
- [Angular 官方文檔](https://angular.dev)
- [ng-zorro-antd 組件庫](https://ng.ant.design)
- [Domain-Driven Design 參考](https://domainlanguage.com/ddd/)
- [Clean Architecture 原則](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**版本**: 1.0.0  
**最後更新**: 2024年12月  
**維護者**: NG-AC Development Team