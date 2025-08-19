# Angular 20 現代化架構技術文件

## 📋 概述

本文件詳細介紹 Angular 20 的最新技術特性與現代化架構實踐，專為 NG-AC 專案量身定制。涵蓋 Signals、現代控制流程、Deferrable Views、性能優化等核心技術。

## 🎯 技術棧概覽

### 核心技術
- **Angular 20.0.0** - 最新穩定版本
- **TypeScript 5.8+** - 嚴格模式配置
- **Standalone Components** - 無 NgModule 依賴
- **Signals** - 現代響應式狀態管理
- **Modern Control Flow** - @if/@for/@switch/@let
- **Deferrable Views** - 智能延遲載入
- **Container Queries** - 組件級響應式設計

### 架構模式
- **DDD (Domain-Driven Design)** - 領域驅動設計
- **Clean Architecture** - 分層架構
- **CQRS** - 命令查詢責任分離
- **Event-Driven** - 事件驅動架構

## 🚀 Angular 20 核心特性

### 1. Signals - 現代響應式狀態管理

#### 基礎 Signals 用法
```typescript
import { signal, computed, effect } from '@angular/core';

// 基礎 Signal
const count = signal(0);
const name = signal('Angular');

// 計算 Signal
const doubleCount = computed(() => count() * 2);
const greeting = computed(() => `Hello, ${name()}!`);

// 副作用 Effect
effect(() => {
  console.log(`Count is now: ${count()}`);
});

// 更新 Signal
count.set(5);           // 直接設定
count.update(n => n + 1); // 基於當前值更新
```

#### 在組件中使用 Signals
```typescript
@Component({
  selector: 'app-user-profile',
  standalone: true,
  template: `
    <div class="user-profile">
      <h2>{{ userDisplayName() }}</h2>
      <p>登入次數: {{ loginCount() }}</p>
      <p>最後活動: {{ lastActivityFormatted() }}</p>

      <button (click)="incrementLogin()">
        模擬登入 (+{{ loginCount() }})
      </button>
    </div>
  `
})
export class UserProfileComponent {
  // 基礎狀態
  private readonly _user = signal<User | null>(null);
  private readonly _loginCount = signal(0);
  private readonly _lastActivity = signal(new Date());

  // 只讀訪問
  readonly user = this._user.asReadonly();
  readonly loginCount = this._loginCount.asReadonly();

  // 計算屬性
  readonly userDisplayName = computed(() =>
    this.user()?.name ?? 'Guest User'
  );

  readonly lastActivityFormatted = computed(() =>
    new Intl.DateTimeFormat('zh-TW', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(this._lastActivity())
  );

  // 業務方法
  incrementLogin() {
    this._loginCount.update(count => count + 1);
    this._lastActivity.set(new Date());
  }

  setUser(user: User) {
    this._user.set(user);
  }
}
```
#### 服務中的 Signals 模式
```typescript
@Injectable({ providedIn: 'root' })
export class UserStateService {
  // 私有狀態
  private readonly _users = signal<User[]>([]);
  private readonly _selectedUserId = signal<string | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  // 公開只讀狀態
  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // 計算屬性
  readonly selectedUser = computed(() => {
    const id = this._selectedUserId();
    return id ? this.users().find(u => u.id === id) ?? null : null;
  });

  readonly userCount = ced(() => this.users().length);

  readonly hasUsers = computed(() => this.userCount() > 0);

  // 業務方法
  async loadUsers() {
    this._loading.set(true);
    this._error.set(null);

    try {
      const users = await this.userRepository.getAll();
      this._users.set(users);
    } catch (error) {
      this._error.set(error.message);
    } finally {
      this._loading.set(false);
    }
  }

  selectUser(userId: string) {
    this._selectedUserId.set(userId);
  }

  addUser(user: User) {
    this._users.update(users => [...users, user]);
  }

  updateUser(updatedUser: User) {
    this._users.update(users =>
      users.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
  }

  removeUser(userId: string) {
    this._users.update(users => users.filter(u => u.id !== userId));
  }
}
```

### 2. 現代控制流程 - @if/@for/@switch/@let

#### @if 條件渲染
```typescript
@Component({
  template: `
    <!-- 基礎條件渲染 -->
    @if (user()) {
      <div class="user-info">
        <h3>歡迎, {{ user()!.name }}!</h3>
        <p>角色: {{ user()!.role }}</p>
      </div>
    } @else {
      <div class="login-prompt">
        <p>請先登入</p>
        <button (click)="showLogin()">登入</button>
      </div>
    }

    <!-- 多重條件 -->
    @if (userRole() === 'admin') {
      <admin-panel />
    } @else if (userRole() === 'manager') {
      <manager-dashboard />
    } @else if (userRole() === 'user') {
      <user-dashboard />
    } @else {
      <guest-view />
    }

    <!-- 複雜條件邏輯 -->
    @if (isAuthenticated() && hasPermission('read') && !isLoading()) {
      <data-table [data]="tableData()" />
    } @else if (isLoading()) {
      <loading-spinner />
    } @else {
      <access-denied />
    }
  `
})
export class ConditionalRenderingComponent {
  protected readonly user = signal<User | null>(null);
  protected readonly isLoading = signal(false);

  protected readonly userRole = computed(() => this.user()?.role ?? 'guest');
  protected readonly isAuthenticated = computed(() => this.user() !== null);

  protected hasPermission(permission: string): boolean {
    return this.user()?.permissions.includes(permission) ?? false;
  }
}
```

