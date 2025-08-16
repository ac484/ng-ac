import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK單元格組件 (Angular CDK Cell Component)
 * @description 提供Angular CDK的單元格組件，用於表格單元格定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Cell Component
 * - 職責：CDK表格單元格組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK單元格的wrapper
 * - 用於表格中定義單個單元格
 * - 無內建樣式，需要自定義CSS
 * - 支持自定義內容和樣式
 */
@Component({
  selector: 'cdk-cell',
  template: '<td class="cdk-cell"><ng-content></ng-content></td>',
  standalone: true
})
export class CdkCellComponent {}
