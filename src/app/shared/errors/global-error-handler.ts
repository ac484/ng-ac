/**
 * 全域錯誤處理器
 * 實作 Angular ErrorHandler 介面，提供統一的錯誤處理機制
 */

import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';

import { ApplicationError } from './application-error';
import { AuthenticationError } from './authentication-error';
import { BaseError } from './base-error';
import { ERROR_CODES } from './error-codes';
import { ErrorHandlerUtil } from './error-handler.util';
import { NetworkError } from './network-error';
import { NotFoundError } from './not-found-error';
import { ValidationError } from './validation-error';

/**
 * 錯誤嚴重程度
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * 錯誤處理選項
 */
export interface ErrorHandlingOptions {
  showUserMessage?: boolean;
  logError?: boolean;
  reportError?: boolean;
  severity?: ErrorSeverity;
  context?: Record<string, any>;
}

/**
 * 錯誤統計資訊
 */
export interface ErrorStats {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsByCode: Record<string, number>;
  recentErrors: Array<{
    timestamp: Date;
    type: string;
    message: string;
    severity: ErrorSeverity;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private errorStats: ErrorStats = {
    totalErrors: 0,
    errorsByType: {},
    errorsByCode: {},
    recentErrors: []
  };

  private readonly MAX_RECENT_ERRORS = 50;
  private readonly ERROR_DISPLAY_DURATION = 5000; // 5 秒
  private readonly CRITICAL_ERROR_DURATION = 10000; // 10 秒

  // 錯誤去重機制
  private errorDeduplication = new Map<
    string,
    {
      count: number;
      lastOccurrence: Date;
      firstOccurrence: Date;
    }
  >();

  private readonly DEDUPLICATION_WINDOW = 30000; // 30 秒內相同錯誤視為重複

  constructor(
    private ngZone: NgZone,
    private messageService: NzMessageService,
    private notificationService: NzNotificationService
  ) {
    // 定期清理錯誤統計和去重資料
    this.setupCleanupInterval();
  }

  /**
   * Angular ErrorHandler 介面實作
   */
  handleError(error: any): void {
    // 在 Angular Zone 外執行，避免觸發變更檢測
    this.ngZone.runOutsideAngular(() => {
      this.processError(error, {
        showUserMessage: true,
        logError: true,
        reportError: true,
        severity: this.determineSeverity(error)
      });
    });
  }

  /**
   * 手動處理錯誤（提供更多控制選項）
   */
  handleErrorWithOptions(error: any, options: ErrorHandlingOptions = {}): void {
    const defaultOptions: ErrorHandlingOptions = {
      showUserMessage: true,
      logError: true,
      reportError: false,
      severity: ErrorSeverity.MEDIUM
    };

    const finalOptions = { ...defaultOptions, ...options };
    this.processError(error, finalOptions);
  }

  /**
   * 處理成功訊息
   */
  handleSuccess(message: string, duration?: number): void {
    this.ngZone.run(() => {
      this.messageService.success(message, {
        nzDuration: duration || 3000
      });
    });
  }

  /**
   * 處理警告訊息
   */
  handleWarning(message: string, duration?: number): void {
    this.ngZone.run(() => {
      this.messageService.warning(message, {
        nzDuration: duration || 4000
      });
    });
  }

  /**
   * 處理資訊訊息
   */
  handleInfo(message: string, duration?: number): void {
    this.ngZone.run(() => {
      this.messageService.info(message, {
        nzDuration: duration || 3000
      });
    });
  }

  /**
   * 取得錯誤統計資訊
   */
  getErrorStats(): ErrorStats {
    return { ...this.errorStats };
  }

  /**
   * 清除錯誤統計
   */
  clearErrorStats(): void {
    this.errorStats = {
      totalErrors: 0,
      errorsByType: {},
      errorsByCode: {},
      recentErrors: []
    };
    this.errorDeduplication.clear();
  }

  /**
   * 檢查錯誤是否可重試
   */
  isRetryableError(error: any): boolean {
    return ErrorHandlerUtil.isRetryable(error);
  }

  /**
   * 取得建議的重試延遲時間
   */
  getRetryDelay(error: any): number {
    return ErrorHandlerUtil.getRetryDelay(error);
  }

  /**
   * 核心錯誤處理邏輯
   */
  private processError(error: any, options: ErrorHandlingOptions): void {
    try {
      // 轉換為標準錯誤格式
      const baseError = ErrorHandlerUtil.toBaseError(error, options.context);

      // 檢查錯誤去重
      const errorKey = this.generateErrorKey(baseError);
      const isDuplicate = this.checkAndUpdateDeduplication(errorKey);

      // 更新錯誤統計
      this.updateErrorStats(baseError, options.severity!);

      // 記錄錯誤
      if (options.logError) {
        this.logError(baseError, options, isDuplicate);
      }

      // 顯示用戶訊息（避免重複顯示）
      if (options.showUserMessage && !isDuplicate) {
        this.showUserMessage(baseError, options.severity!);
      }

      // 報告錯誤到外部服務
      if (options.reportError) {
        this.reportError(baseError, options);
      }
    } catch (handlingError) {
      // 錯誤處理器本身出錯時的備用處理
      console.error('[GlobalErrorHandler] Error in error handling:', handlingError);
      console.error('[GlobalErrorHandler] Original error:', error);

      // 顯示通用錯誤訊息
      this.ngZone.run(() => {
        this.messageService.error('系統發生未預期的錯誤，請重新整理頁面或聯繫管理員');
      });
    }
  }

  /**
   * 判斷錯誤嚴重程度
   */
  private determineSeverity(error: any): ErrorSeverity {
    if (error instanceof ValidationError) {
      return ErrorSeverity.LOW;
    }

    if (error instanceof AuthenticationError) {
      return ErrorSeverity.MEDIUM;
    }

    if (error instanceof NotFoundError) {
      return ErrorSeverity.LOW;
    }

    if (error instanceof NetworkError) {
      const networkError = error as NetworkError;
      if (networkError.httpStatus && networkError.httpStatus >= 500) {
        return ErrorSeverity.HIGH;
      }
      return ErrorSeverity.MEDIUM;
    }

    if (error instanceof ApplicationError) {
      return ErrorSeverity.MEDIUM;
    }

    // 未知錯誤視為高嚴重程度
    return ErrorSeverity.HIGH;
  }

  /**
   * 生成錯誤去重鍵
   */
  private generateErrorKey(error: BaseError): string {
    return `${error.constructor.name}:${error.code}:${error.message}`;
  }

  /**
   * 檢查並更新錯誤去重資訊
   */
  private checkAndUpdateDeduplication(errorKey: string): boolean {
    const now = new Date();
    const existing = this.errorDeduplication.get(errorKey);

    if (existing) {
      const timeDiff = now.getTime() - existing.lastOccurrence.getTime();

      if (timeDiff < this.DEDUPLICATION_WINDOW) {
        // 在去重視窗內，更新計數和最後發生時間
        existing.count++;
        existing.lastOccurrence = now;
        return true; // 是重複錯誤
      } else {
        // 超出去重視窗，重置計數
        existing.count = 1;
        existing.lastOccurrence = now;
        existing.firstOccurrence = now;
        return false;
      }
    } else {
      // 新錯誤
      this.errorDeduplication.set(errorKey, {
        count: 1,
        lastOccurrence: now,
        firstOccurrence: now
      });
      return false;
    }
  }

  /**
   * 更新錯誤統計
   */
  private updateErrorStats(error: BaseError, severity: ErrorSeverity): void {
    this.errorStats.totalErrors++;

    // 按類型統計
    const errorType = error.constructor.name;
    this.errorStats.errorsByType[errorType] = (this.errorStats.errorsByType[errorType] || 0) + 1;

    // 按錯誤碼統計
    this.errorStats.errorsByCode[error.code] = (this.errorStats.errorsByCode[error.code] || 0) + 1;

    // 記錄最近錯誤
    this.errorStats.recentErrors.unshift({
      timestamp: new Date(),
      type: errorType,
      message: error.message,
      severity
    });

    // 限制最近錯誤數量
    if (this.errorStats.recentErrors.length > this.MAX_RECENT_ERRORS) {
      this.errorStats.recentErrors = this.errorStats.recentErrors.slice(0, this.MAX_RECENT_ERRORS);
    }
  }

  /**
   * 記錄錯誤
   */
  private logError(error: BaseError, options: ErrorHandlingOptions, isDuplicate: boolean): void {
    const errorInfo = error.getErrorInfo();
    const logData = {
      ...errorInfo,
      severity: options.severity,
      isDuplicate,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      context: options.context
    };

    // 根據嚴重程度選擇不同的日誌級別
    switch (options.severity) {
      case ErrorSeverity.CRITICAL:
        console.error('[CRITICAL ERROR]', logData);
        break;
      case ErrorSeverity.HIGH:
        console.error('[HIGH ERROR]', logData);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('[MEDIUM ERROR]', logData);
        break;
      case ErrorSeverity.LOW:
        console.info('[LOW ERROR]', logData);
        break;
      default:
        console.error('[ERROR]', logData);
    }
  }

  /**
   * 顯示用戶友好的錯誤訊息
   */
  private showUserMessage(error: BaseError, severity: ErrorSeverity): void {
    this.ngZone.run(() => {
      const userMessage = this.getUserFriendlyMessage(error);
      const duration = severity === ErrorSeverity.CRITICAL ? this.CRITICAL_ERROR_DURATION : this.ERROR_DISPLAY_DURATION;

      switch (severity) {
        case ErrorSeverity.CRITICAL:
          this.notificationService.error('嚴重錯誤', userMessage, {
            nzDuration: duration,
            nzPlacement: 'topRight'
          });
          break;

        case ErrorSeverity.HIGH:
          this.notificationService.error('系統錯誤', userMessage, {
            nzDuration: duration,
            nzPlacement: 'topRight'
          });
          break;

        case ErrorSeverity.MEDIUM:
          this.messageService.error(userMessage, {
            nzDuration: duration
          });
          break;

        case ErrorSeverity.LOW:
          this.messageService.warning(userMessage, {
            nzDuration: duration
          });
          break;

        default:
          this.messageService.error(userMessage, {
            nzDuration: duration
          });
      }
    });
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  private getUserFriendlyMessage(error: BaseError): string {
    // 根據錯誤類型和錯誤碼提供用戶友好的訊息
    if (error instanceof ValidationError) {
      return error.getUserMessage() || '輸入資料格式不正確，請檢查後重試';
    }

    if (error instanceof AuthenticationError) {
      return error.getUserMessage() || '身份驗證失敗，請重新登入';
    }

    if (error instanceof NotFoundError) {
      return error.getUserMessage() || '找不到請求的資源';
    }

    if (error instanceof NetworkError) {
      const networkError = error as NetworkError;
      if (networkError.httpStatus === 0) {
        return '網路連線異常，請檢查網路設定';
      }
      if (networkError.httpStatus && networkError.httpStatus >= 500) {
        return '伺服器暫時無法回應，請稍後再試';
      }
      return error.getUserMessage() || '網路請求失敗，請稍後再試';
    }

    if (error instanceof ApplicationError) {
      return error.getUserMessage() || '操作失敗，請稍後再試';
    }

    // 預設訊息
    return '系統發生錯誤，請稍後再試或聯繫管理員';
  }

  /**
   * 報告錯誤到外部服務
   */
  private reportError(error: BaseError, options: ErrorHandlingOptions): void {
    // 這裡可以整合第三方錯誤追蹤服務
    // 例如 Sentry, LogRocket, Bugsnag 等

    try {
      const errorReport = {
        error: error.getErrorInfo(),
        options,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        userId: this.getCurrentUserId(), // 如果有用戶資訊
        sessionId: this.getSessionId() // 如果有會話資訊
      };

      // 示例：發送到錯誤追蹤服務
      // this.sendToErrorTrackingService(errorReport);

      console.log('[Error Report]', errorReport);
    } catch (reportingError) {
      console.error('[GlobalErrorHandler] Failed to report error:', reportingError);
    }
  }

  /**
   * 設定清理定時器
   */
  private setupCleanupInterval(): void {
    // 每 5 分鐘清理一次過期的去重資料
    setInterval(
      () => {
        this.cleanupExpiredDeduplication();
      },
      5 * 60 * 1000
    );
  }

  /**
   * 清理過期的去重資料
   */
  private cleanupExpiredDeduplication(): void {
    const now = new Date();
    const expiredKeys: string[] = [];

    for (const [key, data] of this.errorDeduplication.entries()) {
      const timeDiff = now.getTime() - data.lastOccurrence.getTime();
      if (timeDiff > this.DEDUPLICATION_WINDOW * 2) {
        // 保留兩倍的去重視窗時間
        expiredKeys.push(key);
      }
    }

    expiredKeys.forEach(key => {
      this.errorDeduplication.delete(key);
    });
  }

  /**
   * 取得當前用戶 ID（如果有的話）
   */
  private getCurrentUserId(): string | null {
    // 這裡可以從認證服務取得用戶 ID
    // 例如從 JWT token 或用戶服務中取得
    return null;
  }

  /**
   * 取得會話 ID（如果有的話）
   */
  private getSessionId(): string | null {
    // 這裡可以生成或取得會話 ID
    return null;
  }
}
