import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material操作列表組件 (Angular Material Action List Component)
 * @description 提供Material Design風格的操作列表組件，用於操作菜單
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Action List Component
 * - 職責：Material Design操作列表組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material操作列表的wrapper
 * - 用於菜單、下拉選項、操作面板等
 * - 支持圖標、標籤和快捷鍵顯示
 * - 支持禁用狀態和選擇狀態
 */
@Component({
  selector: 'mat-action-list',
  template: '<div class="mat-action-list"><ng-content></ng-content></div>',
  standalone: true
})
export class MatActionListComponent {}
