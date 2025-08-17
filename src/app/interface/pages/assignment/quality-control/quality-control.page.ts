/**
 * @fileoverview 品質控制頁面 (Quality Control Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quality-control-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>品質控制</h2>
      <p>此為品質控制頁面骨架。</p>
    </div>
  `
})
export class QualityControlPageComponent {}


