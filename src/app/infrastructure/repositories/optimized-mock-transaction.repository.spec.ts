/**
 * 優化的 Mock 交易儲存庫測試
 */

import { TestBed } from '@angular/core/testing';
import { OptimizedMockTransactionRepository } from './optimized-mock-transaction.repository';
import { OptimizedTransaction, TransactionType, TransactionStatus } from '../../domain/entities/optimized-transaction.entity';
import { Money } from '../../domain/value-objects/account/money.value-object';
import { TransactionSearchCriteria } from './optimized-firebase-transaction.repository';

describe('OptimizedMockTransactionRepository', () => {
    let repository: OptimizedMockTransactionRepository;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [OptimizedMockTransactionRepository]
        });

        repository = TestBed.inject(OptimizedMockTransactionRepository);
    });

    afterEach(() => {
        // 清理測試資料
        repository.clearMockData();
    });

    describe('initialization', () => {
        it('should initialize with mock data', async () => {
            // Act
            const allTransactions = await repository.findAll();

            // Assert
            expect(allTransactions.length).toBeGreaterThan(0);
            expect(allTransactions.every(transaction => transaction instanceof OptimizedTransaction)).toBe(true);
        });

        it('should have transactions with different statuses', async () => {
            // Act
            const allTransactions = await repository.findAll();

            // Assert
            const statuses = allTransactions.map(transaction => transaction.status);
            expect(statuses).toContain(TransactionStatus.COMPLETED);
            expect(statuses).toContain(TransactionStatus.PENDING);
            expect(statuses).toContain(TransactionStatus.PROCESSING);
            expect(statuses).toContain(TransactionStatus.FAILED);
            expect(statuses).toContain(TransactionStatus.CANCELLED);
        });

        it('should have transactions with different types', async () => {
            // Act
            const allTransactions = await repository.findAll();

            // Assert
            const types = allTransactions.map(transaction => transaction.transactionType);
            expect(types).toContain(TransactionType.DEPOSIT);
            expect(types).toContain(TransactionType.WITHDRAWAL);
            expect(types).toContain(TransactionType.TRANSFER);
            expect(types).toContain(TransactionType.PAYMENT);
            expect(types).toContain(TransactionType.REFUND);
            expect(types).toContain(TransactionType.FEE);
        });
    });

    describe('findByTransactionNumber', () => {
        it('should find transaction by transaction number', async () => {
            // Arrange
            const testTransaction = OptimizedTransaction.createDeposit(
                'TEST-TXN-123',
                'acc_test',
                'user_test',
                new Money(1500, 'USD'),
                '測試交易'
            );
            await repository.save(testTransaction);

            // Act
            const result = await repository.findByTransactionNumber('TEST-TXN-123');

            // Assert
            expect(result).not.toBeNull();
            expect(result!.transactionNumber).toBe('TEST-TXN-123');
            expect(result!.description).toBe('測試交易');
        });

        it('should return null when transaction not found', async () => {
            // Act
            const result = await repository.findByTransactionNumber('NON-EXISTENT');

            // Assert
            expect(result).toBeNull();
        });

        it('should simulate network delay', async () => {
            // Arrange
            const startTime = Date.now();

            // Act
            await repository.findByTransactionNumber('ANY-NUMBER');

            // Assert
            const endTime = Date.now();
            expect(endTime - startTime).toBeGreaterThanOrEqual(100);
        });
    });

    describe('findByAccountId', () => {
        it('should find transactions by account ID', async () => {
            // Arrange
            const accountId = 'test_account';
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-001',
                accountId,
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-002',
                accountId,
                'user_1',
                new Money(500, 'USD'),
                'Transaction 2'
            );
            const otherAccountTransaction = OptimizedTransaction.createDeposit(
                'TXN-003',
                'other_account',
                'user_2',
                new Money(200, 'USD'),
                'Other Transaction'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);
            await repository.save(otherAccountTransaction);

            // Act
            const result = await repository.findByAccountId(accountId);

            // Assert
            expect(result.length).toBe(2);
            expect(result.every(transaction => transaction.accountId === accountId)).toBe(true);
            expect(result.map(transaction => transaction.transactionNumber)).toContain('TXN-001');
            expect(result.map(transaction => transaction.transactionNumber)).toContain('TXN-002');
        });

        it('should return transactions sorted by creation date descending', async () => {
            // Arrange
            const accountId = 'test_account';
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-001',
                accountId,
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );

            // 稍微延遲以確保不同的創建時間
            await new Promise(resolve => setTimeout(resolve, 10));

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-002',
                accountId,
                'user_1',
                new Money(500, 'USD'),
                'Transaction 2'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);

            // Act
            const result = await repository.findByAccountId(accountId);

            // Assert
            expect(result.length).toBe(2);
            expect(result[0].createdAt.getTime()).toBeGreaterThanOrEqual(result[1].createdAt.getTime());
        });

        it('should return empty array when no transactions found', async () => {
            // Act
            const result = await repository.findByAccountId('nonexistent_account');

            // Assert
            expect(result).toEqual([]);
        });
    });

    describe('findByUserId', () => {
        it('should find transactions by user ID', async () => {
            // Arrange
            const userId = 'test_user';
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-001',
                'acc_1',
                userId,
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-002',
                'acc_2',
                userId,
                new Money(500, 'USD'),
                'Transaction 2'
            );
            const otherUserTransaction = OptimizedTransaction.createDeposit(
                'TXN-003',
                'acc_3',
                'other_user',
                new Money(200, 'USD'),
                'Other Transaction'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);
            await repository.save(otherUserTransaction);

            // Act
            const result = await repository.findByUserId(userId);

            // Assert
            expect(result.length).toBe(2);
            expect(result.every(transaction => transaction.userId === userId)).toBe(true);
        });
    });

    describe('findByStatus', () => {
        it('should find transactions by status', async () => {
            // Arrange
            const completedTransaction = OptimizedTransaction.createDeposit(
                'TXN-COMPLETED',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Completed Transaction'
            );
            completedTransaction.complete();

            const pendingTransaction = OptimizedTransaction.createWithdrawal(
                'TXN-PENDING',
                'acc_2',
                'user_2',
                new Money(500, 'USD'),
                'Pending Transaction'
            );
            // pendingTransaction 預設為 PENDING 狀態

            await repository.save(completedTransaction);
            await repository.save(pendingTransaction);

            // Act
            const completedResults = await repository.findByStatus(TransactionStatus.COMPLETED);
            const pendingResults = await repository.findByStatus(TransactionStatus.PENDING);

            // Assert
            expect(completedResults.some(txn => txn.transactionNumber === 'TXN-COMPLETED')).toBe(true);
            expect(pendingResults.some(txn => txn.transactionNumber === 'TXN-PENDING')).toBe(true);
            expect(completedResults.every(txn => txn.status === TransactionStatus.COMPLETED)).toBe(true);
            expect(pendingResults.every(txn => txn.status === TransactionStatus.PENDING)).toBe(true);
        });
    });

    describe('findByType', () => {
        it('should find transactions by type', async () => {
            // Arrange
            const depositTransaction = OptimizedTransaction.createDeposit(
                'TXN-DEPOSIT',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Deposit Transaction'
            );

            const withdrawalTransaction = OptimizedTransaction.createWithdrawal(
                'TXN-WITHDRAWAL',
                'acc_2',
                'user_2',
                new Money(500, 'USD'),
                'Withdrawal Transaction'
            );

            await repository.save(depositTransaction);
            await repository.save(withdrawalTransaction);

            // Act
            const depositResults = await repository.findByType(TransactionType.DEPOSIT);
            const withdrawalResults = await repository.findByType(TransactionType.WITHDRAWAL);

            // Assert
            expect(depositResults.some(txn => txn.transactionNumber === 'TXN-DEPOSIT')).toBe(true);
            expect(withdrawalResults.some(txn => txn.transactionNumber === 'TXN-WITHDRAWAL')).toBe(true);
            expect(depositResults.every(txn => txn.transactionType === TransactionType.DEPOSIT)).toBe(true);
            expect(withdrawalResults.every(txn => txn.transactionType === TransactionType.WITHDRAWAL)).toBe(true);
        });
    });

    describe('findByAmountRange', () => {
        it('should find transactions within amount range', async () => {
            // Arrange
            const lowAmountTransaction = OptimizedTransaction.createDeposit(
                'TXN-LOW',
                'acc_1',
                'user_1',
                new Money(100, 'USD'),
                'Low Amount Transaction'
            );

            const midAmountTransaction = OptimizedTransaction.createDeposit(
                'TXN-MID',
                'acc_2',
                'user_2',
                new Money(1500, 'USD'),
                'Mid Amount Transaction'
            );

            const highAmountTransaction = OptimizedTransaction.createDeposit(
                'TXN-HIGH',
                'acc_3',
                'user_3',
                new Money(5000, 'USD'),
                'High Amount Transaction'
            );

            await repository.save(lowAmountTransaction);
            await repository.save(midAmountTransaction);
            await repository.save(highAmountTransaction);

            // Act
            const result = await repository.findByAmountRange(1000, 2000);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].transactionNumber).toBe('TXN-MID');
            expect(result[0].amount.getAmount()).toBe(1500);
        });

        it('should return transactions sorted by amount descending', async () => {
            // Arrange
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-1',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );

            const transaction2 = OptimizedTransaction.createDeposit(
                'TXN-2',
                'acc_2',
                'user_2',
                new Money(2000, 'USD'),
                'Transaction 2'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);

            // Act
            const result = await repository.findByAmountRange(500, 2500);

            // Assert
            expect(result.length).toBe(2);
            expect(result[0].amount.getAmount()).toBeGreaterThanOrEqual(result[1].amount.getAmount());
        });
    });

    describe('findByDateRange', () => {
        it('should find transactions within date range', async () => {
            // Arrange
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');

            const transaction = OptimizedTransaction.createDeposit(
                'TXN-DATE-TEST',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Date Test Transaction'
            );
            await repository.save(transaction);

            // Act
            const result = await repository.findByDateRange(startDate, endDate);

            // Assert
            expect(result.some(txn => txn.transactionNumber === 'TXN-DATE-TEST')).toBe(true);
        });
    });

    describe('findByCategory', () => {
        it('should find transactions by category', async () => {
            // Arrange
            const transaction = OptimizedTransaction.createDeposit(
                'TXN-CATEGORY-TEST',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Category Test Transaction'
            );
            transaction.category = '測試分類';
            await repository.save(transaction);

            // Act
            const result = await repository.findByCategory('測試分類');

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].transactionNumber).toBe('TXN-CATEGORY-TEST');
            expect(result[0].category).toBe('測試分類');
        });
    });

    describe('findByReferenceNumber', () => {
        it('should find transactions by reference number', async () => {
            // Arrange
            const transaction = OptimizedTransaction.createDeposit(
                'TXN-REF-TEST',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Reference Test Transaction'
            );
            transaction.referenceNumber = 'REF-TEST-123';
            await repository.save(transaction);

            // Act
            const result = await repository.findByReferenceNumber('REF-TEST-123');

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].transactionNumber).toBe('TXN-REF-TEST');
            expect(result[0].referenceNumber).toBe('REF-TEST-123');
        });
    });

    describe('existsByTransactionNumber', () => {
        it('should return true when transaction exists', async () => {
            // Arrange
            const transaction = OptimizedTransaction.createDeposit(
                'EXISTING-TXN',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                '存在的交易'
            );
            await repository.save(transaction);

            // Act
            const result = await repository.existsByTransactionNumber('EXISTING-TXN');

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when transaction does not exist', async () => {
            // Act
            const result = await repository.existsByTransactionNumber('NON-EXISTENT-TXN');

            // Assert
            expect(result).toBe(false);
        });
    });

    describe('getStatistics', () => {
        it('should calculate statistics correctly', async () => {
            // Arrange
            repository.clearMockData();

            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-1',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            transaction1.complete();

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-2',
                'acc_2',
                'user_2',
                new Money(500, 'USD'),
                'Transaction 2'
            );
            transaction2.addFees(new Money(5, 'USD'));

            const transaction3 = OptimizedTransaction.create(
                'TXN-3',
                'acc_3',
                'user_3',
                new Money(2000, 'EUR'),
                TransactionType.TRANSFER,
                'Transaction 3'
            );
            transaction3.fail('Test failure');

            await repository.save(transaction1);
            await repository.save(transaction2);
            await repository.save(transaction3);

            // Act
            const result = await repository.getStatistics();

            // Assert
            expect(result.totalCount).toBe(3);
            expect(result.completedCount).toBe(1);
            expect(result.pendingCount).toBe(1);
            expect(result.failedCount).toBe(1);
            expect(result.totalAmount).toBe(3500);
            expect(result.averageAmount).toBe(3500 / 3);
            expect(result.byType[TransactionType.DEPOSIT]).toBe(1);
            expect(result.byType[TransactionType.WITHDRAWAL]).toBe(1);
            expect(result.byType[TransactionType.TRANSFER]).toBe(1);
            expect(result.byCurrency['USD'].count).toBe(2);
            expect(result.byCurrency['USD'].totalAmount).toBe(1500);
            expect(result.byCurrency['EUR'].count).toBe(1);
            expect(result.byCurrency['EUR'].totalAmount).toBe(2000);
            expect(result.totalFees).toBe(5);
            expect(result.averageFees).toBe(5);
        });

        it('should handle empty repository', async () => {
            // Arrange
            repository.clearMockData();

            // Act
            const result = await repository.getStatistics();

            // Assert
            expect(result.totalCount).toBe(0);
            expect(result.totalAmount).toBe(0);
            expect(result.averageAmount).toBe(0);
            expect(result.averageFees).toBe(0);
        });
    });

    describe('getAccountStatistics', () => {
        it('should calculate account statistics correctly', async () => {
            // Arrange
            const accountId = 'test_account';
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-1',
                accountId,
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            transaction1.complete();

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-2',
                accountId,
                'user_1',
                new Money(500, 'USD'),
                'Transaction 2'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);

            // Act
            const result = await repository.getAccountStatistics(accountId);

            // Assert
            expect(result.totalCount).toBe(2);
            expect(result.completedCount).toBe(1);
            expect(result.pendingCount).toBe(1);
            expect(result.totalAmount).toBe(1500);
            expect(result.averageAmount).toBe(750);
        });
    });

    describe('getUserStatistics', () => {
        it('should calculate user statistics correctly', async () => {
            // Arrange
            const userId = 'test_user';
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-1',
                'acc_1',
                userId,
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            transaction1.complete();

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-2',
                'acc_2',
                userId,
                new Money(500, 'USD'),
                'Transaction 2'
            );

            await repository.save(transaction1);
            await repository.save(transaction2);

            // Act
            const result = await repository.getUserStatistics(userId);

            // Assert
            expect(result.totalCount).toBe(2);
            expect(result.completedCount).toBe(1);
            expect(result.pendingCount).toBe(1);
            expect(result.totalAmount).toBe(1500);
            expect(result.averageAmount).toBe(750);
        });
    });

    describe('getTransactionHistoryReport', () => {
        it('should generate transaction history report correctly', async () => {
            // Arrange
            repository.clearMockData();

            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');

            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-1',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Transaction 1'
            );
            transaction1.complete();
            transaction1.category = '存款';

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-2',
                'acc_1',
                'user_1',
                new Money(500, 'USD'),
                'Transaction 2'
            );
            transaction2.complete();
            transaction2.category = '提款';

            await repository.save(transaction1);
            await repository.save(transaction2);

            // Act
            const result = await repository.getTransactionHistoryReport(startDate, endDate, 'acc_1');

            // Assert
            expect(result.totalTransactions).toBe(2);
            expect(result.totalAmount).toBe(1500);
            expect(result.successRate).toBe(100);
            expect(result.averageAmount).toBe(750);
            expect(result.topCategories.length).toBeGreaterThan(0);
            expect(result.dailyBreakdown.length).toBeGreaterThan(0);
            expect(result.period).toContain('2024-01-01');
            expect(result.period).toContain('2024-12-31');
        });
    });

    describe('search criteria filtering', () => {
        beforeEach(async () => {
            // 清理並設置測試資料
            repository.clearMockData();

            const transactions = [
                OptimizedTransaction.createDeposit(
                    'TXN-001',
                    'acc_1',
                    'user_1',
                    new Money(1000, 'USD'),
                    'Primary deposit transaction'
                ),
                OptimizedTransaction.createWithdrawal(
                    'TXN-002',
                    'acc_1',
                    'user_1',
                    new Money(500, 'USD'),
                    'Withdrawal transaction'
                ),
                OptimizedTransaction.createTransfer(
                    'TXN-003',
                    'acc_2',
                    'user_2',
                    new Money(2000, 'EUR'),
                    'Transfer transaction'
                )
            ];

            transactions[0].complete();
            transactions[0].category = '存款';
            transactions[0].referenceNumber = 'REF001';

            transactions[1].status = TransactionStatus.PENDING;
            transactions[1].category = '提款';
            transactions[1].referenceNumber = 'REF002';
            transactions[1].addFees(new Money(5, 'USD'));

            transactions[2].process();
            transactions[2].category = '轉帳';
            transactions[2].referenceNumber = 'REF003';

            for (const transaction of transactions) {
                await repository.save(transaction);
            }
        });

        it('should filter by keyword', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                keyword: 'primary'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].description).toContain('Primary');
        });

        it('should filter by account ID', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                accountId: 'acc_1'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(2);
            expect(result.every(txn => txn.accountId === 'acc_1')).toBe(true);
        });

        it('should filter by user ID', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                userId: 'user_1'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(2);
            expect(result.every(txn => txn.userId === 'user_1')).toBe(true);
        });

        it('should filter by transaction type', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                transactionType: TransactionType.DEPOSIT
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result.every(txn => txn.transactionType === TransactionType.DEPOSIT)).toBe(true);
        });

        it('should filter by transaction status', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                transactionStatus: TransactionStatus.COMPLETED
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].status).toBe(TransactionStatus.COMPLETED);
        });

        it('should filter by currency', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                currency: 'EUR'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].amount.getCurrency()).toBe('EUR');
        });

        it('should filter by category', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                category: '存款'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].category).toBe('存款');
        });

        it('should filter by reference number', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                referenceNumber: 'REF001'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].referenceNumber).toBe('REF001');
        });

        it('should filter by amount range', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                minAmount: 1500,
                maxAmount: 2500
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].amount.getAmount()).toBe(2000);
        });

        it('should filter by has fees', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                hasFees: true
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].fees).toBeDefined();
        });

        it('should combine multiple filters', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                accountId: 'acc_1',
                transactionType: TransactionType.DEPOSIT,
                transactionStatus: TransactionStatus.COMPLETED,
                currency: 'USD'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(1);
            expect(result[0].accountId).toBe('acc_1');
            expect(result[0].transactionType).toBe(TransactionType.DEPOSIT);
            expect(result[0].status).toBe(TransactionStatus.COMPLETED);
            expect(result[0].amount.getCurrency()).toBe('USD');
        });
    });

    describe('sorting', () => {
        beforeEach(async () => {
            repository.clearMockData();

            const transactions = [
                OptimizedTransaction.createDeposit(
                    'TXN-A',
                    'acc_1',
                    'user_1',
                    new Money(1000, 'USD'),
                    'Transaction A'
                ),
                OptimizedTransaction.createWithdrawal(
                    'TXN-B',
                    'acc_2',
                    'user_2',
                    new Money(3000, 'USD'),
                    'Transaction B'
                ),
                OptimizedTransaction.createTransfer(
                    'TXN-C',
                    'acc_3',
                    'user_3',
                    new Money(2000, 'USD'),
                    'Transaction C'
                )
            ];

            for (const transaction of transactions) {
                await repository.save(transaction);
            }
        });

        it('should sort by amount ascending', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                sortBy: 'amount',
                sortOrder: 'asc'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(3);
            expect(result[0].amount.getAmount()).toBe(1000);
            expect(result[1].amount.getAmount()).toBe(2000);
            expect(result[2].amount.getAmount()).toBe(3000);
        });

        it('should sort by amount descending', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                sortBy: 'amount',
                sortOrder: 'desc'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(3);
            expect(result[0].amount.getAmount()).toBe(3000);
            expect(result[1].amount.getAmount()).toBe(2000);
            expect(result[2].amount.getAmount()).toBe(1000);
        });

        it('should sort by transaction number', async () => {
            // Arrange
            const criteria: TransactionSearchCriteria = {
                sortBy: 'transactionNumber',
                sortOrder: 'asc'
            };

            // Act
            const result = await repository.findAll(criteria);

            // Assert
            expect(result.length).toBe(3);
            expect(result[0].transactionNumber).toBe('TXN-A');
            expect(result[1].transactionNumber).toBe('TXN-B');
            expect(result[2].transactionNumber).toBe('TXN-C');
        });
    });
});