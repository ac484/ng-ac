# 🔐 值物件認證系統

## 📋 概述

這是一個基於 DDD (Domain-Driven Design) 的完整值物件認證系統，整合了 @delon/auth 和 Firebase Auth。

## 🏗️ 架構

### **目錄結構**
```
src/app/domain/value-objects/
├── authentication/          # 認證相關值物件
│   ├── email.value-object.ts
│   ├── password.value-object.ts
│   ├── display-name.value-object.ts
│   ├── photo-url.value-object.ts
│   ├── firebase-uid.value-object.ts
│   ├── user-id.value-object.ts
│   ├── auth-provider.value-object.ts
│   ├── auth-method.value-object.ts
│   ├── session-id.value-object.ts
│   └── firebase-auth-error.value-object.ts
├── token/                   # Token 相關值物件
│   ├── jwt-token.value-object.ts
│   ├── refresh-token.value-object.ts
│   ├── token-expires-at.value-object.ts
│   └── token-type.value-object.ts
├── authorization/           # 授權相關值物件
│   ├── role.value-object.ts
│   ├── role-set.value-object.ts
│   ├── permission.value-object.ts
│   ├── permission-set.value-object.ts
│   └── permission-group.value-object.ts
├── device/                  # 裝置相關值物件
│   ├── device-info.value-object.ts
│   ├── user-agent.value-object.ts
│   ├── geo-location.value-object.ts
│   ├── login-context.value-object.ts
│   └── login-source.value-object.ts
├── status/                  # 狀態相關值物件
│   ├── user-status.value-object.ts
│   ├── verification-status.value-object.ts
│   ├── is-anonymous.value-object.ts
│   └── is-email-verified.value-object.ts
└── index.ts                 # 統一導出
```

## 🎯 核心功能

### **1. 認證值物件**
- **Email**: 處理郵箱驗證和匿名郵箱生成
- **Password**: 密碼驗證和哈希
- **DisplayName**: 顯示名稱驗證
- **PhotoUrl**: 頭像 URL 驗證
- **FirebaseUid**: Firebase UID 管理
- **UserId**: 系統內部用戶 ID
- **AuthProvider**: 認證提供者管理
- **AuthMethod**: 認證方式管理
- **SessionId**: 會話 ID 管理
- **FirebaseAuthError**: Firebase 錯誤處理

### **2. Token 值物件**
- **JWTToken**: JWT Token 解析和管理
- **RefreshToken**: 刷新 Token 管理
- **TokenExpiresAt**: Token 過期時間管理
- **TokenType**: Token 類型管理

### **3. 授權值物件**
- **Role**: 用戶角色管理
- **RoleSet**: 多角色集合管理
- **Permission**: 權限管理
- **PermissionSet**: 權限集合管理
- **PermissionGroup**: 權限群組管理

### **4. 裝置值物件**
- **DeviceInfo**: 裝置信息收集
- **UserAgent**: 用戶代理解析
- **GeoLocation**: 地理位置管理
- **LoginContext**: 登入上下文管理
- **LoginSource**: 登入來源管理

### **5. 狀態值物件**
- **UserStatus**: 用戶狀態管理
- **VerificationStatus**: 驗證狀態管理
- **IsAnonymous**: 匿名狀態管理
- **IsEmailVerified**: 郵箱驗證狀態管理

## 🔧 使用範例

### **基本使用**
```typescript
import { Email, Password, IsAnonymous } from './domain/value-objects';

// 創建匿名郵箱
const anonymousEmail = Email.createAnonymous();

// 創建有效郵箱
const email = new Email('user@example.com');

// 創建密碼
const password = new Password('StrongPass123');

// 檢查匿名狀態
const isAnonymous = IsAnonymous.ANONYMOUS();
```

### **Firebase 整合**
```typescript
import { FirebaseAuthError } from './domain/value-objects';

// 處理 Firebase 錯誤
try {
  // Firebase 操作
} catch (error) {
  const authError = new FirebaseAuthError(error);
  console.log(authError.getLocalizedMessage());
}
```

### **授權檢查**
```typescript
import { Role, RoleSet, Permission, PermissionSet } from './domain/value-objects';

// 創建角色集合
const roleSet = new RoleSet();
roleSet.addRole(Role.ADMIN());
roleSet.addRole(Role.USER());

// 創建權限集合
const permissionSet = new PermissionSet();
permissionSet.addPermission(Permission.CONTRACT_EDIT());
permissionSet.addPermission(Permission.USER_READ());
```

## 🧪 測試

運行測試：
```bash
npm test -- --testPathPattern=test-value-objects.spec.ts
```

## 📚 相關服務

### **FirebaseAuthAdapter**
位置：`src/app/infrastructure/adapters/firebase-auth.adapter.ts`
- 整合 Firebase Auth 與 @delon/auth
- 自動處理認證狀態變化
- 轉換 Firebase 用戶到值物件

### **UnifiedAuthenticationService**
位置：`src/app/application/services/unified-authentication.service.ts`
- 統一認證服務
- 支持匿名登入和郵箱登入
- 整合所有值物件

## 🎯 設計原則

1. **不可變性**: 所有值物件都是不可變的
2. **驗證**: 每個值物件都包含完整的驗證邏輯
3. **類型安全**: 使用 TypeScript 確保類型安全
4. **DDD 原則**: 遵循領域驅動設計原則
5. **單一職責**: 每個值物件只負責一個概念

## 🚀 下一步

1. 完善 Firebase 整合
2. 添加更多測試案例
3. 實現實際的 JWT Token 生成
4. 添加更多認證方式
5. 完善錯誤處理機制 