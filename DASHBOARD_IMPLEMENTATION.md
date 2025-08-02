# Dashboard 實現文檔

## 路由結構

Dashboard 組件已成功添加到路由配置中，採用層次化結構：

```
/dashboard
├── /workbench     - 工作臺 (默認頁面)
├── /monitor       - 監控頁 (包含 Google Maps)
├── /analysis      - 分析頁
└── /contracts     - 合約管理
```

## 組件文件結構

```
src/app/routes/dashboard/
├── workbench/
│   ├── workbench.component.ts        # 工作臺組件
│   ├── workbench.component.html      # 工作臺模板
│   └── workbench.component.less      # 工作臺樣式
├── monitor/
│   ├── monitor.component.ts          # 監控頁組件
│   ├── monitor.component.html        # 監控頁模板
│   └── monitor.component.less        # 監控頁樣式
├── analysis/
│   ├── analysis.component.ts         # 分析頁組件
│   ├── analysis.component.html       # 分析頁模板
│   └── analysis.component.less       # 分析頁樣式
└── contracts/
    ├── contracts.component.ts        # 合約管理組件
    ├── contracts.component.html      # 合約管理模板
    └── contracts.component.less      # 合約管理樣式
```

## 路由配置

在 `src/app/routes/routes.ts` 中配置：

```typescript
{
  path: 'dashboard',
  children: [
    { path: '', redirectTo: 'workbench', pathMatch: 'full' },
    { 
      path: 'workbench', 
      component: WorkbenchComponent,
      canActivate: [tabGuard],
      data: { title: '工作臺' }
    },
    { 
      path: 'monitor', 
      component: MonitorComponent,
      canActivate: [tabGuard],
      data: { title: '監控頁' }
    },
    { 
      path: 'analysis', 
      component: AnalysisComponent,
      canActivate: [tabGuard],
      data: { title: '分析頁' }
    },
    { 
      path: 'contracts', 
      component: ContractsComponent,
      canActivate: [tabGuard],
      data: { title: '合約管理' }
    }
  ]
}
```

## 功能特色

### 工作臺 (Workbench)
- 默認首頁
- 包含各種儀表板小部件
- 響應式設計

### 監控頁 (Monitor)
- **Google Maps 整合**: 使用 Firebase API key
- **實時數據**: 交易統計、銷售目標等
- **圖表展示**: 各種數據可視化組件
- **深色主題**: 與整體設計風格一致

### 分析頁 (Analysis)
- 數據分析功能
- 表格和統計展示
- 支援數字格式化 (DecimalPipe)

### 合約管理 (Contracts)
- 合約相關業務邏輯
- 基礎 CRUD 功能框架

## 導航功能

- **Tab 系統**: 使用 `tabGuard` 實現標籤頁功能
- **權限控制**: 集成 `authSimpleCanActivate` 認證
- **麵包屑導航**: 每個頁面都有對應的標題

## 技術特點

- ✅ **Standalone Components**: 所有組件都是獨立組件
- ✅ **Lazy Loading**: 路由懶加載優化
- ✅ **Type Safety**: 完整的 TypeScript 支援
- ✅ **響應式設計**: 適配各種螢幕尺寸
- ✅ **Firebase 整合**: 直接使用 Firebase 服務

## 使用方式

1. **訪問默認頁面**: `/` 會重定向到 `/dashboard/workbench`
2. **直接訪問**: 可以直接訪問任何子路由，如 `/dashboard/monitor`
3. **標籤頁切換**: 在應用內通過標籤頁系統切換

## 開發注意事項

- 所有組件都使用 `OnPush` 變更檢測策略
- 使用 `inject()` 函數進行依賴注入
- 遵循 Angular 最新的最佳實踐
- 支援 i18n 國際化