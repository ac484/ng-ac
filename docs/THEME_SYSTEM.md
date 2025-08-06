# 主題切換系統文檔

## 概述

本項目實現了一個基於 @delon/theme 的動態主題切換系統，支持多種主題顏色方案，並提供了完整的用戶界面組件。

## 架構設計

### 核心組件

1. **ThemeService** (`src/app/shared/infrastructure/services/theme.service.ts`)
   - 主題管理的核心服務
   - 提供主題切換、狀態管理功能
   - 使用 RxJS BehaviorSubject 實現響應式狀態管理

2. **ThemeSwitcherComponent** (`src/app/shared/presentation/components/theme-switcher/`)
   - 主題切換的用戶界面組件
   - 下拉菜單形式的主題選擇器
   - 支持主題預覽和描述

3. **主題樣式文件** (`src/styles/themes.less`)
   - 定義所有主題的 CSS 變量
   - 支持深色主題特殊處理
   - 組件級別的主題適配

## 功能特性

### 支持的主題

1. **預設主題 (藍色)**
   - 主色調: #1890ff
   - 適合一般應用場景

2. **深色主題**
   - 主色調: #177ddc
   - 適合夜間使用，減少眼疲勞

3. **綠色主題**
   - 主色調: #52c41a
   - 清新自然的視覺效果

4. **紫色主題**
   - 主色調: #722ed1
   - 高貴典雅的設計風格

5. **橙色主題**
   - 主色調: #fa8c16
   - 溫暖活潑的視覺體驗

### 核心功能

- ✅ 動態主題切換
- ✅ 主題狀態持久化
- ✅ 響應式狀態管理
- ✅ 組件級別主題適配
- ✅ 深色主題特殊處理
- ✅ 平滑切換動畫
- ✅ 用戶友好的界面

## 使用方法

### 1. 基本使用

```typescript
import { ThemeService } from './shared/infrastructure/services/theme.service';

export class MyComponent {
  constructor(private themeService: ThemeService) {}

  // 切換到指定主題
  switchTheme(themeKey: string): void {
    this.themeService.setTheme(themeKey);
  }

  // 獲取當前主題
  getCurrentTheme(): ThemeConfig {
    return this.themeService.getCurrentTheme();
  }

  // 訂閱主題變化
  ngOnInit(): void {
    this.themeService.currentTheme$.subscribe(theme => {
      console.log('當前主題:', theme);
    });
  }
}
```

### 2. 在模板中使用主題切換器

```html
<app-theme-switcher></app-theme-switcher>
```

### 3. 自定義主題

```typescript
// 在 ThemeService 中添加新主題
private readonly availableThemes: ThemeConfig[] = [
  // ... 現有主題
  {
    name: '自定義主題',
    key: 'custom',
    primaryColor: '#your-color',
    description: '自定義主題描述'
  }
];
```

## 技術實現

### CSS 變量系統

使用 CSS 自定義屬性實現主題切換：

```less
.theme-default {
  --primary-color: #1890ff;
  --primary-color-hover: #40a9ff;
  --primary-color-active: #096dd9;
  // ... 更多變量
}
```

### 組件適配

所有 ng-zorro-antd 組件都通過 CSS 變量適配主題：

```less
.ant-btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  
  &:hover {
    background-color: var(--primary-color-hover);
  }
}
```

### 狀態管理

使用 RxJS BehaviorSubject 實現響應式狀態管理：

```typescript
private readonly currentThemeSubject = new BehaviorSubject<ThemeConfig>(
  this.getThemeByKey(this.getCurrentThemeKey())
);

public readonly currentTheme$ = this.currentThemeSubject.asObservable();
```

## 文件結構

```
src/
├── app/
│   └── shared/
│       ├── infrastructure/
│       │   └── services/
│       │       └── theme.service.ts          # 主題服務
│       └── presentation/
│           └── components/
│               └── theme-switcher/           # 主題切換器組件
│                   └── theme-switcher.component.ts
├── styles/
│   └── themes.less                           # 主題樣式定義
└── domain/
    └── dashboard/
        └── presentation/
            └── pages/
                └── theme-demo/               # 主題演示頁面
                    └── theme-demo.component.ts
```

## 最佳實踐

### 1. 極簡主義設計

- 避免過度工程化
- 充分利用 ng-zorro-antd 組件
- 專注核心邏輯和清晰邊界

### 2. 性能優化

- 使用 CSS 變量而非 JavaScript 動態修改
- 主題切換時只更新必要的 DOM 元素
- 利用瀏覽器原生優化

### 3. 可維護性

- 清晰的組件邊界
- 統一的命名規範
- 完整的文檔說明

### 4. 擴展性

- 模塊化的主題定義
- 易於添加新主題
- 支持自定義主題配置

## 開發指南

### 添加新主題

1. 在 `ThemeService` 中添加主題配置
2. 在 `themes.less` 中定義對應的 CSS 變量
3. 測試主題切換功能
4. 更新文檔

### 自定義組件主題

```less
.my-custom-component {
  background-color: var(--primary-color);
  color: var(--primary-text-color);
  
  &:hover {
    background-color: var(--primary-color-hover);
  }
}
```

### 深色主題適配

```less
.theme-dark {
  .my-component {
    background-color: #1f1f1f;
    color: rgba(255, 255, 255, 0.85);
  }
}
```

## 故障排除

### 常見問題

1. **主題切換不生效**
   - 檢查 CSS 變量是否正確定義
   - 確認組件使用了正確的 CSS 變量
   - 檢查瀏覽器開發者工具

2. **樣式衝突**
   - 使用更具體的 CSS 選擇器
   - 檢查 CSS 優先級
   - 確保主題類正確應用

3. **性能問題**
   - 避免在主題切換時進行大量 DOM 操作
   - 使用 CSS 變量而非 JavaScript 修改樣式
   - 考慮使用 CSS-in-JS 解決方案

## 未來規劃

- [ ] 支持更多主題顏色
- [ ] 添加主題預覽功能
- [ ] 支持用戶自定義主題
- [ ] 添加主題導入/導出功能
- [ ] 支持系統主題自動切換
- [ ] 添加主題切換動畫效果

## 相關文檔

- [@delon/theme 官方文檔](https://ng-alain.com/theme)
- [ng-zorro-antd 主題定制](https://ng.ant.design/docs/customize-theme/en)
- [CSS 自定義屬性](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
