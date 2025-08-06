# 🏷️ 標籤頁系統實現說明

## 📋 概述

本專案已成功實現了一個類似瀏覽器的標籤頁系統，支援多頁面標籤管理、標籤切換、關閉等功能。**採用高內聚低耦合的架構設計**。

## 🏗️ 架構設計

### 高內聚低耦合的實現

```
src/app/shared/
├── domain/                    # 領域層
│   ├── value-objects/
│   │   ├── base.vo.ts        # 基礎值物件
│   │   └── tab-id.vo.ts      # 標籤ID值物件
│   └── entities/
│       └── tab.entity.ts     # 標籤實體
├── services/                  # 應用服務層
│   └── tab.service.ts        # 標籤管理服務
└── components/               # 表現層
    └── tab-bar/
        └── tab-bar.component.ts  # 標籤欄組件（高內聚）
```

## 🎯 核心功能

### 1. 標籤管理
- ✅ 自動創建標籤（基於路由導航）
- ✅ 標籤切換
- ✅ 標籤關閉
- ✅ 標籤狀態持久化（localStorage）
- ✅ 防止重複標籤

### 2. 路由同步
- ✅ URL 與標籤狀態同步
- ✅ 導航時自動創建/激活標籤
- ✅ 標籤切換時自動導航

### 3. 用戶體驗
- ✅ 標籤圖標顯示
- ✅ 標籤標題顯示
- ✅ 可關閉標籤（除首頁外）
- ✅ 響應式設計

## 🔧 技術實現

### 1. TabService 核心服務

```typescript
@Injectable({
  providedIn: 'root'
})
export class TabService {
  // 標籤數據流
  tabs$: Observable<TabData[]>
  activeTab$: Observable<TabData | null>
  
  // 核心方法
  createTab(title: string, url: string, icon?: string, closable?: boolean)
  activateTab(tabId: string)
  closeTab(tabId: string)
}
```

### 2. TabBarComponent 高內聚設計

**所有標籤頁邏輯都集中在 TabBarComponent 中**：

```typescript
@Component({
  selector: 'app-tab-bar',
  template: `...`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabBarComponent implements OnInit, OnDestroy {
  // 自包含的標籤邏輯
  private subscribeToTabs(): void { /* ... */ }
  private subscribeToRouter(): void { /* ... */ }
  private handleRouteChange(): void { /* ... */ }
  
  onTabChange(index: number): void { /* ... */ }
  onTabClose(tab: TabData): void { /* ... */ }
}
```

### 3. LayoutBasicComponent 簡潔整合

佈局組件只負責結構，不包含標籤邏輯：

```typescript
@Component({
  template: `
    <layout-default>
      <!-- 側邊欄 -->
      <!-- 標籤欄（自包含） -->
      <app-tab-bar></app-tab-bar>
      <!-- 內容區域 -->
      <router-outlet />
    </layout-default>
  `
})
export class LayoutBasicComponent {
  // 只包含佈局相關邏輯
  // 不包含任何標籤頁邏輯
}
```

### 4. 路由映射

系統自動將路由映射為標籤：

```typescript
const routeMap = {
  '/dashboard': { title: '儀表板', icon: 'dashboard', closable: false },
  '/dashboard/contract-management': { title: '合約管理', icon: 'file-text', closable: true },
  '/dashboard/task-management': { title: '任務管理', icon: 'check-square', closable: true },
  // ... 更多路由
};
```

## 🎨 視覺設計

### 標籤欄樣式
- 使用 ng-zorro-antd 的 Tabs 組件
- 卡片式標籤設計
- 活躍標籤高亮顯示
- 關閉按鈕懸停效果

### 響應式佈局
- 標籤欄固定在頂部
- 內容區域自適應高度
- 支援標籤標題截斷

## 📱 使用方法

### 1. 自動標籤創建
當用戶導航到新頁面時，系統會自動創建對應的標籤：

```typescript
// 導航到合約管理頁面
this.router.navigate(['/dashboard/contract-management']);
// 系統自動創建標籤：合約管理
```

