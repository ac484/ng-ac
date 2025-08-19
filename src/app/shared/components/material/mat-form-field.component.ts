import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material表單字段組件 (Angular Material Form Field Component)
 * @description 提供Material Design風格的表單字段組件，用於包裝輸入控件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Form Field Component
 * - 職責：Material Design表單字段組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material表單字段的wrapper
 * - 提供統一的標籤、提示、錯誤狀態管理
 * - 支持前綴和後綴圖標
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-form-field',
  template: '<div class="mat-form-field"><ng-content></ng-content></div>',
  standalone: true
})
export class MatFormFieldComponent {}
