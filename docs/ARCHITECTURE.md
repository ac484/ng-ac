# 🏗️ 架構設計文檔

## 📋 架構概述

### 設計原則
- **單一職責原則**: 每個模組只負責一個功能
- **開閉原則**: 對擴展開放，對修改封閉
- **依賴倒置原則**: 依賴抽象而非具體實現
- **接口隔離原則**: 客戶端不應依賴它不需要的接口
- **最少知識原則**: 模組間耦合度最小化

### 架構模式
- **分層架構**: 清晰的層次分離
- **DDD 架構**: 領域驅動設計
- **CQRS 模式**: 命令查詢職責分離
- **事件驅動**: 鬆耦合的事件通信

## 🏛️ DDD 架構詳解

### 1. 領域層 (Domain Layer)

#### 聚合根 (Aggregate Root)
```typescript
// 用戶聚合根
export class UserAggregate {
  private readonly _users = signal<User[]>([]);
  private readonly _filters = signal<UserFilters>({});

  // 公開信號
  readonly users = this._users.asReadonly();
  readonly filters = this._filters.asReadonly();

  // 計算屬性
  readonly filteredUsers = computed(() => {
    const users = this._users();
    const filters = this._filters();
    return users.filter(user => this.matchesFilters(user, filters));
  });

  // 領域方法
  addUser(user: User): void {
    this._users.update(users => [...users, user]);
  }

  updateUser(id: string, updates: Partial<User>): void {
    this._users.update(users =>
      users.map(user => user.id === id ? { ...user, ...updates } : user)
    );
  }
}
```

#### 實體 (Entity)
```typescript
export class UserEntity implements User {
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public role: UserRole = UserRole.USER,
    public status: UserStatus = UserStatus.ACTIVE,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  // 業務方法
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  canManageUsers(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.MANAGER;
  }

  updateProfile(updates: Partial<Pick<User, 'name' | 'email'>>): void {
    Object.assign(this, updates);
    this.updatedAt = new Date();
  }
}
```

#### 值對象 (Value Object)
```typescript
export class Email {
  constructor(private readonly value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid email format');
    }
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
```

### 2. 應用層 (Application Layer)

#### 應用服務 (Application Service)
```typescript
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userAggregate = new UserAggregate();

  // 公開聚合根
  get userAggregate$() {
    return this.userAggregate;
  }

  // 應用服務方法
  loadUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      tap(users => this.userAggregate.addUsers(users))
    );
  }

  updateFilters(filters: UserFilters): void {
    this.userAggregate.setFilters(filters);
  }
}
```

#### 命令處理器 (Command Handler)
```typescript
export interface CreateUserCommand {
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class CreateUserCommandHandler {
  constructor(private userRepository: UserRepository) {}

  execute(command: CreateUserCommand): Observable<User> {
    const user = new UserEntity(
      this.generateId(),
      command.email,
      command.name,
      command.role
    );

    return this.userRepository.save(user);
  }
}
```

### 3. 接口層 (Interface Layer)

#### 組件架構
```typescript
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
  template: `...`,
  styles: [`...`]
})
export class UsersComponent {
  // 信號狀態
  readonly searchTerm = signal('');
  readonly selectedRole = signal<UserRole | ''>('');

  // 計算屬性
  readonly filteredUsers = computed(() => {
    const users = this.userService.userAggregate$.filteredUsers();
    const search = this.searchTerm();
    const role = this.selectedRole();

    return users.filter(user => this.matchesFilters(user, search, role));
  });

  // 生命週期
  constructor() {
    // 自動篩選效果
    effect(() => {
      const search = this.searchTerm();
      const role = this.selectedRole();

      this.userService.updateFilters({
        searchTerm: search,
        role: role || undefined
      });
    });
  }
}
```

#### 路由配置
```typescript
export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: '儀表板'
      },
      {
        path: 'users',
        component: UsersComponent,
        title: '用戶管理',
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        component: ProductsComponent,
        title: '產品管理',
        canActivate: [AuthGuard]
      }
    ]
  }
];
```

### 4. 基礎設施層 (Infrastructure Layer)

#### 倉儲實現 (Repository Implementation)
```typescript
@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      map(users => users.map(user => new UserEntity(
        user.id,
        user.email,
        user.name,
        user.role,
        user.status,
        new Date(user.createdAt),
        new Date(user.updatedAt)
      )))
    );
  }

  findById(id: string): Observable<User | null> {
    return this.http.get<User>(`/api/users/${id}`).pipe(
      map(user => new UserEntity(
        user.id,
        user.email,
        user.name,
        user.role,
        user.status,
        new Date(user.createdAt),
        new Date(user.updatedAt)
      )),
      catchError(() => of(null))
    );
  }

  save(user: User): Observable<User> {
    if (user.id) {
      return this.http.put<User>(`/api/users/${user.id}`, user);
    } else {
      return this.http.post<User>('/api/users', user);
    }
  }
}
```

