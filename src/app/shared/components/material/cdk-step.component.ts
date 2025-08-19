import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK步驟組件 (Angular CDK Step Component)
 * @description 提供Angular CDK的步驟組件，用於步驟器中的單個步驟
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Step Component
 * - 職責：CDK步驟組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK步驟的wrapper
 * - 用於步驟器中定義單個步驟
 * - 無內建樣式，需要自定義CSS
 * - 支持標題、內容和完成狀態
 */
@Component({
  selector: 'cdk-step',
  template: '<div class="cdk-step"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkStepComponent {}
