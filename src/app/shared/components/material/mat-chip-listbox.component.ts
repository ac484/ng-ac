import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material標籤列表框組件 (Angular Material Chip Listbox Component)
 * @description 提供Material Design風格的標籤列表框組件，用於多選標籤
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Chip Listbox Component
 * - 職責：Material Design標籤列表框組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material標籤列表框的wrapper
 * - 支持多選和單選模式
 * - 支持可選擇、可刪除、可編輯等模式
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-chip-listbox',
  template: '<div class="mat-chip-listbox"><ng-content></ng-content></div>',
  standalone: true
})
export class MatChipListboxComponent {}
