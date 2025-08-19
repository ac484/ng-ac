import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK測試平台組件 (Angular CDK Testbed Component)
 * @description 提供Angular CDK的測試平台組件，用於組件測試環境
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Testbed Component
 * - 職責：CDK測試平台組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK測試平台的wrapper
 * - 用於組件的單元測試和集成測試
 * - 無內建樣式，需要自定義CSS
 * - 提供測試友好的API和選擇器
 */
@Component({
  selector: 'cdk-testbed',
  template: '<div class="cdk-testbed"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkTestbedComponent {}
