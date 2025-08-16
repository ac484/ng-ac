import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK樹節點組件 (Angular CDK Tree Node Component)
 * @description 提供Angular CDK的樹節點組件，用於樹形中的單個節點
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Tree Node Component
 * - 職責：CDK樹節點組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK樹節點的wrapper
 * - 用於樹形中定義單個節點
 * - 無內建樣式，需要自定義CSS
 * - 支持展開/收起、選擇、編輯等狀態
 */
@Component({
  selector: 'cdk-tree-node',
  template: '<div class="cdk-tree-node"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkTreeNodeComponent {}
