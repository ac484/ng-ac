import { AggregateRoot } from './aggregate-root';
import { AccountCreatedEvent, AccountUpdatedEvent, AccountBalanceChangedEvent, AccountClosedEvent } from '../events/account-events';

// 導入值物件
import { AccountName } from '../value-objects/account/account-name.value-object';
import { AccountNumber } from '../value-objects/account/account-number.value-object';
import { AccountStatus } from '../value-objects/account/account-status.value-object';
import { AccountType } from '../value-objects/account/account-type.value-object';
import { Currency } from '../value-objects/account/currency.value-object';
import { Money } from '../value-objects/account/money.value-object';
import { UserId } from '../value-objects/authentication/user-id.value-object';

// 重新導出值物件以解決 TS2459 錯誤
export { AccountStatus } from '../value-objects/account/account-status.value-object';
export { AccountType } from '../value-objects/account/account-type.value-object';

// AccountType 現在使用值物件，不再需要 enum

/**
 * Account domain entity
 * Represents a financial account with business logic for balance management
 * Now extends AggregateRoot for DDD architecture with rich value objects
 */
export class Account extends AggregateRoot<string> {
  constructor(
    id: string,
    accountNumber: AccountNumber,
    accountName: AccountName,
    accountType: AccountType,
    balance: Money,
    currency: Currency,
    status: AccountStatus,
    userId: UserId,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    description?: string,
    lastTransactionDate?: Date
  ) {
    super(id);

    // 私有屬性使用值物件
    this._id = id;
    this._accountNumber = accountNumber;
    this._accountName = accountName;
    this._accountType = accountType;
    this._balance = balance;
    this._currency = currency;
    this._status = status;
    this._userId = userId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._description = description;
    this._lastTransactionDate = lastTransactionDate;
  }

  // 私有屬性
  private _id: string;
  private _accountNumber: AccountNumber;
  private _accountName: AccountName;
  private _accountType: AccountType;
  private _balance: Money;
  private _currency: Currency;
  private _status: AccountStatus;
  private _userId: UserId;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _description?: string;
  private _lastTransactionDate?: Date;

