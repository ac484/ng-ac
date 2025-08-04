/**
 * 優化的帳戶實體
 * 使用新的基礎類別，保留 Money 值物件，簡化狀態管理
 */

import { OptimizedAggregateRoot, BaseEntityData, generateId, createEntityData } from './optimized-base-entity';
import { Money } from '../value-objects/account/money.value-object';

/**
 * 帳戶類型枚舉
 */
export enum AccountType {
    CHECKING = 'checking',
    SAVINGS = 'savings',
    CREDIT = 'credit'
}

/**
 * 帳戶狀態枚舉
 */
export enum AccountStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    SUSPENDED = 'suspended',
    CLOSED = 'closed'
}

/**
 * 帳戶實體資料介面
 */
export interface AccountData extends BaseEntityData {
    userId: string;
    accountNumber: string;
    name: string;
    type: AccountType;
    balance: number;
    currency: string;
    status: AccountStatus;
    description?: string;
    lastTransactionDate?: Date;
}

/**
 * 優化的帳戶實體
 * 簡化設計，直接屬性存取，保留 Money 值物件用於複雜業務邏輯
 */
export class OptimizedAccount extends OptimizedAggregateRoot {
    userId: string;
    accountNumber: string;
    name: string;
    type: AccountType;
    private _balance: Money; // 保留 Money 值物件用於複雜業務邏輯
    status: AccountStatus;
    description?: string;
    lastTransactionDate?: Date;

    constructor(data: AccountData) {
        super(data);
        this.userId = data.userId;
        this.accountNumber = data.accountNumber;
        this.name = data.name;
        this.type = data.type;
        this._balance = new Money(data.balance, data.currency);
        this.status = data.status;
        this.description = data.description;
        this.lastTransactionDate = data.lastTransactionDate;
    }

    /**
     * 創建新帳戶
     */
    static create(params: {
        userId: string;
        accountNumber: string;
        name: string;
        type: AccountType;
        initialBalance?: number;
        currency?: string;
        description?: string;
    }): OptimizedAccount {
        const entityData = createEntityData();

        const accountData: AccountData = {
            ...entityData,
            userId: params.userId,
            accountNumber: params.accountNumber,
            name: params.name,
            type: params.type,
            balance: params.initialBalance || 0,
            currency: params.currency || 'USD',
            status: AccountStatus.ACTIVE,
            description: params.description
        };

        const account = new OptimizedAccount(accountData);

        // 添加領域事件
        account.addDomainEvent({
            type: 'AccountCreated',
            accountId: account.id,
            userId: account.userId,
            initialBalance: params.initialBalance || 0,
            timestamp: new Date()
        });

        return account;
    }

    /**
     * 創建帳戶並生成帳戶號碼
     */
    static createWithGeneratedNumber(params: {
        userId: string;
        name: string;
        type: AccountType;
        initialBalance?: number;
        currency?: string;
        description?: string;
    }): OptimizedAccount {
        const accountNumber = this.generateAccountNumber();

        return this.create({
            ...params,
            accountNumber
        });
    }

