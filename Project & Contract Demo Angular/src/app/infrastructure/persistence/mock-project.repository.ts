/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "模擬專案倉儲-專案數據模擬實現",
 *   "constraints": ["實現領域接口", "靜態數據", "開發測試用"],
 *   "dependencies": ["ProjectRepository", "Project"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 * @usage projectRepo.getAll(), projectRepo.create(project)
 * @see docs/architecture/infrastructure.md
 */
import { Injectable } from '@angular/core';
import { ProjectRepository } from '@app/domain/repositories/project.repository';
import { Project, Task, TaskStatus } from '@shared/types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockProjectRepository extends ProjectRepository {
  private projects: Project[] = [
    {
      id: 'PRJ-001',
      title: 'Website Redesign Project',
      description: 'Complete redesign of the company website with modern UI/UX',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      value: 150000,
      tasks: [
        {
          id: 'TSK-001',
          title: 'UI/UX Design',
          status: 'Completed',
          lastUpdated: '2024-02-15',
          value: 30000,
          quantity: 1,
          unitPrice: 30000,
          subTasks: [
            {
              id: 'TSK-001-1',
              title: 'User Research',
              status: 'Completed',
              lastUpdated: '2024-01-20',
              value: 10000,
              quantity: 1,
              unitPrice: 10000,
              subTasks: []
            },
            {
              id: 'TSK-001-2',
              title: 'Wireframing',
              status: 'Completed',
              lastUpdated: '2024-02-01',
              value: 10000,
              quantity: 1,
              unitPrice: 10000,
              subTasks: []
            },
            {
              id: 'TSK-001-3',
              title: 'Visual Design',
              status: 'Completed',
              lastUpdated: '2024-02-15',
              value: 10000,
              quantity: 1,
              unitPrice: 10000,
              subTasks: []
            }
          ]
        },
        {
          id: 'TSK-002',
          title: 'Frontend Development',
          status: 'In Progress',
          lastUpdated: '2024-03-10',
          value: 80000,
          quantity: 1,
          unitPrice: 80000,
          subTasks: [
            {
              id: 'TSK-002-1',
              title: 'Component Development',
              status: 'In Progress',
              lastUpdated: '2024-03-10',
              value: 40000,
              quantity: 1,
              unitPrice: 40000,
              subTasks: []
            },
            {
              id: 'TSK-002-2',
              title: 'Integration Testing',
              status: 'Pending',
              lastUpdated: '2024-03-01',
              value: 20000,
              quantity: 1,
              unitPrice: 20000,
              subTasks: []
            },
            {
              id: 'TSK-002-3',
              title: 'Performance Optimization',
              status: 'Pending',
              lastUpdated: '2024-03-01',
              value: 20000,
              quantity: 1,
              unitPrice: 20000,
              subTasks: []
            }
          ]
        },
        {
          id: 'TSK-003',
          title: 'Backend Development',
          status: 'Pending',
          lastUpdated: '2024-01-15',
          value: 40000,
          quantity: 1,
          unitPrice: 40000,
          subTasks: []
        }
      ]
    },
    {
      id: 'PRJ-002',
      title: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-12-31'),
      value: 200000,
      tasks: [
        {
          id: 'TSK-004',
          title: 'iOS Development',
          status: 'In Progress',
          lastUpdated: '2024-04-01',
          value: 100000,
          quantity: 1,
          unitPrice: 100000,
          subTasks: []
        },
        {
          id: 'TSK-005',
          title: 'Android Development',
          status: 'Pending',
          lastUpdated: '2024-03-01',
          value: 100000,
          quantity: 1,
          unitPrice: 100000,
          subTasks: []
        }
      ]
    }
  ];

  private projectsSubject = new BehaviorSubject<Project[]>(this.projects);

  getAll(): Observable<Project[]> {
    return this.projectsSubject.asObservable();
  }

  findById(id: string): Observable<Project | null> {
    const project = this.projects.find(p => p.id === id) || null;
    return new BehaviorSubject(project).asObservable();
  }

  async create(projectData: Omit<Project, 'id' | 'tasks'>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newProject: Project = {
      ...projectData,
      id: `PRJ-${String(this.projects.length + 1).padStart(3, '0')}`,
      tasks: []
    };

    this.projects.push(newProject);
    this.projectsSubject.next([...this.projects]);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Project with id ${id} not found`);
    }

    this.projects[index] = { ...this.projects[index], ...updates };
    this.projectsSubject.next([...this.projects]);
    return this.projects[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.projectsSubject.next([...this.projects]);
    }
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const updateTaskRecursively = (tasks: Task[]): boolean => {
      for (const task of tasks) {
        if (task.id === taskId) {
          task.status = status;
          task.lastUpdated = new Date().toISOString();
          return true;
        }
        if (updateTaskRecursively(task.subTasks)) {
          return true;
        }
      }
      return false;
    };

    if (!updateTaskRecursively(project.tasks)) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    this.projectsSubject.next([...this.projects]);
  }

  async addTask(
    projectId: string,
    parentTaskId: string | null,
    taskData: Omit<Task, 'id' | 'subTasks'>
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const project = this.projects.find(p => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id ${projectId} not found`);
    }

    const newTask: Task = {
      ...taskData,
      id: `TSK-${Date.now()}`,
      subTasks: []
    };

    if (parentTaskId) {
      const addToParentTask = (tasks: Task[]): boolean => {
        for (const task of tasks) {
          if (task.id === parentTaskId) {
            task.subTasks.push(newTask);
            return true;
          }
          if (addToParentTask(task.subTasks)) {
            return true;
          }
        }
        return false;
      };

      if (!addToParentTask(project.tasks)) {
        throw new Error(`Parent task with id ${parentTaskId} not found`);
      }
    } else {
      project.tasks.push(newTask);
    }

    this.projectsSubject.next([...this.projects]);
  }
}
