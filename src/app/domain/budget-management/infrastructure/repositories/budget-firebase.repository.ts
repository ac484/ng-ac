// src/app/domain/budget-management/infrastructure/repositories/budget-firebase.repository.ts
import { Injectable } from '@angular/core';
import { BudgetRepository } from '../../domain/repositories/budget.repository';
import { Budget } from '../../domain/entities/budget.entity';
import { BudgetId } from '../../domain/value-objects/budget-id.vo';

@Injectable({ providedIn: 'root' })
export class BudgetFirebaseRepository extends BudgetRepository {
    findById(id: BudgetId): Promise<Budget | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Budget[]> {
        throw new Error('Method not implemented.');
    }
    save(budget: Budget): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: BudgetId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 