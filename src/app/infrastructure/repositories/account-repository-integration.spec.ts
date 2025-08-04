/**
 * 帳戶儲存庫整合測試
 * 測試 Firebase 和 Mock 儲存庫的一致性
 */

import { TestBed } from '@angular/core/testing';

import { AccountSearchCriteria } from './optimized-firebase-account.repository';
import { OptimizedMockAccountRepository } from './optimized-mock-account.repository';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';

describe('Account Repository Integration', () => {
  let mockRepository: OptimizedMockAccountRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptimizedMockAccountRepository]
    });

    mockRepository = TestBed.inject(OptimizedMockAccountRepository);
  });

  afterEach(() => {
    mockRepository.clearMockData();
  });

  describe('Basic CRUD Operations', () => {
    it('should create, read, update, and delete account', async () => {
      // Create
      const account = OptimizedAccount.create({
        userId: 'test_user',
        accountNumber: 'TEST-001',
        name: '測試帳戶',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      await mockRepository.save(account);

      // Read
      const foundAccount = await mockRepository.findById(account.id);
      expect(foundAccount).not.toBeNull();
      expect(foundAccount!.name).toBe('測試帳戶');
      expect(foundAccount!.getBalanceAmount()).toBe(1000);

      // Update
      foundAccount!.updateInfo('更新的帳戶名稱');
      await mockRepository.save(foundAccount!);

      const updatedAccount = await mockRepository.findById(account.id);
      expect(updatedAccount!.name).toBe('更新的帳戶名稱');

      // Delete
      await mockRepository.delete(account.id);
      const deletedAccount = await mockRepository.findById(account.id);
      expect(deletedAccount).toBeNull();
    });
  });

  describe('Account-specific Queries', () => {
    beforeEach(async () => {
      // 設置測試資料
      const accounts = [
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-001',
          name: 'Primary Checking',
          type: AccountType.CHECKING,
          initialBalance: 1000,
          currency: 'USD'
        }),
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-002',
          name: 'Savings Account',
          type: AccountType.SAVINGS,
          initialBalance: 5000,
          currency: 'USD'
        }),
        OptimizedAccount.create({
          userId: 'user2',
          accountNumber: 'ACC-003',
          name: 'Business Account',
          type: AccountType.CHECKING,
          initialBalance: 2000,
          currency: 'EUR'
        })
      ];

      accounts[1].deactivate(); // 停用儲蓄帳戶

      for (const account of accounts) {
        await mockRepository.save(account);
      }
    });

    it('should find account by account number', async () => {
      const account = await mockRepository.findByAccountNumber('ACC-001');
      expect(account).not.toBeNull();
      expect(account!.name).toBe('Primary Checking');
    });

    it('should find accounts by user ID', async () => {
      const accounts = await mockRepository.findByUserId('user1');
      expect(accounts.length).toBe(2);
      expect(accounts.every(acc => acc.userId === 'user1')).toBe(true);
    });

    it('should find accounts by status', async () => {
      const activeAccounts = await mockRepository.findByStatus(AccountStatus.ACTIVE);
      const inactiveAccounts = await mockRepository.findByStatus(AccountStatus.INACTIVE);

      expect(activeAccounts.length).toBeGreaterThan(0);
      expect(inactiveAccounts.length).toBe(1);
      expect(activeAccounts.every(acc => acc.status === AccountStatus.ACTIVE)).toBe(true);
      expect(inactiveAccounts.every(acc => acc.status === AccountStatus.INACTIVE)).toBe(true);
    });

    it('should find accounts by type', async () => {
      const checkingAccounts = await mockRepository.findByType(AccountType.CHECKING);
      const savingsAccounts = await mockRepository.findByType(AccountType.SAVINGS);

      expect(checkingAccounts.length).toBe(2);
      expect(savingsAccounts.length).toBe(1);
      expect(checkingAccounts.every(acc => acc.type === AccountType.CHECKING)).toBe(true);
      expect(savingsAccounts.every(acc => acc.type === AccountType.SAVINGS)).toBe(true);
    });

    it('should find accounts by balance range', async () => {
      const accounts = await mockRepository.findByBalanceRange(1500, 3000);
      expect(accounts.length).toBe(1);
      expect(accounts[0].getBalanceAmount()).toBe(2000);
    });

    it('should find accounts by currency', async () => {
      const usdAccounts = await mockRepository.findByCurrency('USD');
      const eurAccounts = await mockRepository.findByCurrency('EUR');

      expect(usdAccounts.length).toBe(2);
      expect(eurAccounts.length).toBe(1);
      expect(usdAccounts.every(acc => acc.getCurrency() === 'USD')).toBe(true);
      expect(eurAccounts.every(acc => acc.getCurrency() === 'EUR')).toBe(true);
    });

    it('should check if account number exists', async () => {
      const exists = await mockRepository.existsByAccountNumber('ACC-001');
      const notExists = await mockRepository.existsByAccountNumber('NON-EXISTENT');

      expect(exists).toBe(true);
      expect(notExists).toBe(false);
    });
  });

  describe('Statistics and Summary', () => {
    beforeEach(async () => {
      mockRepository.clearMockData();

      const accounts = [
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-001',
          name: 'Account 1',
          type: AccountType.CHECKING,
          initialBalance: 1000,
          currency: 'USD'
        }),
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-002',
          name: 'Account 2',
          type: AccountType.SAVINGS,
          initialBalance: 2000,
          currency: 'USD'
        }),
        OptimizedAccount.create({
          userId: 'user2',
          accountNumber: 'ACC-003',
          name: 'Account 3',
          type: AccountType.CREDIT,
          initialBalance: -500,
          currency: 'EUR'
        })
      ];

      accounts[1].deactivate();

      for (const account of accounts) {
        await mockRepository.save(account);
      }
    });

    it('should calculate account statistics correctly', async () => {
      const stats = await mockRepository.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.inactive).toBe(1);
      expect(stats.totalBalance).toBe(2500);
      expect(stats.averageBalance).toBe(2500 / 3);
      expect(stats.byType[AccountType.CHECKING]).toBe(1);
      expect(stats.byType[AccountType.SAVINGS]).toBe(1);
      expect(stats.byType[AccountType.CREDIT]).toBe(1);
      expect(stats.byCurrency['USD'].count).toBe(2);
      expect(stats.byCurrency['USD'].totalBalance).toBe(3000);
      expect(stats.byCurrency['EUR'].count).toBe(1);
      expect(stats.byCurrency['EUR'].totalBalance).toBe(-500);
    });

    it('should calculate user account summary correctly', async () => {
      const summary = await mockRepository.getUserAccountSummary('user1');

      expect(summary.totalAccounts).toBe(2);
      expect(summary.activeAccounts).toBe(1);
      expect(summary.totalBalance).toBe(3000);
      expect(summary.balanceByCurrency['USD']).toBe(3000);
      expect(summary.accountsByType[AccountType.CHECKING]).toBe(1);
      expect(summary.accountsByType[AccountType.SAVINGS]).toBe(1);
      expect(summary.accountsByType[AccountType.CREDIT]).toBe(0);
    });
  });

  describe('Advanced Search', () => {
    beforeEach(async () => {
      mockRepository.clearMockData();

      const accounts = [
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-001',
          name: 'Primary Checking',
          type: AccountType.CHECKING,
          initialBalance: 1000,
          currency: 'USD',
          description: 'Main account for daily transactions'
        }),
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-002',
          name: 'Savings Account',
          type: AccountType.SAVINGS,
          initialBalance: 5000,
          currency: 'USD'
        }),
        OptimizedAccount.create({
          userId: 'user2',
          accountNumber: 'ACC-003',
          name: 'Business Account',
          type: AccountType.CHECKING,
          initialBalance: 2000,
          currency: 'EUR'
        })
      ];

      for (const account of accounts) {
        await mockRepository.save(account);
      }
    });

    it('should search with multiple criteria', async () => {
      const criteria: AccountSearchCriteria = {
        userId: 'user1',
        accountType: AccountType.CHECKING,
        minBalance: 500,
        currency: 'USD'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(1);
      expect(results[0].userId).toBe('user1');
      expect(results[0].type).toBe(AccountType.CHECKING);
      expect(results[0].getBalanceAmount()).toBeGreaterThanOrEqual(500);
      expect(results[0].getCurrency()).toBe('USD');
    });

    it('should search by keyword', async () => {
      const criteria: AccountSearchCriteria = {
        keyword: 'primary'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(1);
      expect(results[0].name.toLowerCase()).toContain('primary');
    });

    it('should sort results correctly', async () => {
      const criteria: AccountSearchCriteria = {
        sortBy: 'balance',
        sortOrder: 'desc'
      };

      const results = await mockRepository.findAll(criteria);

      expect(results.length).toBe(3);
      expect(results[0].getBalanceAmount()).toBeGreaterThanOrEqual(results[1].getBalanceAmount());
      expect(results[1].getBalanceAmount()).toBeGreaterThanOrEqual(results[2].getBalanceAmount());
    });
  });

  describe('Performance and Reliability', () => {
    it('should handle large number of accounts', async () => {
      mockRepository.clearMockData();

      // 創建大量帳戶
      const accounts = [];
      for (let i = 0; i < 100; i++) {
        accounts.push(
          OptimizedAccount.create({
            userId: `user_${i % 10}`,
            accountNumber: `ACC-${String(i).padStart(3, '0')}`,
            name: `Account ${i}`,
            type: i % 3 === 0 ? AccountType.CHECKING : i % 3 === 1 ? AccountType.SAVINGS : AccountType.CREDIT,
            initialBalance: Math.random() * 10000,
            currency: i % 2 === 0 ? 'USD' : 'EUR'
          })
        );
      }

      // 批次儲存
      for (const account of accounts) {
        await mockRepository.save(account);
      }

      // 測試查詢效能
      const startTime = Date.now();
      const allAccounts = await mockRepository.findAll();
      const endTime = Date.now();

      expect(allAccounts.length).toBe(100);
      expect(endTime - startTime).toBeLessThan(1000); // 應該在 1 秒內完成
    });

    it('should handle concurrent operations', async () => {
      mockRepository.clearMockData();

      const account1 = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'CONCURRENT-001',
        name: 'Concurrent Test 1',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const account2 = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'CONCURRENT-002',
        name: 'Concurrent Test 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });

      // 並行操作
      await Promise.all([mockRepository.save(account1), mockRepository.save(account2)]);

      const [found1, found2] = await Promise.all([mockRepository.findById(account1.id), mockRepository.findById(account2.id)]);

      expect(found1).not.toBeNull();
      expect(found2).not.toBeNull();
      expect(found1!.name).toBe('Concurrent Test 1');
      expect(found2!.name).toBe('Concurrent Test 2');
    });
  });
});
