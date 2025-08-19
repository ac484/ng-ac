/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "專案進度圖表組件-視覺化專案完成度",
 *   "constraints": ["響應式圖表", "Material Design", "性能優化"],
 *   "dependencies": ["MatCardModule", "Project"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-project-progress-chart [project]="project"></app-project-progress-chart>
 * @see docs/architecture/components.md
 */
import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Project, Task } from '@shared/types';

interface ProgressData {
  completed: number;
  inProgress: number;
  pending: number;
  completedPercentage: number;
}

@Component({
  selector: 'app-project-progress-chart',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule
  ],
  template: `
    <mat-card class="progress-card">
      <mat-card-header>
        <mat-card-title>{{ project().title }}</mat-card-title>
        <mat-card-subtitle>{{ project().description }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="progress-summary">
          <div class="progress-circle">
            <div class="percentage">{{ progressData().completedPercentage }}%</div>
            <div class="label">Complete</div>
          </div>

          <div class="progress-details">
            <div class="progress-item completed">
              <div class="color-indicator"></div>
              <span class="label">Completed</span>
              <span class="value">\${{ progressData().completed.toLocaleString() }}</span>
            </div>

            <div class="progress-item in-progress">
              <div class="color-indicator"></div>
              <span class="label">In Progress</span>
              <span class="value">\${{ progressData().inProgress.toLocaleString() }}</span>
            </div>

            <div class="progress-item pending">
              <div class="color-indicator"></div>
              <span class="label">Pending</span>
              <span class="value">\${{ progressData().pending.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="progress-bar-section">
          <mat-progress-bar
            mode="determinate"
            [value]="progressData().completedPercentage"
            color="primary">
          </mat-progress-bar>
          <div class="progress-info">
            <span>Total Value: \${{ project().value.toLocaleString() }}</span>
            <span>{{ progressData().completedPercentage }}% Complete</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .progress-card {
      height: 100%;
    }

    .progress-summary {
      display: flex;
      gap: 2rem;
      margin-bottom: 1.5rem;
    }

    .progress-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: conic-gradient(
        var(--mat-sys-primary) 0deg,
        var(--mat-sys-primary) calc(var(--percentage, 0) * 3.6deg),
        var(--mat-sys-surface-variant) calc(var(--percentage, 0) * 3.6deg),
        var(--mat-sys-surface-variant) 360deg
      );
      position: relative;
    }

    .progress-circle::before {
      content: '';
      position: absolute;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: var(--mat-sys-surface);
    }

    .percentage {
      font-size: 1.5rem;
      font-weight: 600;
      z-index: 1;
    }

    .label {
      font-size: 0.8rem;
      color: var(--mat-sys-on-surface-variant);
      z-index: 1;
    }

    .progress-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .progress-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .color-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .completed .color-indicator {
      background-color: #4caf50;
    }

    .in-progress .color-indicator {
      background-color: #ff9800;
    }

    .pending .color-indicator {
      background-color: #f44336;
    }

    .progress-item .label {
      flex: 1;
      font-size: 0.9rem;
    }

    .progress-item .value {
      font-weight: 500;
    }

    .progress-bar-section {
      margin-top: 1rem;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.9rem;
      color: var(--mat-sys-on-surface-variant);
    }

    @media (max-width: 768px) {
      .progress-summary {
        flex-direction: column;
        align-items: center;
        gap: 1rem;
      }

      .progress-details {
        width: 100%;
      }
    }
  `]
})
export class ProjectProgressChartComponent {
  readonly project = input.required<Project>();

  readonly progressData = computed((): ProgressData => {
    const project = this.project();
    const leafTasks = this.getLeafTasks(project.tasks);

    const completed = leafTasks
      .filter(task => task.status === 'Completed')
      .reduce((sum, task) => sum + task.value, 0);

    const inProgress = leafTasks
      .filter(task => task.status === 'In Progress')
      .reduce((sum, task) => sum + task.value, 0);

    const pending = leafTasks
      .filter(task => task.status === 'Pending')
      .reduce((sum, task) => sum + task.value, 0);

    const completedPercentage = project.value > 0
      ? Math.round((completed / project.value) * 100)
      : 0;

    return {
      completed,
      inProgress,
      pending,
      completedPercentage
    };
  });

  private getLeafTasks(tasks: Task[]): Task[] {
    const leafTasks: Task[] = [];

    for (const task of tasks) {
      if (task.subTasks.length === 0) {
        leafTasks.push(task);
      } else {
        leafTasks.push(...this.getLeafTasks(task.subTasks));
      }
    }

    return leafTasks;
  }
}
