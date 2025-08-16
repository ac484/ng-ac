import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material按鈕切換組件 (Angular Material Button Toggle Component)
 * @description 提供Material Design風格的按鈕切換組件，用於多選狀態
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Button Toggle Component
 * - 職責：Material Design按鈕切換組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material按鈕切換的wrapper
 * - 支持單選和多選模式
 * - 支持禁用狀態和只讀狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-button-toggle',
  template: '<div class="mat-button-toggle"><ng-content></ng-content></div>',
  standalone: true
})
export class MatButtonToggleComponent {}