#### @for 循環渲染
```typescript
@Component({
  template: `
    <!-- 基礎循環 -->
    @for (user of users(); track user.id) {
      <div class="user-card">
        <h4>{{ user.name }}</h4>
        <p>{{ user.email }}</p>
      </div>
    }

    <!-- 帶索引的循環 -->
    @for (item of items(); track item.id; let i = $index) {
      <div class="item" [class.even]="i % 2 === 0">
        <span class="index">{{ i + 1 }}.</span>
        <span class="name">{{ item.name }}</span>
      </div>
    }

    <!-- 空狀態處理 -->
    @for (product of products(); track product.id) {
      <product-card [product]="product" />
    } @empty {
      <div class="empty-state">
        <p>沒有找到產品</p>
        <button (click)="loadProducts()">重新載入</button>
      </div>
    }

    <!-- 複雜循環邏輯 -->
    @for (category of categories(); track category.id) {
      <div class="category">
        <h3>{{ category.name }}</h3>
        @for (product of getProductsByCategory(category.id); track product.id) {
          <product-item
            [product]="product"
            [category]="category"
            (select)="onProductSelect($event)" />
        } @empty {
          <p class="no-products">此分類暫無產品</p>
        }
      </div>
    }
  `
})
export class LoopRenderingComponent {
  protected readonly users = signal<User[]>([]);
  protected readonly products = signal<Product[]>([]);
  protected readonly categories = signal<Category[]>([]);

  protected getProductsByCategory(categoryId: string): Product[] {
    return this.products().filter(p => p.categoryId === categoryId);
  }
}
```

#### @switch 分支渲染
```typescript
@Component({
  template: `
    <!-- 基礎 switch -->
    @switch (currentView()) {
      @case ('list') {
        <user-list [users]="users()" />
      }
      @case ('grid') {
        <user-grid [users]="users()" />
      }
      @case ('table') {
        <user-table [users]="users()" />
      }
      @default {
        <div>未知視圖類型</div>
      }
    }

    <!-- 狀態機模式 -->
    @switch (loadingState()) {
      @case ('idle') {
        <button (click)="startLoading()">開始載入</button>
      }
      @case ('loading') {
        <loading-spinner message="載入中..." />
      }
      @case ('success') {
        <success-message [data]="loadedData()" />
      }
      @case ('error') {
        <error-message
          [error]="errorMessage()"
          (retry)="retryLoading()" />
      }
    }

    <!-- 用戶權限分支 -->
    @switch (userPermissionLevel()) {
      @case ('admin') {
        <admin-controls />
        <full-access-content />
      }
      @case ('manager') {
        <manager-controls />
        <limited-access-content />
      }
      @case ('user') {
        <user-content />
      }
      @default {
        <guest-content />
      }
    }
  `
})
export class SwitchRenderingComponent {
  protected readonly currentView = signal<'list' | 'grid' | 'table'>('list');
  protected readonly loadingState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  protected readonly userPermissionLevel = signal<'admin' | 'manager' | 'user' | 'guest'>('guest');
}
```

#### @let 局部變量
```typescript
@Component({
  template: `
    <!-- 複雜計算的局部變量 -->
    @let userStats = calculateUserStats(user());
    @let isVipUser = userStats.totalSpent > 10000;

    <div class="user-profile">
      <h2>{{ user()?.name }}</h2>

      @if (isVipUser) {
        <div class="vip-badge">VIP 用戶</div>
      }

      <div class="stats">
        <p>總消費: ${{ userStats.totalSpent }}</p>
        <p>訂單數: {{ userStats.orderCount }}</p>
        <p>平均訂單: ${{ userStats.averageOrder }}</p>
      </div>
    </div>

    <!-- 避免重複計算 -->
    @let filteredProducts = filterProducts(products(), searchTerm(), category());
    @let sortedProducts = sortProducts(filteredProducts, sortBy(), sortOrder());

    <div class="product-list">
      <div class="summary">
        找到 {{ filteredProducts.length }} 個產品
      </div>

      @for (product of sortedProducts; track product.id) {
        <product-card [product]="product" />
      } @empty {
        <div class="no-results">沒有找到符合條件的產品</div>
      }
    </div>

    <!-- 複雜條件邏輯 -->
    @let canEdit = hasPermission('edit') && isOwner(item()) && !isLocked();
    @let canDelete = hasPermission('delete') && isOwner(item()) && !hasChildren();

    <div class="item-actions">
      @if (canEdit) {
        <button (click)="editItem()">編輯</button>
      }
      @if (canDelete) {
        <button (click)="deleteItem()" class="danger">刪除</button>
      }
    </div>
  `
})
export class LetVariableComponent {
  protected readonly user = signal<User | null>(null);
  protected readonly products = signal<Product[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly category = signal('');
  protected readonly sortBy = signal<'name' | 'price' | 'date'>('name');
  protected readonly sortOrder = signal<'asc' | 'desc'>('asc');

  protected calculateUserStats(user: User | null) {
    if (!user) return { totalSpent: 0, orderCount: 0, averageOrder: 0 };

    const orders = user.orders || [];
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const averageOrder = orderCount > 0 ? totalSpent / orderCount : 0;

    return { totalSpent, orderCount, averageOrder };
  }

  protected filterProducts(products: Product[], term: string, category: string) {
    return products.filter(p =>
      (term === '' || p.name.toLowerCase().includes(term.toLowerCase())) &&
      (category === '' || p.category === category)
    );
  }

  protected sortProducts(products: Product[], sortBy: string, order: string) {
    return [...products].sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return order === 'desc' ? -result : result;
    });
  }
}
```

### 3. Deferrable Views - 智能延遲載入

