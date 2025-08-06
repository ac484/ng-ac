<!------------------------------------------------------------------------------------
# 🎯 極簡主義設計原則

## 📋 概述

本文檔定義了專案中的極簡主義設計原則，確保我們避免過度工程、專注核心邏輯，並充分利用 ng-zorro-antd 組件庫，不重複造輪子。

---

## 🎨 核心原則

### 1. 避免過度工程 (Avoid Over-Engineering)

#### ❌ 過度工程的表現
```typescript
// ❌ 不必要的抽象層
abstract class BaseAbstractServiceFactory<T> {
  abstract createService(): AbstractService<T>;
}

abstract class AbstractService<T> {
  abstract process(data: T): Observable<Result<T>>;
}

class UserServiceFactory extends BaseAbstractServiceFactory<User> {
  createService(): AbstractService<User> {
    return new ConcreteUserService();
  }
}

// ❌ 過度複雜的設計模式
class UserServiceBuilder {
  private service: UserService;
  
  withRepository(repo: UserRepository): UserServiceBuilder {
    this.service.setRepository(repo);
    return this;
  }
  
  withValidator(validator: UserValidator): UserServiceBuilder {
    this.service.setValidator(validator);
    return this;
  }
  
  build(): UserService {
    return this.service;
  }
}
```

#### ✅ 簡潔直接的做法
```typescript
// ✅ 直接、清晰的實現
@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userValidator: UserValidator
  ) {}

  async createUser(userData: CreateUserData): Promise<User> {
    // 驗證
    this.userValidator.validate(userData);
    
    // 創建
    const user = new User(userData);
    
    // 保存
    return await this.userRepository.save(user);
  }
}
```

### 2. 專注核心邏輯 (Focus on Core Logic)

#### ✅ 將精力投入在業務邏輯
```typescript
// ✅ 專注於業務規則的實現
export class User extends BaseAggregateRoot<UserId> {
  changeEmail(newEmail: Email): void {
    // 核心業務邏輯：郵箱變更規則
    if (this.isEmailChangeAllowed()) {
      this._email = newEmail;
      this.addDomainEvent(new UserEmailChangedEvent(this.id, newEmail));
    } else {
      throw new EmailChangeNotAllowedException(this.id);
    }
  }

  private isEmailChangeAllowed(): boolean {
    // 業務規則：30天內只能變更一次郵箱
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    return this.lastEmailChangeDate < thirtyDaysAgo;
  }
}
```

#### ❌ 避免技術炫技
```typescript
// ❌ 不必要的技術複雜性
class UserEmailChangeProcessor {
  private strategies: Map<EmailChangeStrategy, EmailChangeHandler> = new Map();
  private pipeline: EmailChangePipeline;
  private eventSourcing: EventSourcingEngine;
  
  // 過度複雜的實現...
}
```

### 3. 充分利用 ng-zorro-antd (Leverage ng-zorro-antd)

#### ✅ 優先使用現有組件
```typescript
// ✅ 使用 ng-zorro-antd 表格
@Component({
  template: `
    <nz-table 
      [nzData]="users" 
      [nzLoading]="loading"
      [nzPageSize]="10"
      [nzShowPagination]="true">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <nz-button-group>
              <button nz-button nzType="primary" nzSize="small">
                Edit
              </button>
              <button nz-button nzType="default" nzSize="small" nzDanger>
                Delete
              </button>
            </nz-button-group>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  imports: [NzTableModule, NzButtonModule]
})
export class UserListComponent {}
```

#### ❌ 不要重複造輪子
```typescript
// ❌ 自製表格組件（當 ng-zorro-antd 已經提供時）
@Component({
  template: `
    <div class="custom-table">
      <div class="custom-table-header">
        <div class="custom-table-cell">Name</div>
        <div class="custom-table-cell">Email</div>
      </div>
      <div class="custom-table-body">
        <div class="custom-table-row" *ngFor="let user of users">
          <div class="custom-table-cell">{{ user.name }}</div>
          <div class="custom-table-cell">{{ user.email }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-table { /* 大量自定義 CSS */ }
    .custom-table-header { /* ... */ }
    .custom-table-cell { /* ... */ }
    /* 數百行 CSS 代碼 */
  `]
})
export class CustomTableComponent {} // ❌ 不必要的重複實現
```

### 4. 清晰邊界 (Clear Boundaries)

#### ✅ 每個類別職責單一
```typescript
// ✅ 單一職責的用例
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    // 只負責用戶創建的協調邏輯
    const user = User.create(command.email, command.profile);
    await this.userRepository.save(user);
    await this.eventBus.publishAll(user.getDomainEvents());
    
    return CreateUserResponse.success(user.id);
  }
}

