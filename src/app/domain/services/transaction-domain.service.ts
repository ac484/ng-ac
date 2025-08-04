import { Injectable } from '@angular/core';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { Money } from '../value-objects/account/money.value-object';
import { SharedUtilitiesService } from './shared-utilities.service';

/**
 * Optimized Transaction Domain Service - Pure Business Logic Only
 * Focuses on business rules, validations, and transaction operations
 * Eliminates duplicate logic with Application Service
 */
@Injectable({ providedIn: 'root' })
export class TransactionDomainService {

  constructor(private sharedUtilities: SharedUtilitiesService) { }

  /**
   * Business rule: Validate transaction creation parameters
   * Consolidated validation logic
   */
  validateTransactionCreation(
    accountId: string,
    userId: string,
    amount: number,
    transactionType: TransactionType,
    description: string
  ): void {
    // Use shared utilities for common validations
    this.sharedUtilities.validateRequired(accountId, 'Account ID');
    this.sharedUtilities.validateRequired(userId, 'User ID');
    this.sharedUtilities.validateRequired(transactionType, 'Transaction type');
    this.sharedUtilities.validatePositiveNumber(amount, 'Transaction amount');
    this.sharedUtilities.validateStringLength(description, 1, 500, 'Transaction description');
  }

  /**
   * Business rule: Validate transaction status transition
   */
  validateStatusTransition(currentStatus: TransactionStatus, newStatus: TransactionStatus): void {
    // Define valid status transitions
    const validTransitions: Record<string, string[]> = {
      [TransactionStatus.PENDING]: [TransactionStatus.PROCESSING, TransactionStatus.CANCELLED],
      [TransactionStatus.PROCESSING]: [TransactionStatus.COMPLETED, TransactionStatus.FAILED, TransactionStatus.CANCELLED],
      [TransactionStatus.COMPLETED]: [], // No transitions allowed
      [TransactionStatus.FAILED]: [TransactionStatus.PROCESSING], // Retry
      [TransactionStatus.CANCELLED]: [] // No transitions allowed
    };

    this.sharedUtilities.validateStatusTransition(currentStatus, newStatus, validTransitions);
  }

  // Calculate transaction fees based on type and amount
  calculateFees(transactionType: TransactionType, amount: number, currency: string = 'USD'): number {
    const money = new Money(amount, currency);

    switch (transactionType) {
      case TransactionType.DEPOSIT:
        return 0; // No fees for deposits

      case TransactionType.WITHDRAWAL:
        // 1% fee for withdrawals
        return money.multiply(0.01).getAmount();

      case TransactionType.TRANSFER:
        // 0.5% fee for transfers
        return money.multiply(0.005).getAmount();

      case TransactionType.PAYMENT:
        // 2% fee for payments
        return money.multiply(0.02).getAmount();

      case TransactionType.REFUND:
        return 0; // No fees for refunds

      case TransactionType.FEE:
        return 0; // Fee transactions don't have additional fees

      default:
        return 0;
    }
  }

  /**
   * Business rule: Validate transaction amount limits
   */
  validateAmountLimits(amount: number, transactionType: TransactionType, currency: string = 'USD'): void {
    // Define limits based on transaction type
    const limits: Record<TransactionType, { min: number; max: number }> = {
      [TransactionType.DEPOSIT]: { min: 1, max: 100000 },
      [TransactionType.WITHDRAWAL]: { min: 1, max: 50000 },
      [TransactionType.TRANSFER]: { min: 1, max: 25000 },
      [TransactionType.PAYMENT]: { min: 1, max: 10000 },
      [TransactionType.REFUND]: { min: 0.01, max: 100000 },
      [TransactionType.FEE]: { min: 0.01, max: 1000 }
    };

    const limit = limits[transactionType];

    if (amount < limit.min) {
      throw new Error(`Minimum amount for ${transactionType} is ${limit.min} ${currency}`);
    }

    if (amount > limit.max) {
      throw new Error(`Maximum amount for ${transactionType} is ${limit.max} ${currency}`);
    }
  }

