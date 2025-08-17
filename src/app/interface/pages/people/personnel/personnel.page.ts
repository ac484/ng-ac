/**
 * @fileoverview 員工管理頁面 (Personnel Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-personnel-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>員工管理</h2>
      <p>此為員工管理頁面骨架。</p>
    </div>
  `
})
export class PersonnelPageComponent {}


