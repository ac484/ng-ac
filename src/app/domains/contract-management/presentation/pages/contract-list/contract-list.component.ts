import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contract-list-container">
      <h2>合約管理</h2>
      <div class="contract-list-content">
        <p>合約列表頁面 - DDD架構</p>
        <!-- 這裡將包含合約列表的具體實現 -->
      </div>
    </div>
  `,
  styles: [`
    .contract-list-container {
      padding: 24px;
    }
    .contract-list-content {
      margin-top: 16px;
    }
  `]
})
export class ContractListComponent {
  constructor() {}
}
