/**
 * @fileoverview 安全管理頁面 (Safety Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-safety-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>安全管理</h2>
      <p>此為安全管理頁面骨架。</p>
    </div>
  `
})
export class SafetyPageComponent {}


