import { Component } from '@angular/core';

/**
 * @fileoverview Angular CDK手風琴項組件 (Angular CDK Accordion Item Component)
 * @description 提供Angular CDK的手風琴項組件，用於手風琴中的單個項目
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular CDK Accordion Item Component
 * - 職責：CDK手風琴項組件
 * - 依賴：Angular Core、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular CDK手風琴項的wrapper
 * - 用於手風琴中定義單個可折疊項目
 * - 無內建樣式，需要自定義CSS
 * - 支持標題、內容和展開/收起狀態
 */
@Component({
  selector: 'cdk-accordion-item',
  template: '<div class="cdk-accordion-item"><ng-content></ng-content></div>',
  standalone: true
})
export class CdkAccordionItemComponent {}
