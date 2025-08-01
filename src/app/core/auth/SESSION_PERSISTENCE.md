# Firebase Auth 會話持久化功能

## 概述

會話持久化功能允許應用程式在用戶關閉瀏覽器後重新開啟時，自動恢復用戶的認證狀態。這個功能遵循精簡主義原則，僅包含必要的功能，並與現有的 ng-alain 認證系統無縫整合。

## 核心功能

### 1. 會話保存 (Session Saving)
- 當用戶成功登入時，自動保存會話資料到 localStorage
- 包含用戶基本資訊、會話 ID、設備指紋等
- 支援會話版本控制，確保向後相容性

### 2. 會話恢復 (Session Restoration)
- 應用程式啟動時自動檢查並恢復有效會話
- 驗證會話完整性和有效性
- 與 Firebase Auth 狀態同步

### 3. 會話驗證 (Session Validation)
- 檢查會話是否過期（預設 24 小時）
- 驗證設備一致性（防止會話劫持）
- 確保 Firebase Auth 狀態匹配

### 4. 會話清理 (Session Cleanup)
- 自動清理過期會話
- 登出時完全清除會話資料
- 處理損壞的會話資料

## 技術實現

### SessionManagerService

主要負責會話的持久化管理：

```typescript
interface SessionData {
    uid: string;                // Firebase 用戶 UID
    email?: string;            // 用戶 email
    displayName?: string;      // 用戶顯示名稱
    photoURL?: string;         // 用戶頭像 URL
    lastActivity: number;      // 最後活動時間戳
    sessionId: string;         // 唯一會話 ID
    version: string;           // 會話資料版本
    createdAt: number;         // 會話創建時間
    deviceInfo?: string;       // 設備指紋
}
```

### 核心方法

#### `saveSession(user: any): Observable<void>`
保存用戶會話到 localStorage

#### `restoreSession(): Observable<boolean>`
在應用程式啟動時恢復會話，返回是否成功恢復

#### `validateSession(): Observable<boolean>`
驗證當前會話是否有效

#### `clearSession(): Observable<void>`
清除會話資料

#### `updateActivity(): Observable<void>`
更新會話活動時間

#### `cleanupExpiredSessions(): Observable<void>`
清理過期會話

## 安全考量

### 1. 設備驗證
- 使用簡化的設備指紋（平台、語言、User-Agent 長度）
- 防止會話在不同設備間被濫用
- 支援向後相容性（舊會話沒有設備資訊）

### 2. 時間戳驗證
- 檢查會話創建時間和最後活動時間的合理性
- 防止時間戳篡改攻擊

### 3. 會話過期
- 預設 24 小時會話超時
- 自動清理過期會話

### 4. 資料完整性
- 驗證必要欄位存在
- 處理 JSON 解析錯誤
- 版本相容性檢查

## 與 ng-alain 整合

### StartupService 整合

```typescript
load(): Observable<void> {
    return this.sessionManager.restoreSession().pipe(
        switchMap((sessionRestored) => {
            if (sessionRestored) {
                // 會話恢復成功，初始化認證狀態管理器
                return this.authStateManager.initialize().pipe(
                    switchMap(() => this.viaMockI18n()),
                    catchError(() => this.viaMockI18n())
                );
            } else {
                // 沒有有效會話，直接進行正常啟動流程
                return this.viaMockI18n();
            }
        }),
        catchError(() => this.viaMockI18n())
    );
}
```

### AuthStateManagerService 整合

會話恢復後，AuthStateManagerService 會：
1. 初始化 Firebase Auth 狀態監聽
2. 同步 Firebase ID Token 到 Alain Token Service
3. 更新應用程式認證狀態

## 錯誤處理

### 1. 靜默錯誤處理
- localStorage 存取錯誤
- JSON 解析錯誤
- 設備資訊獲取錯誤

### 2. 會話恢復錯誤
- Firebase Auth 連接錯誤
- Token 同步失敗
- 會話驗證失敗

### 3. 邊緣情況處理
- 損壞的會話資料
- 缺少必要欄位
- 版本不相容

## 使用範例

### 基本使用

```typescript
// 保存會話（通常在登入成功後自動調用）
this.sessionManager.saveSession(firebaseUser).subscribe();

// 恢復會話（在應用程式啟動時自動調用）
this.sessionManager.restoreSession().subscribe(restored => {
    if (restored) {
        console.log('會話恢復成功');
    }
});

// 清除會話（登出時自動調用）
this.sessionManager.clearSession().subscribe();
```

### 手動會話管理

```typescript
// 檢查會話有效性
this.sessionManager.validateSession().subscribe(isValid => {
    if (!isValid) {
        // 重定向到登入頁面
    }
});

// 更新會話活動時間
this.sessionManager.updateActivity().subscribe();

// 清理過期會話
this.sessionManager.cleanupExpiredSessions().subscribe();
```

## 測試

### 單元測試
- `SessionManagerService` 的所有方法
- 錯誤處理場景
- 邊緣情況處理

### 整合測試
- 完整會話生命週期
- 與 AuthStateManagerService 的整合
- 錯誤恢復機制

## 配置選項

### 會話超時時間
```typescript
private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 小時
```

### 會話版本
```typescript
private readonly SESSION_VERSION = '1.0.0';
```

### 儲存鍵名
```typescript
private readonly SESSION_KEY = 'firebase_auth_session';
```

## 最佳實踐

1. **不要手動修改 localStorage 中的會話資料**
2. **定期調用 `updateActivity()` 來保持會話活躍**
3. **在敏感操作前驗證會話有效性**
4. **監聽認證狀態變化來處理會話失效**
5. **在生產環境中考慮使用更安全的儲存方式**

## 未來改進

1. **支援多設備會話管理**
2. **實現會話加密**
3. **添加會話活動監控**
4. **支援會話共享（同域名下的多個應用程式）**
5. **實現會話分析和統計**