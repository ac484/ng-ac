/**
 * 帳戶交易操作模態框組件
 * 支援存款、提款、轉帳操作，整合 Money 值物件的業務邏輯
 */

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, OnChanges } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import {
  OptimizedAccountApplicationService,
  AccountResponseDto,
  DepositDto,
  WithdrawDto,
  TransferDto
} from '../../../application/services/optimized-account-application.service';
import { AccountStatus } from '../../../domain/entities/optimized-account.entity';
import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import { FormConfig, FormField } from '../shared/dynamic-form/form-field.interface';

export type TransactionType = 'deposit' | 'withdraw' | 'transfer';

export interface TransactionResult {
  success: boolean;
  message: string;
  updatedAccount?: AccountResponseDto;
  targetAccount?: AccountResponseDto;
}

@Component({
  selector: 'app-account-transaction-modal',
  standalone: true,
  imports: [CommonModule, NzModalModule, NzButtonModule, NzIconModule, NzSelectModule, NzSpaceModule, DynamicFormComponent],
  template: `
    <nz-modal
      [nzVisible]="visible"
      [nzTitle]="modalTitle"
      [nzWidth]="600"
      [nzFooter]="null"
      [nzClosable]="!loading"
      [nzMaskClosable]="!loading"
      (nzOnCancel)="onCancel()"
    >
      <!-- 帳戶資訊顯示 -->
      <div class="account-info" *ngIf="account">
        <div class="account-header">
          <h4>{{ account.name }}</h4>
          <span class="account-number">{{ account.accountNumber }}</span>
        </div>
        <div class="balance-info">
          <span class="balance-label">當前餘額：</span>
          <span class="balance-amount" [class.negative]="account.balance < 0">
            {{ account.formattedBalance }}
          </span>
        </div>
      </div>

      <!-- 交易表單 -->
      <div class="transaction-form">
        <app-dynamic-form
          [config]="formConfig"
          [loading]="loading"
          [submitText]="submitButtonText"
          [showCancelButton]="true"
          [cancelText]="'取消'"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onCancel()"
        >
        </app-dynamic-form>
      </div>

      <!-- 交易提示 -->
      <div class="transaction-tips" *ngIf="transactionType">
        <div class="tip-item" *ngFor="let tip of getTransactionTips()">
          <span nz-icon nzType="info-circle" nzTheme="outline"></span>
          <span>{{ tip }}</span>
        </div>
      </div>
    </nz-modal>
  `,
  styles: [
    `
      .account-info {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 6px;
        margin-bottom: 24px;
      }

      .account-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .account-header h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      .account-number {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 12px;
        color: #666;
        background: #fff;
        padding: 2px 6px;
        border-radius: 3px;
      }

      .balance-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .balance-label {
        color: #666;
        font-size: 14px;
      }

      .balance-amount {
        font-size: 18px;
        font-weight: 600;
        color: #52c41a;
      }

      .balance-amount.negative {
        color: #ff4d4f;
      }

      .transaction-form {
        margin-bottom: 24px;
      }

      .transaction-tips {
        background: #e6f7ff;
        border: 1px solid #91d5ff;
        border-radius: 6px;
        padding: 12px;
      }

      .tip-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 13px;
        color: #1890ff;
      }

      .tip-item:last-child {
        margin-bottom: 0;
      }

      .tip-item span[nz-icon] {
        margin-top: 2px;
        flex-shrink: 0;
      }
    `
  ]
})
export class AccountTransactionModalComponent implements OnInit, OnChanges {
  private readonly accountService = inject(OptimizedAccountApplicationService);
  private readonly message = inject(NzMessageService);

  @Input() visible = false;
  @Input() account?: AccountResponseDto;
  @Input() transactionType?: TransactionType;
  @Input() availableAccounts: AccountResponseDto[] = []; // 用於轉帳時選擇目標帳戶

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() transactionComplete = new EventEmitter<TransactionResult>();
  @Output() cancel = new EventEmitter<void>();

