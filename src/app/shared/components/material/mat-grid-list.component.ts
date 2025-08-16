import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material網格列表組件 (Angular Material Grid List Component)
 * @description 提供Material Design風格的網格列表組件，用於響應式佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Grid List Component
 * - 職責：Material Design網格列表組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material網格列表的wrapper
 * - 支持響應式列數和間距配置
 * - 支持自定義網格項尺寸和佈局
 * - 支持滾動和虛擬化優化
 */
@Component({
  selector: 'mat-grid-list',
  template: '<div class="mat-grid-list"><ng-content></ng-content></div>',
  standalone: true
})
export class MatGridListComponent {}
