/**
 * Money value object for handling currency amounts
 * Ensures immutability and provides validation for monetary values
 */
export class Money {
  private readonly amount: number;
  private readonly currency: string;

  constructor(amount: number, currency: string = 'USD') {
    this.validateAmount(amount);
    this.validateCurrency(currency);
    this.amount = this.roundToTwoDecimals(amount);
    this.currency = currency.toUpperCase();
  }

  /**
   * Validate amount is a valid number
   * @param amount Amount to validate
   * @throws Error if amount is invalid
   */
  private validateAmount(amount: number): void {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new Error('Amount must be a valid number');
    }
    // Allow negative amounts for credit accounts and overdrafts
  }

  /**
   * Validate currency code
   * @param currency Currency code to validate
   * @throws Error if currency is invalid
   */
  private validateCurrency(currency: string): void {
    if (!currency || typeof currency !== 'string') {
      throw new Error('Currency must be a valid string');
    }
    if (currency.length !== 3) {
      throw new Error('Currency code must be 3 characters');
    }
  }

  /**
   * Round amount to two decimal places
   * @param amount Amount to round
   * @returns Rounded amount
   */
  private roundToTwoDecimals(amount: number): number {
    return Math.round(amount * 100) / 100;
  }

  /**
   * Get the amount value
   */
  getAmount(): number {
    return this.amount;
  }

  /**
   * Get the currency code
   */
  getCurrency(): string {
    return this.currency;
  }

  /**
   * Add another money value
   * @param other Money value to add
   * @returns New Money instance
   * @throws Error if currencies don't match
   */
  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtract another money value
   * @param other Money value to subtract
   * @returns New Money instance
   * @throws Error if currencies don't match
   */
  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    const result = this.amount - other.amount;
    // Allow negative results for credit accounts and overdrafts
    return new Money(result, this.currency);
  }

  /**
   * Multiply by a factor
   * @param factor Factor to multiply by
   * @returns New Money instance
   */
  multiply(factor: number): Money {
    if (factor <= 0) {
      throw new Error('Multiplication factor must be positive');
    }
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * Check if this money value equals another
   * @param other Money value to compare
   * @returns True if equal
   */
  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  /**
   * Check if this money value is greater than another
   * @param other Money value to compare
   * @returns True if greater
   * @throws Error if currencies don't match
   */
  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > other.amount;
  }

  /**
   * Check if this money value is less than another
   * @param other Money value to compare
   * @returns True if less
   * @throws Error if currencies don't match
   */
  isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < other.amount;
  }

  /**
   * Check if this money value is zero
   * @returns True if zero
   */
  isZero(): boolean {
    return this.amount === 0;
  }

  /**
   * Format money as string
   * @returns Formatted string
   */
  toString(): string {
    return `${this.currency} ${this.amount.toFixed(2)}`;
  }

  /**
   * Format money for display
   * @returns Formatted display string
   */
  toDisplayString(): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return formatter.format(this.amount);
  }

  /**
   * Create Money instance from number
   * @param amount Amount in number
   * @param currency Currency code
   * @returns Money instance
   */
  static create(amount: number, currency: string = 'USD'): Money {
    return new Money(amount, currency);
  }

  /**
   * Create Money instance from string
   * @param amountString Amount as string
   * @param currency Currency code
   * @returns Money instance
   * @throws Error if string is invalid
   */
  static fromString(amountString: string, currency: string = 'USD'): Money {
    const amount = parseFloat(amountString);
    if (isNaN(amount)) {
      throw new Error('Invalid amount string');
    }
    return new Money(amount, currency);
  }

  /**
   * Create zero money value
   * @param currency Currency code
   * @returns Zero Money instance
   */
  static zero(currency: string = 'USD'): Money {
    return new Money(0, currency);
  }
} 