    /**
     * 生成帳戶號碼
     */
    private static generateAccountNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8);
        return `ACC-${timestamp.slice(-6)}-${random.toUpperCase()}`;
    }

    /**
     * 獲取餘額（Money 值物件）
     */
    getBalance(): Money {
        return this._balance;
    }

    /**
     * 獲取餘額數值
     */
    getBalanceAmount(): number {
        return this._balance.getAmount();
    }

    /**
     * 獲取貨幣代碼
     */
    getCurrency(): string {
        return this._balance.getCurrency();
    }

    /**
     * 存款
     */
    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error('存款金額必須大於零');
        }

        if (!this.canReceiveDeposits()) {
            throw new Error('帳戶狀態不允許存款');
        }

        const depositMoney = new Money(amount, this._balance.getCurrency());
        const oldBalance = this._balance.getAmount();

        this._balance = this._balance.add(depositMoney);
        this.lastTransactionDate = new Date();
        this.touch();

        // 添加領域事件
        this.addDomainEvent({
            type: 'AccountBalanceChanged',
            accountId: this.id,
            oldBalance,
            newBalance: this._balance.getAmount(),
            changeAmount: amount,
            transactionType: 'deposit',
            timestamp: new Date()
        });
    }

    /**
     * 提款
     */
    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error('提款金額必須大於零');
        }

        if (!this.canMakeWithdrawals()) {
            throw new Error('帳戶狀態不允許提款');
        }

        if (!this.hasSufficientFunds(amount)) {
            throw new Error('餘額不足');
        }

        const withdrawMoney = new Money(amount, this._balance.getCurrency());
        const oldBalance = this._balance.getAmount();

        this._balance = this._balance.subtract(withdrawMoney);
        this.lastTransactionDate = new Date();
        this.touch();

        // 添加領域事件
        this.addDomainEvent({
            type: 'AccountBalanceChanged',
            accountId: this.id,
            oldBalance,
            newBalance: this._balance.getAmount(),
            changeAmount: -amount,
            transactionType: 'withdrawal',
            timestamp: new Date()
        });
    }

    /**
     * 轉帳到另一個帳戶
     */
    transferTo(targetAccount: OptimizedAccount, amount: number): void {
        if (this._balance.getCurrency() !== targetAccount._balance.getCurrency()) {
            throw new Error('不同貨幣的帳戶無法直接轉帳');
        }

        this.withdraw(amount);
        targetAccount.deposit(amount);

        // 添加轉帳事件
        this.addDomainEvent({
            type: 'MoneyTransferred',
            fromAccountId: this.id,
            toAccountId: targetAccount.id,
            amount,
            currency: this._balance.getCurrency(),
            timestamp: new Date()
        });
    }

    /**
     * 更新帳戶資訊
     */
    updateInfo(name: string, description?: string): void {
        if (!name || name.trim() === '') {
            throw new Error('帳戶名稱不能為空');
        }

        this.name = name.trim();
        if (description !== undefined) {
            this.description = description.trim() || undefined;
        }
        this.touch();

        // 添加領域事件
        this.addDomainEvent({
            type: 'AccountUpdated',
            accountId: this.id,
            userId: this.userId,
            timestamp: new Date()
        });
    }

    /**
     * 更新帳戶狀態
     */
    updateStatus(status: AccountStatus): void {
        const oldStatus = this.status;
        this.status = status;
        this.touch();

        // 添加狀態變更事件
        this.addDomainEvent({
            type: 'AccountStatusChanged',
            accountId: this.id,
            oldStatus,
            newStatus: status,
            timestamp: new Date()
        });
    }

    /**
     * 啟用帳戶
     */
    activate(): void {
        this.updateStatus(AccountStatus.ACTIVE);
    }

    /**
     * 停用帳戶
     */
    deactivate(): void {
        this.updateStatus(AccountStatus.INACTIVE);
    }

    /**
     * 暫停帳戶
     */
    suspend(): void {
        this.updateStatus(AccountStatus.SUSPENDED);
    }

    /**
     * 關閉帳戶
     */
    close(): void {
        if (this._balance.getAmount() > 0) {
            throw new Error('帳戶餘額不為零，無法關閉');
        }

        this.updateStatus(AccountStatus.CLOSED);

        // 添加帳戶關閉事件
        this.addDomainEvent({
            type: 'AccountClosed',
            accountId: this.id,
            userId: this.userId,
            finalBalance: this._balance.getAmount(),
            timestamp: new Date()
        });
    }

    /**
     * 檢查帳戶是否啟用
     */
    isActive(): boolean {
        return this.status === AccountStatus.ACTIVE;
    }

    /**
     * 檢查帳戶是否可以執行交易
     */
    canPerformTransactions(): boolean {
        return this.status === AccountStatus.ACTIVE;
    }

    /**
     * 檢查帳戶是否可以接受存款
     */
    canReceiveDeposits(): boolean {
        return this.status === AccountStatus.ACTIVE || this.status === AccountStatus.INACTIVE;
    }

    /**
     * 檢查帳戶是否可以提款
     */
    canMakeWithdrawals(): boolean {
        return this.status === AccountStatus.ACTIVE;
    }

    /**
     * 檢查是否有足夠資金
     */
    hasSufficientFunds(amount: number): boolean {
        return this._balance.getAmount() >= amount;
    }

    /**
     * 獲取帳戶摘要
     */
    getSummary(): {
        id: string;
        accountNumber: string;
        name: string;
        type: AccountType;
        balance: number;
        formattedBalance: string;
        currency: string;
        status: AccountStatus;
        isActive: boolean;
        canPerformTransactions: boolean;
        lastTransactionDate?: Date;
    } {
        return {
            id: this.id,
            accountNumber: this.accountNumber,
            name: this.name,
            type: this.type,
            balance: this._balance.getAmount(),
            formattedBalance: this._balance.toDisplayString(),
            currency: this._balance.getCurrency(),
            status: this.status,
            isActive: this.isActive(),
            canPerformTransactions: this.canPerformTransactions(),
            lastTransactionDate: this.lastTransactionDate
        };
    }

    /**
     * 驗證帳戶資料
     */
    validate(): { isValid: boolean; errors: string[] } {
        const errors = this.validateBase();

        // 驗證用戶 ID
        if (!this.userId || this.userId.trim() === '') {
            errors.push('用戶 ID 不能為空');
        }

        // 驗證帳戶號碼
        if (!this.accountNumber || this.accountNumber.trim() === '') {
            errors.push('帳戶號碼不能為空');
        }

        // 驗證帳戶名稱
        if (!this.name || this.name.trim() === '') {
            errors.push('帳戶名稱不能為空');
        }

        // 驗證帳戶類型
        if (!Object.values(AccountType).includes(this.type)) {
            errors.push('無效的帳戶類型');
        }

        // 驗證帳戶狀態
        if (!Object.values(AccountStatus).includes(this.status)) {
            errors.push('無效的帳戶狀態');
        }

        // 驗證餘額
        if (this._balance.getAmount() < 0) {
            errors.push('帳戶餘額不能為負數');
        }

        // 驗證業務規則
        if (this.status === AccountStatus.CLOSED && this._balance.getAmount() > 0) {
            errors.push('已關閉的帳戶餘額應為零');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 轉換為 JSON 物件
     */
    override toJSON(): any {
        return {
            ...super.toJSON(),
            userId: this.userId,
            accountNumber: this.accountNumber,
            name: this.name,
            type: this.type,
            balance: this._balance.getAmount(),
            currency: this._balance.getCurrency(),
            status: this.status,
            description: this.description,
            lastTransactionDate: this.lastTransactionDate?.toISOString()
        };
    }

    /**
     * 轉換為顯示用物件
     */
    toDisplayObject(): any {
        return {
            id: this.id,
            accountNumber: this.accountNumber,
            name: this.name,
            type: this.type,
            balance: this._balance.getAmount(),
            formattedBalance: this._balance.toDisplayString(),
            currency: this._balance.getCurrency(),
            status: this.status,
            statusText: this.getStatusText(),
            isActive: this.isActive(),
            canPerformTransactions: this.canPerformTransactions(),
            description: this.description,
            lastTransactionDate: this.lastTransactionDate,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * 獲取狀態文字
     */
    private getStatusText(): string {
        switch (this.status) {
            case AccountStatus.ACTIVE:
                return '啟用';
            case AccountStatus.INACTIVE:
                return '停用';
            case AccountStatus.SUSPENDED:
                return '暫停';
            case AccountStatus.CLOSED:
                return '已關閉';
            default:
                return '未知';
        }
    }
}