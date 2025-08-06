// src/app/domain/budget-management/domain/value-objects/budget-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export type BudgetStatusValue = 'PROPOSED' | 'APPROVED' | 'REJECTED';

export class BudgetStatus extends ValueObject<{ value: BudgetStatusValue }> {
    private constructor(props: { value: BudgetStatusValue }) {
        super(props);
    }

    public static create(value: BudgetStatusValue): BudgetStatus {
        return new BudgetStatus({ value });
    }

    get value(): BudgetStatusValue {
        return this.props.value;
    }
} 