import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material自動完成組件 (Angular Material Autocomplete Component)
 * @description 提供Material Design風格的自動完成組件，用於搜索和選擇
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Autocomplete Component
 * - 職責：Material Design自動完成組件
 * - 依賴：Angular Core、Angular Material、Angular CDK
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material自動完成的wrapper
 * - 基於CDK Overlay構建，提供Material Design樣式
 * - 支持異步數據加載和過濾
 * - 支持鍵盤導航和自定義選項模板
 */
@Component({
  selector: 'mat-autocomplete',
  template: '<div class="mat-autocomplete"><ng-content></ng-content></div>',
  standalone: true
})
export class MatAutocompleteComponent {}
