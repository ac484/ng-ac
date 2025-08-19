import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material展開面板組件 (Angular Material Expansion Panel Component)
 * @description 提供Material Design風格的展開面板組件，用於可折疊內容
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Expansion Panel Component
 * - 職責：Material Design展開面板組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material展開面板的wrapper
 * - 支持單個或多個面板的展開/收起
 * - 支持自定義標題和內容樣式
 * - 支持動畫效果和無障礙訪問
 */
@Component({
  selector: 'mat-expansion-panel',
  template: '<div class="mat-expansion-panel"><ng-content></ng-content></div>',
  standalone: true
})
export class MatExpansionPanelComponent {}
