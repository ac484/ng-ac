import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ProjectService } from '@application/services/project.service';
import { Project } from '@shared/types';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="projects-page">
      <div class="page-header">
        <h1>Projects</h1>
        <button mat-raised-button color="primary">
          <mat-icon>add</mat-icon>
          Create Project
        </button>
      </div>

      @if (projectService.loading()) {
        <div class="loading">
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
          <p>Loading projects...</p>
        </div>
      } @else if (projectService.error()) {
        <div class="error">
          <mat-icon>error</mat-icon>
          <p>{{ projectService.error() }}</p>
        </div>
      } @else {
        <div class="projects-grid">
          @for (project of projectService.projects(); track project.id) {
            <mat-card class="project-card" (click)="viewProject(project)">
              <mat-card-header>
                <mat-card-title>{{ project.title }}</mat-card-title>
                <mat-card-subtitle>{{ project.description }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="project-info">
                  <div class="info-item"><mat-icon>event</mat-icon><span>{{ project.startDate | date:'MMM dd, yyyy' }} - {{ project.endDate | date:'MMM dd, yyyy' }}</span></div>
                  <div class="info-item"><mat-icon>attach_money</mat-icon><span>{{ project.value | currency:'USD':'symbol':'1.0-0' }}</span></div>
                  <div class="info-item"><mat-icon>assignment</mat-icon><span>{{ project.tasks.length }} tasks</span></div>
                </div>
                <div class="progress-section">
                  <div class="progress-header"><span>Progress</span><span>{{ calculateProgress(project) }}%</span></div>
                  <mat-progress-bar mode="determinate" [value]="calculateProgress(project)" color="primary"></mat-progress-bar>
                </div>
              </mat-card-content>
              <mat-card-actions align="end">
                <button mat-button (click)="viewProject(project); $event.stopPropagation()"><mat-icon>visibility</mat-icon>View</button>
                <button mat-button (click)="editProject(project); $event.stopPropagation()"><mat-icon>edit</mat-icon>Edit</button>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <div class="empty-state">
              <mat-icon>work_off</mat-icon>
              <h3>No Projects Found</h3>
              <p>Create your first project to get started.</p>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .projects-page{max-width:1200px;margin:0 auto}
    .page-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2rem}
    .page-header h1{margin:0;font-size:2rem;font-weight:500}
    .loading,.error{text-align:center;padding:2rem}
    .error{color:var(--mat-sys-error)}
    .error mat-icon{font-size:48px;width:48px;height:48px;margin-bottom:1rem}
    .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1.5rem}
    .project-card{cursor:pointer;transition:transform .2s ease-in-out,box-shadow .2s ease-in-out;height:fit-content}
    .project-card:hover{transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,.12)}
    .project-info{margin:1rem 0}
    .info-item{display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;font-size:.9rem;color:var(--mat-sys-on-surface-variant)}
    .info-item mat-icon{font-size:18px;width:18px;height:18px}
    .progress-section{margin-top:1rem}
    .progress-header{display:flex;justify-content:space-between;margin-bottom:.5rem;font-size:.9rem;font-weight:500}
    .empty-state{grid-column:1 / -1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:3rem;text-align:center;color:var(--mat-sys-on-surface-variant)}
    .empty-state mat-icon{font-size:64px;width:64px;height:64px;margin-bottom:1rem;opacity:.5}
    .empty-state h3{margin:0 0 .5rem 0;font-weight:500}
    .empty-state p{margin:0 0 1.5rem 0}
    @media (max-width:768px){.page-header{flex-direction:column;align-items:flex-start;gap:1rem}.projects-grid{grid-template-columns:1fr}}
  `]
})
export class ProjectsPage {
  protected readonly projectService = inject(ProjectService);
  private readonly router = inject(Router);
  protected calculateProgress(project: Project): number { return this.projectService.calculateProjectProgress(project); }
  protected viewProject(project: Project): void { this.router.navigate(['/app/projects', project.id]); }
  protected editProject(project: Project): void { console.log('Edit project:', project); }
}


