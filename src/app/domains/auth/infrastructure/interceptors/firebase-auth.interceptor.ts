import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { of, from, catchError } from 'rxjs';

import { AuthBridgeService } from '../../application/services/auth-bridge.service';

/**
 * Firebase 認證攔截器
 * 攔截登入請求並使用 Firebase Auth 處理
 */
export const firebaseAuthInterceptor: HttpInterceptorFn = (req, next) => {
  // 只攔截登入請求
  if (req.url.includes('/login/account') && req.method === 'POST') {
    const authBridge = inject(AuthBridgeService);
    const body = req.body as any;

    try {
      // 執行登入
      return from(authBridge.signInWithEmailPassword(body.userName, body.password)).pipe(
        catchError(error => {
          console.error('Firebase Auth Error:', error);

          // 如果 Firebase 認證失敗，返回錯誤
          const errorResponse = new HttpResponse({
            status: 200,
            body: {
              msg: 'Invalid username or password'
            }
          });
          return of(errorResponse);
        })
      );
    } catch (error) {
      console.error('Auth Interceptor Error:', error);

      // 返回錯誤回應
      const errorResponse = new HttpResponse({
        status: 200,
        body: {
          msg: 'Authentication failed'
        }
      });
      return of(errorResponse);
    }
  }

  // 其他請求正常處理
  return next(req);
};
