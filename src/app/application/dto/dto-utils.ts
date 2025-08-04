/**
 * 簡化的 DTO 工具函數
 * 提供基本的 DTO 轉換和處理工具，遵循"簡化優於完美"的原則
 */

import { ListResponseDto, OperationResultDto, ValidationResultDto } from './base.dto';

/**
 * 將 Date 物件轉換為 ISO 字串
 */
export function dateToISOString(date: Date | null | undefined): string | undefined {
  return date ? date.toISOString() : undefined;
}

/**
 * 將 ISO 字串轉換為 Date 物件
 */
export function isoStringToDate(isoString: string | null | undefined): Date | undefined {
  return isoString ? new Date(isoString) : undefined;
}

/**
 * 創建標準化的列表回應
 */
export function createListResponse<T>(items: T[], total: number, page: number, pageSize: number): ListResponseDto<T> {
  return {
    items,
    total,
    page,
    pageSize,
    hasNext: page * pageSize < total,
    hasPrevious: page > 1
  };
}

/**
 * 創建標準化的操作結果回應
 */
export function createOperationResult(success: boolean, message?: string, data?: any, errors?: string[]): OperationResultDto {
  return {
    success,
    message,
    data,
    errors
  };
}

/**
 * 創建標準化的驗證結果回應
 */
export function createValidationResult(
  isValid: boolean,
  errors: string[] = [],
  warnings: string[] = [],
  fieldErrors?: Record<string, string[]>
): ValidationResultDto {
  return {
    isValid,
    errors,
    warnings,
    fieldErrors
  };
}

/**
 * 移除物件中的 undefined 屬性
 */
export function removeUndefinedProperties<T extends Record<string, any>>(obj: T): Partial<T> {
  const result: Partial<T> = {};

  for (const key in obj) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }

  return result;
}