#### 基礎 @defer 用法
```typescript
@Component({
  template: `
    <div class="dashboard">
      <!-- 立即載入的關鍵內容 -->
      <app-header />
      <app-navigation />

      <!-- 視窗可見時載入 -->
      @defer (on viewport) {
        <heavy-chart-component [data]="chartData()" />
      } @placeholder {
        <div class="chart-placeholder">
          <div class="skeleton-chart"></div>
          <p>圖表載入中...</p>
        </div>
      } @loading (minimum 500ms) {
        <div class="loading-state">
          <mat-spinner diameter="40"></mat-spinner>
          <p>正在載入圖表數據...</p>
        </div>
      } @error {
        <div class="error-state">
          <mat-icon>error</mat-icon>
          <p>圖表載入失敗</p>
          <button mat-button (click)="retryChart()">重試</button>
        </div>
      }

      <!-- 用戶互動時載入 -->
      @defer (on interaction) {
        <advanced-settings-panel />
      } @placeholder {
        <button mat-raised-button color="primary">
          <mat-icon>settings</mat-icon>
          點擊載入高級設定
        </button>
      }

      <!-- 閒置時載入 -->
      @defer (on idle) {
        <background-sync-component />
        <analytics-tracker />
      }

      <!-- 定時器載入 -->
      @defer (on timer(3000ms)) {
        <promotional-banner />
      } @placeholder {
        <div class="banner-placeholder"></div>
      }
    </div>
  `
})
export class DeferrableViewsComponent {
  protected readonly chartData = signal<ChartData[]>([]);

  protected retryChart() {
    // 重新載入圖表邏輯
  }
}
```
#### 進階 @defer 策略
```typescript
@Component({
  template: `
    <!-- 複合條件載入 -->
    @defer (on viewport; whenrences().enableCharts) {
      <performance-dashboard />
    } @placeholder {
      <div class="dashboard-placeholder">
        @if (!userPreferences().enableCharts) {
          <p>圖表已在設定中停用</p>
        } @else {
          <p>滾動到此處載入效能儀表板</p>
        }
      </div>
    }

    <!-- 預取策略 -->
    @defer (on viewport; prefetch on idle) {
      <user-analytics-widget />
    } @placeholder {
      <div class="analytics-skeleton">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-chart"></div>
      </div>
    }

    <!-- 條件式延遲載入 -->
    @defer (when shouldLoadReports() && hasPermission('reports')) {
      <reports-module />
    } @placeholder {
      @if (!hasPermission('reports')) {
        <access-denied-message />
      } @else {
        <button (click)="enableReports()">載入報表模組</button>
      }
    }

    <!-- 嵌套延遲載入 -->
    @defer (on viewport) {
      <div class="content-section">
        <h3>用戶管理</h3>

        @defer (on interaction) {
          <user-list-component />
        } @placeholder {
          <button mat-button>載入用戶列表</button>
        }

        @defer (on interaction) {
          <user-permissions-component />
        } @placeholder {
          <button mat-button>載入權限管理</button>
        }
      </div>
    }
  `
})
export class AdvancedDeferComponent {
  protected readonly userPreferences = signal({ enableCharts: true });

  protected shouldLoadReports(): boolean {
    return this.userRole() === 'admin' || this.userRole() === 'manager';
  }

  protected hasPermission(permission: string): boolean {
    return this.permissions().includes(permission);
  }
}
```

### 4. 現代組件架構

#### Standalone Components 最佳實踐
```typescript
/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "現代化用戶卡片組件-展示用戶信息",
 *   "constraints": ["Standalone組件", "OnPush策略", "Signals狀態"],
 *   "dependencies": ["MatCardModule", "MatButtonModule", "MatIconModule"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 */
@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card class="user-card">
      <mat-card-header>
        <div mat-card-avatar class="user-avatar">
          @if (user().avatar) {
            <img [src]="user().avatar" [alt]="user().name">
          } @else {
            <mat-icon>person</mat-icon>
          }
        </div>
        <mat-card-title>{{ user().name }}</mat-card-title>
        <mat-card-subtitle>{{ user().email }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="user-info">
          <p><strong>角色:</strong> {{ user().role }}</p>
          <p><strong>部門:</strong> {{ user().department }}</p>
          <p><strong>加入日期:</strong> {{ joinDateFormatted() }}</p>
        </div>

        <div class="user-status">
          <mat-chip-set>
            <mat-chip [color]="statusColor()">
              {{ statusText() }}
            </mat-chip>
            @if (user().isVip) {
              <mat-chip color="accent">VIP</mat-chip>
            }
          </mat-chip-set>
        </div>
      </mat-card-content>

      <mat-card-actions align="end">
        <button mat-button (click)="onView()">
          <mat-icon>visibility</mat-icon>
          查看
        </button>
        <button mat-button (click)="onEdit()" [disabled]="!canEdit()">
          <mat-icon>edit</mat-icon>
          編輯
        </button>
        @if (canDelete()) {
          <button mat-button color="warn" (click)="onDelete()">
            <mat-icon>delete</mat-icon>
            刪除
          </button>
        }
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .user-card {
      max-width: 400px;
      margin: 1rem;
      container-type: inline-size;
      container-name: user-card;
    }

    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--mat-sys-primary-container);

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .user-info {
      margin: 1rem 0;

      p {
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }
    }

    .user-status {
      margin-top: 1rem;
    }

    @container user-card (max-width: 300px) {
      .user-card {
        .user-info p {
          font-size: 0.8rem;
        }

        mat-card-actions {
          flex-direction: column;
          gap: 0.5rem;
        }
      }
    }
  `]
})
export class UserCardComponent {
  // 輸入屬性 - 使用新的 input() 函數
  readonly user = input.required<User>();
  readonly canEdit = input(true);
  readonly canDelete = input(false);

  // 輸出事件 - 使用新的 output() 函數
  readonly view = output<User>();
  readonly edit = output<User>();
  readonly delete = output<User>();

  // 計算屬性
  readonly joinDateFormatted = computed(() =>
    new Intl.DateTimeFormat('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(this.user().joinDate)
  );

  readonly statusColor = computed(() => {
    switch (this.user().status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'pending': return 'accent';
      default: return 'basic';
    }
  });

  readonly statusText = computed(() => {
    switch (this.user().status) {
      case 'active': return '活躍';
      case 'inactive': return '非活躍';
      case 'pending': return '待審核';
      default: return '未知';
    }
  });

  // 事件處理
  protected onView() {
    this.view.emit(this.user());
  }

  protected onEdit() {
    if (this.canEdit()) {
      this.edit.emit(this.user());
    }
  }

  protected onDelete() {
    if (this.canDelete()) {
      this.delete.emit(this.user());
    }
  }
}
```

#### 現代表單組件
```typescript
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
      <h2>{{ isEditMode() ? '編輯用戶' : '新增用戶' }}</h2>

      <!-- 基本信息 -->
      <div class="form-section">
        <h3>基本信息</h3>

