// src/app/domain/daily-log/domain/value-objects/daily-log-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class DailyLogId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): DailyLogId {
        return new DailyLogId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 