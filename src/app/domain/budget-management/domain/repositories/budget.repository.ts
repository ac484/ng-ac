// src/app/domain/budget-management/domain/repositories/budget.repository.ts
import { Budget } from '../entities/budget.entity';
import { BudgetId } from '../value-objects/budget-id.vo';

export abstract class BudgetRepository {
    abstract findById(id: BudgetId): Promise<Budget | null>;
    abstract findAll(): Promise<Budget[]>;
    abstract save(budget: Budget): Promise<void>;
    abstract delete(id: BudgetId): Promise<void>;
} 