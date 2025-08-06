// src/app/domain/contract-extraction/domain/value-objects/task-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class TaskId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): TaskId {
        return new TaskId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 