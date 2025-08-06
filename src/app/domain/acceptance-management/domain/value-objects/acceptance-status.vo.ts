// src/app/domain/acceptance-management/domain/value-objects/acceptance-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type AcceptanceStatusValue = 'PENDING' | 'PASSED' | 'FAILED';

export class AcceptanceStatus extends ValueObject<{ value: AcceptanceStatusValue }> {
    private constructor(props: { value: AcceptanceStatusValue }) {
        super(props);
    }

    public static create(value: AcceptanceStatusValue): AcceptanceStatus {
        return new AcceptanceStatus({ value });
    }

    get value(): AcceptanceStatusValue {
        return this.props.value;
    }
} 