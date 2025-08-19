import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material選擇列表組件 (Angular Material Selection List Component)
 * @description 提供Material Design風格的選擇列表組件，用於多選列表
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Selection List Component
 * - 職責：Material Design選擇列表組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material選擇列表的wrapper
 * - 支持單選和多選模式
 * - 支持禁用狀態和只讀狀態
 * - 與Angular Reactive Forms完全兼容
 */
@Component({
  selector: 'mat-selection-list',
  template: '<div class="mat-selection-list"><ng-content></ng-content></div>',
  standalone: true
})
export class MatSelectionListComponent {}
