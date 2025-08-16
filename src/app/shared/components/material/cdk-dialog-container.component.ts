import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK對話框容器組件 (Angular CDK Dialog Container Component)
 * @description 提供Angular CDK的對話框容器組件，用於對話框內容管理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Dialog Container Component
 * - 職責：CDK對話框容器組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK對話框容器的wrapper
 * - 用於管理對話框的內容和行為
 * - 無內建樣式，需要自定義CSS
 * - 支持組件門戶和模板門戶
 */
@Component({
  selector: 'cdk-dialog-container',
  template: '<div class="cdk-dialog-container"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkDialogContainerComponent {}
