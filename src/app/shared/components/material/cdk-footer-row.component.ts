import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK表尾行組件 (Angular CDK Footer Row Component)
 * @description 提供Angular CDK的表尾行組件，用於表格表尾定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Footer Row Component
 * - 職責：CDK表格表尾行組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK表尾行的wrapper
 * - 用於表格中定義表尾行
 * - 無內建樣式，需要自定義CSS
 * - 支持自定義內容和樣式
 */
@Component({
  selector: 'cdk-footer-row',
  template: '<tr class="cdk-footer-row"><ng-content></ng-content></tr>',
  standalone: true
})
export class CdkFooterRowComponent {}
