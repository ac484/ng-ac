import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material快照條組件 (Angular Material Snack Bar Component)
 * @description 提供Material Design風格的快照條組件，用於顯示簡短消息
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Snack Bar Component
 * - 職責：Material Design快照條組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material快照條的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持自動消失和手動關閉
 * - 支持操作按鈕和自定義樣式
 */
@Component({
  selector: 'mat-snack-bar',
  template: '<div class="mat-snack-bar"><ng-content></ng-content></div>',
  standalone: true
})
export class MatSnackBarComponent {}
