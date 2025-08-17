# NG-AC DDD 架構構建指南

## 📋 概述

本文檔基於對 `docs/ng-alain` 參考結構的分析，指出當前 DDD 架構需要補充的關鍵文件，以實現完整的企業級應用功能。項目使用 `@angular/fire` > `firebase` > `firestore` 作為數據庫解決方案，並只使用 Angular 官方組件。

## 🔍 架構差異分析

### 當前 DDD 架構狀態
- ✅ 基礎 DDD 層級結構完整
- ✅ 領域層、應用層、基礎設施層等核心層級已建立
- ✅ 基本的實體、服務、倉儲接口已定義
- ✅ **Firebase 配置已完成** - 所有主要 Firebase 服務已配置
- ❌ **Firebase 服務層未實現** - 需要實現具體的服務邏輯
- ❌ **Firebase 倉儲層未實現** - 需要實現數據存取邏輯

### 與 ng-alain 參考的差異
- ❌ 缺少完整的佈局系統
- ❌ 缺少完整的路由配置
- ✅ Firebase 集成配置已完成
- ❌ 缺少完整的頁面組件
- ❌ 缺少認證和授權實現

## 🚀 需要補充的關鍵文件

### 1. **Firebase 配置和服務** 🔄 **部分完成 (30%)**

```typescript
// ✅ 已在 app.config.ts 中完成配置
// 包含以下服務：
// - Firebase App (專案配置)
// - Firebase Auth (身份驗證)
// - Firebase Analytics (分析)
// - Firebase App Check (安全驗證)
// - Firebase Firestore (資料庫)
// - Firebase Functions (雲端函數)
// - Firebase Messaging (推播通知)
// - Firebase Performance (效能監控)
// - Firebase Storage (檔案儲存)
// - Firebase Remote Config (遠端配置)
// - Firebase VertexAI (AI 服務)
```

**需要補充的文件：**
```typescript
// src/app/infrastructure/config/firebase/
├── firebase.module.ts          # Firebase 模組配置
└── index.ts

// src/app/infrastructure/persistence/firebase/
├── firebase.service.ts         # Firebase 基礎服務
├── firestore.service.ts        # Firestore 服務
├── auth.service.ts             # Firebase Auth 服務
└── index.ts
```

### 2. **完整的佈局系統** ❌ **待實現**

```typescript
// src/app/interface/layouts/
├── basic/
│   ├── basic.layout.ts         # 主佈局組件
│   ├── basic.layout.html       # 主佈局模板
│   ├── basic.layout.scss       # 主佈局樣式
│   ├── widgets/                # 佈局小部件
│   │   ├── header-user/
│   │   ├── header-search/
│   │   ├── header-notify/
│   │   └── sidebar-menu/
│   └── index.ts
├── passport/
│   ├── passport.layout.ts      # 認證佈局
│   ├── passport.layout.html
│   ├── passport.layout.scss
│   └── index.ts
└── index.ts
```

### 3. **完整的路由系統** ❌ **待實現**

```typescript
// src/app/interface/routes/
├── routes.ts                   # 主路由配置
├── auth/
│   ├── auth.routes.ts         # 認證路由
│   └── index.ts
├── dashboard/
│   ├── dashboard.routes.ts    # 儀表板路由
│   └── index.ts
├── user/
│   ├── user.routes.ts         # 用戶管理路由
│   └── index.ts
└── index.ts
```

### 4. **完整的頁面組件** ❌ **待實現**

```typescript
// src/app/interface/pages/
├── auth/
│   ├── login/
│   │   ├── login.page.ts
│   │   ├── login.page.html
│   │   ├── login.page.scss
│   │   └── index.ts
│   ├── register/
│   └── index.ts
├── dashboard/
│   ├── dashboard.page.ts
│   ├── dashboard.page.html
│   ├── dashboard.page.scss
│   └── index.ts
├── user/
│   ├── user-list/
│   ├── user-detail/
│   └── index.ts
└── index.ts
```

### 5. **Firebase 倉儲實現** ❌ **待實現**

```typescript
// src/app/infrastructure/persistence/repositories/
├── firebase/
│   ├── firebase-base.repository.ts    # Firebase 基礎倉儲
│   ├── user/
│   │   ├── user.firebase.repository.ts
│   │   └── index.ts
│   ├── organization/
│   └── index.ts
└── index.ts
```

### 6. **認證服務整合** ❌ **待實現**

```typescript
// src/app/security/authentication/services/
├── firebase-auth.service.ts    # Firebase 認證服務
├── auth-guard.service.ts       # 認證守衛服務
└── index.ts

// src/app/security/authentication/guards/
├── auth.guard.ts               # 認證守衛
├── role.guard.ts               # 角色守衛
└── index.ts
```

### 7. **環境配置** ✅ **部分完成**

```typescript
// src/environments/
├── environment.ts              # ✅ 已有
├── environment.prod.ts         # ✅ 已有
└── firebase.config.ts          # ❌ 需要從 app.config.ts 提取
```

## 📦 依賴狀態檢查

### ✅ **已安裝的依賴**
```bash
# Firebase 相關 - 已完成
@angular/fire
firebase

# Angular 核心 - 已完成
@angular/core
@angular/common
@angular/router
@angular/platform-browser
@angular/animations
```

