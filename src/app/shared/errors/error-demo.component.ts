/**
 * 錯誤處理示範組件
 * 用於展示 GlobalErrorHandler 的功能
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { ApplicationError } from './application-error';
import { AuthenticationError } from './authentication-error';
import { GlobalErrorHandler } from './global-error-handler';
import { NetworkError } from './network-error';
import { NotFoundError } from './not-found-error';
import { ValidationError, ValidationRules } from './validation-error';

@Component({
  selector: 'app-error-demo',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzCardModule, NzDividerModule, NzSpaceModule],
  template: `
    <nz-card nzTitle="錯誤處理示範" [nzBordered]="false">
      <p>這個組件展示了 GlobalErrorHandler 的各種功能。點擊下方按鈕來測試不同類型的錯誤處理。</p>

      <nz-divider nzText="基本錯誤類型"></nz-divider>

      <nz-space nzDirection="vertical" [nzSize]="16" style="width: 100%;">
        <nz-space>
          <button nz-button nzType="default" (click)="triggerValidationError()"> 驗證錯誤 (低嚴重程度) </button>
          <button nz-button nzType="default" (click)="triggerAuthError()"> 認證錯誤 (中等嚴重程度) </button>
          <button nz-button nzType="default" (click)="triggerNotFoundError()"> 資源不存在錯誤 (低嚴重程度) </button>
        </nz-space>

        <nz-space>
          <button nz-button nzType="default" (click)="triggerNetworkError()"> 網路錯誤 (中等嚴重程度) </button>
          <button nz-button nzType="default" (click)="triggerServerError()"> 伺服器錯誤 (高嚴重程度) </button>
          <button nz-button nzType="default" (click)="triggerApplicationError()"> 應用程式錯誤 (中等嚴重程度) </button>
        </nz-space>
      </nz-space>

      <nz-divider nzText="成功和資訊訊息"></nz-divider>

      <nz-space>
        <button nz-button nzType="primary" (click)="showSuccess()"> 成功訊息 </button>
        <button nz-button nzType="default" (click)="showWarning()"> 警告訊息 </button>
        <button nz-button nzType="default" (click)="showInfo()"> 資訊訊息 </button>
      </nz-space>

      <nz-divider nzText="錯誤去重測試"></nz-divider>

      <nz-space>
        <button nz-button nzType="dashed" (click)="triggerDuplicateError()"> 觸發重複錯誤 (測試去重功能) </button>
        <button nz-button nzType="dashed" (click)="showErrorStats()"> 顯示錯誤統計 </button>
        <button nz-button nzType="dashed" (click)="clearErrorStats()"> 清除錯誤統計 </button>
      </nz-space>

      <nz-divider nzText="重試機制測試"></nz-divider>

      <nz-space>
        <button nz-button nzType="dashed" (click)="testRetryableError()"> 可重試錯誤 </button>
        <button nz-button nzType="dashed" (click)="testNonRetryableError()"> 不可重試錯誤 </button>
      </nz-space>
    </nz-card>
  `,
  styles: [
    `
      :host {
        display: block;
        padding: 24px;
      }

      nz-card {
        max-width: 800px;
        margin: 0 auto;
      }

      button {
        margin: 4px;
      }
    `
  ]
})
export class ErrorDemoComponent {
  constructor(private globalErrorHandler: GlobalErrorHandler) {}

  /**
   * 觸發驗證錯誤
   */
  triggerValidationError(): void {
    const error = new ValidationError('電子郵件格式不正確', 'email', [ValidationRules.email()]);

    this.globalErrorHandler.handleError(error);
  }

  /**
   * 觸發認證錯誤
   */
  triggerAuthError(): void {
    const error = new AuthenticationError('登入憑證已過期，請重新登入');
    this.globalErrorHandler.handleError(error);
  }

  /**
   * 觸發資源不存在錯誤
   */
  triggerNotFoundError(): void {
    const error = NotFoundError.userNotFound('user-123');
    this.globalErrorHandler.handleError(error);
  }

  /**
   * 觸發網路錯誤
   */
  triggerNetworkError(): void {
    const error = NetworkError.connectionError('https://api.example.com/users');
    this.globalErrorHandler.handleError(error);
  }

  /**
   * 觸發伺服器錯誤
   */
  triggerServerError(): void {
    const error = NetworkError.httpError(500, 'Internal Server Error', 'https://api.example.com/users');
    this.globalErrorHandler.handleError(error);
  }

  /**
   * 觸發應用程式錯誤
   */
  triggerApplicationError(): void {
    const error = new ApplicationError('無法處理您的請求，請稍後再試', 'processUserData');
    this.globalErrorHandler.handleError(error);
  }

  /**
   * 顯示成功訊息
   */
  showSuccess(): void {
    this.globalErrorHandler.handleSuccess('操作成功完成！');
  }

  /**
   * 顯示警告訊息
   */
  showWarning(): void {
    this.globalErrorHandler.handleWarning('請注意：此操作可能需要一些時間');
  }

  /**
   * 顯示資訊訊息
   */
  showInfo(): void {
    this.globalErrorHandler.handleInfo('系統將在 5 分鐘後進行維護');
  }

  /**
   * 觸發重複錯誤（測試去重功能）
   */
  triggerDuplicateError(): void {
    const error = new ValidationError('這是一個重複的錯誤訊息', 'testField');

    // 連續觸發相同錯誤，應該只顯示一次
    this.globalErrorHandler.handleError(error);
    this.globalErrorHandler.handleError(error);
    this.globalErrorHandler.handleError(error);

    console.log('觸發了 3 次相同錯誤，但應該只顯示一次訊息');
  }

  /**
   * 顯示錯誤統計
   */
  showErrorStats(): void {
    const stats = this.globalErrorHandler.getErrorStats();
    console.log('錯誤統計:', stats);

    this.globalErrorHandler.handleInfo(`錯誤統計：總計 ${stats.totalErrors} 個錯誤，最近 ${stats.recentErrors.length} 個錯誤`);
  }

  /**
   * 清除錯誤統計
   */
  clearErrorStats(): void {
    this.globalErrorHandler.clearErrorStats();
    this.globalErrorHandler.handleSuccess('錯誤統計已清除');
  }

  /**
   * 測試可重試錯誤
   */
  testRetryableError(): void {
    const error = NetworkError.httpError(503, 'Service Unavailable');
    const isRetryable = this.globalErrorHandler.isRetryableError(error);
    const retryDelay = this.globalErrorHandler.getRetryDelay(error);

    this.globalErrorHandler.handleError(error);

    console.log(`錯誤可重試: ${isRetryable}, 建議延遲: ${retryDelay}ms`);
    this.globalErrorHandler.handleInfo(`此錯誤${isRetryable ? '可以' : '不可以'}重試，建議延遲 ${retryDelay}ms`);
  }

  /**
   * 測試不可重試錯誤
   */
  testNonRetryableError(): void {
    const error = new ValidationError('輸入資料格式錯誤');
    const isRetryable = this.globalErrorHandler.isRetryableError(error);
    const retryDelay = this.globalErrorHandler.getRetryDelay(error);

    this.globalErrorHandler.handleError(error);

    console.log(`錯誤可重試: ${isRetryable}, 建議延遲: ${retryDelay}ms`);
    this.globalErrorHandler.handleInfo(`此錯誤${isRetryable ? '可以' : '不可以'}重試，建議延遲 ${retryDelay}ms`);
  }
}
