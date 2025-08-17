/**
 * @fileoverview 狀態機示例頁面 (State Machine Demo Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-state-machine-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>狀態機</h2>
      <p>此為狀態機示例頁面骨架。</p>
    </div>
  `
})
export class StateMachinePageComponent {}


