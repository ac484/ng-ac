// src/app/domain/schedule-management/domain/value-objects/schedule-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type ScheduleStatusValue = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';

export class ScheduleStatus extends ValueObject<{ value: ScheduleStatusValue }> {
    private constructor(props: { value: ScheduleStatusValue }) {
        super(props);
    }

    public static create(value: ScheduleStatusValue): ScheduleStatus {
        return new ScheduleStatus({ value });
    }

    get value(): ScheduleStatusValue {
        return this.props.value;
    }
} 