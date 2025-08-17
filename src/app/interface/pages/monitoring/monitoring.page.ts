/**
 * @fileoverview 監控頁面 (Monitoring Page)
 * @description 顯示最小請求監控資訊的示意頁（極簡實作）
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-17
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


