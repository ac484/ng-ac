import type { Project, Task, TaskStatus } from '@/types';
import { BaseFirebaseService } from './base';

export class ProjectService extends BaseFirebaseService<Project> {
  constructor() {
    super('projects');
  }

  // 獲取活躍項目
  async getActiveProjects(): Promise<Project[]> {
    return this.getAll({
      where: [{ field: 'status', operator: '==', value: 'active' }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 獲取項目統計
  async getProjectStats(): Promise<{
    total: number;
    active: number;
    completed: number;
    onHold: number;
  }> {
    const allProjects = await this.getAll();

    return {
      total: allProjects.length,
      active: allProjects.filter(p => p.status === 'active').length,
      completed: allProjects.filter(p => p.status === 'completed').length,
      onHold: allProjects.filter(p => p.status === 'onHold').length,
    };
  }

  // 根據客戶獲取項目
  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return this.getAll({
      where: [{ field: 'clientId', operator: '==', value: clientId }],
      orderBy: { field: 'startDate', direction: 'desc' }
    });
  }

  // 更新任務狀態
  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void> {
    const project = await this.getById(projectId);
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
    await this.update(projectId, { tasks: updatedTasks });
  }

  // 添加任務到項目
  async addTask(
    projectId: string,
    parentTaskId: string | null,
    taskTitle: string,
    quantity: number,
    unitPrice: number
  ): Promise<void> {
    const project = await this.getById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      quantity,
      unitPrice,
      price: quantity * unitPrice,
      status: 'pending',
      lastUpdated: new Date().toISOString(),
      subTasks: []
    };

    if (!parentTaskId) {
      // 添加到根級別
      const updatedTasks = [...project.tasks, newTask];
      await this.update(projectId, { tasks: updatedTasks });
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
      await this.update(projectId, { tasks: updatedTasks });
    }
  }

  // 獲取項目進度
  async getProjectProgress(projectId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    progressPercentage: number;
  }> {
    const project = await this.getById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    const countTasks = (tasks: Task[]): { total: number; completed: number } => {
      let total = 0;
      let completed = 0;

      tasks.forEach(task => {
        total++;
        if (task.status === 'completed') {
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
  }

  // 搜索項目
  async searchProjects(searchTerm: string): Promise<Project[]> {
    const allProjects = await this.getAll();

    return allProjects.filter(project =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // 獲取即將到期的項目
  async getUpcomingDeadlines(days: number = 7): Promise<Project[]> {
    const allProjects = await this.getAll({
      where: [{ field: 'status', operator: '==', value: 'active' }]
    });

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
  }
}

// 導出服務實例
export const projectService = new ProjectService();
