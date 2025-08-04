/**
 * 優化的交易實體
 * 使用新的基礎類別，保留 Money 值物件，簡化狀態轉換邏輯
 */

import { OptimizedAggregateRoot, BaseEntityData, generateId, createEntityData } from './optimized-base-entity';
import { Money } from '../value-objects/account/money.value-object';
import { TransactionCreatedEvent, TransactionProcessedEvent, TransactionFailedEvent, TransactionCancelledEvent } from '../events/transaction-events';

export enum TransactionType {
    DEPOSIT = 'DEPOSIT',
    WITHDRAWAL = 'WITHDRAWAL',
    TRANSFER = 'TRANSFER',
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    FEE = 'FEE'
}

export enum TransactionStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED'
}

/**
 * 交易實體資料介面
 */
export interface TransactionData extends BaseEntityData {
    transactionNumber: string;
    accountId: string;
    userId: string;
    amount: Money;
    transactionType: TransactionType;
    status: TransactionStatus;
    description: string;
    referenceNumber?: string;
    category?: string;
    fees?: Money;
    notes?: string;
}

/**
 * 優化的交易實體
 * 簡化設計，直接屬性存取，保留 Money 值物件用於金額計算
 */
export class OptimizedTransaction extends OptimizedAggregateRoot {
    transactionNumber: string;
    accountId: string;
    userId: string;
    amount: Money;
    transactionType: TransactionType;
    status: TransactionStatus;
    description: string;
    referenceNumber?: string;
    category?: string;
    fees?: Money;
    notes?: string;

    constructor(data: TransactionData) {
        super(data);
        this.transactionNumber = data.transactionNumber;
        this.accountId = data.accountId;
        this.userId = data.userId;
        this.amount = data.amount;
        this.transactionType = data.transactionType;
        this.status = data.status;
        this.description = data.description;
        this.referenceNumber = data.referenceNumber;
        this.category = data.category;
        this.fees = data.fees;
        this.notes = data.notes;
    }

    /**
     * 創建新交易
     */
    static create(
        transactionNumber: string,
        accountId: string,
        userId: string,
        amount: Money,
        transactionType: TransactionType,
        description: string,
        id?: string
    ): OptimizedTransaction {
        const entityData = createEntityData(id);

        const transaction = new OptimizedTransaction({
            ...entityData,
            transactionNumber,
            accountId,
            userId,
            amount,
            transactionType,
            status: TransactionStatus.PENDING,
            description
        });

        transaction.addDomainEvent(new TransactionCreatedEvent(
            transaction.id,
            accountId,
            amount.getAmount(),
            transactionType
        ));

        return transaction;
    }

    /**
     * 簡化的狀態轉換邏輯
     * 使用狀態機模式，明確定義允許的狀態轉換
     */
    private canTransitionTo(newStatus: TransactionStatus): boolean {
        const allowedTransitions: Record<TransactionStatus, TransactionStatus[]> = {
            [TransactionStatus.PENDING]: [
                TransactionStatus.PROCESSING,
                TransactionStatus.CANCELLED,
                TransactionStatus.FAILED
            ],
            [TransactionStatus.PROCESSING]: [
                TransactionStatus.COMPLETED,
                TransactionStatus.FAILED
            ],
            [TransactionStatus.COMPLETED]: [], // 完成的交易不能再轉換
            [TransactionStatus.FAILED]: [
                TransactionStatus.PENDING // 失敗的交易可以重試
            ],
            [TransactionStatus.CANCELLED]: [] // 取消的交易不能再轉換
        };

        return allowedTransitions[this.status].includes(newStatus);
    }

    /**
     * 處理交易
     */
    process(): void {
        if (!this.canTransitionTo(TransactionStatus.PROCESSING)) {
            throw new Error(`無法從 ${this.status} 狀態轉換到 PROCESSING 狀態`);
        }

        this.status = TransactionStatus.PROCESSING;
        this.touch();
    }

    /**
     * 完成交易
     */
    complete(): void {
        if (!this.canTransitionTo(TransactionStatus.COMPLETED)) {
            throw new Error(`無法從 ${this.status} 狀態轉換到 COMPLETED 狀態`);
        }

        this.status = TransactionStatus.COMPLETED;
        this.touch();

        this.addDomainEvent(new TransactionProcessedEvent(
            this.id,
            this.accountId,
            this.amount.getAmount(),
            this.getTotalAmount().getAmount()
        ));
    }

    /**
     * 交易失敗
     */
    fail(reason?: string): void {
        if (!this.canTransitionTo(TransactionStatus.FAILED)) {
            throw new Error(`無法從 ${this.status} 狀態轉換到 FAILED 狀態`);
        }

        this.status = TransactionStatus.FAILED;
        if (reason) {
            this.notes = this.notes ? `${this.notes} - 失敗原因: ${reason}` : `失敗原因: ${reason}`;
        }
        this.touch();

        this.addDomainEvent(new TransactionFailedEvent(
            this.id,
            this.accountId,
            this.amount.getAmount(),
            reason || '未知錯誤'
        ));
    }

    /**
     * 取消交易
     */
    cancel(reason?: string): void {
        if (!this.canTransitionTo(TransactionStatus.CANCELLED)) {
            throw new Error(`無法從 ${this.status} 狀態轉換到 CANCELLED 狀態`);
        }

        this.status = TransactionStatus.CANCELLED;
        if (reason) {
            this.notes = this.notes ? `${this.notes} - 取消原因: ${reason}` : `取消原因: ${reason}`;
        }
        this.touch();

        this.addDomainEvent(new TransactionCancelledEvent(
            this.id,
            this.accountId,
            reason || '用戶取消'
        ));
    }

