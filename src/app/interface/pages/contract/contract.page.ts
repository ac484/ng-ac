/**
 * @fileoverview 合約管理頁面 (Contract Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contract-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>合約管理</h2>
      <p>此為合約管理頁面骨架。</p>
    </div>
  `
})
export class ContractPageComponent {}


