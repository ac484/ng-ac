/**
 * 優化的 Mock 交易儲存庫
 * 使用新的基礎類別，提供測試用的記憶體儲存實作
 */

import { Injectable } from '@angular/core';
import { BaseMockRepository } from './base-mock.repository';
import { OptimizedTransaction, TransactionType, TransactionStatus } from '../../domain/entities/optimized-transaction.entity';
import { Money } from '../../domain/value-objects/account/money.value-object';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { TransactionSearchCriteria, TransactionStatistics, TransactionHistoryReport } from './optimized-firebase-transaction.repository';

@Injectable({ providedIn: 'root' })
export class OptimizedMockTransactionRepository extends BaseMockRepository<OptimizedTransaction> {

    constructor() {
        super();
    }

    /**
     * 根據交易編號查找交易
     */
    async findByTransactionNumber(transactionNumber: string): Promise<OptimizedTransaction | null> {
        await this.delay(100);

        for (const transaction of this.entities.values()) {
            if (transaction.transactionNumber === transactionNumber) {
                return transaction;
            }
        }
        return null;
    }

    /**
     * 根據帳戶 ID 查找交易
     */
    async findByAccountId(accountId: string): Promise<OptimizedTransaction[]> {
        await this.delay(150);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.accountId === accountId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據用戶 ID 查找交易
     */
    async findByUserId(userId: string): Promise<OptimizedTransaction[]> {
        await this.delay(150);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據交易狀態查找交易
     */
    async findByStatus(status: TransactionStatus): Promise<OptimizedTransaction[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.status === status)
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /**
     * 根據交易類型查找交易
     */
    async findByType(transactionType: TransactionType): Promise<OptimizedTransaction[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.transactionType === transactionType)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據金額範圍查找交易
     */
    async findByAmountRange(minAmount: number, maxAmount: number): Promise<OptimizedTransaction[]> {
        await this.delay(120);

        return Array.from(this.entities.values())
            .filter(transaction => {
                const amount = transaction.amount.getAmount();
                return amount >= minAmount && amount <= maxAmount;
            })
            .sort((a, b) => b.amount.getAmount() - a.amount.getAmount());
    }

    /**
     * 根據日期範圍查找交易
     */
    async findByDateRange(startDate: Date, endDate: Date): Promise<OptimizedTransaction[]> {
        await this.delay(150);

        return Array.from(this.entities.values())
            .filter(transaction =>
                transaction.createdAt >= startDate && transaction.createdAt <= endDate
            )
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據分類查找交易
     */
    async findByCategory(category: string): Promise<OptimizedTransaction[]> {
        await this.delay(100);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.category === category)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 根據參考編號查找交易
     */
    async findByReferenceNumber(referenceNumber: string): Promise<OptimizedTransaction[]> {
        await this.delay(100);

        return Array.from(this.entities.values())
            .filter(transaction => transaction.referenceNumber === referenceNumber)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    /**
     * 檢查交易編號是否存在
     */
    async existsByTransactionNumber(transactionNumber: string): Promise<boolean> {
        await this.delay(80);

        const transaction = await this.findByTransactionNumber(transactionNumber);
        return !!transaction;
    }

    /**
     * 獲取交易統計資料
     */
    async getStatistics(): Promise<TransactionStatistics> {
        await this.delay(200);

        const allTransactions = Array.from(this.entities.values());
        return this.calculateStatistics(allTransactions);
    }

    /**
     * 獲取帳戶交易統計資料
     */
    async getAccountStatistics(accountId: string): Promise<TransactionStatistics> {
        await this.delay(150);

        const accountTransactions = await this.findByAccountId(accountId);
        return this.calculateStatistics(accountTransactions);
    }

    /**
     * 獲取用戶交易統計資料
     */
    async getUserStatistics(userId: string): Promise<TransactionStatistics> {
        await this.delay(150);

        const userTransactions = await this.findByUserId(userId);
        return this.calculateStatistics(userTransactions);
    }

    /**
     * 獲取交易歷史報表
     */
    async getTransactionHistoryReport(
        startDate: Date,
        endDate: Date,
        accountId?: string,
        userId?: string
    ): Promise<TransactionHistoryReport> {
        await this.delay(250);

        let transactions = await this.findByDateRange(startDate, endDate);

        // 應用額外篩選
        if (accountId) {
            transactions = transactions.filter(t => t.accountId === accountId);
        }
        if (userId) {
            transactions = transactions.filter(t => t.userId === userId);
        }

        // 計算報表資料
        const totalTransactions = transactions.length;
        const completedTransactions = transactions.filter(t => t.isCompleted());
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount.getAmount(), 0);
        const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
        const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

        // 分類統計
        const categoryStats = new Map<string, { count: number; amount: number }>();
        transactions.forEach(transaction => {
            if (transaction.category) {
                const existing = categoryStats.get(transaction.category) || { count: 0, amount: 0 };
                categoryStats.set(transaction.category, {
                    count: existing.count + 1,
                    amount: existing.amount + transaction.amount.getAmount()
                });
            }
        });

        const topCategories = Array.from(categoryStats.entries())
            .map(([category, stats]) => ({ category, ...stats }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10);

        // 每日統計
        const dailyStats = new Map<string, { count: number; amount: number }>();
        transactions.forEach(transaction => {
            const dateKey = transaction.createdAt.toISOString().split('T')[0];
            const existing = dailyStats.get(dateKey) || { count: 0, amount: 0 };
            dailyStats.set(dateKey, {
                count: existing.count + 1,
                amount: existing.amount + transaction.amount.getAmount()
            });
        });

        const dailyBreakdown = Array.from(dailyStats.entries())
            .map(([date, stats]) => ({ date, ...stats }))
            .sort((a, b) => a.date.localeCompare(b.date));

        return {
            period: `${startDate.toISOString().split('T')[0]} 到 ${endDate.toISOString().split('T')[0]}`,
            totalTransactions,
            totalAmount,
            successRate,
            averageAmount,
            topCategories,
            dailyBreakdown
        };
    }

    /**
     * 應用搜尋條件篩選
     */
    protected override applySearchCriteria(entities: OptimizedTransaction[], criteria: SearchCriteria): OptimizedTransaction[] {
        const transactionCriteria = criteria as TransactionSearchCriteria;

        // 先應用基礎篩選
        let filtered = super.applySearchCriteria(entities, criteria);

        // 帳戶 ID 篩選
        if (transactionCriteria.accountId) {
            filtered = filtered.filter(transaction => transaction.accountId === transactionCriteria.accountId);
        }

        // 用戶 ID 篩選
        if (transactionCriteria.userId) {
            filtered = filtered.filter(transaction => transaction.userId === transactionCriteria.userId);
        }

        // 交易編號篩選
        if (transactionCriteria.filters?.['transactionNumber']) {
            filtered = filtered.filter(transaction => transaction.transactionNumber === transactionCriteria.filters!['transactionNumber']);
        }

        // 交易類型篩選
        if (transactionCriteria.transactionType) {
            filtered = filtered.filter(transaction => transaction.transactionType === transactionCriteria.transactionType);
        }

        // 交易狀態篩選
        if (transactionCriteria.transactionStatus) {
            filtered = filtered.filter(transaction => transaction.status === transactionCriteria.transactionStatus);
        }

        // 貨幣篩選
        if (transactionCriteria.currency) {
            filtered = filtered.filter(transaction => transaction.amount.getCurrency() === transactionCriteria.currency);
        }

        // 分類篩選
        if (transactionCriteria.category) {
            filtered = filtered.filter(transaction => transaction.category === transactionCriteria.category);
        }

        // 參考編號篩選
        if (transactionCriteria.referenceNumber) {
            filtered = filtered.filter(transaction => transaction.referenceNumber === transactionCriteria.referenceNumber);
        }

        // 金額範圍篩選
        if (transactionCriteria.minAmount !== undefined) {
            filtered = filtered.filter(transaction => transaction.amount.getAmount() >= transactionCriteria.minAmount!);
        }

        if (transactionCriteria.maxAmount !== undefined) {
            filtered = filtered.filter(transaction => transaction.amount.getAmount() <= transactionCriteria.maxAmount!);
        }

        // 手續費篩選
        if (transactionCriteria.hasFees !== undefined) {
            if (transactionCriteria.hasFees) {
                filtered = filtered.filter(transaction => transaction.fees !== undefined);
            } else {
                filtered = filtered.filter(transaction => transaction.fees === undefined);
            }
        }

        // 備註篩選
        if (transactionCriteria.hasNotes !== undefined) {
            if (transactionCriteria.hasNotes) {
                filtered = filtered.filter(transaction => transaction.notes !== undefined && transaction.notes.trim() !== '');
            } else {
                filtered = filtered.filter(transaction => !transaction.notes || transaction.notes.trim() === '');
            }
        }

        return filtered;
    }

    /**
     * 應用關鍵字搜尋
     */
    protected override applyKeywordSearch(entities: OptimizedTransaction[], keyword: string): OptimizedTransaction[] {
        const lowerKeyword = keyword.toLowerCase();
        return entities.filter(transaction =>
            transaction.transactionNumber.toLowerCase().includes(lowerKeyword) ||
            transaction.description.toLowerCase().includes(lowerKeyword) ||
            transaction.category?.toLowerCase().includes(lowerKeyword) ||
            transaction.referenceNumber?.toLowerCase().includes(lowerKeyword) ||
            transaction.notes?.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 應用排序
     */
    protected override sortEntities(entities: OptimizedTransaction[], sortBy: string, sortOrder: 'asc' | 'desc'): OptimizedTransaction[] {
        return entities.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortBy) {
                case 'amount':
                    aValue = a.amount.getAmount();
                    bValue = b.amount.getAmount();
                    break;
                case 'transactionNumber':
                    aValue = a.transactionNumber;
                    bValue = b.transactionNumber;
                    break;
                case 'description':
                    aValue = a.description;
                    bValue = b.description;
                    break;
                case 'transactionType':
                    aValue = a.transactionType;
                    bValue = b.transactionType;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'category':
                    aValue = a.category || '';
                    bValue = b.category || '';
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
        const mockTransactions = [
            OptimizedTransaction.createDeposit(
                'TXN-001001-DEP001',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                '初始存款',
                'txn_1'
            ),
            OptimizedTransaction.createWithdrawal(
                'TXN-001002-WTH001',
                'acc_1',
                'user_1',
                new Money(500, 'USD'),
                'ATM 提款',
                'txn_2'
            ),
            OptimizedTransaction.createTransfer(
                'TXN-001003-TRF001',
                'acc_2',
                'user_2',
                new Money(2000, 'USD'),
                '轉帳至儲蓄帳戶',
                'txn_3'
            ),
            OptimizedTransaction.create(
                'TXN-001004-PAY001',
                'acc_1',
                'user_1',
                new Money(150, 'USD'),
                TransactionType.PAYMENT,
                '線上付款',
                'txn_4'
            ),
            OptimizedTransaction.create(
                'TXN-001005-REF001',
                'acc_2',
                'user_2',
                new Money(300, 'USD'),
                TransactionType.REFUND,
                '取消訂單退款',
                'txn_5'
            ),
            OptimizedTransaction.create(
                'TXN-001006-FEE001',
                'acc_1',
                'user_1',
                new Money(25, 'USD'),
                TransactionType.FEE,
                '月度維護費',
                'txn_6'
            ),
            OptimizedTransaction.createDeposit(
                'TXN-001007-DEP002',
                'acc_1',
                'user_1',
                new Money(750, 'USD'),
                '失敗的存款嘗試',
                'txn_7'
            ),
            OptimizedTransaction.createWithdrawal(
                'TXN-001008-WTH002',
                'acc_2',
                'user_2',
                new Money(1200, 'USD'),
                '取消的提款',
                'txn_8'
            ),
            OptimizedTransaction.createDeposit(
                'TXN-001009-DEP003',
                'acc_3',
                'user_3',
                new Money(5000, 'EUR'),
                '歐元存款',
                'txn_9'
            ),
            OptimizedTransaction.createTransfer(
                'TXN-001010-TRF002',
                'acc_3',
                'user_3',
                new Money(800, 'EUR'),
                '國際轉帳',
                'txn_10'
            )
        ];

        // 設定一些交易的狀態和屬性
        mockTransactions[0].complete(); // 完成存款
        mockTransactions[1].complete(); // 完成提款
        mockTransactions[2].process(); // 處理中的轉帳
        mockTransactions[3].status = TransactionStatus.PENDING; // 待處理付款
        mockTransactions[4].complete(); // 完成退款
        mockTransactions[5].complete(); // 完成手續費
        mockTransactions[6].fail('餘額不足'); // 失敗的存款
        mockTransactions[7].cancel('用戶取消'); // 取消的提款
        mockTransactions[8].complete(); // 完成歐元存款
        mockTransactions[9].process(); // 處理中的國際轉帳

        // 設定分類和參考編號
        mockTransactions[0].category = '存款';
        mockTransactions[0].referenceNumber = 'REF001';
        mockTransactions[1].category = '提款';
        mockTransactions[1].referenceNumber = 'REF002';
        mockTransactions[1].addFees(new Money(5, 'USD'));
        mockTransactions[2].category = '轉帳';
        mockTransactions[2].referenceNumber = 'REF003';
        mockTransactions[2].addFees(new Money(10, 'USD'));
        mockTransactions[3].category = '付款';
        mockTransactions[3].referenceNumber = 'REF004';
        mockTransactions[3].addFees(new Money(3, 'USD'));
        mockTransactions[4].category = '退款';
        mockTransactions[4].referenceNumber = 'REF005';
        mockTransactions[5].category = '手續費';
        mockTransactions[5].referenceNumber = 'REF006';
        mockTransactions[6].category = '存款';
        mockTransactions[6].referenceNumber = 'REF007';
        mockTransactions[7].category = '提款';
        mockTransactions[7].referenceNumber = 'REF008';
        mockTransactions[7].addFees(new Money(12, 'USD'));
        mockTransactions[8].category = '存款';
        mockTransactions[8].referenceNumber = 'REF009';
        mockTransactions[9].category = '轉帳';
        mockTransactions[9].referenceNumber = 'REF010';
        mockTransactions[9].addFees(new Money(15, 'EUR'));

        // 添加交易到儲存庫
        mockTransactions.forEach(transaction => {
            this.entities.set(transaction.id, transaction);
        });
    }

    /**
     * 計算交易統計資料的輔助方法
     */
    private calculateStatistics(transactions: OptimizedTransaction[]): TransactionStatistics {
        const statistics: TransactionStatistics = {
            totalCount: transactions.length,
            totalAmount: 0,
            averageAmount: 0,
            completedCount: 0,
            pendingCount: 0,
            processingCount: 0,
            failedCount: 0,
            cancelledCount: 0,
            byStatus: {
                [TransactionStatus.PENDING]: 0,
                [TransactionStatus.PROCESSING]: 0,
                [TransactionStatus.COMPLETED]: 0,
                [TransactionStatus.FAILED]: 0,
                [TransactionStatus.CANCELLED]: 0
            },
            byType: {
                [TransactionType.DEPOSIT]: 0,
                [TransactionType.WITHDRAWAL]: 0,
                [TransactionType.TRANSFER]: 0,
                [TransactionType.PAYMENT]: 0,
                [TransactionType.REFUND]: 0,
                [TransactionType.FEE]: 0
            },
            byCurrency: {},
            byCategory: {},
            totalFees: 0,
            averageFees: 0
        };

        let totalFeesCount = 0;
        transactions.forEach(transaction => {
            // 狀態統計
            statistics.byStatus[transaction.status]++;
            switch (transaction.status) {
                case TransactionStatus.COMPLETED:
                    statistics.completedCount++;
                    break;
                case TransactionStatus.PENDING:
                    statistics.pendingCount++;
                    break;
                case TransactionStatus.PROCESSING:
                    statistics.processingCount++;
                    break;
                case TransactionStatus.FAILED:
                    statistics.failedCount++;
                    break;
                case TransactionStatus.CANCELLED:
                    statistics.cancelledCount++;
                    break;
            }

            // 類型統計
            statistics.byType[transaction.transactionType]++;

            // 金額統計
            const amount = transaction.amount.getAmount();
            statistics.totalAmount += amount;

            // 貨幣統計
            const currency = transaction.amount.getCurrency();
            if (!statistics.byCurrency[currency]) {
                statistics.byCurrency[currency] = { count: 0, totalAmount: 0 };
            }
            statistics.byCurrency[currency].count++;
            statistics.byCurrency[currency].totalAmount += amount;

            // 分類統計
            if (transaction.category) {
                if (!statistics.byCategory[transaction.category]) {
                    statistics.byCategory[transaction.category] = { count: 0, totalAmount: 0 };
                }
                statistics.byCategory[transaction.category].count++;
                statistics.byCategory[transaction.category].totalAmount += amount;
            }

            // 手續費統計
            if (transaction.fees) {
                statistics.totalFees += transaction.fees.getAmount();
                totalFeesCount++;
            }
        });

        // 計算平均值
        statistics.averageAmount = statistics.totalCount > 0 ? statistics.totalAmount / statistics.totalCount : 0;
        statistics.averageFees = totalFeesCount > 0 ? statistics.totalFees / totalFeesCount : 0;

        return statistics;
    }
}