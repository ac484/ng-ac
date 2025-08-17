/**
 * @fileoverview 安全頁面 (Security Page)
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
 * • 僅顯示安全狀態視圖，不包含認證資料存取邏輯
 *
 * @module Security
 * @layer Interface
 * @context Minimal Security Status View
 * @see docs/0.FILE_HEADER_CONVENTION.md
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


