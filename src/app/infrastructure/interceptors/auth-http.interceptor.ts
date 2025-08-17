/**
 * @fileoverview 認證 HTTP 攔截器 (Auth HTTP Interceptor)
 * @description 附掛 Authorization: Bearer <token>；401/403 嘗試刷新一次
 */

import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, from, switchMap, throwError } from 'rxjs';
import { RefreshTokenService } from '../security/refresh-token.service';
import { TokenService } from '../security/token.service';

export const AuthHttpInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const tokenService = inject(TokenService);
    const refreshTokenService = inject(RefreshTokenService);

    return from(tokenService.getIdToken(false)).pipe(
        switchMap(token => {
            const authReq = token
                ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
                : req;
            return next(authReq).pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401 || error.status === 403) {
                        return from(refreshTokenService.refresh()).pipe(
                            switchMap(async (refreshedToken) => {
                                if (!refreshedToken) {
                                    await tokenService.clear();
                                    return throwError(() => error);
                                }
                                const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${refreshedToken}` } });
                                return next(retryReq);
                            }),
                            // 若刷新流程本身失敗，回傳原錯誤
                            catchError(() => throwError(() => error))
                        ) as unknown as Observable<HttpEvent<unknown>>;
                    }
                    return throwError(() => error);
                })
            );
        })
    );
};



