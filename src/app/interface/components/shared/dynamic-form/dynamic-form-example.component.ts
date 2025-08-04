import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { DynamicFormComponent } from './dynamic-form.component';
import { FormConfig } from './form-field.interface';

/**
 * 動態表單範例組件
 * 展示動態表單的各種使用方式
 */
@Component({
    selector: 'app-dynamic-form-example',
    standalone: true,
    imports: [
        CommonModule,
        NzCardModule,
        NzDividerModule,
        DynamicFormComponent
    ],
    template: `
    <div style="padding: 24px;">
      <h2>動態表單範例</h2>
      
      <!-- 基本表單範例 -->
      <nz-card nzTitle="基本表單" style="margin-bottom: 24px;">
        <app-dynamic-form 
          [config]="basicFormConfig"
          [initialValue]="basicInitialValue"
          [loading]="basicLoading"
          (formSubmit)="onBasicSubmit($event)"
          (formChange)="onBasicChange($event)">
        </app-dynamic-form>
      </nz-card>
      
      <!-- 進階表單範例 -->
      <nz-card nzTitle="進階表單" style="margin-bottom: 24px;">
        <app-dynamic-form 
          [config]="advancedFormConfig"
          [initialValue]="advancedInitialValue"
          [loading]="advancedLoading"
          [showCancelButton]="true"
          submitText="創建用戶"
          cancelText="取消"
          (formSubmit)="onAdvancedSubmit($event)"
          (formCancel)="onAdvancedCancel()"
          (formChange)="onAdvancedChange($event)">
        </app-dynamic-form>
      </nz-card>
      
      <!-- 水平佈局表單範例 -->
      <nz-card nzTitle="水平佈局表單" style="margin-bottom: 24px;">
        <app-dynamic-form 
          [config]="horizontalFormConfig"
          [loading]="horizontalLoading"
          (formSubmit)="onHorizontalSubmit($event)">
        </app-dynamic-form>
      </nz-card>
      
      <!-- 行內佈局表單範例 -->
      <nz-card nzTitle="行內佈局表單">
        <app-dynamic-form 
          [config]="inlineFormConfig"
          [showResetButton]="false"
          submitText="搜尋"
          (formSubmit)="onInlineSubmit($event)">
        </app-dynamic-form>
      </nz-card>
    </div>
    `
})
export class DynamicFormExampleComponent {

    // 載入狀態
    basicLoading = false;
    advancedLoading = false;
    horizontalLoading = false;

    // 基本表單配置
    basicFormConfig: FormConfig = {
        fields: [
            {
                key: 'name',
                label: '姓名',
                type: 'text',
                required: true,
                placeholder: '請輸入姓名',
                validators: [
                    { type: 'minLength', value: 2, message: '姓名至少需要2個字符' }
                ]
            },
            {
                key: 'email',
                label: '電子郵件',
                type: 'email',
                required: true,
                placeholder: '請輸入電子郵件',
                validators: [
                    { type: 'email', message: '請輸入有效的電子郵件地址' }
                ]
            },
            {
                key: 'phone',
                label: '電話號碼',
                type: 'text',
                placeholder: '請輸入電話號碼',
                validators: [
                    { type: 'pattern', value: '^[0-9-+()\\s]+$', message: '請輸入有效的電話號碼' }
                ]
            }
        ],
        layout: 'vertical',
        autoFocus: true
    };

    // 基本表單初始值
    basicInitialValue = {
        name: 'John Doe',
        email: 'john@example.com'
    };

    // 進階表單配置
    advancedFormConfig: FormConfig = {
        fields: [
            {
                key: 'username',
                label: '用戶名',
                type: 'text',
                required: true,
                placeholder: '請輸入用戶名',
                validators: [
                    { type: 'minLength', value: 3, message: '用戶名至少需要3個字符' },
                    { type: 'pattern', value: '^[a-zA-Z0-9_]+$', message: '只能包含字母、數字和下劃線' }
                ],
                span: 12
            },
            {
                key: 'password',
                label: '密碼',
                type: 'password',
                required: true,
                placeholder: '請輸入密碼',
                validators: [
                    { type: 'minLength', value: 8, message: '密碼至少需要8個字符' }
                ],
                span: 12
            },
            {
                key: 'role',
                label: '角色',
                type: 'select',
                required: true,
                placeholder: '請選擇角色',
                options: [
                    { label: '管理員', value: 'admin' },
                    { label: '編輯者', value: 'editor' },
                    { label: '用戶', value: 'user' },
                    { label: '訪客', value: 'guest', disabled: true }
                ],
                span: 12
            },
            {
                key: 'department',
                label: '部門',
                type: 'select',
                options: [
                    { label: '技術部', value: 'tech' },
                    { label: '市場部', value: 'marketing' },
                    { label: '人事部', value: 'hr' },
                    { label: '財務部', value: 'finance' }
                ],
                span: 12
            },
            {
                key: 'birthDate',
                label: '出生日期',
                type: 'date',
                placeholder: '請選擇出生日期',
                span: 12
            },
            {
                key: 'salary',
                label: '薪資',
                type: 'number',
                placeholder: '請輸入薪資',
                attributes: { min: 0, max: 1000000, step: 1000 },
                span: 12
            },
            {
                key: 'description',
                label: '個人描述',
                type: 'textarea',
                placeholder: '請輸入個人描述...',
                attributes: { rows: 4 },
                span: 24
            },
            {
                key: 'agreeTerms',
                label: '同意條款',
                type: 'checkbox',
                required: true,
                description: '我同意服務條款和隱私政策',
                span: 24
            }
        ],
        layout: 'vertical'
    };

