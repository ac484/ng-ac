import { Injectable } from '@angular/core';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { Money } from '../value-objects/account/money.value-object';

@Injectable({ providedIn: 'root' })
export class TransactionDomainService {
  
  // Business rules for transaction creation
  validateTransactionCreation(
    accountId: string,
    userId: string,
    amount: number,
    transactionType: TransactionType,
    description: string
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!accountId || accountId.trim().length === 0) {
      errors.push('Account ID is required');
    }

    if (!userId || userId.trim().length === 0) {
      errors.push('User ID is required');
    }

    if (amount <= 0) {
      errors.push('Transaction amount must be greater than 0');
    }

    if (!transactionType) {
      errors.push('Transaction type is required');
    }

    if (!description || description.trim().length === 0) {
      errors.push('Transaction description is required');
    }

    if (description.length > 500) {
      errors.push('Transaction description cannot exceed 500 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Generate unique transaction number
  generateTransactionNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
  }

  // Validate transaction status transition
  validateStatusTransition(
    currentStatus: TransactionStatus,
    newStatus: TransactionStatus
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Define valid status transitions
    const validTransitions: Record<TransactionStatus, TransactionStatus[]> = {
      [TransactionStatus.PENDING]: [TransactionStatus.PROCESSING, TransactionStatus.CANCELLED],
      [TransactionStatus.PROCESSING]: [TransactionStatus.COMPLETED, TransactionStatus.FAILED, TransactionStatus.CANCELLED],
      [TransactionStatus.COMPLETED]: [], // No transitions allowed
      [TransactionStatus.FAILED]: [TransactionStatus.PROCESSING], // Retry
      [TransactionStatus.CANCELLED]: [] // No transitions allowed
    };

    const allowedTransitions = validTransitions[currentStatus];
    if (!allowedTransitions.includes(newStatus)) {
      errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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

  // Validate transaction amount limits
  validateAmountLimits(
    amount: number,
    transactionType: TransactionType,
    currency: string = 'USD'
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const money = new Money(amount, currency);

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
      errors.push(`Minimum amount for ${transactionType} is ${limit.min} ${currency}`);
    }

    if (amount > limit.max) {
      errors.push(`Maximum amount for ${transactionType} is ${limit.max} ${currency}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
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

  // Validate transaction reference number format
  validateReferenceNumber(referenceNumber?: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (referenceNumber) {
      if (referenceNumber.length < 3) {
        errors.push('Reference number must be at least 3 characters long');
      }
      
      if (referenceNumber.length > 50) {
        errors.push('Reference number cannot exceed 50 characters');
      }

      if (!/^[A-Za-z0-9\-_]+$/.test(referenceNumber)) {
        errors.push('Reference number can only contain letters, numbers, hyphens, and underscores');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Create transaction with validation
  createTransaction(
    id: string,
    accountId: string,
    userId: string,
    amount: number,
    transactionType: TransactionType,
    description: string,
    currency: string = 'USD',
    referenceNumber?: string,
    category?: string
  ): Transaction {
    // Validate creation parameters
    const validation = this.validateTransactionCreation(accountId, userId, amount, transactionType, description);
    if (!validation.isValid) {
      throw new Error(`Transaction creation failed: ${validation.errors.join(', ')}`);
    }

    // Validate amount limits
    const amountValidation = this.validateAmountLimits(amount, transactionType, currency);
    if (!amountValidation.isValid) {
      throw new Error(`Amount validation failed: ${amountValidation.errors.join(', ')}`);
    }

    // Validate reference number if provided
    if (referenceNumber) {
      const refValidation = this.validateReferenceNumber(referenceNumber);
      if (!refValidation.isValid) {
        throw new Error(`Reference number validation failed: ${refValidation.errors.join(', ')}`);
      }
    }

    // Generate transaction number
    const transactionNumber = this.generateTransactionNumber();

    // Create transaction
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