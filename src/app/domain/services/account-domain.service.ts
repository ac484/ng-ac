import { Injectable } from '@angular/core';

import { SharedUtilitiesService } from './shared-utilities.service';
import { Account, AccountStatus, AccountType } from '../entities/account.entity';
import { AccountName } from '../value-objects/account/account-name.value-object';
import { AccountNumber } from '../value-objects/account/account-number.value-object';
import { Currency } from '../value-objects/account/currency.value-object';
import { Money } from '../value-objects/account/money.value-object';
import { UserId } from '../value-objects/authentication/user-id.value-object';

/**
 * Optimized Account Domain Service - Pure Business Logic Only
 * Focuses on business rules, validations, and account operations
 * Eliminates duplicate logic with Application Service and uses SharedUtilitiesService
 */
@Injectable({ providedIn: 'root' })
export class AccountDomainService {
  constructor(private sharedUtilities: SharedUtilitiesService) {}

  /**
   * Business rule: Validate account creation parameters
   * Consolidated validation logic using SharedUtilitiesService
   */
  validateAccountCreation(accountNumber: string, accountName: string, accountType: AccountType, userId: string): void {
    // Use shared utilities for common validations
    this.sharedUtilities.validateRequired(accountNumber, 'Account number');
    this.sharedUtilities.validateRequired(accountName, 'Account name');
    this.sharedUtilities.validateRequired(accountType, 'Account type');
    this.sharedUtilities.validateRequired(userId, 'User ID');

    // Account-specific validations
    this.validateAccountNumber(accountNumber);
    this.validateAccountName(accountName);
  }

  /**
   * Business rule: Validate account number format
   */
  validateAccountNumber(accountNumber: string): void {
    this.sharedUtilities.validateRequired(accountNumber, 'Account number');
    this.sharedUtilities.validateStringLength(accountNumber, 8, 20, 'Account number');

    if (!/^\d+$/.test(accountNumber)) {
      throw new Error('Account number must contain only digits');
    }
  }

  /**
   * Business rule: Validate account name
   */
  validateAccountName(accountName: string): void {
    this.sharedUtilities.validateStringLength(accountName.trim(), 2, 50, 'Account name');
  }

  /**
   * Business rule: Validate initial balance
   */
  validateInitialBalance(balance: number): void {
    this.sharedUtilities.validateNonNegativeNumber(balance, 'Initial balance');
  }

  /**
   * Business rule: Check if account can be activated
   */
  canActivateAccount(account: Account): boolean {
    const status = account.status.getValue();
    return status === 'INACTIVE' || status === 'SUSPENDED';
  }

  /**
   * Business rule: Check if account can be deactivated
   */
  canDeactivateAccount(account: Account): boolean {
    return account.status.getValue() === 'ACTIVE';
  }

  /**
   * Business rule: Check if account can be suspended
   */
  canSuspendAccount(account: Account): boolean {
    return account.status.getValue() === 'ACTIVE';
  }

  /**
   * Business rule: Check if account can be closed
   */
  canCloseAccount(account: Account): boolean {
    return account.status.getValue() !== 'CLOSED' && account.balance.getAmount() === 0;
  }

  /**
   * Business rule: Validate account status transition
   * Uses SharedUtilitiesService for consistent validation
   */
  validateStatusTransition(currentStatus: AccountStatus, newStatus: AccountStatus): void {
    const validTransitions: Record<string, string[]> = {
      ACTIVE: ['INACTIVE', 'SUSPENDED'],
      INACTIVE: ['ACTIVE', 'SUSPENDED'],
      SUSPENDED: ['ACTIVE', 'INACTIVE'],
      CLOSED: []
    };

    this.sharedUtilities.validateStatusTransition(currentStatus.getValue(), newStatus.getValue(), validTransitions);
  }

