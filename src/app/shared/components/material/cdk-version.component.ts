import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK版本組件 (Angular CDK Version Component)
 * @description 提供Angular CDK的版本組件，用於版本信息顯示
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Version Component
 * - 職責：CDK版本組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK版本的wrapper
 * - 用於顯示CDK版本信息
 * - 無內建樣式，需要自定義CSS
 * - 提供版本相關的工具和常量
 */
@Component({
  selector: 'cdk-version',
  template: '<div class="cdk-version"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkVersionComponent {}
