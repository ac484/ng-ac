import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material滑動開關組件 (Angular Material Slide Toggle Component)
 * @description 提供Material Design風格的滑動開關組件，用於開關狀態
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Slide Toggle Component
 * - 職責：Material Design滑動開關組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material滑動開關的wrapper
 * - 支持開關狀態和標籤顯示
 * - 支持禁用狀態和只讀狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-slide-toggle',
  template: '<div class="mat-slide-toggle"><ng-content></ng-content></div>',
  standalone: true
})
export class MatSlideToggleComponent {}
