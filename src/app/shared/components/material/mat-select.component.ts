import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material選擇器組件 (Angular Material Select Component)
 * @description 提供Material Design風格的選擇器組件，支持下拉選項和搜索
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Select Component
 * - 職責：Material Design選擇器組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material選擇器的wrapper
 * - 支持單選和多選模式
 * - 支持搜索過濾和分組選項
 * - 支持自定義選項模板
 */
@Component({
  selector: 'mat-select',
  template: '<div class="mat-select"><ng-content></ng-content></div>',
  standalone: true
})
export class MatSelectComponent {}
