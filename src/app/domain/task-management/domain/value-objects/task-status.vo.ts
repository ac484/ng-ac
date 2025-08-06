// src/app/domain/task-management/domain/value-objects/task-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type TaskStatusValue = 'OPEN' | 'IN_PROGRESS' | 'DONE';

export class TaskStatus extends ValueObject<{ value: TaskStatusValue }> {
    private constructor(props: { value: TaskStatusValue }) {
        super(props);
    }

    public static create(value: TaskStatusValue): TaskStatus {
        return new TaskStatus({ value });
    }

    get value(): TaskStatusValue {
        return this.props.value;
    }
} 