# Firebase Auth UI Components Update

## 概述

此文檔記錄了為整合 Firebase Authentication 而對用戶界面組件所做的更新。遵循精簡主義原則，僅包含必要的功能修改，並保持與現有 ng-alain 結構的完全相容性。

## 更新的組件

### 1. HeaderUserComponent (`src/app/layout/basic/widgets/user.component.ts`)

**更新內容**:
- 添加 Firebase 用戶信息顯示支持
- 更新登出功能使用 `AuthStateManagerService.clearSession()`
- 保持現有 UI 結構和用戶體驗

**主要變更**:
```typescript
// 添加 Firebase 用戶信息流
readonly currentUser$ = this.firebaseAuth.authState$;

// 更新模板顯示 Firebase 用戶信息
<nz-avatar [nzSrc]="(currentUser$ | async)?.photoURL || user.avatar" />
{{ (currentUser$ | async)?.displayName || (currentUser$ | async)?.email || user.name }}

// 更新登出功能
logout(): void {
  this.authStateManager.clearSession().subscribe({
    next: () => this.router.navigateByUrl(this.tokenService.login_url!),
    error: (error) => {
      console.error('Logout error:', error);
      this.tokenService.clear();
      this.router.navigateByUrl(this.tokenService.login_url!);
    }
  });
}
```

### 2. UserLockComponent (`src/app/routes/passport/lock/lock.component.ts`)

**更新內容**:
- 添加 Firebase 用戶信息顯示支持
- 更新模板顯示 Firebase 用戶頭像

**主要變更**:
```typescript
// 添加 Firebase 用戶信息流
readonly currentUser$ = this.firebaseAuth.authState$;

// 更新模板顯示 Firebase 用戶頭像
<nz-avatar [nzSrc]="(currentUser$ | async)?.photoURL || user.avatar" />
```

### 3. LayoutBasicComponent (`src/app/layout/basic/basic.component.ts`)

**更新內容**:
- 添加側邊欄 Firebase 用戶信息顯示支持
- 更新側邊欄用戶信息模板

**主要變更**:
```typescript
// 添加 Firebase 用戶信息流
readonly currentUser$ = this.firebaseAuth.authState$;

// 更新側邊欄用戶信息顯示
<nz-avatar [nzSrc]="(currentUser$ | async)?.photoURL || user.avatar" />
<strong>{{ (currentUser$ | async)?.displayName || (currentUser$ | async)?.email || user.name }}</strong>
<p>{{ (currentUser$ | async)?.email || user.email }}</p>
```

## 設計原則

### 1. 精簡主義
- 僅添加必要的功能
- 不引入多餘的依賴
- 保持代碼簡潔

### 2. 向後相容性
- 保持現有 ng-alain 結構
- 維持原有的用戶體驗
- 支持降級到 ng-alain 用戶信息

### 3. 錯誤處理
- 優雅處理 Firebase 認證錯誤
- 提供降級機制
- 確保應用程式穩定性

## 用戶信息顯示邏輯

所有組件都遵循以下顯示優先級：

1. **用戶名稱**: `Firebase displayName` → `Firebase email` → `ng-alain user.name`
2. **用戶頭像**: `Firebase photoURL` → `ng-alain user.avatar`
3. **用戶郵箱**: `Firebase email` → `ng-alain user.email`

## 測試

創建了基本的單元測試來驗證：
- Firebase 用戶信息正確顯示
- 登出功能正確調用 `AuthStateManagerService`
- 錯誤處理機制正常工作

## 注意事項

1. 所有組件都使用 `AsyncPipe` 來處理 Firebase 用戶信息流
2. 登出功能統一使用 `AuthStateManagerService.clearSession()`
3. 保持與現有 ng-alain 認證系統的完全相容性
4. 所有更改都是模組化的，可以輕鬆回滾或修改