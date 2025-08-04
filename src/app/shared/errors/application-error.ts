/**
 * 應用程式錯誤類別
 * 用於處理業務邏輯和應用程式層面的錯誤
 */

import { BaseError } from './base-error';

export class ApplicationError extends BaseError {
  readonly code = 'APPLICATION_ERROR';
  readonly statusCode = 500;

  constructor(
    message: string,
    public readonly operation?: string,
    cause?: Error,
    context?: Record<string, any>
  ) {
    super(message, cause, context);
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  override getUserMessage(): string {
    if (this.operation) {
      return `${this.getOperationDisplayName(this.operation)}失敗：${this.message}`;
    }
    return this.message;
  }

  /**
   * 取得操作的顯示名稱
   */
  private getOperationDisplayName(operation: string): string {
    const operationNames: Record<string, string> = {
      create: '創建',
      update: '更新',
      delete: '刪除',
      save: '儲存',
      load: '載入',
      search: '搜尋',
      export: '匯出',
      import: '匯入',
      process: '處理',
      validate: '驗證',
      authenticate: '認證',
      authorize: '授權',
      login: '登入',
      logout: '登出',
      register: '註冊',
      resetPassword: '重設密碼',
      changePassword: '變更密碼',
      sendEmail: '發送郵件',
      uploadFile: '上傳檔案',
      downloadFile: '下載檔案',
      generateReport: '產生報表',
      calculateBalance: '計算餘額',
      processTransaction: '處理交易',
      createContract: '建立合約',
      updateContract: '更新合約',
      signContract: '簽署合約'
    };

    return operationNames[operation] || operation;
  }

  /**
   * 判斷是否為可重試的錯誤
   */
  override isRetryable(): boolean {
    // 某些操作可以重試
    const retryableOperations = [
      'save',
      'load',
      'search',
      'export',
      'sendEmail',
      'uploadFile',
      'downloadFile',
      'generateReport',
      'calculateBalance'
    ];

    return this.operation ? retryableOperations.includes(this.operation) : false;
  }

  /**
   * 建立創建操作錯誤
   */
  static createFailed(resourceType: string, reason?: string, cause?: Error, context?: Record<string, any>): ApplicationError {
    const message = reason || `創建${resourceType}失敗`;
    return new ApplicationError(message, 'create', cause, context);
  }

  /**
   * 建立更新操作錯誤
   */
  static updateFailed(resourceType: string, reason?: string, cause?: Error, context?: Record<string, any>): ApplicationError {
    const message = reason || `更新${resourceType}失敗`;
    return new ApplicationError(message, 'update', cause, context);
  }

  /**
   * 建立刪除操作錯誤
   */
  static deleteFailed(resourceType: string, reason?: string, cause?: Error, context?: Record<string, any>): ApplicationError {
    const message = reason || `刪除${resourceType}失敗`;
    return new ApplicationError(message, 'delete', cause, context);
  }

  /**
   * 建立載入操作錯誤
   */
  static loadFailed(resourceType: string, reason?: string, cause?: Error, context?: Record<string, any>): ApplicationError {
    const message = reason || `載入${resourceType}失敗`;
    return new ApplicationError(message, 'load', cause, context);
  }

  /**
   * 建立搜尋操作錯誤
   */
  static searchFailed(resourceType: string, reason?: string, cause?: Error, context?: Record<string, any>): ApplicationError {
    const message = reason || `搜尋${resourceType}失敗`;
    return new ApplicationError(message, 'search', cause, context);
  }

  /**
   * 建立業務邏輯錯誤
   */
  static businessLogicError(message: string, operation?: string, context?: Record<string, any>): ApplicationError {
    return new ApplicationError(message, operation, undefined, context);
  }

  /**
   * 建立權限不足錯誤
   */
  static insufficientPermissions(operation: string, resource?: string, context?: Record<string, any>): ApplicationError {
    const message = resource ? `沒有權限對 ${resource} 執行 ${operation} 操作` : `沒有權限執行 ${operation} 操作`;

    return new ApplicationError(message, 'authorize', undefined, context);
  }

  /**
   * 建立狀態不正確錯誤
   */
  static invalidState(currentState: string, expectedState: string, resource?: string, context?: Record<string, any>): ApplicationError {
    const resourceText = resource ? `${resource}的` : '';
    const message = `${resourceText}狀態不正確，當前狀態：${currentState}，期望狀態：${expectedState}`;

    return new ApplicationError(message, 'validate', undefined, context);
  }

  /**
   * 建立並發衝突錯誤
   */
  static concurrencyConflict(resource: string, context?: Record<string, any>): ApplicationError {
    const message = `${resource} 已被其他用戶修改，請重新載入後再試`;

    return new ApplicationError(message, 'update', undefined, context);
  }
}
