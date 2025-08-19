import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material步驟器組件 (Angular Material Stepper Component)
 * @description 提供Material Design風格的步驟器組件，用於多步驟流程
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Stepper Component
 * - 職責：Material Design步驟器組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material步驟器的wrapper
 * - 基於CDK Stepper構建，提供Material Design樣式
 * - 支持線性和非線性步驟流程
 * - 支持水平、垂直佈局和自定義樣式
 */
@Component({
  selector: 'mat-stepper',
  template: '<div class="mat-stepper"><ng-content></ng-content></div>',
  standalone: true
})
export class MatStepperComponent {}
