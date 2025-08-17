/**
 * @fileoverview 公開資訊／法律 頁面 (Public/Legal Page)
 * @author NG-AC Team
 * @version 1.0.0
 * @lastModified 2025-08-17 by NG-AC Team
 *
 * 📋 檔案性質：
 * • 類型：Interface Layer - Page Component (Standalone)
 * • 依賴：Angular Core, CommonModule
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-public-legal',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>法律</h2><p>這是法律頁的最小骨架。</p>`
})
export class PublicLegalPageComponent {}


