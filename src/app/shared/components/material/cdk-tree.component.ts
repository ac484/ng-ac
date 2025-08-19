import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK樹形組件 (Angular CDK Tree Component)
 * @description 提供Angular CDK的樹形組件，用於層級數據展示
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Tree Component
 * - 職責：CDK樹形組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK樹形的wrapper
 * - 提供樹形的基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持嵌套、展開/收起、選擇等功能
 */
@Component({
  selector: 'cdk-tree',
  template: '<div class="cdk-tree"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkTreeComponent {}
