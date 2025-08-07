import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-budget-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="budget-edit-container">
      <h2>預算編輯</h2>
      <div class="budget-edit-content">
        <p>預算編輯頁面 - DDD架構</p>
        <!-- 這裡將包含預算編輯的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .budget-edit-container {
        padding: 24px;
      }
      .budget-edit-content {
        margin-top: 16px;
      }
    `
  ]
})
export class BudgetEditComponent {
  constructor() {}
}
