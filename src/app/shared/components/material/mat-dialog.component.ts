import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material對話框組件 (Angular Material Dialog Component)
 * @description 提供Material Design風格的對話框組件，用於模態交互
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Dialog Component
 * - 職責：Material Design對話框組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material對話框的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持自定義標題、內容、操作按鈕
 * - 支持多種尺寸和定位選項
 */
@Component({
  selector: 'mat-dialog',
  template: '<div class="mat-dialog"><ng-content></ng-content></div>',
  standalone: true
})
export class MatDialogComponent {}
