import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ALLOW_ANONYMOUS } from '@delon/auth';
import { Observable, throwError, BehaviorSubject, EMPTY } from 'rxjs';
import { switchMap, catchError, filter, take, finalize, tap } from 'rxjs/operators';
import { AuthStateManagerService } from './auth-state-manager.service';
import { FirebaseAuthAdapterService } from './firebase-auth-adapter.service';
import { PerformanceMonitorService } from './performance-monitor.service';

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
  const performanceMonitor = inject(PerformanceMonitorService);

  // 性能監控：開始計時
  const requestId = `http-request-${Date.now()}`;
  performanceMonitor.startTimer(requestId);

  // 檢查是否允許匿名訪問
  if (req.context.get(ALLOW_ANONYMOUS)) {
    return next(req).pipe(
      finalize(() => performanceMonitor.endTimer(requestId))
    );
  }

  // 檢查是否為 Firebase 相關請求，避免循環
  if (req.url.includes('firebase') || req.url.includes('google')) {
    return next(req).pipe(
      finalize(() => performanceMonitor.endTimer(requestId))
    );
  }

  const currentState = authStateManager.getCurrentState();

  // 如果使用者未認證，直接通過
  if (!currentState.isAuthenticated || !currentState.token) {
    return next(req).pipe(
      finalize(() => performanceMonitor.endTimer(requestId))
    );
  }

  // 添加 Firebase ID Token 到請求頭
  const authenticatedReq = addTokenToRequest(req, currentState.token);

  return next(authenticatedReq).pipe(
    tap(() => {
      // 記錄成功的請求
      performanceMonitor.recordMetric('successful-authenticated-requests', 1);
    }),
    catchError((error: HttpErrorResponse) => {
      // 處理 401 錯誤，嘗試刷新 token
      if (error.status === 401 && currentState.isAuthenticated) {
        performanceMonitor.recordMetric('token-refresh-attempts', 1);
        return handle401Error(req, next, authStateManager, firebaseAuth, performanceMonitor);
      }
      return throwError(() => error);
    }),
    finalize(() => performanceMonitor.endTimer(requestId))
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
  firebaseAuth: FirebaseAuthAdapterService,
  performanceMonitor: PerformanceMonitorService
): Observable<any> {

  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    // 性能監控：開始 token 刷新計時
    performanceMonitor.startTimer('token-refresh');

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

              // 記錄成功的 token 刷新
              performanceMonitor.recordMetric('token-refresh-success', 1);

              return next(newReq);
            })
          );
        } else {
          // Token 刷新失敗，清除會話
          performanceMonitor.recordMetric('token-refresh-failure', 1);
          authStateManager.clearSession().subscribe();
          return throwError(() => new Error('Token refresh failed'));
        }
      }),
      catchError((error) => {
        // Token 刷新失敗，清除會話
        performanceMonitor.recordMetric('token-refresh-error', 1);
        authStateManager.clearSession().subscribe();
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
        performanceMonitor.endTimer('token-refresh');
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