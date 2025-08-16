# Zone.js 與 Angular Signals 整合完整指南

## 🔍 理解整合的核心概念

### Zone.js 的傳統角色
Zone.js 一直是 Angular 變更偵測的核心機制：
- **自動監聽**：DOM 事件、Promise、setTimeout 等異步操作
- **全域補丁**：修補瀏覽器原生 API 來追蹤狀態變化
- **觸發機制**：當任何異步操作完成時自動觸發變更偵測

### Angular Signals 的新方式
Signals 提供了一種更精確的狀態管理方法：
- **精確通知**：只有當 Signal 值真正改變時才觸發更新
- **依賴追蹤**：自動建立值之間的依賴關係
- **按需更新**：只更新實際需要變更的組件部分

## 🚀 整合的三個階段

### 階段一：Zone.js + Signals 混合模式 (Angular 16-17)

**並存運作方式：**
```typescript
@Component({
  template: `
    <!-- 傳統方式：依賴 Zone.js 偵測變更 -->
    <button (click)="updateTraditional()">{{ count }}</button>
    
    <!-- Signal 方式：精確響應式更新 -->
    <button (click)="updateSignal()">{{ signalCount() }}</button>
  `
})
class MixedComponent {
  count = 0;
  signalCount = signal(0);
  
  updateTraditional() {
    this.count++; // Zone.js 偵測到點擊事件，觸發變更偵測
  }
  
  updateSignal() {
    this.signalCount.update(v => v + 1); // Signal 精確通知變更
  }
}
```

**整合優勢：**
- 漸進式採用：可以逐步將現有代碼轉換為 Signals
- 相容性保證：舊代碼繼續正常運作
- 效能提升：Signal 部分獲得更好的效能

### 階段二：Zoneless 實驗模式 (Angular 18-19)

**啟用 Zoneless：**
```typescript
// main.ts
bootstrapApplication(App, {
  providers: [
    provideZonelessChangeDetection(), // 啟用 Zoneless 模式
    // ...其他 providers
  ]
});
```

**相容性要求：**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush, // 推薦使用 OnPush
  template: `
    <div>{{ signalValue() }}</div>
    <button (click)="updateValue()">更新</button>
  `
})
class ZonelessComponent {
  signalValue = signal(0);
  
  updateValue() {
    // ✅ Signal 更新會自動觸發變更偵測
    this.signalValue.update(v => v + 1);
  }
  
  // ❌ 傳統方式需要手動標記
  updateNonSignal() {
    this.someProperty = 'new value';
    this.cdr.markForCheck(); // 必須手動標記
  }
}
```

### 階段三：完全 Zoneless (Angular 20+)

**移除 Zone.js：**
```json
// angular.json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "polyfills": [
              // 移除 "zone.js"
            ]
          }
        }
      }
    }
  }
}
```

```bash
# 完全移除 Zone.js 依賴
npm uninstall zone.js
```

## 💡 完美整合的核心 API

### 1. Signal-based 變更偵測通知

**自動通知機制：**
```typescript
class SmartComponent {
  // ✅ 這些操作會自動觸發變更偵測
  
  // 1. Signal 更新
  counter = signal(0);
  updateCounter() {
    this.counter.update(v => v + 1); // 自動通知
  }
  
  // 2. AsyncPipe 自動標記
  data$ = this.http.get('/api/data'); // AsyncPipe 會自動調用 markForCheck
  
  // 3. 組件輸入更新
  @Input() value: string = '';
  
  // 4. Host/Template 監聽器
  @HostListener('click', ['$event'])
  onClick() {
    this.counter.update(v => v + 1); // 事件回調自動通知
  }
}
```

### 2. 手動變更偵測控制

**精確控制：**
```typescript
class PreciseComponent {
  constructor(private cdr: ChangeDetectorRef) {}
  
  updateNonSignalData() {
    this.someObject.property = 'new value';
    // 手動標記需要檢查
    this.cdr.markForCheck();
  }
  
  // 使用 Signal 包裝傳統狀態
  traditionalData = { value: 'initial' };
  wrappedData = signal(this.traditionalData);
  
  updateWrappedData() {
    this.traditionalData.value = 'updated';
    this.wrappedData.set({...this.traditionalData}); // 觸發響應式更新
  }
}
```

### 3. 服務層整合策略

**響應式服務設計：**
```typescript
@Injectable()
class DataService {
  // Signal-based 狀態管理
  private _data = signal<any[]>([]);
  data = this._data.asReadonly();
  
  private _loading = signal(false);
  loading = this._loading.asReadonly();
  
  async loadData() {
    this._loading.set(true);
    try {
      const result = await this.http.get('/api/data').toPromise();
      this._data.set(result);
    } finally {
      this._loading.set(false);
    }
  }
  
