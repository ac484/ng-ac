/**
 * 統一的模態框服務
 * 包裝 nz-modal 功能，標準化確認對話框、表單對話框模式
 */

import { Injectable, inject, TemplateRef, Type } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalRef } from 'ng-zorro-antd/modal';

export interface ConfirmModalOptions {
  title: string;
  content: string;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  okDanger?: boolean;
  width?: string | number;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  icon?: string;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface InfoModalOptions {
  title: string;
  content: string;
  okText?: string;
  width?: string | number;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  icon?: string;
  onOk?: () => void;
}

export interface FormModalOptions<T = any> {
  title: string;
  component: Type<any>;
  componentParams?: any;
  width?: string | number;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  okText?: string;
  cancelText?: string;
  okLoading?: boolean;
  onOk?: (data: T) => void | Promise<void>;
  onCancel?: () => void;
}

export interface CustomModalOptions {
  title?: string;
  content: TemplateRef<any> | Type<any>;
  componentParams?: any;
  width?: string | number;
  height?: string | number;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
  footer?: TemplateRef<any> | null;
  okText?: string;
  cancelText?: string;
  okType?: 'primary' | 'default' | 'dashed' | 'text' | 'link';
  okLoading?: boolean;
  onOk?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface LoadingModalOptions {
  title?: string;
  content?: string;
  maskClosable?: boolean;
  keyboard?: boolean;
  centered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly nzModalService = inject(NzModalService);
  private readonly messageService = inject(NzMessageService);

  /**
   * 顯示確認對話框
   */
  confirm(options: ConfirmModalOptions): Promise<boolean> {
    return new Promise(resolve => {
      const modal = this.nzModalService.confirm({
        nzTitle: options.title,
        nzContent: options.content,
        nzOkText: options.okText || '確定',
        nzCancelText: options.cancelText || '取消',
        nzOkType: (options.okType as any) || 'primary',
        nzOkDanger: options.okDanger || false,
        nzWidth: options.width || 416,
        nzMaskClosable: options.maskClosable ?? false,
        nzKeyboard: options.keyboard ?? true,
        nzCentered: options.centered ?? false,
        nzIconType: options.icon || 'question-circle',
        nzOnOk: async () => {
          try {
            if (options.onOk) {
              await options.onOk();
            }
            resolve(true);
          } catch (error) {
            this.messageService.error('操作失敗');
            console.error('Modal confirm error:', error);
            resolve(false);
          }
        },
        nzOnCancel: () => {
          if (options.onCancel) {
            options.onCancel();
          }
          resolve(false);
        }
      });
    });
  }

  /**
   * 顯示刪除確認對話框
   */
  confirmDelete(itemName: string, onConfirm: () => void | Promise<void>): Promise<boolean> {
    return this.confirm({
      title: '確認刪除',
      content: `確定要刪除 "${itemName}" 嗎？此操作無法復原。`,
      okText: '確定刪除',
      cancelText: '取消',
      okDanger: true,
      icon: 'exclamation-circle',
      onOk: onConfirm
    });
  }

  /**
   * 顯示警告確認對話框
   */
  confirmWarning(options: Omit<ConfirmModalOptions, 'icon' | 'okDanger'>): Promise<boolean> {
    return this.confirm({
      ...options,
      icon: 'exclamation-triangle',
      okDanger: true
    });
  }

  /**
   * 顯示資訊對話框
   */
  info(options: InfoModalOptions): Promise<void> {
    return new Promise(resolve => {
      this.nzModalService.info({
        nzTitle: options.title,
        nzContent: options.content,
        nzOkText: options.okText || '確定',
        nzWidth: options.width || 416,
        nzMaskClosable: options.maskClosable ?? false,
        nzKeyboard: options.keyboard ?? true,
        nzCentered: options.centered ?? false,
        nzIconType: options.icon || 'info-circle',
        nzOnOk: () => {
          if (options.onOk) {
            options.onOk();
          }
          resolve();
        }
      });
    });
  }

  /**
   * 顯示成功對話框
   */
  success(title: string, content: string): Promise<void> {
    return this.info({
      title,
      content,
      icon: 'check-circle'
    });
  }

  /**
   * 顯示錯誤對話框
   */
  error(title: string, content: string): Promise<void> {
    return this.info({
      title,
      content,
      icon: 'close-circle'
    });
  }

  /**
   * 顯示警告對話框
   */
  warning(title: string, content: string): Promise<void> {
    return this.info({
      title,
      content,
      icon: 'exclamation-triangle'
    });
  }

  /**
   * 顯示表單對話框
   */
  openForm<T = any>(options: FormModalOptions<T>): NzModalRef {
    const modalRef = this.nzModalService.create({
      nzTitle: options.title,
      nzContent: options.component,
      nzData: options.componentParams || {},
      nzWidth: options.width || 600,
      nzMaskClosable: options.maskClosable ?? false,
      nzKeyboard: options.keyboard ?? true,
      nzCentered: options.centered ?? true,
      nzOkText: options.okText || '確定',
      nzCancelText: options.cancelText || '取消',
      nzOkLoading: options.okLoading || false,
      nzOnOk: async componentInstance => {
        try {
          if (options.onOk) {
            // 假設組件有 getData() 方法返回表單資料
            const data = componentInstance.getData ? componentInstance.getData() : componentInstance;
            await options.onOk(data);
          }
          return true;
        } catch (error) {
          this.messageService.error('操作失敗');
          console.error('Form modal error:', error);
          return false;
        }
      },
      nzOnCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
      }
    });

    return modalRef;
  }

