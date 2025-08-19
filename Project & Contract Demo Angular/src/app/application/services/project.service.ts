/**
 * @ai-context {
 *   "role": "Application/Service",
 *   "purpose": "專案應用服務-專案管理協調邏輯",
 *   "constraints": ["協調領域服務", "事務管理", "無業務邏輯"],
 *   "dependencies": ["ProjectRepository", "ProjectEntity"],
 *   "security": "high",
 *   "lastmod": "2025-08-19"
 * }
 * @usage projectService.getAllProjects()
 * @see docs/architecture/application.md
 */
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProjectEntity } from '@app/domain/entities/project.entity';
import { MockProjectRepository } from '@app/infrastructure/persistence/mock-project.repository';
import { DashboardStats, Project, Task, TaskStatus } from '@shared/types';
import { differenceInDays } from 'date-fns';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private readonly _projects = signal<Project[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly projects = this._projects.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly dashboardStats = computed((): DashboardStats => {
    const projects = this.projects();
    const totalProjects = projects.length;

    let totalTasks = 0;
    let completedTasks = 0;

    projects.forEach(project => {
      const entity = new ProjectEntity(
        project.id,
        project.title,
        project.description,
        project.startDate,
        project.endDate,
        project.value,
        project.tasks
      );
      totalTasks += entity.getTotalTasks();
      completedTasks += entity.getCompletedTasks();
    });

    const upcomingDeadlines = projects.filter(project => {
      const daysUntilDeadline = differenceInDays(project.endDate, new Date());
      return daysUntilDeadline <= 30 && daysUntilDeadline >= 0;
    });

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      upcomingDeadlines
    };
  });

  private readonly projectRepository = inject(MockProjectRepository);

  constructor() {
    this.loadProjects();
  }

  private loadProjects(): void {
    this._loading.set(true);
    this._error.set(null);

    this.projectRepository.getAll().subscribe({
      next: (projects: Project[]) => {
        this._projects.set(projects);
        this._loading.set(false);
      },
      error: (error: any) => {
        this._error.set(error.message || 'Failed to load projects');
        this._loading.set(false);
      }
    });
  }

  findProject(id: string): Observable<Project | null> {
    return this.projectRepository.findById(id);
  }

  async createProject(projectData: Omit<Project, 'id' | 'tasks'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const newProject = await this.projectRepository.create(projectData);
      // Reload projects to get updated list
      this.loadProjects();
    } catch (error: any) {
      this._error.set(error.message || 'Failed to create project');
      this._loading.set(false);
    }
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void> {
    try {
      await this.projectRepository.updateTaskStatus(projectId, taskId, status);
      // Reload projects to get updated data
      this.loadProjects();
    } catch (error: any) {
      this._error.set(error.message || 'Failed to update task status');
    }
  }

  async addTask(
    projectId: string,
    parentTaskId: string | null,
    taskData: Omit<Task, 'id' | 'subTasks'>
  ): Promise<void> {
    try {
      await this.projectRepository.addTask(projectId, parentTaskId, taskData);
      // Reload projects to get updated data
      this.loadProjects();
    } catch (error: any) {
      this._error.set(error.message || 'Failed to add task');
    }
  }

  calculateProjectProgress(project: Project): number {
    const entity = new ProjectEntity(
      project.id,
      project.title,
      project.description,
      project.startDate,
      project.endDate,
      project.value,
      project.tasks
    );
    return entity.calculateProgress();
  }

  calculateRemainingValue(project: Project, parentTask?: Task): number {
    if (parentTask) {
      const usedValue = parentTask.subTasks.reduce((sum, task) => sum + task.value, 0);
      return parentTask.value - usedValue;
    }

    const entity = new ProjectEntity(
      project.id,
      project.title,
      project.description,
      project.startDate,
      project.endDate,
      project.value,
      project.tasks
    );
    return entity.calculateRemainingValue();
  }
}
