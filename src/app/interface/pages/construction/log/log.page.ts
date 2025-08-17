/**
 * @fileoverview 日誌檢視頁面 (Log Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-log-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>系統日誌</h2>
      <p>此為日誌頁面骨架。</p>
    </div>
  `
})
export class LogPageComponent {}