        <mat-form-field appearance="outline">
          <mat-label>姓名</mat-label>
          <input matInput formControlName="name" required>
          <mat-icon matSuffix>person</mat-icon>
          @if (nameControl.invalid && nameControl.touched) {
            <mat-error>
              @if (nameControl.errors?.['required']) {
                姓名為必填項目
              }
              @if (nameControl.errors?.['minlength']) {
                姓名至少需要2個字符
              }
            </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>電子郵件</mat-label>
          <input matInput formControlName="email" type="email" required>
          <mat-icon matSuffix>email</mat-icon>
          @if (emailControl.invalid && emailControl.touched) {
            <mat-error>
              @if (emailControl.errors?.['required']) {
                電子郵件為必填項目
              }
              @if (emailControl.errors?.['email']) {
                請輸入有效的電子郵件地址
              }
            </mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>角色</mat-label>
          <mat-select formControlName="role"equired>
            @for (role of availableRoles(); track role.value) {
              <mat-option [value]="role.value">
                {{ role.label }}
              </mat-option>
            }
          </mat-select>
          @if (roleControl.invalid && roleControl.touched) {
            <mat-error>請選擇用戶角色</mat-error>
          }
        </mat-form-field>
      </div>

      <!-- 詳細信息 -->
      @defer (when showAdvancedFields()) {
        <div class="form-section">
          <h3>詳細信息</h3>

          <mat-form-field appearance="outline">
            <mat-label>部門</mat-label>
            <mat-select formControlName="department">
              @for (dept of departments(); track dept.id) {
                <mat-option [value]="dept.id">
                  {{ dept.name }}
                </mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>入職日期</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="joinDate">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>
      } @placeholder {
        <button type="button" mat-button (click)="toggleAdvancedFields()">
          <mat-icon>expand_more</mat-icon>
          顯示更多選項
        </button>
      }

      <!-- 表單操作 -->
      <div class="form-actions">
        <button type="button" mat-button (click)="onCancel()">
          取消
        </button>
        <button
          type="submit"
          mat-raised-button
          color="primary"
          [disabled]="userForm.invalid || isSubmitting()">
          @if (isSubmitting()) {
            <mat-icon>hourglass_empty</mat-icon>
            處理中...
          } @else {
            <mat-icon>save</mat-icon>
            {{ isEditMode() ? '更新' : '創建' }}
          }
        </button>
      </div>
    </form>
  `,
  styles: [`
    .user-form {
      max-width: 600px;
      padding: 2rem;

      .form-section {
        margin-bottom: 2rem;

        h3 {
          margin-bottom: 1rem;
          color: var(--mat-sys-primary);
        }

        mat-form-field {
          width: 100%;
          margin-bottom: 1rem;
        }
      }

      .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 2rem;
      }
    }
  `]
})
export class UserFormComponent implements OnInit {
  // 輸入屬性
  readonly initialUser = input<User | null>(null);
  readonly availableRoles = input<Role[]>([]);
  readonly departments = input<Department[]>([]);

  // 輸出事件
  readonly save = output<User>();
  readonly cancel = output<void>();

  // 表單狀態
  private readonly fb = inject(FormBuilder);
  protected readonly userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    department: [''],
    joinDate: [new Date()]
  });

  // 組件狀態
  private readonly _isSubmitting = signal(false);
  private readonly _showAdvancedFields = signal(false);

  readonly isSubmitting = this._isSubmitting.asReadonly();
  readonly showAdvancedFields = this._showAdvancedFields.asReadonly();

  // 計算屬性
  readonly isEditMode = computed(() => this.initialUser() !== null);

  // 表單控制項快捷訪問
  get nameControl() { return this.userForm.get('name')!; }
  get emailControl() { return this.userForm.get('email')!; }
  get roleControl() { return this.userForm.get('role')!; }

  ngOnInit() {
    // 如果有初始用戶數據，填充表單
    const user = this.initialUser();
    if (user) {
      this.userForm.patchValue({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        joinDate: user.joinDate
      });
    }
  }

  protected toggleAdvancedFields() {
    this._showAdvancedFields.update(show => !show);
  }

  protected async onSubmit() {
    if (this.userForm.valid) {
      this._isSubmitting.set(true);

      try {
        const formValue = this.userForm.value;
        const user: User = {
          id: this.initialUser()?.id ?? generateId(),
          name: formValue.name!,
          email: formValue.email!,
          role: formValue.role!,
          department: formValue.department || '',
          joinDate: formValue.joinDate!,
          status: 'active',
          isVip: false
        };

        this.save.emit(user);
      } finally {
        this._isSubmitting.set(false);
      }
    }
  }

  protected onCancel() {
    this.cancel.emit();
  }
}
```
### 5. 現代路由與導航

#### 功能路由配置
```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./interface/layouts/passport/passport.layout').then(m => m.PassportLayoutComponent),
    children: [
      {
        path: 'login',
        l: () => import('./interface/pages/auth/login/login.page').then(m => m.LoginPageComponent),
        title: '登入 - NG-AC'
      },
      {
        path: 'register',
        loadComponent: () => import('./interface/pages/auth/register/register.page').then(m => m.RegisterPageComponent),
        title: '註冊 - NG-AC'
      }
    ]
  },
  {
    path: '',
    loadComponent: () => import('./interface/layouts/main-app/main-app.layout').then(m => m.MainAppLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./interface/pages/dashboard/dashboard.page').then(m => m.DashboardPageComponent),
        title: '儀表板 - NG-AC'
      },
      {
        path: 'users',
        loadChildren: () => import('./interface/pages/user/user.routes').then(m => m.userRoutes)
      },
      {
        path: 'contracts',
        loadChildren: () => import('./interface/pages/contracts/contracts.routes').then(m => m.contractRoutes)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./interface/pages/not-found/not-found.page').then(m => m.NotFoundPageComponent),
    title: '頁面未找到 - NG-AC'
  }
];

// 子路由範例 - user.routes.ts
export const userRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list/user-list.page').then(m => m.UserListPageComponent),
    title: '用戶列表'
  },
  {
    path: 'create',
    loadComponent: () => import('./user-create/user-create.page').then(m => m.UserCreatePageComponent),
    title: '新增用戶'
  },
  {
    path: ':id',
    loadComponent: () => import('./user-detail/user-detail.page').then(m => m.UserDetailPageComponent),
    resolve: {
      user: UserResolver
    },
    title: '用戶詳情'
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./user-edit/user-edit.page').then(m => m.UserEditPageComponent),
    resolve: {
      user: UserResolver
    },
    canDeactivate: [CanDeactivateGuard],
    title: '編輯用戶'
  }
];
```

#### 現代路由守衛
```typescript
// auth.guard.ts - 功能式守衛
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      } else {
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      }
    })
  );
};

// 使用 Signals 的守衛
export const signalAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};

// 角色守衛
export const roleGuard = (requiredRole: string): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.currentUser()?.role;

    if (userRole === requiredRole || userRole === 'admin') {
      return true;
    } else {
      router.navigate(['/access-denied']);
      return false;
    }
  };
};

// 權限守衛
export const permissionGuard = (requiredPermission: string): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const user = authService.currentUser();

    return user?.permissions.includes(requiredPermission) ?? false;
  };
};
```

#### 現代解析器
```typescript
// user.resolver.ts - 功能式解析器
export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const userId = route.paramMap.get('id');

  if (!userId) {
    router.navigate(['/users']);
    return EMPTY;
  }

  return userService.getUserById(userId).pipe(
    catchError(() => {
      router.navigate(['/users']);
      return EMPTY;
    })
  );
};

// 使用 Signals 的解析器
export const signalUserResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  const userId = route.paramMap.get('id')!;

  // 觸發載入並返回 Signal
  userService.loadUser(userId);

  // 返回用戶數據
  return userService.getUser(userId);
};
```

### 6. 性能優化策略

#### OnPush 變更檢測策略
```typescript
@Component({
  selector: 'app-performance-optimized',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="optimized-component">
      <!-- 使用 Signals 自動觸發變更檢測 -->
      <h2>{{ title() }}</h2>
      <p>計數: {{ count() }}</p>
      <p>雙倍: {{ doubleCount() }}</p>

      <!-- 使用 trackBy 優化列表渲染 -->
      @for (item of items(); track trackByItemId) {
        <div class="item">{{ item.name }}</div>
      }

      <!-- 使用 OnPush 安全的事件處理 -->
      <button)="increment()">增加</button>
    </div>
  `
})
export class PerformanceOptimizedComponent {
  // Signals 自動處理變更檢測
  private readonly _count = signal(0);
  private readonly _title = signal('性能優化組件');
  private readonly _items = signal<Item[]>([]);

