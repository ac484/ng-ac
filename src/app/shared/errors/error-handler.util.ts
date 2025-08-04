/**
 * 錯誤處理工具類別
 * 提供統一的錯誤處理和轉換功能
 */

import { BaseError } from './base-error';
import { ApplicationError } from './application-error';
import { AuthenticationError } from './authentication-error';
import { NetworkError } from './network-error';
import { NotFoundError } from './not-found-error';
import { RepositoryError } from './repository-error';
import { ValidationError } from './validation-error';
import { ERROR_CODES, ErrorCode } from './error-codes';
import { getErrorMessage, Language } from './error-messages';

/**
 * 錯誤處理工具類別
 */
export class ErrorHandlerUtil {
    /**
     * 將任意錯誤轉換為 BaseError
     */
    static toBaseError(error: any, context?: Record<string, any>): BaseError {
        if (error instanceof BaseError) {
            return error;
        }

        if (error instanceof Error) {
            return new ApplicationError(
                error.message || '未知錯誤',
                undefined,
                error,
                context
            );
        }

        if (typeof error === 'string') {
            return new ApplicationError(error, undefined, undefined, context);
        }

        return new ApplicationError(
            '發生未知錯誤',
            undefined,
            undefined,
            { ...context, originalError: error }
        );
    }

    /**
     * 根據錯誤碼創建對應的錯誤
     */
    static createErrorByCode(
        code: ErrorCode,
        message?: string,
        context?: Record<string, any>
    ): BaseError {
        const errorMessage = message || getErrorMessage(code);

        switch (code) {
            // 驗證錯誤
            case ERROR_CODES.VALIDATION_ERROR:
            case ERROR_CODES.REQUIRED_FIELD:
            case ERROR_CODES.INVALID_FORMAT:
            case ERROR_CODES.INVALID_EMAIL:
            case ERROR_CODES.INVALID_PASSWORD:
                return new ValidationError(errorMessage, undefined, undefined, undefined, context);

            // 認證錯誤
            case ERROR_CODES.AUTHENTICATION_ERROR:
            case ERROR_CODES.LOGIN_FAILED:
            case ERROR_CODES.UNAUTHORIZED:
            case ERROR_CODES.TOKEN_EXPIRED:
                return new AuthenticationError(errorMessage, undefined, undefined, context);

            // 資源不存在錯誤
            case ERROR_CODES.NOT_FOUND:
            case ERROR_CODES.USER_NOT_FOUND:
            case ERROR_CODES.ACCOUNT_NOT_FOUND:
            case ERROR_CODES.TRANSACTION_NOT_FOUND:
                return new NotFoundError(errorMessage, undefined, undefined, undefined, context);

            // 儲存庫錯誤
            case ERROR_CODES.REPOSITORY_ERROR:
            case ERROR_CODES.DATABASE_ERROR:
            case ERROR_CODES.CONNECTION_ERROR:
                return new RepositoryError(errorMessage, undefined, undefined, undefined, context);

            // 網路錯誤
            case ERROR_CODES.NETWORK_ERROR:
            case ERROR_CODES.HTTP_ERROR:
            case ERROR_CODES.CONNECTION_FAILED:
                return new NetworkError(errorMessage, undefined, undefined, undefined, undefined, context);

            // 預設為應用程式錯誤
            default:
                return new ApplicationError(errorMessage, undefined, undefined, context);
        }
    }

    /**
     * 從 HTTP 錯誤回應創建錯誤
     */
    static fromHttpError(
        status: number,
        statusText: string,
        url?: string,
        method?: string,
        responseBody?: any
    ): BaseError {
        const context = {
            status,
            statusText,
            url,
            method,
            responseBody
        };

        if (status >= 400 && status < 500) {
            // 客戶端錯誤
            switch (status) {
                case 400:
                    return new ValidationError('請求參數錯誤', undefined, undefined, undefined, context);
                case 401:
                    return new AuthenticationError('未授權，請重新登入', undefined, undefined, context);
                case 403:
                    return new ApplicationError('權限不足', 'authorize', undefined, context);
                case 404:
                    return new NotFoundError('請求的資源不存在', undefined, undefined, undefined, context);
                case 409:
                    return new ApplicationError('資源衝突', undefined, undefined, context);
                case 422:
                    return new ValidationError('請求參數驗證失敗', undefined, undefined, undefined, context);
                case 429:
                    return NetworkError.rateLimitError(undefined, context);
                default:
                    return new ApplicationError(`客戶端錯誤 ${status}: ${statusText}`, undefined, undefined, context);
            }
        } else if (status >= 500) {
            // 伺服器錯誤
            return NetworkError.httpError(status, statusText, url, method, context);
        }

        return new NetworkError(`HTTP 錯誤 ${status}: ${statusText}`, status, url, method, undefined, context);
    }