### ❌ **需要安裝的依賴**
```bash
# Angular Material (替代 ng-zorro-antd)
pnpm add @angular/material @angular/cdk

# 圖標
pnpm add @angular/material/icon

# 表單
pnpm add @angular/forms @angular/material/form-field

# HTTP (檢查是否已安裝)
pnpm add @angular/common/http
```

## 🗂️ 當前目錄結構狀態

```
src/app/
├── app.component.ts            # ✅ 已有
├── app.config.ts              # ✅ 已有 (包含完整 Firebase 配置)
├── app.routes.ts              # ✅ 已有
│
├── core/                      # ✅ 已有，需要擴展
│   ├── firebase/              # 🆕 新增 (配置已存在，需要模組化)
│   │   ├── firebase.config.ts # ✅ 配置已在 app.config.ts
│   │   └── index.ts
│   └── index.ts
│
├── interface/                 # ✅ 已有，需要擴展
│   ├── layouts/               # 🆕 新增完整佈局
│   ├── pages/                 # 🆕 新增完整頁面
│   ├── routes/                # 🆕 新增路由配置
│   └── index.ts
│
├── infrastructure/            # ✅ 已有，需要擴展
│   ├── firebase/              # 🆕 新增
│   │   ├── config/            # ✅ 配置已完成
│   │   ├── services/          # 🆕 新增服務層
│   │   └── index.ts
│   └── index.ts
│
└── security/                  # ✅ 已有，需要擴展
    ├── firebase/              # 🆕 新增
    │   ├── auth/              # 🆕 新增認證服務
    │   └── index.ts
    └── index.ts
```

## 🎯 實現優先級 (已調整)

### **高優先級 (必須實現)**
1. **🔄 Firebase 配置和服務** - **部分完成 (30%)**
   - ✅ 建立 Firebase 連接
   - ✅ 配置 Firestore 數據庫
   - ✅ 設置 Firebase Auth
   - 🔄 需要實現服務層和倉儲層

2. **基本佈局組件** - **立即開始**
   - 主佈局 (Basic Layout)
   - 認證佈局 (Passport Layout)
   - 響應式設計

3. **認證頁面** - **高優先級**
   - 登錄頁面
   - 註冊頁面
   - 認證守衛

4. **路由配置** - **高優先級**
   - 主路由配置
   - 懶加載配置
   - 路由守衛

### **中優先級 (重要功能)**
1. **儀表板頁面**
   - 主儀表板
   - 數據展示組件
   - 統計圖表

2. **用戶管理頁面**
   - 用戶列表
   - 用戶詳情
   - 用戶編輯

3. **權限控制**
   - 角色管理
   - 權限分配
   - 訪問控制

### **低優先級 (增強功能)**
1. **高級佈局小部件**
   - 搜索組件
   - 通知組件
   - 用戶菜單

2. **主題切換**
   - 明暗主題
   - 顏色配置
   - 自定義樣式

3. **多語言支持**
   - 國際化配置
   - 語言切換
   - 翻譯文件

## 🔧 實現步驟 (已調整)

### 🔄 **第一步：Firebase 配置** - **部分完成 (30%)**
1. ✅ 安裝 Firebase 依賴
2. ✅ 創建 Firebase 配置文件
3. ✅ 配置環境變量
4. 🔄 建立 Firebase 服務層 (進行中)

### 🔄 **第二步：佈局系統** - **立即開始**
1. 創建基本佈局組件
2. 實現響應式設計
3. 添加導航組件
4. 配置佈局路由

### 🔄 **第三步：認證系統** - **高優先級**
1. 實現 Firebase Auth 服務層
2. 創建認證頁面
3. 配置認證守衛
4. 設置權限控制

### 🔄 **第四步：頁面組件** - **中優先級**
1. 創建儀表板頁面
2. 實現用戶管理
3. 添加業務功能
4. 優化用戶體驗

## 📝 注意事項

### 架構原則
- 嚴格遵循 DDD 分層架構
- 保持依賴方向正確（外層依賴內層）
- 使用接口進行解耦
- 實現依賴注入

### 代碼規範
- 每個模組都有 `index.ts` 統一導出
- 使用 TypeScript 嚴格模式
- 遵循 Angular 最佳實踐
- 實現完整的錯誤處理

### 性能優化
- 使用懶加載路由
- 實現組件 OnPush 策略
- 優化 Firebase 查詢
- 實現適當的緩存策略

### Firebase 配置注意事項
- ✅ Firebase 專案配置已完成 (專案 ID: acc-ng)
- ✅ 所有主要 Firebase 服務已啟用
- ✅ App Check 已配置 reCAPTCHA Enterprise
- 🔄 需要實現服務層和倉儲層
- 🔄 需要從 app.config.ts 提取配置到環境文件

## 🚀 下一步行動 (已調整)

1. **立即開始**：Firebase 服務層和倉儲層實現
2. **本週完成**：認證系統和路由配置
3. **下週完成**：主要頁面組件
4. **持續優化**：性能調優和用戶體驗改進

## 🎉 進度總結

### ✅ **已完成**
- Firebase 基礎配置 (100%)
- Firebase 服務啟用 (100%)
- 應用基礎架構 (100%)

### 🔄 **進行中**
- Firebase 服務層實現 (30%)
- 基礎設施層擴展 (40%)

### ❌ **待開始**
- 佈局系統 (0%)
- 頁面組件 (0%)
- 認證系統 (0%)
- 路由配置 (0%)

---

*本文檔已根據 app.config.ts 實際內容更新，Firebase 配置部分已完成，但服務層和倉儲層仍需實現*
