import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material列表項組件 (Angular Material List Item Component)
 * @description 提供Material Design風格的列表項組件，用於列表內容
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material List Item Component
 * - 職責：Material Design列表項組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material列表項的wrapper
 * - 用於各種列表組件中的單個項目
 * - 支持圖標、標籤、副標題等內容
 * - 支持點擊事件和選擇狀態
 */
@Component({
  selector: 'mat-list-item',
  template: '<div class="mat-list-item"><ng-content></ng-content></div>',
  standalone: true
})
export class MatListItemComponent {}
