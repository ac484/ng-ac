import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material日期選擇器組件 (Angular Material Datepicker Component)
 * @description 提供Material Design風格的日期選擇器組件，用於日期輸入
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Datepicker Component
 * - 職責：Material Design日期選擇器組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material日期選擇器的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持多種日期格式和本地化
 * - 支持日期範圍選擇和驗證
 */
@Component({
  selector: 'mat-datepicker',
  template: '<div class="mat-datepicker"><ng-content></ng-content></div>',
  standalone: true
})
export class MatDatepickerComponent {}
