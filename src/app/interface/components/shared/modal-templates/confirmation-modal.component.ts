/**
 * 確認對話框範本組件
 * 提供標準化的確認對話框介面
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

export interface ConfirmationData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  icon?: string;
  details?: string[];
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzSpaceModule
  ],
  template: `
    <div class="confirmation-modal">
      <div class="confirmation-header">
        <span 
          nz-icon 
          [nzType]="getIcon()" 
          [class]="'confirmation-icon ' + getIconClass()">
        </span>
        <h3 class="confirmation-title">{{ data.title }}</h3>
      </div>
      
      <div class="confirmation-content">
        <p class="confirmation-message">{{ data.message }}</p>
        
        <div class="confirmation-details" *ngIf="data.details && data.details.length > 0">
          <ul>
            <li *ngFor="let detail of data.details">{{ detail }}</li>
          </ul>
        </div>
      </div>
      
      <div class="confirmation-actions">
        <nz-space nzSize="small">
          <button 
            nz-button 
            nzType="default" 
            (click)="onCancel()"
            [nzLoading]="loading">
            {{ data.cancelText || '取消' }}
          </button>
          <button 
            nz-button 
            [nzType]="getButtonType()" 
            [nzDanger]="data.type === 'error'"
            (click)="onConfirm()"
            [nzLoading]="loading">
            {{ data.confirmText || '確定' }}
          </button>
        </nz-space>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-modal {
      padding: 16px;
      min-width: 300px;
    }

    .confirmation-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .confirmation-icon {
      font-size: 24px;
      margin-right: 12px;
    }

    .confirmation-icon.info {
      color: #1890ff;
    }

    .confirmation-icon.warning {
      color: #faad14;
    }

    .confirmation-icon.error {
      color: #ff4d4f;
    }

    .confirmation-icon.success {
      color: #52c41a;
    }

    .confirmation-title {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #262626;
    }

    .confirmation-content {
      margin-bottom: 24px;
    }

    .confirmation-message {
      margin: 0 0 12px 0;
      color: #595959;
      line-height: 1.5;
    }

    .confirmation-details {
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 6px;
      padding: 12px;
    }

    .confirmation-details ul {
      margin: 0;
      padding-left: 20px;
    }

    .confirmation-details li {
      color: #8c8c8c;
      font-size: 12px;
      line-height: 1.4;
      margin-bottom: 4px;
    }

    .confirmation-details li:last-child {
      margin-bottom: 0;
    }

    .confirmation-actions {
      text-align: right;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() data: ConfirmationData = {
    title: '確認操作',
    message: '確定要執行此操作嗎？'
  };

  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  getIcon(): string {
    if (this.data.icon) {
      return this.data.icon;
    }

    switch (this.data.type) {
      case 'warning':
        return 'exclamation-triangle';
      case 'error':
        return 'close-circle';
      case 'success':
        return 'check-circle';
      case 'info':
      default:
        return 'question-circle';
    }
  }

  getIconClass(): string {
    return this.data.type || 'info';
  }

  getButtonType(): 'primary' | 'default' | 'dashed' | 'text' | 'link' {
    switch (this.data.type) {
      case 'error':
        return 'primary';
      case 'warning':
        return 'primary';
      default:
        return 'primary';
    }
  }

  /**
   * 取得組件資料（供 ModalService 使用）
   */
  getData(): ConfirmationData {
    return this.data;
  }
}