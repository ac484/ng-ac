/**
 * @fileoverview 事故報告頁面 (Incident Reports Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-incident-reports-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>事故報告</h2>
      <p>此為事故報告頁面骨架。</p>
    </div>
  `
})
export class IncidentReportsPageComponent {}


