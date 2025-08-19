# Angular 20 快速參考指南

## 🎯 核心特性速查

### Signals 基礎語法
```typescript
// 基礎 Signal
const count = signal(0);
const user = signal<User | null>(null);

// 計算屬性
const doubleCount = computed(() => count() * 2);
const isAuthenticated = computed(() => user() !== null);

// 副作用
effect(() => console.log(`Count: ${count()}`));

// 更新方法
count.set(5);                    // 直接設定
count.update(n => n + 1);        // 基於當前值更新
user.set(newUser);               // 設定對象
user.update(u => u ? {...u, name: 'New'} : null); // 更新對象
```

### 現代控制流程
```typescript
// @if 條件渲染
@if (user()) {
  <user-profile [user]="user()" />
} @else if (isLoading()) {
  <loading-spinner />
} @else {
  <login-form />
}

// @for 循環渲染
@for (item of items(); track item.id) {
  <item-card [item]="item" />
} @empty {
  <empty-state />
}

// @switch 分支渲染
@switch (status()) {
  @case ('loading') { <spinner /> }
  @case ('success') { <content /> }
  @case ('error') { <error-message /> }
  @default { <unknown-state /> }
}

// @let 局部變量
@let userStats = calculateStats(user());
@let isVip = userStats.totalSpent > 10000;
```

### Deferrable Views
```typescript
// 視窗可見時載入
@defer (on viewport) {
  <heavy-component />
} @placeholder {
  <skeleton />
} @loading (minimum 500ms) {
  <spinner />
} @error {
  <error-message />
}

// 用戶互動時載入
@defer (on interaction) {
  <settings-panel />
} @placeholder {
  <button>載入設定</button>
}

// 閒置時載入
@defer (on idle) {
  <background-sync />
}

// 定時器載入
@defer (on timer(3000ms)) {
  <promotional-banner />
}
```

### 現代組件架構
```typescript
@Component({
  selector: 'app-modern',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ModernComponent {
  // 新的輸入輸出函數
  readonly data = input.required<Data>();
  readonly config = input({ defaultValue: 'default' });
  readonly change = output<ChangeEvent>();

  // Signals 狀態
  private readonly _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  // 計算屬性
  readonly processedData = computed(() =>
    this.data().map(item => ({ ...item, processed: true }))
  );
}
```

## 🔧 常用模式

### 服務中的 Signals
```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly itemCount = computed(() => this.items().length);
  readonly hasItems = computed(() => this.itemCount() > 0);

  async loadItems() {
    this._loading.set(true);
    this._error.set(null);

    try {
      const items = await this.api.getItems();
      this._items.set(items);
    } catch (error) {
      this._error.set(error.message);
    } finally {
      this._loading.set(false);
    }
  }
}
```

### 現代路由守衛
```typescript
// 功能式守衛
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

// 角色守衛
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  return authService.currentUser()?.role === 'admin';
};
```

### Container Queries
```scss
.card {
  container-type: inline-size;
  container-name: card;

  display: flex;
  flex-direction: column;

  @container card (min-width: 400px) {
    flex-direction: row;
  }

  @container card (min-width: 600px) {
    padding: 2rem;
  }
}
```

### 性能優化
```typescript
// OnPush + trackBy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track trackByItemId) {
      <item-component [item]="item" />
    }
  `
})
export class OptimizedListComponent {
  protected trackByItemId = (index: number, item: Item) => item.id;
}

// 虛擬滾動
@Component({
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="50">
      @for (item of items(); track item.id) {
        <div *cdkVirtualFor="let item of items()">
          {{ item.name }}
        </div>
      }
    </cdk-virtual-scroll-viewport>
  `
})
export class VirtualListComponent {}
```

## 📋 檢查清單

### 現代化檢查
- [ ] 使用 `standalone: true`
- [ ] 使用 `ChangeDetectionStrategy.OnPush`
- [ ] 使用 `input()` 和 `output()` 函數
- [ ] 使用 `@if/@for/@switch` 控制流程
- [ ] 使用 `signal/computed/effect`
- [ ] 使用 `@defer` 延遲載入
- [ ] 使用 Container Queries
- [ ] 使用 `NgOptimizedImage`

### 性能檢查
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] 首屏資源 < 1MB
- [ ] 正確的 `trackBy` 函數
- [ ] 虛擬滾動用於長列表

### 代碼品質
- [ ] TypeScript 嚴格模式
- [ ] ESLint 規則通過
- [ ] 正確的檔案標頭註解
- [ ] DDD 架構分層清晰
- [ ] 單元測試覆蓋率 > 80%

---

**快速開始**: 從 `00-angular20-architecture.md` 開始深入學習，使用本指南作為日常開發參考。
