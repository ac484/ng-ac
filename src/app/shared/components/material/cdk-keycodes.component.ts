import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK鍵碼組件 (Angular CDK Keycodes Component)
 * @description 提供Angular CDK的鍵碼組件，用於鍵盤事件處理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Keycodes Component
 * - 職責：CDK鍵碼組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK鍵碼的wrapper
 * - 用於處理鍵盤事件和鍵碼
 * - 無內建樣式，需要自定義CSS
 * - 提供標準化的鍵碼常量
 */
@Component({
  selector: 'cdk-keycodes',
  template: '<div class="cdk-keycodes"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkKeycodesComponent {}
