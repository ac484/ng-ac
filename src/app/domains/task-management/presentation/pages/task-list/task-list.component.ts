import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list-container">
      <h2>任務管理</h2>
      <div class="task-list-content">
        <p>任務列表頁面 - DDD架構</p>
        <!-- 這裡將包含任務列表的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .task-list-container {
        padding: 24px;
      }
      .task-list-content {
        margin-top: 16px;
      }
    `
  ]
})
export class TaskListComponent {
  constructor() {}
}
