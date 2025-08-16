/**
 * @fileoverview 輸入框組件 (Input Component)
 * @description 使用Angular Material實現的超極簡輸入框組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Common Component
 * - 職責：超極簡輸入框組件，一行解決
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現輸入框
 * - 採用超極簡主義設計，一行解決
 * - 只提供最基本的輸入框功能
 */

import { Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  template: `<mat-form-field appearance="outline"><mat-label>{{label}}</mat-label><input matInput [type]="type" [placeholder]="placeholder" [value]="value" [disabled]="disabled"></mat-form-field>`,
  styles: [``]
})
export class InputComponent {
  @Input() label: string = '輸入框';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
}
