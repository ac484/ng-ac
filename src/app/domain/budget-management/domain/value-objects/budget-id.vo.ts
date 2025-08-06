// src/app/domain/budget-management/domain/value-objects/budget-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class BudgetId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): BudgetId {
        return new BudgetId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 