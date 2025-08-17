/**
 * @fileoverview 公開資訊／關於 頁面 (Public/About Page)
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
 * • 僅提供極簡頁面骨架
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>關於</h2><p>這是關於頁的最小骨架。</p>`
})
export class PublicAboutPageComponent {}


