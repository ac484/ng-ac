/**
 * @fileoverview 施工報告頁面 (Construction Reports Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-construction-reports-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>施工報告</h2>
      <p>此為施工報告頁面骨架。</p>
    </div>
  `
})
export class ConstructionReportsPageComponent {}


