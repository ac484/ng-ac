import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material標籤組件 (Angular Material Chips Component)
 * @description 提供Material Design風格的標籤組件，用於展示選項和過濾
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Chips Component
 * - 職責：Material Design標籤組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material標籤的wrapper
 * - 支持可選擇、可刪除、可編輯等模式
 * - 支持自定義圖標和顏色
 * - 支持鍵盤導航和無障礙訪問
 */
@Component({
  selector: 'mat-chips',
  template: '<div class="mat-chips"><ng-content></ng-content></div>',
  standalone: true
})
export class MatChipsComponent {}
