import { Project, Task, TaskStatus } from '@shared/types';

export abstract class ProjectRepository {
  abstract getAll(): any; // Observable<Project[]> in implementations
  abstract findById(id: string): any; // Observable<Project | null>
  abstract create(projectData: Omit<Project, 'id' | 'tasks'>): Promise<Project>;
  abstract update(id: string, updates: Partial<Project>): Promise<Project>;
  abstract delete(id: string): Promise<void>;
  abstract updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void>;
  abstract addTask(projectId: string, parentTaskId: string | null, taskData: Omit<Task, 'id' | 'subTasks'>): Promise<void>;
}


