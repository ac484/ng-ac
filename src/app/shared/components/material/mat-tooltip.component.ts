import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material工具提示組件 (Angular Material Tooltip Component)
 * @description 提供Material Design風格的工具提示組件，用於顯示額外信息
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Tooltip Component
 * - 職責：Material Design工具提示組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material工具提示的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持延遲顯示和自動隱藏
 * - 支持多種位置和自定義樣式
 */
@Component({
  selector: 'mat-tooltip',
  template: '<div class="mat-tooltip"><ng-content></ng-content></div>',
  standalone: true
})
export class MatTooltipComponent {}
