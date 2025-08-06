// src/app/domain/contract-extraction/domain/value-objects/contract-term-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class ContractTermId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): ContractTermId {
        return new ContractTermId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 