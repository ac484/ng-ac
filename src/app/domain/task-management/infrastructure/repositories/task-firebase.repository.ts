// src/app/domain/task-management/infrastructure/repositories/task-firebase.repository.ts
import { Injectable } from '@angular/core';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { Task } from '../../domain/entities/task.entity';
import { TaskId } from '../../domain/value-objects/task-id.vo';

@Injectable({ providedIn: 'root' })
export class TaskFirebaseRepository extends TaskRepository {
    findById(id: TaskId): Promise<Task | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Task[]> {
        throw new Error('Method not implemented.');
    }
    save(task: Task): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: TaskId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 