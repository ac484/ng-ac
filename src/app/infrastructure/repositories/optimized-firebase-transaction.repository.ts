/**
 * 優化的 Firebase 交易儲存庫
 * 使用新的基礎類別，實作交易歷史查詢優化，整合交易統計和報表查詢
 */

import { Injectable } from '@angular/core';
import { Firestore, DocumentData, Query, where, orderBy, query } from '@angular/fire/firestore';

import { BaseFirebaseRepository } from './base-firebase.repository';
import {
  OptimizedTransaction,
  TransactionData,
  TransactionType,
  TransactionStatus
} from '../../domain/entities/optimized-transaction.entity';
import { RepositoryError } from '../../domain/exceptions/repository.error';
import { SearchCriteria } from '../../domain/interfaces/search-criteria.interface';
import { Money } from '../../domain/value-objects/account/money.value-object';

/**
 * 交易特定的搜尋條件
 */
export interface TransactionSearchCriteria extends SearchCriteria {
  accountId?: string;
  userId?: string;
  transactionNumber?: string;
  transactionType?: TransactionType;
  transactionStatus?: TransactionStatus;
  minAmount?: number;
  maxAmount?: number;
  currency?: string;
  category?: string;
  referenceNumber?: string;
  hasNotes?: boolean;
  hasFees?: boolean;
}

/**
 * 交易統計資料
 */
export interface TransactionStatistics {
  totalCount: number;
  totalAmount: number;
  averageAmount: number;
  completedCount: number;
  pendingCount: number;
  processingCount: number;
  failedCount: number;
  cancelledCount: number;
  byStatus: Record<TransactionStatus, number>;
  byType: Record<TransactionType, number>;
  byCurrency: Record<string, { count: number; totalAmount: number }>;
  byCategory: Record<string, { count: number; totalAmount: number }>;
  totalFees: number;
  averageFees: number;
}

/**
 * 交易歷史報表資料
 */
export interface TransactionHistoryReport {
  period: string;
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  averageAmount: number;
  topCategories: Array<{ category: string; count: number; amount: number }>;
  dailyBreakdown: Array<{ date: string; count: number; amount: number }>;
}

@Injectable({ providedIn: 'root' })
export class OptimizedFirebaseTransactionRepository extends BaseFirebaseRepository<OptimizedTransaction> {
  constructor(firestore: Firestore) {
    super(firestore, 'transactions');
  }

  /**
   * 根據交易編號查找交易
   */
  async findByTransactionNumber(transactionNumber: string): Promise<OptimizedTransaction | null> {
    try {
      this.logOperation('findByTransactionNumber', { transactionNumber });

      const criteria: TransactionSearchCriteria = {
        filters: { transactionNumber }
      };

      const transactions = await this.findAll(criteria);
      const result = transactions.length > 0 ? transactions[0] : null;

      this.logOperation('findByTransactionNumber', { transactionNumber, found: !!result });
      return result;
    } catch (error) {
      this.logError('findByTransactionNumber', error, { transactionNumber });
      throw new RepositoryError('根據交易編號查找交易失敗', error as Error);
    }
  }

  /**
   * 根據帳戶 ID 查找交易
   */
  async findByAccountId(accountId: string): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByAccountId', { accountId });

