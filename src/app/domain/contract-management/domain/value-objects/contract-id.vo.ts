// src/app/domain/contract-management/domain/value-objects/contract-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class ContractId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): ContractId {
        return new ContractId({ value });
    }

    get value(): string {
        return this.props.value;
    }
}
