/**
 * @fileoverview 文件管理頁面 (Documents Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-documents-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>文件管理</h2>
      <p>此為文件管理頁面骨架。</p>
    </div>
  `
})
export class DocumentsPageComponent {}


