import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contract-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contract-edit-container">
      <h2>合約編輯</h2>
      <div class="contract-edit-content">
        <p>合約編輯頁面 - DDD架構</p>
        <!-- 這裡將包含合約編輯的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .contract-edit-container {
        padding: 24px;
      }
      .contract-edit-content {
        margin-top: 16px;
      }
    `
  ]
})
export class ContractEditComponent {
  constructor() {}
}
