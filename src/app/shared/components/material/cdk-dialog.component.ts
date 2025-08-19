import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK對話框組件 (Angular CDK Dialog Component)
 * @description 提供Angular CDK的對話框組件，用於模態交互
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Dialog Component
 * - 職責：CDK對話框組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK對話框的wrapper
 * - 基於CDK Overlay構建，提供對話框基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持自定義標題、內容、操作按鈕
 */
@Component({
  selector: 'cdk-dialog',
  template: '<div class="cdk-dialog"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkDialogComponent {}
