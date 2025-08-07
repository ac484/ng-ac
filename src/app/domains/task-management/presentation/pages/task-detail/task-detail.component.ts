import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-detail-container">
      <h2>任務詳情</h2>
      <div class="task-detail-content">
        <p>任務詳情頁面 - DDD架構</p>
        <!-- 這裡將包含任務詳情的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .task-detail-container {
        padding: 24px;
      }
      .task-detail-content {
        margin-top: 16px;
      }
    `
  ]
})
export class TaskDetailComponent {
  constructor() {}
}
