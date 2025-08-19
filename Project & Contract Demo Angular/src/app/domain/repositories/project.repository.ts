/**
 * @ai-context {
 *   "role": "Domain/Repository",
 *   "purpose": "Project倉儲接口-專案數據存取抽象",
 *   "constraints": ["接口契約定義", "無實現細節", "領域語言"],
 *   "dependencies": ["Project", "Task"],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage projectRepo.getAll(), projectRepo.create(project)
 * @see docs/architecture/domain.md
 */
import { Project, Task, TaskStatus } from '@shared/types';
import { Observable } from 'rxjs';

export abstract class ProjectRepository {
  abstract getAll(): Observable<Project[]>;
  abstract findById(id: string): Observable<Project | null>;
  abstract create(projectData: Omit<Project, 'id' | 'tasks'>): Promise<Project>;
  abstract update(id: string, updates: Partial<Project>): Promise<Project>;
  abstract delete(id: string): Promise<void>;
  abstract updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void>;
  abstract addTask(projectId: string, parentTaskId: string | null, taskData: Omit<Task, 'id' | 'subTasks'>): Promise<void>;
}
