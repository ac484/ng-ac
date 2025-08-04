/**
 * 優化的 Firebase 帳戶儲存庫
 * 使用新的基礎類別，整合帳戶特定的查詢邏輯，優化餘額相關的資料存取
 */

import { Injectable } from '@angular/core';
import { Firestore, DocumentData, Query, where, orderBy, query } from '@angular/fire/firestore';
import { BaseFirebaseRepository } from './base-firebase.repository';
import { OptimizedAccount, AccountData, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { RepositoryError } from '../../domain/exceptions/repository.error';

/**
 * 帳戶特定的搜尋條件
 */
export interface AccountSearchCriteria extends SearchCriteria {
    userId?: string;
    accountNumber?: string;
    accountType?: AccountType;
    accountStatus?: AccountStatus;
    minBalance?: number;
    maxBalance?: number;
    currency?: string;
    hasTransactions?: boolean;
}

/**
 * 帳戶統計資料
 */
export interface AccountStatistics {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    totalBalance: number;
    averageBalance: number;
    byType: Record<AccountType, number>;
    byCurrency: Record<string, { count: number; totalBalance: number }>;
}

@Injectable({ providedIn: 'root' })
export class OptimizedFirebaseAccountRepository extends BaseFirebaseRepository<OptimizedAccount> {

    constructor(firestore: Firestore) {
        super(firestore, 'accounts');
    }

    /**
     * 根據帳戶號碼查找帳戶
     */
    async findByAccountNumber(accountNumber: string): Promise<OptimizedAccount | null> {
        try {
            this.logOperation('findByAccountNumber', { accountNumber });

            const criteria: AccountSearchCriteria = {
                filters: { accountNumber }
            };

            const accounts = await this.findAll(criteria);
            const result = accounts.length > 0 ? accounts[0] : null;

            this.logOperation('findByAccountNumber', { accountNumber, found: !!result });
            return result;
        } catch (error) {
            this.logError('findByAccountNumber', error, { accountNumber });
            throw new RepositoryError('根據帳戶號碼查找帳戶失敗', error as Error);
        }
    }

    /**
     * 根據用戶 ID 查找帳戶
     */
    async findByUserId(userId: string): Promise<OptimizedAccount[]> {
        try {
            this.logOperation('findByUserId', { userId });

            const criteria: AccountSearchCriteria = {
                userId,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };

            const accounts = await this.findAll(criteria);

            this.logOperation('findByUserId', { userId, count: accounts.length });
            return accounts;
        } catch (error) {
            this.logError('findByUserId', error, { userId });
            throw new RepositoryError('根據用戶 ID 查找帳戶失敗', error as Error);
        }
    }

    /**
     * 根據帳戶狀態查找帳戶
     */
    async findByStatus(status: AccountStatus): Promise<OptimizedAccount[]> {
        try {
            this.logOperation('findByStatus', { status });

            const criteria: AccountSearchCriteria = {
                accountStatus: status,
                sortBy: 'updatedAt',
                sortOrder: 'desc'
            };

            const accounts = await this.findAll(criteria);

            this.logOperation('findByStatus', { status, count: accounts.length });
            return accounts;
        } catch (error) {
            this.logError('findByStatus', error, { status });
            throw new RepositoryError('根據帳戶狀態查找帳戶失敗', error as Error);
        }
    }

    /**
     * 根據帳戶類型查找帳戶
     */
    async findByType(accountType: AccountType): Promise<OptimizedAccount[]> {
        try {
            this.logOperation('findByType', { accountType });

            const criteria: AccountSearchCriteria = {
                accountType,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };

            const accounts = await this.findAll(criteria);

            this.logOperation('findByType', { accountType, count: accounts.length });
            return accounts;
        } catch (error) {
            this.logError('findByType', error, { accountType });
            throw new RepositoryError('根據帳戶類型查找帳戶失敗', error as Error);
        }
    }

    /**
     * 根據餘額範圍查找帳戶
     */
    async findByBalanceRange(minBalance: number, maxBalance: number): Promise<OptimizedAccount[]> {
        try {
            this.logOperation('findByBalanceRange', { minBalance, maxBalance });

            const criteria: AccountSearchCriteria = {
                minBalance,
                maxBalance,
                sortBy: 'balance',
                sortOrder: 'desc'
            };

            const accounts = await this.findAll(criteria);

            this.logOperation('findByBalanceRange', { minBalance, maxBalance, count: accounts.length });
            return accounts;
        } catch (error) {
            this.logError('findByBalanceRange', error, { minBalance, maxBalance });
            throw new RepositoryError('根據餘額範圍查找帳戶失敗', error as Error);
        }
    }

    /**
     * 根據貨幣查找帳戶
     */
    async findByCurrency(currency: string): Promise<OptimizedAccount[]> {
        try {
            this.logOperation('findByCurrency', { currency });

            const criteria: AccountSearchCriteria = {
                currency,
                sortBy: 'balance',
                sortOrder: 'desc'
            };

            const accounts = await this.findAll(criteria);

            this.logOperation('findByCurrency', { currency, count: accounts.length });
            return accounts;
        } catch (error) {
            this.logError('findByCurrency', error, { currency });
            throw new RepositoryError('根據貨幣查找帳戶失敗', error as Error);
        }
    }

    /**
     * 檢查帳戶號碼是否存在
     */
    async existsByAccountNumber(accountNumber: string): Promise<boolean> {
        try {
            this.logOperation('existsByAccountNumber', { accountNumber });

            const account = await this.findByAccountNumber(accountNumber);
            const exists = !!account;

            this.logOperation('existsByAccountNumber', { accountNumber, exists });
            return exists;
        } catch (error) {
            this.logError('existsByAccountNumber', error, { accountNumber });
            throw new RepositoryError('檢查帳戶號碼是否存在失敗', error as Error);
        }
    }

    /**
     * 獲取帳戶統計資料
     */
    async getStatistics(): Promise<AccountStatistics> {
        try {
            this.logOperation('getStatistics', {});

            const allAccounts = await this.findAll();

            const statistics: AccountStatistics = {
                total: allAccounts.length,
                active: 0,
                inactive: 0,
                suspended: 0,
                closed: 0,
                totalBalance: 0,
                averageBalance: 0,
                byType: {
                    [AccountType.CHECKING]: 0,
                    [AccountType.SAVINGS]: 0,
                    [AccountType.CREDIT]: 0
                },
                byCurrency: {}
            };

            // 計算統計資料
            allAccounts.forEach(account => {
                // 狀態統計
                switch (account.status) {
                    case AccountStatus.ACTIVE:
                        statistics.active++;
                        break;
                    case AccountStatus.INACTIVE:
                        statistics.inactive++;
                        break;
                    case AccountStatus.SUSPENDED:
                        statistics.suspended++;
                        break;
                    case AccountStatus.CLOSED:
                        statistics.closed++;
                        break;
                }

                // 類型統計
                statistics.byType[account.type]++;

                // 餘額統計
                const balance = account.getBalanceAmount();
                statistics.totalBalance += balance;

                // 貨幣統計
                const currency = account.getCurrency();
                if (!statistics.byCurrency[currency]) {
                    statistics.byCurrency[currency] = { count: 0, totalBalance: 0 };
                }
                statistics.byCurrency[currency].count++;
                statistics.byCurrency[currency].totalBalance += balance;
            });

            // 計算平均餘額
            statistics.averageBalance = statistics.total > 0 ? statistics.totalBalance / statistics.total : 0;

            this.logOperation('getStatistics', { statistics });
            return statistics;
        } catch (error) {
            this.logError('getStatistics', error);
            throw new RepositoryError('獲取帳戶統計資料失敗', error as Error);
        }
    }

    /**
     * 獲取用戶的帳戶摘要
     */
    async getUserAccountSummary(userId: string): Promise<{
        totalAccounts: number;
        activeAccounts: number;
        totalBalance: number;
        balanceByCurrency: Record<string, number>;
        accountsByType: Record<AccountType, number>;
    }> {
        try {
            this.logOperation('getUserAccountSummary', { userId });

            const userAccounts = await this.findByUserId(userId);

            const summary = {
                totalAccounts: userAccounts.length,
                activeAccounts: userAccounts.filter(acc => acc.isActive()).length,
                totalBalance: 0,
                balanceByCurrency: {} as Record<string, number>,
                accountsByType: {
                    [AccountType.CHECKING]: 0,
                    [AccountType.SAVINGS]: 0,
                    [AccountType.CREDIT]: 0
                }
            };

            userAccounts.forEach(account => {
                const balance = account.getBalanceAmount();
                const currency = account.getCurrency();

                summary.totalBalance += balance;

                if (!summary.balanceByCurrency[currency]) {
                    summary.balanceByCurrency[currency] = 0;
                }
                summary.balanceByCurrency[currency] += balance;

                summary.accountsByType[account.type]++;
            });

            this.logOperation('getUserAccountSummary', { userId, summary });
            return summary;
        } catch (error) {
            this.logError('getUserAccountSummary', error, { userId });
            throw new RepositoryError('獲取用戶帳戶摘要失敗', error as Error);
        }
    }

    /**
     * 應用帳戶特定的搜尋條件
     */
    protected override applySearchCriteria(q: Query<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
        const accountCriteria = criteria as AccountSearchCriteria;
        const constraints = [];

        // 用戶 ID 篩選
        if (accountCriteria.userId) {
            constraints.push(where('userId', '==', accountCriteria.userId));
        }

        // 帳戶號碼篩選
        if (accountCriteria.filters?.['accountNumber']) {
            constraints.push(where('accountNumber', '==', accountCriteria.filters['accountNumber']));
        }

        // 帳戶類型篩選
        if (accountCriteria.accountType) {
            constraints.push(where('type', '==', accountCriteria.accountType));
        }

        // 帳戶狀態篩選
        if (accountCriteria.accountStatus) {
            constraints.push(where('status', '==', accountCriteria.accountStatus));
        }

        // 貨幣篩選
        if (accountCriteria.currency) {
            constraints.push(where('currency', '==', accountCriteria.currency));
        }

        // 餘額範圍篩選（注意：Firestore 的複合查詢限制）
        if (accountCriteria.minBalance !== undefined) {
            constraints.push(where('balance', '>=', accountCriteria.minBalance));
        }

        if (accountCriteria.maxBalance !== undefined) {
            constraints.push(where('balance', '<=', accountCriteria.maxBalance));
        }

        // 日期範圍篩選
        if (accountCriteria.startDate) {
            constraints.push(where('createdAt', '>=', accountCriteria.startDate));
        }

        if (accountCriteria.endDate) {
            constraints.push(where('createdAt', '<=', accountCriteria.endDate));
        }

        // 其他自定義篩選
        if (accountCriteria.filters) {
            Object.entries(accountCriteria.filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null && field !== 'accountNumber') {
                    constraints.push(where(field, '==', value));
                }
            });
        }

        // 排序
        const sortBy = accountCriteria.sortBy || 'createdAt';
        const sortOrder = accountCriteria.sortOrder || 'desc';
        constraints.push(orderBy(sortBy, sortOrder));

        return query(q, ...constraints);
    }

    /**
     * 從 Firestore 文件轉換為帳戶實體
     */
    protected fromFirestore(data: DocumentData, id: string): OptimizedAccount {
        const accountData: AccountData = {
            id,
            userId: data['userId'],
            accountNumber: data['accountNumber'],
            name: data['name'],
            type: data['type'] as AccountType,
            balance: data['balance'] || 0,
            currency: data['currency'] || 'USD',
            status: data['status'] as AccountStatus,
            description: data['description'],
            lastTransactionDate: data['lastTransactionDate']?.toDate(),
            createdAt: data['createdAt']?.toDate() || new Date(),
            updatedAt: data['updatedAt']?.toDate() || new Date()
        };

        return new OptimizedAccount(accountData);
    }

    /**
     * 將帳戶實體轉換為 Firestore 文件
     */
    protected toFirestore(entity: OptimizedAccount): DocumentData {
        return {
            userId: entity.userId,
            accountNumber: entity.accountNumber,
            name: entity.name,
            type: entity.type,
            balance: entity.getBalanceAmount(),
            currency: entity.getCurrency(),
            status: entity.status,
            description: entity.description,
            lastTransactionDate: entity.lastTransactionDate,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}