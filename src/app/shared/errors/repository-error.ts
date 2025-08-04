/**
 * 儲存庫錯誤類別
 * 用於處理資料存取層的錯誤
 */

import { BaseError } from './base-error';

export class RepositoryError extends BaseError {
  readonly code = 'REPOSITORY_ERROR';
  readonly statusCode = 500;

  constructor(
    message: string,
    public readonly operation?: string,
    public readonly collection?: string,
    cause?: Error,
    context?: Record<string, any>
  ) {
    super(message, cause, context);
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  override getUserMessage(): string {
    if (this.operation && this.collection) {
      return `資料庫操作失敗：無法${this.getOperationDisplayName(this.operation)}${this.getCollectionDisplayName(this.collection)}`;
    } else if (this.operation) {
      return `資料庫操作失敗：${this.getOperationDisplayName(this.operation)}失敗`;
    }
    return '資料庫操作失敗，請稍後再試';
  }

  /**
   * 取得操作的顯示名稱
   */
  private getOperationDisplayName(operation: string): string {
    const operationNames: Record<string, string> = {
      find: '查詢',
      findById: '查詢',
      findAll: '查詢',
      save: '儲存',
      create: '創建',
      update: '更新',
      delete: '刪除',
      count: '計數',
      exists: '檢查存在',
      search: '搜尋',
      aggregate: '聚合查詢',
      transaction: '交易處理'
    };

    return operationNames[operation] || operation;
  }

  /**
   * 取得集合的顯示名稱
   */
  private getCollectionDisplayName(collection: string): string {
    const collectionNames: Record<string, string> = {
      users: '用戶資料',
      accounts: '帳戶資料',
      transactions: '交易資料',
      contracts: '合約資料',
      customers: '客戶資料',
      principals: '委託人資料',
      documents: '文件資料',
      files: '檔案資料',
      reports: '報表資料',
      settings: '設定資料',
      roles: '角色資料',
      permissions: '權限資料',
      logs: '日誌資料'
    };

    return collectionNames[collection] || collection;
  }

  /**
   * 判斷是否為可重試的錯誤
   */
  override isRetryable(): boolean {
    // 網路相關錯誤通常可以重試
    if (this.cause) {
      const errorMessage = this.cause.message.toLowerCase();
      const retryableErrors = ['network', 'timeout', 'connection', 'unavailable', 'temporary', 'retry'];

      return retryableErrors.some(keyword => errorMessage.includes(keyword));
    }

    // 讀取操作通常可以重試
    const retryableOperations = ['find', 'findById', 'findAll', 'count', 'exists', 'search'];
    return this.operation ? retryableOperations.includes(this.operation) : false;
  }

  /**
   * 建立查詢錯誤
   */
  static findError(collection: string, reason?: string, cause?: Error, context?: Record<string, any>): RepositoryError {
    const message = reason || `查詢 ${collection} 失敗`;
    return new RepositoryError(message, 'find', collection, cause, context);
  }

  /**
   * 建立儲存錯誤
   */
  static saveError(collection: string, reason?: string, cause?: Error, context?: Record<string, any>): RepositoryError {
    const message = reason || `儲存 ${collection} 失敗`;
    return new RepositoryError(message, 'save', collection, cause, context);
  }

  /**
   * 建立刪除錯誤
   */
  static deleteError(collection: string, reason?: string, cause?: Error, context?: Record<string, any>): RepositoryError {
    const message = reason || `刪除 ${collection} 失敗`;
    return new RepositoryError(message, 'delete', collection, cause, context);
  }

  /**
   * 建立連線錯誤
   */
  static connectionError(reason?: string, cause?: Error, context?: Record<string, any>): RepositoryError {
    const message = reason || '資料庫連線失敗';
    return new RepositoryError(message, 'connection', undefined, cause, context);
  }

  /**
   * 建立逾時錯誤
   */
  static timeoutError(operation: string, collection?: string, context?: Record<string, any>): RepositoryError {
    const message = collection ? `${operation} ${collection} 操作逾時` : `${operation} 操作逾時`;

    return new RepositoryError(message, operation, collection, undefined, context);
  }

  /**
   * 建立權限錯誤
   */
  static permissionError(operation: string, collection: string, context?: Record<string, any>): RepositoryError {
    const message = `沒有權限對 ${collection} 執行 ${operation} 操作`;
    return new RepositoryError(message, operation, collection, undefined, context);
  }

  /**
   * 建立資料完整性錯誤
   */
  static integrityError(collection: string, constraint: string, context?: Record<string, any>): RepositoryError {
    const message = `資料完整性約束違反：${constraint}`;
    return new RepositoryError(message, 'save', collection, undefined, context);
  }

  /**
   * 建立重複鍵錯誤
   */
  static duplicateKeyError(collection: string, key: string, value: string, context?: Record<string, any>): RepositoryError {
    const message = `重複的鍵值：${key} = ${value}`;
    return new RepositoryError(message, 'save', collection, undefined, context);
  }

  /**
   * 建立 Firebase 特定錯誤
   */
  static firebaseError(operation: string, collection: string, firebaseError: any, context?: Record<string, any>): RepositoryError {
    let message = `Firebase 操作失敗`;

    if (firebaseError.code) {
      switch (firebaseError.code) {
        case 'permission-denied':
          message = '權限不足，無法執行此操作';
          break;
        case 'not-found':
          message = '找不到指定的資源';
          break;
        case 'already-exists':
          message = '資源已存在';
          break;
        case 'resource-exhausted':
          message = '資源配額已用盡';
          break;
        case 'failed-precondition':
          message = '操作前置條件不滿足';
          break;
        case 'aborted':
          message = '操作被中止';
          break;
        case 'out-of-range':
          message = '參數超出範圍';
          break;
        case 'unimplemented':
          message = '功能尚未實作';
          break;
        case 'internal':
          message = '內部伺服器錯誤';
          break;
        case 'unavailable':
          message = '服務暫時無法使用';
          break;
        case 'data-loss':
          message = '資料遺失或損壞';
          break;
        default:
          message = firebaseError.message || message;
      }
    }

    return new RepositoryError(message, operation, collection, firebaseError, { ...context, firebaseCode: firebaseError.code });
  }
}
