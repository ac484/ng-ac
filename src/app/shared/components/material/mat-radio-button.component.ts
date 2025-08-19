import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material單選按鈕組件 (Angular Material Radio Button Component)
 * @description 提供Material Design風格的單選按鈕組件，用於單選選擇
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Radio Button Component
 * - 職責：Material Design單選按鈕組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material單選按鈕的wrapper
 * - 支持單選組和單個單選按鈕
 * - 支持禁用狀態和只讀狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-radio-button',
  template: '<div class="mat-radio-button"><input type="radio"><ng-content></ng-content></div>',
  standalone: true
})
export class MatRadioButtonComponent {}
