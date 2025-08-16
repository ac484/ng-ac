import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material導航列表組件 (Angular Material Navigation List Component)
 * @description 提供Material Design風格的導航列表組件，用於應用導航
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Navigation List Component
 * - 職責：Material Design導航列表組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material導航列表的wrapper
 * - 用於側邊導航、頂部導航等場景
 * - 支持路由導航和外部鏈接
 * - 支持圖標、標籤和子菜單
 */
@Component({
  selector: 'mat-nav-list',
  template: '<nav class="mat-nav-list"><ng-content></ng-content></nav>',
  standalone: true
})
export class MatNavListComponent {}
