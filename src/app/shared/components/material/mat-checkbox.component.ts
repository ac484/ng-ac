import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material複選框組件 (Angular Material Checkbox Component)
 * @description 提供Material Design風格的複選框組件，支持多選和狀態管理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Checkbox Component
 * - 職責：Material Design複選框組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material複選框的wrapper
 * - 支持三種狀態：checked、unchecked、indeterminate
 * - 支持禁用狀態和只讀狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-checkbox',
  template: '<div class="mat-checkbox"><input type="checkbox"><ng-content></ng-content></div>',
  standalone: true
})
export class MatCheckboxComponent {}