  // 與 Observable 整合
  dataUpdates$ = toObservable(this._data);
}
```

## 🎯 實際專案整合範例

### Tab Navigation 系統整合

```typescript
@Component({
  selector: 'app-tab-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-tab-group [selectedIndex]="selectedTabIndex()" 
                   (selectedTabChange)="onTabChange($event)">
      @for (tab of tabs(); track tab.id) {
        <mat-tab [label]="tab.title">
          <ng-container *ngTemplateOutlet="tab.content"></ng-container>
          @if (tab.closable) {
            <button mat-icon-button (click)="closeTab(tab.id)">
              <mat-icon>close</mat-icon>
            </button>
          }
        </mat-tab>
      }
    </mat-tab-group>
  `
})
class TabNavigationComponent {
  // ✅ Signal-based 狀態管理
  tabs = signal<Tab[]>([]);
  selectedTabIndex = signal(0);
  
  // ✅ 自動響應式計算
  activeTab = computed(() => {
    const index = this.selectedTabIndex();
    const allTabs = this.tabs();
    return allTabs[index] || null;
  });
  
  // ✅ 事件處理自動觸發變更偵測
  onTabChange(event: MatTabChangeEvent) {
    this.selectedTabIndex.set(event.index);
  }
  
  addTab(tab: Tab) {
    this.tabs.update(tabs => [...tabs, tab]);
    this.selectedTabIndex.set(this.tabs().length - 1);
  }
  
  closeTab(tabId: string) {
    this.tabs.update(tabs => tabs.filter(t => t.id !== tabId));
    // 自動調整選中索引
    const newLength = this.tabs().length;
    const currentIndex = this.selectedTabIndex();
    if (currentIndex >= newLength && newLength > 0) {
      this.selectedTabIndex.set(newLength - 1);
    }
  }
}
```

## 🔧 移轉最佳實踐

### 1. 漸進式移轉策略

**階段性採用：**
```typescript
// 第一步：保持 Zone.js，引入 Signals
class MigrationComponent {
  // 新功能使用 Signal
  newFeatureData = signal(null);
  
  // 舊功能保持不變
  oldData: any = null;
  
  // 逐步替換
  migrateOldFeature() {
    this.newFeatureData.set(this.oldData);
    // 逐步移除 oldData 的使用
  }
}
```

### 2. 測試相容性

**Zoneless 測試：**
```typescript
describe('ZonelessComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
      imports: [ComponentUnderTest]
    });
  });
  
  it('should update signals correctly', async () => {
    const fixture = TestBed.createComponent(ComponentUnderTest);
    const component = fixture.componentInstance;
    
    component.signalValue.set(100);
    
    // ✅ 使用 whenStable 而不是 detectChanges
    await fixture.whenStable();
    
    expect(fixture.nativeElement.textContent).toContain('100');
  });
});
```

### 3. SSR 相容性處理

**PendingTasks 服務：**
```typescript
class SSRCompatibleComponent {
  constructor(private pendingTasks: PendingTasks) {}
  
  async loadAsyncData() {
    // 告訴 SSR 等待這個任務完成
    await this.pendingTasks.run(async () => {
      const data = await this.dataService.fetchData();
      this.dataSignal.set(data);
    });
  }
  
  // 或者手動控制
  manualAsyncTask() {
    const taskCleanup = this.pendingTasks.add();
    
    try {
      this.performAsyncOperation().finally(() => {
        taskCleanup(); // 清理任務
      });
    } catch (error) {
      taskCleanup();
      throw error;
    }
  }
}
```

## 📊 整合效能優勢

### 1. 渲染效能提升
- **傳統方式**：Zone.js 全域監聽，過度觸發變更偵測
- **Signal 整合**：精確通知，只更新真正變更的部分
- **效能提升**：30-40% 更快的初始渲染，50% 減少不必要重新渲染

### 2. 包大小優化
```typescript
// 傳統包含 Zone.js
import 'zone.js'; // ~40KB 壓縮後

// Zoneless 移除依賴
// 移除 Zone.js 可節省 ~40KB 包大小
```

### 3. 除錯體驗改善
```typescript
// ✅ 清晰的錯誤堆疊追蹤
signal.update(value => {
  throw new Error('Signal update error');
});

// ❌ Zone.js 複雜的堆疊追蹤
zone.run(() => {
  setTimeout(() => {
    throw new Error('Zone wrapped error');
  });
});
```

## 🌟 未來發展方向

Angular 的整合路線圖：
- **Angular 21+**：完全 Signal-native 架構
- **向後相容**：支援逐步移轉的混合模式
- **生態系統**：第三方套件逐步支援 Zoneless
- **工具鏈**：開發工具和 DevTools 完整支援

Zone.js 與 Angular Signals 的整合代表了 Angular 架構的根本性演進，從全域監聽轉向精確響應式更新，為現代 Web 應用提供了更高效能和更好開發體驗的解決方案。