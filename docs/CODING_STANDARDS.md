# 🎨 代碼規範與最佳實踐

## 📋 概述

本文檔定義了 ng-ac 專案的代碼規範、編碼標準和最佳實踐，確保代碼的一致性、可讀性和可維護性。

## 🏷️ 命名規範

### 文件命名
- **組件文件**: `kebab-case.component.ts` (例: `user-profile.component.ts`)
- **服務文件**: `kebab-case.service.ts` (例: `user-management.service.ts`)
- **接口文件**: `kebab-case.interface.ts` (例: `user-repository.interface.ts`)
- **枚舉文件**: `kebab-case.enum.ts` (例: `user-role.enum.ts`)
- **測試文件**: `kebab-case.component.spec.ts` (例: `user-profile.component.spec.ts`)

### 類命名
- **組件類**: `PascalCase + Component` (例: `UserProfileComponent`)
- **服務類**: `PascalCase + Service` (例: `UserManagementService`)
- **接口類**: `PascalCase + Interface` (例: `IUserRepository`)
- **枚舉類**: `PascalCase` (例: `UserRole`)
- **實體類**: `PascalCase + Entity` (例: `UserEntity`)

### 方法命名
- **獲取方法**: `get + 名詞` (例: `getUserProfile()`)
- **設置方法**: `set + 名詞` (例: `setUserProfile()`)
- **檢查方法**: `is + 形容詞` (例: `isValid()`, `isAdmin()`)
- **動作方法**: `動詞 + 名詞` (例: `createUser()`, `updateUser()`)
- **事件處理**: `on + 事件名` (例: `onUserClick()`, `onFormSubmit()`)

### 變量命名
- **常量**: `UPPER_SNAKE_CASE` (例: `MAX_RETRY_COUNT`, `API_BASE_URL`)
- **私有變量**: `camelCase` 以 `_` 開頭 (例: `_userService`, `_isLoading`)
- **公開變量**: `camelCase` (例: `userName`, `isAuthenticated`)
- **信號變量**: `camelCase` (例: `searchTerm`, `selectedUser`)

### 布爾變量命名
- **狀態變量**: `is + 形容詞` (例: `isLoading`, `isVisible`)
- **能力變量**: `can + 動詞` (例: `canEdit`, `canDelete`)
- **存在變量**: `has + 名詞` (例: `hasError`, `hasPermission`)

## 📁 目錄結構規範

### 組件目錄結構
```
users/
├── users.component.ts          # 主組件
├── users.component.html        # 模板文件
├── users.component.scss        # 樣式文件
├── users.component.spec.ts     # 測試文件
├── components/                 # 子組件
│   ├── user-form/
│   ├── user-list/
│   └── user-detail/
├── services/                   # 組件相關服務
├── models/                     # 組件相關模型
└── index.ts                    # 導出文件
```

### 共享資源目錄結構
```
shared/
├── components/                 # 共享組件
│   ├── loading-spinner/
│   ├── confirm-dialog/
│   └── empty-state/
├── directives/                 # 共享指令
├── pipes/                      # 共享管道
├── services/                   # 共享服務
├── utils/                      # 工具函數
├── validation/                 # 驗證服務
├── types/                      # 類型定義
└── index.ts                    # 統一導出
```

## 🔧 代碼風格

### TypeScript 規範

#### 類型定義
```typescript
// ✅ 推薦：明確的類型定義
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// ❌ 避免：使用 any 類型
interface User {
  id: any;
  name: any;
  email: any;
  role: any;
  createdAt: any;
}

// ✅ 推薦：使用泛型
export class ApiResponse<T> {
  constructor(
    public data: T,
    public success: boolean,
    public message?: string
  ) {}
}

// ✅ 推薦：聯合類型
type UserStatus = 'active' | 'inactive' | 'suspended';

// ✅ 推薦：字面量類型
const API_ENDPOINTS = {
  USERS: '/api/users',
  PRODUCTS: '/api/products',
  ORDERS: '/api/orders'
} as const;
```

#### 函數定義
```typescript
// ✅ 推薦：明確的參數和返回值類型
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// ✅ 推薦：使用箭頭函數
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY'
  }).format(amount);
};

// ✅ 推薦：可選參數和默認值
function createUser(
  email: string,
  name: string,
  role: UserRole = UserRole.USER,
  isActive: boolean = true
): User {
  return new UserEntity(email, name, role, isActive);
}
```

