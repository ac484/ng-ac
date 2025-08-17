/**
 * @fileoverview 設備管理頁面 (Equipment Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-equipment-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>設備管理</h2>
      <p>此為設備管理頁面骨架。</p>
    </div>
  `
})
export class EquipmentPageComponent {}


