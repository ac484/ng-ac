import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material列表組件 (Angular Material List Component)
 * @description 提供Material Design風格的列表組件，用於展示項目列表
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material List Component
 * - 職責：Material Design列表組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material列表的wrapper
 * - 支持單選、多選、導航等模式
 * - 支持自定義列表項樣式和佈局
 * - 支持響應式設計和滾動行為
 */
@Component({
  selector: 'mat-list',
  template: '<div class="mat-list"><ng-content></ng-content></div>',
  standalone: true
})
export class MatListComponent {}