    /**
     * 重試失敗的交易
     */
    retry(): void {
        if (this.status !== TransactionStatus.FAILED) {
            throw new Error('只有失敗的交易才能重試');
        }

        this.status = TransactionStatus.PENDING;
        this.notes = this.notes ? `${this.notes} - 重試於 ${new Date().toISOString()}` : `重試於 ${new Date().toISOString()}`;
        this.touch();
    }

    /**
     * 更新描述
     */
    updateDescription(description: string): void {
        if (this.status === TransactionStatus.COMPLETED) {
            throw new Error('已完成的交易不能修改');
        }

        this.description = description;
        this.touch();
    }

    /**
     * 更新分類
     */
    updateCategory(category: string): void {
        if (this.status === TransactionStatus.COMPLETED) {
            throw new Error('已完成的交易不能修改');
        }

        this.category = category;
        this.touch();
    }

    /**
     * 添加手續費
     */
    addFees(fees: Money): void {
        if (this.status === TransactionStatus.COMPLETED) {
            throw new Error('已完成的交易不能修改');
        }

        // 確保手續費與交易金額使用相同貨幣
        if (fees.getCurrency() !== this.amount.getCurrency()) {
            throw new Error('手續費貨幣必須與交易金額貨幣一致');
        }

        this.fees = this.fees ? this.fees.add(fees) : fees;
        this.touch();
    }

    /**
     * 獲取總金額（包含手續費）
     */
    getTotalAmount(): Money {
        return this.fees ? this.amount.add(this.fees) : this.amount;
    }

    /**
     * 檢查交易是否可以修改
     */
    canBeModified(): boolean {
        return this.status !== TransactionStatus.COMPLETED;
    }

    /**
     * 狀態檢查方法
     */
    isPending(): boolean {
        return this.status === TransactionStatus.PENDING;
    }

    isProcessing(): boolean {
        return this.status === TransactionStatus.PROCESSING;
    }

    isCompleted(): boolean {
        return this.status === TransactionStatus.COMPLETED;
    }

    isFailed(): boolean {
        return this.status === TransactionStatus.FAILED;
    }

    isCancelled(): boolean {
        return this.status === TransactionStatus.CANCELLED;
    }

    /**
     * 驗證交易資料
     */
    validate(): { isValid: boolean; errors: string[] } {
        const errors = this.validateBase();

        if (!this.transactionNumber || this.transactionNumber.trim() === '') {
            errors.push('交易編號不能為空');
        }

        if (!this.accountId || this.accountId.trim() === '') {
            errors.push('帳戶 ID 不能為空');
        }

        if (!this.userId || this.userId.trim() === '') {
            errors.push('用戶 ID 不能為空');
        }

        if (!this.amount || this.amount.getAmount() <= 0) {
            errors.push('交易金額必須大於零');
        }

        if (!this.description || this.description.trim() === '') {
            errors.push('交易描述不能為空');
        }

        if (this.description && this.description.length > 500) {
            errors.push('交易描述不能超過 500 個字元');
        }

        if (this.fees && this.fees.getAmount() < 0) {
            errors.push('手續費不能為負數');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 獲取交易摘要
     */
    getSummary(): {
        id: string;
        transactionNumber: string;
        amount: string;
        totalAmount: string;
        type: TransactionType;
        status: TransactionStatus;
        description: string;
    } {
        return {
            id: this.id,
            transactionNumber: this.transactionNumber,
            amount: this.amount.toDisplayString(),
            totalAmount: this.getTotalAmount().toDisplayString(),
            type: this.transactionType,
            status: this.status,
            description: this.description
        };
    }

    /**
     * 轉換為 JSON
     */
    override toJSON(): any {
        return {
            ...super.toJSON(),
            transactionNumber: this.transactionNumber,
            accountId: this.accountId,
            userId: this.userId,
            amount: {
                amount: this.amount.getAmount(),
                currency: this.amount.getCurrency()
            },
            transactionType: this.transactionType,
            status: this.status,
            description: this.description,
            referenceNumber: this.referenceNumber,
            category: this.category,
            fees: this.fees ? {
                amount: this.fees.getAmount(),
                currency: this.fees.getCurrency()
            } : undefined,
            notes: this.notes
        };
    }

    // 靜態工廠方法
    static createDeposit(
        transactionNumber: string,
        accountId: string,
        userId: string,
        amount: Money,
        description: string,
        id?: string
    ): OptimizedTransaction {
        return OptimizedTransaction.create(
            transactionNumber,
            accountId,
            userId,
            amount,
            TransactionType.DEPOSIT,
            description,
            id
        );
    }

    static createWithdrawal(
        transactionNumber: string,
        accountId: string,
        userId: string,
        amount: Money,
        description: string,
        id?: string
    ): OptimizedTransaction {
        return OptimizedTransaction.create(
            transactionNumber,
            accountId,
            userId,
            amount,
            TransactionType.WITHDRAWAL,
            description,
            id
        );
    }

    static createTransfer(
        transactionNumber: string,
        accountId: string,
        userId: string,
        amount: Money,
        description: string,
        id?: string
    ): OptimizedTransaction {
        return OptimizedTransaction.create(
            transactionNumber,
            accountId,
            userId,
            amount,
            TransactionType.TRANSFER,
            description,
            id
        );
    }
}