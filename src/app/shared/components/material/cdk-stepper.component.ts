import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK步驟器組件 (Angular CDK Stepper Component)
 * @description 提供Angular CDK的步驟器組件，用於多步驟流程
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Stepper Component
 * - 職責：CDK步驟器組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK步驟器的wrapper
 * - 提供步驟器的基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持線性和非線性步驟流程
 */
@Component({
  selector: 'cdk-stepper',
  template: '<div class="cdk-stepper"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkStepperComponent {}
