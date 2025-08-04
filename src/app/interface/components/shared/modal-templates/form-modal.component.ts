/**
 * 表單對話框範本組件
 * 提供標準化的表單對話框介面
 */

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'datetime' | 'switch' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: any; disabled?: boolean }>;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  rows?: number;
  errorMessage?: string;
  helpText?: string;
  span?: number; // 欄位寬度 (1-24)
  validators?: ValidatorFn[];
}

export interface FormModalData {
  title: string;
  fields: FormField[];
  initialData?: any;
  submitText?: string;
  cancelText?: string;
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
  showAlert?: boolean;
  alertMessage?: string;
  alertType?: 'success' | 'info' | 'warning' | 'error';
}

@Component({
  selector: 'app-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzRadioModule,
    NzButtonModule,
    NzSpaceModule,
    NzAlertModule
  ],
  template: `
    <div class="form-modal">
      <nz-alert
        *ngIf="data.showAlert && data.alertMessage"
        [nzType]="data.alertType || 'info'"
        [nzMessage]="data.alertMessage"
        nzShowIcon
        class="form-alert"
      >
      </nz-alert>

      <form nz-form [formGroup]="form" [nzLayout]="data.layout || 'vertical'">
        <div class="form-fields">
          <div *ngFor="let field of data.fields" [class]="'form-field-wrapper span-' + (field.span || 24)">
            <nz-form-item>
              <nz-form-label [nzRequired]="field.required">
                {{ field.label }}
              </nz-form-label>
              <nz-form-control [nzErrorTip]="getErrorTip(field)">
                <!-- 文字輸入 -->
                <input
                  *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'password'"
                  nz-input
                  [type]="field.type"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [disabled]="field.disabled || false"
                  [readonly]="field.readonly"
                />

                <!-- 文字區域 -->
                <textarea
                  *ngIf="field.type === 'textarea'"
                  nz-input
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [disabled]="field.disabled || false"
                  [readonly]="field.readonly"
                  [rows]="field.rows || 4"
                >
                </textarea>

                <!-- 數字輸入 -->
                <nz-input-number
                  *ngIf="field.type === 'number'"
                  [formControlName]="field.key"
                  [nzPlaceHolder]="field.placeholder || ''"
                  [nzDisabled]="field.disabled"
                  [nzMin]="field.min"
                  [nzMax]="field.max"
                  [nzStep]="field.step || 1"
                  [nzPrecision]="field.precision || null"
                  style="width: 100%"
                >
                </nz-input-number>

                <!-- 選擇器 -->
                <nz-select
                  *ngIf="field.type === 'select'"
                  [formControlName]="field.key"
                  [nzPlaceHolder]="field.placeholder || '請選擇'"
                  [nzDisabled]="field.disabled"
                  nzAllowClear
                >
                  <nz-option
                    *ngFor="let option of field.options"
                    [nzValue]="option.value"
                    [nzLabel]="option.label"
                    [nzDisabled]="option.disabled"
                  >
                  </nz-option>
                </nz-select>

                <!-- 日期選擇器 -->
                <nz-date-picker
                  *ngIf="field.type === 'date'"
                  [formControlName]="field.key"
                  [nzPlaceHolder]="field.placeholder || '選擇日期'"
                  [nzDisabled]="field.disabled"
                  style="width: 100%"
                >
                </nz-date-picker>

                <!-- 日期時間選擇器 -->
                <nz-date-picker
                  *ngIf="field.type === 'datetime'"
                  [formControlName]="field.key"
                  [nzPlaceHolder]="field.placeholder || '選擇日期時間'"
                  [nzDisabled]="field.disabled"
                  nzShowTime
                  style="width: 100%"
                >
                </nz-date-picker>

                <!-- 開關 -->
                <nz-switch *ngIf="field.type === 'switch'" [formControlName]="field.key" [nzDisabled]="field.disabled"> </nz-switch>

                <!-- 複選框 -->
                <label *ngIf="field.type === 'checkbox'" nz-checkbox [formControlName]="field.key" [nzDisabled]="field.disabled">
                  {{ field.placeholder || field.label }}
                </label>

                <!-- 單選按鈕組 -->
                <nz-radio-group *ngIf="field.type === 'radio'" [formControlName]="field.key" [nzDisabled]="field.disabled">
                  <label *ngFor="let option of field.options" nz-radio [nzValue]="option.value" [nzDisabled]="option.disabled">
                    {{ option.label }}
                  </label>
                </nz-radio-group>

                <!-- 幫助文字 -->
                <div class="field-help" *ngIf="field.helpText">
                  {{ field.helpText }}
                </div>
              </nz-form-control>
            </nz-form-item>
          </div>
        </div>

        <div class="form-actions">
          <nz-space nzSize="small">
            <button nz-button nzType="default" type="button" (click)="onCancel()" [nzLoading]="loading">
              {{ data.cancelText || '取消' }}
            </button>
            <button nz-button nzType="primary" type="button" (click)="onSubmit()" [nzLoading]="loading" [disabled]="form.invalid">
              {{ data.submitText || '確定' }}
            </button>
          </nz-space>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .form-modal {
        padding: 16px;
        min-width: 400px;
      }

      .form-alert {
        margin-bottom: 16px;
      }

      .form-fields {
        display: flex;
        flex-wrap: wrap;
        margin: -8px;
      }

      .form-field-wrapper {
        padding: 8px;
      }

      .form-field-wrapper.span-24 {
        width: 100%;
      }
      .form-field-wrapper.span-12 {
        width: 50%;
      }
      .form-field-wrapper.span-8 {
        width: 33.333%;
      }
      .form-field-wrapper.span-6 {
        width: 25%;
      }

      .field-help {
        font-size: 12px;
        color: #8c8c8c;
        margin-top: 4px;
        line-height: 1.4;
      }

      .form-actions {
        text-align: right;
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #f0f0f0;
      }

      nz-form-item {
        margin-bottom: 16px;
      }

      nz-form-item:last-child {
        margin-bottom: 0;
      }
    `
  ]
})
export class FormModalComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  @Input() data: FormModalData = {
    title: '表單',
    fields: []
  };

  @Input() loading = false;

  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
    const controls: Record<string, any> = {};

    this.data.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const value = this.getInitialValue(field);
      controls[field.key] = [value, validators];
    });

    this.form = this.fb.group(controls);
  }

  private buildValidators(field: FormField): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    if (field.minLength) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }

    if (field.validators) {
      validators.push(...field.validators);
    }

    return validators;
  }

  private getInitialValue(field: FormField): any {
    if (this.data.initialData && this.data.initialData[field.key] !== undefined) {
      return this.data.initialData[field.key];
    }

    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    switch (field.type) {
      case 'number':
        return 0;
      case 'switch':
      case 'checkbox':
        return false;
      case 'select':
      case 'radio':
        return null;
      default:
        return '';
    }
  }

  getErrorTip(field: FormField): string {
    const control = this.form.get(field.key);
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        return `${field.label} 為必填項目`;
      }
      if (control.errors?.['email']) {
        return '請輸入有效的電子郵件地址';
      }
      if (control.errors?.['minlength']) {
        return `${field.label} 至少需要 ${control.errors['minlength'].requiredLength} 個字元`;
      }
      if (control.errors?.['maxlength']) {
        return `${field.label} 不能超過 ${control.errors['maxlength'].requiredLength} 個字元`;
      }
      if (control.errors?.['min']) {
        return `${field.label} 不能小於 ${control.errors['min'].min}`;
      }
      if (control.errors?.['max']) {
        return `${field.label} 不能大於 ${control.errors['max'].max}`;
      }
      if (control.errors?.['pattern']) {
        return field.errorMessage || `${field.label} 格式不正確`;
      }

      // 自定義驗證錯誤
      if (control.errors) {
        return field.errorMessage || `${field.label} 驗證失敗`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submit.emit(this.form.value);
    } else {
      // 標記所有欄位為已觸碰以顯示驗證錯誤
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  /**
   * 取得表單資料（供 ModalService 使用）
   */
  getData(): any {
    return this.form.valid ? this.form.value : null;
  }

  /**
   * 重置表單
   */
  resetForm(): void {
    this.form.reset();
    this.buildForm();
  }

  /**
   * 設定表單資料
   */
  setFormData(data: any): void {
    this.form.patchValue(data);
  }

  /**
   * 取得表單狀態
   */
  getFormStatus(): { valid: boolean; errors: any } {
    return {
      valid: this.form.valid,
      errors: this.form.errors
    };
  }
}
