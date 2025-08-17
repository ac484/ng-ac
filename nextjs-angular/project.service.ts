/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Angular專案服務-專案數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理", "Angular依賴注入"],
 *   "dependencies": ["BaseFirebaseService", "Project", "Task", "TaskStatus", "ProjectStats", "ProjectProgress"],
 *   "security": "high",
 *   "lastmod": "2024-12-19"
 * }
 * @usage inject(ProjectService) in components or other services
 * @see docs/architecture/infrastructure.md
 */

import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { BaseFirebaseService } from './base-firebase.service';
import {
    CreateProjectDto,
    CreateTaskDto,
    Project,
    ProjectProgress,
    ProjectStats,
    Task,
    TaskStatus,
    UpdateTaskStatusDto
} from './types';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends BaseFirebaseService<Project> {
  constructor(firestore: any) {
    super(firestore, 'projects');
  }

  // 獲取活躍專案
  getActiveProjects(): Observable<Project[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 獲取專案統計
  getProjectStats(): Observable<ProjectStats> {
    return this.getAll().pipe(
      map(allProjects => {
        return {
          total: allProjects.length,
          active: allProjects.filter(p => p.status === 'active').length,
          completed: allProjects.filter(p => p.status === 'completed').length,
          onHold: allProjects.filter(p => p.status === 'onHold').length,
        };
      }),
      catchError(error => {
        console.error('Error getting project stats:', error);
        return throwError(() => new Error('Failed to get project stats'));
      })
    );
  }

  // 根據客戶獲取專案
  getProjectsByClient(clientId: string): Observable<Project[]> {
    return this.getAll({
      where: [{ field: 'clientId', operator: '==', value: clientId }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 更新任務狀態
  updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Observable<void> {
    return this.getById(projectId).pipe(
      map(project => {
        if (!project) {
          throw new Error('Project not found');
        }

        const updateTaskInProject = (tasks: Task[]): Task[] => {
          return tasks.map(task => {
            if (task.id === taskId) {
              return { ...task, status, lastUpdated: new Date().toISOString() };
            }
            if (task.subTasks && task.subTasks.length > 0) {
              return { ...task, subTasks: updateTaskInProject(task.subTasks) };
            }
            return task;
          });
        };

        const updatedTasks = updateTaskInProject(project.tasks);
        return { projectId, updatedTasks };
      }),
      map(({ projectId, updatedTasks }) => {
        return this.update(projectId, { tasks: updatedTasks });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error updating task status:', error);
        return throwError(() => new Error('Failed to update task status'));
      })
    );
  }

  // 添加任務到專案
  addTask(
    projectId: string,
    parentTaskId: string | null,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ): Observable<void> {
    return this.getById(projectId).pipe(
      map(project => {
        if (!project) {
          throw new Error('Project not found');
        }

        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: taskTitle,
          quantity,
          unitPrice,
          value: quantity * unitPrice,
          status: 'Pending',
          lastUpdated: new Date().toISOString(),
          subTasks: []
        };

        if (!parentTaskId) {
          // 添加到根級別
          const updatedTasks = [...project.tasks, newTask];
          return { projectId, updatedTasks };
        } else {
          // 添加到父任務下
          const addTaskToParent = (tasks: Task[]): Task[] => {
            return tasks.map(task => {
              if (task.id === parentTaskId) {
                return { ...task, subTasks: [...(task.subTasks || []), newTask] };
              }
              if (task.subTasks && task.subTasks.length > 0) {
                return { ...task, subTasks: addTaskToParent(task.subTasks) };
              }
              return task;
            });
          };

          const updatedTasks = addTaskToParent(project.tasks);
          return { projectId, updatedTasks };
        }
      }),
      map(({ projectId, updatedTasks }) => {
        return this.update(projectId, { tasks: updatedTasks });
      }),
      map(() => void 0),
      catchError(error => {
        console.error('Error adding task:', error);
        return throwError(() => new Error('Failed to add task'));
      })
    );
  }

  // 獲取專案進度
  getProjectProgress(projectId: string): Observable<ProjectProgress> {
    return this.getById(projectId).pipe(
      map(project => {
        if (!project) {
          throw new Error('Project not found');
        }

        const countTasks = (tasks: Task[]): { total: number; completed: number } => {
          let total = 0;
          let completed = 0;

          tasks.forEach(task => {
            total++;
            if (task.status === 'Completed') {
              completed++;
            }
            if (task.subTasks && task.subTasks.length > 0) {
              const subCount = countTasks(task.subTasks);
              total += subCount.total;
              completed += subCount.completed;
            }
          });

          return { total, completed };
        };

        const { total, completed } = countTasks(project.tasks);
        const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          totalTasks: total,
          completedTasks: completed,
          progressPercentage
        };
      }),
      catchError(error => {
        console.error('Error getting project progress:', error);
        return throwError(() => new Error('Failed to get project progress'));
      })
    );
  }

  // 搜索專案
  searchProjects(searchTerm: string): Observable<Project[]> {
    return this.getAll().pipe(
      map(allProjects => {
        return allProjects.filter(project =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.client?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }),
      catchError(error => {
        console.error('Error searching projects:', error);
        return throwError(() => new Error('Failed to search projects'));
      })
    );
  }

  // 獲取即將到期的專案
  getUpcomingDeadlines(days: number = 7): Observable<Project[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'active' }]
    }).pipe(
      map(allProjects => {
        const now = new Date();
        const deadline = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

        return allProjects.filter(project => {
          if (!project.endDate) return false;
          const endDate = new Date(project.endDate);
          return endDate <= deadline && endDate >= now;
        }).sort((a, b) => {
          const aDate = new Date(a.endDate!);
          const bDate = new Date(b.endDate!);
          return aDate.getTime() - bDate.getTime();
        });
      }),
      catchError(error => {
        console.error('Error getting upcoming deadlines:', error);
        return throwError(() => new Error('Failed to get upcoming deadlines'));
      })
    );
  }

  // 創建新專案
  createProject(projectData: CreateProjectDto): Observable<string> {
    return this.create(projectData);
  }

  // 創建新任務
  createTask(taskData: CreateTaskDto): Observable<void> {
    return this.addTask(
      taskData.projectId,
      taskData.parentTaskId,
      taskData.taskTitle,
      taskData.quantity,
      taskData.unitPrice
    );
  }

  // 更新任務狀態
  updateTaskStatusDto(updateData: UpdateTaskStatusDto): Observable<void> {
    return this.updateTaskStatus(
      updateData.projectId,
      updateData.taskId,
      updateData.status
    );
  }

  // 獲取專案實時更新
  getProjectsRealtime(): Observable<Project[]> {
    return this.subscribeToCollection();
  }

  // 獲取單個專案實時更新
  getProjectRealtime(projectId: string): Observable<Project | null> {
    return this.subscribeToDocument(projectId);
  }
}
