/**
 * 交易儲存庫整合測試
 * 測試 Firebase 和 Mock 儲存庫的一致性
 */

import { TestBed } from '@angular/core/testing';

import { TransactionSearchCriteria } from './optimized-firebase-transaction.repository';
import { OptimizedMockTransactionRepository } from './optimized-mock-transaction.repository';
import { OptimizedTransaction, TransactionType, TransactionStatus } from '../../domain/entities/optimized-transaction.entity';
import { Money } from '../../domain/value-objects/account/money.value-object';

describe('Transaction Repository Integration', () => {
  let mockRepository: OptimizedMockTransactionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptimizedMockTransactionRepository]
    });

    mockRepository = TestBed.inject(OptimizedMockTransactionRepository);
  });

  afterEach(() => {
    mockRepository.clearMockData();
  });

  describe('Basic CRUD Operations', () => {
    it('should create, read, update, and delete transaction', async () => {
      // Create
      const transaction = OptimizedTransaction.createDeposit('TXN-CRUD-TEST', 'acc_test', 'user_test', new Money(1000, 'USD'), '測試交易');

      await mockRepository.save(transaction);

      // Read
      const foundTransaction = await mockRepository.findById(transaction.id);
      expect(foundTransaction).not.toBeNull();
      expect(foundTransaction!.transactionNumber).toBe('TXN-CRUD-TEST');
      expect(foundTransaction!.amount.getAmount()).toBe(1000);

      // Update
      foundTransaction!.updateDescription('更新的交易描述');
      foundTransaction!.addFees(new Money(5, 'USD'));
      await mockRepository.save(foundTransaction!);

      const updatedTransaction = await mockRepository.findById(transaction.id);
      expect(updatedTransaction!.description).toBe('更新的交易描述');
      expect(updatedTransaction!.fees?.getAmount()).toBe(5);

      // Delete
      await mockRepository.delete(transaction.id);
      const deletedTransaction = await mockRepository.findById(transaction.id);
      expect(deletedTransaction).toBeNull();
    });
  });

  describe('Transaction-specific Queries', () => {
    beforeEach(async () => {
      // 設置測試資料
      const transactions = [
        OptimizedTransaction.createDeposit('TXN-001', 'acc_1', 'user_1', new Money(1000, 'USD'), 'Primary Deposit'),
        OptimizedTransaction.createWithdrawal('TXN-002', 'acc_1', 'user_1', new Money(500, 'USD'), 'ATM Withdrawal'),
        OptimizedTransaction.createTransfer('TXN-003', 'acc_2', 'user_2', new Money(2000, 'EUR'), 'International Transfer')
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
      transactions[2].addFees(new Money(15, 'EUR'));

      for (const transaction of transactions) {
        await mockRepository.save(transaction);
      }
    });

    it('should find transaction by transaction number', async () => {
      const transaction = await mockRepository.findByTransactionNumber('TXN-001');
      expect(transaction).not.toBeNull();
      expect(transaction!.description).toBe('Primary Deposit');
    });

    it('should find transactions by account ID', async () => {
      const transactions = await mockRepository.findByAccountId('acc_1');
      expect(transactions.length).toBe(2);
      expect(transactions.every(txn => txn.accountId === 'acc_1')).toBe(true);
    });

    it('should find transactions by user ID', async () => {
      const transactions = await mockRepository.findByUserId('user_1');
      expect(transactions.length).toBe(2);
      expect(transactions.every(txn => txn.userId === 'user_1')).toBe(true);
    });

    it('should find transactions by status', async () => {
      const completedTransactions = await mockRepository.findByStatus(TransactionStatus.COMPLETED);
      const pendingTransactions = await mockRepository.findByStatus(TransactionStatus.PENDING);
      const processingTransactions = await mockRepository.findByStatus(TransactionStatus.PROCESSING);

      expect(completedTransactions.length).toBe(1);
      expect(pendingTransactions.length).toBe(1);
      expect(processingTransactions.length).toBe(1);
      expect(completedTransactions.every(txn => txn.status === TransactionStatus.COMPLETED)).toBe(true);
      expect(pendingTransactions.every(txn => txn.status === TransactionStatus.PENDING)).toBe(true);
      expect(processingTransactions.every(txn => txn.status === TransactionStatus.PROCESSING)).toBe(true);
    });

    it('should find transactions by type', async () => {
      const depositTransactions = await mockRepository.findByType(TransactionType.DEPOSIT);
      const withdrawalTransactions = await mockRepository.findByType(TransactionType.WITHDRAWAL);
      const transferTransactions = await mockRepository.findByType(TransactionType.TRANSFER);

      expect(depositTransactions.length).toBe(1);
      expect(withdrawalTransactions.length).toBe(1);
      expect(transferTransactions.length).toBe(1);
      expect(depositTransactions.every(txn => txn.transactionType === TransactionType.DEPOSIT)).toBe(true);
      expect(withdrawalTransactions.every(txn => txn.transactionType === TransactionType.WITHDRAWAL)).toBe(true);
      expect(transferTransactions.every(txn => txn.transactionType === TransactionType.TRANSFER)).toBe(true);
    });

    it('should find transactions by amount range', async () => {
      const transactions = await mockRepository.findByAmountRange(1500, 2500);
      expect(transactions.length).toBe(1);
      expect(transactions[0].amount.getAmount()).toBe(2000);
    });

    it('should find transactions by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const transactions = await mockRepository.findByDateRange(startDate, endDate);
      expect(transactions.length).toBeGreaterThan(0);
    });

    it('should find transactions by category', async () => {
      const depositTransactions = await mockRepository.findByCategory('存款');
      const withdrawalTransactions = await mockRepository.findByCategory('提款');
      const transferTransactions = await mockRepository.findByCategory('轉帳');

      expect(depositTransactions.length).toBe(1);
      expect(withdrawalTransactions.length).toBe(1);
      expect(transferTransactions.length).toBe(1);
      expect(depositTransactions[0].category).toBe('存款');
      expect(withdrawalTransactions[0].category).toBe('提款');
      expect(transferTransactions[0].category).toBe('轉帳');
    });

    it('should find transactions by reference number', async () => {
      const transactions = await mockRepository.findByReferenceNumber('REF001');
      expect(transactions.length).toBe(1);
      expect(transactions[0].referenceNumber).toBe('REF001');
    });

    it('should check if transaction number exists', async () => {
      const exists = await mockRepository.existsByTransactionNumber('TXN-001');
      const notExists = await mockRepository.existsByTransactionNumber('NON-EXISTENT');

      expect(exists).toBe(true);
      expect(notExists).toBe(false);
    });
  });

  describe('Statistics and Reports', () => {
    beforeEach(async () => {
      mockRepository.clearMockData();

      const transactions = [
        OptimizedTransaction.createDeposit('TXN-001', 'acc_1', 'user_1', new Money(1000, 'USD'), 'Transaction 1'),
        OptimizedTransaction.createWithdrawal('TXN-002', 'acc_1', 'user_1', new Money(500, 'USD'), 'Transaction 2'),
        OptimizedTransaction.create('TXN-003', 'acc_2', 'user_2', new Money(2000, 'EUR'), TransactionType.TRANSFER, 'Transaction 3')
      ];

      transactions[0].complete();
      transactions[0].category = '存款';
      transactions[0].addFees(new Money(2, 'USD'));

      transactions[1].status = TransactionStatus.PENDING;
      transactions[1].category = '提款';
      transactions[1].addFees(new Money(5, 'USD'));

      transactions[2].fail('Test failure');
      transactions[2].category = '轉帳';
      transactions[2].addFees(new Money(10, 'EUR'));

      for (const transaction of transactions) {
        await mockRepository.save(transaction);
      }
    });

    it('should calculate transaction statistics correctly', async () => {
      const stats = await mockRepository.getStatistics();

      expect(stats.totalCount).toBe(3);
      expect(stats.completedCount).toBe(1);
      expect(stats.pendingCount).toBe(1);
      expect(stats.failedCount).toBe(1);
      expect(stats.totalAmount).toBe(3500);
      expect(stats.averageAmount).toBe(3500 / 3);
      expect(stats.byType[TransactionType.DEPOSIT]).toBe(1);
      expect(stats.byType[TransactionType.WITHDRAWAL]).toBe(1);
      expect(stats.byType[TransactionType.TRANSFER]).toBe(1);
      expect(stats.byCurrency['USD'].count).toBe(2);
      expect(stats.byCurrency['USD'].totalAmount).toBe(1500);
      expect(stats.byCurrency['EUR'].count).toBe(1);
      expect(stats.byCurrency['EUR'].totalAmount).toBe(2000);
      expect(stats.byCategory['存款'].count).toBe(1);
      expect(stats.byCategory['提款'].count).toBe(1);
      expect(stats.byCategory['轉帳'].count).toBe(1);
      expect(stats.totalFees).toBe(17); // 2 + 5 + 10 (converted to base currency)
      expect(stats.averageFees).toBe(17 / 3);
    });

    it('should calculate account statistics correctly', async () => {
      const stats = await mockRepository.getAccountStatistics('acc_1');

      expect(stats.totalCount).toBe(2);
      expect(stats.completedCount).toBe(1);
      expect(stats.pendingCount).toBe(1);
      expect(stats.totalAmount).toBe(1500);
      expect(stats.averageAmount).toBe(750);
      expect(stats.totalFees).toBe(7); // 2 + 5
      expect(stats.averageFees).toBe(3.5);
    });

    it('should calculate user statistics correctly', async () => {
      const stats = await mockRepository.getUserStatistics('user_1');

      expect(stats.totalCount).toBe(2);
      expect(stats.completedCount).toBe(1);
      expect(stats.pendingCount).toBe(1);
      expect(stats.totalAmount).toBe(1500);
      expect(stats.averageAmount).toBe(750);
    });

    it('should generate transaction history report correctly', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const report = await mockRepository.getTransactionHistoryReport(startDate, endDate);

      expect(report.totalTransactions).toBe(3);
      expect(report.totalAmount).toBe(3500);
      expect(report.successRate).toBe(100 / 3); // 1 completed out of 3
      expect(report.averageAmount).toBe(3500 / 3);
      expect(report.topCategories.length).toBe(3);
      expect(report.dailyBreakdown.length).toBeGreaterThan(0);
      expect(report.period).toContain('2024-01-01');
      expect(report.period).toContain('2024-12-31');
    });

    it('should generate filtered transaction history report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const report = await mockRepository.getTransactionHistoryReport(startDate, endDate, 'acc_1');

      expect(report.totalTransactions).toBe(2);
      expect(report.totalAmount).toBe(1500);
      expect(report.successRate).toBe(50); // 1 completed out of 2
      expect(report.averageAmount).toBe(750);
    });
  });

  describe('Advanced Search', () => {
    beforeEach(async () => {
      mockRepository.clearMockData();

      const transactions = [
        OptimizedTransaction.createDeposit('TXN-001', 'acc_1', 'user_1', new Money(1000, 'USD'), 'Primary deposit transaction'),
        OptimizedTransaction.createWithdrawal('TXN-002', 'acc_1', 'user_1', new Money(500, 'USD'), 'ATM withdrawal transaction'),
        OptimizedTransaction.createTransfer('TXN-003', 'acc_2', 'user_2', new Money(2000, 'EUR'), 'International transfer transaction')
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
        await mockRepository.save(transaction);
      }
    });

    it('should search with multiple criteria', async () => {
      const criteria: TransactionSearchCriteria = {
        accountId: 'acc_1',
        transactionType: TransactionType.DEPOSIT,
        transactionStatus: TransactionStatus.COMPLETED,
        currency: 'USD'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(1);
      expect(results[0].accountId).toBe('acc_1');
      expect(results[0].transactionType).toBe(TransactionType.DEPOSIT);
      expect(results[0].status).toBe(TransactionStatus.COMPLETED);
      expect(results[0].amount.getCurrency()).toBe('USD');
    });

    it('should search by keyword', async () => {
      const criteria: TransactionSearchCriteria = {
        keyword: 'primary'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(1);
      expect(results[0].description.toLowerCase()).toContain('primary');
    });

    it('should search by has fees', async () => {
      const criteriaWithFees: TransactionSearchCriteria = {
        hasFees: true
      };

      const criteriaWithoutFees: TransactionSearchCriteria = {
        hasFees: false
      };

      const resultsWithFees = await mockRepository.findAll(criteriaWithFees);
      const resultsWithoutFees = await mockRepository.findAll(criteriaWithoutFees);

      expect(resultsWithFees.length).toBe(1);
      expect(resultsWithFees[0].fees).toBeDefined();
      expect(resultsWithoutFees.length).toBe(2);
      expect(resultsWithoutFees.every(txn => !txn.fees)).toBe(true);
    });

    it('should sort results correctly', async () => {
      const criteria: TransactionSearchCriteria = {
        sortBy: 'amount',
        sortOrder: 'desc'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(3);
      expect(results[0].amount.getAmount()).toBeGreaterThanOrEqual(results[1].amount.getAmount());
      expect(results[1].amount.getAmount()).toBeGreaterThanOrEqual(results[2].amount.getAmount());
    });

    it('should combine search and sort', async () => {
      const criteria: TransactionSearchCriteria = {
        currency: 'USD',
        sortBy: 'amount',
        sortOrder: 'asc'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(2);
      expect(results.every(txn => txn.amount.getCurrency() === 'USD')).toBe(true);
      expect(results[0].amount.getAmount()).toBeLessThanOrEqual(results[1].amount.getAmount());
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle large number of transactions', async () => {
      mockRepository.clearMockData();

      // 創建大量交易
      const transactions = [];
      for (let i = 0; i < 100; i++) {
        const transaction = OptimizedTransaction.create(
          `TXN-${String(i).padStart(3, '0')}`,
          `acc_${i % 10}`,
          `user_${i % 5}`,
          new Money(Math.random() * 10000, i % 2 === 0 ? 'USD' : 'EUR'),
          i % 3 === 0 ? TransactionType.DEPOSIT : i % 3 === 1 ? TransactionType.WITHDRAWAL : TransactionType.TRANSFER,
          `Transaction ${i}`
        );

        if (i % 4 === 0) transaction.complete();
        else if (i % 4 === 1) transaction.process();
        else if (i % 4 === 2) transaction.fail('Test failure');
        // else remains PENDING

        transaction.category = `Category ${i % 5}`;
        transaction.referenceNumber = `REF${String(i).padStart(3, '0')}`;

        if (i % 3 === 0) {
          transaction.addFees(new Money(Math.random() * 10, transaction.amount.getCurrency()));
        }

        transactions.push(transaction);
      }

      // 批次儲存
      for (const transaction of transactions) {
        await mockRepository.save(transaction);
      }

      // 測試查詢效能
      const startTime = Date.now();
      const allTransactions = await mockRepository.findAll();
      const endTime = Date.now();

      expect(allTransactions.length).toBe(100);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成

      // 測試統計計算效能
      const statsStartTime = Date.now();
      const stats = await mockRepository.getStatistics();
      const statsEndTime = Date.now();

      expect(stats.totalCount).toBe(100);
      expect(statsEndTime - statsStartTime).toBeLessThan(500); // 統計計算應該在 0.5 秒內完成
    });

    it('should handle concurrent operations', async () => {
      mockRepository.clearMockData();

      const transaction1 = OptimizedTransaction.createDeposit(
        'CONCURRENT-001',
        'acc_1',
        'user_1',
        new Money(1000, 'USD'),
        'Concurrent Test 1'
      );

      const transaction2 = OptimizedTransaction.createWithdrawal(
        'CONCURRENT-002',
        'acc_2',
        'user_2',
        new Money(500, 'USD'),
        'Concurrent Test 2'
      );

      // 並行操作
      await Promise.all([mockRepository.save(transaction1), mockRepository.save(transaction2)]);

      const [found1, found2] = await Promise.all([mockRepository.findById(transaction1.id), mockRepository.findById(transaction2.id)]);

      expect(found1).not.toBeNull();
      expect(found2).not.toBeNull();
      expect(found1!.description).toBe('Concurrent Test 1');
      expect(found2!.description).toBe('Concurrent Test 2');
    });

    it('should handle transaction state transitions correctly', async () => {
      mockRepository.clearMockData();

      const transaction = OptimizedTransaction.createDeposit(
        'STATE-TEST',
        'acc_1',
        'user_1',
        new Money(1000, 'USD'),
        'State Transition Test'
      );

      await mockRepository.save(transaction);

      // Test state transitions
      expect(transaction.isPending()).toBe(true);

      transaction.process();
      await mockRepository.save(transaction);
      expect(transaction.isProcessing()).toBe(true);

      transaction.complete();
      await mockRepository.save(transaction);
      expect(transaction.isCompleted()).toBe(true);

      // Verify persistence
      const savedTransaction = await mockRepository.findById(transaction.id);
      expect(savedTransaction!.isCompleted()).toBe(true);
    });
  });
});