#### HTTP 攔截器 (HTTP Interceptor)
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
```

## 🎨 技術架構

### 狀態管理架構
```typescript
// 全局狀態管理
export class AppState {
  private readonly _user = signal<User | null>(null);
  private readonly _theme = signal<'light' | 'dark'>('light');
  private readonly _loading = signal(false);

  // 公開信號
  readonly user = this._user.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly loading = this._loading.asReadonly();

  // 計算屬性
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isAdmin = computed(() => this._user()?.role === UserRole.ADMIN);

  // 狀態更新方法
  setUser(user: User | null): void {
    this._user.set(user);
  }

  toggleTheme(): void {
    this._theme.update(theme => theme === 'light' ? 'dark' : 'light');
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }
}
```

### 組件通信架構
```typescript
// 事件總線服務
@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private readonly eventSubject = new Subject<AppEvent>();

  readonly events$ = this.eventSubject.asObservable();

  emit(event: AppEvent): void {
    this.eventSubject.next(event);
  }

  on<T extends AppEvent>(eventType: string): Observable<T> {
    return this.events$.pipe(
      filter(event => event.type === eventType),
      map(event => event as T)
    );
  }
}

// 事件定義
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: Date;
}

export class UserCreatedEvent implements AppEvent {
  type = 'USER_CREATED';
  constructor(
    public payload: { user: User },
    public timestamp: Date = new Date()
  ) {}
}
```

### 錯誤處理架構
```typescript
// 全局錯誤處理
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  handleError(error: any): void {
    console.error('Error occurred:', error);

    if (error instanceof HttpErrorResponse) {
      this.handleHttpError(error);
    } else if (error instanceof ValidationError) {
      this.handleValidationError(error);
    } else {
      this.handleGenericError(error);
    }
  }

  private handleHttpError(error: HttpErrorResponse): void {
    switch (error.status) {
      case 400:
        this.showError('請求參數錯誤');
        break;
      case 401:
        this.showError('未授權訪問');
        this.router.navigate(['/login']);
        break;
      case 403:
        this.showError('權限不足');
        break;
      case 404:
        this.showError('資源不存在');
        break;
      case 500:
        this.showError('服務器內部錯誤');
        break;
      default:
        this.showError('未知錯誤');
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, '關閉', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
```

## 🔧 性能優化架構

### 變更檢測策略
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ...
})
export class UsersComponent {
  // 使用 OnPush 策略提升性能
  // 配合信號使用，實現精確的變更檢測
}
```

### 懶加載策略
```typescript
// 路由懶加載
export const routes: Routes = [
  {
    path: 'users',
    loadComponent: () => import('./users/users.component').then(m => m.UsersComponent),
    title: '用戶管理'
  }
];
```

### 虛擬滾動
```typescript
// 大數據列表優化
@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="virtual-scroll-viewport">
      <div *cdkVirtualFor="let user of users">
        {{ user.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualScrollComponent {
  users = Array.from({length: 10000}, (_, i) => ({
    id: i,
    name: `User ${i}`
  }));
}
```

## 🧪 測試架構

### 單元測試策略
```typescript
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

### 集成測試策略
```typescript
describe('UsersComponent Integration', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent, HttpClientTestingModule],
      providers: [UserService]
    }).compileComponents();
  });

  it('should display users in table', () => {
    const fixture = TestBed.createComponent(UsersComponent);
    const component = fixture.componentInstance;

    // 模擬數據
    component.users = [
      { id: '1', name: 'User 1', email: 'user1@example.com' }
    ];

    fixture.detectChanges();

    const tableElement = fixture.nativeElement.querySelector('table');
    expect(tableElement).toBeTruthy();

    const userNameElement = fixture.nativeElement.querySelector('.user-name');
    expect(userNameElement.textContent).toContain('User 1');
  });
});
```

## 🚀 部署架構

### 構建優化
```json
{
  "projects": {
    "ng-ac": {
      "architect": {
        "build": {
          "configurations": {
            "production": {
              "optimization": true,
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true
            }
          }
        }
      }
    }
  }
}
```

### 環境配置
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableDebug: true
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com/api',
  enableDebug: false
};
```

---

**文檔版本**: 1.0.0
**最後更新**: 2024年8月
**維護者**: AI Assistant
