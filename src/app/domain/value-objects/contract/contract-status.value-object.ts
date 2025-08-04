/**
 * Contract status value object
 */
export class ContractStatus {
  private readonly value: string;

  static readonly DRAFT = 'draft';
  static readonly PREPARING = 'preparing';
  static readonly IN_PROGRESS = 'in_progress';
  static readonly COMPLETED = 'completed';

  constructor(value: string) {
    this.validate(value);
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  private validate(value: string): void {
    const validStatuses = [ContractStatus.DRAFT, ContractStatus.PREPARING, ContractStatus.IN_PROGRESS, ContractStatus.COMPLETED];

    if (!validStatuses.includes(value)) {
      throw new Error('Invalid contract status');
    }
  }

  isDraft(): boolean {
    return this.value === ContractStatus.DRAFT;
  }
  isPreparing(): boolean {
    return this.value === ContractStatus.PREPARING;
  }
  isInProgress(): boolean {
    return this.value === ContractStatus.IN_PROGRESS;
  }
  isCompleted(): boolean {
    return this.value === ContractStatus.COMPLETED;
  }
}
