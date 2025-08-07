import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-budget-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-list-container">
      <h2>預算管理</h2>
      <div class="budget-list-content">
        <p>預算列表頁面 - DDD架構</p>
        <!-- 這裡將包含預算列表的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .budget-list-container {
        padding: 24px;
      }
      .budget-list-content {
        margin-top: 16px;
      }
    `
  ]
})
export class BudgetListComponent {
  constructor() {}
}
