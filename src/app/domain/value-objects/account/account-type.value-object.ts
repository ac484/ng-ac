/**
 * 帳戶類型值物件
 */
export class AccountType {
  private readonly value: AccountTypeEnum;

  constructor(type: AccountTypeEnum) {
    this.value = type;
  }

  getValue(): AccountTypeEnum {
    return this.value;
  }

  isChecking(): boolean {
    return this.value === AccountTypeEnum.CHECKING;
  }

  isSavings(): boolean {
    return this.value === AccountTypeEnum.SAVINGS;
  }

  isCredit(): boolean {
    return this.value === AccountTypeEnum.CREDIT;
  }

  isInvestment(): boolean {
    return this.value === AccountTypeEnum.INVESTMENT;
  }

  getDisplayName(): string {
    switch (this.value) {
      case AccountTypeEnum.CHECKING:
        return 'Checking Account';
      case AccountTypeEnum.SAVINGS:
        return 'Savings Account';
      case AccountTypeEnum.CREDIT:
        return 'Credit Account';
      case AccountTypeEnum.INVESTMENT:
        return 'Investment Account';
      default:
        return 'Unknown Account Type';
    }
  }

  getDescription(): string {
    switch (this.value) {
      case AccountTypeEnum.CHECKING:
        return 'A checking account for daily transactions and payments';
      case AccountTypeEnum.SAVINGS:
        return 'A savings account for storing money and earning interest';
      case AccountTypeEnum.CREDIT:
        return 'A credit account for borrowing money with interest';
      case AccountTypeEnum.INVESTMENT:
        return 'An investment account for trading securities and assets';
      default:
        return 'Unknown account type description';
    }
  }

  getInterestRate(): number {
    switch (this.value) {
      case AccountTypeEnum.CHECKING:
        return 0.01; // 1%
      case AccountTypeEnum.SAVINGS:
        return 0.025; // 2.5%
      case AccountTypeEnum.CREDIT:
        return 0.15; // 15%
      case AccountTypeEnum.INVESTMENT:
        return 0.08; // 8% (average)
      default:
        return 0;
    }
  }

  getMinimumBalance(): number {
    switch (this.value) {
      case AccountTypeEnum.CHECKING:
        return 0;
      case AccountTypeEnum.SAVINGS:
        return 100;
      case AccountTypeEnum.CREDIT:
        return -10000; // Credit limit
      case AccountTypeEnum.INVESTMENT:
        return 1000;
      default:
        return 0;
    }
  }

  getMonthlyFee(): number {
    switch (this.value) {
      case AccountTypeEnum.CHECKING:
        return 0;
      case AccountTypeEnum.SAVINGS:
        return 0;
      case AccountTypeEnum.CREDIT:
        return 0;
      case AccountTypeEnum.INVESTMENT:
        return 10;
      default:
        return 0;
    }
  }

  static CHECKING(): AccountType {
    return new AccountType(AccountTypeEnum.CHECKING);
  }

  static SAVINGS(): AccountType {
    return new AccountType(AccountTypeEnum.SAVINGS);
  }

  static CREDIT(): AccountType {
    return new AccountType(AccountTypeEnum.CREDIT);
  }

  static INVESTMENT(): AccountType {
    return new AccountType(AccountTypeEnum.INVESTMENT);
  }

  equals(other: AccountType): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

export enum AccountTypeEnum {
  CHECKING = 'CHECKING',
  SAVINGS = 'SAVINGS',
  CREDIT = 'CREDIT',
  INVESTMENT = 'INVESTMENT'
} 