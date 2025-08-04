/**
 * 優化的 Firebase 帳戶儲存庫測試
 */

import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { OptimizedFirebaseAccountRepository, AccountSearchCriteria } from './optimized-firebase-account.repository';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';
import { RepositoryError } from '../../domain/exceptions/repository.error';

describe('OptimizedFirebaseAccountRepository', () => {
  let repository: OptimizedFirebaseAccountRepository;
  let mockFirestore: jasmine.SpyObj<Firestore>;
  let mockAccount: OptimizedAccount;

  beforeEach(() => {
    // 創建 Firestore mock
    mockFirestore = jasmine.createSpyObj('Firestore', ['collection', 'doc']);

    TestBed.configureTestingModule({
      providers: [OptimizedFirebaseAccountRepository, { provide: Firestore, useValue: mockFirestore }]
    });

    repository = TestBed.inject(OptimizedFirebaseAccountRepository);

    // 創建測試用帳戶
    mockAccount = OptimizedAccount.create({
      userId: 'user_1',
      accountNumber: 'ACC-001001-TEST123',
      name: '測試帳戶',
      type: AccountType.CHECKING,
      initialBalance: 1000.0,
      currency: 'USD',
      description: '測試用帳戶'
    });
  });

  describe('findByAccountNumber', () => {
    it('should find account by account number', async () => {
      // Arrange
      const accountNumber = 'ACC-001001-TEST123';
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByAccountNumber(accountNumber);

      // Assert
      expect(result).toBe(mockAccount);
      expect(repository.findAll).toHaveBeenCalledWith({
        filters: { accountNumber }
      });
    });

    it('should return null when account not found', async () => {
      // Arrange
      const accountNumber = 'NON-EXISTENT';
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

      // Act
      const result = await repository.findByAccountNumber(accountNumber);

      // Assert
      expect(result).toBeNull();
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const accountNumber = 'ACC-001001-TEST123';
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByAccountNumber(accountNumber)).toBeRejectedWithError(RepositoryError, '根據帳戶號碼查找帳戶失敗');
    });
  });

  describe('findByUserId', () => {
    it('should find accounts by user ID', async () => {
      // Arrange
      const userId = 'user_1';
      const expectedCriteria: AccountSearchCriteria = {
        userId,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result).toEqual([mockAccount]);
      expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
    });

    it('should return empty array when no accounts found', async () => {
      // Arrange
      const userId = 'user_nonexistent';
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

      // Act
      const result = await repository.findByUserId(userId);

      // Assert
      expect(result).toEqual([]);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const userId = 'user_1';
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByUserId(userId)).toBeRejectedWithError(RepositoryError, '根據用戶 ID 查找帳戶失敗');
    });
  });

  describe('findByStatus', () => {
    it('should find accounts by status', async () => {
      // Arrange
      const status = AccountStatus.ACTIVE;
      const expectedCriteria: AccountSearchCriteria = {
        accountStatus: status,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      };
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByStatus(status);

      // Assert
      expect(result).toEqual([mockAccount]);
      expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const status = AccountStatus.ACTIVE;
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByStatus(status)).toBeRejectedWithError(RepositoryError, '根據帳戶狀態查找帳戶失敗');
    });
  });

  describe('findByType', () => {
    it('should find accounts by type', async () => {
      // Arrange
      const accountType = AccountType.CHECKING;
      const expectedCriteria: AccountSearchCriteria = {
        accountType,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByType(accountType);

      // Assert
      expect(result).toEqual([mockAccount]);
      expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const accountType = AccountType.CHECKING;
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByType(accountType)).toBeRejectedWithError(RepositoryError, '根據帳戶類型查找帳戶失敗');
    });
  });

  describe('findByBalanceRange', () => {
    it('should find accounts by balance range', async () => {
      // Arrange
      const minBalance = 500;
      const maxBalance = 1500;
      const expectedCriteria: AccountSearchCriteria = {
        minBalance,
        maxBalance,
        sortBy: 'balance',
        sortOrder: 'desc'
      };
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByBalanceRange(minBalance, maxBalance);

      // Assert
      expect(result).toEqual([mockAccount]);
      expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const minBalance = 500;
      const maxBalance = 1500;
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByBalanceRange(minBalance, maxBalance)).toBeRejectedWithError(
        RepositoryError,
        '根據餘額範圍查找帳戶失敗'
      );
    });
  });

  describe('findByCurrency', () => {
    it('should find accounts by currency', async () => {
      // Arrange
      const currency = 'USD';
      const expectedCriteria: AccountSearchCriteria = {
        currency,
        sortBy: 'balance',
        sortOrder: 'desc'
      };
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([mockAccount]));

      // Act
      const result = await repository.findByCurrency(currency);

      // Assert
      expect(result).toEqual([mockAccount]);
      expect(repository.findAll).toHaveBeenCalledWith(expectedCriteria);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const currency = 'USD';
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.findByCurrency(currency)).toBeRejectedWithError(RepositoryError, '根據貨幣查找帳戶失敗');
    });
  });

  describe('existsByAccountNumber', () => {
    it('should return true when account exists', async () => {
      // Arrange
      const accountNumber = 'ACC-001001-TEST123';
      spyOn(repository, 'findByAccountNumber').and.returnValue(Promise.resolve(mockAccount));

      // Act
      const result = await repository.existsByAccountNumber(accountNumber);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false when account does not exist', async () => {
      // Arrange
      const accountNumber = 'NON-EXISTENT';
      spyOn(repository, 'findByAccountNumber').and.returnValue(Promise.resolve(null));

      // Act
      const result = await repository.existsByAccountNumber(accountNumber);

      // Assert
      expect(result).toBe(false);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const accountNumber = 'ACC-001001-TEST123';
      const error = new Error('Database error');
      spyOn(repository, 'findByAccountNumber').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.existsByAccountNumber(accountNumber)).toBeRejectedWithError(RepositoryError, '檢查帳戶號碼是否存在失敗');
    });
  });

  describe('getStatistics', () => {
    it('should calculate account statistics correctly', async () => {
      // Arrange
      const account1 = OptimizedAccount.create({
        userId: 'user_1',
        accountNumber: 'ACC-001',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      const account2 = OptimizedAccount.create({
        userId: 'user_2',
        accountNumber: 'ACC-002',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000,
        currency: 'USD'
      });
      account2.deactivate();

      const account3 = OptimizedAccount.create({
        userId: 'user_3',
        accountNumber: 'ACC-003',
        name: 'Account 3',
        type: AccountType.CREDIT,
        initialBalance: -500,
        currency: 'EUR'
      });

      const accounts = [account1, account2, account3];
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve(accounts));

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

    it('should handle empty account list', async () => {
      // Arrange
      spyOn(repository, 'findAll').and.returnValue(Promise.resolve([]));

      // Act
      const result = await repository.getStatistics();

      // Assert
      expect(result.total).toBe(0);
      expect(result.totalBalance).toBe(0);
      expect(result.averageBalance).toBe(0);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const error = new Error('Database error');
      spyOn(repository, 'findAll').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.getStatistics()).toBeRejectedWithError(RepositoryError, '獲取帳戶統計資料失敗');
    });
  });

  describe('getUserAccountSummary', () => {
    it('should calculate user account summary correctly', async () => {
      // Arrange
      const userId = 'user_1';
      const account1 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-001',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD'
      });

      const account2 = OptimizedAccount.create({
        userId,
        accountNumber: 'ACC-002',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000,
        currency: 'EUR'
      });
      account2.deactivate();

      const userAccounts = [account1, account2];
      spyOn(repository, 'findByUserId').and.returnValue(Promise.resolve(userAccounts));

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
      // Arrange
      const userId = 'user_nonexistent';
      spyOn(repository, 'findByUserId').and.returnValue(Promise.resolve([]));

      // Act
      const result = await repository.getUserAccountSummary(userId);

      // Assert
      expect(result.totalAccounts).toBe(0);
      expect(result.activeAccounts).toBe(0);
      expect(result.totalBalance).toBe(0);
      expect(Object.keys(result.balanceByCurrency)).toEqual([]);
    });

    it('should throw RepositoryError on failure', async () => {
      // Arrange
      const userId = 'user_1';
      const error = new Error('Database error');
      spyOn(repository, 'findByUserId').and.throwError(error);

      // Act & Assert
      await expectAsync(repository.getUserAccountSummary(userId)).toBeRejectedWithError(RepositoryError, '獲取用戶帳戶摘要失敗');
    });
  });

  describe('fromFirestore', () => {
    it('should convert Firestore document to OptimizedAccount', () => {
      // Arrange
      const firestoreData = {
        userId: 'user_1',
        accountNumber: 'ACC-001001-TEST123',
        name: '測試帳戶',
        type: AccountType.CHECKING,
        balance: 1000,
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        description: '測試用帳戶',
        lastTransactionDate: { toDate: () => new Date('2023-01-01') },
        createdAt: { toDate: () => new Date('2023-01-01') },
        updatedAt: { toDate: () => new Date('2023-01-01') }
      };
      const id = 'account_1';

      // Act
      const result = (repository as any).fromFirestore(firestoreData, id);

      // Assert
      expect(result).toBeInstanceOf(OptimizedAccount);
      expect(result.id).toBe(id);
      expect(result.userId).toBe('user_1');
      expect(result.accountNumber).toBe('ACC-001001-TEST123');
      expect(result.name).toBe('測試帳戶');
      expect(result.type).toBe(AccountType.CHECKING);
      expect(result.getBalanceAmount()).toBe(1000);
      expect(result.getCurrency()).toBe('USD');
      expect(result.status).toBe(AccountStatus.ACTIVE);
      expect(result.description).toBe('測試用帳戶');
    });

    it('should handle missing optional fields', () => {
      // Arrange
      const firestoreData = {
        userId: 'user_1',
        accountNumber: 'ACC-001001-TEST123',
        name: '測試帳戶',
        type: AccountType.CHECKING,
        status: AccountStatus.ACTIVE
      };
      const id = 'account_1';

      // Act
      const result = (repository as any).fromFirestore(firestoreData, id);

      // Assert
      expect(result).toBeInstanceOf(OptimizedAccount);
      expect(result.getBalanceAmount()).toBe(0);
      expect(result.getCurrency()).toBe('USD');
      expect(result.description).toBeUndefined();
      expect(result.lastTransactionDate).toBeUndefined();
    });
  });

  describe('toFirestore', () => {
    it('should convert OptimizedAccount to Firestore document', () => {
      // Act
      const result = (repository as any).toFirestore(mockAccount);

      // Assert
      expect(result).toEqual({
        userId: mockAccount.userId,
        accountNumber: mockAccount.accountNumber,
        name: mockAccount.name,
        type: mockAccount.type,
        balance: mockAccount.getBalanceAmount(),
        currency: mockAccount.getCurrency(),
        status: mockAccount.status,
        description: mockAccount.description,
        lastTransactionDate: mockAccount.lastTransactionDate,
        createdAt: mockAccount.createdAt,
        updatedAt: mockAccount.updatedAt
      });
    });
  });
});
