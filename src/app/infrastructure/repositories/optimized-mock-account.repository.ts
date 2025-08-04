/**
 * 優化的 Mock 帳戶儲存庫
 * 使用新的基礎類別，提供測試用的記憶體儲存實作
 */

import { Injectable } from '@angular/core';
import { BaseMockRepository } from './base-mock.repository';
import { OptimizedAccount, AccountData, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { AccountSearchCriteria, AccountStatistics } from './optimized-firebase-account.repository';

@Injectable({ providedIn: 'root' })
export class OptimizedMockAccountRepository extends BaseMockRepository<OptimizedAccount> {

    constructor() {
        super();
    }

    /**
     * 根據帳戶號碼查找帳戶
     */
    async findByAccountNumber(accountNumber: string): Promise<OptimizedAccount | null> {
        await this.delay(100);

        for (const account of this.entities.values()) {
            if (account.accountNumber === accountNumber) {
                return account;
            }
        }
        return null;
    }

    /**
     * 根據用戶 ID 查找帳戶
     */
    async findByUserId(userId: string): Promise<OptimizedAccount[]> {
        await this.delay(150);

        return Array.from(this.entities.values())
            .filter(account => account.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據帳戶狀態查找帳戶
     */
    async findByStatus(status: AccountStatus): Promise<OptimizedAccount[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(account => account.status === status)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /**
     * 根據帳戶類型查找帳戶
     */
    async findByType(accountType: AccountType): Promise<OptimizedAccount[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(account => account.type === accountType)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據餘額範圍查找帳戶
     */
    async findByBalanceRange(minBalance: number, maxBalance: number): Promise<OptimizedAccount[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(account => {
                const balance = account.getBalanceAmount();
                return balance >= minBalance && balance <= maxBalance;
            })
            .sort((a, b) => b.getBalanceAmount() - a.getBalanceAmount());
    }

    /**
     * 根據貨幣查找帳戶
     */
    async findByCurrency(currency: string): Promise<OptimizedAccount[]> {
        await this.delay(100);

        return Array.from(this.entities.values())
            .filter(account => account.getCurrency() === currency)
            .sort((a, b) => b.getBalanceAmount() - a.getBalanceAmount());
    }

    /**
     * 檢查帳戶號碼是否存在
     */
    async existsByAccountNumber(accountNumber: string): Promise<boolean> {
        await this.delay(80);

        const account = await this.findByAccountNumber(accountNumber);
        return !!account;
    }

    /**
     * 獲取帳戶統計資料
     */
    async getStatistics(): Promise<AccountStatistics> {
        await this.delay(200);

        const allAccounts = Array.from(this.entities.values());

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

        return statistics;
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
        await this.delay(150);

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

        return summary;
    }

    /**
     * 應用搜尋條件篩選
     */
    protected override applySearchCriteria(entities: OptimizedAccount[], criteria: SearchCriteria): OptimizedAccount[] {
        const accountCriteria = criteria as AccountSearchCriteria;

        // 先應用基礎篩選
        let filtered = super.applySearchCriteria(entities, criteria);

        // 用戶 ID 篩選
        if (accountCriteria.userId) {
            filtered = filtered.filter(account => account.userId === accountCriteria.userId);
        }

        // 帳戶號碼篩選
        if (accountCriteria.filters?.['accountNumber']) {
            filtered = filtered.filter(account => account.accountNumber === accountCriteria.filters!['accountNumber']);
        }

        // 帳戶類型篩選
        if (accountCriteria.accountType) {
            filtered = filtered.filter(account => account.type === accountCriteria.accountType);
        }

        // 帳戶狀態篩選
        if (accountCriteria.accountStatus) {
            filtered = filtered.filter(account => account.status === accountCriteria.accountStatus);
        }

        // 貨幣篩選
        if (accountCriteria.currency) {
            filtered = filtered.filter(account => account.getCurrency() === accountCriteria.currency);
        }

        // 餘額範圍篩選
        if (accountCriteria.minBalance !== undefined) {
            filtered = filtered.filter(account => account.getBalanceAmount() >= accountCriteria.minBalance!);
        }

        if (accountCriteria.maxBalance !== undefined) {
            filtered = filtered.filter(account => account.getBalanceAmount() <= accountCriteria.maxBalance!);
        }

        return filtered;
    }

    /**
     * 應用關鍵字搜尋
     */
    protected override applyKeywordSearch(entities: OptimizedAccount[], keyword: string): OptimizedAccount[] {
        const lowerKeyword = keyword.toLowerCase();
        return entities.filter(account =>
            account.name.toLowerCase().includes(lowerKeyword) ||
            account.accountNumber.toLowerCase().includes(lowerKeyword) ||
            account.description?.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 應用排序
     */
    protected override sortEntities(entities: OptimizedAccount[], sortBy: string, sortOrder: 'asc' | 'desc'): OptimizedAccount[] {
        return entities.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortBy) {
                case 'balance':
                    aValue = a.getBalanceAmount();
                    bValue = b.getBalanceAmount();
                    break;
                case 'name':
                    aValue = a.name;
                    bValue = b.name;
                    break;
                case 'accountNumber':
                    aValue = a.accountNumber;
                    bValue = b.accountNumber;
                    break;
                case 'type':
                    aValue = a.type;
                    bValue = b.type;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'createdAt':
                case 'updatedAt':
                    aValue = (a as any)[sortBy].getTime();
                    bValue = (b as any)[sortBy].getTime();
                    break;
                default:
                    aValue = (a as any)[sortBy];
                    bValue = (b as any)[sortBy];
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * 初始化測試資料
     */
    protected initializeMockData(): void {
        const mockAccounts = [
            OptimizedAccount.create({
                userId: 'user_1',
                accountNumber: 'ACC-001001-ABC123',
                name: '主要支票帳戶',
                type: AccountType.CHECKING,
                initialBalance: 2500.00,
                currency: 'USD',
                description: '日常交易用的主要支票帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_1',
                accountNumber: 'ACC-001002-DEF456',
                name: '儲蓄帳戶',
                type: AccountType.SAVINGS,
                initialBalance: 15000.00,
                currency: 'USD',
                description: '高利率儲蓄帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_1',
                accountNumber: 'ACC-001003-GHI789',
                name: '信用卡帳戶',
                type: AccountType.CREDIT,
                initialBalance: -500.00,
                currency: 'USD',
                description: '信用卡帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_2',
                accountNumber: 'ACC-002001-JKL012',
                name: '投資組合',
                type: AccountType.SAVINGS,
                initialBalance: 50000.00,
                currency: 'USD',
                description: '股票和債券投資帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_2',
                accountNumber: 'ACC-002002-MNO345',
                name: '次要支票帳戶',
                type: AccountType.CHECKING,
                initialBalance: 0.00,
                currency: 'USD',
                description: '次要支票帳戶（停用）'
            }),
            OptimizedAccount.create({
                userId: 'user_3',
                accountNumber: 'ACC-003001-PQR678',
                name: '商業帳戶',
                type: AccountType.CHECKING,
                initialBalance: 5000.00,
                currency: 'USD',
                description: '商業支票帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_3',
                accountNumber: 'ACC-003002-STU901',
                name: '緊急基金',
                type: AccountType.SAVINGS,
                initialBalance: 10000.00,
                currency: 'USD',
                description: '緊急儲蓄基金'
            }),
            OptimizedAccount.create({
                userId: 'user_4',
                accountNumber: 'ACC-004001-VWX234',
                name: '個人投資帳戶',
                type: AccountType.SAVINGS,
                initialBalance: 25000.00,
                currency: 'USD',
                description: '個人投資帳戶'
            }),
            OptimizedAccount.create({
                userId: 'user_4',
                accountNumber: 'ACC-004002-YZA567',
                name: '信用額度',
                type: AccountType.CREDIT,
                initialBalance: -2000.00,
                currency: 'USD',
                description: '個人信用額度'
            }),
            OptimizedAccount.create({
                userId: 'user_5',
                accountNumber: 'ACC-005001-BCD890',
                name: '聯名帳戶',
                type: AccountType.CHECKING,
                initialBalance: 7500.00,
                currency: 'USD',
                description: '聯名支票帳戶'
            })
        ];

        // 設定一些帳戶為非啟用狀態
        mockAccounts[4].deactivate(); // user_2 的次要支票帳戶
        mockAccounts[6].suspend(); // user_3 的緊急基金暫停

        // 添加帳戶到儲存庫
        mockAccounts.forEach(account => {
            this.entities.set(account.id, account);
        });
    }
}