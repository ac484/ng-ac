# Firebase 認證系統整合說明

## 概述

本項目已成功將 Firebase Authentication 整合到 ng-alain 框架中，取代原本的 auth0 認證系統。通過自定義的 `FirebaseAuthService`，實現了 Firebase 認證與 @delon/auth 系統的無縫銜接。

## 架構設計

### 核心服務
- **FirebaseAuthService** (`src/app/core/services/firebase-auth.service.ts`)
  - 統一管理所有 Firebase 認證操作
  - 與 @delon/auth 的 SocialService 整合
  - 處理 Firebase 用戶信息到 @delon/auth token 的轉換
  - 確保與既有的 token 管理流程無縫銜接

### 認證組件

#### 1. Google 認證 (`src/app/routes/passport/google-auth/`)
- **GoogleAuthComponent**: Google 登入按鈕組件
- 使用 Firebase Google Auth Provider
- 支持彈出視窗登入

#### 2. 匿名登入 (`src/app/routes/passport/anonymous-login/`)
- **AnonymousLoginComponent**: 匿名登入按鈕組件
- 提供快速匿名訪問功能

#### 3. 郵箱認證 (`src/app/routes/passport/email-login/`)
- **EmailLoginComponent**: 郵箱認證主組件（模態框）
- **EmailLoginFormComponent**: 郵箱登入表單
- **EmailRegisterFormComponent**: 郵箱註冊表單
- **EmailResetFormComponent**: 密碼重設表單

## 整合流程

### 1. 認證流程
```
用戶操作 → Firebase Auth → FirebaseAuthService → @delon/auth → 既有 token 管理
```

### 2. 用戶信息轉換
Firebase 用戶信息會被轉換為 @delon/auth 兼容的格式：
```typescript
{
  token: string,           // Firebase ID Token
  name: string,           // 顯示名稱
  email: string,          // 郵箱地址
  id: string,             // Firebase UID
  avatar: string,         // 頭像 URL
  time: number,           // 登入時間
  expired: number,        // Token 過期時間
  firebase: {             // Firebase 特有信息
    uid: string,
    emailVerified: boolean,
    isAnonymous: boolean,
    providerId: string,
    providerData: any[]
  }
}
```

### 3. 路由配置
- 新增 Firebase 認證相關路由
- 保持與原有路由系統的兼容性
- 支持 `/passport/callback/firebase` 回調處理

## 使用方式

### 在登入頁面中使用
```html
<div class="other">
  {{ 'app.login.sign-in-with' | i18n }}
  <!-- Firebase 認證組件 -->
  <app-google-auth class="icon"></app-google-auth>
  <app-email-login class="icon"></app-email-login>
  <app-anonymous-login class="icon"></app-anonymous-login>
</div>
```

### 在組件中使用服務
```typescript
import { FirebaseAuthService } from '@core/services';

export class MyComponent {
  private readonly firebaseAuth = inject(FirebaseAuthService);

  // 檢查登入狀態
  isLoggedIn(): boolean {
    return this.firebaseAuth.isAuthenticated();
  }

  // 登出
  logout(): void {
    this.firebaseAuth.signOut().subscribe();
  }
}
```

## 特色功能

### 1. 統一認證介面
- 所有 Firebase 認證操作都通過 `FirebaseAuthService` 統一管理
- 保持與 @delon/auth 系統的完全兼容性

### 2. 錯誤處理
- 完整的錯誤處理機制
- 用戶友好的錯誤提示信息

### 3. 自動登入流程
- 認證成功後自動處理用戶信息設置
- 自動跳轉到目標頁面
- 清理路由復用信息

### 4. 擴展性
- 易於添加新的認證提供者
- 支持自定義認證流程

## 配置要求

### Firebase 配置
確保 `app.config.ts` 中已正確配置 Firebase：
```typescript
provideFirebaseApp(() => initializeApp({
  projectId: "your-project-id",
  appId: "your-app-id",
  // ... 其他配置
})),
provideAuth(() => getAuth()),
```

### 依賴項
- `@angular/fire`: Firebase SDK
- `@delon/auth`: ng-alain 認證系統
- `@delon/theme`: ng-alain 主題系統

## 安全考量

1. **Token 管理**: 使用 Firebase ID Token，自動處理 token 刷新
2. **用戶驗證**: 支持郵箱驗證功能
3. **匿名轉換**: 匿名用戶可以升級為正式用戶
4. **權限控制**: 與 @delon/auth 的權限系統完全整合

## 維護說明

- 所有 Firebase 相關邏輯都集中在 `FirebaseAuthService` 中
- 組件只負責 UI 交互，業務邏輯統一在服務中處理
- 保持與既有系統的兼容性，便於後續維護和擴展
## 🎨 圖示顯示整
合

### 登入頁面圖示
Firebase 認證組件已成功整合到登入頁面的"其他登錄方式"區域，顯示為圖示：

```html
<div class="other">
  {{ 'app.login.sign-in-with' | i18n }}
  <!-- Firebase 認證圖示 -->
  <app-google-auth></app-google-auth>      <!-- Google 圖示 -->
  <app-email-login></app-email-login>      <!-- 郵箱圖示 -->
  <app-anonymous-login></app-anonymous-login> <!-- 匿名用戶圖示 -->
</div>
```

### 圖示樣式
- **Google 認證**: 使用 `google` 圖示
- **郵箱登入**: 使用 `mail` 圖示（outline 主題）
- **匿名登入**: 使用 `user` 圖示

### 樣式特性
- 繼承登入頁面的 `.icon` 樣式
- 支持 hover 效果（主題色高亮）
- 支持深色主題
- 載入狀態時顯示半透明效果
- 統一的間距和大小（24px）

### 互動功能
- **Tooltip 提示**: 每個圖示都有相應的提示文字
- **點擊響應**: 點擊後觸發相應的認證流程
- **載入狀態**: 認證過程中顯示載入效果
- **錯誤處理**: 認證失敗時顯示友好的錯誤提示

### 響應式設計
圖示在不同螢幕尺寸下都能正確顯示，與原有的登入介面保持一致的視覺風格。