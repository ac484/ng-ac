/**
 * @fileoverview 佈局彈性盒組件 (Layout Flex Component)
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by System Migration
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Component
 * • 依賴：@angular/common
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅負責彈性佈局渲染，無業務邏輯
 *
 * @module LayoutFlexComponent
 * @layer Interface
 * @context Layout System
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-flex',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-flex" [ngClass]="directionClass" [ngStyle]="{ '--flex-gap': gap }">
      <ng-content />
    </div>
  `,
  styleUrls: ['./layout-flex.component.scss']
})
export class LayoutFlexComponent {
  @Input() direction: 'row' | 'column' = 'row';
  @Input() gap = '1rem';

  get directionClass(): string {
    return this.direction === 'column' ? 'layout-flex--column' : 'layout-flex--row';
  }
}


