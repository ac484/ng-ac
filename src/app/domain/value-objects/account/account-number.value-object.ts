/**
 * 帳戶號碼值物件
 */
export class AccountNumber {
  private readonly value: string;

  constructor(accountNumber: string) {
    this.validateAccountNumber(accountNumber);
    this.value = accountNumber.trim();
  }

  getValue(): string {
    return this.value;
  }

  getFormattedValue(): string {
    // 格式化帳戶號碼，例如：1234-5678-9012-3456
    const cleaned = this.value.replace(/\D/g, '');
    return cleaned.replace(/(\d{4})(?=\d)/g, '$1-');
  }

  getMaskedValue(): string {
    // 返回遮罩的帳戶號碼，例如：****-****-****-3456
    const formatted = this.getFormattedValue();
    const parts = formatted.split('-');
    if (parts.length === 4) {
      return `****-****-****-${parts[3]}`;
    }
    return formatted;
  }

  private validateAccountNumber(accountNumber: string): void {
    if (!accountNumber || accountNumber.trim().length === 0) {
      throw new Error('Account number cannot be empty');
    }

    const cleaned = accountNumber.replace(/\D/g, '');
    if (cleaned.length < 8 || cleaned.length > 20) {
      throw new Error('Account number must be between 8 and 20 digits');
    }

    // 檢查是否包含有效的數字
    if (!/^\d+$/.test(cleaned)) {
      throw new Error('Account number must contain only digits');
    }
  }

  static generate(): AccountNumber {
    // 生成一個新的帳戶號碼
    const timestamp = Date.now().toString();
    const random = Math.random().toString().substring(2, 6);
    const accountNumber = `${timestamp}${random}`;
    return new AccountNumber(accountNumber);
  }

  equals(other: AccountNumber): boolean {
    return this.value === other.value;
  }
}
