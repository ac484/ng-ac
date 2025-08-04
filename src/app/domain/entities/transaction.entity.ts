import { AggregateRoot } from './aggregate-root';
import { TransactionCreatedEvent, TransactionProcessedEvent, TransactionFailedEvent, TransactionCancelledEvent } from '../events/transaction-events';

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  FEE = 'FEE'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export class Transaction extends AggregateRoot<string> {
  constructor(
    id: string,
    public transactionNumber: string,
    public accountId: string,
    public userId: string,
    public amount: number,
    public currency: string = 'USD',
    public transactionType: TransactionType,
    public status: TransactionStatus = TransactionStatus.PENDING,
    public description: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public referenceNumber?: string,
    public category?: string,
    public fees?: number,
    public notes?: string
  ) {
    super(id);
  }

  // Getter for id
  get id(): string { return this.props; }

  /**
   * Create a new transaction
   */
  static create(
    id: string,
    transactionNumber: string,
    accountId: string,
    userId: string,
    amount: number,
    transactionType: TransactionType,
    description: string,
    currency: string = 'USD'
  ): Transaction {
    const transaction = new Transaction(
      id,
      transactionNumber,
      accountId,
      userId,
      amount,
      currency,
      transactionType,
      TransactionStatus.PENDING,
      description
    );
    transaction.addDomainEvent(new TransactionCreatedEvent(id, accountId, amount, transactionType));
    return transaction;
  }

  // Business logic methods
  processTransaction(): void {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Transaction can only be processed when status is PENDING');
    }
    this.status = TransactionStatus.PROCESSING;
    this.updatedAt = new Date();
  }

  completeTransaction(): void {
    if (this.status !== TransactionStatus.PROCESSING) {
      throw new Error('Transaction can only be completed when status is PROCESSING');
    }
    this.status = TransactionStatus.COMPLETED;
    this.updatedAt = new Date();
    
    this.addDomainEvent(new TransactionProcessedEvent(this.id, this.accountId, this.amount, this.amount));
  }

  failTransaction(reason?: string): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be failed');
    }
    this.status = TransactionStatus.FAILED;
    this.notes = reason ? `${this.notes || ''} - Failed: ${reason}`.trim() : this.notes;
    this.updatedAt = new Date();
    
    this.addDomainEvent(new TransactionFailedEvent(this.id, this.accountId, this.amount, reason || 'Unknown error'));
  }

  cancelTransaction(reason?: string): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be cancelled');
    }
    this.status = TransactionStatus.CANCELLED;
    this.notes = reason ? `${this.notes || ''} - Cancelled: ${reason}`.trim() : this.notes;
    this.updatedAt = new Date();
    
    this.addDomainEvent(new TransactionCancelledEvent(this.id, this.accountId, reason || 'Cancelled by user'));
  }

  updateStatus(newStatus: TransactionStatus, reason?: string): void {
    if (this.status === TransactionStatus.COMPLETED && newStatus !== TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be modified');
    }
    
    this.status = newStatus;
    if (reason) {
      this.notes = `${this.notes || ''} - Status changed to ${newStatus}: ${reason}`.trim();
    }
    this.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be modified');
    }
    this.description = description;
    this.updatedAt = new Date();
  }

  updateCategory(category: string): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be modified');
    }
    this.category = category;
    this.updatedAt = new Date();
  }

  addFees(fees: number): void {
    if (this.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be modified');
    }
    if (fees < 0) {
      throw new Error('Fees cannot be negative');
    }
    this.fees = (this.fees || 0) + fees;
    this.updatedAt = new Date();
  }

  isValid(): boolean {
    return this.amount > 0 && this.description.trim().length > 0;
  }

  isCompleted(): boolean {
    return this.status === TransactionStatus.COMPLETED;
  }

  isPending(): boolean {
    return this.status === TransactionStatus.PENDING;
  }

  isProcessing(): boolean {
    return this.status === TransactionStatus.PROCESSING;
  }

  isFailed(): boolean {
    return this.status === TransactionStatus.FAILED;
  }

  isCancelled(): boolean {
    return this.status === TransactionStatus.CANCELLED;
  }

  canBeModified(): boolean {
    return this.status !== TransactionStatus.COMPLETED;
  }

  getTotalAmount(): number {
    return this.amount + (this.fees || 0);
  }

  static createDeposit(
    id: string,
    transactionNumber: string,
    accountId: string,
    userId: string,
    amount: number,
    description: string,
    currency: string = 'USD'
  ): Transaction {
    return Transaction.create(
      id,
      transactionNumber,
      accountId,
      userId,
      amount,
      TransactionType.DEPOSIT,
      description,
      currency
    );
  }

  static createWithdrawal(
    id: string,
    transactionNumber: string,
    accountId: string,
    userId: string,
    amount: number,
    description: string,
    currency: string = 'USD'
  ): Transaction {
    return Transaction.create(
      id,
      transactionNumber,
      accountId,
      userId,
      amount,
      TransactionType.WITHDRAWAL,
      description,
      currency
    );
  }

  static createTransfer(
    id: string,
    transactionNumber: string,
    accountId: string,
    userId: string,
    amount: number,
    description: string,
    currency: string = 'USD'
  ): Transaction {
    return Transaction.create(
      id,
      transactionNumber,
      accountId,
      userId,
      amount,
      TransactionType.TRANSFER,
      description,
      currency
    );
  }

  /**
   * Validate transaction data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.transactionNumber || this.transactionNumber.trim().length === 0) {
      errors.push('Transaction number is required');
    }

    if (!this.accountId) {
      errors.push('Account ID is required');
    }

    if (!this.userId) {
      errors.push('User ID is required');
    }

    if (this.amount <= 0) {
      errors.push('Transaction amount must be positive');
    }

    if (!this.description || this.description.trim().length === 0) {
      errors.push('Transaction description is required');
    }

    if (this.description && this.description.length > 500) {
      errors.push('Transaction description is too long');
    }

    if (this.fees && this.fees < 0) {
      errors.push('Transaction fees cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get transaction summary
   */
  getSummary(): { 
    id: string; 
    transactionNumber: string; 
    amount: number; 
    type: TransactionType; 
    status: TransactionStatus; 
    description: string 
  } {
    return {
      id: this.id,
      transactionNumber: this.transactionNumber,
      amount: this.amount,
      type: this.transactionType,
      status: this.status,
      description: this.description
    };
  }
} 