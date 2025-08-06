# Angular 20+ 系統效能優化技術清單 (精選版)

## 原有技術 (1-20)

### 1. Immutable Data & RxJS 流式管理
- 使用不可變物件（Immutable）更新狀態，避免不必要變更檢測
- 使用 RxJS `BehaviorSubject` / `ReplaySubject` 管理狀態，配合 `async` pipe
- 用 `select` 和 `memoization` 技巧減少重算

### 2. Smart & Dumb Components 分離
- 容器組件（Smart）處理資料、邏輯和狀態
- 展示組件（Dumb/Presentational）純展示，用 `@Input` 傳資料、用 `OnPush`
- 降低複雜組件的重繪範圍，提高效能和可測試性

### 3. 按需載入（Lazy Loading）與分割模組
- 使用路由的 `loadComponent` 或 `loadChildren` 做功能模組懶載入
- 減少初始下載量與解析時間，提升首屏速度

### 4. ChangeDetectorRef 手動控制變更檢測
- 在特定情況用 `markForCheck()` 或 `detach()` 控制變更檢測範圍
- 例如大型清單或頻繁更新的畫面，避免全元件樹重繪

### 5. 使用 Virtual Scrolling 與 OnPush
- 任務清單可能很大，使用 `cdk-virtual-scroll-viewport` 虛擬滾動，減少 DOM 元素數量
- 搭配 `OnPush` 大幅降低 UI 負擔

### 6. 善用 Angular Signals (Angular 16+ 新功能)
- Signals 提供更簡潔且高效的狀態管理方式
- 減少 Observable 訂閱與手動變更檢測控制

### 7. 使用 Web Workers
- 將複雜計算、資料處理放到 Web Worker 執行，保持主線程流暢

### 8. 避免過度使用雙向繫結 [(ngModel)]
- 使用單向資料流與事件綁定，減少變更檢測複雜度

### 9. 減少不必要的 DOM 操作
- 利用 `trackBy` 在 `*ngFor` 中追蹤元素，避免整列重繪

### 10. 優化圖片與資源
- 工地照片與附件使用懶載入，CDN 或雲端存儲
- 壓縮圖片，避免阻塞渲染

### 11. Standalone Component + Functional Routing
- 元件標記 `standalone: true`，無需 NgModule
- 路由用 `loadComponent` 直接載入元件
- 路由設定更靈活、編譯更快、結構更簡潔

### 12. ChangeDetectionStrategy.OnPush
- 變更檢測策略只在輸入參數改變、事件觸發時檢測
- 配合 immutable 資料流和 RxJS，效能提升顯著

### 13. 混合使用模組與 Standalone 元件
- 兼顧舊專案穩定性和新技術靈活性
- 在大型專案中漸進式轉換架構
- 路由同時支援 `loadChildren` 和 `loadComponent`

### 14. 使用 Angular Signals 的細粒度狀態拆分
- 將全局狀態拆成多個 Signals，避免單一狀態變化觸發大量重繪
- 用 `computed()` 做狀態派生，避免不必要計算

### 15. 預加載策略（Preloading Strategy）
- 配合懶載入設定路由預加載，提升用戶操作流程流暢度
- Angular 有內建的 `PreloadAllModules` 或自訂策略

### 16. 服務端渲染（Angular Universal）
- SSR 可提升首次渲染速度和 SEO 表現
- 配合動態資料預先渲染關鍵內容，減少白屏時間

### 17. AOT 編譯（Ahead-Of-Time）
- 確保專案全程使用 AOT 編譯，避免 JIT 帶來的啟動延遲和體積增大

### 18. 使用 Webpack Module Federation（微前端架構）
- 將大型系統拆成多個獨立子系統，按需載入、獨立部署
- 減少單一 bundle 體積，方便團隊協作與升級

### 19. 避免在模板內大量運算
- 運算複雜邏輯應放在元件層（或 RxJS pipe），模板只負責簡單展示
- 減少變更檢測時的性能負擔

### 20. 使用瀏覽器性能 API 監控
- 實時監控關鍵頁面性能（如 LCP、FID）
- 根據數據持續優化和調整

---

## Angular 20+ 新增技術 (21-33)

### 21. Enhanced Control Flow (@if, @for, @switch)
```typescript
@if (user.isAdmin) {
  <admin-panel />
}
@for (task of tasks; track task.id) {
  <task-item [task]="task" />
}
```

### 22. Defer Block (延遲載入區塊)
```typescript
@defer (when isVisible) {
  <heavy-chart-component />
} @placeholder {
  <loading-spinner />
}
```

### 23. 新版 HttpClient 與 withFetch()
```typescript
provideHttpClient(withFetch())
```

### 24. ng-zorro-antd 虛擬滾動優化
```typescript
<nz-table [nzVirtualScroll]="true" [nzVirtualItemSize]="54">
```

### 25. Angular/Fire 與 Signals 整合
```typescript
readonly tasks = toSignal(
  collectionData(tasksQuery, { idField: 'id' })
);
```

### 26. ng-alain Schema Form
```typescript
<sf [schema]="schema" [ui]="ui" [formData]="formData">
```

### 27. Image Optimization 增強
```html
<img ngSrc="/project-photo.jpg" 
     width="800" height="600"
     priority>
```

### 28. Standalone Schematics
```bash
ng generate component my-component --standalone
ng generate guard auth --functional
```

### 29. Web Vitals 整合
```typescript
import { getCLS, getFID, getLCP } from 'web-vitals';
getCLS(console.log);
```

### 30. Build Cache 啟用
```typescript
// angular.json
"buildCache": true
```

### 31. CSS Container Queries 支援
```css
@container (max-width: 400px) {
  .widget-title { font-size: 1.2rem; }
}
```

### 32. Modern CSS Features
- CSS `clamp()` 函數響應式設計
- CSS 自定義屬性與主題切換

### 33. 按需引入優化
```typescript
// 只引入需要的模組
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';

### 34. angular-gridster2 信號驅動

typescriptreadonly gridItems = signal<GridsterItem[]>([]);
readonly gridOptions = signal<GridsterConfig>({});
```