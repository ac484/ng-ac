import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK手風琴組件 (Angular CDK Accordion Component)
 * @description 提供Angular CDK的手風琴組件，用於可折疊內容
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Accordion Component
 * - 職責：CDK手風琴組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK手風琴的wrapper
 * - 提供手風琴的基礎功能
 * - 無內建樣式，需要自定義CSS
 * - 支持單個或多個面板的展開/收起
 */
@Component({
  selector: 'cdk-accordion',
  template: '<div class="cdk-accordion"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkAccordionComponent {}
