import { Injectable } from '@angular/core';
import { Account, AccountStatus, AccountType } from '../entities/account.entity';
import { Money } from '../value-objects/account/money.value-object';
import { AccountNumber } from '../value-objects/account/account-number.value-object';
import { AccountName } from '../value-objects/account/account-name.value-object';
import { Currency } from '../value-objects/account/currency.value-object';
import { UserId } from '../value-objects/authentication/user-id.value-object';

/**
 * Account domain service
 * Contains business logic and validation rules for account operations
 */
@Injectable({ providedIn: 'root' })
export class AccountDomainService {

  /**
   * Validate account creation parameters
   * @param accountNumber Account number
   * @param accountName Account name
   * @param accountType Account type
   * @param userId User ID
   * @throws Error if validation fails
   */
  validateAccountCreation(
    accountNumber: string,
    accountName: string,
    accountType: AccountType,
    userId: string
  ): void {
    if (!accountNumber || accountNumber.trim().length === 0) {
      throw new Error('Account number is required');
    }
    if (!accountName || accountName.trim().length === 0) {
      throw new Error('Account name is required');
    }
    if (!accountType) {
      throw new Error('Account type is required');
    }
    if (!userId || userId.trim().length === 0) {
      throw new Error('User ID is required');
    }
    if (accountNumber.length < 8) {
      throw new Error('Account number must be at least 8 characters');
    }
    if (accountName.length < 2) {
      throw new Error('Account name must be at least 2 characters');
    }
  }

  /**
   * Generate a unique account ID
   * @returns Generated account ID
   */
  generateAccountId(): string {
    return `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique account number
   * @returns Generated account number
   */
  generateAccountNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${timestamp.slice(-6)}${random}`;
  }

  /**
   * Validate account number format
   * @param accountNumber Account number to validate
   * @throws Error if account number is invalid
   */
  validateAccountNumber(accountNumber: string): void {
    if (!accountNumber || accountNumber.trim().length === 0) {
      throw new Error('Account number is required');
    }
    if (accountNumber.length < 8) {
      throw new Error('Account number must be at least 8 characters');
    }
    if (!/^\d+$/.test(accountNumber)) {
      throw new Error('Account number must contain only digits');
    }
  }

  /**
   * Validate account name
   * @param accountName Account name to validate
   * @throws Error if account name is invalid
   */
  validateAccountName(accountName: string): void {
    if (!accountName || accountName.trim().length === 0) {
      throw new Error('Account name is required');
    }
    if (accountName.length < 2) {
      throw new Error('Account name must be at least 2 characters');
    }
    if (accountName.length > 50) {
      throw new Error('Account name cannot exceed 50 characters');
    }
  }

  /**
   * Validate account type
   * @param accountType Account type to validate
   * @throws Error if account type is invalid
   */
  validateAccountType(accountType: AccountType): void {
    if (!accountType) {
      throw new Error('Account type is required');
    }
    if (!Object.values(AccountType).includes(accountType)) {
      throw new Error('Invalid account type');
    }
  }

  /**
   * Validate initial balance
   * @param balance Initial balance
   * @throws Error if balance is invalid
   */
  validateInitialBalance(balance: number): void {
    if (typeof balance !== 'number' || isNaN(balance)) {
      throw new Error('Balance must be a valid number');
    }
    if (balance < 0) {
      throw new Error('Initial balance cannot be negative');
    }
  }

  /**
   * Check if account can be activated
   * @param account Account to check
   * @returns True if account can be activated
   */
  canActivateAccount(account: Account): boolean {
    return account.status.getValue() === 'ACTIVE';
  }

  /**
   * Check if account can be deactivated
   * @param account Account to check
   * @returns True if account can be deactivated
   */
  canDeactivateAccount(account: Account): boolean {
    return account.status.getValue() === 'ACTIVE';
  }

  /**
   * Check if account can be suspended
   * @param account Account to check
   * @returns True if account can be suspended
   */
  canSuspendAccount(account: Account): boolean {
    return account.status.getValue() === 'ACTIVE';
  }

  /**
   * Check if account can be closed
   * @param account Account to check
   * @returns True if account can be closed
   */
  canCloseAccount(account: Account): boolean {
    return account.status.getValue() !== 'CLOSED' && account.balance.getAmount() === 0;
  }

