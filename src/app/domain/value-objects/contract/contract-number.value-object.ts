/**
 * Contract number value object
 * Format: YYYYMMDD + 4-digit sequence (e.g., 202412190001)
 */
export class ContractNumber {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  private validate(value: string): void {
    if (!value || value.length !== 12) {
      throw new Error('Contract number must be 12 digits');
    }
    if (!/^\d{8}\d{4}$/.test(value)) {
      throw new Error('Contract number format: YYYYMMDD + 4-digit sequence');
    }
  }

  static generate(): ContractNumber {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                    String(today.getMonth() + 1).padStart(2, '0') +
                    String(today.getDate()).padStart(2, '0');
    
    // For now, use timestamp-based sequence
    // In production, this should query the database for the max sequence
    const timestamp = Date.now();
    const sequence = timestamp % 10000; // Use last 4 digits of timestamp
    const contractNumber = `${dateStr}${String(sequence).padStart(4, '0')}`;
    
    return new ContractNumber(contractNumber);
  }
} 