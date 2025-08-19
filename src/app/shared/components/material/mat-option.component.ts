import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material選項組件 (Angular Material Option Component)
 * @description 提供Material Design風格的選項組件，用於選擇器和列表
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Option Component
 * - 職責：Material Design選項組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material選項的wrapper
 * - 用於選擇器、自動完成、列表等組件
 * - 支持禁用狀態和選擇狀態
 * - 支持自定義內容和樣式
 */
@Component({
  selector: 'mat-option',
  template: '<div class="mat-option"><ng-content></ng-content></div>',
  standalone: true
})
export class MatOptionComponent {}
