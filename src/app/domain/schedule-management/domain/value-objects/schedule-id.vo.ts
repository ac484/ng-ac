// src/app/domain/schedule-management/domain/value-objects/schedule-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class ScheduleId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): ScheduleId {
        return new ScheduleId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 