  loading = false;
  formConfig: FormConfig = { fields: [] };

  ngOnInit(): void {
    this.buildFormConfig();
  }

  ngOnChanges(): void {
    if (this.visible && this.transactionType) {
      this.buildFormConfig();
    }
  }

  /**
   * 建立表單配置
   */
  private buildFormConfig(): void {
    if (!this.transactionType) return;

    this.formConfig = {
      layout: 'vertical',
      autoFocus: true,
      fields: this.buildFormFields()
    };
  }

  /**
   * 建立表單欄位
   */
  private buildFormFields(): FormField[] {
    const baseFields: FormField[] = [
      {
        key: 'amount',
        label: '金額',
        type: 'number',
        required: true,
        placeholder: '請輸入交易金額',
        span: 24,
        attributes: {
          min: 0.01,
          step: 0.01
        },
        validators: [
          {
            type: 'min',
            value: 0.01,
            message: '金額必須大於 0'
          },
          {
            type: 'custom',
            validator: (value: number) => {
              if (this.transactionType === 'withdraw' && this.account) {
                return value <= this.account.balance;
              }
              return true;
            },
            message: '提款金額不能超過帳戶餘額'
          }
        ]
      },
      {
        key: 'description',
        label: '交易說明',
        type: 'textarea',
        required: false,
        placeholder: '請輸入交易說明（選填）',
        span: 24,
        attributes: {
          rows: 3
        },
        validators: [
          {
            type: 'maxLength',
            value: 200,
            message: '說明不能超過200個字符'
          }
        ]
      }
    ];

    // 轉帳時需要額外的目標帳戶欄位
    if (this.transactionType === 'transfer') {
      const targetAccountField: FormField = {
        key: 'targetAccountId',
        label: '目標帳戶',
        type: 'select',
        required: true,
        placeholder: '請選擇目標帳戶',
        span: 24,
        options: this.availableAccounts
          .filter(acc => acc.id !== this.account?.id && acc.status === AccountStatus.ACTIVE)
          .map(acc => ({
            value: acc.id,
            label: `${acc.name} (${acc.accountNumber}) - ${acc.formattedBalance}`
          }))
      };

      // 將目標帳戶欄位插入到金額欄位之後
      baseFields.splice(1, 0, targetAccountField);
    }

    return baseFields;
  }

