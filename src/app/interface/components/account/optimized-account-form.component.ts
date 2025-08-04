/**
 * 優化的帳戶表單組件
 * 使用通用 DynamicFormComponent，整合 Money 值物件的業務邏輯
 */

import { Component, OnInit, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';

import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import { FormConfig, FormField } from '../shared/dynamic-form/form-field.interface';
import { OptimizedAccountApplicationService, CreateAccountDto, UpdateAccountDto, AccountResponseDto } from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

@Component({
    selector: 'app-optimized-account-form',
    standalone: true,
    imports: [
        CommonModule,
        NzCardModule,
        NzButtonModule,
        NzIconModule,
        NzSpaceModule,
        DynamicFormComponent
    ],
    template: `
    <div class="account-form-container">
      <nz-card [nzTitle]="formTitle" [nzExtra]="extraTemplate">
        <app-dynamic-form
          [config]="formConfig"
          [initialValue]="initialFormValue"
          [loading]="loading"
          [submitText]="submitText"
          [showCancelButton]="true"
          [cancelText]="'取消'"
          (formSubmit)="onFormSubmit($event)"
          (formCancel)="onFormCancel()">
        </app-dynamic-form>
      </nz-card>
    </div>

    <ng-template #extraTemplate>
      <nz-space>
        <button nz-button nzType="default" (click)="onFormCancel()">
          <span nz-icon nzType="arrow-left"></span>
          返回列表
        </button>
      </nz-space>
    </ng-template>
  `,
    styles: [`
    .account-form-container {
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
    }

    nz-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class OptimizedAccountFormComponent implements OnInit {
    private readonly accountService = inject(OptimizedAccountApplicationService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly message = inject(NzMessageService);

    @Input() mode: 'create' | 'edit' = 'create';
    @Input() accountId?: string;
    @Output() formSubmitted = new EventEmitter<AccountResponseDto>();
    @Output() formCancelled = new EventEmitter<void>();

    // 表單狀態
    loading = false;
    currentAccount?: AccountResponseDto;

    // 表單配置
    formConfig: FormConfig = {
        layout: 'vertical',
        autoFocus: true,
        fields: []
    };

    initialFormValue: any = {};

    ngOnInit(): void {
        this.initializeForm();

        // 如果是編輯模式，載入現有帳戶資料
        if (this.mode === 'edit' && this.accountId) {
            this.loadAccountData();
        }

        // 從路由參數獲取模式和ID
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.accountId = params['id'];
                this.mode = 'edit';
                this.loadAccountData();
            }
        });
    }

    /**
     * 初始化表單配置
     */
    private initializeForm(): void {
        this.formConfig = {
            layout: 'vertical',
            autoFocus: true,
            fields: this.buildFormFields()
        };
    }

    /**
     * 建立表單欄位配置
     */
    private buildFormFields(): FormField[] {
        const isEditMode = this.mode === 'edit';

        return [
            {
                key: 'name',
                label: '帳戶名稱',
                type: 'text',
                required: true,
                placeholder: '請輸入帳戶名稱',
                span: 12,
                validators: [
                    {
                        type: 'minLength',
                        value: 2,
                        message: '帳戶名稱至少需要2個字符'
                    },
                    {
                        type: 'maxLength',
                        value: 50,
                        message: '帳戶名稱不能超過50個字符'
                    }
                ]
            },
            {
                key: 'accountNumber',
                label: '帳戶號碼',
                type: 'text',
                required: !isEditMode, // 編輯時不允許修改帳戶號碼
                disabled: isEditMode,
                placeholder: isEditMode ? '系統自動生成' : '請輸入帳戶號碼（留空則自動生成）',
                span: 12,
                validators: isEditMode ? [] : [
                    {
                        type: 'pattern',
                        value: '^[A-Z0-9-]*$',
                        message: '帳戶號碼只能包含大寫字母、數字和連字符'
                    }
                ]
            },
            {
                key: 'type',
                label: '帳戶類型',
                type: 'select',
                required: true,
                disabled: isEditMode, // 編輯時不允許修改帳戶類型
                placeholder: '請選擇帳戶類型',
                span: 12,
                options: [
                    { value: AccountType.CHECKING, label: '支票帳戶' },
                    { value: AccountType.SAVINGS, label: '儲蓄帳戶' },
                    { value: AccountType.CREDIT, label: '信用帳戶' }
                ]
            },
            {
                key: 'currency',
                label: '貨幣',
                type: 'select',
                required: true,
                disabled: isEditMode, // 編輯時不允許修改貨幣
                placeholder: '請選擇貨幣',
                span: 12,
                defaultValue: 'TWD',
                options: [
                    { value: 'TWD', label: '新台幣 (TWD)' },
                    { value: 'USD', label: '美元 (USD)' },
                    { value: 'EUR', label: '歐元 (EUR)' },
                    { value: 'JPY', label: '日圓 (JPY)' }
                ]
            },
            {
                key: 'initialBalance',
                label: isEditMode ? '當前餘額' : '初始餘額',
                type: 'number',
                required: false,
                disabled: isEditMode, // 編輯時不允許直接修改餘額
                placeholder: isEditMode ? '無法直接修改，請使用存款/提款功能' : '請輸入初始餘額（預設為0）',
                span: 12,
                defaultValue: 0,
                attributes: {
                    min: isEditMode ? undefined : 0,
                    step: 0.01
                },
                validators: isEditMode ? [] : [
                    {
                        type: 'min',
                        value: 0,
                        message: '初始餘額不能為負數'
                    }
                ]
            },
            {
                key: 'description',
                label: '帳戶描述',
                type: 'textarea',
                required: false,
                placeholder: '請輸入帳戶描述（選填）',
                span: 24,
                attributes: {
                    rows: 3
                },
                validators: [
                    {
                        type: 'maxLength',
                        value: 200,
                        message: '描述不能超過200個字符'
                    }
                ]
            }
        ];
    }

    /**
     * 載入帳戶資料
     */
    private async loadAccountData(): Promise<void> {
        if (!this.accountId) return;

        try {
            this.loading = true;

            // 模擬載入帳戶資料
            // this.currentAccount = await this.accountService.getAccountById(this.accountId);

            // 暫時使用模擬資料
            this.currentAccount = this.generateMockAccount();

            // 設定表單初始值
            this.initialFormValue = {
                name: this.currentAccount.name,
                accountNumber: this.currentAccount.accountNumber,
                type: this.currentAccount.type,
                currency: this.currentAccount.currency,
                initialBalance: this.currentAccount.balance,
                description: this.currentAccount.description
            };

            // 重新建立表單欄位（因為編輯模式的欄位配置不同）
            this.formConfig = {
                ...this.formConfig,
                fields: this.buildFormFields()
            };

        } catch (error) {
            this.message.error('載入帳戶資料失敗');
            console.error('Error loading account data:', error);
        } finally {
            this.loading = false;
        }
    }

    /**
     * 表單提交處理
     */
    async onFormSubmit(formValue: any): Promise<void> {
        try {
            this.loading = true;

            let result: AccountResponseDto;

            if (this.mode === 'create') {
                // 創建新帳戶
                const createDto: CreateAccountDto = {
                    userId: 'current-user-id', // 實際應該從認證服務獲取
                    accountNumber: formValue.accountNumber,
                    name: formValue.name,
                    type: formValue.type,
                    initialBalance: formValue.initialBalance || 0,
                    currency: formValue.currency,
                    description: formValue.description
                };

                // result = await this.accountService.createAccount(createDto);
                result = this.mockCreateAccount(createDto);
                this.message.success('帳戶創建成功');

            } else {
                // 更新現有帳戶
                const updateDto: UpdateAccountDto = {
                    name: formValue.name,
                    description: formValue.description
                };

                // result = await this.accountService.updateAccount(this.accountId!, updateDto);
                result = this.mockUpdateAccount(updateDto);
                this.message.success('帳戶更新成功');
            }

            // 發出事件
            this.formSubmitted.emit(result);

            // 導航回列表頁面
            this.router.navigate(['/accounts']);

        } catch (error) {
            const action = this.mode === 'create' ? '創建' : '更新';
            this.message.error(`帳戶${action}失敗`);
            console.error(`Error ${this.mode} account:`, error);
        } finally {
            this.loading = false;
        }
    }

    /**
     * 表單取消處理
     */
    onFormCancel(): void {
        this.formCancelled.emit();
        this.router.navigate(['/accounts']);
    }

    /**
     * 取得表單標題
     */
    get formTitle(): string {
        return this.mode === 'create' ? '新增帳戶' : '編輯帳戶';
    }

    /**
     * 取得提交按鈕文字
     */
    get submitText(): string {
        return this.mode === 'create' ? '創建帳戶' : '更新帳戶';
    }

    /**
     * 生成模擬帳戶資料
     */
    private generateMockAccount(): AccountResponseDto {
        return {
            id: this.accountId!,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            userId: 'user-1',
            accountNumber: 'ACC-001234-ABCD',
            name: '主要支票帳戶',
            type: AccountType.CHECKING,
            balance: 15000,
            formattedBalance: 'NT$15,000',
            currency: 'TWD',
            status: AccountStatus.ACTIVE,
            statusText: '啟用',
            isActive: true,
            canPerformTransactions: true,
            description: '日常使用的主要帳戶',
            lastTransactionDate: '2024-01-15T10:30:00Z'
        };
    }

    /**
     * 模擬創建帳戶
     */
    private mockCreateAccount(dto: CreateAccountDto): AccountResponseDto {
        return {
            id: 'new-account-id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: dto.userId,
            accountNumber: dto.accountNumber || 'ACC-' + Date.now(),
            name: dto.name,
            type: dto.type,
            balance: dto.initialBalance || 0,
            formattedBalance: new Intl.NumberFormat('zh-TW', {
                style: 'currency',
                currency: dto.currency || 'TWD'
            }).format(dto.initialBalance || 0),
            currency: dto.currency || 'TWD',
            status: AccountStatus.ACTIVE,
            statusText: '啟用',
            isActive: true,
            canPerformTransactions: true,
            description: dto.description
        };
    }

    /**
     * 模擬更新帳戶
     */
    private mockUpdateAccount(dto: UpdateAccountDto): AccountResponseDto {
        const current = this.currentAccount!;
        return {
            ...current,
            name: dto.name || current.name,
            description: dto.description,
            updatedAt: new Date().toISOString()
        };
    }
}