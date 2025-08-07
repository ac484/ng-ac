import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contract-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contract-detail-container">
      <h2>合約詳情</h2>
      <div class="contract-detail-content">
        <p>合約詳情頁面 - DDD架構</p>
        <!-- 這裡將包含合約詳情的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .contract-detail-container {
        padding: 24px;
      }
      .contract-detail-content {
        margin-top: 16px;
      }
    `
  ]
})
export class ContractDetailComponent {
  constructor() {}
}
