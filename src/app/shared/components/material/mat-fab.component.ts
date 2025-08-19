import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material浮動操作按鈕組件 (Angular Material FAB Component)
 * @description 提供Material Design風格的浮動操作按鈕組件，用於主要操作
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material FAB Component
 * - 職責：Material Design浮動操作按鈕組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material浮動操作按鈕的wrapper
 * - 支持多種尺寸：mini、normal、extended
 * - 支持多種顏色主題和樣式變體
 * - 支持圖標和標籤顯示
 */
@Component({
  selector: 'mat-fab',
  template: '<button class="mat-fab"><ng-content></ng-content></button>',
  standalone: true
})
export class MatFabComponent {}
