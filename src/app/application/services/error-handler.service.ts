import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

/**
 * 統一錯誤處理服務
 * 提供高效的錯誤處理和效能監控
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  // 錯誤緩存，避免重複顯示相同錯誤
  private errorCache = new Map<string, { message: string; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5分鐘

  constructor(private message: NzMessageService) {}

  /**
   * 處理認證錯誤
   */
  handleAuthError(error: any, operation: string): void {
    const errorKey = `${operation}_${this.getErrorKey(error)}`;
    const cached = this.errorCache.get(errorKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return; // 避免重複顯示相同錯誤
    }

    const errorMessage = this.formatAuthErrorMessage(error, operation);
    this.message.error(errorMessage);
    
    this.errorCache.set(errorKey, {
      message: errorMessage,
      timestamp: Date.now()
    });
  }

  /**
   * 處理一般錯誤
   */
  handleError(error: any, operation: string): Error {
    const errorMessage = this.formatErrorMessage(error, operation);
    console.error(`${operation} failed:`, error);
    
    return new Error(errorMessage);
  }

  /**
   * 處理警告
   */
  handleWarning(warning: string, operation: string): void {
    const warningKey = `${operation}_${warning}`;
    const cached = this.errorCache.get(warningKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return;
    }

    this.message.warning(`${operation}: ${warning}`);
    
    this.errorCache.set(warningKey, {
      message: warning,
      timestamp: Date.now()
    });
  }

  /**
   * 處理成功消息
   */
  handleSuccess(message: string): void {
    this.message.success(message);
  }

  /**
   * 清除錯誤緩存
   */
  clearErrorCache(): void {
    this.errorCache.clear();
  }

  /**
   * 清理過期的錯誤緩存
   */
  cleanupExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.errorCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.errorCache.delete(key);
      }
    }
  }

  // 私有方法：格式化認證錯誤消息
  private formatAuthErrorMessage(error: any, operation: string): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/user-not-found':
          return '用戶不存在';
        case 'auth/wrong-password':
          return '密碼錯誤';
        case 'auth/email-already-in-use':
          return '郵箱已被使用';
        case 'auth/weak-password':
          return '密碼強度不足';
        case 'auth/invalid-email':
          return '郵箱格式無效';
        case 'auth/too-many-requests':
          return '請求過於頻繁，請稍後再試';
        default:
          return `${operation}失敗: ${error.message || '未知錯誤'}`;
      }
    }
    
    return `${operation}失敗: ${error instanceof Error ? error.message : '未知錯誤'}`;
  }

  // 私有方法：格式化一般錯誤消息
  private formatErrorMessage(error: any, operation: string): string {
    if (error instanceof Error) {
      return `Failed to ${operation}: ${error.message}`;
    }
    
    if (typeof error === 'string') {
      return `Failed to ${operation}: ${error}`;
    }
    
    return `Failed to ${operation}: Unknown error occurred`;
  }

  // 私有方法：生成錯誤鍵
  private getErrorKey(error: any): string {
    if (error?.code) {
      return error.code;
    }
    
    if (error instanceof Error) {
      return error.message;
    }
    
    return String(error);
  }
} 