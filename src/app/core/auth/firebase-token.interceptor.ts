import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ALLOW_ANONYMOUS } from '@delon/auth';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { switchMap, catchError, filter, take, finalize } from 'rxjs/operators';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';

// Token 刷新狀態管理
let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

/**
 * Firebase Token 攔截器
 * 
 * 自動為 HTTP 請求添加 Firebase ID Token
 * 處理 token 過期和自動刷新
 * 與現有的 ng-alain 攔截器協作
 */
export const firebaseTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const authStateManager = inject(AuthStateManagerService);
  const firebaseAuth = inject(FirebaseAuthAdapterService);

  // 檢查是否允許匿名訪問
  if (req.context.get(ALLOW_ANONYMOUS)) {
    return next(req);
  }

  // 檢查是否為 Firebase 相關請求，避免循環
  if (req.url.includes('firebase') || req.url.includes('google')) {
    return next(req);
  }

  const currentState = authStateManager.getCurrentState();

  // 如果使用者未認證，直接通過
  if (!currentState.isAuthenticated || !currentState.token) {
    return next(req);
  }

  // 添加 Firebase ID Token 到請求頭
  const authenticatedReq = addTokenToRequest(req, currentState.token);

  return next(authenticatedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 處理 401 錯誤，嘗試刷新 token
      if (error.status === 401 && currentState.isAuthenticated) {
        return handle401Error(req, next, authStateManager, firebaseAuth);
      }
      return throwError(() => error);
    })
  );
};

/**
 * 添加 token 到請求頭
 */
function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * 處理 401 錯誤，嘗試刷新 token
 */
function handle401Error(
  req: HttpRequest<any>,
  next: HttpHandlerFn,
  authStateManager: AuthStateManagerService,
  firebaseAuth: FirebaseAuthAdapterService
): Observable<any> {
  
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // 嘗試刷新 Firebase ID Token
    return firebaseAuth.getIdToken(true).pipe(
      switchMap((newToken: string | null) => {
        if (newToken) {
          // 更新認證狀態管理器中的 token
          return authStateManager.handleTokenRefresh(newToken).pipe(
            switchMap(() => {
              // 通知等待中的請求
              refreshTokenSubject.next(newToken);
              // 重新發送原始請求
              const newReq = addTokenToRequest(req, newToken);
              return next(newReq);
            })
          );
        } else {
          // Token 刷新失敗，清除會話
          authStateManager.clearSession().subscribe();
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((error) => {
        // Token 刷新失敗，清除會話
        authStateManager.clearSession().subscribe();
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      })
    );
  } else {
    // 如果正在刷新 token，等待刷新完成
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token: string | null) => {
        if (token) {
          const newReq = addTokenToRequest(req, token);
          return next(newReq);
        } else {
          return throwError(() => new Error('Token refresh failed'));
        }
      })
    );
  }
}

/**
 * 檢查請求是否需要認證
 * 可以根據 URL 模式或其他條件來判斷
 */
function shouldAddToken(req: HttpRequest<any>): boolean {
  // 排除不需要認證的請求
  const excludeUrls = [
    '/login',
    '/register',
    '/forgot-password',
    '/assets/',
    '.json'
  ];

  return !excludeUrls.some(url => req.url.includes(url));
}