  readonly count = this._count.asReadonly();
  readonly title = this._title.asReadonly();
  readonly items = this._items.asReadonly();

  // 計算屬性自動優化
  readonly doubleCount = computed(() => this.count() * 2);

  // TrackBy 函數優化列表渲染
  protected trackByItemId = (index: number, item: Item): string => item.id;

  protected increment() {
    this._count.update(c => c + 1);
  }
}
```

#### 虛擬滾動優化
```typescript
@Component({
  selector: 'app-virtual-scroll-list',
  standalone: true,
  imports: [ScrollingModule, MatListModule],
  template: `
    <div class="virtual-scroll-container">
      <cdk-virtual-scroll-viewport
        [itemSize]="itemHeight()"
        [minBufferPx]="bufferSize()"
        [maxBufferPx]="bufferSize() * 2"
        class="virtual-viewport">

        @for (item of virtualItems(); track item.id) {
          <div class="virtual-item" *cdkVirtualFor="let item of virtualItems()">
            <mat-list-item>
              <div matListItemTitle>{{ item.title }}</div>
              <div matListItemLine>{{ item.description }}</div>
              <div matListItemMeta>{{ item.date | date }}</div>
            </mat-list-item>
          </div>
        }
      </cdk-virtual-scroll-viewport>

      <!-- 載入更多 -->
      @if (hasMore() && !isLoading()) {
        <button mat-button (click)="loadMore()" class="load-more">
          載入更多
        </button>
      }

      @if (isLoading()) {
        <div class="loading-indicator">
          <mat-spinner diameter="30"></mat-spinner>
          <span>載入中...</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .virtual-scroll-container {
      height: 400px;
      width: 100%;
    }

    .virtual-viewport {
      height: 100%;
      width: 100%;
    }

    .virtual-item {
      height: 72px;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .load-more {
      width: 100%;
      margin: 1rem 0;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
    }
  `]
})
export class VirtualScrollListComponent implements OnInit {
  // 配置
  readonly itemHeight = signal(72);
  readonly bufferSize = signal(200);
  readonly pageSize = signal(50);

  // 狀態
  private readonly _allItems = signal<ListItem[]>([]);
  private readonly _virtualItems = signal<ListItem[]>([]);
  private readonly _isLoading = signal(false);
  private readonly _currentPage = signal(0);

  readonly virtualItems = this._virtualItems.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // 計算屬性
  readonly hasMore = computed(() =>
    this._virtualItems().length < this._allItems().length
  );

  private readonly dataService = inject(DataService);

  async ngOnInit() {
    await this.loadInitialData();
  }

  private async loadInitialData() {
    this._isLoading.set(true);

    try {
      const items = await this.dataService.getItems(0, this.pageSize());
      this._allItems.set(items);
      this._virtualItems.set(items.slice(0, this.pageSize()));
      this._currentPage.set(1);
    } finally {
      this._isLoading.set(false);
    }
  }

