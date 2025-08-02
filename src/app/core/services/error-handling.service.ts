import { Injectable, inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

// Firebase 錯誤代碼型別定義
export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'unavailable'
  | 'unauthenticated'
  | 'failed-precondition'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'data-loss'
  | 'unknown';

// Firebase 錯誤介面
export interface FirebaseError {
  code: FirebaseErrorCode;
  message: string;
  details?: any;
}

@Injectable({ providedIn: 'root' })
export class ErrorHandlingService {
  private message = inject(NzMessageService);

  // 型別安全的錯誤代碼檢查
  private isFirebaseError(error: any): error is FirebaseError {
    return error && typeof error.code === 'string' && typeof error.message === 'string';
  }

  // 統一的錯誤處理方法
  handleFirestoreError(error: any, context: string): void {
    console.error(`${context} 錯誤:`, error);
    
    if (this.isFirebaseError(error)) {
      this.handleFirebaseError(error, context);
    } else {
      this.message.error('網路連接問題，請檢查網路狀態');
    }
  }

  // Firebase 錯誤處理
  private handleFirebaseError(error: FirebaseError, context: string): void {
    const errorMessages: Record<FirebaseErrorCode, string> = {
      'permission-denied': '權限不足，請檢查 Firestore 安全規則',
      'unavailable': 'Firestore 服務暫時無法使用，請稍後再試',
      'unauthenticated': '未驗證用戶，請重新登入',
      'failed-precondition': 'Firestore 索引可能需要建立，請檢查控制台',
      'not-found': '請求的資源不存在',
      'already-exists': '資源已存在',
      'resource-exhausted': '資源耗盡，請稍後再試',
      'aborted': '操作被中止',
      'out-of-range': '請求超出範圍',
      'unimplemented': '功能未實現',
      'internal': '內部服務錯誤',
      'data-loss': '數據丟失',
      'unknown': '未知錯誤'
    };

    const message = errorMessages[error.code] || `操作失敗: ${error.message || '未知錯誤'}`;
    this.message.error(message);
  }

  // 通用錯誤處理
  handleError(error: any, context: string): void {
    console.error(`${context} 錯誤:`, error);
    
    if (error instanceof Error) {
      this.message.error(`${context} 失敗: ${error.message}`);
    } else if (typeof error === 'string') {
      this.message.error(error);
    } else {
      this.message.error(`${context} 發生未知錯誤`);
    }
  }

  // 成功消息
  showSuccess(message: string): void {
    this.message.success(message);
  }

  // 警告消息
  showWarning(message: string): void {
    this.message.warning(message);
  }

  // 信息消息
  showInfo(message: string): void {
    this.message.info(message);
  }
} 