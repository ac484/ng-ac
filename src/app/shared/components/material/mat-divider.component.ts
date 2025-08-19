import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material分割線組件 (Angular Material Divider Component)
 * @description 提供Material Design風格的分割線組件，用於內容分隔
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Divider Component
 * - 職責：Material Design分割線組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material分割線的wrapper
 * - 支持水平和垂直分割線
 * - 支持內嵌和全寬模式
 * - 支持自定義樣式和主題
 */
@Component({
  selector: 'mat-divider',
  template: '<hr class="mat-divider">',
  standalone: true
})
export class MatDividerComponent {}
