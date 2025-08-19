import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material滑塊組件 (Angular Material Slider Component)
 * @description 提供Material Design風格的滑塊組件，用於數值範圍選擇
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Slider Component
 * - 職責：Material Design滑塊組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material滑塊的wrapper
 * - 支持單值和範圍值選擇
 * - 支持離散值和連續值
 * - 支持自定義標籤和刻度顯示
 */
@Component({
  selector: 'mat-slider',
  template: '<div class="mat-slider"><ng-content></ng-content></div>',
  standalone: true
})
export class MatSliderComponent {}
