// src/app/domain/task-management/domain/repositories/task.repository.ts
import { Task } from '../entities/task.entity';
import { TaskId } from '../value-objects/task-id.vo';

export abstract class TaskRepository {
    abstract findById(id: TaskId): Promise<Task | null>;
    abstract findAll(): Promise<Task[]>;
    abstract save(task: Task): Promise<void>;
    abstract delete(id: TaskId): Promise<void>;
} 