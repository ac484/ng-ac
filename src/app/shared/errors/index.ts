/**
 * 錯誤處理模組統一導出
 */

// 基礎錯誤類別
export { BaseError } from './base-error';
export type { ErrorInfo } from './base-error';

// 具體錯誤類別
export { ApplicationError } from './application-error';
export { AuthenticationError } from './authentication-error';
export { NetworkError } from './network-error';
export { NotFoundError } from './not-found-error';
export { RepositoryError } from './repository-error';
export { ValidationError } from './validation-error';
export type { ValidationRule, ValidationRules } from './validation-error';

// 錯誤碼和訊息
export { ERROR_CODES, HTTP_STATUS_TO_ERROR_CODE, ERROR_CODE_TO_HTTP_STATUS } from './error-codes';
export type { ErrorCode } from './error-codes';
export { ERROR_MESSAGES, getErrorMessage, getMultiLanguageErrorMessage } from './error-messages';
export type { Language } from './error-messages';

// 錯誤處理工具
export { ErrorHandlerUtil, HandleError, HandleErrorSync } from './error-handler.util';

// 全域錯誤處理器
export { GlobalErrorHandler } from './global-error-handler';
export type { ErrorSeverity, ErrorHandlingOptions, ErrorStats } from './global-error-handler';

// 常用錯誤創建函數
import { ApplicationError } from './application-error';
import { AuthenticationError } from './authentication-error';
import { NetworkError } from './network-error';
import { NotFoundError } from './not-found-error';
import { RepositoryError } from './repository-error';
import { ValidationError, ValidationRule } from './validation-error';

export const createValidationError = (field: string, rule: ValidationRule, context?: Record<string, any>) =>
  ValidationError.createFieldError(field, rule, context);

export const createNotFoundError = (resourceType: string, resourceId: string, context?: Record<string, any>) =>
  NotFoundError.resourceNotFound(resourceType, resourceId, context);

export const createApplicationError = (message: string, operation?: string, context?: Record<string, any>) =>
  new ApplicationError(message, operation, undefined, context);

export const createAuthenticationError = (message: string, authType?: string, context?: Record<string, any>) =>
  new AuthenticationError(message, authType, undefined, context);

export const createNetworkError = (message: string, status?: number, url?: string, context?: Record<string, any>) =>
  new NetworkError(message, status, url, undefined, undefined, context);

export const createRepositoryError = (message: string, operation?: string, collection?: string, context?: Record<string, any>) =>
  new RepositoryError(message, operation, collection, undefined, context);
