---
alwaysApply: true
---

# Angular 20 專案最佳實踐手冊 - NG-AC 專用

## 📋 專案技術棧現狀分析

### 當前技術棧評估 ✅

基於對 NG-AC 專案的深度術棧現代化程度評估：

| 技術領域 | 當前狀態 | 現代化等級 | 建議行動 |
|---------|---------|-----------|---------|
| **Angular 版本** | ✅ Angular 20.0.0 | 🟢 最新 | 保持更新 |
| **架構模式** | ✅ DDD + Clean Architecture | 🟢 企業級 | 持續優化 |
| **組件架構** | ✅ Standalone Components | 🟢 現代化 | 已達標 |
| **狀態管理** | ⚠️ 部分 Signals | 🟡 需升級 | 全面 Signals 化 |
| **控制流程** | ⚠️ 混合 *ngIf/*ngFor | 🟡 需升級 | 遷移至 @if/@for |
| **UI 框架** | ✅ Angular Material 20 | 🟢 最新 | Material 3 優化 |
| **Firebase 整合** | ✅ 完整 Firebase 20+ | 🟢 企業級 | 性能優化 |
| **PWA 支援** | ✅ Service Worker | 🟢 已配置 | App Shell 增強 |
| **TypeScript** | ✅ TypeScript 5.8+ | 🟢 最新 | 嚴格模式優化 |
| **建構工具** | ✅ Angular CLI 20 | 🟢 現代化 | 建構優化 |

### 專案優勢 🚀

1. **完整的 DDD 架構**: 清晰的領域分層，符合企業級開發標準
2. **現代化 Firebase 整合**: 完整的 Firebase 20+ 服務整合
3. **嚴格的 TypeScript 配置**: 啟用所有嚴格模式檢查
4. **完善的工具鏈**: ESLint、Prettier、Git Hooks 完整配置
5. **PWA 就緒**: Service Worker 和 Manifest 已配置

## 🎯 Angular 20 現代化技術重點

### 1. Signals 優先策略 (Signal-First Architecture)

**當前狀況**: 專案部分使用 RxJS，需要全面 Signals 化

**實施策略**:
```typescript
// ❌ 舊方式: RxJS Subject
@Injectable({ providedIn: 'root' })
export class UserService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: User) {
    this.userSubject.next(user);
  }
}

// ✅ 新方式: Signals
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _user = signal<User | null>(null);
  readonly user = this._user.asReadonly();

  // 計算屬性
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly userDisplayName = computed(() =>
    this.user()?.name ?? 'Guest'
  );

  setUser(user: User) {
    this._user.set(user);
  }

  updateUser(updates: Partial<User>) {
    this._user.update(current =>
      current ? { ...current, ...updates } : null
    );
  }
}
```

**組件中的 Signals 使用**:
```typescript
@Component({
  selector: 'app-user-profile',
  template: `
    <div class="user-profile">
      @if (userService.isAuthenticated()) {
        <h2>歡迎, {{ userService.userDisplayName() }}!</h2>
        <p>最後登入: {{ lastLoginFormatted() }}</p>
      } @else {
        <app-login-prompt />
      }
    </div>
  `
})
export class UserProfileComponent {
  protected readonly userService = inject(UserService);

  // 計算屬性
  protected readonly lastLoginFormatted = computed(() => {
    const user = this.userService.user();
    return user?.lastLogin
      ? new Intl.DateTimeFormat('zh-TW').format(user.lastLogin)
      : '從未登入';
  });

  // 副作用
  constructor() {
    effect(() => {
      const user = this.userService.user();
      if (user) {
        console.log(`用戶 ${user.name} 已登入`);
      }
    });
  }
}
```

### 2. 現代控制流程 (@if/@for/@switch)

**遷移策略**:
```typescript
// ❌ 舊方式
@Component({
  template: `
    <div *ngIf="users.length > 0; else noUsers">
      <div *ngFor="let user of users; trackBy: trackByUserId">
        <span [ngSwitch]="user.status">
          <span *ngSwitchCase="'active'">🟢</span>
          <span *ngSwitchCase="'inactive'">🔴</span>
          <span *ngSwitchDefault>⚪</span>
        </span>
        {{ user.name }}
      </div>
    </div>
    <ng-template #noUsers>
      <p>沒有用戶資料</p>
    </ng-template>
  `
})

// ✅ 新方式
@Component({
  template: `
    @if (users().length > 0) {
      @for (user of users(); track user.id) {
        <div class="user-item">
          @switch (user.status) {
            @case ('active') { <span>🟢</span> }
            @case ('inactive') { <span>🔴</span> }
            @default { <span>⚪</span> }
          }
          {{ user.name }}
        </div>
      }
    } @else {
      <p>沒有用戶資料</p>
    }
  `
})
export class UserListComponent {
  protected readonly users = signal<User[]>([]);
}
```

### 3. Deferrable Views 延遲載入

**針對專案的實施**:
```typescript
@Component({
  template: `
    <div class="dashboard">
      <!-- 立即載入的關鍵內容 -->
      <app-header />
      <app-navigation />

      <!-- 延遲載入的圖表組件 -->
      @defer (on viewport) {
        <app-analytics-chart />
      } @placeholder {
        <div class="chart-skeleton">載入中...</div>
      } @loading (minimum 500ms) {
        <app-loading-spinner />
      } @error {
        <app-error-message message="圖表載入失敗" />
      }

      <!-- 用戶互動後載入 -->
      @defer (on interaction) {
        <app-user-settings />
      } @placeholder {
        <button>點擊載入設定</button>
      }

      <!-- 閒置時載入 -->
      @defer (on idle) {
        <app-background-sync />
      }
    </div>
  `
})
export class DashboardComponent {}
```

### 4. 現代化 Firebase 整合優化

**基於專案現有 Firebase 配置的優化**:
```typescript
// 優化 Firestore 查詢
@Injectable({ providedIn: 'root' })
export class OptimizedFirestoreService {
  private readonly firestore = inject(Firestore);

  // 使用 Signals 的響應式查詢
  getUsersSignal() {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'), limit(50));

    return toSignal(collectionData(q, { idField: 'id' }) as Observable<User[]>, {
      initialValue: []
    });
  }

  // 批次操作優化
  async batchUpdateUsers(updates: Array<{ id: string; data: Partial<User> }>) {
    const batch = writeBatch(this.firestore);

    updates.forEach(({ id, data }) => {
      const userRef = doc(this.firestore, 'users', id);
      batch.update(userRef, data);
    });

    return batch.commit();
  }

  // 離線支援
  enableOfflineSupport() {
    return enableNetwork(this.firestore);
  }
}
```

**Firebase Auth 與 Signals 整合**:
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly isAdmin = computed(() =>
    this.user()?.role === 'admin'
  );

  constructor() {
    // 監聽認證狀態變化
    authState(this.auth).subscribe(user => {
      this._user.set(user);
    });
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  async signOut() {
    await signOut(this.auth);
    this._user.set(null);
  }
}
```

### 5. 現代化佈局系統

**Container Queries 實施**:
```scss
// 專案樣式優化
.contract-card {
  container-type: inline-size;
  container-name: contract-card;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: var(--mat-sys-surface);

  @container contract-card (min-width: 400px) {
    flex-direction: row;
    align-items: center;
  }

  @container contract-card (min-width: 600px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
}

.user-dashboard {
  container-type: inline-size;
  display: grid;
  gap: 1rem;

  // 響應式網格
  grid-template-columns: 1fr;

  @container (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @container (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Material 3 主題優化**:
```scss
// 基於專案的 Material 3 主題
@use '@angular/material' as mat;

$primary-palette: mat.m3-define-palette(mat.$m3-blue-palette);
$tertiary-palette: mat.m3-define-palette(mat.$m3-green-palette);

$light-theme: mat.m3-define-light-theme((
  color: (
    primary: $primary-palette,
    tertiary: $tertiary-palette,
  ),
  typography: (
    brand-family: 'Noto Sans TC',
    plain-family: 'Noto Sans TC',
  ),
  density: 0,
));

$dark-theme: mat.m3-define-dark-theme((
  color: (
    primary: $primary-palette,
    tertiary: $tertiary-palette,
  )
));

:root {
  @include mat.all-component-themes($light-theme);
}

@media (prefers-color-scheme: dark) {
  :root {
    @include mat.all-component-colors($dark-theme);
  }
}
```

### 6. 性能優化策略

**基於專案的性能優化**:
```typescript
// OnPush 變更檢測策略
@Component({
  selector: 'app-contract-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (contract of contracts(); track contract.id) {
      <app-contract-card
        [contract]="contract"
        (statusChange)="onStatusChange($event)" />
    }
  `
})
export class ContractListComponent {
  protected readonly contracts = input.required<Contract[]>();
  protected readonly statusChange = output<ContractStatusChange>();

  protected onStatusChange(change: ContractStatusChange) {
    this.statusChange.emit(change);
  }
}

// 虛擬滾動優化
@Component({
  template: `
    <cdk-virtual-scroll-viewport
      [itemSize]="80"
      class="contract-viewport">
      @for (contract of contracts(); track contract.id) {
        <app-contract-item
          [contract]="contract"
          *cdkVirtualFor="let contract of contracts()" />
      }
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .contract-viewport {
      height: 400px;
      width: 100%;
    }
  `]
})
export class VirtualContractListComponent {}
```

**圖片優化**:
```typescript
@Component({
  template: `
    <img
      ngSrc="/assets/images/hero.jpg"
      width="1200"
      height="600"
      priority
      alt="專案首頁圖片" />

    <img
      ngSrc="/assets/images/user-avatar.jpg"
      width="100"
      height="100"
      [placeholder]="avatarPlaceholder"
      alt="用戶頭像" />
  `
})
export class OptimizedImageComponent {
  protected readonly avatarPlaceholder = 'data:image/svg+xml;base64,...';
}
```

## 🏗️ DDD 架構現代化

### 領域層 (Domain Layer) 優化

**實體 (Entities) 現代化**:
```typescript
/**
 * @ai-context {
 *   "role": "Domain/Entity",
 *   "purpose": "User實體-用戶核心業務邏輯",
 *   "constraints": ["無外部服務依賴", "業務規則內部封裝", "聚合一致性"],
 *   "dependencies": ["Email", "Password", "UserRole"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 * @usage User.create(data), User.changeEmail(email)
 * @see docs/architecture/domain.md
 */
