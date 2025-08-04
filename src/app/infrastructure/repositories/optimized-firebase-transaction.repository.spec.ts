/**
 * 優化的 Firebase 交易儲存庫測試
 */

import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { OptimizedFirebaseTransactionRepository, TransactionSearchCriteria } from './optimized-firebase-transaction.repository';
import { OptimizedTransaction, TransactionType, TransactionStatus } from '../../domain/entities/optimized-transaction.entity';
import { Money } from '../../domain/value-objects/account/money.value-object';
import { RepositoryError } from '../../domain/exceptions/repository.error';

describe('OptimizedFirebaseTransactionRepository', () => {
    let repository: OptimizedFirebaseTransactionRepository;
    let mockFirestore: jasmine.SpyObj<Firestore>;
    let mockTransaction: OptimizedTransaction;

    beforeEach(() => {
        // 創建 Firestore mock
        mockFirestore = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

        TestBed.configureTestingModule({
            providers: [
                OptimizedFirebaseTransactionRepository,
                { provide: Firestore, useValue: mockFirestore }
            ]
        });

        repository = TestBed.inject(OptimizedFirebaseTransactionRepository);

        // 創建測試用交易
        mockTransaction = OptimizedTransaction.createDeposit(
            'TXN-TEST-001',
            'acc_1',
            'user_1',
            new Money(1000, 'USD'),
            '測試存款'
        );
    });

    describe('findByTransactionNumber', () => {
        it('should find transaction by transaction number', async () => {
            // Arrange
            const transactionNumber = 'TXN-TEST-001';
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByTransactionNumber(transactionNumber);

            // Assert
            expect(result).toBe(mockTransaction);
            expect(repository.findAll).toHaveBeenCalledWith({
                filters: { transactionNumber }
            });
        });

        it('should return null when transaction not found', async () => {
            // Arrange
            const transactionNumber = 'NON-EXISTENT';
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

            // Act
            const result = await repository.findByTransactionNumber(transactionNumber);

            // Assert
            expect(result).toBeNull();
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const transactionNumber = 'TXN-TEST-001';
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByTransactionNumber(transactionNumber))
                .toBeRejectedWithError(RepositoryError, '根據交易編號查找交易失敗');
        });
    });

    describe('findByAccountId', () => {
        it('should find transactions by account ID', async () => {
            // Arrange
            const accountId = 'acc_1';
            const expectedCriteria: TransactionSearchCriteria = {
                accountId,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByAccountId(accountId);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should return empty array when no transactions found', async () => {
            // Arrange
            const accountId = 'acc_nonexistent';
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

            // Act
            const result = await repository.findByAccountId(accountId);

            // Assert
            expect(result).toEqual([]);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const accountId = 'acc_1';
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByAccountId(accountId))
                .toBeRejectedWithError(RepositoryError, '根據帳戶 ID 查找交易失敗');
        });
    });

    describe('findByUserId', () => {
        it('should find transactions by user ID', async () => {
            // Arrange
            const userId = 'user_1';
            const expectedCriteria: TransactionSearchCriteria = {
                userId,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByUserId(userId);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const userId = 'user_1';
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByUserId(userId))
                .toBeRejectedWithError(RepositoryError, '根據用戶 ID 查找交易失敗');
        });
    });

    describe('findByStatus', () => {
        it('should find transactions by status', async () => {
            // Arrange
            const status = TransactionStatus.COMPLETED;
            const expectedCriteria: TransactionSearchCriteria = {
                transactionStatus: status,
                sortBy: 'updatedAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByStatus(status);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const status = TransactionStatus.COMPLETED;
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByStatus(status))
                .toBeRejectedWithError(RepositoryError, '根據交易狀態查找交易失敗');
        });
    });

    describe('findByType', () => {
        it('should find transactions by type', async () => {
            // Arrange
            const transactionType = TransactionType.DEPOSIT;
            const expectedCriteria: TransactionSearchCriteria = {
                transactionType,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByType(transactionType);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const transactionType = TransactionType.DEPOSIT;
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByType(transactionType))
                .toBeRejectedWithError(RepositoryError, '根據交易類型查找交易失敗');
        });
    });

    describe('findByAmountRange', () => {
        it('should find transactions by amount range', async () => {
            // Arrange
            const minAmount = 500;
            const maxAmount = 1500;
            const expectedCriteria: TransactionSearchCriteria = {
                minAmount,
                maxAmount,
                sortBy: 'amount',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByAmountRange(minAmount, maxAmount);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const minAmount = 500;
            const maxAmount = 1500;
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByAmountRange(minAmount, maxAmount))
                .toBeRejectedWithError(RepositoryError, '根據金額範圍查找交易失敗');
        });
    });

    describe('findByDateRange', () => {
        it('should find transactions by date range', async () => {
            // Arrange
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');
            const expectedCriteria: TransactionSearchCriteria = {
                startDate,
                endDate,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByDateRange(startDate, endDate);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByDateRange(startDate, endDate))
                .toBeRejectedWithError(RepositoryError, '根據日期範圍查找交易失敗');
        });
    });

    describe('findByCategory', () => {
        it('should find transactions by category', async () => {
            // Arrange
            const category = '存款';
            const expectedCriteria: TransactionSearchCriteria = {
                category,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByCategory(category);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const category = '存款';
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByCategory(category))
                .toBeRejectedWithError(RepositoryError, '根據分類查找交易失敗');
        });
    });

    describe('findByReferenceNumber', () => {
        it('should find transactions by reference number', async () => {
            // Arrange
            const referenceNumber = 'REF001';
            const expectedCriteria: TransactionSearchCriteria = {
                referenceNumber,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            };
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockTransaction]));

            // Act
            const result = await repository.findByReferenceNumber(referenceNumber);

            // Assert
            expect(result).toEqual([mockTransaction]);
            expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const referenceNumber = 'REF001';
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.findByReferenceNumber(referenceNumber))
                .toBeRejectedWithError(RepositoryError, '根據參考編號查找交易失敗');
        });
    });

    describe('existsByTransactionNumber', () => {
        it('should return true when transaction exists', async () => {
            // Arrange
            const transactionNumber = 'TXN-TEST-001';
            spyOn(repository, 'findByTransactionNumber').and.returnValue(Promise.resolve(mockTransaction));

            // Act
            const result = await repository.existsByTransactionNumber(transactionNumber);

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when transaction does not exist', async () => {
            // Arrange
            const transactionNumber = 'NON-EXISTENT';
            spyOn(repository, 'findByTransactionNumber').and.returnValue(Promise.resolve(null));

            // Act
            const result = await repository.existsByTransactionNumber(transactionNumber);

            // Assert
            expect(result).toBe(false);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const transactionNumber = 'TXN-TEST-001';
            const error = new Error('Database error');
            spyOn(repository, 'findByTransactionNumber').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.existsByTransactionNumber(transactionNumber))
                .toBeRejectedWithError(RepositoryError, '檢查交易編號是否存在失敗');
        });
    });

    describe('getStatistics', () => {
        it('should calculate transaction statistics correctly', async () => {
            // Arrange
            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-001',
                'acc_1',
                'user_1',
                new Money(1000, 'USD'),
                'Deposit 1'
            );
            transaction1.complete();

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-002',
                'acc_2',
                'user_2',
                new Money(500, 'USD'),
                'Withdrawal 1'
            );
            transaction2.addFees(new Money(5, 'USD'));

            const transaction3 = OptimizedTransaction.create(
                'TXN-003',
                'acc_3',
                'user_3',
                new Money(2000, 'EUR'),
                TransactionType.TRANSFER,
                'Transfer 1'
            );
            transaction3.fail('Insufficient funds');

            const transactions = [transaction1, transaction2, transaction3];
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve(transactions));

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

        it('should handle empty transaction list', async () => {
            // Arrange
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

            // Act
            const result = await repository.getStatistics();

            // Assert
            expect(result.totalCount).toBe(0);
            expect(result.totalAmount).toBe(0);
            expect(result.averageAmount).toBe(0);
            expect(result.averageFees).toBe(0);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.getStatistics())
                .toBeRejectedWithError(RepositoryError, '獲取交易統計資料失敗');
        });
    });

    describe('getAccountStatistics', () => {
        it('should calculate account transaction statistics correctly', async () => {
            // Arrange
            const accountId = 'acc_1';
            const accountTransactions = [mockTransaction];
            spyOn(repository, 'findByAccountId').and.returnValue(Promise.resolve(accountTransactions));

            // Act
            const result = await repository.getAccountStatistics(accountId);

            // Assert
            expect(result.totalCount).toBe(1);
            expect(result.totalAmount).toBe(1000);
            expect(result.averageAmount).toBe(1000);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const accountId = 'acc_1';
            const error = new Error('Database error');
            spyOn(repository, 'findByAccountId').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.getAccountStatistics(accountId))
                .toBeRejectedWithError(RepositoryError, '獲取帳戶交易統計資料失敗');
        });
    });

    describe('getUserStatistics', () => {
        it('should calculate user transaction statistics correctly', async () => {
            // Arrange
            const userId = 'user_1';
            const userTransactions = [mockTransaction];
            spyOn(repository, 'findByUserId').and.returnValue(Promise.resolve(userTransactions));

            // Act
            const result = await repository.getUserStatistics(userId);

            // Assert
            expect(result.totalCount).toBe(1);
            expect(result.totalAmount).toBe(1000);
            expect(result.averageAmount).toBe(1000);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const userId = 'user_1';
            const error = new Error('Database error');
            spyOn(repository, 'findByUserId').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.getUserStatistics(userId))
                .toBeRejectedWithError(RepositoryError, '獲取用戶交易統計資料失敗');
        });
    });

    describe('getTransactionHistoryReport', () => {
        it('should generate transaction history report correctly', async () => {
            // Arrange
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');
            const accountId = 'acc_1';

            const transaction1 = OptimizedTransaction.createDeposit(
                'TXN-001',
                accountId,
                'user_1',
                new Money(1000, 'USD'),
                'Deposit 1'
            );
            transaction1.complete();
            transaction1.category = '存款';

            const transaction2 = OptimizedTransaction.createWithdrawal(
                'TXN-002',
                accountId,
                'user_1',
                new Money(500, 'USD'),
                'Withdrawal 1'
            );
            transaction2.complete();
            transaction2.category = '提款';

            const transactions = [transaction1, transaction2];
            spyOn(repository, 'findAll').and.returnValue(Promise.resolve(transactions));

            // Act
            const result = await repository.getTransactionHistoryReport(startDate, endDate, accountId);

            // Assert
            expect(result.totalTransactions).toBe(2);
            expect(result.totalAmount).toBe(1500);
            expect(result.successRate).toBe(100);
            expect(result.averageAmount).toBe(750);
            expect(result.topCategories.length).toBeGreaterThan(0);
            expect(result.dailyBreakdown.length).toBeGreaterThan(0);
        });

        it('should throw RepositoryError on failure', async () => {
            // Arrange
            const startDate = new Date('2024-01-01');
            const endDate = new Date('2024-12-31');
            const error = new Error('Database error');
            spyOn(repository, 'findAll').and.throwError(error);

            // Act & Assert
            await expectAsync(repository.getTransactionHistoryReport(startDate, endDate))
                .toBeRejectedWithError(RepositoryError, '獲取交易歷史報表失敗');
        });
    });

    describe('fromFirestore', () => {
        it('should convert Firestore document to OptimizedTransaction', () => {
            // Arrange
            const firestoreData = {
                transactionNumber: 'TXN-TEST-001',
                accountId: 'acc_1',
                userId: 'user_1',
                amount: 1000,
                currency: 'USD',
                transactionType: TransactionType.DEPOSIT,
                status: TransactionStatus.COMPLETED,
                description: '測試存款',
                referenceNumber: 'REF001',
                category: '存款',
                fees: 5,
                notes: '測試備註',
                createdAt: { toDate: () => new Date('2024-01-01') },
                updatedAt: { toDate: () => new Date('2024-01-01') }
            };
            const id = 'txn_1';

            // Act
            const result = (repository as any).fromFirestore(firestoreData, id);

            // Assert
            expect(result).toBeInstanceOf(OptimizedTransaction);
            expect(result.id).toBe(id);
            expect(result.transactionNumber).toBe('TXN-TEST-001');
            expect(result.accountId).toBe('acc_1');
            expect(result.userId).toBe('user_1');
            expect(result.amount.getAmount()).toBe(1000);
            expect(result.amount.getCurrency()).toBe('USD');
            expect(result.transactionType).toBe(TransactionType.DEPOSIT);
            expect(result.status).toBe(TransactionStatus.COMPLETED);
            expect(result.description).toBe('測試存款');
            expect(result.referenceNumber).toBe('REF001');
            expect(result.category).toBe('存款');
            expect(result.fees?.getAmount()).toBe(5);
            expect(result.notes).toBe('測試備註');
        });

        it('should handle missing optional fields', () => {
            // Arrange
            const firestoreData = {
                transactionNumber: 'TXN-TEST-001',
                accountId: 'acc_1',
                userId: 'user_1',
                transactionType: TransactionType.DEPOSIT,
                status: TransactionStatus.PENDING,
                description: '測試存款'
            };
            const id = 'txn_1';

            // Act
            const result = (repository as any).fromFirestore(firestoreData, id);

            // Assert
            expect(result).toBeInstanceOf(OptimizedTransaction);
            expect(result.amount.getAmount()).toBe(0);
            expect(result.amount.getCurrency()).toBe('USD');
            expect(result.referenceNumber).toBeUndefined();
            expect(result.category).toBeUndefined();
            expect(result.fees).toBeUndefined();
            expect(result.notes).toBeUndefined();
        });
    });

    describe('toFirestore', () => {
        it('should convert OptimizedTransaction to Firestore document', () => {
            // Arrange
            mockTransaction.referenceNumber = 'REF001';
            mockTransaction.category = '存款';
            mockTransaction.addFees(new Money(5, 'USD'));
            mockTransaction.notes = '測試備註';

            // Act
            const result = (repository as any).toFirestore(mockTransaction);

            // Assert
            expect(result).toEqual({
                transactionNumber: mockTransaction.transactionNumber,
                accountId: mockTransaction.accountId,
                userId: mockTransaction.userId,
                amount: mockTransaction.amount.getAmount(),
                currency: mockTransaction.amount.getCurrency(),
                transactionType: mockTransaction.transactionType,
                status: mockTransaction.status,
                description: mockTransaction.description,
                referenceNumber: mockTransaction.referenceNumber,
                category: mockTransaction.category,
                fees: mockTransaction.fees?.getAmount(),
                notes: mockTransaction.notes,
                createdAt: mockTransaction.createdAt,
                updatedAt: mockTransaction.updatedAt
            });
        });
    });
});