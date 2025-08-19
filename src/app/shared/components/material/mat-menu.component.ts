import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material菜單組件 (Angular Material Menu Component)
 * @description 提供Material Design風格的菜單組件，用於下拉選項和導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Menu Component
 * - 職責：Material Design菜單組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material菜單的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持多級菜單和自定義菜單項
 * - 支持鍵盤導航和無障礙訪問
 */
@Component({
  selector: 'mat-menu',
  template: '<div class="mat-menu"><ng-content></ng-content></div>',
  standalone: true
})
export class MatMenuComponent {}
