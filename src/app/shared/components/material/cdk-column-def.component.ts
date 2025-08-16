import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK列定義組件 (Angular CDK Column Definition Component)
 * @description 提供Angular CDK的列定義組件，用於表格列定義
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Column Definition Component
 * - 職責：CDK表格列定義組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK列定義的wrapper
 * - 用於表格中定義列結構和屬性
 * - 無內建樣式，需要自定義CSS
 * - 支持自定義列名和屬性
 */
@Component({
  selector: 'cdk-column-def',
  template: '<ng-content></ng-content>',
  standalone: true
})
export class CdkColumnDefComponent {}
