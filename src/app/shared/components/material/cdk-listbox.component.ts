import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK列表框組件 (Angular CDK Listbox Component)
 * @description 提供Angular CDK的列表框組件，用於多選列表
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Listbox Component
 * - 職責：CDK列表框組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK列表框的wrapper
 * - 提供列表框的基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持單選和多選模式
 */
@Component({
  selector: 'cdk-listbox',
  template: '<div class="cdk-listbox"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkListboxComponent {}
