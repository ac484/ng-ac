/**
 * @fileoverview 響應式容器組件 (Responsive Container Component)
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
 * • 僅負責響應式容器渲染，無業務邏輯
 *
 * @module ResponsiveContainerComponent
 * @layer Interface
 * @context Layout System
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-responsive-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="responsive-container"
         [ngStyle]="{ '--responsive-max-width': maxWidth, '--responsive-padding': padding }">
      <ng-content />
    </div>
  `,
  styleUrls: ['./responsive-container.component.scss']
})
export class ResponsiveContainerComponent {
  @Input() maxWidth = '1200px';
  @Input() padding = '1rem';
}