// ✅ 單一職責的組件
@Component({
  selector: 'app-user-form',
  template: `
    <nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- 只負責用戶表單的 UI -->
    </nz-form>
  `
})
export class UserFormComponent {
  // 只處理表單相關邏輯
}
```

#### ❌ 避免職責混亂
```typescript
// ❌ 職責過多的服務
@Injectable()
export class UserMegaService {
  // ❌ 混合了太多職責
  createUser() {}
  updateUser() {}
  deleteUser() {}
  sendEmail() {}
  generateReport() {}
  validatePermissions() {}
  logActivity() {}
  cacheData() {}
  // ... 更多不相關的方法
}
```

---

## 🛠️ 實踐指南

### 1. 組件設計

#### ✅ 簡潔的組件結構
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <nz-card [nzTitle]="'User Profile'">
      <nz-descriptions nzBordered>
        <nz-descriptions-item nzTitle="Name">
          {{ user.name }}
        </nz-descriptions-item>
        <nz-descriptions-item nzTitle="Email">
          {{ user.email }}
        </nz-descriptions-item>
      </nz-descriptions>
      
      <div class="actions">
        <button nz-button nzType="primary" (click)="editProfile()">
          Edit Profile
        </button>
      </div>
    </nz-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzCardModule,
    NzDescriptionsModule,
    NzButtonModule
  ]
})
export class UserProfileComponent {
  @Input() user!: User;
  @Output() editRequested = new EventEmitter<void>();

  editProfile(): void {
    this.editRequested.emit();
  }
}
```

### 2. 服務設計

#### ✅ 專注單一職責的服務
```typescript
// ✅ 只負責用戶查詢
@Injectable()
export class UserQueryService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: UserId): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    return await this.userRepository.findByRole(role);
  }
}

// ✅ 只負責用戶命令
@Injectable()
export class UserCommandService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  async createUser(command: CreateUserCommand): Promise<CreateUserResponse> {
    return await this.createUserUseCase.execute(command);
  }

  async updateUser(command: UpdateUserCommand): Promise<UpdateUserResponse> {
    return await this.updateUserUseCase.execute(command);
  }
}
```

### 3. 表單設計

#### ✅ 使用 ng-zorro-antd 表單組件
```typescript
@Component({
  template: `
    <nz-form [formGroup]="form" nzLayout="vertical">
      <nz-form-item>
        <nz-form-label nzRequired>Email</nz-form-label>
        <nz-form-control nzErrorTip="Please enter a valid email">
          <input nz-input formControlName="email" type="email" placeholder="Enter email">
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-label nzRequired>Password</nz-form-label>
        <nz-form-control nzErrorTip="Password must be at least 8 characters">
          <nz-input-password formControlName="password" placeholder="Enter password">
          </nz-input-password>
        </nz-form-control>
      </nz-form-item>

      <nz-form-item>
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="form.invalid">
            <nz-icon nzType="user-add"></nz-icon>
            Create Account
          </button>
        </nz-form-control>
      </nz-form-item>
    </nz-form>
  `,
  imports: [
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class RegisterFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  loading = false;

  constructor(private readonly fb: FormBuilder) {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      // 簡潔的提交邏輯
      const { email, password } = this.form.value;
      await this.authService.register(email!, password!);
    } finally {
      this.loading = false;
    }
  }
}
```

---

## 🚫 反模式與避免事項

### 1. 過度抽象
```typescript
// ❌ 不必要的抽象
interface IAbstractFactory<T> {
  create(): T;
}

interface IAbstractBuilder<T> {
  build(): T;
}

abstract class AbstractEntityFactory<T extends BaseEntity> implements IAbstractFactory<T> {
  abstract create(): T;
}

// ✅ 直接實現
class UserFactory {
  static create(data: CreateUserData): User {
    return new User(data);
  }
}
```

### 2. 過度設計模式
```typescript
// ❌ 不必要的設計模式堆疊
class UserServiceFactoryBuilder {
  private factory: UserServiceFactory;
  
  withStrategy(strategy: UserProcessingStrategy): this {
    this.factory.setStrategy(strategy);
    return this;
  }
  
  withDecorator(decorator: UserServiceDecorator): this {
    this.factory.addDecorator(decorator);
    return this;
  }
  
  build(): UserServiceFactory {
    return this.factory;
  }
}

// ✅ 簡單直接
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  
  async getUser(id: string): Promise<User> {
    return await this.userRepository.findById(id);
  }
}
```

### 3. 重複造輪子
```typescript
// ❌ 自製分頁組件
@Component({
  selector: 'custom-pagination',
  template: `
    <div class="pagination">
      <button (click)="previousPage()">Previous</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button (click)="nextPage()">Next</button>
    </div>
  `
})
export class CustomPaginationComponent {
  // 大量自定義邏輯...
}

// ✅ 使用 ng-zorro-antd 分頁
template: `
  <nz-pagination 
    [nzPageIndex]="currentPage"
    [nzTotal]="totalItems"
    [nzPageSize]="pageSize"
    (nzPageIndexChange)="onPageChange($event)">
  </nz-pagination>
