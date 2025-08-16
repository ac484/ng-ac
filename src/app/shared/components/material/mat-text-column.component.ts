import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material文本列組件 (Angular Material Text Column Component)
 * @description 提供Material Design風格的文本列組件，用於表格列定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Text Column Component
 * - 職責：Material Design文本列組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material文本列的wrapper
 * - 基於CDK Text Column構建，提供Material Design樣式
 * - 用於表格中顯示簡單文本內容
 * - 支持排序、過濾和自定義格式化
 */
@Component({
  selector: 'mat-text-column',
  template: '<div class="mat-text-column"><ng-content></ng-content></div>',
  standalone: true
})
export class MatTextColumnComponent {}
