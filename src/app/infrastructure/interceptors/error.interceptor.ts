/**
 * @fileoverview 錯誤攔截器 (Error Interceptor)
 * @description 統一處理 HTTP 錯誤響應：包裝錯誤訊息，避免洩漏細節
 */

import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const safeMessage = typeof error?.error === 'string' ? error.error : error.message || 'Request failed';
            const wrapped = new HttpErrorResponse({
                status: error.status,
                statusText: error.statusText,
                url: error.url || req.url,
                error: { message: safeMessage }
            });
            return throwError(() => wrapped);
        })
    );
};

