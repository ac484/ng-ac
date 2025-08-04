/**
 * 基礎錯誤類別
 * 提供統一的錯誤處理基礎
 */

export abstract class BaseError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;

  constructor(
    message: string,
    public override readonly cause?: Error,
    public readonly context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;

    // 確保錯誤堆疊正確顯示
    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }

  /**
   * 取得錯誤的完整資訊
   */
  getErrorInfo(): ErrorInfo {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: new Date().toISOString(),
      context: this.context,
      cause: this.cause?.message,
      stack: this.stack
    };
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  getUserMessage(): string {
    return this.message;
  }

  /**
   * 判斷是否為可重試的錯誤
   */
  isRetryable(): boolean {
    return false;
  }

  /**
   * 取得建議的重試延遲時間（毫秒）
   */
  getRetryDelay(): number {
    return 1000;
  }
}

export interface ErrorInfo {
  code: string;
  message: string;
  statusCode: number;
  timestamp: string;
  context?: Record<string, any>;
  cause?: string;
  stack?: string;
}