  /**
   * 表單提交處理
   */
  async onFormSubmit(formValue: any): Promise<void> {
    if (!this.account || !this.transactionType) return;

    try {
      this.loading = true;
      let result: TransactionResult;

      switch (this.transactionType) {
        case 'deposit':
          result = await this.handleDeposit(formValue);
          break;
        case 'withdraw':
          result = await this.handleWithdraw(formValue);
          break;
        case 'transfer':
          result = await this.handleTransfer(formValue);
          break;
        default:
          throw new Error('未知的交易類型');
      }

      if (result.success) {
        this.message.success(result.message);
        this.transactionComplete.emit(result);
        this.closeModal();
      } else {
        this.message.error(result.message);
      }
    } catch (error: any) {
      this.message.error(error.message || '交易失敗');
      console.error('Transaction error:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 處理存款
   */
  private async handleDeposit(formValue: any): Promise<TransactionResult> {
    const depositDto: DepositDto = {
      amount: formValue.amount,
      description: formValue.description
    };

    try {
      // const updatedAccount = await this.accountService.deposit(this.account!.id, depositDto);

      // 模擬存款操作
      const updatedAccount = this.mockDeposit(depositDto);

      return {
        success: true,
        message: `成功存入 ${this.formatCurrency(formValue.amount)}`,
        updatedAccount
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '存款失敗'
      };
    }
  }

  /**
   * 處理提款
   */
  private async handleWithdraw(formValue: any): Promise<TransactionResult> {
    const withdrawDto: WithdrawDto = {
      amount: formValue.amount,
      description: formValue.description
    };

    try {
      // const updatedAccount = await this.accountService.withdraw(this.account!.id, withdrawDto);

      // 模擬提款操作
      const updatedAccount = this.mockWithdraw(withdrawDto);

      return {
        success: true,
        message: `成功提取 ${this.formatCurrency(formValue.amount)}`,
        updatedAccount
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '提款失敗'
      };
    }
  }

  /**
   * 處理轉帳
   */
  private async handleTransfer(formValue: any): Promise<TransactionResult> {
    const transferDto: TransferDto = {
      targetAccountId: formValue.targetAccountId,
      amount: formValue.amount,
      description: formValue.description
    };

    try {
      // const result = await this.accountService.transfer(this.account!.id, transferDto);

      // 模擬轉帳操作
      const result = this.mockTransfer(transferDto);

      return {
        success: true,
        message: `成功轉帳 ${this.formatCurrency(formValue.amount)} 到目標帳戶`,
        updatedAccount: result.source,
        targetAccount: result.target
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || '轉帳失敗'
      };
    }
  }

  /**
   * 取消操作
   */
  onCancel(): void {
    this.cancel.emit();
    this.closeModal();
  }

  /**
   * 關閉模態框
   */
  private closeModal(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /**
   * 取得模態框標題
   */
  get modalTitle(): string {
    switch (this.transactionType) {
      case 'deposit':
        return '存款';
      case 'withdraw':
        return '提款';
      case 'transfer':
        return '轉帳';
      default:
        return '交易';
    }
  }

  /**
   * 取得提交按鈕文字
   */
  get submitButtonText(): string {
    switch (this.transactionType) {
      case 'deposit':
        return '確認存款';
      case 'withdraw':
        return '確認提款';
      case 'transfer':
        return '確認轉帳';
      default:
        return '確認';
    }
  }

  /**
   * 取得交易提示
   */
  getTransactionTips(): string[] {
    switch (this.transactionType) {
      case 'deposit':
        return ['存款將立即生效，請確認金額正確', '存款後餘額將自動更新', '建議保留交易憑證'];
      case 'withdraw':
        return ['提款金額不能超過當前餘額', '提款將立即生效，請確認金額正確', '請確保帳戶狀態為啟用'];
      case 'transfer':
        return ['轉帳將同時影響兩個帳戶的餘額', '請確認目標帳戶資訊正確', '轉帳完成後無法撤銷', '兩個帳戶必須使用相同貨幣'];
      default:
        return [];
    }
  }

  /**
   * 格式化貨幣
   */
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: this.account?.currency || 'TWD'
    }).format(amount);
  }

  /**
   * 模擬存款操作
   */
  private mockDeposit(dto: DepositDto): AccountResponseDto {
    const newBalance = this.account!.balance + dto.amount;
    return {
      ...this.account!,
      balance: newBalance,
      formattedBalance: this.formatCurrency(newBalance),
      lastTransactionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * 模擬提款操作
   */
  private mockWithdraw(dto: WithdrawDto): AccountResponseDto {
    const newBalance = this.account!.balance - dto.amount;
    return {
      ...this.account!,
      balance: newBalance,
      formattedBalance: this.formatCurrency(newBalance),
      lastTransactionDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * 模擬轉帳操作
   */
  private mockTransfer(dto: TransferDto): { source: AccountResponseDto; target: AccountResponseDto } {
    const targetAccount = this.availableAccounts.find(acc => acc.id === dto.targetAccountId);
    if (!targetAccount) {
      throw new Error('目標帳戶不存在');
    }

    const sourceNewBalance = this.account!.balance - dto.amount;
    const targetNewBalance = targetAccount.balance + dto.amount;

    return {
      source: {
        ...this.account!,
        balance: sourceNewBalance,
        formattedBalance: this.formatCurrency(sourceNewBalance),
        lastTransactionDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      target: {
        ...targetAccount,
        balance: targetNewBalance,
        formattedBalance: this.formatCurrency(targetNewBalance),
        lastTransactionDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
}
