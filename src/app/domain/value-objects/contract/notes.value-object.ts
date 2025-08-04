export class Notes {
  private readonly value: string;

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  private validate(value: string): void {
    if (value && value.length > 1000) {
      throw new Error('Notes cannot exceed 1000 characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): Notes {
    return new Notes(value);
  }
}
