import { computed, inject, Injectable, signal } from '@angular/core';
import { MockProjectRepository } from '@infrastructure/persistence/mock-project.repository';
import { DashboardStats, Project, Task, TaskStatus } from '@shared/types';
import { differenceInDays } from 'date-fns';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
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
      const stack: Task[] = [...project.tasks];
      while (stack.length) {
        const t = stack.pop()!;
        totalTasks += 1;
        if (t.status === 'Completed') completedTasks += 1;
        stack.push(...t.subTasks);
      }
    });
    const upcomingDeadlines = projects.filter(p => {
      const daysUntilDeadline = differenceInDays(p.endDate, new Date());
      return daysUntilDeadline <= 30 && daysUntilDeadline >= 0;
    });
    return { totalProjects, totalTasks, completedTasks, upcomingDeadlines };
  });

  private readonly projectRepository = inject(MockProjectRepository);

  constructor() { this.loadProjects(); }

  private loadProjects(): void {
    this._loading.set(true);
    this._error.set(null);
    this.projectRepository.getAll().subscribe({
      next: (projects: Project[]) => { this._projects.set(projects); this._loading.set(false); },
      error: (error: any) => { this._error.set(error?.message || 'Failed to load projects'); this._loading.set(false); }
    });
  }

  findProject(id: string): Observable<Project | null> {
    return this.projectRepository.findById(id);
  }

  async createProject(projectData: Omit<Project, 'id' | 'tasks'>): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      await this.projectRepository.create(projectData);
      this.loadProjects();
    } catch (error: any) {
      this._error.set(error?.message || 'Failed to create project');
      this._loading.set(false);
    }
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void> {
    try { await this.projectRepository.updateTaskStatus(projectId, taskId, status); this.loadProjects(); }
    catch (error: any) { this._error.set(error?.message || 'Failed to update task status'); }
  }

  async addTask(projectId: string, parentTaskId: string | null, taskData: Omit<Task, 'id' | 'subTasks'>): Promise<void> {
    try { await this.projectRepository.addTask(projectId, parentTaskId, taskData); this.loadProjects(); }
    catch (error: any) { this._error.set(error?.message || 'Failed to add task'); }
  }

  calculateProjectProgress(project: Project): number {
    let total = 0; let completed = 0;
    const stack: Task[] = [...project.tasks];
    while (stack.length) {
      const t = stack.pop()!;
      total += 1; if (t.status === 'Completed') completed += 1;
      stack.push(...t.subTasks);
    }
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  calculateRemainingValue(project: Project, parentTask?: Task): number {
    if (parentTask) {
      const usedValue = parentTask.subTasks.reduce((sum, task) => sum + task.value, 0);
      return parentTask.value - usedValue;
    }
    const used = project.tasks.reduce((sum, t) => sum + t.value, 0);
    return project.value - used;
  }
}


