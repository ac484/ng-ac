/**
 * 貨幣值物件
 */
export class Currency {
  private readonly code: string;
  private readonly symbol: string;
  private readonly name: string;

  constructor(code: string) {
    this.validateCurrencyCode(code);
    this.code = code.toUpperCase();
    this.symbol = this.getCurrencySymbol(this.code);
    this.name = this.getCurrencyName(this.code);
  }

  getCode(): string {
    return this.code;
  }

  getValue(): string {
    return this.code;
  }

  getSymbol(): string {
    return this.symbol;
  }

  getName(): string {
    return this.name;
  }

  getDisplayName(): string {
    return `${this.name} (${this.code})`;
  }

  private validateCurrencyCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Currency code cannot be empty');
    }

    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 3) {
      throw new Error('Currency code must be exactly 3 characters');
    }

    if (!/^[A-Z]{3}$/.test(trimmed)) {
      throw new Error('Currency code must contain only uppercase letters');
    }
  }

  private getCurrencySymbol(code: string): string {
    const symbols: Record<string, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
      HKD: 'HK$',
      SGD: 'S$',
      TWD: 'NT$',
      KRW: '₩',
      THB: '฿'
    };
    return symbols[code] || code;
  }

  private getCurrencyName(code: string): string {
    const names: Record<string, string> = {
      USD: 'US Dollar',
      EUR: 'Euro',
      GBP: 'British Pound',
      JPY: 'Japanese Yen',
      CNY: 'Chinese Yuan',
      HKD: 'Hong Kong Dollar',
      SGD: 'Singapore Dollar',
      TWD: 'Taiwan Dollar',
      KRW: 'South Korean Won',
      THB: 'Thai Baht'
    };
    return names[code] || code;
  }

  static USD(): Currency {
    return new Currency('USD');
  }

  static EUR(): Currency {
    return new Currency('EUR');
  }

  static GBP(): Currency {
    return new Currency('GBP');
  }

  static JPY(): Currency {
    return new Currency('JPY');
  }

  static CNY(): Currency {
    return new Currency('CNY');
  }

  static HKD(): Currency {
    return new Currency('HKD');
  }

  static SGD(): Currency {
    return new Currency('SGD');
  }

  static TWD(): Currency {
    return new Currency('TWD');
  }

  static KRW(): Currency {
    return new Currency('KRW');
  }

  static THB(): Currency {
    return new Currency('THB');
  }

  equals(other: Currency): boolean {
    return this.code === other.code;
  }

  toString(): string {
    return this.code;
  }
}
