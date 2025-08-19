/**
 * @fileoverview 日誌攔截器 (Logging Interceptor)
 * @description 記錄 HTTP 請求/回應的耗時與狀態碼，錯誤輸出精簡摘要
 */

import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export const LoggingInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const start = performance.now();
    const requestId = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    const taggedReq = req.clone({ setHeaders: { 'X-Request-Id': requestId } });

    return next(taggedReq).pipe(
        tap({
            next: (event) => {
                // 只在回應結束時計時，事件型別判斷交由瀏覽器輸出觀察
            },
            error: (err) => {
                const elapsed = Math.round(performance.now() - start);
                const status = err?.status ?? 'UNKNOWN';
                console.error('[HTTP ERROR]', {
                    id: requestId,
                    url: req.url,
                    method: req.method,
                    status,
                    elapsedMs: elapsed
                });
            },
            complete: () => {
                const elapsed = Math.round(performance.now() - start);
                // 在完成時輸出成功請求耗時（錯誤已在 error 分支輸出）
                console.log('[HTTP DONE]', {
                    id: requestId,
                    url: req.url,
                    method: req.method,
                    elapsedMs: elapsed
                });
            }
        })
    );
};

