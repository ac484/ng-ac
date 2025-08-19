/**
 * @ai-context {
 *   "role": "Domain/Entity",
 *   "purpose": "Project實體-專案核心業務邏輯",
 *   "constraints": ["無外部服務依賴", "業務規則內部封裝", "聚合一致性"],
 *   "dependencies": ["Task"],
 *   "security": "medium",
 *   "lastmod": "2025-08-19"
 * }
 * @usage ProjectEntity.create(data), project.calculateProgress()
 * @see docs/architecture/domain.md
 */
import { Task, TaskStatus } from '@shared/types';

export class ProjectEntity {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly value: number,
    public readonly tasks: Task[]
  ) {}

  static create(data: {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    value: number;
  }): ProjectEntity {
    return new ProjectEntity(
      crypto.randomUUID(),
      data.title,
      data.description,
      data.startDate,
      data.endDate,
      data.value,
      []
    );
  }

  getTotalTasks(): number {
    return this.countTasks(this.tasks);
  }

  getCompletedTasks(): number {
    return this.countTasksByStatus(this.tasks, 'Completed');
  }

  calculateProgress(): number {
    const leafTasks = this.getLeafTasks(this.tasks);
    const completedValue = leafTasks
      .filter(task => task.status === 'Completed')
      .reduce((sum, task) => sum + task.value, 0);

    return this.value > 0 ? Math.round((completedValue / this.value) * 100) : 0;
  }

  calculateRemainingValue(): number {
    const usedValue = this.tasks.reduce((sum, task) => sum + task.value, 0);
    return this.value - usedValue;
  }

  canAddTask(taskValue: number): boolean {
    return this.calculateRemainingValue() >= taskValue;
  }

  private countTasks(tasks: Task[]): number {
    let count = tasks.length;
    for (const task of tasks) {
      count += this.countTasks(task.subTasks);
    }
    return count;
  }

  private countTasksByStatus(tasks: Task[], status: TaskStatus): number {
    let count = 0;
    for (const task of tasks) {
      if (task.status === status) {
        count++;
      }
      count += this.countTasksByStatus(task.subTasks, status);
    }
    return count;
  }

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