    // 進階表單初始值
    advancedInitialValue = {
        role: 'user',
        department: 'tech'
    };

    // 水平佈局表單配置
    horizontalFormConfig: FormConfig = {
        fields: [
            {
                key: 'companyName',
                label: '公司名稱',
                type: 'text',
                required: true,
                placeholder: '請輸入公司名稱'
            },
            {
                key: 'industry',
                label: '行業',
                type: 'select',
                required: true,
                options: [
                    { label: '科技', value: 'technology' },
                    { label: '金融', value: 'finance' },
                    { label: '製造', value: 'manufacturing' },
                    { label: '零售', value: 'retail' },
                    { label: '其他', value: 'other' }
                ]
            },
            {
                key: 'employeeCount',
                label: '員工數量',
                type: 'number',
                attributes: { min: 1, max: 10000 }
            },
            {
                key: 'website',
                label: '公司網站',
                type: 'text',
                placeholder: 'https://example.com',
                validators: [
                    { type: 'pattern', value: '^https?://.+', message: '請輸入有效的網址' }
                ]
            }
        ],
        layout: 'horizontal',
        labelSpan: 6,
        controlSpan: 18
    };

    // 行內佈局表單配置
    inlineFormConfig: FormConfig = {
        fields: [
            {
                key: 'keyword',
                label: '關鍵字',
                type: 'text',
                placeholder: '請輸入搜尋關鍵字',
                span: 8
            },
            {
                key: 'category',
                label: '分類',
                type: 'select',
                options: [
                    { label: '全部', value: '' },
                    { label: '用戶', value: 'user' },
                    { label: '帳戶', value: 'account' },
                    { label: '交易', value: 'transaction' }
                ],
                span: 6
            },
            {
                key: 'status',
                label: '狀態',
                type: 'select',
                options: [
                    { label: '全部', value: '' },
                    { label: '啟用', value: 'active' },
                    { label: '停用', value: 'inactive' }
                ],
                span: 6
            }
        ],
        layout: 'inline'
    };

    constructor(private message: NzMessageService) { }

    // 基本表單提交
    onBasicSubmit(formValue: any): void {
        this.basicLoading = true;
        console.log('Basic form submitted:', formValue);

        // 模擬 API 調用
        setTimeout(() => {
            this.basicLoading = false;
            this.message.success('基本表單提交成功！');
        }, 2000);
    }

    // 基本表單變更
    onBasicChange(formValue: any): void {
        console.log('Basic form changed:', formValue);
    }

    // 進階表單提交
    onAdvancedSubmit(formValue: any): void {
        this.advancedLoading = true;
        console.log('Advanced form submitted:', formValue);

        // 模擬 API 調用
        setTimeout(() => {
            this.advancedLoading = false;
            this.message.success('用戶創建成功！');
        }, 2000);
    }

    // 進階表單取消
    onAdvancedCancel(): void {
        console.log('Advanced form cancelled');
        this.message.info('操作已取消');
    }

    // 進階表單變更
    onAdvancedChange(formValue: any): void {
        console.log('Advanced form changed:', formValue);
    }

    // 水平佈局表單提交
    onHorizontalSubmit(formValue: any): void {
        this.horizontalLoading = true;
        console.log('Horizontal form submitted:', formValue);

        // 模擬 API 調用
        setTimeout(() => {
            this.horizontalLoading = false;
            this.message.success('公司資訊保存成功！');
        }, 1500);
    }

    // 行內佈局表單提交
    onInlineSubmit(formValue: any): void {
        console.log('Inline form submitted (search):', formValue);
        this.message.info(`搜尋條件：${JSON.stringify(formValue)}`);
    }
}