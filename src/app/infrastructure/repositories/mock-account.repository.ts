import { Injectable } from '@angular/core';

import { Account, AccountStatus, AccountType } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';

/**
 * Mock implementation of Account repository for testing
 * Simulates account data operations in memory
 */
@Injectable({ providedIn: 'root' })
export class MockAccountRepository implements AccountRepository {
  private accounts = new Map<string, Account>();

  constructor() {
    this.initializeMockData();
  }

  async findById(id: string): Promise<Account | null> {
    await this.delay(100); // Simulate network delay
    return this.accounts.get(id) || null;
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    await this.delay(100);
    for (const account of this.accounts.values()) {
      if (account.accountNumber.getValue() === accountNumber) {
        return account;
      }
    }
    return null;
  }

  async findByUserId(userId: string): Promise<Account[]> {
    await this.delay(150);
    return Array.from(this.accounts.values()).filter(account => account.userId.getValue() === userId);
  }

  async findByStatus(status: AccountStatus): Promise<Account[]> {
    await this.delay(120);
    return Array.from(this.accounts.values()).filter(account => account.status.getValue() === status.getValue());
  }

  async findByType(accountType: AccountType): Promise<Account[]> {
    await this.delay(120);
    return Array.from(this.accounts.values()).filter(account => account.accountType.getValue() === accountType.getValue());
  }

  async findAll(status?: AccountStatus, accountType?: AccountType): Promise<Account[]> {
    await this.delay(200);
    let accounts = Array.from(this.accounts.values());

    if (status) {
      accounts = accounts.filter(account => account.status.getValue() === status.getValue());
    }
    if (accountType) {
      accounts = accounts.filter(account => account.accountType.getValue() === accountType.getValue());
    }

    return accounts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async save(account: Account): Promise<void> {
    await this.delay(150);
    this.accounts.set(account.id, account);
  }

  async delete(id: string): Promise<void> {
    await this.delay(100);
    this.accounts.delete(id);
  }

  async existsByAccountNumber(accountNumber: string): Promise<boolean> {
    await this.delay(80);
    for (const account of this.accounts.values()) {
      if (account.accountNumber.getValue() === accountNumber) {
        return true;
      }
    }
    return false;
  }

  async count(status?: AccountStatus): Promise<number> {
    await this.delay(50);
    if (status) {
      return Array.from(this.accounts.values()).filter(account => account.status.getValue() === status.getValue()).length;
    }
    return this.accounts.size;
  }

  async findByBalanceRange(minBalance: number, maxBalance: number): Promise<Account[]> {
    await this.delay(120);
    return Array.from(this.accounts.values()).filter(
      account => account.balance.getAmount() >= minBalance && account.balance.getAmount() <= maxBalance
    );
  }

  async findByCurrency(currency: string): Promise<Account[]> {
    await this.delay(100);
    return Array.from(this.accounts.values()).filter(account => account.currency.getValue() === currency);
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Account[]> {
    await this.delay(150);
    return Array.from(this.accounts.values()).filter(account => account.createdAt >= startDate && account.createdAt <= endDate);
  }

  async getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    totalBalance: number;
    averageBalance: number;
  }> {
    await this.delay(200);
    const allAccounts = Array.from(this.accounts.values());

    const total = allAccounts.length;
    const active = allAccounts.filter(acc => acc.status.getValue() === 'ACTIVE').length;
    const inactive = allAccounts.filter(acc => acc.status.getValue() === 'INACTIVE').length;
    const suspended = allAccounts.filter(acc => acc.status.getValue() === 'SUSPENDED').length;
    const closed = allAccounts.filter(acc => acc.status.getValue() === 'CLOSED').length;

    const totalBalance = allAccounts.reduce((sum, acc) => sum + acc.balance.getAmount(), 0);
    const averageBalance = total > 0 ? totalBalance / total : 0;

    return {
      total,
      active,
      inactive,
      suspended,
      closed,
      totalBalance,
      averageBalance
    };
  }

  /**
   * Initialize mock data for testing
   */
  private initializeMockData(): void {
    const mockAccounts = [
      Account.create(
        'acc_1',
        '1234567890',
        'Main Checking Account',
        AccountType.CHECKING(),
        'user_1',
        2500.0,
        'Primary checking account for daily transactions'
      ),
      Account.create('acc_2', '0987654321', 'Savings Account', AccountType.SAVINGS(), 'user_1', 15000.0, 'High-yield savings account'),
      Account.create('acc_3', '1122334455', 'Credit Card', AccountType.CREDIT(), 'user_1', -500.0, 'Credit card account'),
      Account.create(
        'acc_4',
        '5566778899',
        'Investment Portfolio',
        AccountType.INVESTMENT(),
        'user_2',
        50000.0,
        'Investment account for stocks and bonds'
      ),
      Account.create(
        'acc_5',
        '9988776655',
        'Secondary Checking',
        AccountType.CHECKING(),
        'user_2',
        0.0,
        'Secondary checking account (inactive)'
      ),
      Account.create('acc_6', '4433221100', 'Business Account', AccountType.CHECKING(), 'user_3', 5000.0, 'Business checking account'),
      Account.create('acc_7', '6677889900', 'Emergency Fund', AccountType.SAVINGS(), 'user_3', 10000.0, 'Emergency savings fund'),
      Account.create(
        'acc_8',
        '2233445566',
        'Investment Account',
        AccountType.INVESTMENT(),
        'user_4',
        25000.0,
        'Personal investment account'
      ),
      Account.create('acc_9', '7788990011', 'Credit Line', AccountType.CREDIT(), 'user_4', -2000.0, 'Personal line of credit'),
      Account.create('acc_10', '3344556677', 'Joint Account', AccountType.CHECKING(), 'user_5', 7500.0, 'Joint checking account')
    ];

    // Add accounts to the map
    mockAccounts.forEach(account => {
      this.accounts.set(account.id, account);
    });
  }

  /**
   * Simulate network delay
   *
   * @param ms Milliseconds to delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear all mock data (for testing)
   */
  clearMockData(): void {
    this.accounts.clear();
  }

  /**
   * Add a mock account (for testing)
   *
   * @param account Account to add
   */
  addMockAccount(account: Account): void {
    this.accounts.set(account.id, account);
  }

  /**
   * Get all mock accounts (for testing)
   */
  getAllMockAccounts(): Account[] {
    return Array.from(this.accounts.values());
  }
}
