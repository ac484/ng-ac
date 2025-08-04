/**
 * 重構帳戶應用服務單元測試
 */

import { TestBed } from '@angular/core/testing';

import { Repository, ValidationError, NotFoundError, ApplicationError } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import {
  RefactoredAccountApplicationService,
  CreateAccountDto,
  UpdateAccountDto,
  DepositDto,
  WithdrawDto,
  TransferDto,
  UpdateAccountStatusDto
} from './refactored-account-application.service';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';

// Mock Repository
class MockAccountRepository implements Repository<OptimizedAccount> {
  private accounts: OptimizedAccount[] = [];

  async findById(id: string): Promise<OptimizedAccount | null> {
    return this.accounts.find(account => account.id === id) || null;
  }

  async findAll(): Promise<OptimizedAccount[]> {
    return [...this.accounts];
  }

  async save(entity: OptimizedAccount): Promise<void> {
    const existingIndex = this.accounts.findIndex(account => account.id === entity.id);
    if (existingIndex >= 0) {
      this.accounts[existingIndex] = entity;
    } else {
      this.accounts.push(entity);
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.accounts.findIndex(account => account.id === id);
    if (index >= 0) {
      this.accounts.splice(index, 1);
    }
  }

  clear(): void {
    this.accounts = [];
  }

  addAccount(account: OptimizedAccount): void {
    this.accounts.push(account);
  }
}

// Mock ErrorHandlerService
class MockErrorHandlerService {
  handleError = jasmine.createSpy('handleError');
  handleSuccess = jasmine.createSpy('handleSuccess');
  handleWarning = jasmine.createSpy('handleWarning');
}

describe('RefactoredAccountApplicationService', () => {
  let service: RefactoredAccountApplicationService;
  let mockRepository: MockAccountRepository;
  let mockErrorHandler: MockErrorHandlerService;

  beforeEach(async () => {
    mockRepository = new MockAccountRepository();
    mockErrorHandler = new MockErrorHandlerService();

    service = new RefactoredAccountApplicationService(mockRepository as any, mockErrorHandler as any);
  });

  afterEach(() => {
    mockRepository.clear();
    mockErrorHandler.handleError.calls.reset();
    mockErrorHandler.handleSuccess.calls.reset();
    mockErrorHandler.handleWarning.calls.reset();
  });

  describe('create', () => {
    it('should create account with specified account number', async () => {
      const dto: CreateAccountDto = {
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING,
        initialBalance: 1000,
        currency: 'USD',
        description: 'Test account description'
      };

      const result = await service.create(dto);

      expect(result.userId).toBe('user-123');
      expect(result.accountNumber).toBe('ACC-12345');
      expect(result.name).toBe('Test Account');
      expect(result.type).toBe(AccountType.CHECKING);
      expect(result.balance).toBe(1000);
      expect(result.currency).toBe('USD');
      expect(result.description).toBe('Test account description');
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('創建成功');
    });

    it('should create account with generated account number', async () => {
      const dto: CreateAccountDto = {
        userId: 'user-123',
        name: 'Test Account',
        type: AccountType.SAVINGS,
        initialBalance: 500
      };

      const result = await service.create(dto);

      expect(result.userId).toBe('user-123');
      expect(result.accountNumber).toMatch(/^ACC-\d{6}-[A-Z0-9]{6}$/);
      expect(result.name).toBe('Test Account');
      expect(result.type).toBe(AccountType.SAVINGS);
      expect(result.balance).toBe(500);
      expect(result.currency).toBe('USD');
    });

    it('should throw ValidationError for invalid data', async () => {
      const invalidDto = {
        userId: '',
        name: '',
        type: AccountType.CHECKING
      } as CreateAccountDto;

      try {
        await service.create(invalidDto);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });
  });

  describe('getById', () => {
    it('should return account when found', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      mockRepository.addAccount(account);

      const result = await service.getById(account.id);

      expect(result).not.toBeNull();
      expect(result!.id).toBe(account.id);
      expect(result!.name).toBe('Test Account');
    });

    it('should return null when account not found', async () => {
      const result = await service.getById('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('deposit', () => {
    it('should deposit money successfully', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      mockRepository.addAccount(account);

      const depositDto: DepositDto = {
        amount: 500,
        description: 'Test deposit'
      };

      const result = await service.deposit(account.id, depositDto);

      expect(result.balance).toBe(1500);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('存款成功');
    });

    it('should throw ValidationError for negative amount', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING
      });
      mockRepository.addAccount(account);

      const depositDto: DepositDto = {
        amount: -100
      };

      try {
        await service.deposit(account.id, depositDto);
        fail('Expected ValidationError to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
      }
    });
  });

  describe('withdraw', () => {
    it('should withdraw money successfully', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });
      mockRepository.addAccount(account);

      const withdrawDto: WithdrawDto = {
        amount: 300,
        description: 'Test withdrawal'
      };

      const result = await service.withdraw(account.id, withdrawDto);

      expect(result.balance).toBe(700);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('提款成功');
    });
  });

  describe('transfer', () => {
    it('should transfer money between accounts successfully', async () => {
      const sourceAccount = OptimizedAccount.create({
        userId: 'user-1',
        accountNumber: 'ACC-SOURCE',
        name: 'Source Account',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const targetAccount = OptimizedAccount.create({
        userId: 'user-2',
        accountNumber: 'ACC-TARGET',
        name: 'Target Account',
        type: AccountType.SAVINGS,
        initialBalance: 500
      });

      mockRepository.addAccount(sourceAccount);
      mockRepository.addAccount(targetAccount);

      const transferDto: TransferDto = {
        targetAccountId: targetAccount.id,
        amount: 300,
        description: 'Test transfer'
      };

      const result = await service.transfer(sourceAccount.id, transferDto);

      expect(result.sourceAccount.balance).toBe(700);
      expect(result.targetAccount.balance).toBe(800);
      expect(result.transferAmount).toBe(300);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('轉帳成功');
    });
  });

  describe('updateAccountStatus', () => {
    it('should update account status successfully', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING
      });
      mockRepository.addAccount(account);

      const statusDto: UpdateAccountStatusDto = {
        status: AccountStatus.INACTIVE
      };

      const result = await service.updateAccountStatus(account.id, statusDto);

      expect(result.status).toBe(AccountStatus.INACTIVE);
      expect(result.isActive).toBe(false);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('狀態更新成功');
    });
  });

  describe('findByAccountNumber', () => {
    it('should find account by account number', async () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-12345',
        name: 'Test Account',
        type: AccountType.CHECKING
      });
      mockRepository.addAccount(account);

      const result = await service.findByAccountNumber('ACC-12345');

      expect(result).not.toBeNull();
      expect(result!.accountNumber).toBe('ACC-12345');
    });

    it('should return null when account number not found', async () => {
      const result = await service.findByAccountNumber('NON-EXISTENT');
      expect(result).toBeNull();
    });
  });

  describe('getAccountStats', () => {
    it('should return correct account statistics', async () => {
      const account1 = OptimizedAccount.create({
        userId: 'user-1',
        accountNumber: 'ACC-1',
        name: 'Account 1',
        type: AccountType.CHECKING,
        initialBalance: 1000
      });

      const account2 = OptimizedAccount.create({
        userId: 'user-2',
        accountNumber: 'ACC-2',
        name: 'Account 2',
        type: AccountType.SAVINGS,
        initialBalance: 2000
      });
      account2.updateStatus(AccountStatus.INACTIVE);

      mockRepository.addAccount(account1);
      mockRepository.addAccount(account2);

      const stats = await service.getAccountStats();

      expect(stats.totalAccounts).toBe(2);
      expect(stats.activeAccounts).toBe(1);
      expect(stats.inactiveAccounts).toBe(1);
      expect(stats.totalBalance).toBe(3000);
      expect(stats.averageBalance).toBe(1500);
      expect(stats.accountsByType[AccountType.CHECKING]).toBe(1);
      expect(stats.accountsByType[AccountType.SAVINGS]).toBe(1);
    });
  });
});
