/**
 * 顯示名稱值物件
 */
export class DisplayName {
  private readonly value: string;

  constructor(displayName: string) {
    const trimmed = displayName.trim();
    if (trimmed.length === 0) {
      throw new Error('Display name cannot be empty');
    }
    if (trimmed.length > 50) {
      throw new Error('Display name cannot exceed 50 characters');
    }
    this.value = trimmed;
  }

  getValue(): string {
    return this.value;
  }

  toLowerCase(): string {
    return this.value.toLowerCase();
  }

  toUpperCase(): string {
    return this.value.toUpperCase();
  }

  includes(searchString: string): boolean {
    return this.value.toLowerCase().includes(searchString.toLowerCase());
  }

  length(): number {
    return this.value.length;
  }
}
