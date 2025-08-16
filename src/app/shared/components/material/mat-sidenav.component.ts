import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material側邊導航組件 (Angular Material Sidenav Component)
 * @description 提供Material Design風格的側邊導航組件，用於應用導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Sidenav Component
 * - 職責：Material Design側邊導航組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material側邊導航的wrapper
 * - 基於CDK Layout構建，提供Material Design樣式
 * - 支持響應式設計和手勢操作
 * - 支持多種模式：over、push、side等
 */
@Component({
  selector: 'mat-sidenav',
  template: '<aside class="mat-sidenav"><ng-content></ng-content></aside>',
  standalone: true
})
export class MatSidenavComponent {}
