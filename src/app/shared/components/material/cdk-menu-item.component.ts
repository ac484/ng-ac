import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK菜單項組件 (Angular CDK Menu Item Component)
 * @description 提供Angular CDK的菜單項組件，用於菜單中的單個項目
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Menu Item Component
 * - 職責：CDK菜單項組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK菜單項的wrapper
 * - 用於菜單中定義單個菜單項
 * - 無內建樣式，需要自定義CSS
 * - 支持圖標、標籤和快捷鍵顯示
 */
@Component({
  selector: 'cdk-menu-item',
  template: '<div class="cdk-menu-item"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkMenuItemComponent {}
