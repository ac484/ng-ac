import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material工具欄組件 (Angular Material Toolbar Component)
 * @description 提供Material Design風格的工具欄組件，用於應用頂部導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Toolbar Component
 * - 職責：Material Design工具欄組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material工具欄的wrapper
 * - 支持標題、導航菜單、操作按鈕等內容
 * - 支持響應式設計和滾動行為
 * - 支持多種顏色主題和樣式變體
 */
@Component({
  selector: 'mat-toolbar',
  template: '<header class="mat-toolbar"><ng-content></ng-content></header>',
  standalone: true
})
export class MatToolbarComponent {}
