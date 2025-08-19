import { Injectable } from '@angular/core';
import { ProjectRepository } from '@domain/repositories/project.repository';
import { Project, Task, TaskStatus } from '@shared/types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
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
    await new Promise(resolve => setTimeout(resolve, 50));
    const newProject: Project = { ...projectData, id: `PRJ-${String(this.projects.length + 1).padStart(3, '0')}`, tasks: [] };
    this.projects.push(newProject);
    this.projectsSubject.next([...this.projects]);
    return newProject;
  }

  async update(id: string, updates: Partial<Project>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Project with id ${id} not found`);
    this.projects[index] = { ...this.projects[index], ...updates };
    this.projectsSubject.next([...this.projects]);
    return this.projects[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects.splice(index, 1);
      this.projectsSubject.next([...this.projects]);
    }
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const project = this.projects.find(p => p.id === projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);
    const stack: Task[] = [...project.tasks];
    while (stack.length) {
      const task = stack.pop()!;
      if (task.id === taskId) {
        task.status = status;
        task.lastUpdated = new Date().toISOString();
        this.projectsSubject.next([...this.projects]);
        return;
      }
      stack.push(...task.subTasks);
    }
    throw new Error(`Task with id ${taskId} not found`);
  }

  async addTask(projectId: string, parentTaskId: string | null, taskData: Omit<Task, 'id' | 'subTasks'>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const project = this.projects.find(p => p.id === projectId);
    if (!project) throw new Error(`Project with id ${projectId} not found`);
    const newTask: Task = { ...taskData, id: `TSK-${Date.now()}`, subTasks: [] };
    if (!parentTaskId) {
      project.tasks.push(newTask);
    } else {
      const stack: Task[] = [...project.tasks];
      while (stack.length) {
        const task = stack.pop()!;
        if (task.id === parentTaskId) {
          task.subTasks.push(newTask);
          this.projectsSubject.next([...this.projects]);
          return;
        }
        stack.push(...task.subTasks);
      }
      throw new Error(`Parent task with id ${parentTaskId} not found`);
    }
    this.projectsSubject.next([...this.projects]);
  }
}


