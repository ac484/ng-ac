/**
 * @fileoverview 公開資訊／職缺 頁面 (Public/Jobs Page)
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
  selector: 'app-public-jobs',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>職缺</h2><p>這是職缺頁的最小骨架。</p>`
})
export class PublicJobsPageComponent {}


