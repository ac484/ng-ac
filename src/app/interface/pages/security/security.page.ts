/**
 * @fileoverview 安全頁面 (Security Page)
 * @description 顯示最小安全狀態資訊與操作（極簡實作）
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-17
 */

import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="display:flex;flex-direction:column;gap:12px;">
      <h2>Security</h2>
      <p>此頁示意最小安全狀態（登入/登出、角色/權限摘要）。</p>
      <div>
        <strong>Authenticated:</strong> {{ isAuthenticated() ? 'Yes' : 'No' }}
      </div>
      <button (click)="toggle()">模擬登入/登出</button>
    </div>
  `
})
export class SecurityPageComponent {
  isAuthenticated = signal(false);

  toggle() {
    this.isAuthenticated.update(v => !v);
  }
}


