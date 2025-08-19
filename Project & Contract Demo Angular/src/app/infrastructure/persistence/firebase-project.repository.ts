/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "Firebase專案倉儲-專案數據持久化實現",
 *   "constraints": ["實現領域接口", "技術細節封裝", "錯誤處理"],
 *   "dependencies": ["Firestore", "ProjectRepository", "Project"],
 *   "security": "high",
 *   "lastmod": "2025-08-19"
 * }
 * @usage projectRepo.save(project), projectRepo.findByEmail(email)
 * @see docs/architecture/infrastructure.md
 */
import { Injectable } from '@angular/core';
import {
    Firestore,
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    docData,
    updateDoc
} from '@angular/fire/firestore';
import { ProjectRepository } from '@app/domain/repositories/project.repository';
import { Project, Task, TaskStatus } from '@shared/types';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseProjectRepository extends ProjectRepository {
  private readonly collectionName = 'projects';

  constructor(private firestore: Firestore) {
    super();
  }

  getAll(): Observable<Project[]> {
    const projectsRef = collection(this.firestore, this.collectionName);
    return collectionData(projectsRef, { idField: 'id' }).pipe(
      map(projects => projects.map(project => this.processFirestoreProject(project as any)))
    );
  }

  findById(id: string): Observable<Project | null> {
    const projectRef = doc(this.firestore, this.collectionName, id);
    return docData(projectRef, { idField: 'id' }).pipe(
      map(project => project ? this.processFirestoreProject(project as any) : null)
    );
  }

  async create(projectData: Omit<Project, 'id' | 'tasks'>): Promise<Observable<Project>> {
    const projectsRef = collection(this.firestore, this.collectionName);
    const docRef = await addDoc(projectsRef, {
      ...projectData,
      tasks: [],
      startDate: projectData.startDate,
      endDate: projectData.endDate
    });

    return docData(docRef, { idField: 'id' }).pipe(
      map(project => this.processFirestoreProject(project as any))
    );
  }

  async update(id: string, updates: Partial<Project>): Promise<Observable<Project>> {
    const projectRef = doc(this.firestore, this.collectionName, id);
    await updateDoc(projectRef, updates);

    return docData(projectRef, { idField: 'id' }).pipe(
      map(project => this.processFirestoreProject(project as any))
    );
  }

  async delete(id: string): Promise<Observable<void>> {
    const projectRef = doc(this.firestore, this.collectionName, id);
    await deleteDoc(projectRef);
    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  async updateTaskStatus(projectId: string, taskId: string, status: TaskStatus): Promise<Observable<void>> {
    const projectRef = doc(this.firestore, this.collectionName, projectId);
    const project = await docData(projectRef).pipe(map(p => p as any)).toPromise();

    if (project) {
      const updatedTasks = this.updateTaskInArray(project.tasks, taskId, { status, lastUpdated: new Date().toISOString() });
      await updateDoc(projectRef, { tasks: updatedTasks });
    }

    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  async addTask(projectId: string, parentTaskId: string | null, taskData: Omit<Task, 'id' | 'subTasks'>): Promise<Observable<void>> {
    const projectRef = doc(this.firestore, this.collectionName, projectId);
    const project = await docData(projectRef).pipe(map(p => p as any)).toPromise();

    if (project) {
      const newTask: Task = {
        ...taskData,
        id: this.generateId(),
        subTasks: []
      };

      let updatedTasks;
      if (parentTaskId) {
        updatedTasks = this.addTaskToParent(project.tasks, parentTaskId, newTask);
      } else {
        updatedTasks = [...project.tasks, newTask];
      }

      await updateDoc(projectRef, { tasks: updatedTasks });
    }

    return new Observable(observer => {
      observer.next();
      observer.complete();
    });
  }

  private processFirestoreProject(data: any): Project {
    return {
      ...data,
      startDate: data.startDate?.toDate() || new Date(),
      endDate: data.endDate?.toDate() || new Date(),
      tasks: data.tasks ? this.processFirestoreTasks(data.tasks) : []
    };
  }

  private processFirestoreTasks(tasks: any[]): Task[] {
    return tasks.map(task => ({
      ...task,
      subTasks: task.subTasks ? this.processFirestoreTasks(task.subTasks) : []
    }));
  }

  private updateTaskInArray(tasks: Task[], taskId: string, updates: Partial<Task>): Task[] {
    return tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, ...updates };
      }
      if (task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: this.updateTaskInArray(task.subTasks, taskId, updates)
        };
      }
      return task;
    });
  }

  private addTaskToParent(tasks: Task[], parentId: string, newTask: Task): Task[] {
    return tasks.map(task => {
      if (task.id === parentId) {
        return {
          ...task,
          subTasks: [...task.subTasks, newTask]
        };
      }
      if (task.subTasks.length > 0) {
        return {
          ...task,
          subTasks: this.addTaskToParent(task.subTasks, parentId, newTask)
        };
      }
      return task;
    });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