  /**
   * Business operation: Create a new account with full validation
   * Consolidated creation logic using SharedUtilitiesService
   */
  createAccount(
    accountNumber: string,
    accountName: string,
    accountType: AccountType,
    userId: string,
    initialBalance = 0,
    currency = 'USD',
    description?: string
  ): Account {
    // Validate all creation parameters
    this.validateAccountCreation(accountNumber, accountName, accountType, userId);
    this.validateInitialBalance(initialBalance);

    // Generate unique ID using shared utilities
    const accountId = this.sharedUtilities.generateId('account');

    // Create value objects
    const accountNumberVO = new AccountNumber(accountNumber);
    const accountNameVO = new AccountName(accountName.trim());
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
      description?.trim()
    );
  }

  /**
   * Business operation: Update account information with validation
   */
  updateAccountInfo(account: Account, accountName: string, description?: string): void {
    this.validateAccountName(accountName);
    account.updateInfo(accountName.trim(), description?.trim());
  }

  /**
   * Business operation: Update account status with validation
   */
  updateAccountStatus(account: Account, newStatus: AccountStatus): void {
    this.validateStatusTransition(account.status, newStatus);
    account.updateStatus(newStatus);
  }

  /**
   * Business operation: Process account deposit with validation
   */
  processDeposit(account: Account, amount: number): void {
    this.sharedUtilities.validatePositiveNumber(amount, 'Deposit amount');

    // Business rule: Check account status
    if (account.status.getValue() !== 'ACTIVE') {
      throw new Error('Cannot deposit to inactive account');
    }

    const moneyAmount = new Money(amount);
    account.deposit(moneyAmount);
  }

  /**
   * Business operation: Process account withdrawal with validation
   */
  processWithdrawal(account: Account, amount: number): void {
    this.sharedUtilities.validatePositiveNumber(amount, 'Withdrawal amount');

    // Business rule: Check account status
    if (account.status.getValue() !== 'ACTIVE') {
      throw new Error('Cannot withdraw from inactive account');
    }

    // Business rule: Check sufficient balance
    if (account.balance.getAmount() < amount) {
      throw new Error('Insufficient balance for withdrawal');
    }

    const moneyAmount = new Money(amount);
    account.withdraw(moneyAmount);
  }

  /**
   * Business operation: Process account transfer with validation
   */
  processTransfer(sourceAccount: Account, targetAccount: Account, amount: number): void {
    this.sharedUtilities.validatePositiveNumber(amount, 'Transfer amount');

    // Business rules validation
    if (sourceAccount.id === targetAccount.id) {
      throw new Error('Cannot transfer to the same account');
    }

    if (sourceAccount.currency.getValue() !== targetAccount.currency.getValue()) {
      throw new Error('Cannot transfer between accounts with different currencies');
    }

    if (sourceAccount.status.getValue() !== 'ACTIVE') {
      throw new Error('Cannot transfer from inactive source account');
    }

    if (targetAccount.status.getValue() !== 'ACTIVE') {
      throw new Error('Cannot transfer to inactive target account');
    }

    if (sourceAccount.balance.getAmount() < amount) {
      throw new Error('Insufficient balance for transfer');
    }

    const moneyAmount = new Money(amount);
    sourceAccount.transfer(targetAccount, moneyAmount);
  }

  /**
   * Business rule: Calculate account balance in money format
   */
  calculateBalance(account: Account): Money {
    return account.balance;
  }

  /**
   * Business operation: Get account summary information
   * Provides standardized account summary for reporting
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

  /**
   * Business rule: Validate account for transaction operations
   */
  validateAccountForTransaction(account: Account, operationType: 'deposit' | 'withdrawal' | 'transfer'): void {
    if (account.status.getValue() !== 'ACTIVE') {
      throw new Error(`Cannot perform ${operationType} on inactive account`);
    }

    // Additional business rules based on operation type
    switch (operationType) {
      case 'withdrawal':
      case 'transfer':
        if (account.balance.getAmount() <= 0) {
          throw new Error(`Account has insufficient balance for ${operationType}`);
        }
        break;
    }
  }

  /**
   * Business rule: Check if account can be deleted
   */
  canDeleteAccount(account: Account): boolean {
    return account.status.getValue() === 'CLOSED' && account.balance.getAmount() === 0;
  }
}
