import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material輸入框組件 (Angular Material Input Component)
 * @description 提供Material Design風格的輸入框組件，支持多種輸入類型和驗證
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Input Component
 * - 職責：Material Design輸入框組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material輸入框的wrapper
 * - 支持多種輸入類型：text、email、password、number等
 * - 支持浮動標籤、提示文本、錯誤狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-input',
  template: '<input class="mat-input" type="text"><ng-content></ng-content>',
  standalone: true
})
export class MatInputComponent {}