#### 類定義
```typescript
// ✅ 推薦：明確的訪問修飾符
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly userAggregate = new UserAggregate();

  public readonly users$ = this.userAggregate.users;

  constructor() {
    this.initializeService();
  }

  private initializeService(): void {
    // 私有方法實現
  }

  public loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => this.userAggregate.addUsers(users))
    );
  }
}
```

### Angular 組件規範

#### 組件裝飾器
```typescript
// ✅ 推薦：完整的組件配置
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit, OnDestroy {
  // 組件實現
}
```

#### 輸入輸出屬性
```typescript
// ✅ 推薦：明確的輸入輸出類型
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  @Input() showActions = true;
  @Input() theme: 'light' | 'dark' = 'light';

  @Output() userSelected = new EventEmitter<User>();
  @Output() userDeleted = new EventEmitter<string>();
  @Output() userEdited = new EventEmitter<User>();

  // 組件實現
}
```

#### 生命週期鉤子
```typescript
// ✅ 推薦：正確的生命週期順序
export class UserListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadUsers();
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions(): void {
    this.userService.users$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.users = users;
      });
  }
}
```

### 信號使用規範

#### 信號定義
```typescript
// ✅ 推薦：明確的信號類型
export class UserComponent {
  // 私有信號
  private readonly _searchTerm = signal<string>('');
  private readonly _selectedUsers = signal<User[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  // 公開只讀信號
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly selectedUsers = this._selectedUsers.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // 計算信號
  readonly filteredUsers = computed(() => {
    const users = this.users();
    const search = this._searchTerm();

    if (!search) return users;

    return users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  });
}
```

#### 信號更新
```typescript
// ✅ 推薦：使用 update 方法進行複雜更新
updateUser(id: string, updates: Partial<User>): void {
  this._users.update(users =>
    users.map(user =>
      user.id === id
        ? { ...user, ...updates, updatedAt: new Date() }
        : user
    )
  );
}

// ✅ 推薦：使用 set 方法進行簡單賦值
setSearchTerm(term: string): void {
  this._searchTerm.set(term);
}

// ✅ 推薦：使用 mutate 方法進行對象屬性更新
updateUserProfile(updates: Partial<UserProfile>): void {
  this._userProfile.mutate(profile => {
    Object.assign(profile, updates);
    profile.updatedAt = new Date();
  });
}
```

#### 信號效果
```typescript
// ✅ 推薦：使用 effect 進行副作用處理
constructor() {
  // 自動篩選效果
  effect(() => {
    const search = this.searchTerm();
    const role = this.selectedRole();

    this.userService.updateFilters({
      searchTerm: search || undefined,
      role: role || undefined
    });
  });

  // 日誌記錄效果
  effect(() => {
    const userCount = this.filteredUsers().length;
    console.log(`Filtered users count: ${userCount}`);
  });
}
```

## 🎯 最佳實踐

### 組件設計原則

#### 單一職責原則
```typescript
// ✅ 推薦：每個組件只負責一個功能
@Component({
  selector: 'app-user-table',
  template: `
    <table>
      <thead>
        <tr>
          <th>姓名</th>
          <th>郵箱</th>
          <th>角色</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class UserTableComponent {
  @Input() users: User[] = [];
}
```

#### 可重用性設計
```typescript
// ✅ 推薦：設計可重用的組件
@Component({
  selector: 'app-data-table',
  template: `
    <table>
      <thead>
        <tr>
          <th *ngFor="let column of columns">
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let item of data">
          <td *ngFor="let column of columns">
            <ng-container [ngSwitch]="column.type">
              <span *ngSwitchCase="'text'">{{ item[column.key] }}</span>
              <span *ngSwitchCase="'date'">{{ item[column.key] | date }}</span>
              <span *ngSwitchCase="'currency'">{{ item[column.key] | currency }}</span>
            </ng-container>
          </td>
        </tr>
      </tbody>
    </table>
  `
})
export class DataTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn[] = [];
}
```

### 服務設計原則

#### 依賴注入
```typescript
// ✅ 推薦：使用依賴注入
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  // 服務實現
}

