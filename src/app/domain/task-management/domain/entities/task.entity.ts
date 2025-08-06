// src/app/domain/task-management/domain/entities/task.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { TaskId } from '../value-objects/task-id.vo';
import { TaskStatus } from '../value-objects/task-status.vo';

export class Task extends BaseEntity<TaskId> {
    title: string;
    description: string;
    status: TaskStatus;

    constructor(id: TaskId, title: string, description: string) {
        super(id);
        this.title = title;
        this.description = description;
        this.status = TaskStatus.create('OPEN');
    }
} 