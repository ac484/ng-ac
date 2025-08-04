import { Transaction, TransactionStatus, TransactionType } from '../entities/transaction.entity';

export interface TransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByTransactionNumber(transactionNumber: string): Promise<Transaction | null>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findByStatus(status: TransactionStatus): Promise<Transaction[]>;
  findByType(type: TransactionType): Promise<Transaction[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  findByAmountRange(minAmount: number, maxAmount: number): Promise<Transaction[]>;
  findByReferenceNumber(referenceNumber: string): Promise<Transaction[]>;
  findByCategory(category: string): Promise<Transaction[]>;
  findAll(): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<void>;
  delete(id: string): Promise<void>;
  existsById(id: string): Promise<boolean>;
  existsByTransactionNumber(transactionNumber: string): Promise<boolean>;
  count(): Promise<number>;
  countByStatus(status: TransactionStatus): Promise<number>;
  countByType(type: TransactionType): Promise<number>;
  countByAccountId(accountId: string): Promise<number>;
  countByUserId(userId: string): Promise<number>;
  getStatistics(): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }>;
  getAccountStatistics(accountId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }>;
  getUserStatistics(userId: string): Promise<{
    totalCount: number;
    totalAmount: number;
    byStatus: Record<TransactionStatus, number>;
    byType: Record<TransactionType, number>;
    averageAmount: number;
    completedCount: number;
    pendingCount: number;
  }>;
}
