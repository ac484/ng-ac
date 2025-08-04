/**
 * 網路錯誤類別
 * 用於處理網路連線和 HTTP 請求相關的錯誤
 */

import { BaseError } from './base-error';

export class NetworkError extends BaseError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 503;

  constructor(
    message: string,
    public readonly httpStatus?: number,
    public readonly url?: string,
    public readonly method?: string,
    cause?: Error,
    context?: Record<string, any>
  ) {
    super(message, cause, context);
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  override getUserMessage(): string {
    if (this.httpStatus) {
      return this.getHttpStatusMessage(this.httpStatus);
    }
    return this.message || '網路連線錯誤，請檢查您的網路連線';
  }

  /**
   * 取得 HTTP 狀態碼對應的用戶友好訊息
   */
  private getHttpStatusMessage(status: number): string {
    const statusMessages: Record<number, string> = {
      400: '請求參數錯誤',
      401: '未授權，請重新登入',
      403: '權限不足，無法執行此操作',
      404: '請求的資源不存在',
      405: '不支援的請求方法',
      408: '請求逾時，請稍後再試',
      409: '資源衝突，請重新整理後再試',
      410: '請求的資源已不存在',
      413: '請求內容過大',
      414: '請求網址過長',
      415: '不支援的媒體類型',
      422: '請求參數驗證失敗',
      429: '請求過於頻繁，請稍後再試',
      500: '伺服器內部錯誤',
      501: '功能尚未實作',
      502: '閘道錯誤',
      503: '服務暫時無法使用',
      504: '閘道逾時',
      505: '不支援的 HTTP 版本'
    };

    return statusMessages[status] || `HTTP 錯誤 ${status}`;
  }

  /**
   * 判斷是否為可重試的錯誤
   */
  override isRetryable(): boolean {
    if (this.httpStatus) {
      // 5xx 錯誤和某些 4xx 錯誤可以重試
      const retryableStatuses = [408, 429, 500, 502, 503, 504];
      return retryableStatuses.includes(this.httpStatus);
    }

    // 網路連線錯誤通常可以重試
    if (this.cause) {
      const errorMessage = this.cause.message.toLowerCase();
      const retryableErrors = ['network', 'timeout', 'connection', 'unreachable', 'refused', 'reset'];

      return retryableErrors.some(keyword => errorMessage.includes(keyword));
    }

    return true; // 預設網路錯誤可以重試
  }

  /**
   * 取得建議的重試延遲時間（毫秒）
   */
  override getRetryDelay(): number {
    if (this.httpStatus === 429) {
      // 請求過於頻繁，延遲較長時間
      return 5000;
    } else if (this.httpStatus && this.httpStatus >= 500) {
      // 伺服器錯誤，延遲中等時間
      return 3000;
    }

    return 1000; // 預設延遲時間
  }

  /**
   * 建立連線錯誤
   */
  static connectionError(url?: string, cause?: Error, context?: Record<string, any>): NetworkError {
    const message = '無法連線到伺服器，請檢查您的網路連線';
    return new NetworkError(message, undefined, url, undefined, cause, context);
  }

  /**
   * 建立逾時錯誤
   */
  static timeoutError(url?: string, method?: string, context?: Record<string, any>): NetworkError {
    const message = '請求逾時，請稍後再試';
    return new NetworkError(message, 408, url, method, undefined, context);
  }

  /**
   * 建立 HTTP 錯誤
   */
  static httpError(status: number, statusText: string, url?: string, method?: string, context?: Record<string, any>): NetworkError {
    const message = `HTTP ${status}: ${statusText}`;
    return new NetworkError(message, status, url, method, undefined, context);
  }

  /**
   * 建立無網路連線錯誤
   */
  static offlineError(context?: Record<string, any>): NetworkError {
    const message = '目前無網路連線，請檢查您的網路設定';
    return new NetworkError(message, undefined, undefined, undefined, undefined, context);
  }

  /**
   * 建立 CORS 錯誤
   */
  static corsError(url?: string, context?: Record<string, any>): NetworkError {
    const message = '跨域請求被阻擋，請聯繫系統管理員';
    return new NetworkError(message, undefined, url, undefined, undefined, context);
  }

  /**
   * 建立 SSL 錯誤
   */
  static sslError(url?: string, cause?: Error, context?: Record<string, any>): NetworkError {
    const message = 'SSL 憑證錯誤，連線不安全';
    return new NetworkError(message, undefined, url, undefined, cause, context);
  }

  /**
   * 建立 DNS 錯誤
   */
  static dnsError(url?: string, cause?: Error, context?: Record<string, any>): NetworkError {
    const message = '無法解析網域名稱，請檢查網路設定';
    return new NetworkError(message, undefined, url, undefined, cause, context);
  }

  /**
   * 建立請求被中止錯誤
   */
  static abortedError(url?: string, method?: string, context?: Record<string, any>): NetworkError {
    const message = '請求被中止';
    return new NetworkError(message, undefined, url, method, undefined, context);
  }

  /**
   * 建立請求過大錯誤
   */
  static payloadTooLargeError(size: number, maxSize: number, context?: Record<string, any>): NetworkError {
    const message = `請求內容過大（${size} bytes），最大允許 ${maxSize} bytes`;
    return new NetworkError(message, 413, undefined, undefined, undefined, context);
  }

  /**
   * 建立速率限制錯誤
   */
  static rateLimitError(retryAfter?: number, context?: Record<string, any>): NetworkError {
    const message = retryAfter ? `請求過於頻繁，請在 ${retryAfter} 秒後再試` : '請求過於頻繁，請稍後再試';

    return new NetworkError(message, 429, undefined, undefined, undefined, { ...context, retryAfter });
  }

  /**
   * 從 HTTP 錯誤回應建立網路錯誤
   */
  static fromHttpResponse(
    response: {
      status: number;
      statusText: string;
      url?: string;
      headers?: Record<string, string>;
    },
    method?: string,
    context?: Record<string, any>
  ): NetworkError {
    const retryAfter = response.headers?.['retry-after'];
    const contextWithHeaders = {
      ...context,
      headers: response.headers,
      retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined
    };

    return NetworkError.httpError(response.status, response.statusText, response.url, method, contextWithHeaders);
  }
}
