import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK菜單觸發器組件 (Angular CDK Menu Trigger Component)
 * @description 提供Angular CDK的菜單觸發器組件，用於觸發菜單顯示
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Menu Trigger Component
 * - 職責：CDK菜單觸發器組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK菜單觸發器的wrapper
 * - 用於觸發菜單的顯示和隱藏
 * - 無內建樣式，需要自定義CSS
 * - 支持點擊、懸停等觸發方式
 */
@Component({
  selector: 'cdk-menu-trigger',
  template: '<div class="cdk-menu-trigger"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkMenuTriggerComponent {}
