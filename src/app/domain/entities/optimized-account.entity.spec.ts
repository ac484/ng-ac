/**
 * 優化帳戶實體單元測試
 */

import { OptimizedAccount, AccountType, AccountStatus, AccountData } from './optimized-account.entity';
import { createEntityData } from './optimized-base-entity';
import { Money } from '../value-objects/account/money.value-object';

describe('OptimizedAccount', () => {
  let accountData: AccountData;

  beforeEach(() => {
    const baseData = createEntityData('test-account-id');
    accountData = {
      ...baseData,
      userId: 'test-user-id',
      accountNumber: 'ACC-123456-TEST',
      name: 'Test Account',
      type: AccountType.CHECKING,
      balance: 1000,
      currency: 'USD',
      status: AccountStatus.ACTIVE,
      description: 'Test account description'
    };
  });

  describe('constructor', () => {
    it('should create account with provided data', () => {
      const account = new OptimizedAccount(accountData);

      expect(account.id).toBe('test-account-id');
      expect(account.userId).toBe('test-user-id');
      expect(account.accountNumber).toBe('ACC-123456-TEST');
      expect(account.name).toBe('Test Account');
      expect(account.type).toBe(AccountType.CHECKING);
      expect(account.getBalanceAmount()).toBe(1000);
      expect(account.getCurrency()).toBe('USD');
      expect(account.status).toBe(AccountStatus.ACTIVE);
      expect(account.description).toBe('Test account description');
    });

    it('should create Money value object for balance', () => {
      const account = new OptimizedAccount(accountData);
      const balance = account.getBalance();

      expect(balance).toBeInstanceOf(Money);
      expect(balance.getAmount()).toBe(1000);
      expect(balance.getCurrency()).toBe('USD');
    });
  });

  describe('create', () => {
    it('should create new account with required parameters', () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-789',
        name: 'New Account',
        type: AccountType.SAVINGS
      });

      expect(account.userId).toBe('user-123');
      expect(account.accountNumber).toBe('ACC-789');
      expect(account.name).toBe('New Account');
      expect(account.type).toBe(AccountType.SAVINGS);
      expect(account.getBalanceAmount()).toBe(0);
      expect(account.getCurrency()).toBe('USD');
      expect(account.status).toBe(AccountStatus.ACTIVE);
      expect(account.hasDomainEvents()).toBe(true);
    });

    it('should create account with initial balance and currency', () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-789',
        name: 'New Account',
        type: AccountType.SAVINGS,
        initialBalance: 500,
        currency: 'EUR',
        description: 'Euro savings account'
      });

      expect(account.getBalanceAmount()).toBe(500);
      expect(account.getCurrency()).toBe('EUR');
      expect(account.description).toBe('Euro savings account');
    });

    it('should add AccountCreated domain event', () => {
      const account = OptimizedAccount.create({
        userId: 'user-123',
        accountNumber: 'ACC-789',
        name: 'New Account',
        type: AccountType.SAVINGS,
        initialBalance: 100
      });

      const events = account.getDomainEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('AccountCreated');
      expect(events[0].accountId).toBe(account.id);
      expect(events[0].userId).toBe('user-123');
      expect(events[0].initialBalance).toBe(100);
    });
  });

  describe('createWithGeneratedNumber', () => {
    it('should create account with generated account number', () => {
      const account = OptimizedAccount.createWithGeneratedNumber({
        userId: 'user-123',
        name: 'Generated Account',
        type: AccountType.CREDIT
      });

      expect(account.accountNumber).toMatch(/^ACC-\d{6}-[A-Z0-9]{6}$/);
      expect(account.userId).toBe('user-123');
      expect(account.name).toBe('Generated Account');
      expect(account.type).toBe(AccountType.CREDIT);
    });
  });

  describe('deposit', () => {
    let account: OptimizedAccount;

    beforeEach(() => {
      account = new OptimizedAccount(accountData);
      account.clearDomainEvents(); // Clear creation events
    });

    it('should increase balance when depositing valid amount', () => {
      const initialBalance = account.getBalanceAmount();

      account.deposit(500);

      expect(account.getBalanceAmount()).toBe(initialBalance + 500);
      expect(account.lastTransactionDate).toBeInstanceOf(Date);
    });

    it('should add domain event when depositing', () => {
      account.deposit(200);

      const events = account.getDomainEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('AccountBalanceChanged');
      expect(events[0].changeAmount).toBe(200);
      expect(events[0].transactionType).toBe('deposit');
    });

    it('should throw error when depositing zero or negative amount', () => {
      expect(() => account.deposit(0)).toThrowError('存款金額必須大於零');
      expect(() => account.deposit(-100)).toThrowError('存款金額必須大於零');
    });

    it('should throw error when account cannot receive deposits', () => {
      account.updateStatus(AccountStatus.SUSPENDED);
      account.clearDomainEvents();

      expect(() => account.deposit(100)).toThrowError('帳戶狀態不允許存款');
    });

    it('should allow deposits to inactive account', () => {
      account.updateStatus(AccountStatus.INACTIVE);
      account.clearDomainEvents();

      expect(() => account.deposit(100)).not.toThrow();
      expect(account.getBalanceAmount()).toBe(1100);
    });
  });

  describe('withdraw', () => {
    let account: OptimizedAccount;

    beforeEach(() => {
      account = new OptimizedAccount(accountData);
      account.clearDomainEvents();
    });

    it('should decrease balance when withdrawing valid amount', () => {
      const initialBalance = account.getBalanceAmount();

      account.withdraw(300);

      expect(account.getBalanceAmount()).toBe(initialBalance - 300);
      expect(account.lastTransactionDate).toBeInstanceOf(Date);
    });

    it('should add domain event when withdrawing', () => {
      account.withdraw(200);

      const events = account.getDomainEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('AccountBalanceChanged');
      expect(events[0].changeAmount).toBe(-200);
      expect(events[0].transactionType).toBe('withdrawal');
    });

    it('should throw error when withdrawing zero or negative amount', () => {
      expect(() => account.withdraw(0)).toThrowError('提款金額必須大於零');
      expect(() => account.withdraw(-100)).toThrowError('提款金額必須大於零');
    });

    it('should throw error when insufficient funds', () => {
      expect(() => account.withdraw(1500)).toThrowError('餘額不足');
    });

    it('should throw error when account cannot make withdrawals', () => {
      account.updateStatus(AccountStatus.INACTIVE);
      account.clearDomainEvents();

      expect(() => account.withdraw(100)).toThrowError('帳戶狀態不允許提款');
    });
  });

  describe('transferTo', () => {
    let sourceAccount: OptimizedAccount;
    let targetAccount: OptimizedAccount;

    beforeEach(() => {
      sourceAccount = new OptimizedAccount(accountData);

      const targetData = { ...accountData };
      targetData.id = 'target-account-id';
      targetData.accountNumber = 'ACC-TARGET';
      targetData.balance = 500;
      targetAccount = new OptimizedAccount(targetData);

      sourceAccount.clearDomainEvents();
      targetAccount.clearDomainEvents();
    });

    it('should transfer money between accounts', () => {
      const transferAmount = 200;
      const sourceInitialBalance = sourceAccount.getBalanceAmount();
      const targetInitialBalance = targetAccount.getBalanceAmount();

      sourceAccount.transferTo(targetAccount, transferAmount);

      expect(sourceAccount.getBalanceAmount()).toBe(sourceInitialBalance - transferAmount);
      expect(targetAccount.getBalanceAmount()).toBe(targetInitialBalance + transferAmount);
    });

    it('should add transfer domain event', () => {
      sourceAccount.transferTo(targetAccount, 200);

      const sourceEvents = sourceAccount.getDomainEvents();
      const transferEvent = sourceEvents.find(e => e.type === 'MoneyTransferred');

      expect(transferEvent).toBeDefined();
      expect(transferEvent.fromAccountId).toBe(sourceAccount.id);
      expect(transferEvent.toAccountId).toBe(targetAccount.id);
      expect(transferEvent.amount).toBe(200);
    });

    it('should throw error when transferring between different currencies', () => {
      const eurAccountData = { ...accountData };
      eurAccountData.id = 'eur-account-id';
      eurAccountData.currency = 'EUR';
      eurAccountData.balance = 500;
      const eurAccount = new OptimizedAccount(eurAccountData);

      expect(() => sourceAccount.transferTo(eurAccount, 100)).toThrowError('不同貨幣的帳戶無法直接轉帳');
    });
  });

  describe('updateInfo', () => {
    let account: OptimizedAccount;

    beforeEach(() => {
      account = new OptimizedAccount(accountData);
      account.clearDomainEvents();
    });

    it('should update account name and description', () => {
      account.updateInfo('Updated Name', 'Updated description');

      expect(account.name).toBe('Updated Name');
      expect(account.description).toBe('Updated description');
    });

    it('should trim whitespace from name and description', () => {
      account.updateInfo('  Trimmed Name  ', '  Trimmed description  ');

      expect(account.name).toBe('Trimmed Name');
      expect(account.description).toBe('Trimmed description');
    });

    it('should set description to undefined when empty string provided', () => {
      account.updateInfo('New Name', '   ');

      expect(account.name).toBe('New Name');
      expect(account.description).toBeUndefined();
    });

    it('should throw error when name is empty', () => {
      expect(() => account.updateInfo('')).toThrowError('帳戶名稱不能為空');
      expect(() => account.updateInfo('   ')).toThrowError('帳戶名稱不能為空');
    });

    it('should add domain event when updating info', () => {
      account.updateInfo('New Name');

      const events = account.getDomainEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('AccountUpdated');
    });
  });

  describe('status management', () => {
    let account: OptimizedAccount;

    beforeEach(() => {
      account = new OptimizedAccount(accountData);
      account.clearDomainEvents();
    });

    it('should update status and add domain event', () => {
      account.updateStatus(AccountStatus.INACTIVE);

      expect(account.status).toBe(AccountStatus.INACTIVE);

      const events = account.getDomainEvents();
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('AccountStatusChanged');
      expect(events[0].oldStatus).toBe(AccountStatus.ACTIVE);
      expect(events[0].newStatus).toBe(AccountStatus.INACTIVE);
    });

    it('should activate account', () => {
      account.status = AccountStatus.INACTIVE;
      account.clearDomainEvents();

      account.activate();

      expect(account.status).toBe(AccountStatus.ACTIVE);
      expect(account.isActive()).toBe(true);
    });

    it('should deactivate account', () => {
      account.deactivate();

      expect(account.status).toBe(AccountStatus.INACTIVE);
      expect(account.isActive()).toBe(false);
    });

    it('should suspend account', () => {
      account.suspend();

      expect(account.status).toBe(AccountStatus.SUSPENDED);
      expect(account.canPerformTransactions()).toBe(false);
    });

    it('should close account when balance is zero', () => {
      // Set balance to zero
      account.withdraw(1000);
      account.clearDomainEvents();

      account.close();

      expect(account.status).toBe(AccountStatus.CLOSED);

      const events = account.getDomainEvents();
      const closeEvent = events.find(e => e.type === 'AccountClosed');
      expect(closeEvent).toBeDefined();
      expect(closeEvent.finalBalance).toBe(0);
    });

    it('should throw error when closing account with non-zero balance', () => {
      expect(() => account.close()).toThrowError('帳戶餘額不為零，無法關閉');
    });
  });

  describe('business logic methods', () => {
    let account: OptimizedAccount;

    beforeEach(() => {
      account = new OptimizedAccount(accountData);
    });

    it('should check if account is active', () => {
      expect(account.isActive()).toBe(true);

      account.status = AccountStatus.INACTIVE;
      expect(account.isActive()).toBe(false);
    });

    it('should check if account can perform transactions', () => {
      expect(account.canPerformTransactions()).toBe(true);

      account.status = AccountStatus.SUSPENDED;
      expect(account.canPerformTransactions()).toBe(false);
    });

    it('should check if account can receive deposits', () => {
      expect(account.canReceiveDeposits()).toBe(true);

      account.status = AccountStatus.INACTIVE;
      expect(account.canReceiveDeposits()).toBe(true);

      account.status = AccountStatus.SUSPENDED;
      expect(account.canReceiveDeposits()).toBe(false);
    });

    it('should check if account can make withdrawals', () => {
      expect(account.canMakeWithdrawals()).toBe(true);

      account.status = AccountStatus.INACTIVE;
      expect(account.canMakeWithdrawals()).toBe(false);
    });

    it('should check if account has sufficient funds', () => {
      expect(account.hasSufficientFunds(500)).toBe(true);
      expect(account.hasSufficientFunds(1000)).toBe(true);
      expect(account.hasSufficientFunds(1500)).toBe(false);
    });
  });

  describe('getSummary', () => {
    it('should return account summary', () => {
      const account = new OptimizedAccount(accountData);
      const summary = account.getSummary();

      expect(summary).toEqual({
        id: account.id,
        accountNumber: account.accountNumber,
        name: account.name,
        type: account.type,
        balance: 1000,
        formattedBalance: account.getBalance().toDisplayString(),
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        isActive: true,
        canPerformTransactions: true,
        lastTransactionDate: undefined
      });
    });
  });

  describe('validate', () => {
    it('should validate valid account', () => {
      const account = new OptimizedAccount(accountData);
      const result = account.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should return errors for invalid account data', () => {
      const invalidData = { ...accountData };
      invalidData.userId = '';
      invalidData.accountNumber = '';
      invalidData.name = '';
      // Note: We can't test negative balance here because Money value object prevents it in constructor

      const account = new OptimizedAccount(invalidData);
      const result = account.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('用戶 ID 不能為空');
      expect(result.errors).toContain('帳戶號碼不能為空');
      expect(result.errors).toContain('帳戶名稱不能為空');
    });

    it('should prevent creation with negative balance through Money value object', () => {
      const invalidData = { ...accountData };
      invalidData.balance = -100;

      expect(() => new OptimizedAccount(invalidData)).toThrowError('Amount cannot be negative');
    });

    it('should validate business rules', () => {
      const closedAccountData = { ...accountData };
      closedAccountData.status = AccountStatus.CLOSED;
      closedAccountData.balance = 100; // Non-zero balance

      const account = new OptimizedAccount(closedAccountData);
      const result = account.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('已關閉的帳戶餘額應為零');
    });
  });

  describe('toJSON', () => {
    it('should serialize account to JSON', () => {
      const account = new OptimizedAccount(accountData);
      const json = account.toJSON();

      expect(json).toEqual({
        id: account.id,
        createdAt: account.createdAt.toISOString(),
        updatedAt: account.updatedAt.toISOString(),
        userId: account.userId,
        accountNumber: account.accountNumber,
        name: account.name,
        type: account.type,
        balance: 1000,
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        description: account.description,
        lastTransactionDate: undefined
      });
    });
  });

  describe('toDisplayObject', () => {
    it('should return display object with formatted data', () => {
      const account = new OptimizedAccount(accountData);
      const displayObj = account.toDisplayObject();

      expect(displayObj).toEqual({
        id: account.id,
        accountNumber: account.accountNumber,
        name: account.name,
        type: account.type,
        balance: 1000,
        formattedBalance: account.getBalance().toDisplayString(),
        currency: 'USD',
        status: AccountStatus.ACTIVE,
        statusText: '啟用',
        isActive: true,
        canPerformTransactions: true,
        description: account.description,
        lastTransactionDate: undefined,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt
      });
    });
  });

  describe('Money value object integration', () => {
    it('should use Money value object for balance operations', () => {
      const account = new OptimizedAccount(accountData);

      // Test that balance is a Money instance
      const balance = account.getBalance();
      expect(balance).toBeInstanceOf(Money);

      // Test Money operations through account methods
      account.deposit(500);
      expect(account.getBalance().getAmount()).toBe(1500);

      account.withdraw(200);
      expect(account.getBalance().getAmount()).toBe(1300);
    });

    it('should handle Money value object errors', () => {
      const account = new OptimizedAccount(accountData);

      // Money value object should prevent negative amounts
      expect(() => account.withdraw(2000)).toThrowError('餘額不足');
    });

    it('should format balance using Money value object', () => {
      const account = new OptimizedAccount(accountData);
      const summary = account.getSummary();

      expect(summary.formattedBalance).toBe(account.getBalance().toDisplayString());
      expect(typeof summary.formattedBalance).toBe('string');
      expect(summary.formattedBalance).toContain('$'); // USD currency symbol
    });
  });
});
