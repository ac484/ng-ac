// src/app/domain/contract-management/domain/value-objects/contract-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type ContractStatusValue = 'DRAFT' | 'ACTIVE' | 'EXPIRED';

export class ContractStatus extends ValueObject<{ value: ContractStatusValue }> {
    private constructor(props: { value: ContractStatusValue }) {
        super(props);
    }

    public static create(value: ContractStatusValue): ContractStatus {
        return new ContractStatus({ value });
    }

    get value(): ContractStatusValue {
        return this.props.value;
    }
}
