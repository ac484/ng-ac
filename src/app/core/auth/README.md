# Firebase Auth Integration

Firebase Auth 與 ng-alain 認證系統整合，提供完整的認證解決方案。

## 特色

- 🔥 使用 @angular/fire 進行 Firebase 整合
- 🎯 精簡設計，僅包含必要功能
- 📡 響應式設計，使用 Observable 模式
- 🔒 自動 token 管理和刷新
- 🔄 自動同步到 ng-alain token 服務
- 🧪 完整的測試覆蓋

## 核心服務

### FirebaseAuthAdapterService
Firebase 認證適配器，提供基本的認證操作。

### TokenSyncService
Token 同步服務，負責將 Firebase ID token 轉換並同步到 ng-alain 系統。

### AuthStateManagerService
認證狀態管理器，統一管理 Firebase Auth 和 ng-alain 認證狀態，協調各個服務之間的互動。

## 基本使用

### 在組件中注入服務

```typescript
import { Component, inject } from '@angular/core';
import { FirebaseAuthAdapterService } from '@core/auth';

@Component({
  selector: 'app-example',
  template: `
    <div *ngIf="authService.isAuthenticated$ | async; else loginTemplate">
      <p>已登入</p>
      <button (click)="signOut()">登出</button>
    </div>
    <ng-template #loginTemplate>
      <p>未登入</p>
      <button (click)="signIn()">登入</button>
    </ng-template>
  `
})
export class ExampleComponent {
  authService = inject(FirebaseAuthAdapterService);

  signIn() {
    this.authService.signIn('user@example.com', 'password')
      .subscribe({
        next: (user) => console.log('登入成功', user),
        error: (error) => console.error('登入失敗', error)
      });
  }

  signOut() {
    this.authService.signOut()
      .subscribe({
        next: () => console.log('登出成功'),
        error: (error) => console.error('登出失敗', error)
      });
  }
}
```

### 監聽認證狀態

```typescript
export class AuthStatusComponent implements OnInit {
  private authService = inject(FirebaseAuthAdapterService);

  ngOnInit() {
    // 監聽認證狀態變化
    this.authService.authState$.subscribe(user => {
      if (user) {
        console.log('使用者已登入:', user.email);
      } else {
        console.log('使用者未登入');
      }
    });

    // 監聽認證狀態布林值
    this.authService.isAuthenticated$.subscribe(isAuth => {
      console.log('認證狀態:', isAuth);
    });
  }
}
```

### 整合認證與 Token 同步

```typescript
export class AuthIntegrationComponent implements OnInit {
  private authService = inject(FirebaseAuthAdapterService);
  private tokenSync = inject(TokenSyncService);

  ngOnInit() {
    // 監聽認證狀態並自動同步 token
    this.authService.authState$.subscribe(async user => {
      if (user) {
        // 取得 Firebase ID token 並同步到 Alain
        const idToken = await this.authService.getIdToken().toPromise();
        if (idToken) {
          this.tokenSync.syncFirebaseToken(idToken, user).subscribe(() => {
            console.log('Token 已同步到 ng-alain 系統');
          });
        }
      } else {
        // 清除所有 token
        this.tokenSync.clearTokens().subscribe(() => {
          console.log('所有 token 已清除');
        });
      }
    });
  }

  signIn() {
    this.authService.signIn('user@example.com', 'password')
      .subscribe({
        next: async (user) => {
          console.log('Firebase 登入成功', user);
          // Token 同步會在 authState$ 監聽器中自動處理
        },
        error: (error) => console.error('登入失敗', error)
      });
  }
}
```

### 使用認證狀態管理器（推薦方式）

```typescript
export class AuthManagerComponent implements OnInit {
  private authStateManager = inject(AuthStateManagerService);

  ngOnInit() {
    // 初始化認證狀態管理器
    this.authStateManager.initialize().subscribe();

    // 監聽統一的認證狀態
    this.authStateManager.authState$.subscribe(state => {
      console.log('認證狀態:', state);
      if (state.isAuthenticated) {
        console.log('使用者已登入:', state.user?.email);
        console.log('當前 token:', state.token);
      } else {
        console.log('使用者未登入');
      }
      
      if (state.loading) {
        console.log('認證處理中...');
      }
      
      if (state.error) {
        console.error('認證錯誤:', state.error);
      }
    });

    // 監聽特定狀態
    this.authStateManager.isAuthenticated$.subscribe(isAuth => {
      console.log('認證狀態變化:', isAuth);
    });

    this.authStateManager.user$.subscribe(user => {
      console.log('使用者變化:', user);
    });
  }

  // 清除會話（登出）
  logout() {
    this.authStateManager.clearSession().subscribe(() => {
      console.log('已登出');
    });
  }

  // 恢復會話
  restoreSession() {
    this.authStateManager.restoreSession().subscribe(hasSession => {
      console.log('會話恢復結果:', hasSession);
    });
  }
}
```

### Token 管理

```typescript
export class TokenManagementService {
  private tokenSync = inject(TokenSyncService);
  private authStateManager = inject(AuthStateManagerService);

  // 檢查 token 是否即將過期
  checkTokenExpiration() {
    this.tokenSync.monitorTokenExpiration().subscribe(isExpiring => {
      if (isExpiring) {
        console.log('Token 即將過期，需要刷新');
        // 觸發 token 刷新邏輯
        this.refreshToken();
      }
    });
  }

  // 刷新 token
  refreshToken() {
    // 假設從 Firebase 取得新的 token
    const newToken = 'new-firebase-token';
    this.authStateManager.handleTokenRefresh(newToken).subscribe(() => {
      console.log('Token 已刷新');
    });
  }

  // 取得當前 Alain 格式的 token
  getCurrentAlainToken() {
    const token = this.tokenSync.getCurrentToken();
    if (token) {
      console.log('當前 Alain token:', token);
      return token;
    }
    return null;
  }
}
```

## API 參考

### 方法

- `signIn(email: string, password: string): Observable<User>` - 使用 email/password 登入
- `signOut(): Observable<void>` - 登出
- `getCurrentUser(): Observable<User | null>` - 取得當前使用者
- `getIdToken(forceRefresh?: boolean): Observable<string | null>` - 取得 ID Token

### 屬性

- `authState$: Observable<User | null>` - 認證狀態流
- `isAuthenticated$: Observable<boolean>` - 認證狀態布林值

## 設計考量

1. **精簡主義**: 僅實作必要功能，避免過度設計
2. **響應式**: 使用 Observable 模式，便於狀態管理
3. **錯誤處理**: 統一的錯誤處理機制
4. **效能優化**: 使用 shareReplay 避免重複訂閱
5. **測試友善**: 提供完整的測試覆蓋

## 後續整合

此服務將在後續任務中與以下組件整合：

- Token 同步服務 (Task 2)
- 認證狀態管理器 (Task 3)
- HTTP 攔截器 (Task 4)
- 登入組件 (Task 5)