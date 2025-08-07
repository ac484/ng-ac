import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-budget-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-detail-container">
      <h2>預算詳情</h2>
      <div class="budget-detail-content">
        <p>預算詳情頁面 - DDD架構</p>
        <!-- 這裡將包含預算詳情的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .budget-detail-container {
        padding: 24px;
      }
      .budget-detail-content {
        margin-top: 16px;
      }
    `
  ]
})
export class BudgetDetailComponent {
  constructor() {}
}
