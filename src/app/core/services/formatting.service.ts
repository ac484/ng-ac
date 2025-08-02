import { Injectable } from '@angular/core';
import { AmountValue, TypeConversionResult } from '../types/contract.types';
import { AmountConverter } from '../utils/type-converter';

@Injectable({ providedIn: 'root' })
export class FormattingService {
  
  /**
   * 格式化金額顯示
   */
  formatAmount(amount: AmountValue): string {
    return AmountConverter.format(amount).formatted;
  }

  /**
   * 解析金額字符串為數字
   */
  parseAmount(value: string): TypeConversionResult<AmountValue> {
    return AmountConverter.parse(value);
  }

  /**
   * 安全地轉換為數字
   */
  toNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }

    const parsed = Number(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * 安全地轉換為字符串
   */
  toString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value);
  }

  /**
   * 驗證並清理搜索參數
   */
  cleanSearchParam<T extends Record<string, any>>(param: T): T {
    const cleaned = { ...param };
    
    // 處理金額字段
    if ('minAmount' in cleaned && typeof cleaned.minAmount === 'string') {
      const result = this.parseAmount(cleaned.minAmount);
      cleaned.minAmount = result.success ? result.data : null;
    }
    
    if ('maxAmount' in cleaned && typeof cleaned.maxAmount === 'string') {
      const result = this.parseAmount(cleaned.maxAmount);
      cleaned.maxAmount = result.success ? result.data : null;
    }

    return cleaned;
  }

  /**
   * 格式化進度百分比
   */
  formatProgress(progress: number): string {
    return `${Math.round(progress)}%`;
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date | string | null): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('zh-TW');
  }

  /**
   * 格式化日期時間
   */
  formatDateTime(date: Date | string | null): string {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('zh-TW');
  }
} 