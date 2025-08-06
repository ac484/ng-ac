// src/app/domain/budget-management/application/dto/budget.dto.ts
export interface CreateBudgetCommand {
    name: string;
    amount: number;
}

export interface UpdateBudgetCommand {
    id: string;
    name?: string;
    amount?: number;
    status?: string;
}

export interface BudgetDto {
    id: string;
    name: string;
    amount: number;
    status: string;
} 