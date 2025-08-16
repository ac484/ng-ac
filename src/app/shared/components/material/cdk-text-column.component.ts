import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK文本列組件 (Angular CDK Text Column Component)
 * @description 提供Angular CDK的文本列組件，用於表格文本列定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Text Column Component
 * - 職責：CDK表格文本列組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK文本列的wrapper
 * - 用於表格中顯示簡單文本內容
 * - 無內建樣式，需要自定義CSS
 * - 支持排序、過濾和自定義格式化
 */
@Component({
  selector: 'cdk-text-column',
  template: '<div class="cdk-text-column"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkTextColumnComponent {}
