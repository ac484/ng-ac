import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material卡片標題組組件 (Angular Material Card Title Group Component)
 * @description 提供Material Design風格的卡片標題組組件，用於卡片標題區域
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Card Title Group Component
 * - 職責：Material Design卡片標題組組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material卡片標題組的wrapper
 * - 用於卡片中組織標題、副標題和頭像
 * - 支持響應式佈局和自定義樣式
 * - 與卡片組件配合使用
 */
@Component({
  selector: 'mat-card-title-group',
  template: '<div class="mat-card-title-group"><ng-content></ng-content></div>',
  standalone: true
})
export class MatCardTitleGroupComponent {}
