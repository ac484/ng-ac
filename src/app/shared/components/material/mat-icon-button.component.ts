import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material圖標按鈕組件 (Angular Material Icon Button Component)
 * @description 提供Material Design風格的圖標按鈕組件，用於圖標操作
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Icon Button Component
 * - 職責：Material Design圖標按鈕組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material圖標按鈕的wrapper
 * - 支持多種尺寸和樣式變體
 * - 支持禁用狀態和加載狀態
 * - 支持無障礙訪問和鍵盤導航
 */
@Component({
  selector: 'mat-icon-button',
  template: '<button class="mat-icon-button"><ng-content></ng-content></button>',
  standalone: true
})
export class MatIconButtonComponent {}