  // Getter 方法
  get id(): string {
    return this._id;
  }
  get accountNumber(): AccountNumber {
    return this._accountNumber;
  }
  get accountName(): AccountName {
    return this._accountName;
  }
  get accountType(): AccountType {
    return this._accountType;
  }
  get balance(): Money {
    return this._balance;
  }
  get currency(): Currency {
    return this._currency;
  }
  get status(): AccountStatus {
    return this._status;
  }
  get userId(): UserId {
    return this._userId;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get description(): string | undefined {
    return this._description;
  }
  get lastTransactionDate(): Date | undefined {
    return this._lastTransactionDate;
  }

  /**
   * Create a new account with rich value objects
   */
  static create(
    id: string,
    accountNumber: string,
    accountName: string,
    accountType: AccountType,
    userId: string,
    initialBalance = 0,
    description?: string
  ): Account {
    const accountNumberVO = new AccountNumber(accountNumber);
    const accountNameVO = new AccountName(accountName);
    const balanceVO = new Money(initialBalance);
    const statusVO = AccountStatus.ACTIVE();
    const userIdVO = new UserId(userId);
    const currencyVO = Currency.USD();

    const account = new Account(
      id,
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

    account.addDomainEvent(new AccountCreatedEvent(id, userId, initialBalance));
    return account;
  }

  /**
   * Create a new account with generated account number
   */
  static createWithGeneratedNumber(
    id: string,
    accountName: string,
    accountType: AccountType,
    userId: string,
    initialBalance = 0,
    description?: string
  ): Account {
    const accountNumberVO = AccountNumber.generate();
    const accountNameVO = new AccountName(accountName);
    const balanceVO = new Money(initialBalance);
    const statusVO = AccountStatus.ACTIVE();
    const userIdVO = new UserId(userId);
    const currencyVO = Currency.USD();

    const account = new Account(
      id,
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

    account.addDomainEvent(new AccountCreatedEvent(id, userId, initialBalance));
    return account;
  }

  /**
   * Deposit money into the account
   *
   * @param amount Amount to deposit
   * @throws Error if amount is negative or account is not active
   */
  deposit(amount: Money): void {
    if (amount.getAmount() <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    if (!this._status.canReceiveDeposits()) {
      throw new Error('Cannot deposit to inactive account');
    }

    const oldBalance = this._balance;
    this._balance = this._balance.add(amount);
    this._lastTransactionDate = new Date();
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountBalanceChangedEvent(this._id, oldBalance.getAmount(), this._balance.getAmount(), amount.getAmount()));
  }

  /**
   * Withdraw money from the account
   *
   * @param amount Amount to withdraw
   * @throws Error if amount is negative, insufficient funds, or account is not active
   */
  withdraw(amount: Money): void {
    if (amount.getAmount() <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }
    if (!this._status.canMakeWithdrawals()) {
      throw new Error('Cannot withdraw from inactive account');
    }
    if (!this.hasSufficientFunds(amount)) {
      throw new Error('Insufficient funds');
    }

    const oldBalance = this._balance;
    this._balance = this._balance.subtract(amount);
    this._lastTransactionDate = new Date();
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountBalanceChangedEvent(this._id, oldBalance.getAmount(), this._balance.getAmount(), -amount.getAmount()));
  }

  /**
   * Transfer money to another account
   *
   * @param targetAccount Target account to transfer to
   * @param amount Amount to transfer
   */
  transfer(targetAccount: Account, amount: Money): void {
    this.withdraw(amount);
    targetAccount.deposit(amount);
  }

  /**
   * Update account information
   *
   * @param accountName New account name
   * @param description New description
   */
  updateInfo(accountName: string, description?: string): void {
    const accountNameVO = new AccountName(accountName);
    this._accountName = accountNameVO;

    if (description !== undefined) {
      this._description = description;
    }
    this._updatedAt = new Date();

    this.addDomainEvent(new AccountUpdatedEvent(this._id, this._userId.getValue(), this._balance.getAmount()));
  }

  /**
   * Update account status
   *
   * @param status New account status
   */
  updateStatus(status: AccountStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  /**
   * Activate the account
   */
  activate(): void {
    this.updateStatus(AccountStatus.ACTIVE());
  }

  /**
   * Deactivate the account
   */
  deactivate(): void {
    this.updateStatus(AccountStatus.INACTIVE());
  }

  /**
   * Suspend the account
   */
  suspend(): void {
    this.updateStatus(AccountStatus.SUSPENDED());
  }

  /**
   * Close the account
   */
  close(): void {
    this.updateStatus(AccountStatus.CLOSED());
    this.addDomainEvent(new AccountClosedEvent(this._id, this._userId.getValue(), this._balance.getAmount()));
  }

  /**
   * Check if account is active
   */
  isActive(): boolean {
    return this._status.isActive();
  }

  /**
   * Check if account can perform transactions
   */
  canPerformTransactions(): boolean {
    return this._status.canPerformTransactions();
  }

  /**
   * Get current balance
   */
  getBalance(): Money {
    return this._balance;
  }

  /**
   * Check if account has sufficient funds
   *
   * @param amount Amount to check
   */
  hasSufficientFunds(amount: Money): boolean {
    return this._balance.getAmount() >= amount.getAmount();
  }

  /**
   * Get account summary with value objects
   */
  getSummary(): {
    id: string;
    accountNumber: string;
    accountName: string;
    balance: number;
    status: string;
    isActive: boolean;
    canPerformTransactions: boolean;
    formattedAccountNumber: string;
    maskedAccountNumber: string;
  } {
    return {
      id: this._id,
      accountNumber: this._accountNumber.getValue(),
      accountName: this._accountName.getValue(),
      balance: this._balance.getAmount(),
      status: this._status.getValue(),
      isActive: this._status.isActive(),
      canPerformTransactions: this._status.canPerformTransactions(),
      formattedAccountNumber: this._accountNumber.getFormattedValue(),
      maskedAccountNumber: this._accountNumber.getMaskedValue()
    };
  }

  /**
   * Validate account data with value objects
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 驗證帳戶號碼
    try {
      this._accountNumber.getValue();
    } catch (error: any) {
      errors.push(`Account number error: ${error.message}`);
    }

    // 驗證帳戶名稱
    try {
      this._accountName.getValue();
    } catch (error: any) {
      errors.push(`Account name error: ${error.message}`);
    }

    // 驗證餘額
    if (this._balance.getAmount() < 0) {
      errors.push('Account balance cannot be negative');
    }

    // 驗證用戶ID
    try {
      this._userId.getValue();
    } catch (error: any) {
      errors.push(`User ID error: ${error.message}`);
    }

    // 驗證狀態一致性
    if (this._status.isClosed() && this._balance.getAmount() > 0) {
      errors.push('Closed account should have zero balance');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get account for display purposes
   */
  toDisplayAccount(): any {
    return {
      id: this._id,
      accountNumber: this._accountNumber.getFormattedValue(),
      maskedAccountNumber: this._accountNumber.getMaskedValue(),
      accountName: this._accountName.getDisplayValue(),
      shortAccountName: this._accountName.getShortValue(),
      accountType: this._accountType,
      balance: this._balance.getAmount(),
      formattedBalance: this._balance.toDisplayString(),
      currency: this._currency.getCode(),
      status: this._status.getValue(),
      statusDisplayName: this._status.getDisplayName(),
      statusDescription: this._status.getDescription(),
      isActive: this._status.isActive(),
      canPerformTransactions: this._status.canPerformTransactions(),
      userId: this._userId.getValue(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      description: this._description,
      lastTransactionDate: this._lastTransactionDate
    };
  }
}
