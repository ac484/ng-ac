// src/app/domain/invoice-management/domain/value-objects/invoice-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type InvoiceStatusValue = 'DRAFT' | 'SENT' | 'PAID';

export class InvoiceStatus extends ValueObject<{ value: InvoiceStatusValue }> {
    private constructor(props: { value: InvoiceStatusValue }) {
        super(props);
    }

    public static create(value: InvoiceStatusValue): InvoiceStatus {
        return new InvoiceStatus({ value });
    }

    get value(): InvoiceStatusValue {
        return this.props.value;
    }
} 