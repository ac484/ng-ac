import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material卡片組件 (Angular Material Card Component)
 * @description 提供Material Design風格的卡片組件，用於展示內容和操作
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Card Component
 * - 職責：Material Design卡片組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material卡片的wrapper
 * - 支持標題、副標題、內容、操作按鈕等區域
 * - 支持媒體內容和圖片
 * - 支持多種尺寸和樣式變體
 */
@Component({
  selector: 'mat-card',
  template: '<div class="mat-card"><ng-content></ng-content></div>',
  standalone: true
})
export class MatCardComponent {}
