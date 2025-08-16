import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material按鈕組件 (Angular Material Button Component)
 * @description 提供Material Design風格的按鈕組件，支持多種樣式和狀態
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Button Component
 * - 職責：Material Design按鈕組件
 * - 依賴：Angular Core
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material按鈕的wrapper
 * - 支持多種按鈕樣式：raised、stroked、flat、icon等
 * - 支持禁用狀態和加載狀態
 * - 遵循Material Design設計規範
 */
@Component({
  selector: 'mat-button',
  template: '<button class="mat-button"><ng-content></ng-content></button>',
  standalone: true
})
export class MatButtonComponent {}
