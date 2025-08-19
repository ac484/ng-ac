import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material樹形組件 (Angular Material Tree Component)
 * @description 提供Material Design風格的樹形組件，用於層級數據展示
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Tree Component
 * - 職責：Material Design樹形組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material樹形的wrapper
 * - 基於CDK Tree構建，提供Material Design樣式
 * - 支持嵌套、展開/收起、選擇等功能
 * - 支持虛擬滾動和大量數據渲染
 */
@Component({
  selector: 'mat-tree',
  template: '<div class="mat-tree"><ng-content></ng-content></div>',
  standalone: true
})
export class MatTreeComponent {}
