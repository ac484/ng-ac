/**
 * @fileoverview 材料庫存頁面 (Inventory Page)
 * @author NG-AC Team
 * @version 1.0.0
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-inventory-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:16px;">
      <h2>材料庫存</h2>
      <p>此為材料庫存頁面骨架。</p>
    </div>
  `
})
export class InventoryPageComponent {}