    /**
     * 取得錯誤的用戶友好訊息
     */
    static getUserMessage(error: any, language: Language = 'zh-TW'): string {
        if (error instanceof BaseError) {
            return error.getUserMessage();
        }

        if (error instanceof Error) {
            return error.message || '發生未知錯誤';
        }

        if (typeof error === 'string') {
            return error;
        }

        return '發生未知錯誤';
    }

    /**
     * 判斷錯誤是否可重試
     */
    static isRetryable(error: any): boolean {
        if (error instanceof BaseError) {
            return error.isRetryable();
        }

        return false;
    }

    /**
     * 取得建議的重試延遲時間
     */
    static getRetryDelay(error: any): number {
        if (error instanceof BaseError) {
            return error.getRetryDelay();
        }

        return 1000; // 預設 1 秒
    }

    /**
     * 記錄錯誤
     */
    static logError(error: any, context?: Record<string, any>): void {
        const baseError = this.toBaseError(error, context);
        const errorInfo = baseError.getErrorInfo();

        console.error('[ErrorHandler]', {
            ...errorInfo,
            context
        });

        // 在生產環境中，這裡可以發送到錯誤追蹤服務
        // 例如 Sentry, LogRocket 等
    }

    /**
     * 格式化錯誤為 JSON
     */
    static toJSON(error: any): Record<string, any> {
        const baseError = this.toBaseError(error);
        return baseError.getErrorInfo();
    }

    /**
     * 檢查是否為特定類型的錯誤
     */
    static isErrorType<T extends BaseError>(
        error: any,
        errorClass: new (...args: any[]) => T
    ): error is T {
        return error instanceof errorClass;
    }

    /**
     * 安全地執行可能拋出錯誤的函數
     */
    static async safeExecute<T>(
        fn: () => Promise<T>,
        fallback?: T,
        onError?: (error: BaseError) => void
    ): Promise<T | undefined> {
        try {
            return await fn();
        } catch (error) {
            const baseError = this.toBaseError(error);

            if (onError) {
                onError(baseError);
            } else {
                this.logError(baseError);
            }

            return fallback;
        }
    }

    /**
     * 同步版本的安全執行
     */
    static safeExecuteSync<T>(
        fn: () => T,
        fallback?: T,
        onError?: (error: BaseError) => void
    ): T | undefined {
        try {
            return fn();
        } catch (error) {
            const baseError = this.toBaseError(error);

            if (onError) {
                onError(baseError);
            } else {
                this.logError(baseError);
            }

            return fallback;
        }
    }
}

/**
 * 錯誤處理裝飾器
 */
export function HandleError(
    fallback?: any,
    logError: boolean = true
) {
    return function (
        target: any,
        propertyName: string,
        descriptor: PropertyDescriptor
    ) {
        const method = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                return await method.apply(this, args);
            } catch (error) {
                const baseError = ErrorHandlerUtil.toBaseError(error, {
                    className: target.constructor.name,
                    methodName: propertyName,
                    arguments: args
                });

                if (logError) {
                    ErrorHandlerUtil.logError(baseError);
                }

                if (fallback !== undefined) {
                    return fallback;
                }

                throw baseError;
            }
        };
    };
}

/**
 * 同步方法錯誤處理裝飾器
 */
export function HandleErrorSync(
    fallback?: any,
    logError: boolean = true
) {
    return function (
        target: any,
        propertyName: string,
        descriptor: PropertyDescriptor
    ) {
        const method = descriptor.value;

        descriptor.value = function (...args: any[]) {
            try {
                return method.apply(this, args);
            } catch (error) {
                const baseError = ErrorHandlerUtil.toBaseError(error, {
                    className: target.constructor.name,
                    methodName: propertyName,
                    arguments: args
                });

                if (logError) {
                    ErrorHandlerUtil.logError(baseError);
                }

                if (fallback !== undefined) {
                    return fallback;
                }

                throw baseError;
            }
        };
    };
}