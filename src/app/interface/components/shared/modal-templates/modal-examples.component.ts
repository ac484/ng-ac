/**
 * 模態框使用範例組件
 * 展示統一模態框服務的各種使用方式
 */

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { ConfirmationModalComponent, ConfirmationData } from './confirmation-modal.component';
import { FormModalComponent, FormModalData, FormField } from './form-modal.component';
import { LoadingModalComponent, LoadingModalData } from './loading-modal.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal-examples',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzSpaceModule, NzCardModule, NzDividerModule],
  template: `
    <div class="modal-examples">
      <nz-card nzTitle="模態框服務使用範例">
        <!-- 基本確認對話框 -->
        <h3>基本確認對話框</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showBasicConfirm()"> 基本確認 </button>
          <button nz-button nzType="default" nzDanger (click)="showDeleteConfirm()"> 刪除確認 </button>
          <button nz-button nzType="default" (click)="showWarningConfirm()"> 警告確認 </button>
        </nz-space>

        <nz-divider></nz-divider>

        <!-- 資訊對話框 -->
        <h3>資訊對話框</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showInfo()"> 資訊 </button>
          <button nz-button nzType="primary" (click)="showSuccess()"> 成功 </button>
          <button nz-button nzType="primary" nzDanger (click)="showError()"> 錯誤 </button>
          <button nz-button nzType="default" (click)="showWarning()"> 警告 </button>
        </nz-space>

        <nz-divider></nz-divider>

        <!-- 表單對話框 -->
        <h3>表單對話框</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showSimpleForm()"> 簡單表單 </button>
          <button nz-button nzType="default" (click)="showComplexForm()"> 複雜表單 </button>
          <button nz-button nzType="default" (click)="showUserForm()"> 用戶表單 </button>
        </nz-space>

        <nz-divider></nz-divider>

        <!-- 載入對話框 -->
        <h3>載入對話框</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showBasicLoading()"> 基本載入 </button>
          <button nz-button nzType="default" (click)="showProgressLoading()"> 進度載入 </button>
          <button nz-button nzType="default" (click)="showDotsLoading()"> 點點載入 </button>
        </nz-space>

        <nz-divider></nz-divider>

        <!-- 自定義對話框 -->
        <h3>自定義對話框</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showCustomConfirmation()"> 自定義確認 </button>
          <button nz-button nzType="default" (click)="showCustomForm()"> 自定義表單 </button>
          <button nz-button nzType="default" (click)="showCustomLoading()"> 自定義載入 </button>
        </nz-space>

        <nz-divider></nz-divider>

        <!-- 進階功能 -->
        <h3>進階功能</h3>
        <nz-space nzSize="small">
          <button nz-button nzType="primary" (click)="showProgressWithUpdates()"> 動態進度更新 </button>
          <button nz-button nzType="default" (click)="showChainedModals()"> 連續對話框 </button>
          <button nz-button nzType="default" nzDanger (click)="closeAllModals()"> 關閉所有對話框 </button>
        </nz-space>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .modal-examples {
        padding: 24px;
        max-width: 800px;
        margin: 0 auto;
      }

      h3 {
        margin: 16px 0 12px 0;
        color: #262626;
        font-size: 16px;
        font-weight: 500;
      }

      h3:first-of-type {
        margin-top: 0;
      }
    `
  ]
})
export class ModalExamplesComponent {
  private readonly modalService = inject(ModalService);
  private readonly messageService = inject(NzMessageService);

  // 基本確認對話框
  async showBasicConfirm(): Promise<void> {
    const confirmed = await this.modalService.confirm({
      title: '確認操作',
      content: '您確定要執行此操作嗎？',
      onOk: () => {
        this.messageService.success('操作已確認');
      }
    });

    if (confirmed) {
      console.log('用戶確認了操作');
    }
  }

  async showDeleteConfirm(): Promise<void> {
    await this.modalService.confirmDelete('測試項目', () => {
      this.messageService.success('項目已刪除');
    });
  }

  async showWarningConfirm(): Promise<void> {
    await this.modalService.confirmWarning({
      title: '警告',
      content: '此操作可能會影響系統穩定性，確定要繼續嗎？',
      onOk: () => {
        this.messageService.warning('已執行危險操作');
      }
    });
  }