  /**
   * Validate status transition
   * @param currentStatus Current account status
   * @param newStatus New account status
   */
  validateStatusTransition(currentStatus: AccountStatus, newStatus: AccountStatus): void {
    const validTransitions: Record<string, string[]> = {
      'ACTIVE': ['INACTIVE', 'SUSPENDED'],
      'INACTIVE': ['ACTIVE', 'SUSPENDED'],
      'SUSPENDED': ['ACTIVE', 'INACTIVE'],
      'CLOSED': []
    };

    const currentStatusValue = currentStatus.getValue();
    const newStatusValue = newStatus.getValue();

    if (!validTransitions[currentStatusValue].includes(newStatusValue)) {
      throw new Error(`Invalid status transition from ${currentStatusValue} to ${newStatusValue}`);
    }
  }

  /**
   * Create a new account
   * @param accountNumber Account number
   * @param accountName Account name
   * @param accountType Account type
   * @param userId User ID
   * @param initialBalance Initial balance
   * @param currency Currency code
   * @param description Account description
   * @returns Created account
   */
  createAccount(
    accountNumber: string,
    accountName: string,
    accountType: AccountType,
    userId: string,
    initialBalance: number = 0,
    currency: string = 'USD',
    description?: string
  ): Account {
    this.validateAccountCreation(accountNumber, accountName, accountType, userId);
    this.validateInitialBalance(initialBalance);

    const accountId = this.generateAccountId();
    const accountNumberVO = new AccountNumber(accountNumber);
    const accountNameVO = new AccountName(accountName);
    const balanceVO = new Money(initialBalance);
    const currencyVO = new Currency(currency);
    const statusVO = AccountStatus.ACTIVE();
    const userIdVO = new UserId(userId);

    return new Account(
      accountId,
      accountNumberVO,
      accountNameVO,
      accountType,
      balanceVO,
      currencyVO,
      statusVO,
      userIdVO,
      new Date(),
      new Date(),
      description
    );
  }

  /**
   * Update account information
   * @param account Account to update
   * @param accountName New account name
   * @param description New description
   */
  updateAccountInfo(account: Account, accountName: string, description?: string): void {
    this.validateAccountName(accountName);
    account.updateInfo(accountName, description);
  }

  /**
   * Update account status
   * @param account Account to update
   * @param newStatus New status
   */
  updateAccountStatus(account: Account, newStatus: AccountStatus): void {
    this.validateStatusTransition(account.status, newStatus);
    account.updateStatus(newStatus);
  }

  /**
   * Process account deposit
   * @param account Account to deposit to
   * @param amount Amount to deposit
   */
  processDeposit(account: Account, amount: number): void {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    const moneyAmount = new Money(amount);
    account.deposit(moneyAmount);
  }

  /**
   * Process account withdrawal
   * @param account Account to withdraw from
   * @param amount Amount to withdraw
   */
  processWithdrawal(account: Account, amount: number): void {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    const moneyAmount = new Money(amount);
    account.withdraw(moneyAmount);
  }

  /**
   * Process account transfer
   * @param sourceAccount Source account
   * @param targetAccount Target account
   * @param amount Amount to transfer
   */
  processTransfer(sourceAccount: Account, targetAccount: Account, amount: number): void {
    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }
    if (sourceAccount.id === targetAccount.id) {
      throw new Error('Cannot transfer to the same account');
    }
    if (sourceAccount.currency.getValue() !== targetAccount.currency.getValue()) {
      throw new Error('Cannot transfer between accounts with different currencies');
    }
    const moneyAmount = new Money(amount);
    sourceAccount.transfer(targetAccount, moneyAmount);
  }

  /**
   * Calculate account balance in money format
   * @param account Account to calculate balance for
   * @returns Money object representing balance
   */
  calculateBalance(account: Account): Money {
    return account.balance;
  }

  /**
   * Get account summary information
   * @param account Account to get summary for
   * @returns Account summary
   */
  getAccountSummary(account: Account): {
    id: string;
    accountNumber: string;
    accountName: string;
    accountType: string;
    balance: Money;
    status: string;
    currency: string;
    lastTransactionDate?: Date;
  } {
    return {
      id: account.id,
      accountNumber: account.accountNumber.getValue(),
      accountName: account.accountName.getValue(),
      accountType: account.accountType.getValue(),
      balance: account.balance,
      status: account.status.getValue(),
      currency: account.currency.getValue(),
      lastTransactionDate: account.lastTransactionDate
    };
  }
} 