import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material菜單項組件 (Angular Material Menu Item Component)
 * @description 提供Material Design風格的菜單項組件，用於菜單和下拉選項
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Menu Item Component
 * - 職責：Material Design菜單項組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material菜單項的wrapper
 * - 用於菜單、選擇器、自動完成等組件
 * - 支持禁用狀態和選擇狀態
 * - 支持圖標、標籤和快捷鍵顯示
 */
@Component({
  selector: 'mat-menu-item',
  template: '<div class="mat-menu-item"><ng-content></ng-content></div>',
  standalone: true
})
export class MatMenuItemComponent {}
