/**
 * @ai-context {
 *   "role": "Application/Service",
 *   "purpose": "Angular專案狀態管理服務-專案狀態協調邏輯",
 *   "constraints": ["協調領域服務", "狀態管理", "無業務邏輯", "Angular依賴注入"],
 *   "dependencies": ["ProjectService", "Project", "Task", "TaskStatus", "BehaviorSubject"],
 *   "security": "medium",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(ProjectStateService) in components for state management
 * @see docs/architecture/application.md
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ProjectService } from './project.service';
import {
    CreateProjectDto,
    CreateTaskDto,
    Project,
    ProjectProgress,
    ProjectStats,
    UpdateTaskStatusDto
} from './types';

export interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  selectedProject: Project | null;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {
  // 狀態管理
  private readonly _state = new BehaviorSubject<ProjectState>({
    projects: [],
    loading: false,
    error: null,
    selectedProject: null
  });

  // 公開的狀態 Observable
  readonly state$ = this._state.asObservable();

  // 便捷的狀態選擇器
  readonly projects$ = this.state$.pipe(map(state => state.projects));
  readonly loading$ = this.state$.pipe(map(state => state.loading));
  readonly error$ = this.state$.pipe(map(state => state.error));
  readonly selectedProject$ = this.state$.pipe(map(state => state.selectedProject));

  // 專案統計
  readonly projectStats$ = this.projects$.pipe(
    map(projects => ({
      total: projects.length,
      active: projects.filter(p => p.status === 'active').length,
      completed: projects.filter(p => p.status === 'completed').length,
      onHold: projects.filter(p => p.status === 'onHold').length,
    }))
  );

  // 活躍專案
  readonly activeProjects$ = this.projects$.pipe(
    map(projects => projects.filter(p => p.status === 'active'))
  );

  constructor(private projectService: ProjectService) {
    // 初始化時載入專案
    this.loadProjects();
  }

  // 載入所有專案
  loadProjects(): void {
    this.setLoading(true);
    this.clearError();

    this.projectService.getAll().pipe(
      tap(projects => {
        this.updateState({ projects, loading: false });
      }),
      catchError(error => {
        this.setError('Failed to load projects');
        this.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  // 載入活躍專案
  loadActiveProjects(): void {
    this.setLoading(true);
    this.clearError();

    this.projectService.getActiveProjects().pipe(
      tap(projects => {
        this.updateState({ projects, loading: false });
      }),
      catchError(error => {
        this.setError('Failed to load active projects');
        this.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  // 根據ID載入專案
  loadProjectById(projectId: string): void {
    this.setLoading(true);
    this.clearError();

    this.projectService.getById(projectId).pipe(
      tap(project => {
        if (project) {
          this.updateState({
            selectedProject: project,
            loading: false
          });
        } else {
          this.setError('Project not found');
          this.setLoading(false);
        }
      }),
      catchError(error => {
        this.setError('Failed to load project');
        this.setLoading(false);
        return throwError(() => error);
      })
    ).subscribe();
  }

  // 創建新專案
  createProject(projectData: CreateProjectDto): Observable<string> {
    this.setLoading(true);
    this.clearError();

    return this.projectService.createProject(projectData).pipe(
      tap(projectId => {
        // 重新載入專案列表
        this.loadProjects();
      }),
      catchError(error => {
        this.setError('Failed to create project');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // 添加任務
  addTask(taskData: CreateTaskDto): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.projectService.createTask(taskData).pipe(
      tap(() => {
        // 如果當前選中的專案是目標專案，重新載入
        const currentState = this._state.value;
        if (currentState.selectedProject?.id === taskData.projectId) {
          this.loadProjectById(taskData.projectId);
        }
        // 重新載入專案列表
        this.loadProjects();
      }),
      catchError(error => {
        this.setError('Failed to add task');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // 更新任務狀態
  updateTaskStatus(updateData: UpdateTaskStatusDto): Observable<void> {
    this.setLoading(true);
    this.clearError();

    return this.projectService.updateTaskStatusDto(updateData).pipe(
      tap(() => {
        // 如果當前選中的專案是目標專案，重新載入
        const currentState = this._state.value;
        if (currentState.selectedProject?.id === updateData.projectId) {
          this.loadProjectById(updateData.projectId);
        }
        // 重新載入專案列表
        this.loadProjects();
      }),
      catchError(error => {
        this.setError('Failed to update task status');
        this.setLoading(false);
        return throwError(() => error);
      })
    );
  }

  // 搜索專案
  searchProjects(searchTerm: string): Observable<Project[]> {
    if (!searchTerm.trim()) {
      return this.projects$;
    }

    return this.projectService.searchProjects(searchTerm);
  }

  // 獲取專案進度
  getProjectProgress(projectId: string): Observable<ProjectProgress> {
    return this.projectService.getProjectProgress(projectId);
  }

  // 獲取專案統計
  getProjectStats(): Observable<ProjectStats> {
    return this.projectService.getProjectStats();
  }

  // 獲取即將到期的專案
  getUpcomingDeadlines(days: number = 7): Observable<Project[]> {
    return this.projectService.getUpcomingDeadlines(days);
  }

  // 選擇專案
  selectProject(project: Project | null): void {
    this.updateState({ selectedProject: project });
  }

  // 清除選中的專案
  clearSelectedProject(): void {
    this.updateState({ selectedProject: null });
  }

  // 根據ID查找專案
  findProject(projectId: string): Project | undefined {
    const currentState = this._state.value;
    return currentState.projects.find(p => p.id === projectId);
  }

  // 根據ID查找專案 (Observable)
  findProject$(projectId: string): Observable<Project | undefined> {
    return this.projects$.pipe(
      map(projects => projects.find(p => p.id === projectId))
    );
  }

  // 實時監聽專案變化
  subscribeToProjectsRealtime(): Observable<Project[]> {
    return this.projectService.getProjectsRealtime().pipe(
      tap(projects => {
        this.updateState({ projects });
      })
    );
  }

  // 實時監聽單個專案變化
  subscribeToProjectRealtime(projectId: string): Observable<Project | null> {
    return this.projectService.getProjectRealtime(projectId).pipe(
      tap(project => {
        if (project) {
          this.updateState({ selectedProject: project });
        }
      })
    );
  }

  // 私有方法：更新狀態
  private updateState(updates: Partial<ProjectState>): void {
    const currentState = this._state.value;
    this._state.next({ ...currentState, ...updates });
  }

  // 私有方法：設置載入狀態
  private setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  // 私有方法：設置錯誤
  private setError(error: string): void {
    this.updateState({ error });
  }

  // 私有方法：清除錯誤
  private clearError(): void {
    this.updateState({ error: null });
  }

  // 重置狀態
  resetState(): void {
    this._state.next({
      projects: [],
      loading: false,
      error: null,
      selectedProject: null
    });
  }

  // 獲取當前狀態快照
  getCurrentState(): ProjectState {
    return this._state.value;
  }
}
