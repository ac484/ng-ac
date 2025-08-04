/**
 * 優化的帳戶應用服務
 * 使用新的基礎類別，整合 Money 值物件的業務邏輯，簡化餘額計算和驗證邏輯
 */

import { Injectable } from '@angular/core';
import { BaseApplicationService } from './base-application.service';
import { BaseCreateDto, BaseUpdateDto, BaseResponseDto } from '../dto/base.dto';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';

/**
 * 帳戶創建 DTO
 */
export interface CreateAccountDto extends BaseCreateDto {
    userId: string;
    accountNumber?: string; // 可選，如果不提供會自動生成
    name: string;
    type: AccountType;
    initialBalance?: number;
    currency?: string;
    description?: string;
}

/**
 * 帳戶更新 DTO
 */
export interface UpdateAccountDto extends BaseUpdateDto {
    name?: string;
    description?: string;
}

/**
 * 帳戶回應 DTO
 */
export interface AccountResponseDto extends BaseResponseDto {
    userId: string;
    accountNumber: string;
    name: string;
    type: AccountType;
    balance: number;
    formattedBalance: string;
    currency: string;
    status: AccountStatus;
    statusText: string;
    isActive: boolean;
    canPerformTransactions: boolean;
    description?: string;
    lastTransactionDate?: string;
}

/**
 * 存款 DTO
 */
export interface DepositDto {
    amount: number;
    description?: string;
}

/**
 * 提款 DTO
 */
export interface WithdrawDto {
    amount: number;
    description?: string;
}

/**
 * 轉帳 DTO
 */
export interface TransferDto {
    targetAccountId: string;
    amount: number;
    description?: string;
}

/**
 * 帳戶狀態更新 DTO
 */
export interface UpdateAccountStatusDto {
    status: AccountStatus;
}

/**
 * 優化的帳戶應用服務
 */
@Injectable({
    providedIn: 'root'
})
export class OptimizedAccountApplicationService {

    constructor() {
        // 暫時不繼承 BaseApplicationService，因為需要儲存庫整合
    }

    /**
     * 創建新帳戶
     */
    async createAccount(dto: CreateAccountDto): Promise<AccountResponseDto> {
        try {
            const account = dto.accountNumber
                ? OptimizedAccount.create({
                    userId: dto.userId,
                    accountNumber: dto.accountNumber,
                    name: dto.name,
                    type: dto.type,
                    initialBalance: dto.initialBalance,
                    currency: dto.currency,
                    description: dto.description
                })
                : OptimizedAccount.createWithGeneratedNumber({
                    userId: dto.userId,
                    name: dto.name,
                    type: dto.type,
                    initialBalance: dto.initialBalance,
                    currency: dto.currency,
                    description: dto.description
                });

            // 這裡應該保存到儲存庫
            // await this.repository.save(account);

            return this.toResponseDto(account);
        } catch (error) {
            throw this.handleError(error, '創建帳戶失敗');
        }
    }

    /**
     * 更新帳戶資訊
     */
    async updateAccount(id: string, dto: UpdateAccountDto): Promise<AccountResponseDto> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const account = await this.repository.findById(id);
            // if (!account) {
            //     throw new Error('帳戶不存在');
            // }

            // 模擬帳戶更新
            // account.updateInfo(dto.name || account.name, dto.description);
            // await this.repository.save(account);

            // 暫時返回模擬數據
            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '更新帳戶失敗');
        }
    }

    /**
     * 存款
     */
    async deposit(accountId: string, dto: DepositDto): Promise<AccountResponseDto> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const account = await this.repository.findById(accountId);
            // if (!account) {
            //     throw new Error('帳戶不存在');
            // }

            // account.deposit(dto.amount);
            // await this.repository.save(account);

            // return this.toResponseDto(account);

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '存款失敗');
        }
    }

    /**
     * 提款
     */
    async withdraw(accountId: string, dto: WithdrawDto): Promise<AccountResponseDto> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const account = await this.repository.findById(accountId);
            // if (!account) {
            //     throw new Error('帳戶不存在');
            // }

            // account.withdraw(dto.amount);
            // await this.repository.save(account);

            // return this.toResponseDto(account);

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '提款失敗');
        }
    }

    /**
     * 轉帳
     */
    async transfer(sourceAccountId: string, dto: TransferDto): Promise<{ source: AccountResponseDto; target: AccountResponseDto }> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const sourceAccount = await this.repository.findById(sourceAccountId);
            // const targetAccount = await this.repository.findById(dto.targetAccountId);

            // if (!sourceAccount || !targetAccount) {
            //     throw new Error('帳戶不存在');
            // }

            // sourceAccount.transferTo(targetAccount, dto.amount);

            // await this.repository.save(sourceAccount);
            // await this.repository.save(targetAccount);

            // return {
            //     source: this.toResponseDto(sourceAccount),
            //     target: this.toResponseDto(targetAccount)
            // };

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '轉帳失敗');
        }
    }

    /**
     * 更新帳戶狀態
     */
    async updateAccountStatus(accountId: string, dto: UpdateAccountStatusDto): Promise<AccountResponseDto> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const account = await this.repository.findById(accountId);
            // if (!account) {
            //     throw new Error('帳戶不存在');
            // }

            // account.updateStatus(dto.status);
            // await this.repository.save(account);

            // return this.toResponseDto(account);

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '更新帳戶狀態失敗');
        }
    }

    /**
     * 獲取帳戶詳情
     */
    async getAccountById(id: string): Promise<AccountResponseDto> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const account = await this.repository.findById(id);
            // if (!account) {
            //     throw new Error('帳戶不存在');
            // }

            // return this.toResponseDto(account);

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '獲取帳戶失敗');
        }
    }

    /**
     * 根據用戶ID獲取帳戶列表
     */
    async getAccountsByUserId(userId: string): Promise<AccountResponseDto[]> {
        try {
            // 這裡應該從儲存庫獲取帳戶
            // const accounts = await this.repository.findByUserId(userId);
            // return accounts.map(account => this.toResponseDto(account));

            throw new Error('Method not implemented - requires repository integration');
        } catch (error) {
            throw this.handleError(error, '獲取用戶帳戶列表失敗');
        }
    }

    /**
     * 將實體轉換為回應 DTO
     */
    private toResponseDto(account: OptimizedAccount): AccountResponseDto {
        const displayObj = account.toDisplayObject();

        return {
            id: account.id,
            createdAt: account.createdAt.toISOString(),
            updatedAt: account.updatedAt.toISOString(),
            userId: account.userId,
            accountNumber: account.accountNumber,
            name: account.name,
            type: account.type,
            balance: account.getBalanceAmount(),
            formattedBalance: account.getBalance().toDisplayString(),
            currency: account.getCurrency(),
            status: account.status,
            statusText: displayObj.statusText,
            isActive: account.isActive(),
            canPerformTransactions: account.canPerformTransactions(),
            description: account.description,
            lastTransactionDate: account.lastTransactionDate?.toISOString()
        };
    }

    /**
     * 處理錯誤
     */
    private handleError(error: any, message: string): Error {
        console.error(`${message}:`, error);
        return new Error(`${message}: ${error.message || error}`);
    }
}