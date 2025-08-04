/**
 * 帳戶名稱值物件
 */
export class AccountName {
  private readonly value: string;

  constructor(accountName: string) {
    this.validateAccountName(accountName);
    this.value = accountName.trim();
  }

  getValue(): string {
    return this.value;
  }

  getDisplayValue(): string {
    // 返回顯示用的帳戶名稱，可能包含格式化
    return this.value;
  }

  getShortValue(maxLength = 20): string {
    // 返回截短的帳戶名稱
    if (this.value.length <= maxLength) {
      return this.value;
    }
    return `${this.value.substring(0, maxLength)}...`;
  }

  private validateAccountName(accountName: string): void {
    if (!accountName || accountName.trim().length === 0) {
      throw new Error('Account name cannot be empty');
    }

    const trimmed = accountName.trim();
    if (trimmed.length < 2) {
      throw new Error('Account name must be at least 2 characters long');
    }

    if (trimmed.length > 100) {
      throw new Error('Account name cannot exceed 100 characters');
    }

    // 檢查是否包含特殊字符
    if (!/^[a-zA-Z0-9\s\-_\.]+$/.test(trimmed)) {
      throw new Error('Account name contains invalid characters');
    }
  }

  equals(other: AccountName): boolean {
    return this.value.toLowerCase() === other.value.toLowerCase();
  }

  static createDefault(userId: string): AccountName {
    // 創建默認帳戶名稱
    const timestamp = new Date().toLocaleDateString();
    return new AccountName(`Account ${timestamp}`);
  }
}
