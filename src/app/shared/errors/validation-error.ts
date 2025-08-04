/**
 * 驗證錯誤類別
 * 用於處理資料驗證失敗的情況
 */

import { BaseError } from './base-error';

export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;

  constructor(
    message: string,
    public readonly field?: string,
    public readonly validationRules?: ValidationRule[],
    cause?: Error,
    context?: Record<string, any>
  ) {
    super(message, cause, context);
  }

  /**
   * 取得用戶友好的錯誤訊息
   */
  override getUserMessage(): string {
    if (this.field && this.validationRules && this.validationRules.length > 0) {
      const rule = this.validationRules[0];
      return this.getFieldErrorMessage(this.field, rule);
    }
    return this.message;
  }

  /**
   * 取得欄位特定的錯誤訊息
   */
  private getFieldErrorMessage(field: string, rule: ValidationRule): string {
    const fieldName = this.getFieldDisplayName(field);

    switch (rule.type) {
      case 'required':
        return `${fieldName} 為必填項目`;
      case 'email':
        return `${fieldName} 格式不正確`;
      case 'minLength':
        return `${fieldName} 至少需要 ${rule.value} 個字元`;
      case 'maxLength':
        return `${fieldName} 不能超過 ${rule.value} 個字元`;
      case 'min':
        return `${fieldName} 不能小於 ${rule.value}`;
      case 'max':
        return `${fieldName} 不能大於 ${rule.value}`;
      case 'pattern':
        return `${fieldName} 格式不正確`;
      case 'unique':
        return `${fieldName} 已存在，請使用其他值`;
      case 'custom':
        return rule.message || `${fieldName} 驗證失敗`;
      default:
        return `${fieldName} 驗證失敗`;
    }
  }

  /**
   * 取得欄位顯示名稱
   */
  private getFieldDisplayName(field: string): string {
    const fieldNames: Record<string, string> = {
      email: '電子郵件',
      password: '密碼',
      displayName: '顯示名稱',
      firstName: '名字',
      lastName: '姓氏',
      phoneNumber: '電話號碼',
      address: '地址',
      amount: '金額',
      description: '描述',
      category: '分類',
      accountName: '帳戶名稱',
      transactionType: '交易類型',
      currency: '貨幣',
      referenceNumber: '參考編號'
    };

    return fieldNames[field] || field;
  }

  /**
   * 建立多個欄位驗證錯誤
   */
  static createMultipleFieldErrors(
    errors: Array<{ field: string; rules: ValidationRule[] }>,
    context?: Record<string, any>
  ): ValidationError {
    const firstError = errors[0];
    const message = `驗證失敗：${errors.length} 個欄位有錯誤`;

    return new ValidationError(message, firstError.field, firstError.rules, undefined, { ...context, allErrors: errors });
  }

  /**
   * 建立單一欄位驗證錯誤
   */
  static createFieldError(field: string, rule: ValidationRule, context?: Record<string, any>): ValidationError {
    const message = `欄位 ${field} 驗證失敗`;

    return new ValidationError(message, field, [rule], undefined, context);
  }
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'min' | 'max' | 'pattern' | 'unique' | 'custom';
  value?: any;
  message?: string;
}

/**
 * 常用的驗證規則建立器
 */
export class ValidationRules {
  static required(): ValidationRule {
    return { type: 'required' };
  }

  static email(): ValidationRule {
    return { type: 'email' };
  }

  static minLength(length: number): ValidationRule {
    return { type: 'minLength', value: length };
  }

  static maxLength(length: number): ValidationRule {
    return { type: 'maxLength', value: length };
  }

  static min(value: number): ValidationRule {
    return { type: 'min', value };
  }

  static max(value: number): ValidationRule {
    return { type: 'max', value };
  }

  static pattern(pattern: string | RegExp): ValidationRule {
    return { type: 'pattern', value: pattern };
  }

  static unique(): ValidationRule {
    return { type: 'unique' };
  }

  static custom(message: string): ValidationRule {
    return { type: 'custom', message };
  }
}
