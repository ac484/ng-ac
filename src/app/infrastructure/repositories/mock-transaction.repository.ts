import { Injectable } from '@angular/core';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';

@Injectable({ providedIn: 'root' })
export class MockTransactionRepository implements TransactionRepository {
  private transactions = new Map<string, Transaction>();

  constructor() {
    this.initializeMockData();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.transactions.get(id) || null;
  }

  async findByTransactionNumber(transactionNumber: string): Promise<Transaction | null> {
    for (const transaction of this.transactions.values()) {
      if (transaction.transactionNumber === transactionNumber) {
        return transaction;
      }
    }
    return null;
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByType(type: TransactionType): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.transactionType === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => 
        transaction.createdAt >= startDate && transaction.createdAt <= endDate
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByAmountRange(minAmount: number, maxAmount: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => 
        transaction.amount >= minAmount && transaction.amount <= maxAmount
      )
      .sort((a, b) => b.amount - a.amount);
  }

  async findByReferenceNumber(referenceNumber: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.referenceNumber === referenceNumber)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByCategory(category: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findAll(): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.set(transaction.id, transaction);
  }

  async delete(id: string): Promise<void> {
    this.transactions.delete(id);
  }

  async existsById(id: string): Promise<boolean> {
    return this.transactions.has(id);
  }

  async existsByTransactionNumber(transactionNumber: string): Promise<boolean> {
    for (const transaction of this.transactions.values()) {
      if (transaction.transactionNumber === transactionNumber) {
        return true;
      }
    }
    return false;
  }

  async count(): Promise<number> {
    return this.transactions.size;
  }

  async countByStatus(status: TransactionStatus): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.status === status).length;
  }

  async countByType(type: TransactionType): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.transactionType === type).length;
  }

  async countByAccountId(accountId: string): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.accountId === accountId).length;
  }

  async countByUserId(userId: string): Promise<number> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId).length;
  }

  async getStatistics(): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    const transactions = Array.from(this.transactions.values());
    return this.calculateStatistics(transactions);
  }

  async getAccountStatistics(accountId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    const transactions = await this.findByAccountId(accountId);
    return this.calculateStatistics(transactions);
  }

  async getUserStatistics(userId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }> {
    const transactions = await this.findByUserId(userId);
    return this.calculateStatistics(transactions);
  }

  private calculateStatistics(transactions: Transaction[]): {
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

  private initializeMockData(): void {
    const mockTransactions = [
      new Transaction(
        'txn_1',
        'TXN20241201001',
        'acc_1',
        'user_1',
        1000,
        'USD',
        TransactionType.DEPOSIT,
        TransactionStatus.COMPLETED,
        'Initial deposit',
        new Date('2024-12-01T10:00:00Z'),
        new Date('2024-12-01T10:00:00Z'),
        'REF001',
        'Deposit'
      ),
      new Transaction(
        'txn_2',
        'TXN20241201002',
        'acc_1',
        'user_1',
        500,
        'USD',
        TransactionType.WITHDRAWAL,
        TransactionStatus.COMPLETED,
        'ATM withdrawal',
        new Date('2024-12-01T14:30:00Z'),
        new Date('2024-12-01T14:30:00Z'),
        'REF002',
        'Withdrawal',
        5
      ),
      new Transaction(
        'txn_3',
        'TXN20241201003',
        'acc_2',
        'user_2',
        2000,
        'USD',
        TransactionType.TRANSFER,
        TransactionStatus.PROCESSING,
        'Transfer to savings',
        new Date('2024-12-01T16:00:00Z'),
        new Date('2024-12-01T16:00:00Z'),
        'REF003',
        'Transfer',
        10
      ),
      new Transaction(
        'txn_4',
        'TXN20241201004',
        'acc_1',
        'user_1',
        150,
        'USD',
        TransactionType.PAYMENT,
        TransactionStatus.PENDING,
        'Online payment',
        new Date('2024-12-01T18:00:00Z'),
        new Date('2024-12-01T18:00:00Z'),
        'REF004',
        'Payment',
        3
      ),
      new Transaction(
        'txn_5',
        'TXN20241201005',
        'acc_2',
        'user_2',
        300,
        'USD',
        TransactionType.REFUND,
        TransactionStatus.COMPLETED,
        'Refund for cancelled order',
        new Date('2024-12-01T20:00:00Z'),
        new Date('2024-12-01T20:00:00Z'),
        'REF005',
        'Refund'
      ),
      new Transaction(
        'txn_6',
        'TXN20241201006',
        'acc_1',
        'user_1',
        25,
        'USD',
        TransactionType.FEE,
        TransactionStatus.COMPLETED,
        'Monthly maintenance fee',
        new Date('2024-12-01T22:00:00Z'),
        new Date('2024-12-01T22:00:00Z'),
        'REF006',
        'Fee'
      ),
      new Transaction(
        'txn_7',
        'TXN20241202001',
        'acc_1',
        'user_1',
        750,
        'USD',
        TransactionType.DEPOSIT,
        TransactionStatus.FAILED,
        'Failed deposit attempt',
        new Date('2024-12-02T09:00:00Z'),
        new Date('2024-12-02T09:00:00Z'),
        'REF007',
        'Deposit'
      ),
      new Transaction(
        'txn_8',
        'TXN20241202002',
        'acc_2',
        'user_2',
        1200,
        'USD',
        TransactionType.WITHDRAWAL,
        TransactionStatus.CANCELLED,
        'Cancelled withdrawal',
        new Date('2024-12-02T11:00:00Z'),
        new Date('2024-12-02T11:00:00Z'),
        'REF008',
        'Withdrawal',
        12
      )
    ];

    mockTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
  }
} 