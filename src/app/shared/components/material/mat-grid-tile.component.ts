import { Component } from '@angular/core';

/**
 * @fileoverview Angular Material網格瓦片組件 (Angular Material Grid Tile Component)
 * @description 提供Material Design風格的網格瓦片組件，用於網格佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2024-01-01
 *
 * 檔案性質：
 * - 類型：Angular Material Grid Tile Component
 * - 職責：Material Design網格瓦片組件
 * - 依賴：Angular Core、Angular Material
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 重要說明：
 * - 此組件是Angular Material網格瓦片的wrapper
 * - 用於網格列表中定義單個瓦片
 * - 支持自定義尺寸和佈局
 * - 支持標題、副標題和操作按鈕
 */
@Component({
  selector: 'mat-grid-tile',
  template: '<div class="mat-grid-tile"><ng-content></ng-content></div>',
  standalone: true
})
export class MatGridTileComponent {}
