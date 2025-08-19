/**
 * @ai-context {
 *   "role": "Interface/Page",
 *   "purpose": "儀表板頁面-專案統計和概覽",
 *   "constraints": ["響應式設計", "實時數據", "性能優化"],
 *   "dependencies": ["ProjectService", "MatCardModule", "MatProgressBarModule"],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-dashboard></app-dashboard>
 * @see docs/architecture/pages.md
 */
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProjectService } from '@app/application/services/project.service';
import { ProjectProgressChartComponent } from '@app/interface/components/project-progress-chart/project-progress-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    ProjectProgressChartComponent
  ],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>

      @if (projectService.loading()) {
        <div class="loading">
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          <p>Loading dashboard data...</p>
        </div>
      } @else {
        <!-- Stats Cards -->
        <div class="dashboard-stats">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>work</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats().totalProjects }}</h3>
                  <p>Total Projects</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>assignment</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats().totalTasks }}</h3>
                  <p>Total Tasks</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats().completedTasks }}</h3>
                  <p>Completed Tasks</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-content">
                <div class="stat-icon">
                  <mat-icon>schedule</mat-icon>
                </div>
                <div class="stat-info">
                  <h3>{{ stats().upcomingDeadlines.length }}</h3>
                  <p>Upcoming Deadlines</p>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <!-- Project Progress Charts -->
        <div class="charts-section">
          <h2>Project Progress</h2>
          <div class="charts-grid">
            @for (project of projectService.projects(); track project.id) {
              <app-project-progress-chart [project]="project"></app-project-progress-chart>
            } @empty {
              <mat-card>
                <mat-card-content>
                  <p>No projects found. Create your first project to get started.</p>
                  <button mat-raised-button color="primary" routerLink="/projects">
                    Create Project
                  </button>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </div>

        <!-- Upcoming Deadlines -->
        @if (stats().upcomingDeadlines.length > 0) {
          <div class="deadlines-section">
            <h2>Upcoming Deadlines (Next 30 Days)</h2>
            <mat-card>
              <mat-card-content>
                @for (project of stats().upcomingDeadlines; track project.id) {
                  <div class="deadline-item">
                    <div class="deadline-info">
                      <h4>{{ project.title }}</h4>
                      <p>{{ project.description }}</p>
                    </div>
                    <div class="deadline-date">
                      <mat-icon>event</mat-icon>
                      <span>{{ project.endDate | date:'MMM dd, yyyy' }}</span>
                    </div>
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading {
      text-align: center;
      padding: 2rem;
    }

    .dashboard-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      transition: transform 0.2s ease-in-out;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: var(--mat-sys-primary-container);
      color: var(--mat-sys-on-primary-container);
    }

    .stat-info h3 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .stat-info p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .charts-section {
      margin-bottom: 2rem;
    }

    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .deadlines-section {
      margin-bottom: 2rem;
    }

    .deadline-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .deadline-item:last-child {
      border-bottom: none;
    }

    .deadline-info h4 {
      margin: 0 0 0.5rem 0;
    }

    .deadline-info p {
      margin: 0;
      color: var(--mat-sys-on-surface-variant);
    }

    .deadline-date {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--mat-sys-primary);
    }

    @media (max-width: 768px) {
      .dashboard-stats {
        grid-template-columns: 1fr;
      }

      .charts-grid {
        grid-template-columns: 1fr;
      }

      .deadline-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }
  `]
})
export class DashboardPage {
  protected readonly projectService = inject(ProjectService);
  protected readonly stats = this.projectService.dashboardStats;
}
