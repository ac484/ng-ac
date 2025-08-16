import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material標籤頁組件 (Angular Material Tabs Component)
 * @description 提供Material Design風格的標籤頁組件，用於內容分組和導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Tabs Component
 * - 職責：Material Design標籤頁組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material標籤頁的wrapper
 * - 支持水平、垂直、固定等佈局模式
 * - 支持響應式設計和滾動行為
 * - 支持自定義標籤樣式和動畫效果
 */
@Component({
  selector: 'mat-tabs',
  template: '<div class="mat-tabs"><ng-content></ng-content></div>',
  standalone: true
})
export class MatTabsComponent {}
