import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK菜單組件 (Angular CDK Menu Component)
 * @description 提供Angular CDK的菜單組件，用於下拉選項和導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Menu Component
 * - 職責：CDK菜單組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK菜單的wrapper
 * - 基於CDK Overlay構建，提供菜單基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持多級菜單和自定義菜單項
 */
@Component({
  selector: 'cdk-menu',
  template: '<div class="cdk-menu"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkMenuComponent {}
