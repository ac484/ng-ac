/**
 * 帳戶狀態值物件
 */
export class AccountStatus {
  private readonly value: AccountStatusType;

  constructor(status: AccountStatusType) {
    this.value = status;
  }

  getValue(): AccountStatusType {
    return this.value;
  }

  isActive(): boolean {
    return this.value === AccountStatusType.ACTIVE;
  }

  isInactive(): boolean {
    return this.value === AccountStatusType.INACTIVE;
  }

  isSuspended(): boolean {
    return this.value === AccountStatusType.SUSPENDED;
  }

  isClosed(): boolean {
    return this.value === AccountStatusType.CLOSED;
  }

  canPerformTransactions(): boolean {
    return this.value === AccountStatusType.ACTIVE;
  }

  canReceiveDeposits(): boolean {
    return this.value === AccountStatusType.ACTIVE;
  }

  canMakeWithdrawals(): boolean {
    return this.value === AccountStatusType.ACTIVE;
  }

  getDisplayName(): string {
    switch (this.value) {
      case AccountStatusType.ACTIVE:
        return 'Active';
      case AccountStatusType.INACTIVE:
        return 'Inactive';
      case AccountStatusType.SUSPENDED:
        return 'Suspended';
      case AccountStatusType.CLOSED:
        return 'Closed';
      default:
        return 'Unknown';
    }
  }

  getDescription(): string {
    switch (this.value) {
      case AccountStatusType.ACTIVE:
        return 'Account is active and can perform all operations';
      case AccountStatusType.INACTIVE:
        return 'Account is inactive and cannot perform transactions';
      case AccountStatusType.SUSPENDED:
        return 'Account is suspended due to suspicious activity';
      case AccountStatusType.CLOSED:
        return 'Account is closed and cannot be reactivated';
      default:
        return 'Unknown account status';
    }
  }

  static ACTIVE(): AccountStatus {
    return new AccountStatus(AccountStatusType.ACTIVE);
  }

  static INACTIVE(): AccountStatus {
    return new AccountStatus(AccountStatusType.INACTIVE);
  }

  static SUSPENDED(): AccountStatus {
    return new AccountStatus(AccountStatusType.SUSPENDED);
  }

  static CLOSED(): AccountStatus {
    return new AccountStatus(AccountStatusType.CLOSED);
  }

  equals(other: AccountStatus): boolean {
    return this.value === other.value;
  }
}

export enum AccountStatusType {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED'
}