  // Process transaction business logic
  processTransaction(transaction: Transaction): Transaction {
    if (!transaction.isValid()) {
      throw new Error('Transaction is not valid');
    }

    if (transaction.status !== TransactionStatus.PENDING) {
      throw new Error('Transaction can only be processed when status is PENDING');
    }

    // Calculate fees if not already set
    if (transaction.fees === undefined) {
      transaction.fees = this.calculateFees(transaction.transactionType, transaction.amount, transaction.currency);
    }

    // Process the transaction
    transaction.processTransaction();

    return transaction;
  }

  // Complete transaction business logic
  completeTransaction(transaction: Transaction): Transaction {
    if (transaction.status !== TransactionStatus.PROCESSING) {
      throw new Error('Transaction can only be completed when status is PROCESSING');
    }

    transaction.completeTransaction();
    return transaction;
  }

  // Cancel transaction business logic
  cancelTransaction(transaction: Transaction, reason?: string): Transaction {
    if (transaction.status === TransactionStatus.COMPLETED) {
      throw new Error('Completed transactions cannot be cancelled');
    }

    transaction.cancelTransaction(reason);
    return transaction;
  }

  // Validate transaction for account balance
  validateAccountBalance(
    transaction: Transaction,
    currentBalance: number
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if account has sufficient balance for withdrawals and transfers
    if (transaction.transactionType === TransactionType.WITHDRAWAL ||
      transaction.transactionType === TransactionType.TRANSFER) {
      const totalAmount = transaction.getTotalAmount();

      if (currentBalance < totalAmount) {
        errors.push(`Insufficient balance. Required: ${totalAmount}, Available: ${currentBalance}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get transaction statistics
  calculateTransactionStats(transactions: Transaction[]): {
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  } {
    const stats = {
      totalCount: transactions.length,
      totalAmount: 0,
      byStatus: {} as Record<TransactionStatus, number>,
      byType: {} as Record<TransactionType, number>,
      averageAmount: 0,
      completedCount: 0,
      pendingCount: 0
    };

    // Initialize counters
    Object.values(TransactionStatus).forEach(status => {
      stats.byStatus[status] = 0;
    });
    Object.values(TransactionType).forEach(type => {
      stats.byType[type] = 0;
    });

    // Calculate statistics
    transactions.forEach(transaction => {
      stats.totalAmount += transaction.amount;
      stats.byStatus[transaction.status]++;
      stats.byType[transaction.transactionType]++;

      if (transaction.isCompleted()) {
        stats.completedCount++;
      }
      if (transaction.isPending()) {
        stats.pendingCount++;
      }
    });

    stats.averageAmount = stats.totalCount > 0 ? stats.totalAmount / stats.totalCount : 0;

    return stats;
  }

  /**
   * Business rule: Validate transaction reference number format
   */
  validateReferenceNumber(referenceNumber?: string): void {
    if (referenceNumber) {
      this.sharedUtilities.validateStringLength(referenceNumber, 3, 50, 'Reference number');

      if (!/^[A-Za-z0-9\-_]+$/.test(referenceNumber)) {
        throw new Error('Reference number can only contain letters, numbers, hyphens, and underscores');
      }
    }
  }

  /**
   * Business operation: Create transaction with full validation
   * Consolidated creation logic
   */
  createTransaction(
    accountId: string,
    userId: string,
    amount: number,
    transactionType: TransactionType,
    description: string,
    currency: string = 'USD',
    referenceNumber?: string,
    category?: string
  ): Transaction {
    // Validate all creation parameters
    this.validateTransactionCreation(accountId, userId, amount, transactionType, description);
    this.validateAmountLimits(amount, transactionType, currency);

    if (referenceNumber) {
      this.validateReferenceNumber(referenceNumber);
    }

    // Generate unique identifiers
    const id = this.sharedUtilities.generateId('transaction');
    const transactionNumber = this.sharedUtilities.generateTransactionNumber();

    // Create transaction entity
    const transaction = new Transaction(
      id,
      transactionNumber,
      accountId,
      userId,
      amount,
      currency,
      transactionType,
      TransactionStatus.PENDING,
      description,
      new Date(),
      new Date(),
      referenceNumber,
      category
    );

    // Calculate and add fees
    const fees = this.calculateFees(transactionType, amount, currency);
    transaction.addFees(fees);

    return transaction;
  }
} 