/**
 * 型別轉換工具
 * 統一處理型別轉換和空值處理，解決型別不一致問題
 */

import { AmountValue, FormattedAmount, ContractStatus, TypeConversionResult } from '../types/contract.types';

/**
 * 金額格式化工具
 */
export class AmountConverter {
  private static readonly CURRENCY = 'TWD';
  private static readonly LOCALE = 'zh-TW';

  /**
   * 格式化金額
   */
  static format(value: AmountValue): FormattedAmount {
    if (value === null || value === undefined) {
      return {
        value: null,
        formatted: '',
        currency: this.CURRENCY
      };
    }

    const formatted = new Intl.NumberFormat(this.LOCALE, {
      style: 'currency',
      currency: this.CURRENCY,
      minimumFractionDigits: 0
    }).format(value);

    return {
      value,
      formatted,
      currency: this.CURRENCY
    };
  }

  /**
   * 解析金額字符串
   */
  static parse(value: string): TypeConversionResult<AmountValue> {
    if (!value || value.trim() === '') {
      return { success: true, data: null };
    }

    try {
      // 移除貨幣符號和千分位符號
      const cleanValue = value.replace(/NT\$\s?|(,*)/g, '');
      const parsed = parseFloat(cleanValue);
      
      if (isNaN(parsed)) {
        return { 
          success: false, 
          error: '無效的金額格式' 
        };
      }

      return { success: true, data: parsed };
    } catch (error) {
      return { 
        success: false, 
        error: '金額解析失敗' 
      };
    }
  }

  /**
   * 驗證金額範圍
   */
  static validateRange(value: AmountValue, min?: AmountValue, max?: AmountValue): TypeConversionResult<AmountValue> {
    if (value === null || value === undefined) {
      return { success: true, data: null };
    }

    if (min !== undefined && min !== null && value < min) {
      return { 
        success: false, 
        error: `金額不能小於 ${this.format(min).formatted}` 
      };
    }

    if (max !== undefined && max !== null && value > max) {
      return { 
        success: false, 
        error: `金額不能大於 ${this.format(max).formatted}` 
      };
    }

    return { success: true, data: value };
  }
}

/**
 * 狀態轉換工具
 */
export class StatusConverter {
  private static readonly STATUS_MAP: Record<ContractStatus, { label: string; color: string }> = {
    'draft': { label: '草稿', color: 'default' },
    'preparing': { label: '籌備中', color: 'processing' },
    'active': { label: '進行中', color: 'processing' },
    'completed': { label: '已完成', color: 'success' }
  };

  /**
   * 獲取狀態標籤
   */
  static getLabel(status: ContractStatus): string {
    return this.STATUS_MAP[status]?.label || status;
  }

  /**
   * 獲取狀態顏色
   */
  static getColor(status: ContractStatus): string {
    return this.STATUS_MAP[status]?.color || 'default';
  }

  /**
   * 驗證狀態轉換
   */
  static canTransition(from: ContractStatus, to: ContractStatus): boolean {
    const transitions: Record<ContractStatus, ContractStatus[]> = {
      'draft': ['preparing', 'active'],
      'preparing': ['active', 'draft'],
      'active': ['completed', 'preparing'],
      'completed': []
    };

    return transitions[from]?.includes(to) || false;
  }

  /**
   * 獲取允許的狀態轉換
   */
  static getAllowedTransitions(currentStatus: ContractStatus): ContractStatus[] {
    const transitions: Record<ContractStatus, ContractStatus[]> = {
      'draft': ['preparing', 'active'],
      'preparing': ['active', 'draft'],
      'active': ['completed', 'preparing'],
      'completed': []
    };

    return transitions[currentStatus] || [];
  }
}

/**
 * 進度轉換工具
 */
export class ProgressConverter {
  /**
   * 驗證進度值
   */
  static validate(value: number): TypeConversionResult<number> {
    if (value < 0 || value > 100) {
      return { 
        success: false, 
        error: '進度值必須在 0-100 之間' 
      };
    }

    return { success: true, data: Math.round(value) };
  }

  /**
   * 格式化進度
   */
  static format(value: number): string {
    const validated = this.validate(value);
    if (!validated.success) {
      return '0%';
    }
    return `${validated.data}%`;
  }

  /**
   * 獲取進度狀態
   */
  static getStatus(value: number): 'success' | 'active' | 'exception' {
    if (value === 100) return 'success';
    if (value >= 0) return 'active';
    return 'exception';
  }
}

/**
 * 通用型別轉換工具
 */
export class TypeConverter {
  /**
   * 安全轉換為數字
   */
  static toNumber(value: any): TypeConversionResult<number> {
    if (value === null || value === undefined || value === '') {
      return { success: true, data: 0 };
    }

    const parsed = Number(value);
    if (isNaN(parsed)) {
      return { 
        success: false, 
        error: '無法轉換為數字' 
      };
    }

    return { success: true, data: parsed };
  }

  /**
   * 安全轉換為字符串
   */
  static toString(value: any): TypeConversionResult<string> {
    if (value === null || value === undefined) {
      return { success: true, data: '' };
    }

    return { success: true, data: String(value) };
  }

  /**
   * 安全轉換為布爾值
   */
  static toBoolean(value: any): TypeConversionResult<boolean> {
    if (value === null || value === undefined) {
      return { success: true, data: false };
    }

    if (typeof value === 'boolean') {
      return { success: true, data: value };
    }

    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      return { 
        success: true, 
        data: lower === 'true' || lower === '1' || lower === 'yes' 
      };
    }

    return { success: true, data: Boolean(value) };
  }

  /**
   * 深度克隆對象
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (obj instanceof Date) {
      return new Date(obj.getTime()) as T;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }

    return cloned;
  }
} 