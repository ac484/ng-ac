/**
 * @fileoverview 佈局網格組件，提供靈活的 CSS Grid 佈局功能，支援固定列數和自適應佈局
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2024-12-19 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Component
 * • 依賴：無
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 只負責佈局網格的渲染
 * • 不包含具體的業務邏輯
 *
 * @module LayoutGridComponent
 * @layer Interface
 * @context Layout System
 * @see docs/5.new_Tree_layout.md
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-grid',
  standalone: true,
  template: `
    <div class="layout-grid" [ngClass]="gridClass" [ngStyle]="gridStyles">
      <ng-content />
    </div>
  `
})
export class LayoutGridComponent {
  @Input() columns: 1 | 2 | 3 | 4 | 'auto-fit' | 'auto-fill' = 1;
  @Input() minWidth = '300px';
  @Input() gap = '1rem';
  @Input() padding = '1rem';

  get gridClass(): string {
    return typeof this.columns === 'number' ?
      `layout-grid--${this.columns}-col` :
      `layout-grid--${this.columns}`;
  }

  get gridStyles(): Record<string, string> {
    return {
      '--min-width': this.minWidth,
      '--grid-gap': this.gap,
      '--grid-padding': this.padding
    };
  }
}
