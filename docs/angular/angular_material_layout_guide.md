# Angular Material 基礎布局使用指南

## 概述

本指南介紹如何使用 NG-AC 項目中的 Angular Material 基礎布局組件。這些組件採用極簡主義設計，提供最精簡的布局功能。

## 已實現的基礎布局

### 1. 基礎布局 (Basic Layout)

**文件位置**: `src/app/interface/layouts/basic/basic.layout.ts`

**功能特點**:
- 使用 `mat-sidenav-container` 實現側邊導航
- 包含頂部工具欄和側邊菜單
- 響應式設計，支持移動端和桌面端
- 極簡主義設計，避免過度複雜化

**使用方法**:
```typescript
import { BasicLayoutComponent } from '@/interface/layouts/basic';

// 在路由中使用
{
  path: 'app',
  component: BasicLayoutComponent,
  children: [
    // 子路由
  ]
}
```

### 2. 認證布局 (Passport Layout)

**文件位置**: `src/app/interface/layouts/passport/passport.layout.ts`

**功能特點**:
- 使用 `mat-card` 包裝認證內容
- 居中對齊，適合登錄/註冊頁面
- 漸變背景，視覺效果優雅
- 極簡主義設計

**使用方法**:
```typescript
import { PassportLayoutComponent } from '@/interface/layouts/passport';

// 在認證路由中使用
{
  path: 'auth',
  component: PassportLayoutComponent,
  children: [
    { path: 'login', component: LoginPage },
    { path: 'register', component: RegisterPage }
  ]
}
```

## 新增的基礎組件

### 1. Material 布局組件

**文件位置**: `src/app/shared/components/material/material-layout.component.ts`

**包含組件**:
- `MaterialLayoutComponent`: 基礎布局容器
- `ContainerComponent`: 響應式容器組件
- `RowComponent`: 行布局組件
- `ColComponent`: 列布局組件

**使用方法**:
```typescript
import { ContainerComponent, RowComponent, ColComponent } from '@/shared/components/material';

// 在模板中使用
<app-container>
  <app-row>
    <app-col [size]="6">
      <h2>左側內容</h2>
    </app-col>
    <app-col [size]="6">
      <h2>右側內容</h2>
    </app-col>
  </app-row>
</app-container>
```

### 2. Material UI 組件

**文件位置**: `src/app/shared/components/material/material-ui.component.ts`

**包含組件**:
- `MaterialButtonComponent`: 自定義按鈕組件
- `MaterialCardComponent`: 自定義卡片組件
- `MaterialInputComponent`: 自定義輸入框組件
- `MaterialChipComponent`: 自定義標籤組件

**使用方法**:
```typescript
import { MaterialButtonComponent, MaterialCardComponent } from '@/shared/components/material';

// 在模板中使用
<app-material-button
  label="點擊我"
  icon="favorite"
  color="primary"
  (onClick)="handleClick($event)">
</app-material-button>

<app-material-card
  title="標題"
  subtitle="副標題"
  [elevated]="true">
  <p>卡片內容</p>
</app-material-card>
```

## 新增的基礎服務

### 1. Material 布局服務

**文件位置**: `src/app/shared/services/material/material-layout.service.ts`

**功能特點**:
- 使用 Angular CDK 的 `BreakpointObserver`
- 提供響應式布局斷點信息
- 支持手機、平板、桌面設備檢測
- 支持橫豎屏模式檢測

**使用方法**:
```typescript
import { MaterialLayoutService } from '@/shared/services/material';

constructor(private layoutService: MaterialLayoutService) {}

ngOnInit() {
  // 獲取當前布局斷點
  this.layoutService.getLayoutBreakpoint().subscribe(breakpoint => {
    if (breakpoint.isHandset) {
      // 手機端邏輯
    } else if (breakpoint.isTablet) {
      // 平板端邏輯
    } else if (breakpoint.isWeb) {
      // 桌面端邏輯
    }
  });

  // 檢查是否為手機設備
  this.layoutService.isHandset().subscribe(isHandset => {
    if (isHandset) {
      // 手機端特定邏輯
    }
  });
}
```

### 2. Material 主題服務

**文件位置**: `src/app/shared/services/material/material-theme.service.ts`

