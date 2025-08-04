import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { FormField, FormFieldValidator, FormConfig } from './form-field.interface';

/**
 * 動態表單組件
 * 支援多種輸入類型，整合 nz-form 的驗證和錯誤顯示
 */
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzRadioModule,
    NzButtonModule,
    NzGridModule
  ],
  template: `
    <form nz-form [formGroup]="form" [nzLayout]="config.layout || 'vertical'" [nzAutoTips]="autoTips">
      <nz-row [nzGutter]="16">
        <nz-col *ngFor="let field of visibleFields" [nzSpan]="field.span || getDefaultSpan()">
          <nz-form-item>
            <nz-form-label [nzRequired]="field.required" [nzSpan]="config.layout === 'horizontal' ? config.labelSpan || 6 : null">
              {{ field.label }}
            </nz-form-label>

            <nz-form-control
              [nzSpan]="config.layout === 'horizontal' ? config.controlSpan || 18 : null"
              [nzErrorTip]="getErrorTip(field.key)"
            >
              <!-- 文字輸入 -->
              <input
                *ngIf="field.type === 'text' || field.type === 'email' || field.type === 'password'"
                nz-input
                [type]="field.type"
                [placeholder]="field.placeholder || ''"
                [disabled]="field.disabled || false"
                [formControlName]="field.key"
              />

              <!-- 文字區域 -->
              <textarea
                *ngIf="field.type === 'textarea'"
                nz-input
                [placeholder]="field.placeholder || ''"
                [disabled]="field.disabled || false"
                [formControlName]="field.key"
                [rows]="field.attributes?.['rows'] || 4"
              >
              </textarea>

              <!-- 數字輸入 -->
              <nz-input-number
                *ngIf="field.type === 'number'"
                [nzPlaceHolder]="field.placeholder || ''"
                [nzDisabled]="field.disabled || false"
                [nzMin]="field.attributes?.['min']"
                [nzMax]="field.attributes?.['max']"
                [nzStep]="field.attributes?.['step'] || 1"
                [formControlName]="field.key"
              >
              </nz-input-number>

              <!-- 選擇器 -->
              <nz-select
                *ngIf="field.type === 'select'"
                [nzPlaceHolder]="field.placeholder || '請選擇'"
                [nzDisabled]="field.disabled || false"
                [nzAllowClear]="!field.required"
                [formControlName]="field.key"
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
                [nzPlaceHolder]="field.placeholder || '請選擇日期'"
                [nzDisabled]="field.disabled || false"
                [nzAllowClear]="!field.required"
                [formControlName]="field.key"
              >
              </nz-date-picker>

              <!-- 複選框 -->
              <label *ngIf="field.type === 'checkbox'" nz-checkbox [formControlName]="field.key" [nzDisabled]="field.disabled || false">
                {{ field.description || field.label }}
              </label>

              <!-- 單選按鈕組 -->
              <nz-radio-group *ngIf="field.type === 'radio'" [formControlName]="field.key" [nzDisabled]="field.disabled || false">
                <label *ngFor="let option of field.options" nz-radio [nzValue]="option.value" [nzDisabled]="option.disabled">
                  {{ option.label }}
                </label>
              </nz-radio-group>
            </nz-form-control>

            <!-- 欄位說明 -->
            <div *ngIf="field.description && field.type !== 'checkbox'" class="ant-form-item-explain ant-form-item-explain-connected">
              <div role="alert">{{ field.description }}</div>
            </div>
          </nz-form-item>
        </nz-col>
      </nz-row>

      <!-- 表單按鈕 -->
      <nz-form-item *ngIf="showButtons">
        <nz-form-control>
          <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="!form.valid" (click)="onSubmit()">
            {{ submitText }}
          </button>

          <button *ngIf="showResetButton" nz-button nzType="default" [disabled]="loading" (click)="onReset()" style="margin-left: 8px;">
            {{ resetText }}
          </button>

          <button *ngIf="showCancelButton" nz-button nzType="default" [disabled]="loading" (click)="onCancel()" style="margin-left: 8px;">
            {{ cancelText }}
          </button>
        </nz-form-control>
      </nz-form-item>
    </form>
  `
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  /** 表單配置 */
  @Input() config: FormConfig = { fields: [] };

  /** 表單初始值 */
  @Input() initialValue: any = {};

  /** 載入狀態 */
  @Input() loading = false;

  /** 是否顯示按鈕 */
  @Input() showButtons = true;

  /** 是否顯示重置按鈕 */
  @Input() showResetButton = true;

  /** 是否顯示取消按鈕 */
  @Input() showCancelButton = false;

  /** 提交按鈕文字 */
  @Input() submitText = '提交';

  /** 重置按鈕文字 */
  @Input() resetText = '重置';

  /** 取消按鈕文字 */
  @Input() cancelText = '取消';

  /** 表單提交事件 */
  @Output() formSubmit = new EventEmitter<any>();

  /** 表單重置事件 */
  @Output() formReset = new EventEmitter<void>();

  /** 表單取消事件 */
  @Output() formCancel = new EventEmitter<void>();

  /** 表單值變更事件 */
  @Output() formChange = new EventEmitter<any>();

  /** 表單狀態變更事件 */
  @Output() formStatusChange = new EventEmitter<string>();

  /** 響應式表單 */
  form: FormGroup = new FormGroup({});

  /** 可見欄位列表 */
  visibleFields: FormField[] = [];

  /** 自動提示配置 */
  autoTips: Record<string, Record<string, string>> = {
    'zh-tw': {
      required: '此欄位為必填項目',
      email: '請輸入有效的電子郵件地址',
      minlength: '輸入長度不能少於 {0} 個字符',
      maxlength: '輸入長度不能超過 {0} 個字符',
      min: '數值不能小於 {0}',
      max: '數值不能大於 {0}',
      pattern: '輸入格式不正確'
    }
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.updateVisibleFields();

    // 監聽表單值變更
    this.form.valueChanges.subscribe(value => {
      this.formChange.emit(value);
    });

    // 監聽表單狀態變更
    this.form.statusChanges.subscribe(status => {
      this.formStatusChange.emit(status);
    });

    // 設定初始值
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }

    // 自動聚焦第一個欄位
    if (this.config.autoFocus) {
      setTimeout(() => this.focusFirstField(), 100);
    }
  }

  ngOnDestroy(): void {
    // 清理訂閱
  }

  /**
   * 建立響應式表單
   */
  private buildForm(): void {
    const formControls: Record<string, AbstractControl> = {};

    this.config.fields.forEach(field => {
      const validators = this.buildValidators(field);
      const defaultValue = field.defaultValue || this.getDefaultValueByType(field.type);

      formControls[field.key] = this.fb.control(
        {
          value: defaultValue,
          disabled: field.disabled || false
        },
        validators
      );
    });

    this.form = this.fb.group(formControls);
  }

  /**
   * 建立欄位驗證器
   */
  private buildValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.validators) {
      field.validators.forEach(validator => {
        switch (validator.type) {
          case 'email':
            validators.push(Validators.email);
            break;
          case 'minLength':
            validators.push(Validators.minLength(validator.value));
            break;
          case 'maxLength':
            validators.push(Validators.maxLength(validator.value));
            break;
          case 'min':
            validators.push(Validators.min(validator.value));
            break;
          case 'max':
            validators.push(Validators.max(validator.value));
            break;
          case 'pattern':
            validators.push(Validators.pattern(validator.value));
            break;
          case 'custom':
            if (validator.validator) {
              validators.push((control: AbstractControl) => {
                return validator.validator!(control.value) ? null : { custom: true };
              });
            }
            break;
        }
      });
    }

    return validators;
  }

  /**
   * 根據類型取得預設值
   */
  private getDefaultValueByType(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return null;
      case 'date':
        return null;
      default:
        return '';
    }
  }

  /**
   * 更新可見欄位
   */
  private updateVisibleFields(): void {
    this.visibleFields = this.config.fields.filter(field => !field.hidden);
  }

  /**
   * 取得預設欄位寬度
   */
  getDefaultSpan(): number {
    const layout = this.config.layout || 'vertical';
    return layout === 'inline' ? 8 : 24;
  }

  /**
   * 取得錯誤提示
   */
  getErrorTip(fieldKey: string): string {
    const control = this.form.get(fieldKey);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const field = this.config.fields.find(f => f.key === fieldKey);
    if (!field) return '';

    // 檢查自定義錯誤訊息
    if (field.validators) {
      for (const validator of field.validators) {
        if (control.errors[validator.type]) {
          return validator.message;
        }
      }
    }

    // 使用預設錯誤訊息
    const firstError = Object.keys(control.errors)[0];
    return this.autoTips['zh-tw'][firstError] || '輸入格式不正確';
  }

  /**
   * 聚焦第一個欄位
   */
  private focusFirstField(): void {
    const firstField = this.visibleFields.find(field => !field.disabled);
    if (firstField) {
      const element = document.querySelector(`[formControlName="${firstField.key}"]`) as HTMLElement;
      if (element) {
        element.focus();
      }
    }
  }

  /**
   * 表單提交處理
   */
  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      // 標記所有欄位為已觸碰，顯示驗證錯誤
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
    }
  }

  /**
   * 表單重置處理
   */
  onReset(): void {
    this.form.reset();
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
    this.formReset.emit();
  }

  /**
   * 表單取消處理
   */
  onCancel(): void {
    this.formCancel.emit();
  }

  /**
   * 取得表單值
   */
  getFormValue(): any {
    return this.form.value;
  }

  /**
   * 設定表單值
   */
  setFormValue(value: any): void {
    this.form.patchValue(value);
  }

  /**
   * 重置特定欄位
   */
  resetField(fieldKey: string): void {
    const control = this.form.get(fieldKey);
    if (control) {
      const field = this.config.fields.find(f => f.key === fieldKey);
      const defaultValue = field?.defaultValue || this.getDefaultValueByType(field?.type || 'text');
      control.setValue(defaultValue);
      control.markAsUntouched();
    }
  }

  /**
   * 設定欄位禁用狀態
   */
  setFieldDisabled(fieldKey: string, disabled: boolean): void {
    const control = this.form.get(fieldKey);
    if (control) {
      if (disabled) {
        control.disable();
      } else {
        control.enable();
      }
    }
  }

  /**
   * 驗證表單
   */
  validateForm(): boolean {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsTouched();
    });
    return this.form.valid;
  }
}
