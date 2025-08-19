/**
 * @fileoverview 容器查詢組件 (Container Query Component)
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
 * • 僅負責容器查詢樣式容器，無業務邏輯
 *
 * @module ContainerQueryComponent
 * @layer Interface
 * @context Layout System
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-container-query',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-query" [ngClass]="sizeClass">
      <ng-content />
    </div>
  `,
  styleUrls: ['./container-query.component.scss']
})
export class ContainerQueryComponent {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get sizeClass(): string {
    return `container-query--${this.size}`;
  }
}


