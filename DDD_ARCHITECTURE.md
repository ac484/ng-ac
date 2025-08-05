# NG-AC DDD 架構文檔

## 🏗️ **架構概述**

NG-AC 採用 Domain-Driven Design (DDD) 架構，結合 Angular 19 和 Firebase，提供完整的企業級應用解決方案。

## 📁 **目錄結構**

```
src/app/
├── application/          # 應用層 (Application Layer)
│   ├── auth/            # 認證用例
│   ├── startup/         # 啟動服務
│   ├── user/            # 用戶用例
│   └── common/          # 通用應用服務
├── domain/              # 領域層 (Domain Layer)
│   ├── common/          # 通用實體
│   ├── errors/          # 領域錯誤
│   └── user/            # 用戶領域
├── infrastructure/      # 基礎設施層 (Infrastructure Layer)
│   ├── auth/            # 認證基礎設施
│   ├── user/            # 用戶基礎設施
│   └── interceptors/    # HTTP 攔截器
└── presentation/        # 表現層 (Presentation Layer)
    ├── dashboard/       # 儀表板
    └── passport/        # 認證頁面
```

## 🔧 **核心組件**

### **1. 啟動服務 (StartupService)**

**位置**: `application/startup/startup.application.service.ts`

**功能**:
- ✅ 設置用戶信息
- ✅ 設置 ACL 權限
- ✅ 加載菜單數據
- ✅ 設置應用信息
- ✅ 解決動畫卡住問題

**關鍵修復**:
```typescript
// 移除延遲，快速完成初始化
load(): Observable<void> {
  return this.initializeApp()
    .pipe(
      tap(() => console.log('Startup service completed')),
      catchError(error => {
        console.error('Startup service error:', error);
        return throwError(() => error);
      })
    );
}
```

### **2. 應用組件 (AppComponent)**

**位置**: `app.component.ts`

**關鍵修復**:
```typescript
// 使用 stepPreloader 管理加載狀態
private donePreloader = stepPreloader();

ngOnInit(): void {
  // 監聽路由事件，完成預加載器
  this.router.events.subscribe(ev => {
    if (ev instanceof NavigationEnd) {
      this.donePreloader(); // 關鍵：完成預加載器
      this.titleSrv.setTitle();
      this.modalSrv.closeAll();
    }
  });
}
```

### **3. 路由配置**

**位置**: `app.config.ts`

**關鍵修復**:
```typescript
const routerFeatures: RouterFeatures[] = [
  withComponentInputBinding(),
  withViewTransitions(), // 恢復視圖轉換
  withInMemoryScrolling({ scrollPositionRestoration: 'top' })
];
```

## 🎯 **解決的問題**

### **動畫卡住問題**

**原因分析**:
1. ❌ 缺少 `stepPreloader()` 完成機制
2. ❌ 啟動服務有延遲 (`delay(500)`)
3. ❌ 移除了 `withViewTransitions()`

**解決方案**:
1. ✅ 添加 `stepPreloader()` 完成機制
2. ✅ 移除啟動服務延遲
3. ✅ 恢復 `withViewTransitions()`

### **DDD 架構完整性**

**已實現功能**:
- ✅ **領域層**: 用戶實體、錯誤處理
- ✅ **應用層**: 啟動服務、認證用例
- ✅ **基礎設施層**: Firebase 集成、HTTP 攔截器
- ✅ **表現層**: 組件、路由配置

## 🚀 **技術棧**

- **框架**: Angular 19
- **UI 庫**: ng-zorro-antd
- **認證**: Firebase Auth
- **數據庫**: Firebase Firestore
- **架構**: Domain-Driven Design (DDD)

## 📋 **使用指南**

### **啟動應用**

```bash
# 安裝依賴
npm install

# 啟動開發服務器
npm start
```

### **訪問路徑**

- **登錄頁面**: `/#/passport/login`
- **儀表板**: `/#/dashboard`
- **註冊頁面**: `/#/passport/register`

## 🔍 **調試信息**

啟動服務會在控制台輸出以下信息：
- `Starting application initialization...`
- `Initializing unauthenticated app` 或 `Initializing authenticated app`
- `Startup service completed`

## 🎨 **UI 特性**

- **加載動畫**: 漸變背景的加載指示器
- **響應式設計**: 適配不同屏幕尺寸
- **主題支持**: 支持明暗主題切換
- **國際化**: 支持多語言

## 🔐 **安全特性**

- **Firebase 認證**: 支持 Google、郵箱、匿名登入
- **ACL 權限控制**: 基於角色的訪問控制
- **路由守衛**: 保護需要認證的路由
- **錯誤處理**: 全局錯誤攔截器

## 📈 **性能優化**

- **懶加載**: 路由組件按需加載
- **預加載器**: 使用 `stepPreloader` 管理加載狀態
- **視圖轉換**: 平滑的頁面切換動畫
- **緩存策略**: HTTP 攔截器優化

## 🔄 **未來擴展**

### **計劃功能**
- [ ] 用戶管理界面
- [ ] 角色權限管理
- [ ] 數據統計儀表板
- [ ] 實時通知系統
- [ ] 文件上傳功能

### **架構改進**
- [ ] 事件溯源 (Event Sourcing)
- [ ] CQRS 模式
- [ ] 微服務架構
- [ ] 容器化部署

---

**版本**: 1.0.0  
**更新日期**: 2024年12月  
**維護者**: NG-AC Team 