**功能特點**:
- 支持亮色/暗色主題切換
- 自定義主色調和強調色調
- 主題配置持久化到 localStorage
- 自動應用主題到 DOM

**使用方法**:
```typescript
import { MaterialThemeService } from '@/shared/services/material';

constructor(private themeService: MaterialThemeService) {}

// 切換主題
toggleTheme() {
  this.themeService.toggleTheme();
}

// 設置特定主題模式
setDarkTheme() {
  this.themeService.setThemeMode('dark');
}

// 設置自定義顏色
setCustomColors() {
  this.themeService.setPrimaryColor('#ff5722');
  this.themeService.setAccentColor('#4caf50');
}
```

## 響應式設計

### 斷點系統

使用 Angular CDK 的預定義斷點：

```typescript
import { Breakpoints } from '@angular/cdk/layout';

// 預定義斷點
Breakpoints.Handset        // 手機設備
Breakpoints.Tablet         // 平板設備
Breakpoints.Web            // 桌面設備
Breakpoints.HandsetPortrait  // 手機豎屏
Breakpoints.HandsetLandscape // 手機橫屏
Breakpoints.TabletPortrait   // 平板豎屏
Breakpoints.TabletLandscape  // 平板橫屏
Breakpoints.WebPortrait      // 桌面豎屏
Breakpoints.WebLandscape     // 桌面橫屏
```

### 響應式布局示例

```typescript
@Component({
  template: `
    <div class="responsive-layout">
      <!-- 桌面端顯示 -->
      <div class="desktop-only" *ngIf="!(isHandset$ | async)">
        <app-desktop-layout></app-desktop-layout>
      </div>

      <!-- 手機端顯示 -->
      <div class="mobile-only" *ngIf="isHandset$ | async">
        <app-mobile-layout></app-mobile-layout>
      </div>
    </div>
  `
})
export class ResponsiveComponent {
  isHandset$ = this.layoutService.isHandset();

  constructor(private layoutService: MaterialLayoutService) {}
}
```

## 最佳實踐

### 1. 組件設計原則

- **極簡主義**: 避免過度複雜化，只實現必要的功能
- **單一職責**: 每個組件只負責一個明確的功能
- **可重用性**: 設計通用的組件，支持多種使用場景
- **類型安全**: 使用 TypeScript 類型定義，確保代碼質量

### 2. 布局設計原則

- **響應式優先**: 優先考慮移動端體驗
- **一致性**: 保持整體設計風格的一致性
- **可訪問性**: 遵循 Material Design 的可訪問性指南
- **性能優化**: 避免不必要的 DOM 操作和樣式計算

### 3. 服務設計原則

- **依賴注入**: 使用 Angular 的依賴注入系統
- **可測試性**: 設計易於測試的服務接口
- **錯誤處理**: 提供完善的錯誤處理機制
- **日誌記錄**: 記錄關鍵操作和錯誤信息

## 擴展指南

### 添加新的布局組件

1. 在 `src/app/interface/layouts/` 下創建新的布局目錄
2. 實現布局組件，遵循現有的設計模式
3. 在 `index.ts` 中導出新組件
4. 更新路由配置

### 添加新的 Material 組件

1. 在 `src/app/shared/components/material/` 下創建新組件
2. 實現組件邏輯，遵循極簡主義原則
3. 在 `index.ts` 中導出新組件
4. 更新相關文檔

### 添加新的 Material 服務

1. 在 `src/app/shared/services/material/` 下創建新服務
2. 實現服務邏輯，遵循依賴注入原則
3. 在 `index.ts` 中導出新服務
4. 更新相關文檔

## 總結

NG-AC 項目的 Angular Material 基礎布局系統提供了：

✅ **完整的布局組件**: 基礎布局、認證布局、響應式組件
✅ **豐富的 UI 組件**: 按鈕、卡片、輸入框、標籤等
✅ **強大的布局服務**: 響應式斷點檢測、主題管理
✅ **極簡主義設計**: 避免過度複雜化，專注核心功能
✅ **完整的類型支持**: TypeScript 類型定義，確保代碼質量

這個系統為開發者提供了構建現代化 Angular 應用所需的基礎工具，同時保持了代碼的簡潔性和可維護性。

