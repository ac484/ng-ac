/**
 * @fileoverview 監控頁面 (Monitoring Page)
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page Component (Standalone)
 * • 依賴：Angular Core, CommonModule
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅顯示監控資訊視圖，不包含資料存取邏輯
 *
 * @module Monitoring
 * @layer Interface
 * @context Minimal Request Monitoring View
 * @see docs/0.FILE_HEADER_CONVENTION.md
 */

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-monitoring',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <h2>Monitoring</h2>
      <p>此頁示意最小監控資訊（請求次數、錯誤次數等）。</p>
      <div>
        <strong>Requests:</strong> {{ requests() }}
      </div>
      <div>
        <strong>Errors:</strong> {{ errors() }}
      </div>
      <button (click)="simulate()">模擬請求</button>
    </div>
  `
})
export class MonitoringPageComponent {
  requests = signal(0);
  errors = signal(0);

  simulate() {
    this.requests.update(v => v + 1);
    if (Math.random() < 0.3) this.errors.update(v => v + 1);
  }
}


