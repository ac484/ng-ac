import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK表格組件 (Angular CDK Table Component)
 * @description 提供無樣式的表格基礎功能，用於構建自定義表格組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Table Component
 * - 職責：CDK表格基礎組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK表格的wrapper
 * - 提供表格的基礎功能：排序、分頁、過濾等
 * - 無內建樣式，需要自定義CSS
 * - 支持虛擬滾動和大量數據渲染
 */
@Component({
  selector: 'cdk-table',
  template: '<table class="cdk-table"><ng-content></ng-content></table>',
  standalone: true
})
export class CdkTableComponent {}