      const criteria: TransactionSearchCriteria = {
        accountId,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByAccountId', { accountId, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByAccountId', error, { accountId });
      throw new RepositoryError('根據帳戶 ID 查找交易失敗', error as Error);
    }
  }

  /**
   * 根據用戶 ID 查找交易
   */
  async findByUserId(userId: string): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByUserId', { userId });

      const criteria: TransactionSearchCriteria = {
        userId,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByUserId', { userId, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByUserId', error, { userId });
      throw new RepositoryError('根據用戶 ID 查找交易失敗', error as Error);
    }
  }

  /**
   * 根據交易狀態查找交易
   */
  async findByStatus(status: TransactionStatus): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByStatus', { status });

      const criteria: TransactionSearchCriteria = {
        transactionStatus: status,
        sortBy: 'updatedAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByStatus', { status, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByStatus', error, { status });
      throw new RepositoryError('根據交易狀態查找交易失敗', error as Error);
    }
  }

  /**
   * 根據交易類型查找交易
   */
  async findByType(transactionType: TransactionType): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByType', { transactionType });

      const criteria: TransactionSearchCriteria = {
        transactionType,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByType', { transactionType, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByType', error, { transactionType });
      throw new RepositoryError('根據交易類型查找交易失敗', error as Error);
    }
  }

  /**
   * 根據金額範圍查找交易
   */
  async findByAmountRange(minAmount: number, maxAmount: number): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByAmountRange', { minAmount, maxAmount });

      const criteria: TransactionSearchCriteria = {
        minAmount,
        maxAmount,
        sortBy: 'amount',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByAmountRange', { minAmount, maxAmount, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByAmountRange', error, { minAmount, maxAmount });
      throw new RepositoryError('根據金額範圍查找交易失敗', error as Error);
    }
  }

  /**
   * 根據日期範圍查找交易
   */
  async findByDateRange(startDate: Date, endDate: Date): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByDateRange', { startDate, endDate });

      const criteria: TransactionSearchCriteria = {
        startDate,
        endDate,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByDateRange', { startDate, endDate, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByDateRange', error, { startDate, endDate });
      throw new RepositoryError('根據日期範圍查找交易失敗', error as Error);
    }
  }

  /**
   * 根據分類查找交易
   */
  async findByCategory(category: string): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByCategory', { category });

      const criteria: TransactionSearchCriteria = {
        category,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByCategory', { category, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByCategory', error, { category });
      throw new RepositoryError('根據分類查找交易失敗', error as Error);
    }
  }

  /**
   * 根據參考編號查找交易
   */
  async findByReferenceNumber(referenceNumber: string): Promise<OptimizedTransaction[]> {
    try {
      this.logOperation('findByReferenceNumber', { referenceNumber });

      const criteria: TransactionSearchCriteria = {
        referenceNumber,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      };

      const transactions = await this.findAll(criteria);

      this.logOperation('findByReferenceNumber', { referenceNumber, count: transactions.length });
      return transactions;
    } catch (error) {
      this.logError('findByReferenceNumber', error, { referenceNumber });
      throw new RepositoryError('根據參考編號查找交易失敗', error as Error);
    }
  }

  /**
   * 檢查交易編號是否存在
   */
  async existsByTransactionNumber(transactionNumber: string): Promise<boolean> {
    try {
      this.logOperation('existsByTransactionNumber', { transactionNumber });

      const transaction = await this.findByTransactionNumber(transactionNumber);
      const exists = !!transaction;

      this.logOperation('existsByTransactionNumber', { transactionNumber, exists });
      return exists;
    } catch (error) {
      this.logError('existsByTransactionNumber', error, { transactionNumber });
      throw new RepositoryError('檢查交易編號是否存在失敗', error as Error);
    }
  }

  /**
   * 獲取交易統計資料
   */
  async getStatistics(): Promise<TransactionStatistics> {
    try {
      this.logOperation('getStatistics', {});

      const allTransactions = await this.findAll();

      const statistics: TransactionStatistics = {
        totalCount: allTransactions.length,
        totalAmount: 0,
        averageAmount: 0,
        completedCount: 0,
        pendingCount: 0,
        processingCount: 0,
        failedCount: 0,
        cancelledCount: 0,
        byStatus: {
          [TransactionStatus.PENDING]: 0,
          [TransactionStatus.PROCESSING]: 0,
          [TransactionStatus.COMPLETED]: 0,
          [TransactionStatus.FAILED]: 0,
          [TransactionStatus.CANCELLED]: 0
        },
        byType: {
          [TransactionType.DEPOSIT]: 0,
          [TransactionType.WITHDRAWAL]: 0,
          [TransactionType.TRANSFER]: 0,
          [TransactionType.PAYMENT]: 0,
          [TransactionType.REFUND]: 0,
          [TransactionType.FEE]: 0
        },
        byCurrency: {},
        byCategory: {},
        totalFees: 0,
        averageFees: 0
      };

      // 計算統計資料
      let totalFeesCount = 0;
      allTransactions.forEach(transaction => {
        // 狀態統計
        statistics.byStatus[transaction.status]++;
        switch (transaction.status) {
          case TransactionStatus.COMPLETED:
            statistics.completedCount++;
            break;
          case TransactionStatus.PENDING:
            statistics.pendingCount++;
            break;
          case TransactionStatus.PROCESSING:
            statistics.processingCount++;
            break;
          case TransactionStatus.FAILED:
            statistics.failedCount++;
            break;
          case TransactionStatus.CANCELLED:
            statistics.cancelledCount++;
            break;
        }

        // 類型統計
        statistics.byType[transaction.transactionType]++;

        // 金額統計
        const amount = transaction.amount.getAmount();
        statistics.totalAmount += amount;

        // 貨幣統計
        const currency = transaction.amount.getCurrency();
        if (!statistics.byCurrency[currency]) {
          statistics.byCurrency[currency] = { count: 0, totalAmount: 0 };
        }
        statistics.byCurrency[currency].count++;
        statistics.byCurrency[currency].totalAmount += amount;

        // 分類統計
        if (transaction.category) {
          if (!statistics.byCategory[transaction.category]) {
            statistics.byCategory[transaction.category] = { count: 0, totalAmount: 0 };
          }
          statistics.byCategory[transaction.category].count++;
          statistics.byCategory[transaction.category].totalAmount += amount;
        }

        // 手續費統計
        if (transaction.fees) {
          statistics.totalFees += transaction.fees.getAmount();
          totalFeesCount++;
        }
      });

      // 計算平均值
      statistics.averageAmount = statistics.totalCount > 0 ? statistics.totalAmount / statistics.totalCount : 0;
      statistics.averageFees = totalFeesCount > 0 ? statistics.totalFees / totalFeesCount : 0;

      this.logOperation('getStatistics', { statistics });
      return statistics;
    } catch (error) {
      this.logError('getStatistics', error);
      throw new RepositoryError('獲取交易統計資料失敗', error as Error);
    }
  }

  /**
   * 獲取帳戶交易統計資料
   */
  async getAccountStatistics(accountId: string): Promise<TransactionStatistics> {
    try {
      this.logOperation('getAccountStatistics', { accountId });

      const accountTransactions = await this.findByAccountId(accountId);
      const statistics = this.calculateStatistics(accountTransactions);

      this.logOperation('getAccountStatistics', { accountId, statistics });
      return statistics;
    } catch (error) {
      this.logError('getAccountStatistics', error, { accountId });
      throw new RepositoryError('獲取帳戶交易統計資料失敗', error as Error);
    }
  }

  /**
   * 獲取用戶交易統計資料
   */
  async getUserStatistics(userId: string): Promise<TransactionStatistics> {
    try {
      this.logOperation('getUserStatistics', { userId });

      const userTransactions = await this.findByUserId(userId);
      const statistics = this.calculateStatistics(userTransactions);

      this.logOperation('getUserStatistics', { userId, statistics });
      return statistics;
    } catch (error) {
      this.logError('getUserStatistics', error, { userId });
      throw new RepositoryError('獲取用戶交易統計資料失敗', error as Error);
    }
  }

  /**
   * 獲取交易歷史報表
   */
  async getTransactionHistoryReport(
    startDate: Date,
    endDate: Date,
    accountId?: string,
    userId?: string
  ): Promise<TransactionHistoryReport> {
    try {
      this.logOperation('getTransactionHistoryReport', { startDate, endDate, accountId, userId });

      const criteria: TransactionSearchCriteria = {
        startDate,
        endDate,
        accountId,
        userId,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      };

      const transactions = await this.findAll(criteria);

      // 計算報表資料
      const totalTransactions = transactions.length;
      const completedTransactions = transactions.filter(t => t.isCompleted());
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount.getAmount(), 0);
      const successRate = totalTransactions > 0 ? (completedTransactions.length / totalTransactions) * 100 : 0;
      const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

      // 分類統計
      const categoryStats = new Map<string, { count: number; amount: number }>();
      transactions.forEach(transaction => {
        if (transaction.category) {
          const existing = categoryStats.get(transaction.category) || { count: 0, amount: 0 };
          categoryStats.set(transaction.category, {
            count: existing.count + 1,
            amount: existing.amount + transaction.amount.getAmount()
          });
        }
      });

      const topCategories = Array.from(categoryStats.entries())
        .map(([category, stats]) => ({ category, ...stats }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);

      // 每日統計
      const dailyStats = new Map<string, { count: number; amount: number }>();
      transactions.forEach(transaction => {
        const dateKey = transaction.createdAt.toISOString().split('T')[0];
        const existing = dailyStats.get(dateKey) || { count: 0, amount: 0 };
        dailyStats.set(dateKey, {
          count: existing.count + 1,
          amount: existing.amount + transaction.amount.getAmount()
        });
      });

      const dailyBreakdown = Array.from(dailyStats.entries())
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const report: TransactionHistoryReport = {
        period: `${startDate.toISOString().split('T')[0]} 到 ${endDate.toISOString().split('T')[0]}`,
        totalTransactions,
        totalAmount,
        successRate,
        averageAmount,
        topCategories,
        dailyBreakdown
      };

      this.logOperation('getTransactionHistoryReport', { startDate, endDate, report });
      return report;
    } catch (error) {
      this.logError('getTransactionHistoryReport', error, { startDate, endDate, accountId, userId });
      throw new RepositoryError('獲取交易歷史報表失敗', error as Error);
    }
  }

  /**
   * 應用交易特定的搜尋條件
   */
  protected override applySearchCriteria(q: Query<DocumentData>, criteria: SearchCriteria): Query<DocumentData> {
    const transactionCriteria = criteria as TransactionSearchCriteria;
    const constraints = [];

    // 帳戶 ID 篩選
    if (transactionCriteria.accountId) {
      constraints.push(where('accountId', '==', transactionCriteria.accountId));
    }

    // 用戶 ID 篩選
    if (transactionCriteria.userId) {
      constraints.push(where('userId', '==', transactionCriteria.userId));
    }

    // 交易編號篩選
    if (transactionCriteria.filters?.['transactionNumber']) {
      constraints.push(where('transactionNumber', '==', transactionCriteria.filters['transactionNumber']));
    }

    // 交易類型篩選
    if (transactionCriteria.transactionType) {
      constraints.push(where('transactionType', '==', transactionCriteria.transactionType));
    }

    // 交易狀態篩選
    if (transactionCriteria.transactionStatus) {
      constraints.push(where('status', '==', transactionCriteria.transactionStatus));
    }

    // 貨幣篩選
    if (transactionCriteria.currency) {
      constraints.push(where('currency', '==', transactionCriteria.currency));
    }

    // 分類篩選
    if (transactionCriteria.category) {
      constraints.push(where('category', '==', transactionCriteria.category));
    }

    // 參考編號篩選
    if (transactionCriteria.referenceNumber) {
      constraints.push(where('referenceNumber', '==', transactionCriteria.referenceNumber));
    }

    // 金額範圍篩選（注意：Firestore 的複合查詢限制）
    if (transactionCriteria.minAmount !== undefined) {
      constraints.push(where('amount', '>=', transactionCriteria.minAmount));
    }

    if (transactionCriteria.maxAmount !== undefined) {
      constraints.push(where('amount', '<=', transactionCriteria.maxAmount));
    }

    // 日期範圍篩選
    if (transactionCriteria.startDate) {
      constraints.push(where('createdAt', '>=', transactionCriteria.startDate));
    }

    if (transactionCriteria.endDate) {
      constraints.push(where('createdAt', '<=', transactionCriteria.endDate));
    }

    // 其他自定義篩選
    if (transactionCriteria.filters) {
      Object.entries(transactionCriteria.filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null && field !== 'transactionNumber') {
          constraints.push(where(field, '==', value));
        }
      });
    }

    // 排序
    const sortBy = transactionCriteria.sortBy || 'createdAt';
    const sortOrder = transactionCriteria.sortOrder || 'desc';
    constraints.push(orderBy(sortBy, sortOrder));

    return query(q, ...constraints);
  }

  /**
   * 從 Firestore 文件轉換為交易實體
   */
  protected fromFirestore(data: DocumentData, id: string): OptimizedTransaction {
    const transactionData: TransactionData = {
      id,
      transactionNumber: data['transactionNumber'],
      accountId: data['accountId'],
      userId: data['userId'],
      amount: new Money(data['amount'] || 0, data['currency'] || 'USD'),
      transactionType: data['transactionType'] as TransactionType,
      status: data['status'] as TransactionStatus,
      description: data['description'],
      referenceNumber: data['referenceNumber'],
      category: data['category'],
      fees: data['fees'] ? new Money(data['fees'], data['currency'] || 'USD') : undefined,
      notes: data['notes'],
      createdAt: data['createdAt']?.toDate() || new Date(),
      updatedAt: data['updatedAt']?.toDate() || new Date()
    };

    return new OptimizedTransaction(transactionData);
  }

  /**
   * 將交易實體轉換為 Firestore 文件
   */
  protected toFirestore(entity: OptimizedTransaction): DocumentData {
    return {
      transactionNumber: entity.transactionNumber,
      accountId: entity.accountId,
      userId: entity.userId,
      amount: entity.amount.getAmount(),
      currency: entity.amount.getCurrency(),
      transactionType: entity.transactionType,
      status: entity.status,
      description: entity.description,
      referenceNumber: entity.referenceNumber,
      category: entity.category,
      fees: entity.fees?.getAmount(),
      notes: entity.notes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }

  /**
   * 計算交易統計資料的輔助方法
   */
  private calculateStatistics(transactions: OptimizedTransaction[]): TransactionStatistics {
    const statistics: TransactionStatistics = {
      totalCount: transactions.length,
      totalAmount: 0,
      averageAmount: 0,
      completedCount: 0,
      pendingCount: 0,
      processingCount: 0,
      failedCount: 0,
      cancelledCount: 0,
      byStatus: {
        [TransactionStatus.PENDING]: 0,
        [TransactionStatus.PROCESSING]: 0,
        [TransactionStatus.COMPLETED]: 0,
        [TransactionStatus.FAILED]: 0,
        [TransactionStatus.CANCELLED]: 0
      },
      byType: {
        [TransactionType.DEPOSIT]: 0,
        [TransactionType.WITHDRAWAL]: 0,
        [TransactionType.TRANSFER]: 0,
        [TransactionType.PAYMENT]: 0,
        [TransactionType.REFUND]: 0,
        [TransactionType.FEE]: 0
      },
      byCurrency: {},
      byCategory: {},
      totalFees: 0,
      averageFees: 0
    };

    let totalFeesCount = 0;
    transactions.forEach(transaction => {
      // 狀態統計
      statistics.byStatus[transaction.status]++;
      switch (transaction.status) {
        case TransactionStatus.COMPLETED:
          statistics.completedCount++;
          break;
        case TransactionStatus.PENDING:
          statistics.pendingCount++;
          break;
        case TransactionStatus.PROCESSING:
          statistics.processingCount++;
          break;
        case TransactionStatus.FAILED:
          statistics.failedCount++;
          break;
        case TransactionStatus.CANCELLED:
          statistics.cancelledCount++;
          break;
      }

      // 類型統計
      statistics.byType[transaction.transactionType]++;

      // 金額統計
      const amount = transaction.amount.getAmount();
      statistics.totalAmount += amount;

      // 貨幣統計
      const currency = transaction.amount.getCurrency();
      if (!statistics.byCurrency[currency]) {
        statistics.byCurrency[currency] = { count: 0, totalAmount: 0 };
      }
      statistics.byCurrency[currency].count++;
      statistics.byCurrency[currency].totalAmount += amount;

      // 分類統計
      if (transaction.category) {
        if (!statistics.byCategory[transaction.category]) {
          statistics.byCategory[transaction.category] = { count: 0, totalAmount: 0 };
        }
        statistics.byCategory[transaction.category].count++;
        statistics.byCategory[transaction.category].totalAmount += amount;
      }

      // 手續費統計
      if (transaction.fees) {
        statistics.totalFees += transaction.fees.getAmount();
        totalFeesCount++;
      }
    });

    // 計算平均值
    statistics.averageAmount = statistics.totalCount > 0 ? statistics.totalAmount / statistics.totalCount : 0;
    statistics.averageFees = totalFeesCount > 0 ? statistics.totalFees / totalFeesCount : 0;

    return statistics;
  }
}
