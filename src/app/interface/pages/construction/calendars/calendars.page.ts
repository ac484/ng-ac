/**
 * @fileoverview 行事曆頁面 (Calendars Page)
 * @author NG-AC Team
 * @version 1.0.0
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page Component (Standalone)
 * • 依賴：Angular Core, CommonModule
 *
 * ⚠️ 架構規則 (Immutable)：
 * • 此檔案的註解格式不可變更
 * • 僅顯示視圖骨架，不包含資料存取邏輯
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-calendars-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>行事曆</h2>
      <p>此為行事曆頁面骨架。</p>
    </div>
  `
})
export class CalendarsPageComponent {}


