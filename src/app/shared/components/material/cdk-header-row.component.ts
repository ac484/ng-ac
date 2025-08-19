import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK表頭行組件 (Angular CDK Header Row Component)
 * @description 提供Angular CDK的表頭行組件，用於表格表頭定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Header Row Component
 * - 職責：CDK表格表頭行組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK表頭行的wrapper
 * - 用於表格中定義表頭行
 * - 無內建樣式，需要自定義CSS
 * - 支持自定義內容和樣式
 */
@Component({
  selector: 'cdk-header-row',
  template: '<tr class="cdk-header-row"><ng-content></ng-content></tr>',
  standalone: true
})
export class CdkHeaderRowComponent {}
