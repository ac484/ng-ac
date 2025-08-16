/**
 * @fileoverview 按鈕組件 (Button Component)
 * @description 使用Angular Material實現的超極簡按鈕組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Interface Layer Common Component
 * - 職責：超極簡按鈕組件，一行解決
 * - 依賴：Angular Core, Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此檔案使用Angular Material組件實現按鈕
 * - 採用超極簡主義設計，一行解決
 * - 只提供最基本的按鈕功能
 */

import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  template: `<button mat-raised-button [color]="color" [disabled]="disabled" [type]="type">{{label}}</button>`,
  styles: [``]
})
export class ButtonComponent {
  @Input() label: string = '按鈕';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
}
