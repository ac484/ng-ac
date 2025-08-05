import { Injectable, Inject } from '@angular/core';

import { BaseApplicationService, Repository } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import { OptimizedAccount, AccountData, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { BaseCreateDto, BaseUpdateDto, BaseResponseDto, SearchCriteriaDto } from '../dto/base.dto';

/**
 * 帳戶相關的 DTO 定義
 */
export interface CreateAccountDto extends BaseCreateDto {
    userId: string;
    name: string;
    accountNumber: string;
    accountType: AccountType;
    currency: string;
    initialBalance?: number;
}

export interface UpdateAccountDto extends BaseUpdateDto {
    name?: string;
    accountStatus?: AccountStatus;
}

export interface AccountResponseDto extends BaseResponseDto {
    userId: string;
    name: string;
    accountNumber: string;
    accountType: AccountType;
    accountStatus: AccountStatus;
    currency: string;
    balance: number;
    formattedBalance: string;
    createdAt: string;
    updatedAt: string;
}

export interface DepositDto {
    accountId: string;
    amount: number;
    description?: string;
}

export interface WithdrawDto {
    accountId: string;
    amount: number;
    description?: string;
}

export interface TransferDto {
    sourceAccountId: string;
    targetAccountId: string;
    amount: number;
    description?: string;
}

/**
 * 優化的帳戶應用服務
 * 使用統一的基礎應用服務，展示最佳實踐
 */
@Injectable({
    providedIn: 'root'
})
export class OptimizedAccountApplicationService extends BaseApplicationService<OptimizedAccount, CreateAccountDto, UpdateAccountDto, AccountResponseDto> {
    constructor(@Inject(ACCOUNT_REPOSITORY) repository: Repository<OptimizedAccount>, errorHandler: ErrorHandlerService) {
        super(repository, errorHandler, 'OptimizedAccountApplicationService');
    }

    // 實作抽象方法

    /**
     * 創建帳戶實體
     */
    protected async createEntity(dto: CreateAccountDto): Promise<OptimizedAccount> {
        this.logger.info('創建帳戶實體', { accountNumber: dto.accountNumber });

        // 檢查帳戶號碼是否已存在
        const existingAccounts = await this.repository.findAll();
        const accountNumberExists = existingAccounts.some(account => account.accountNumber === dto.accountNumber);

        if (accountNumberExists) {
            throw new Error('帳戶號碼已被使用');
        }

        // 創建新帳戶
        const accountData: AccountData = {
            id: this.generateId(),
            userId: dto.userId,
            name: dto.name,
            accountNumber: dto.accountNumber,
            type: dto.accountType,
            status: AccountStatus.ACTIVE,
            currency: dto.currency,
            balance: dto.initialBalance || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return new OptimizedAccount(accountData);
    }

    /**
     * 更新帳戶實體
     */
    protected async updateEntity(entity: OptimizedAccount, dto: UpdateAccountDto): Promise<void> {
        this.logger.info('更新帳戶實體', { id: entity.id, dto });

        if (dto.name !== undefined) {
            entity.updateInfo(dto.name, entity.description);
        }

        if (dto.accountStatus !== undefined) {
            entity.updateStatus(dto.accountStatus);
        }
    }

    /**
     * 將實體轉換為回應 DTO
     */
    protected mapToResponseDto(entity: OptimizedAccount): AccountResponseDto {
        const summary = entity.getSummary();
        return {
            id: entity.id,
            userId: entity.userId,
            name: entity.name,
            accountNumber: entity.accountNumber,
            accountType: summary.type,
            accountStatus: summary.status,
            currency: summary.currency,
            balance: summary.balance,
            formattedBalance: summary.formattedBalance,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString()
        };
    }

    /**
     * 驗證創建 DTO
     */
    protected override validateCreateDto(dto: CreateAccountDto): void {
        if (!dto.userId || dto.userId.trim() === '') {
            throw new Error('用戶 ID 不能為空');
        }

        if (!dto.name || dto.name.trim() === '') {
            throw new Error('帳戶名稱不能為空');
        }

        if (!dto.accountNumber || dto.accountNumber.trim() === '') {
            throw new Error('帳戶號碼不能為空');
        }

        if (!dto.currency || dto.currency.trim() === '') {
            throw new Error('貨幣不能為空');
        }

        if (dto.initialBalance !== undefined && dto.initialBalance < 0) {
            throw new Error('初始餘額不能為負數');
        }
    }

    /**
     * 驗證更新 DTO
     */
    protected override validateUpdateDto(dto: UpdateAccountDto): void {
        if (dto.name !== undefined && dto.name.trim() === '') {
            throw new Error('帳戶名稱不能為空');
        }
    }

    /**
     * 根據關鍵字過濾
     */
    protected override async filterByKeyword(entities: OptimizedAccount[], keyword: string): Promise<OptimizedAccount[]> {
        const lowerKeyword = keyword.toLowerCase();
        return entities.filter(account =>
            account.name.toLowerCase().includes(lowerKeyword) ||
            account.accountNumber.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 根據狀態過濾
     */
    protected override async filterByStatus(entities: OptimizedAccount[], status: string): Promise<OptimizedAccount[]> {
        return entities.filter(account => account.accountStatus === status);
    }

    /**
     * 根據用戶 ID 獲取帳戶
     */
    async getAccountsByUserId(userId: string): Promise<AccountResponseDto[]> {
        this.logger.info('根據用戶 ID 獲取帳戶', { userId });

        const accounts = await this.repository.findAll();
        const userAccounts = accounts.filter(account => account.userId === userId);

        return userAccounts.map(account => this.mapToResponseDto(account));
    }

    /**
     * 根據帳戶號碼獲取帳戶
     */
    async getAccountByNumber(accountNumber: string): Promise<AccountResponseDto | null> {
        this.logger.info('根據帳戶號碼獲取帳戶', { accountNumber });

        const accounts = await this.repository.findAll();
        const account = accounts.find(acc => acc.accountNumber === accountNumber);

        return account ? this.mapToResponseDto(account) : null;
    }

    /**
     * 存款操作
     */
    async deposit(dto: DepositDto): Promise<AccountResponseDto> {
        this.logger.info('執行存款操作', dto);

        const account = await this.repository.findById(dto.accountId);
        if (!account) {
            throw new Error('帳戶不存在');
        }

        if (dto.amount <= 0) {
            throw new Error('存款金額必須大於零');
        }

        account.deposit(dto.amount, dto.description);
        await this.repository.save(account);

        return this.mapToResponseDto(account);
    }

    /**
     * 提款操作
     */
    async withdraw(dto: WithdrawDto): Promise<AccountResponseDto> {
        this.logger.info('執行提款操作', dto);

        const account = await this.repository.findById(dto.accountId);
        if (!account) {
            throw new Error('帳戶不存在');
        }

        if (dto.amount <= 0) {
            throw new Error('提款金額必須大於零');
        }

        if (account.balance < dto.amount) {
            throw new Error('餘額不足');
        }

        account.withdraw(dto.amount, dto.description);
        await this.repository.save(account);

        return this.mapToResponseDto(account);
    }

    /**
     * 轉帳操作
     */
    async transfer(dto: TransferDto): Promise<{ source: AccountResponseDto; target: AccountResponseDto }> {
        this.logger.info('執行轉帳操作', dto);

        const sourceAccount = await this.repository.findById(dto.sourceAccountId);
        const targetAccount = await this.repository.findById(dto.targetAccountId);

        if (!sourceAccount) {
            throw new Error('來源帳戶不存在');
        }

        if (!targetAccount) {
            throw new Error('目標帳戶不存在');
        }

        if (dto.amount <= 0) {
            throw new Error('轉帳金額必須大於零');
        }

        if (sourceAccount.balance < dto.amount) {
            throw new Error('來源帳戶餘額不足');
        }

        if (sourceAccount.currency !== targetAccount.currency) {
            throw new Error('不同貨幣間無法轉帳');
        }

        // 執行轉帳
        sourceAccount.withdraw(dto.amount, `轉帳至 ${targetAccount.accountNumber}: ${dto.description || ''}`);
        targetAccount.deposit(dto.amount, `來自 ${sourceAccount.accountNumber}: ${dto.description || ''}`);

        await this.repository.save(sourceAccount);
        await this.repository.save(targetAccount);

        return {
            source: this.mapToResponseDto(sourceAccount),
            target: this.mapToResponseDto(targetAccount)
        };
    }

    /**
     * 獲取帳戶統計
     */
    async getAccountStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        suspended: number;
        closed: number;
        totalBalance: number;
        averageBalance: number;
    }> {
        this.logger.info('獲取帳戶統計');

        const accounts = await this.repository.findAll();

        const stats = {
            total: accounts.length,
            active: accounts.filter(acc => acc.accountStatus === AccountStatus.ACTIVE).length,
            inactive: accounts.filter(acc => acc.accountStatus === AccountStatus.INACTIVE).length,
            suspended: accounts.filter(acc => acc.accountStatus === AccountStatus.SUSPENDED).length,
            closed: accounts.filter(acc => acc.accountStatus === AccountStatus.CLOSED).length,
            totalBalance: accounts.reduce((sum, acc) => sum + acc.balance, 0),
            averageBalance: accounts.length > 0 ? accounts.reduce((sum, acc) => sum + acc.balance, 0) / accounts.length : 0
        };

        this.logger.info('帳戶統計', stats);
        return stats;
    }

    private generateId(): string {
        return `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
} 