  // 資訊對話框
  async showInfo(): Promise<void> {
    await this.modalService.info({
      title: '系統資訊',
      content: '這是一個資訊提示對話框，用於顯示重要資訊。'
    });
  }

  async showSuccess(): Promise<void> {
    await this.modalService.success('操作成功', '您的操作已成功完成！');
  }

  async showError(): Promise<void> {
    await this.modalService.error('操作失敗', '系統發生錯誤，請稍後再試。');
  }

  async showWarning(): Promise<void> {
    await this.modalService.warning('注意', '請注意系統將在 5 分鐘後進行維護。');
  }

  // 表單對話框
  showSimpleForm(): void {
    const formData: FormModalData = {
      title: '簡單表單',
      fields: [
        {
          key: 'name',
          label: '姓名',
          type: 'text',
          required: true,
          placeholder: '請輸入姓名'
        },
        {
          key: 'email',
          label: '電子郵件',
          type: 'email',
          required: true,
          placeholder: '請輸入電子郵件'
        }
      ]
    };

    const modalRef = this.modalService.openForm({
      title: formData.title,
      component: FormModalComponent,
      componentParams: { data: formData },
      onOk: data => {
        this.messageService.success(`表單提交成功: ${JSON.stringify(data)}`);
        console.log('表單資料:', data);
      }
    });
  }

  showComplexForm(): void {
    const formData: FormModalData = {
      title: '複雜表單',
      layout: 'vertical',
      fields: [
        {
          key: 'title',
          label: '標題',
          type: 'text',
          required: true,
          span: 24
        },
        {
          key: 'category',
          label: '分類',
          type: 'select',
          required: true,
          span: 12,
          options: [
            { label: '技術', value: 'tech' },
            { label: '業務', value: 'business' },
            { label: '設計', value: 'design' }
          ]
        },
        {
          key: 'priority',
          label: '優先級',
          type: 'radio',
          required: true,
          span: 12,
          options: [
            { label: '高', value: 'high' },
            { label: '中', value: 'medium' },
            { label: '低', value: 'low' }
          ]
        },
        {
          key: 'dueDate',
          label: '截止日期',
          type: 'date',
          span: 12
        },
        {
          key: 'budget',
          label: '預算',
          type: 'number',
          min: 0,
          step: 100,
          span: 12
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          rows: 4,
          span: 24
        },
        {
          key: 'isUrgent',
          label: '緊急',
          type: 'switch',
          span: 12
        },
        {
          key: 'sendNotification',
          label: '發送通知',
          type: 'checkbox',
          span: 12
        }
      ]
    };

    this.modalService.openForm({
      title: formData.title,
      component: FormModalComponent,
      componentParams: { data: formData },
      width: 800,
      onOk: data => {
        this.messageService.success('複雜表單提交成功');
        console.log('複雜表單資料:', data);
      }
    });
  }

  showUserForm(): void {
    const formData: FormModalData = {
      title: '用戶資訊',
      initialData: {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      },
      fields: [
        {
          key: 'name',
          label: '姓名',
          type: 'text',
          required: true,
          validators: [Validators.minLength(2)]
        },
        {
          key: 'email',
          label: '電子郵件',
          type: 'email',
          required: true
        },
        {
          key: 'age',
          label: '年齡',
          type: 'number',
          min: 18,
          max: 100
        },
        {
          key: 'bio',
          label: '個人簡介',
          type: 'textarea',
          rows: 3,
          maxLength: 200,
          helpText: '最多 200 個字元'
        }
      ]
    };

    this.modalService.openForm({
      title: formData.title,
      component: FormModalComponent,
      componentParams: { data: formData },
      onOk: data => {
        this.messageService.success('用戶資訊更新成功');
        console.log('用戶資料:', data);
      }
    });
  }

  // 載入對話框
  showBasicLoading(): void {
    const modalRef = this.modalService.openLoading({
      title: '載入中',
      content: '正在處理您的請求，請稍候...'
    });

    // 模擬 3 秒後關閉
    setTimeout(() => {
      modalRef.close();
      this.messageService.success('載入完成');
    }, 3000);
  }

