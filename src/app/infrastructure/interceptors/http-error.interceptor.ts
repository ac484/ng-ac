/**
 * HTTP 錯誤攔截器
 * 處理 HTTP 錯誤並轉換為應用程式錯誤類型，整合自動重試和錯誤恢復機制
 */

import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, timer, of, fromEvent, merge } from 'rxjs';
import {
    catchError,
    retry,
    retryWhen,
    delayWhen,
    take,
    switchMap,
    startWith,
    map,
    distinctUntilChanged,
    shareReplay
} from 'rxjs/operators';

import {
    NetworkError,
    ValidationError,
    NotFoundError,
    ApplicationError,
    AuthenticationError,
    GlobalErrorHandler,
    ErrorSeverity
} from '../../shared/errors';

/**
 * 重試配置介面
 */
interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryableStatuses: number[];
    exponentialBackoff: boolean;
}

/**
 * 網路狀態監控服務
 */
class NetworkStatusService {
    private static instance: NetworkStatusService;
    private _isOnline$ = merge(
        of(navigator.onLine),
        fromEvent(window, 'online').pipe(map(() => true)),
        fromEvent(window, 'offline').pipe(map(() => false))
    ).pipe(
        distinctUntilChanged(),
        shareReplay(1)
    );

    static getInstance(): NetworkStatusService {
        if (!NetworkStatusService.instance) {
            NetworkStatusService.instance = new NetworkStatusService();
        }
        return NetworkStatusService.instance;
    }

    get isOnline$(): Observable<boolean> {
        return this._isOnline$;
    }

    get isOnline(): boolean {
        return navigator.onLine;
    }
}

/**
 * 預設重試配置
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [0, 408, 429, 500, 502, 503, 504],
    exponentialBackoff: true
};

/**
 * 從請求 URL 取得重試配置
 */
function getRetryConfig(url: string): RetryConfig {
    // 可以根據不同的 API 端點設定不同的重試策略
    if (url.includes('/auth/')) {
        return {
            ...DEFAULT_RETRY_CONFIG,
            maxRetries: 1, // 認證相關請求減少重試次數
            retryableStatuses: [0, 500, 502, 503, 504] // 不重試 401, 403
        };
    }

    if (url.includes('/upload/')) {
        return {
            ...DEFAULT_RETRY_CONFIG,
            maxRetries: 2, // 上傳請求減少重試次數
            retryDelay: 2000 // 增加重試延遲
        };
    }

    return DEFAULT_RETRY_CONFIG;
}

/**
 * 檢查錯誤是否可重試
 */
function isRetryableError(error: HttpErrorResponse, config: RetryConfig): boolean {
    // 網路離線時不重試
    if (!NetworkStatusService.getInstance().isOnline) {
        return false;
    }

    // 檢查狀態碼是否在可重試列表中
    return config.retryableStatuses.includes(error.status);
}

/**
 * 計算重試延遲時間
 */
function calculateRetryDelay(attempt: number, config: RetryConfig): number {
    if (config.exponentialBackoff) {
        // 指數退避：1s, 2s, 4s, 8s...
        return config.retryDelay * Math.pow(2, attempt - 1);
    }
    return config.retryDelay;
}

/**
 * 將 HTTP 錯誤轉換為應用程式錯誤類型
 */
function convertHttpErrorToAppError(error: HttpErrorResponse, request: HttpRequest<any>): Error {
    const context = {
        url: request.url,
        method: request.method,
        headers: request.headers.keys().reduce((acc, key) => {
            acc[key] = request.headers.get(key) || '';
            return acc;
        }, {} as Record<string, string>),
        timestamp: new Date().toISOString()
    };

    // 網路連線錯誤 (status = 0)
    if (error.status === 0) {
        return new NetworkError(
            '網路連線失敗，請檢查網路設定',
            0,
            request.url,
            error,
            '網路連線異常',
            context
        );
    }

    // 根據 HTTP 狀態碼轉換為對應的錯誤類型
    switch (error.status) {
        case 400:
            // 檢查是否為驗證錯誤
            if (error.error?.errors || error.error?.validationErrors) {
                const validationErrors = error.error.errors || error.error.validationErrors;
                return ValidationError.fromServerResponse(validationErrors, context);
            }
            return new ValidationError(
                error.error?.message || '請求參數錯誤',
                'REQUEST_VALIDATION',
                undefined,
                context
            );

        case 401:
            return new AuthenticationError(
                error.error?.message || '身份驗證失敗，請重新登入',
                'AUTHENTICATION_FAILED',
                error,
                context
            );

        case 403:
            return new AuthenticationError(
                error.error?.message || '權限不足，無法執行此操作',
                'AUTHORIZATION_FAILED',
                error,
                context
            );

        case 404:
            return new NotFoundError(
                error.error?.message || '請求的資源不存在',
                'RESOURCE_NOT_FOUND',
                error,
                context
            );

        case 408:
            return new NetworkError(
                '請求逾時，請稍後再試',
                408,
                request.url,
                error,
                '請求逾時',
                context
            );

        case 409:
            return new ApplicationError(
                error.error?.message || '資源衝突，請重新整理後再試',
                'RESOURCE_CONFLICT',
                error,
                context
            );

        case 422:
            return new ValidationError(
                error.error?.message || '資料驗證失敗',
                'DATA_VALIDATION',
                error,
                context
            );

        case 429:
            return new NetworkError(
                '請求過於頻繁，請稍後再試',
                429,
                request.url,
                error,
                '請求限流',
                context
            );

        case 500:
            return new ApplicationError(
                '伺服器內部錯誤，請稍後再試',
                'INTERNAL_SERVER_ERROR',
                error,
                context
            );

        case 502:
            return new NetworkError(
                '閘道錯誤，請稍後再試',
                502,
                request.url,
                error,
                '閘道錯誤',
                context
            );

        case 503:
            return new NetworkError(
                '服務暫時無法使用，請稍後再試',
                503,
                request.url,
                error,
                '服務不可用',
                context
            );

        case 504:
            return new NetworkError(
                '閘道逾時，請稍後再試',
                504,
                request.url,
                error,
                '閘道逾時',
                context
            );

        default:
            return new ApplicationError(
                error.error?.message || `HTTP 錯誤 ${error.status}: ${error.statusText}`,
                'HTTP_ERROR',
                error,
                context
            );
    }
}