  /**
   * 顯示自定義對話框
   */
  openCustom(options: CustomModalOptions): NzModalRef {
    const modalRef = this.nzModalService.create({
      nzTitle: options.title,
      nzContent: options.content,
      nzData: options.componentParams || {},
      nzWidth: options.width || 600,
      nzMaskClosable: options.maskClosable ?? false,
      nzKeyboard: options.keyboard ?? true,
      nzCentered: options.centered ?? true,
      nzFooter: options.footer,
      nzOkText: options.okText || '確定',
      nzCancelText: options.cancelText || '取消',
      nzOkType: (options.okType as any) || 'primary',
      nzOkLoading: options.okLoading || false,
      nzOnOk: async () => {
        try {
          if (options.onOk) {
            await options.onOk();
          }
          return true;
        } catch (error) {
          this.messageService.error('操作失敗');
          console.error('Custom modal error:', error);
          return false;
        }
      },
      nzOnCancel: () => {
        if (options.onCancel) {
          options.onCancel();
        }
      }
    });

    return modalRef;
  }

  /**
   * 顯示載入中對話框
   */
  openLoading(options: LoadingModalOptions): NzModalRef {
    const modalRef = this.nzModalService.create({
      nzTitle: options.title || '處理中',
      nzContent: `
        <div style="text-align: center; padding: 20px;">
          <nz-spin nzSize="large"></nz-spin>
          <p style="margin-top: 16px; color: #666;">${options.content || '請稍候...'}</p>
        </div>
      `,
      nzWidth: 300,
      nzMaskClosable: options.maskClosable ?? false,
      nzKeyboard: options.keyboard ?? false,
      nzCentered: options.centered ?? true,
      nzFooter: null,
      nzClosable: false
    });

    return modalRef;
  }

  /**
   * 顯示帶進度的載入對話框
   */
  openProgressLoading(title = '處理中'): {
    modalRef: NzModalRef;
    updateProgress: (progress: number, message?: string) => void;
    complete: (message?: string) => void;
    error: (message?: string) => void;
  } {
    let currentProgress = 0;
    let currentMessage = '正在處理...';

    const modalRef = this.nzModalService.create({
      nzTitle: title,
      nzContent: `
        <div style="text-align: center; padding: 20px;">
          <nz-progress 
            [nzPercent]="0" 
            nzType="circle" 
            [nzWidth]="80"
            id="progress-indicator">
          </nz-progress>
          <p style="margin-top: 16px; color: #666;" id="progress-message">${currentMessage}</p>
        </div>
      `,
      nzWidth: 350,
      nzMaskClosable: false,
      nzKeyboard: false,
      nzCentered: true,
      nzFooter: null,
      nzClosable: false
    });

    const updateProgress = (progress: number, message?: string) => {
      currentProgress = Math.min(100, Math.max(0, progress));
      if (message) {
        currentMessage = message;
      }

      // 更新進度條和訊息
      const progressElement = document.getElementById('progress-indicator');
      const messageElement = document.getElementById('progress-message');

      if (progressElement) {
        progressElement.setAttribute('nz-percent', currentProgress.toString());
      }
      if (messageElement) {
        messageElement.textContent = currentMessage;
      }
    };

    const complete = (message?: string) => {
      updateProgress(100, message || '處理完成');
      setTimeout(() => {
        modalRef.close();
      }, 1000);
    };

    const error = (message?: string) => {
      const errorMessage = message || '處理失敗';
      const messageElement = document.getElementById('progress-message');
      if (messageElement) {
        messageElement.textContent = errorMessage;
        messageElement.style.color = '#ff4d4f';
      }

      setTimeout(() => {
        modalRef.close();
        this.messageService.error(errorMessage);
      }, 2000);
    };

    return {
      modalRef,
      updateProgress,
      complete,
      error
    };
  }

  /**
   * 關閉所有對話框
   */
  closeAll(): void {
    this.nzModalService.closeAll();
  }

  /**
   * 確認並關閉所有對話框
   */
  async confirmCloseAll(message = '確定要關閉所有對話框嗎？'): Promise<void> {
    const confirmed = await this.confirm({
      title: '確認關閉',
      content: message,
      okText: '確定關閉',
      cancelText: '取消'
    });

    if (confirmed) {
      this.closeAll();
    }
  }
}
