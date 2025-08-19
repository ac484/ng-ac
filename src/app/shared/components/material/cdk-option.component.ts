import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK選項組件 (Angular CDK Option Component)
 * @description 提供Angular CDK的選項組件，用於列表框中的單個選項
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Option Component
 * - 職責：CDK選項組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK選項的wrapper
 * - 用於列表框中定義單個選項
 * - 無內建樣式，需要自定義CSS
 * - 支持選擇、禁用等狀態
 */
@Component({
  selector: 'cdk-option',
  template: '<div class="cdk-option"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkOptionComponent {}