export class User extends BaseEntity {
  private constructor(
    id: UserId,
    private _email: Email,
    private _name: string,
    private _role: UserRole,
    private _createdAt: Date
  ) {
    super(id);
  }

  static create(data: CreateUserData): User {
    const id = UserId.generate();
    const email = Email.create(data.email);

    return new User(
      id,
      email,
      data.name,
      data.role ?? UserRole.USER,
      new Date()
    );
  }

  // 業務方法
  changeEmail(newEmail: string): void {
    const email = Email.create(newEmail);
    this._email = email;
    this.addDomainEvent(new UserEmailChangedEvent(this.id, email));
  }

  // Getters
  get email(): Email { return this._email; }
  get name(): string { return this._name; }
  get role(): UserRole { return this._role; }
  get createdAt(): Date { return this._createdAt; }
}
```

**值對象 (Value Objects) 現代化**:
```typescript
/**
 * @ai-context {
 *   "role": "Domain/ValueObject",
 *   "purpose": "Email值對象-郵箱格式驗證",
 *   "constraints": ["不可變對象", "值相等性", "格式驗證"],
 *   "dependencies": [],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 */
export class Email {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly _value: string) {
    this.validate(_value);
  }

  static create(value: string): Email {
    return new Email(value);
  }

  private validate(value: string): void {
    if (!value || !Email.EMAIL_REGEX.test(value)) {
      throw new InvalidEmailError(value);
    }
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
```

### 應用層 (Application Layer) 現代化

**用例 (Use Cases) 與 Signals 整合**:
```typescript
/**
 * @ai-context {
 *   "role": "Application/UseCase",
 *   "purpose": "登入用例-用戶認證流程",
 *   "constraints": ["單一用例職責", "事務邊界", "輸入驗證"],
 *   "dependencies": ["UserRepository", "AuthService", "LoginDTO"],
 *   "security": "critical",
 *   "lastmod": "2025-01-18"
 * }
 */
@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  private readonly userRepository = inject(UserRepository);
  private readonly authService = inject(AuthService);
  private readonly _isLoading = signal(false);

  readonly isLoading = this._isLoading.asReadonly();

  async execute(command: LoginCommand): Promise<LoginResult> {
    this._isLoading.set(true);

    try {
      // 驗證輸入
      const email = Email.create(command.email);

      // 查找用戶
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new UserNotFoundError(email);
      }

      // 驗證密碼
      const isValid = await this.authService.validatePassword(
        command.password,
        user.passwordHash
      );

      if (!isValid) {
        throw new InvalidCredentialsError();
      }

      // 生成 Token
      const token = await this.authService.generateToken(user);

      return LoginResult.success(user, token);

    } finally {
      this._isLoading.set(false);
    }
  }
}
```

### 基礎設施層 (Infrastructure Layer) 現代化

**Firebase Repository 實現**:
```typescript
/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Firebase用戶倉儲-用戶數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理"],
 *   "dependencies": ["FirestoreService", "UserRepository", "User"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 */
@Injectable({ providedIn: 'root' })
export class FirebaseUserRepository implements UserRepository {
  private readonly firestore = inject(Firestore);
  private readonly usersCollection = collection(this.firestore, 'users');

  async save(user: User): Promise<void> {
    const userData = this.toFirestoreData(user);
    const userRef = doc(this.usersCollection, user.id.value);

    await setDoc(userRef, userData);
  }

  async findById(id: UserId): Promise<User | null> {
    const userRef = doc(this.usersCollection, id.value);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return null;
    }

    return this.toDomainEntity(snapshot.data());
  }

  async findByEmail(email: Email): Promise<User | null> {
    const q = query(
      this.usersCollection,
      where('email', '==', email.value),
      limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return this.toDomainEntity(snapshot.docs[0].data());
  }

  private toFirestoreData(user: User): any {
    return {
      email: user.email.value,
      name: user.name,
      role: user.role,
      createdAt: Timestamp.fromDate(user.createdAt),
      updatedAt: Timestamp.now()
    };
  }

  private toDomainEntity(data: any): User {
    // 從 Firestore 數據重建領域實體
    return User.reconstitute({
      id: data.id,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: data.createdAt.toDate()
    });
  }
}
```

## 🚀 實施路徑規劃

### 第一階段：核心現代化 (2-3週)

1. **Signals 遷移**
   - [ ] 識別所有 BehaviorSubject/Subject 使用
   - [ ] 逐步遷移至 signal/computed
   - [ ] 更新組件狀態管理

2. **控制流程升級**
   - [ ] 遷移 *ngIf 至 @if
   - [ ] 遷移 *ngFor 至 @for
   - [ ] 遷移 [ngSwitch] 至 @switch

3. **OnPush 策略**
   - [ ] 所有組件啟用 OnPush
   - [ ] 使用 input()/output() 函數
   - [ ] 移除不必要的變更檢測

### 第二階段：性能優化 (2-3週)

1. **Deferrable Views**
   - [ ] 識別可延遲載入的組件
   - [ ] 實施 @defer 策略
   - [ ] 優化首屏載入時間

2. **圖片優化**
   - [ ] 遷移至 NgOptimizedImage
   - [ ] 設定正確的 priority
   - [ ] 實施 placeholder 策略

3. **虛擬滾動**
   - [ ] 長列表使用 CDK Virtual Scrolling
   - [ ] 優化大數據集渲染

### 第三階段：進階功能 (3-4週)

1. **Container Queries**
   - [ ] 實施組件級響應式設計
   - [ ] 建立設計系統
   - [ ] 優化佈局組件

2. **Material 3 升級**
   - [ ] 實施 M3 主題系統
   - [ ] 優化色彩和排版
   - [ ] 建立設計 tokens

3. **PWA 增強**
   - [ ] 實施 App Shell
   - [ ] 優化離線體驗
   - [ ] 實施推播通知

## 📊 品質檢查清單

### 程式碼品質
- [ ] 所有組件使用 OnPush 策略
- [ ] 使用現代控制流程 (@if/@for/@switch)
- [ ] Signals 優先於 RxJS (除非必要)
- [ ] 正確的 TypeScript 嚴格模式
- [ ] ESLint 規則全部通過

### 性能指標
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] 首屏資源 < 1MB
- [ ] 路由分包正確實施

### 可訪問性
- [ ] ARIA 標籤正確使用
- [ ] 鍵盤導航支援
- [ ] 色彩對比度符合 WCAG 2.1
- [ ] 螢幕閱讀器友好

### 安全性
- [ ] Firebase 安全規則正確配置
- [ ] 輸入驗證完整
- [ ] XSS 防護措施
- [ ] CSRF 保護啟用

## 💡 最佳實踐建議

### 1. 漸進式升級
- 不要一次性重寫所有代碼
- 新功能優先使用新技術
- 建立遷移檢查清單
- 定期代碼審查

### 2. 團隊協作
- 建立編碼規範文檔
- 定期技術分享會議
- 代碼審查流程
- 知識庫維護

### 3. 監控與測試
- 實施性能監控
- 自動化測試覆蓋
- 用戶體驗追蹤
- 錯誤監控系統

---

**總結**: 這份技術手冊專為 NG-AC 專案量身定制，基於現有的優秀架構基礎，提供實用的現代化升級路徑。重點在於漸進式改進，確保專案穩定性的同時，充分利用 Angular 20 的最新特性。
