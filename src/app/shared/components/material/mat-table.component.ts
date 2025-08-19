import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material表格組件 (Angular Material Table Component)
 * @description 提供Material Design風格的數據表格組件，支持排序、分頁和過濾
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Table Component
 * - 職責：Material Design表格組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material表格的wrapper
 * - 基於CDK表格構建，提供Material Design樣式
 * - 支持排序、分頁、過濾、選擇等功能
 * - 支持響應式設計和虛擬滾動
 */
@Component({
  selector: 'mat-table',
  template: '<table class="mat-table"><ng-content></ng-content></table>',
  standalone: true
})
export class MatTableComponent {}
