/**
 * 優化的 Mock 帳戶儲存庫測試
 */

import { TestBed } from '@angular/core/testing';

import { AccountSearchCriteria } from './optimized-firebase-account.repository';
import { OptimizedMockAccountRepository } from './optimized-mock-account.repository';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';

describe('OptimizedMockAccountRepository', () => {
  let repository: OptimizedMockAccountRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OptimizedMockAccountRepository]
    });

    repository = TestBed.inject(OptimizedMockAccountRepository);
  });

  afterEach(() => {
    // 清理測試資料
    repository.clearMockData();
  });

  describe('initialization', () => {
    it('should initialize with mock data', async () => {
      // Act
      const allAccounts = await repository.findAll();

      // Assert
      expect(allAccounts.length).toBeGreaterThan(0);
      expect(allAccounts.every(account => account instanceof OptimizedAccount)).toBe(true);
    });

    it('should have accounts with different statuses', async () => {
      // Act
      const allAccounts = await repository.findAll();

      // Assert
      const statuses = allAccounts.map(account => account.status);
      expect(statuses).toContain(AccountStatus.ACTIVE);
      expect(statuses).toContain(AccountStatus.INACTIVE);
      expect(statuses).toContain(AccountStatus.SUSPENDED);
    });
  });

  describe('findByAccountNumber', () => {
    it('should find account by account number', async () => {
      // Arrange
      const testAccount = OptimizedAccount.create({
        userId: 'test_user',
        accountNumber: 'TEST-ACCOUNT-123',
        name: '測試帳戶',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      await repository.save(testAccount);

      // Act
      const result = await repository.findByAccountNumber('TEST-ACCOUNT-123');

      // Assert
      expect(result).not.toBeNull();
      expect(result!.accountNumber).toBe('TEST-ACCOUNT-123');
      expect(result!.name).toBe('測試帳戶');
    });

    it('should return null when account not found', async () => {
      // Act
      const result = await repository.findByAccountNumber('NON-EXISTENT');

      // Assert
      expect(result).toBeNull();
    });

    it('should simulate network delay', async () => {
      // Arrange
      const startTime = Date.now();

      // Act
      await repository.findByAccountNumber('ANY-NUMBER');

      // Assert
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });
  });

  describe('findByUserId', () => {
    it('should find accounts by user ID', async () => {
      // Arrange
      const userId = 'test_user';
      const account1 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-001',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      const account2 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-002',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });
      const otherUserAccount = OptimizedAccount.create({
        userId: 'other_user',
        accountNumber: 'ACC-003',
        name: 'Other Account',
        type: AccountType.CHECKING,
        initialBalance: 500
      });

      await repository.save(account1);
      await repository.save(account2);
      await repository.save(otherUserAccount);

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result.length).toBe(2);
      expect(result.every(account => account.userId === userId)).toBe(true);
      expect(result.map(account => account.accountNumber)).toContain('ACC-001');
      expect(result.map(account => account.accountNumber)).toContain('ACC-002');
    });

    it('should return accounts sorted by creation date descending', async () => {
      // Arrange
      const userId = 'test_user';
      const account1 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-001',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      // 稍微延遲以確保不同的創建時間
      await new Promise(resolve => setTimeout(resolve, 10));

      const account2 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-002',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });

      await repository.save(account1);
      await repository.save(account2);

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].createdAt.getTime()).toBeGreaterThanOrEqual(result[1].createdAt.getTime());
    });

    it('should return empty array when no accounts found', async () => {
      // Act
      const result = await repository.findByUserId('nonexistent_user');

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByStatus', () => {
    it('should find accounts by status', async () => {
      // Arrange
      const activeAccount = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-ACTIVE',
        name: 'Active Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const inactiveAccount = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-INACTIVE',
        name: 'Inactive Account',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });
      inactiveAccount.deactivate();

      await repository.save(activeAccount);
      await repository.save(inactiveAccount);

      // Act
      const activeResults = await repository.findByStatus(AccountStatus.ACTIVE);
      const inactiveResults = await repository.findByStatus(AccountStatus.INACTIVE);

      // Assert
      expect(activeResults.some(acc => acc.accountNumber === 'ACC-ACTIVE')).toBe(true);
      expect(inactiveResults.some(acc => acc.accountNumber === 'ACC-INACTIVE')).toBe(true);
      expect(activeResults.every(acc => acc.status === AccountStatus.ACTIVE)).toBe(true);
      expect(inactiveResults.every(acc => acc.status === AccountStatus.INACTIVE)).toBe(true);
    });
  });

  describe('findByType', () => {
    it('should find accounts by type', async () => {
      // Arrange
      const checkingAccount = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-CHECKING',
        name: 'Checking Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const savingsAccount = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-SAVINGS',
        name: 'Savings Account',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });

      await repository.save(checkingAccount);
      await repository.save(savingsAccount);

      // Act
      const checkingResults = await repository.findByType(AccountType.CHECKING);
      const savingsResults = await repository.findByType(AccountType.SAVINGS);

      // Assert
      expect(checkingResults.some(acc => acc.accountNumber === 'ACC-CHECKING')).toBe(true);
      expect(savingsResults.some(acc => acc.accountNumber === 'ACC-SAVINGS')).toBe(true);
      expect(checkingResults.every(acc => acc.type === AccountType.CHECKING)).toBe(true);
      expect(savingsResults.every(acc => acc.type === AccountType.SAVINGS)).toBe(true);
    });
  });

  describe('findByBalanceRange', () => {
    it('should find accounts within balance range', async () => {
      // Arrange
      const lowBalanceAccount = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-LOW',
        name: 'Low Balance Account',
        type: AccountType.CHECKING,
        initialBalance: 500
      });

      const midBalanceAccount = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-MID',
        name: 'Mid Balance Account',
        type: AccountType.SAVINGS,
        initialBalance: 1500
      });

      const highBalanceAccount = OptimizedAccount.create({
        userId: 'user3',
        accountNumber: 'ACC-HIGH',
        name: 'High Balance Account',
        type: AccountType.SAVINGS,
        initialBalance: 5000
      });

      await repository.save(lowBalanceAccount);
      await repository.save(midBalanceAccount);
      await repository.save(highBalanceAccount);

      // Act
      const result = await repository.findByBalanceRange(1000, 2000);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].accountNumber).toBe('ACC-MID');
      expect(result[0].getBalanceAmount()).toBe(1500);
    });

    it('should return accounts sorted by balance descending', async () => {
      // Arrange
      const account1 = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-1',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const account2 = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-2',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });

      await repository.save(account1);
      await repository.save(account2);

      // Act
      const result = await repository.findByBalanceRange(500, 2500);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].getBalanceAmount()).toBeGreaterThanOrEqual(result[1].getBalanceAmount());
    });
  });

  describe('findByCurrency', () => {
    it('should find accounts by currency', async () => {
      // Arrange
      const usdAccount = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-USD',
        name: 'USD Account',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      const eurAccount = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-EUR',
        name: 'EUR Account',
        type: AccountType.SAVINGS,
        initialBalance: 2000,
        currency: 'EUR'
      });

      await repository.save(usdAccount);
      await repository.save(eurAccount);

      // Act
      const usdResults = await repository.findByCurrency('USD');
      const eurResults = await repository.findByCurrency('EUR');

      // Assert
      expect(usdResults.some(acc => acc.accountNumber === 'ACC-USD')).toBe(true);
      expect(eurResults.some(acc => acc.accountNumber === 'ACC-EUR')).toBe(true);
      expect(usdResults.every(acc => acc.getCurrency() === 'USD')).toBe(true);
      expect(eurResults.every(acc => acc.getCurrency() === 'EUR')).toBe(true);
    });
  });

  describe('existsByAccountNumber', () => {
    it('should return true when account exists', async () => {
      // Arrange
      const testAccount = OptimizedAccount.create({
        userId: 'test_user',
        accountNumber: 'EXISTING-ACCOUNT',
        name: '存在的帳戶',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      await repository.save(testAccount);

      // Act
      const result = await repository.existsByAccountNumber('EXISTING-ACCOUNT');

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when account does not exist', async () => {
      // Act
      const result = await repository.existsByAccountNumber('NON-EXISTENT-ACCOUNT');

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics correctly', async () => {
      // Arrange
      repository.clearMockData();

      const account1 = OptimizedAccount.create({
        userId: 'user1',
        accountNumber: 'ACC-1',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      const account2 = OptimizedAccount.create({
        userId: 'user2',
        accountNumber: 'ACC-2',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000,
        currency: 'USD'
      });
      account2.deactivate();

      const account3 = OptimizedAccount.create({
        userId: 'user3',
        accountNumber: 'ACC-3',
        name: 'Account 3',
        type: AccountType.CREDIT,
        initialBalance: -500,
        currency: 'EUR'
      });

      await repository.save(account1);
      await repository.save(account2);
      await repository.save(account3);

      // Act
      const result = await repository.getStatistics();

      // Assert
      expect(result.total).toBe(3);
      expect(result.active).toBe(2);
      expect(result.inactive).toBe(1);
      expect(result.suspended).toBe(0);
      expect(result.closed).toBe(0);
      expect(result.totalBalance).toBe(2500);
      expect(result.averageBalance).toBe(2500 / 3);
      expect(result.byType[AccountType.CHECKING]).toBe(1);
      expect(result.byType[AccountType.SAVINGS]).toBe(1);
      expect(result.byType[AccountType.CREDIT]).toBe(1);
      expect(result.byCurrency['USD'].count).toBe(2);
      expect(result.byCurrency['USD'].totalBalance).toBe(3000);
      expect(result.byCurrency['EUR'].count).toBe(1);
      expect(result.byCurrency['EUR'].totalBalance).toBe(-500);
    });

    it('should handle empty repository', async () => {
      // Arrange
      repository.clearMockData();

      // Act
      const result = await repository.getStatistics();

      // Assert
      expect(result.total).toBe(0);
      expect(result.totalBalance).toBe(0);
      expect(result.averageBalance).toBe(0);
    });
  });

  describe('getUserAccountSummary', () => {
    it('should calculate user account summary correctly', async () => {
      // Arrange
      const userId = 'test_user';
      const account1 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-1',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      const account2 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-2',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000,
        currency: 'EUR'
      });
      account2.deactivate();

      await repository.save(account1);
      await repository.save(account2);

      // Act
      const result = await repository.getUserAccountSummary(userId);

      // Assert
      expect(result.totalAccounts).toBe(2);
      expect(result.activeAccounts).toBe(1);
      expect(result.totalBalance).toBe(3000);
      expect(result.balanceByCurrency['USD']).toBe(1000);
      expect(result.balanceByCurrency['EUR']).toBe(2000);
      expect(result.accountsByType[AccountType.CHECKING]).toBe(1);
      expect(result.accountsByType[AccountType.SAVINGS]).toBe(1);
      expect(result.accountsByType[AccountType.CREDIT]).toBe(0);
    });

    it('should handle user with no accounts', async () => {
      // Act
      const result = await repository.getUserAccountSummary('nonexistent_user');

      // Assert
      expect(result.totalAccounts).toBe(0);
      expect(result.activeAccounts).toBe(0);
      expect(result.totalBalance).toBe(0);
      expect(Object.keys(result.balanceByCurrency)).toEqual([]);
    });
  });

  describe('search criteria filtering', () => {
    beforeEach(async () => {
      // 清理並設置測試資料
      repository.clearMockData();

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

      accounts[1].deactivate(); // 停用儲蓄帳戶

      for (const account of accounts) {
        await repository.save(account);
      }
    });

    it('should filter by keyword', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        keyword: 'primary'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Primary Checking');
    });

    it('should filter by user ID', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        userId: 'user1'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(2);
      expect(result.every(acc => acc.userId === 'user1')).toBe(true);
    });

    it('should filter by account type', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        accountType: AccountType.CHECKING
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(2);
      expect(result.every(acc => acc.type === AccountType.CHECKING)).toBe(true);
    });

    it('should filter by account status', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        accountStatus: AccountStatus.INACTIVE
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].status).toBe(AccountStatus.INACTIVE);
    });

    it('should filter by currency', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        currency: 'EUR'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].getCurrency()).toBe('EUR');
    });

    it('should filter by balance range', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        minBalance: 1500,
        maxBalance: 3000
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].getBalanceAmount()).toBe(2000);
    });

    it('should combine multiple filters', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        userId: 'user1',
        accountType: AccountType.CHECKING,
        minBalance: 500
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].userId).toBe('user1');
      expect(result[0].type).toBe(AccountType.CHECKING);
      expect(result[0].getBalanceAmount()).toBeGreaterThanOrEqual(500);
    });
  });

  describe('sorting', () => {
    beforeEach(async () => {
      repository.clearMockData();

      const accounts = [
        OptimizedAccount.create({
          userId: 'user1',
          accountNumber: 'ACC-001',
          name: 'Account A',
          type: AccountType.CHECKING,
          initialBalance: 1000
        }),
        OptimizedAccount.create({
          userId: 'user2',
          accountNumber: 'ACC-002',
          name: 'Account B',
          type: AccountType.SAVINGS,
          initialBalance: 3000
        }),
        OptimizedAccount.create({
          userId: 'user3',
          accountNumber: 'ACC-003',
          name: 'Account C',
          type: AccountType.CREDIT,
          initialBalance: 2000
        })
      ];

      for (const account of accounts) {
        await repository.save(account);
      }
    });

    it('should sort by balance ascending', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        sortBy: 'balance',
        sortOrder: 'asc'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(3);
      expect(result[0].getBalanceAmount()).toBe(1000);
      expect(result[1].getBalanceAmount()).toBe(2000);
      expect(result[2].getBalanceAmount()).toBe(3000);
    });

    it('should sort by balance descending', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        sortBy: 'balance',
        sortOrder: 'desc'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(3);
      expect(result[0].getBalanceAmount()).toBe(3000);
      expect(result[1].getBalanceAmount()).toBe(2000);
      expect(result[2].getBalanceAmount()).toBe(1000);
    });

    it('should sort by name', async () => {
      // Arrange
      const criteria: AccountSearchCriteria = {
        sortBy: 'name',
        sortOrder: 'asc'
      };

      // Act
      const result = await repository.findAll(criteria);

      // Assert
      expect(result.length).toBe(3);
      expect(result[0].name).toBe('Account A');
      expect(result[1].name).toBe('Account B');
      expect(result[2].name).toBe('Account C');
    });
  });
});