  async loadMore() {
    if (this.isLoading() || !this.hasMore()) return;

    this._isLoading.set(true);

    try {
      const startIndex = this._currentPage() * this.pageSize();
      const endIndex = startIndex + this.pageSize();
      const newItems = this._allItems().slice(startIndex, endIndex);

      this._virtualItems.update(items => [...items, ...newItems]);
      this._currentPage.update(page => page + 1);
    } finally {
      this._isLoading.set(false);
    }
  }
}
```

#### 圖片優化
```typescript
@Component({
  selector: 'app-optimized-image-gallery',
  standalone: true,
  imports: [NgOptimizedImage, CommonModule],
  template: `
    <div class="image-gallery">
      <!-- 優先載入的主圖 -->
      <div class="hero-image">
        <img
          ngSrc="/assets/images/hero-banner.jpg"
          width="1200"
          height="600"
          priority
          alt="主要橫幅圖片"
          [placeholder]="heroPlaceholder()" />
      </div>

      <!-- 延遲載入的圖片網格 -->
      <div class="image-grid">
        @for (image of images(); track image.id) {
          <div class="image-item">
            <img
              [ngSrc]="image.url"
              [width]="image.width"
              [height]="image.height"
              [alt]="image.alt"
              [placeholder]="imagePlaceholder()"
              loading="lazy"
              [sizes]="imageSizes()" />

            <div class="image-overlay">
              <h4>{{ image.title }}</h4>
              <p>{{ image.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .image-gallery {
      container-type: inline-size;
    }

    .hero-image {
      width: 100%;
      margin-bottom: 2rem;

      img {
        width: 100%;
        height: auto;
        border-radius: 8px;
      }
    }

    .image-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .image-item {
      position: relative;
      overflow: hidden;
      border-radius: 8px;

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        transition: transform 0.3s ease;
      }

      &:hover img {
        transform: scale(1.05);
      }
    }

    .image-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: white;
      padding: 1rem;
      transform: translateY(100%);
      transition: transform 0.3s ease;
    }

    .image-item:hover .image-overlay {
      transform: translateY(0);
    }

    @container (max-width: 76
      .image-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class OptimizedImageGalleryComponent {
  readonly images = signal<GalleryImage[]>([]);

  // 圖片佔位符
  readonly heroPlaceholder = signal('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI2MDAiLz4=');
  readonly imagePlaceholder = signal('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIvPg==');

  // 響應式圖片尺寸
  readonly imageSizes = signal('(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw');

  constructor() {
    this.loadImages();
  }

  private async loadImages() {
    // 模擬載入圖片數據
    const mockImages: GalleryImage[] = [
      {
        id: '1',
        url: '/assets/images/gallery/image1.jpg',
        width: 400,
        height: 300,
        alt: '圖片 1',
        title: '美麗風景',
        description: '這是一張美麗的風景照片'
      }
      // ... 更多圖片
    ];

    this.images.set(mockImages);
  }
}
```
### 7. 現代狀態管理模式

#### 全局狀態管理服務
```typescript
/**
 * @ai-context {
 *   "role": "Application/Service",
 *   "purpose": "全局狀態管理-應用程式狀態協調",
 *   "constraints": ["Signals優先", "不可變狀態", "類型安全"],
 *   "dependencies": ["User", "AuthService", "NotificationService"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 }
 */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  // 私有狀態 Signals
  private readonly _user = signal<User | null>(null);
  private readonly _theme = signal<'light' | 'dark'>('light');
  private readonly _language = signal<'zh-TW' | 'en-US'>('zh-TW');
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _isOnline = signal(navigator.onLine);
  private readonly _loading = signal<Record<string, boolean>>({});

  // 公開只讀狀態
  readonly user = this._user.asReadonly();
  readonly theme = this._theme.asReadonly();
  readonly language = this._language.asReadonly();
  readonly notifications = this._notifications.asReadonly();
  readonly isOnline = this._isOnline.asReadonly();
  readonly loading = this._loading.asReadonly();

  // 計算屬性
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userDisplayName = computed(() => this.user()?.name ?? 'Guest');
  readonly unreadNotifications = computed(() =>
    this.notifications().filter(n => !n.read).length
  );
  readonly isDarkMode = computed(() => this.theme() === 'dark');

  // 載入狀態輔助方法
  readonly isLoading = (key: string) => computed(() =>
    this.loading()[key] ?? false
  );

  constructor() {
    this.initializeOnlineStatus();
    this.loadPersistedState();
    this.setupEffects();
  }

  // 用戶管理
  setUser(user: User | null) {
    this._user.set(user);
  }

  updateUser(updates: Partial<User>) {
    this._user.update(current =>
      current ? { ...current, ...updates } : null
    );
  }

  // 主題管理
  setTheme(theme: 'light' | 'dark') {
    this._theme.set(theme);
    this.persistTheme(theme);
  }

  toggleTheme() {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  // 語言管理
  setLanguage(language: 'zh-TW' | 'en-US') {
    this._language.set(language);
    this.persistLanguage(language);
  }

  // 通知管理
  addNoti(notification: Omit<Notification, 'id' | 'timestamp'>) {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      timestamp: new Date(),
      read: false
    };

    this._notifications.update(notifications =>
      [newNotification, ...notifications].slice(0, 50) // 限制最多50個通知
    );
  }

  markNotificationAsRead(id: string) {
    this._notifications.update(notifications =>
      notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  }

  removeNotification(id: string) {
    this._notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  clearAllNotifications() {
    this._notifications.set([]);
  }

  // 載入狀態管理
  setLoading(key: string, loading: boolean) {
    this._loading.update(current => ({
      ...current,
      [key]: loading
    }));
  }

  // 網路狀態管理
  private initializeOnlineStatus() {
    window.addEventListener('online', () => this._isOnline.set(true));
    window.addEventListener('offline', () => this._isOnline.set(false));
  }

  // 持久化狀態
  private loadPersistedState() {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
    if (savedTheme) {
      this._theme.set(savedTheme);
    }

    const savedLanguage = localStorage.getItem('app-language') as 'zh-TW' | 'en-US';
    if (savedLanguage) {
      this._language.set(savedLanguage);
    }
  }

  private persistTheme(theme: string) {
    localStorage.setItem('app-theme', theme);
  }

  private persistLanguage(language: string) {
    localStorage.setItem('app-language', language);
  }

  // 副作用設置
  private setupEffects() {
    // 主題變更時更新 DOM
    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    });

    // 用戶變更時的副作用
    effect(() => {
      const user = this.user();
      if (user) {
        console.log(`用戶 ${user.name} 已登入`);
        this.addNotification({
          type: 'success',
          title: '登入成功',
          message: `歡迎回來，${user.name}！`
        });
      }
    });

    // 網路狀態變更通知
    effect(() => {
      const isOnline = this.isOnline();
      if (!isOnline) {
        this.addNotification({
          type: 'warning',
          title: '網路連線中斷',
          message: '請檢查您的網路連線'
        });
      }
    });
  }
}
```

#### 功能特定狀態管理
```typescript
/**
 * @ai-context {
 *   "role": "Application/Service",
 *   "purpose": "合約狀態管理-合約相關狀態協調",
 *   "constraints": ["領域邏輯封裝", "CQRS模式", "事件驅動"],
 *   "dependencies": ["ContractRepository", "ContractMapper"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 */
@Injectable({ providedIn: 'root' })
export class ContractStateService {
  private readonly contractRepository = inject(ContractRepository);
  private readonly appState = inject(AppStateService);

/ 私有狀態
  private readonly _contracts = signal<Contract[]>([]);
  private readonly _selectedContractId = signal<string | null>(null);
  private readonly _filters = signal<ContractFilters>({
    status: 'all',
    dateRange: null,
    searchTerm: ''
  });
  private readonly _sortConfig = signal<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  });

  // 公開只讀狀態
  readonly contracts = this._contracts.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly sortConfig = this._sortConfig.asReadonly();

  // 計算屬性
  readonly selectedContract = computed(() => {
    const id = this._selectedContractId();
    return id ? this.contracts().find(c => c.id === id) ?? null : null;
  });

  readonly filteredContracts = computed(() => {
    const contracts = this.contracts();
    const filters = this.filters();

    return contracts.filter(contract => {
      // 狀態過濾
      if (filters.status !== 'all' && contract.status !== filters.status) {
        return false;
      }

      // 搜尋過濾
      if (filters.searchTerm) {
        const term = filters.searchTerm.toLowerCase();
        return contract.title.toLowerCase().includes(term) ||
               contract.description.toLowerCase().includes(term);
      }

      // 日期範圍過濾
      if (filters.dateRange) {
        const contractDate = new Date(contract.createdAt);
        return contractDate >= filters.dateRange.start &&
               contractDate <= filters.dateRange.end;
      }

      return true;
    });
  });

  readonly sortedContracts = computed(() => {
    const contracts = this.filteredContracts();
    const sort = this.sortConfig();

    return [...contracts].sort((a, b) => {
      const aVal = a[sort.field as keyof Contract];
      const bVal = b[sort.field as keyof Contract];

      let result = 0;
      if (aVal < bVal) result = -1;
      else if (aVal > bVal) result = 1;

      return sort.direction === 'desc' ? -result : result;
    });
  });

  readonly contractStats = computed(() => {
    const contracts = this.contracts();
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'active').length,
      pending: contracts.filter(c => c.status === 'pending').length,
      completed: contracts.filter(c => c.status === 'completed').length,
      totalValue: contracts.reduce((sum, c) => sum + c.value, 0)
    };
  });

  // 載入狀態
  readonly isLoading = this.appState.isLoading('contracts');

  // 業務方法
  async loadContracts() {
    this.appState.setLoading('contracts', true);

    try {
      const contracts = await this.contractRepository.getAll();
      this._contracts.set(contracts);
    } catch (error) {
      this.appState.addNotification({
        type: 'error',
        title: '載入失敗',
        message: '無法載入合約列表'
      });
      throw error;
    } finally {
      this.appState.setLoading('contracts', false);
    }
  }

  async createContract(contractData: CreateContractData) {
    this.appState.setLoading('contract-create', true);

    try {
      const contract = await this.contractRepository.create(contractData);
      this._contracts.update(contracts => [contract, ...contracts]);

      this.appState.addNotification({
        type: 'success',
        title: '創建成功',
        message: `合約 "${contract.title}" 已創建`
      });

      return contract;
    } catch (error) {
      this.appState.addNotification({
        type: 'error',
        title: '創建失敗',
        message: '無法創建合約'
      });
      throw error;
    } finally {
      this.appState.setLoading('contract-create', false);
    }
  }

  async updateContract(id: string, updates: Partial<Contract>) {
    this.appState.setLoading(`contract-update-${id}`, true);

    try {
      const updatedContract = await this.contractRepository.update(id, updates);
      this._contracts.update(contracts =>
        contracts.map(c => c.id === id ? updatedContract : c)
      );

      this.appState.addNotification({
        type: 'success',
        title: '更新成功',
        message: '合約已更新'
      });

      return updatedContract;
    } catch (error) {
      this.appState.addNotification({
        type: 'error',
        title: '更新失敗',
        message: '無法更新合約'
      });
      throw error;
    } finally {
      this.appState.setLoading(`contract-update-${id}`, false);
    }
  }

  async deleteContract(id: string) {
    this.appState.setLoading(`contract-delete-${id}`, true);

    try {
      await this.contractRepository.delete(id);
      this._contracts.update(contracts =>
        contracts.filter(c => c.id !== id)
      );

      this.appState.addNotification({
        type: 'success',
        title: '刪除成功',
        message: '合約已刪除'
      });
    } catch (error) {
      this.appState.addNotification({
        type: 'error',
        title: '刪除失敗',
        message: '無法刪除合約'
      });
      throw error;
    } finally {
      this.appState.setLoading(`contract-delete-${id}`, false);
    }
  }

  // 選擇管理
  selectContract(id: string | null) {
    this._selectedContractId.set(id);
  }

  // 過濾管理
  updateFilters(filters: Partial<ContractFilters>) {
    this._filters.update(current => ({ ...current, ...filters }));
  }

  clearFilters() {
    this._filters.set({
      status: 'all',
      dateRange: null,
      searchTerm: ''
    });
  }

  // 排序管理
  updateSort(field: string, direction?: 'asc' | 'desc') {
    this._sortConfig.update(current => ({
      field,
      direction: direction ?? (current.field === field && current.direction === 'asc' ? 'desc' : 'asc')
    }));
  }
}
```

### 8. 現代測試策略

#### 組件測試
```typescript
// user-card.component.spec.ts
describe('UserCardComponent', () => {
  let component: UserCardComponent;
  let fixture: ComponentFixture<UserCardComponent>;

  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    department: 'IT',
    joinDate: new Date('2023-01-01'),
    status: 'active',
    isVip: false
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    component = fixture.componentInstance;

    // 設置輸入屬性
    fixture.componentRef.setInput('user', mockUser);
    fixture.componentRef.setInput('canEdit', true);
    fixture.componentRef.setInput('canDelete', false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user information', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('mat-card-title').textContent).toContain('John Doe');
t(compiled.querySelector('mat-card-subtitle').textContent).toContain('john@example.com');
  });

  it('should show correct status chip', () => {
    expect(component.statusText()).toBe('活躍');
    expect(component.statusColor()).toBe('primary');
  });

  it('should format join date correctly', () => {
    const formatted = component.joinDateFormatted();
    expect(formatted).toContain('2023');
  });

  it('should emit view event when view button clicked', () => {
    spyOn(component.view, 'emit');

    const viewButton = fixture.nativeElement.querySelector('[data-testid="view-button"]');
    viewButton.click();

    expect(component.view.emit).toHaveBeenCalledWith(mockUser);
  });

  it('should disable edit button when canEdit is false', () => {
    fixture.componentRef.setInput('canEdit', false);
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('[data-testid="edit-button"]');
    expect(editButton.disabled).toBeTruthy();
  });

  it('should not show delete button when canDelete is false', () => {
    const deleteButton = fixture.nativeElement.querySelector('[data-testid="delete-button"]');
    expect(deleteButton).toBeFalsy();
  });
});
```

#### 服務測試
```typescript
// app-state.service.spec.ts
describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(service.user()).toBeNull();
    expect(service.theme()).toBe('light');
    expect(service.language()).toBe('zh-TW');
    expect(service.isAuthenticated()).toBeFalsy();
  });

  it('should update user state', () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user'
    };

    service.setUser(user);

    expect(service.user()).toEqual(user);
    expect(service.isAuthenticated()).toBeTruthy();
    expect(service.userDisplayName()).toBe('Test User');
  });

  it('should toggle theme', () => {
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should manage notifications', () => {
    const notification = {
      type: 'success' as const,
      title: 'Test',
      message: 'Test message'
    };

    service.addNotification(notification);

    expect(service.notifications().length).toBe(1);
    expect(service.unreadNotifications()).toBe(1);

    const addedNotification = service.notifications()[0];
    service.markNotificationAsRead(addedNotification.id);

    expect(service.unreadNotifications()).toBe(0);
  });

  it('should manage loading states', () => {
    const loadingKey = 'test-loading';

    expect(service.isLoading(loadingKey)()).toBeFalsy();

    service.setLoading(loadingKey, true);
    expect(service.isLoading(loadingKey)()).toBeTruthy();

    service.setLoading(loadingKey, false);
    expect(service.isLoading(loadingKey)()).toBeFalsy();
  });
});
```

### 9. 部署與建構優化

#### 現代建構配置
```json
// angular.json 優化配置
{
  "projects": {
    "ng-ac": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/ng-ac",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/manifest.webmanifest",
              "src/assets"
            ],
            "styles": ["src/styles.scss"],
            "scripts": [],
            "budgets": [
              {
                "type": "initial",
                "maximumWarning": "1mb",
                "maximumError": "2mb"
              },
              {
                "type": "anyComponentStyle",
                "maximumWarning": "4kb",
                "maximumError": "8kb"
              }
            ]
          },
          "configurations": {
            "production": {
              "optimization": {
                "scripts": true,
                "styles": true,
                "fonts": true
              },
              "outputHashing": "all",
              "sourceMap": false,
              "namedChunks": false,
              "aot": true,
              "extractLicenses": true,
              "vendorChunk": false,
              "buildOptimizer": true,
              "serviceWorker": true,
              "ngswConfigPath": "ngsw-config.json"
            }
          }
        }
      }
    }
  }
}
```

## 📊 性能指標與監控

### Core Web Vitals 目標
- **LCP (Largest Contentful Paint)**: < 2.5s
- **INP (Interaction to Next Paint)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 監控實施
```typescript
// performance.service.ts
@Injectable({ providedIn: 'root' })
export class PerformanceService {
  private readonly analytics = inject(Analytics);

  constructor() {
    this.initializeWebVitals();
  }

  private initializeWebVitals() {
    // 監控 LCP
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.analytics.logEvent('web_vitals', {
        metric_name: 'LCP',
        value: lastEntry.startTime,
        rating: this.getRating(lastEntry.startTime, [2500, 4000])
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // 監控 CLS
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      this.analytics.logEvent('web_vitals', {
        metric_name: 'CLS',
        value: clsValue,
        rating: this.getRating(clsValue, [0.1, 0.25])
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  private getRating(value: number, thresholds: [number, number]): string {
    if (value <= thresholds[0]) return 'good';
    if (value <= thresholds[1]) return 'needs-improvement';
    return 'poor';
  }
}
```

## 🎯 最佳實踐總結

### 1. 開發原則
- **Signals First**: 優先使用 Signals 進行狀態管理
- **OnPush Strategy**: 所有組件使用 OnPush 變更檢測
- **Standalone Components**: 避免使用 NgModule
- **Modern Control Flow**: 使用 @if/@for/@switch/@let
- **Deferrable Views**: 智能延遲載入非關鍵內容

### 2. 性能優化
- **Tree Shaking**: 確保未使用的代碼被移除
- **Code Splitting**: 路由級別的代碼分割
- **Image Optimization**: 使用 NgOptimizedImage
- **Virtual Scrolling**: 大列表使用虛擬滾動
- **Container Queries**: 組件級響應式設計

### 3. 代碼品質
- **TypeScript Strict Mode**: 啟用所有嚴格檢查
- **ESLint Rules**: 統一代碼風格
- **Unit Testing**: 高測試覆蓋率
- **E2E Testing**: 關鍵用戶流程測試
- **Performance Monitoring**: 持續性能監控

---

**結論**: 本文件提供了 Angular 20 現代化架構的完整指南，涵蓋了從基礎特性到高級優化的所有方面。通過遵循這些最佳實踐，可以構建出高性能、可維護、可擴展的現代 Angular 應用程式。