// ✅ 推薦：組件中使用依賴注入
export class UserComponent {
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);

  // 組件實現
}
```

#### 錯誤處理
```typescript
// ✅ 推薦：統一的錯誤處理
export class UserService {
  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): void {
    let message = '發生未知錯誤';

    switch (error.status) {
      case 400:
        message = '請求參數錯誤';
        break;
      case 401:
        message = '未授權訪問';
        this.router.navigate(['/login']);
        break;
      case 403:
        message = '權限不足';
        break;
      case 404:
        message = '資源不存在';
        break;
      case 500:
        message = '服務器內部錯誤';
        break;
    }

    this.snackBar.open(message, '關閉', { duration: 5000 });
  }
}
```

### 性能優化

#### 變更檢測策略
```typescript
// ✅ 推薦：使用 OnPush 策略
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class UserListComponent {
  // 配合信號使用，實現精確的變更檢測
}

// ✅ 推薦：使用 trackBy 函數
@Component({
  template: `
    <div *ngFor="let user of users; trackBy: trackByUserId">
      {{ user.name }}
    </div>
  `
})
export class UserListComponent {
  trackByUserId(index: number, user: User): string {
    return user.id;
  }
}
```

#### 懶加載
```typescript
// ✅ 推薦：路由懶加載
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    title: '用戶管理'
  }
];

// ✅ 推薦：組件懶加載
@Component({
  template: `
    <ng-container *ngIf="showAdvancedFeatures">
      <app-advanced-features></app-advanced-features>
    </ng-container>
  `
})
export class UserComponent {
  showAdvancedFeatures = false;

  loadAdvancedFeatures(): void {
    import('./advanced-features/advanced-features.component').then(m => {
      // 動態加載組件
    });
  }
}
```

## 🧪 測試規範

### 單元測試
```typescript
// ✅ 推薦：完整的測試結構
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load users successfully', () => {
    const mockUsers = [
      { id: '1', name: 'User 1', email: 'user1@example.com' }
    ];

    service.loadUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });
});
```

### 組件測試
```typescript
// ✅ 推薦：組件集成測試
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['loadUsers']);

    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(userService.loadUsers).toHaveBeenCalled();
  });
});
```

## 📝 文檔規範

### 代碼註釋
```typescript
/**
 * 用戶管理服務
 * 負責用戶的增刪改查操作和業務邏輯處理
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * 載入所有用戶
   * @returns 用戶列表的 Observable
   */
  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => this.userAggregate.addUsers(users))
    );
  }

  /**
   * 根據 ID 查找用戶
   * @param id 用戶 ID
   * @returns 用戶對象或 null
   */
  findUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      catchError(() => of(null))
    );
  }
}
```

### README 文檔
```markdown
# 用戶管理模組

## 功能描述
用戶管理模組提供完整的用戶 CRUD 操作，包括用戶創建、編輯、刪除和查詢功能。

## 組件結構
- `UserComponent`: 主組件，負責用戶列表顯示
- `UserFormComponent`: 用戶表單組件，用於創建和編輯用戶
- `UserDetailComponent`: 用戶詳情組件，顯示用戶詳細信息

## 使用方法
```typescript
import { UserComponent } from './user.component';

@Component({
  imports: [UserComponent],
  template: '<app-user></app-user>'
})
export class AppComponent {}
```

## API 接口
- `GET /api/users`: 獲取用戶列表
- `POST /api/users`: 創建新用戶
- `PUT /api/users/:id`: 更新用戶信息
- `DELETE /api/users/:id`: 刪除用戶

## 依賴項
- Angular Material
- RxJS
- Angular Forms
```

## 🔍 代碼審查清單

### 功能檢查
- [ ] 代碼功能是否完整實現？
- [ ] 是否處理了邊界情況？
- [ ] 錯誤處理是否完善？
- [ ] 性能是否優化？

### 代碼質量
- [ ] 命名是否清晰明確？
- [ ] 函數是否單一職責？
- [ ] 代碼是否可讀性強？
- [ ] 是否遵循 DRY 原則？

### 測試覆蓋
- [ ] 單元測試是否完整？
- [ ] 測試用例是否覆蓋邊界情況？
- [ ] 測試代碼是否可維護？
- [ ] 測試執行是否快速？

### 文檔完整性
- [ ] 代碼註釋是否清晰？
- [ ] README 是否完整？
- [ ] API 文檔是否準確？
- [ ] 使用示例是否清晰？

---

**文檔版本**: 1.0.0
**最後更新**: 2024年8月
**維護者**: AI Assistant


