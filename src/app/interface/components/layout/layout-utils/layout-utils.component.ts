/**
 * @fileoverview 佈局工具組件 (Layout Utils Component) - 輕量容器
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
 * • 專注於最小可用容器輔助，不含業務邏輯
 *
 * @module LayoutUtilsComponent
 * @layer Interface
 * @context Layout System
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-utils',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="layout-utils"><ng-content /></div>
  `,
  styleUrls: ['./layout-utils.component.scss']
})
export class LayoutUtilsComponent {}