`
```

---

## ✅ 檢查清單

### 開發前檢查
- [ ] 是否有現成的 ng-zorro-antd 組件可以使用？
- [ ] 這個功能是否真的需要自定義實現？
- [ ] 是否可以用更簡單的方式實現？
- [ ] 是否避免了不必要的抽象層？

### 開發中檢查
- [ ] 每個類別是否只有一個職責？
- [ ] 是否避免了過度的設計模式使用？
- [ ] 代碼是否容易理解和維護？
- [ ] 是否充分利用了 TypeScript 的類型系統？

### 開發後檢查
- [ ] 代碼是否符合業務需求？
- [ ] 是否有不必要的複雜性？
- [ ] 是否可以進一步簡化？
- [ ] 是否遵循了 DDD 架構原則？

---

## 📚 最佳實踐範例

### 1. 簡潔的用戶管理頁面
```typescript
@Component({
  template: `
    <nz-page-header nzTitle="User Management">
      <nz-page-header-extra>
        <button nz-button nzType="primary" (click)="createUser()">
          <nz-icon nzType="plus"></nz-icon>
          Add User
        </button>
      </nz-page-header-extra>
    </nz-page-header>

    <nz-table 
      [nzData]="users$ | async" 
      [nzLoading]="loading$ | async"
      [nzPageSize]="10">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <nz-tag [nzColor]="getRoleColor(user.role)">
              {{ user.role }}
            </nz-tag>
          </td>
          <td>
            <nz-button-group>
              <button nz-button nzSize="small" (click)="editUser(user)">
                Edit
              </button>
              <button nz-button nzSize="small" nzDanger (click)="deleteUser(user)">
                Delete
              </button>
            </nz-button-group>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NzPageHeaderModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    AsyncPipe
  ]
})
export class UserManagementComponent {
  users$ = this.userQuery.users$;
  loading$ = this.userQuery.loading$;

  constructor(
    private readonly userQuery: UserQueryService,
    private readonly userCommand: UserCommandService,
    private readonly modal: NzModalService,
    private readonly router: Router
  ) {}

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  editUser(user: User): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  deleteUser(user: User): void {
    this.modal.confirm({
      nzTitle: 'Delete User',
      nzContent: `Are you sure you want to delete ${user.name}?`,
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.userCommand.deleteUser(user.id)
    });
  }

  getRoleColor(role: string): string {
    const colors = {
      admin: 'red',
      user: 'blue',
      guest: 'default'
    };
    return colors[role] || 'default';
  }
}
```

### 2. 簡潔的表單處理
```typescript
@Component({
  template: `
    <nz-card nzTitle="Create User">
      <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label nzRequired>Name</nz-form-label>
          <nz-form-control nzErrorTip="Please enter user name">
            <input nz-input formControlName="name" placeholder="Enter name">
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Email</nz-form-label>
          <nz-form-control nzErrorTip="Please enter valid email">
            <input nz-input formControlName="email" type="email" placeholder="Enter email">
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label nzRequired>Role</nz-form-label>
          <nz-form-control>
            <nz-select formControlName="role" nzPlaceHolder="Select role">
              <nz-option nzValue="admin" nzLabel="Admin"></nz-option>
              <nz-option nzValue="user" nzLabel="User"></nz-option>
              <nz-option nzValue="guest" nzLabel="Guest"></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control>
            <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="form.invalid">
              Create User
            </button>
            <button nz-button type="button" (click)="cancel()" class="ml-2">
              Cancel
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule
  ]
})
export class CreateUserComponent {
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['user', Validators.required]
  });

  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly userCommand: UserCommandService,
    private readonly message: NzMessageService,
    private readonly router: Router
  ) {}

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.loading = true;
    try {
      const formValue = this.form.value;
      const command = new CreateUserCommand(
        formValue.name!,
        formValue.email!,
        formValue.role! as UserRole
      );

      await this.userCommand.createUser(command);
      this.message.success('User created successfully');
      this.router.navigate(['/users']);
    } catch (error) {
      this.message.error('Failed to create user');
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
```

---

## 🎯 總結

極簡主義設計的核心是：

1. **簡單勝過複雜** - 選擇最簡單有效的解決方案
2. **重用勝過重寫** - 充分利用 ng-zorro-antd 組件庫
3. **專注勝過分散** - 每個組件和服務都有明確的職責
4. **實用勝過完美** - 解決實際問題，避免過度設計

通過遵循這些原則，我們可以建立一個清晰、高效、易維護的代碼庫，讓開發團隊能夠專注於真正重要的業務邏輯。

---

**記住**: 最好的代碼是不需要寫的代碼，第二好的代碼是簡單明瞭的代碼。
-------------------------------------------------------------------------------------> 