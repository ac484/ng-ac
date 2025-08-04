/**
 * 使用者狀態值物件
 */
export class UserStatus {
  private readonly value: UserStatusType;

  constructor(status: UserStatusType) {
    this.value = status;
  }

  getValue(): UserStatusType {
    return this.value;
  }

  isActive(): boolean {
    return this.value === UserStatusType.ACTIVE;
  }

  isSuspended(): boolean {
    return this.value === UserStatusType.SUSPENDED;
  }

  isBanned(): boolean {
    return this.value === UserStatusType.BANNED;
  }

  isPending(): boolean {
    return this.value === UserStatusType.PENDING;
  }

  isInactive(): boolean {
    return this.value === UserStatusType.INACTIVE;
  }

  static ACTIVE(): UserStatus {
    return new UserStatus(UserStatusType.ACTIVE);
  }

  static SUSPENDED(): UserStatus {
    return new UserStatus(UserStatusType.SUSPENDED);
  }

  static BANNED(): UserStatus {
    return new UserStatus(UserStatusType.BANNED);
  }

  static PENDING(): UserStatus {
    return new UserStatus(UserStatusType.PENDING);
  }

  static INACTIVE(): UserStatus {
    return new UserStatus(UserStatusType.INACTIVE);
  }
}

export enum UserStatusType {
  ACTIVE = 'Active',
  SUSPENDED = 'Suspended',
  BANNED = 'Banned',
  PENDING = 'Pending',
  INACTIVE = 'Inactive'
} 