### 2. 標籤切換
點擊標籤即可切換到對應頁面：

```typescript
// TabBarComponent 內部處理
onTabChange(index: number) {
  const tab = this.tabs[index];
  this.tabService.activateTab(tab.id);
  this.router.navigateByUrl(tab.url);
}
```

### 3. 標籤關閉
點擊標籤的關閉按鈕即可關閉標籤：

```typescript
// TabBarComponent 內部處理
onTabClose(tab: TabData) {
  this.tabService.closeTab(tab.id);
  // 如果關閉的是活躍標籤，自動切換到下一個標籤
}
```

## 🔄 狀態管理

### 持久化存儲
標籤狀態使用 localStorage 持久化：

```typescript
private saveTabs(tabs: TabData[]): void {
  localStorage.setItem('ng_ac_tabs', JSON.stringify(tabs));
}

private loadTabs(): void {
  const data = localStorage.getItem('ng_ac_tabs');
  if (data) {
    const tabs = JSON.parse(data);
    this.tabsSubject.next(tabs);
  }
}
```

### 響應式更新
使用 RxJS BehaviorSubject 實現響應式狀態管理：

```typescript
private tabsSubject = new BehaviorSubject<TabData[]>([]);
private activeTabSubject = new BehaviorSubject<TabData | null>(null);
```

## 🚀 性能優化

### 1. OnPush 變更檢測
所有標籤相關組件都使用 OnPush 策略：

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 2. TrackBy 函數
標籤列表使用 trackBy 函數優化渲染：

```typescript
trackByTabId(index: number, tab: TabData): string {
  return tab.id;
}
```

### 3. 懶載入
標籤內容使用 Angular 路由的懶載入機制。

## 🧪 測試建議

### 1. 單元測試
- TabService 的方法測試
- TabBarComponent 的交互測試（自包含測試）
- LayoutBasicComponent 的佈局測試

### 2. 整合測試
- 路由導航與標籤創建的整合
- 標籤狀態持久化的測試
- 瀏覽器刷新後的狀態恢復

## 📈 擴展功能

### 1. 標籤拖拽排序
可以添加拖拽功能來重新排序標籤。

### 2. 標籤右鍵菜單
添加右鍵菜單支援更多操作（關閉其他、關閉右側等）。

### 3. 標籤組
支援標籤分組功能。

### 4. 標籤搜索
當標籤過多時，添加搜索功能。

## 🎯 符合 DDD 架構

### 1. 領域層 (Domain)
- `Tab` 實體：封裝標籤的業務邏輯
- `TabId` 值物件：標籤的唯一標識
- 業務規則：標籤創建、激活、關閉的規則

### 2. 應用層 (Application)
- `TabService`：協調標籤的業務操作
- 狀態管理：標籤的增刪改查

### 3. 表現層 (Presentation)
- `TabBarComponent`：**高內聚的標籤 UI 和邏輯**
- `LayoutBasicComponent`：**只負責佈局，不包含標籤邏輯**

### 4. 基礎設施層 (Infrastructure)
- localStorage：標籤狀態的持久化
- 路由系統：標籤與 URL 的同步

## ✅ 高內聚低耦合的實現成果

### 🎯 高內聚
1. **TabBarComponent 自包含**：所有標籤頁邏輯都集中在一個組件中
2. **單一職責**：每個組件都有明確的職責範圍
3. **封裝性**：標籤邏輯對外部組件透明

### 🔗 低耦合
1. **LayoutBasicComponent 簡潔**：只負責佈局，不包含標籤邏輯
2. **組件獨立**：標籤組件可以獨立使用和測試
3. **依賴注入**：通過服務進行組件間通信

### 🚀 架構優勢
1. **可維護性**：標籤邏輯集中，易於維護和擴展
2. **可測試性**：組件職責清晰，便於單元測試
3. **可重用性**：TabBarComponent 可以在其他佈局中重用
4. **可擴展性**：新增標籤功能只需修改 TabBarComponent

這個標籤頁系統為整個應用程式提供了強大的多頁面管理能力，同時嚴格遵循高內聚低耦合的設計原則。
