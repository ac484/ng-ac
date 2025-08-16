import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK樹節點出口組件 (Angular CDK Tree Node Outlet Component)
 * @description 提供Angular CDK的樹節點出口組件，用於樹節點渲染
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Tree Node Outlet Component
 * - 職責：CDK樹節點出口組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK樹節點出口的wrapper
 * - 用於樹形中渲染節點內容
 * - 無內建樣式，需要自定義CSS
 * - 支持動態節點內容渲染
 */
@Component({
  selector: 'cdk-tree-node-outlet',
  template: '<div class="cdk-tree-node-outlet"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkTreeNodeOutletComponent {}
