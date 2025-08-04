/**
 * 資源不存在錯誤類別
 * 用於處理找不到指定資源的情況
 */

import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;

  constructor(
    message: string,
    public readonly resourceType?: string,
    public readonly resourceId?: string,
    cause?: Error,
    context?: Record<string, any>
  ) {
    super(message, cause, context);
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  override getUserMessage(): string {
    if (this.resourceType && this.resourceId) {
      return `找不到指定的${this.getResourceDisplayName(this.resourceType)}（ID: ${this.resourceId}）`;
    } else if (this.resourceType) {
      return `找不到指定的${this.getResourceDisplayName(this.resourceType)}`;
    }
    return this.message;
  }

  /**
   * 取得資源類型的顯示名稱
   */
  private getResourceDisplayName(resourceType: string): string {
    const resourceNames: Record<string, string> = {
      user: '用戶',
      account: '帳戶',
      transaction: '交易',
      contract: '合約',
      customer: '客戶',
      principal: '委託人',
      document: '文件',
      file: '檔案',
      report: '報表',
      setting: '設定',
      role: '角色',
      permission: '權限'
    };

    return resourceNames[resourceType] || resourceType;
  }

  /**
   * 建立用戶不存在錯誤
   */
  static userNotFound(userId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`用戶不存在`, 'user', userId, undefined, context);
  }

  /**
   * 建立帳戶不存在錯誤
   */
  static accountNotFound(accountId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`帳戶不存在`, 'account', accountId, undefined, context);
  }

  /**
   * 建立交易不存在錯誤
   */
  static transactionNotFound(transactionId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`交易不存在`, 'transaction', transactionId, undefined, context);
  }

  /**
   * 建立合約不存在錯誤
   */
  static contractNotFound(contractId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`合約不存在`, 'contract', contractId, undefined, context);
  }

  /**
   * 建立客戶不存在錯誤
   */
  static customerNotFound(customerId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`客戶不存在`, 'customer', customerId, undefined, context);
  }

  /**
   * 建立委託人不存在錯誤
   */
  static principalNotFound(principalId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`委託人不存在`, 'principal', principalId, undefined, context);
  }

  /**
   * 建立文件不存在錯誤
   */
  static documentNotFound(documentId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`文件不存在`, 'document', documentId, undefined, context);
  }

  /**
   * 建立通用資源不存在錯誤
   */
  static resourceNotFound(resourceType: string, resourceId: string, context?: Record<string, any>): NotFoundError {
    return new NotFoundError(`資源不存在`, resourceType, resourceId, undefined, context);
  }
}
