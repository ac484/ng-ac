/**
 * @fileoverview 任務管理頁面 (Task Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>任務管理</h2>
      <p>此為任務管理頁面骨架。</p>
    </div>
  `
})
export class TaskPageComponent {}


