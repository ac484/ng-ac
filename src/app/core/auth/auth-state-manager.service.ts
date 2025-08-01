import { Injectable, inject } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Observable, BehaviorSubject, combineLatest, EMPTY, of } from 'rxjs';
import { map, switchMap, catchError, tap, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { TokenSyncService } from './token-sync.service';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';
import { SessionManagerService } from './session-manager.service';
import { PerformanceMonitorService } from './performance-monitor.service';
import { AuthState } from './auth.types';

/**
 * 認證狀態管理器
 * 
 * 統一管理 Firebase Auth 和 ng-alain 認證狀態
 * 協調 Firebase Auth adapter 和 Token Sync 服務
 */
@Injectable({
  providedIn: 'root'
})
export class AuthStateManagerService {
  private readonly firebaseAuth = inject(FirebaseAuthAdapterService);
  private readonly tokenSync = inject(TokenSyncService);
  private readonly errorHandler = inject(FirebaseErrorHandlerService);
  private readonly sessionManager = inject(SessionManagerService);
  private readonly performanceMonitor = inject(PerformanceMonitorService);

  // 內部狀態管理
  private readonly _authState$ = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null
  });

  // 公開的認證狀態流
  readonly authState$ = this._authState$.asObservable();

  // 便利的認證狀態屬性
  readonly isAuthenticated$ = this.authState$.pipe(
    map(state => state.isAuthenticated),
    distinctUntilChanged()
  );

  readonly user$ = this.authState$.pipe(
    map(state => state.user),
    distinctUntilChanged()
  );

  readonly loading$ = this.authState$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );

  readonly error$ = this.authState$.pipe(
    map(state => state.error),
    distinctUntilChanged()
  );

  /**
   * 初始化認證狀態管理器
   * 設定 Firebase Auth 狀態監聽和自動同步
   */
  initialize(): Observable<void> {
    this.performanceMonitor.startTimer('auth-initialization');

    return this.firebaseAuth.authState$.pipe(
      tap(() => this.setLoading(true)),
      switchMap(user => this.handleAuthStateChange(user)),
      tap(() => {
        this.setLoading(false);
        this.performanceMonitor.endTimer('auth-initialization');
      }),
      catchError(error => {
        this.errorHandler.handleAuthStateError(error);
        this.setError('認證初始化失敗');
        this.setLoading(false);
        this.performanceMonitor.endTimer('auth-initialization');
        return EMPTY;
      }),
      map(() => void 0)
    );
  }

  /**
   * 監控認證狀態變化
   * @returns Observable<AuthState>
   */
  monitorAuthState(): Observable<AuthState> {
    return this.authState$;
  }

  /**
   * 處理認證狀態變化
   * @param user Firebase 使用者物件或 null
   */
  handleAuthStateChange(user: User | null): Observable<void> {
    if (user) {
      // 使用者已登入，同步 token
      const getIdToken$ = this.firebaseAuth.getIdToken();
      if (!getIdToken$) {
        console.error('getIdToken returned undefined');
        this.setError('無法取得 Firebase ID Token');
        return of(void 0);
      }

      return getIdToken$.pipe(
        switchMap(token => {
          if (token) {
            return this.tokenSync.syncFirebaseToken(token, user).pipe(
              switchMap(() => this.sessionManager.saveSession(user)),
              tap(() => {
                this.updateAuthState({
                  isAuthenticated: true,
                  user,
                  token,
                  loading: false,
                  error: null
                });
              })
            );
          } else {
            throw new Error('無法取得 Firebase ID Token');
          }
        }),
        catchError(error => {
          this.errorHandler.handleSilentError(error);
          this.setError('Token 同步失敗');
          return of(void 0);
        })
      );
    } else {
      // 使用者已登出，清除 token 和會話
      return this.tokenSync.clearTokens().pipe(
        switchMap(() => this.sessionManager.clearSession()),
        tap(() => {
          this.updateAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null
          });
        }),
        catchError(error => {
          this.errorHandler.handleSilentError(error);
          this.setError('清除 Token 失敗');
          return of(void 0);
        })
      );
    }
  }

  /**
   * 處理 token 刷新
   * @param token 新的 Firebase ID Token
   */
  handleTokenRefresh(token: string): Observable<void> {
    const currentState = this._authState$.value;

    if (currentState.user && currentState.isAuthenticated) {
      return this.tokenSync.syncFirebaseToken(token, currentState.user).pipe(
        tap(() => {
          this.updateAuthState({
            ...currentState,
            token,
            error: null
          });
        }),
        catchError(error => {
          this.errorHandler.handleTokenRefreshError(error);
          this.setError('Token 刷新失敗');
          return EMPTY;
        })
      );
    }

    return EMPTY;
  }

  /**
   * 恢復會話
   * 檢查是否有有效的 Firebase 會話
   */
  restoreSession(): Observable<boolean> {
    return this.firebaseAuth.getCurrentUser().pipe(
      map(user => !!user),
      catchError(error => {
        this.errorHandler.handleSessionRestoreError(error);
        this.setError('會話恢復失敗');
        return EMPTY;
      })
    );
  }

  /**
   * 清除會話
   * 登出並清除所有認證資料
   */
  clearSession(): Observable<void> {
    this.setLoading(true);

    return this.firebaseAuth.signOut().pipe(
      switchMap(() => this.tokenSync.clearTokens()),
      switchMap(() => this.sessionManager.clearSession()),
      tap(() => {
        this.updateAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null
        });
      }),
      catchError(error => {
        this.errorHandler.handleSilentError(error);
        this.setError('登出失敗');
        this.setLoading(false);
        return EMPTY;
      })
    );
  }

  /**
   * 取得當前認證狀態
   */
  getCurrentState(): AuthState {
    return this._authState$.value;
  }

  /**
   * 檢查是否已認證
   */
  isAuthenticated(): boolean {
    return this._authState$.value.isAuthenticated;
  }

  /**
   * 取得當前使用者
   */
  getCurrentUser(): User | null {
    return this._authState$.value.user;
  }

  // 私有方法：更新認證狀態
  private updateAuthState(newState: AuthState): void {
    this._authState$.next(newState);
  }

  // 私有方法：設定載入狀態
  private setLoading(loading: boolean): void {
    const currentState = this._authState$.value;
    this.updateAuthState({
      ...currentState,
      loading
    });
  }

  // 私有方法：設定錯誤狀態
  private setError(error: string | null): void {
    const currentState = this._authState$.value;
    this.updateAuthState({
      ...currentState,
      error,
      loading: false
    });
  }
}