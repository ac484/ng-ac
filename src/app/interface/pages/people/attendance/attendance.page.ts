/**
 * @fileoverview 出勤管理頁面 (Attendance Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-attendance-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>出勤管理</h2>
      <p>此為出勤管理頁面骨架。</p>
    </div>
  `
})
export class AttendancePageComponent {}


