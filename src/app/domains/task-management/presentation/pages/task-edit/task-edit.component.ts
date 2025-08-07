import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-task-edit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-edit-container">
      <h2>任務編輯</h2>
      <div class="task-edit-content">
        <p>任務編輯頁面 - DDD架構</p>
        <!-- 這裡將包含任務編輯的具體實現 -->
      </div>
    </div>
  `,
  styles: [
    `
      .task-edit-container {
        padding: 24px;
      }
      .task-edit-content {
        margin-top: 16px;
      }
    `
  ]
})
export class TaskEditComponent {
  constructor() {}
}
