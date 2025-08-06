// src/app/domain/invoice-management/domain/value-objects/invoice-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class InvoiceId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): InvoiceId {
        return new InvoiceId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 