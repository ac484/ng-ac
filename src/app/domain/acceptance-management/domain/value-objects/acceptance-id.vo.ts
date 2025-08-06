// src/app/domain/acceptance-management/domain/value-objects/acceptance-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class AcceptanceId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): AcceptanceId {
        return new AcceptanceId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 