  showProgressLoading(): void {
    const loadingData: LoadingModalData = {
      title: '上傳檔案',
      message: '正在上傳檔案...',
      type: 'progress',
      showProgress: true,
      estimatedTime: 10
    };

    const modalRef = this.modalService.openCustom({
      title: loadingData.title,
      content: LoadingModalComponent,
      componentParams: { data: loadingData },
      maskClosable: false,
      keyboard: false
    });

    // 模擬進度更新
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          modalRef.close();
          this.messageService.success('上傳完成');
        }, 1000);
      }

      // 更新進度（這裡需要實際的組件實例來更新）
      console.log(`進度: ${Math.round(progress)}%`);
    }, 500);
  }

  showDotsLoading(): void {
    const loadingData: LoadingModalData = {
      title: '同步資料',
      message: '正在同步資料到雲端...',
      type: 'dots'
    };

    const modalRef = this.modalService.openCustom({
      title: loadingData.title,
      content: LoadingModalComponent,
      componentParams: { data: loadingData }
    });

    setTimeout(() => {
      modalRef.close();
      this.messageService.success('同步完成');
    }, 4000);
  }

  // 自定義對話框
  showCustomConfirmation(): void {
    const confirmationData: ConfirmationData = {
      title: '批量刪除',
      message: '您即將刪除 5 個項目，此操作無法復原。',
      type: 'warning',
      confirmText: '確定刪除',
      cancelText: '取消',
      details: ['項目 1: 重要文件.pdf', '項目 2: 會議記錄.docx', '項目 3: 專案計劃.xlsx', '項目 4: 設計稿.psd', '項目 5: 程式碼備份.zip']
    };

    this.modalService.openCustom({
      title: '確認操作',
      content: ConfirmationModalComponent,
      componentParams: { data: confirmationData },
      width: 500,
      onOk: () => {
        this.messageService.success('批量刪除完成');
      }
    });
  }

  showCustomForm(): void {
    // 這裡可以展示更複雜的自定義表單
    this.showComplexForm();
  }

  showCustomLoading(): void {
    const loadingData: LoadingModalData = {
      title: '資料分析',
      message: '正在分析大量資料，請耐心等候...',
      type: 'progress',
      showProgress: true,
      size: 'large',
      estimatedTime: 30
    };

    const modalRef = this.modalService.openCustom({
      title: loadingData.title,
      content: LoadingModalComponent,
      componentParams: { data: loadingData },
      width: 400,
      maskClosable: false
    });

    setTimeout(() => {
      modalRef.close();
      this.messageService.success('分析完成');
    }, 8000);
  }

  // 進階功能
  showProgressWithUpdates(): void {
    const { modalRef, updateProgress, complete } = this.modalService.openProgressLoading('處理資料');

    let progress = 0;
    const steps = [
      '初始化系統...',
      '載入設定檔...',
      '連接資料庫...',
      '驗證用戶權限...',
      '載入資料...',
      '處理資料...',
      '生成報告...',
      '儲存結果...',
      '清理暫存檔...',
      '完成處理'
    ];

    const interval = setInterval(() => {
      const stepIndex = Math.floor(progress / 10);
      const message = steps[stepIndex] || '處理中...';

      updateProgress(progress, message);
      progress += Math.random() * 12;

      if (progress >= 100) {
        clearInterval(interval);
        complete('所有資料處理完成！');
      }
    }, 800);
  }

  async showChainedModals(): Promise<void> {
    // 第一個對話框
    const step1 = await this.modalService.confirm({
      title: '步驟 1',
      content: '這是第一個步驟，確定要繼續嗎？'
    });

    if (!step1) return;

    // 第二個對話框
    await this.modalService.info({
      title: '步驟 2',
      content: '第一步完成，現在進入第二步。'
    });

    // 第三個對話框
    const step3 = await this.modalService.confirm({
      title: '步驟 3',
      content: '這是最後一步，確定要完成整個流程嗎？'
    });

    if (step3) {
      await this.modalService.success('完成', '所有步驟已完成！');
    }
  }

  async closeAllModals(): Promise<void> {
    await this.modalService.confirmCloseAll('確定要關閉所有打開的對話框嗎？');
  }
}
