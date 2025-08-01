# Firebase Auth Adapter

Firebase Auth 適配器服務提供與 ng-alain 相容的 Firebase 認證介面。

## 特色

- 🔥 使用 @angular/fire 進行 Firebase 整合
- 🎯 精簡設計，僅包含必要功能
- 📡 響應式設計，使用 Observable 模式
- 🔒 自動 token 管理和刷新
- 🧪 完整的測試覆蓋

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

### 取得 ID Token

```typescript
export class TokenService {
  private authService = inject(FirebaseAuthAdapterService);

  getToken() {
    return this.authService.getIdToken().subscribe(token => {
      if (token) {
        console.log('ID Token:', token);
        // 使用 token 進行 API 呼叫
      } else {
        console.log('無可用 token');
      }
    });
  }

  refreshToken() {
    return this.authService.getIdToken(true).subscribe(token => {
      console.log('刷新後的 Token:', token);
    });
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