/**
 * 等待網路連線恢復
 */
function waitForNetworkRecovery(): Observable<boolean> {
    return NetworkStatusService.getInstance().isOnline$.pipe(
        switchMap(isOnline => {
            if (isOnline) {
                return of(true);
            }
            // 如果離線，等待上線
            return NetworkStatusService.getInstance().isOnline$.pipe(
                switchMap(online => online ? of(true) : throwError(() => new Error('Network offline')))
            );
        }),
        take(1)
    );
}

/**
 * HTTP 錯誤攔截器
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
    const globalErrorHandler = inject(GlobalErrorHandler);
    const networkStatus = NetworkStatusService.getInstance();
    const retryConfig = getRetryConfig(req.url);

    return next(req).pipe(
        // 重試機制
        retryWhen(errors =>
            errors.pipe(
                switchMap((error: HttpErrorResponse, index: number) => {
                    const attemptNumber = index + 1;

                    // 檢查是否超過最大重試次數
                    if (attemptNumber > retryConfig.maxRetries) {
                        return throwError(() => error);
                    }

                    // 檢查是否為可重試的錯誤
                    if (!isRetryableError(error, retryConfig)) {
                        return throwError(() => error);
                    }

                    // 如果是網路錯誤，等待網路恢復
                    if (error.status === 0) {
                        return waitForNetworkRecovery().pipe(
                            delayWhen(() => timer(calculateRetryDelay(attemptNumber, retryConfig)))
                        );
                    }

                    // 其他可重試錯誤，使用延遲重試
                    const delay = calculateRetryDelay(attemptNumber, retryConfig);
                    console.log(`[HTTP Retry] Attempt ${attemptNumber}/${retryConfig.maxRetries} for ${req.url} after ${delay}ms`);

                    return timer(delay);
                })
            )
        ),

        // 錯誤處理
        catchError((error: HttpErrorResponse) => {
            // 轉換為應用程式錯誤類型
            const appError = convertHttpErrorToAppError(error, req);

            // 記錄錯誤資訊
            console.error('[HTTP Error Interceptor]', {
                url: req.url,
                method: req.method,
                status: error.status,
                statusText: error.statusText,
                error: error.error,
                appError: appError,
                isOnline: networkStatus.isOnline
            });

            // 使用全域錯誤處理器處理錯誤
            globalErrorHandler.handleErrorWithOptions(appError, {
                showUserMessage: true,
                logError: true,
                reportError: true,
                severity: determineSeverityFromStatus(error.status),
                context: {
                    httpRequest: {
                        url: req.url,
                        method: req.method,
                        headers: req.headers.keys()
                    },
                    httpResponse: {
                        status: error.status,
                        statusText: error.statusText,
                        error: error.error
                    },
                    networkStatus: {
                        isOnline: networkStatus.isOnline
                    }
                }
            });

            return throwError(() => appError);
        })
    );
};

/**
 * 根據 HTTP 狀態碼判斷錯誤嚴重程度
 */
function determineSeverityFromStatus(status: number): ErrorSeverity {
    if (status === 0) {
        return 'high'; // 網路連線問題
    }

    if (status >= 400 && status < 500) {
        if (status === 401 || status === 403) {
            return 'medium'; // 認證/授權問題
        }
        if (status === 404) {
            return 'low'; // 資源不存在
        }
        if (status === 422 || status === 400) {
            return 'low'; // 驗證錯誤
        }
        return 'medium'; // 其他客戶端錯誤
    }

    if (status >= 500) {
        return 'high'; // 伺服器錯誤
    }

    return 'medium'; // 其他錯誤
}

/**
 * 網路狀態監控服務導出（供其他模組使用）
 */
export { NetworkStatusService };