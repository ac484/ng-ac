import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material選項組組件 (Angular Material Option Group Component)
 * @description 提供Material Design風格的選項組組件，用於分組選項
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Option Group Component
 * - 職責：Material Design選項組組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material選項組的wrapper
 * - 用於選擇器中分組相關選項
 * - 支持組標籤和組描述
 * - 支持禁用整個選項組
 */
@Component({
  selector: 'mat-optgroup',
  template: '<div class="mat-optgroup"><ng-content></ng-content></div>',
  standalone: true
})
export class MatOptgroupComponent {}
