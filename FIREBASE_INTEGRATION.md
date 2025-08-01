# Firebase 整合指南

## 概述

本專案已成功整合 Firebase 和 @angular/fire，提供完整的 Firebase 服務支援，包括認證、資料庫、儲存、分析等功能。

## 已整合的 Firebase 服務

### 1. Firebase Authentication
- 電子郵件/密碼認證
- 密碼重置
- 用戶狀態管理
- 自動登入狀態追蹤

### 2. Firestore Database
- 文檔 CRUD 操作
- 複雜查詢支援
- 即時資料同步
- 離線支援

### 3. Firebase Storage
- 檔案上傳/下載
- 檔案管理
- 安全規則支援

### 4. Firebase Functions
- 雲端函數調用
- 後端邏輯處理

### 5. Firebase Analytics
- 用戶行為追蹤
- 自定義事件記錄
- 性能監控

### 6. Firebase Performance
- 應用程式性能監控
- 自定義追蹤

### 7. Firebase Remote Config
- 遠端配置管理
- 動態功能開關

### 8. Firebase Messaging
- 推送通知
- 前台消息處理

## 配置檔案

### 環境配置
- `src/environments/environment.ts` - 開發環境配置
- `src/environments/environment.prod.ts` - 生產環境配置

### 主要配置檔案
- `src/app/app.config.ts` - Firebase 服務提供者配置
- `src/app/core/services/common/firebase.service.ts` - Firebase 服務封裝

## 使用方法

### 1. 注入 Firebase 服務

```typescript
import { FirebaseService } from '@core/services/common/firebase.service';

constructor(private firebaseService: FirebaseService) {}
```

### 2. 認證操作

```typescript
// 登入
await this.firebaseService.signInWithEmail(email, password);

// 註冊
await this.firebaseService.signUpWithEmail(email, password, displayName);

// 登出
await this.firebaseService.signOut();

// 密碼重置
await this.firebaseService.sendPasswordResetEmail(email);

// 檢查認證狀態
const isAuthenticated = this.firebaseService.isAuthenticated();
```

### 3. Firestore 操作

```typescript
// 創建文檔
const docId = await this.firebaseService.createDocument('users', userData);

// 獲取文檔
const user = await this.firebaseService.getDocument<User>('users', docId);

// 更新文檔
await this.firebaseService.updateDocument('users', docId, updateData);

// 刪除文檔
await this.firebaseService.deleteDocument('users', docId);

// 查詢文檔
const users = await this.firebaseService.queryDocuments<User>('users', [
  { field: 'status', operator: '==', value: 'active' }
], 'createdAt', 'desc', 10);
```

### 4. Storage 操作

```typescript
// 上傳檔案
const downloadURL = await this.firebaseService.uploadFile(file, 'uploads/image.jpg');

// 獲取下載 URL
const url = await this.firebaseService.getDownloadURL('uploads/image.jpg');

// 刪除檔案
await this.firebaseService.deleteFile('uploads/image.jpg');
```

### 5. Functions 操作

```typescript
// 調用雲端函數
const result = await this.firebaseService.callFunction('sendEmail', { to: 'user@example.com' });
```

### 6. Analytics 操作

```typescript
// 記錄自定義事件
this.firebaseService.logCustomEvent('button_click', { button_name: 'submit' });
```

### 7. Performance 操作

```typescript
// 開始性能追蹤
const trace = this.firebaseService.startTrace('user_action');
// ... 執行操作
trace.stop();
```

### 8. Remote Config 操作

```typescript
// 獲取遠端配置值
const featureFlag = this.firebaseService.getRemoteConfigValue('feature_enabled', false);
```

## 路由守衛

使用 `FirebaseAuthGuard` 來保護需要認證的路由：

```typescript
import { FirebaseAuthGuard } from '@core/services/guard/firebase-auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [FirebaseAuthGuard]
  }
];
```

## 用戶狀態監聽

```typescript
// 訂閱用戶狀態變化
this.firebaseService.currentUser$.subscribe(user => {
  if (user) {
    console.log('用戶已登入:', user.email);
  } else {
    console.log('用戶已登出');
  }
});
```

## 錯誤處理

所有 Firebase 操作都包含完整的錯誤處理：

```typescript
try {
  await this.firebaseService.signInWithEmail(email, password);
  // 成功處理
} catch (error) {
  // 錯誤處理
  console.error('操作失敗:', error);
  this.message.error(this.getErrorMessage(error.code));
}
```

## 安全注意事項

1. **API 金鑰保護**: 確保 Firebase 配置中的 API 金鑰不會暴露在客戶端程式碼中
2. **安全規則**: 在 Firebase Console 中設定適當的安全規則
3. **用戶權限**: 實作適當的用戶權限檢查
4. **資料驗證**: 在客戶端和伺服器端都進行資料驗證

## 開發建議

1. **環境分離**: 使用不同的 Firebase 專案進行開發和生產
2. **錯誤監控**: 整合 Firebase Crashlytics 進行錯誤監控
3. **性能優化**: 使用 Firebase Performance 監控應用程式性能
4. **用戶體驗**: 實作適當的載入狀態和錯誤提示

## 故障排除

### 常見問題

1. **模組找不到**: 確保已安裝 `@angular/fire` 和 `firebase` 套件
2. **認證失敗**: 檢查 Firebase Console 中的認證設定
3. **權限錯誤**: 檢查 Firestore 和 Storage 的安全規則
4. **網路問題**: 確保網路連接正常

### 除錯技巧

1. 啟用 Firebase 除錯模式
2. 檢查瀏覽器控制台的錯誤訊息
3. 使用 Firebase Console 監控服務狀態
4. 檢查網路請求的狀態

## 更新日誌

- **v1.0.0**: 初始 Firebase 整合
- 支援所有主要 Firebase 服務
- 完整的錯誤處理和用戶體驗
- 模組化的服務架構 