// src/app/domain/budget-management/domain/entities/budget.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { BudgetId } from '../value-objects/budget-id.vo';
import { BudgetStatus } from '../value-objects/budget-status.vo';

export class Budget extends BaseEntity<BudgetId> {
    name: string;
    amount: number;
    status: BudgetStatus;

    constructor(id: BudgetId, name: string, amount: number) {
        super(id);
        this.name = name;
        this.amount = amount;
        this.status = BudgetStatus.create('PROPOSED');
    }
} 