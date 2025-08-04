import { Injectable, Inject } from '@angular/core';

import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { ConversionUtilitiesService } from '../../domain/services/conversion-utilities.service';
import { TransactionDomainService } from '../../domain/services/transaction-domain.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  UpdateTransactionStatusDto,
  TransactionDto,
  TransactionListDto,
  TransactionSearchDto,
  TransactionStatsDto,
  ProcessTransactionDto,
  TransactionValidationDto
} from '../dto/transaction.dto';

/**
 * Optimized Transaction Application Service - Coordination Logic Only
 * Focuses on orchestrating domain operations, repository interactions, and DTO mapping
 * Eliminates duplicate validation logic (handled by Domain Service)
 * Uses centralized conversion utilities
 */
@Injectable({ providedIn: 'root' })
export class TransactionApplicationService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private transactionRepository: TransactionRepository,
    private transactionDomainService: TransactionDomainService,
    private conversionUtilities: ConversionUtilitiesService
  ) {}

  /**
   * Coordinate transaction creation
   * Removed duplicate validation - handled by Domain Service
   */
  async createTransaction(createDto: CreateTransactionDto): Promise<TransactionDto> {
    try {
      // Delegate to domain service (handles all validation and creation logic)
      const transaction = this.transactionDomainService.createTransaction(
        createDto.accountId,
        createDto.userId,
        createDto.amount,
        createDto.transactionType,
        createDto.description,
        createDto.currency || 'USD',
        createDto.referenceNumber,
        createDto.category
      );

      // Persist entity
      await this.transactionRepository.save(transaction);

      // Return DTO
      return this.mapToDto(transaction);
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transaction by ID
  async getTransactionById(id: string): Promise<TransactionDto | null> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      return transaction ? this.mapToDto(transaction) : null;
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transaction by transaction number
  async getTransactionByNumber(transactionNumber: string): Promise<TransactionDto | null> {
    try {
      const transaction = await this.transactionRepository.findByTransactionNumber(transactionNumber);
      return transaction ? this.mapToDto(transaction) : null;
    } catch (error) {
      throw new Error(`Failed to get transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transactions by account
  async getTransactionsByAccount(accountId: string): Promise<TransactionDto[]> {
    try {
      const transactions = await this.transactionRepository.findByAccountId(accountId);
      return transactions.map(transaction => this.mapToDto(transaction));
    } catch (error) {
      throw new Error(`Failed to get transactions by account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transactions by user
  async getTransactionsByUser(userId: string): Promise<TransactionDto[]> {
    try {
      const transactions = await this.transactionRepository.findByUserId(userId);
      return transactions.map(transaction => this.mapToDto(transaction));
    } catch (error) {
      throw new Error(`Failed to get transactions by user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get all transactions with pagination
  async getAllTransactions(page = 1, pageSize = 10): Promise<TransactionListDto> {
    try {
      const allTransactions = await this.transactionRepository.findAll();
      const total = allTransactions.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTransactions = allTransactions.slice(startIndex, endIndex);
      const transactionDtos = paginatedTransactions.map(transaction => this.mapToDto(transaction));

      return {
        items: transactionDtos,
        transactions: transactionDtos, // Alias for backward compatibility
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page < Math.ceil(total / pageSize),
        hasPrevious: page > 1
      };
    } catch (error) {
      throw new Error(`Failed to get all transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Search transactions
  async searchTransactions(searchDto: TransactionSearchDto): Promise<TransactionListDto> {
    try {
      let transactions = await this.transactionRepository.findAll();

      // Apply filters
      if (searchDto.accountId) {
        transactions = transactions.filter(t => t.accountId === searchDto.accountId);
      }

      if (searchDto.userId) {
        transactions = transactions.filter(t => t.userId === searchDto.userId);
      }

      if (searchDto.status) {
        transactions = transactions.filter(t => t.status === searchDto.status);
      }

      if (searchDto.transactionType) {
        transactions = transactions.filter(t => t.transactionType === searchDto.transactionType);
      }

      if (searchDto.startDate && searchDto.endDate) {
        const startDate = new Date(searchDto.startDate);
        const endDate = new Date(searchDto.endDate);
        transactions = transactions.filter(t => t.createdAt >= startDate && t.createdAt <= endDate);
      }

      if (searchDto.minAmount !== undefined && searchDto.maxAmount !== undefined) {
        transactions = transactions.filter(t => t.amount >= searchDto.minAmount! && t.amount <= searchDto.maxAmount!);
      }

      if (searchDto.referenceNumber) {
        transactions = transactions.filter(t => t.referenceNumber?.includes(searchDto.referenceNumber!));
      }

      if (searchDto.category) {
        transactions = transactions.filter(t => t.category?.includes(searchDto.category!));
      }

      // Apply sorting
      if (searchDto.sortBy) {
        transactions.sort((a, b) => {
          const aValue = (a as any)[searchDto.sortBy!];
          const bValue = (b as any)[searchDto.sortBy!];

          if (aValue < bValue) return searchDto.sortOrder === 'desc' ? 1 : -1;
          if (aValue > bValue) return searchDto.sortOrder === 'desc' ? -1 : 1;
          return 0;
        });
      }

      // Apply pagination
      const page = searchDto.page || 1;
      const pageSize = searchDto.pageSize || 10;
      const total = transactions.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTransactions = transactions.slice(startIndex, endIndex);
      const transactionDtos = paginatedTransactions.map(transaction => this.mapToDto(transaction));

      return {
        items: transactionDtos,
        transactions: transactionDtos, // Alias for backward compatibility
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page < Math.ceil(total / pageSize),
        hasPrevious: page > 1
      };
    } catch (error) {
      throw new Error(`Failed to search transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update transaction
  async updateTransaction(id: string, updateDto: UpdateTransactionDto): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (!transaction.canBeModified()) {
        throw new Error('Transaction cannot be modified');
      }

      if (updateDto.description) {
        transaction.updateDescription(updateDto.description);
      }

      if (updateDto.category) {
        transaction.updateCategory(updateDto.category);
      }

      if (updateDto.referenceNumber) {
        // Delegate validation to domain service
        this.transactionDomainService.validateReferenceNumber(updateDto.referenceNumber);
        transaction.referenceNumber = updateDto.referenceNumber;
      }

      if (updateDto.notes) {
        transaction.notes = updateDto.notes;
      }

      await this.transactionRepository.save(transaction);
      return this.mapToDto(transaction);
    } catch (error) {
      throw new Error(`Failed to update transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Coordinate transaction status update
   * Removed duplicate validation - handled by Domain Service
   */
  async updateTransactionStatus(id: string, statusDto: UpdateTransactionStatusDto): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Use centralized conversion and delegate validation to domain service
      const newStatus = this.conversionUtilities.stringToTransactionStatus(statusDto.status);
      this.transactionDomainService.validateStatusTransition(transaction.status, newStatus);

      // Update status
      transaction.updateStatus(newStatus, statusDto.reason);

      // Persist changes
      await this.transactionRepository.save(transaction);
      return this.mapToDto(transaction);
    } catch (error) {
      throw new Error(`Failed to update transaction status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process transaction
  async processTransaction(processDto: ProcessTransactionDto): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findById(processDto.transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      switch (processDto.action) {
        case 'process':
          this.transactionDomainService.processTransaction(transaction);
          break;
        case 'complete':
          this.transactionDomainService.completeTransaction(transaction);
          break;
        case 'fail':
          transaction.failTransaction(processDto.reason);
          break;
        case 'cancel':
          this.transactionDomainService.cancelTransaction(transaction, processDto.reason);
          break;
        default:
          throw new Error('Invalid action');
      }

      await this.transactionRepository.save(transaction);
      return this.mapToDto(transaction);
    } catch (error) {
      throw new Error(`Failed to process transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete transaction
  async deleteTransaction(id: string): Promise<void> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.isCompleted()) {
        throw new Error('Completed transactions cannot be deleted');
      }

      await this.transactionRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get transaction statistics
  async getTransactionStats(): Promise<TransactionStatsDto> {
    try {
      const stats = await this.transactionRepository.getStatistics();
      return {
        ...stats,
        total: stats.totalCount, // Map totalCount to total for compatibility
        processingCount: stats.byStatus[TransactionStatus.PROCESSING] || 0,
        failedCount: stats.byStatus[TransactionStatus.FAILED] || 0,
        cancelledCount: stats.byStatus[TransactionStatus.CANCELLED] || 0
      };
    } catch (error) {
      throw new Error(`Failed to get transaction statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get account transaction statistics
  async getAccountTransactionStats(accountId: string): Promise<TransactionStatsDto> {
    try {
      const stats = await this.transactionRepository.getAccountStatistics(accountId);
      return {
        ...stats,
        total: stats.totalCount, // Map totalCount to total for compatibility
        processingCount: stats.byStatus[TransactionStatus.PROCESSING] || 0,
        failedCount: stats.byStatus[TransactionStatus.FAILED] || 0,
        cancelledCount: stats.byStatus[TransactionStatus.CANCELLED] || 0
      };
    } catch (error) {
      throw new Error(`Failed to get account transaction statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get user transaction statistics
  async getUserTransactionStats(userId: string): Promise<TransactionStatsDto> {
    try {
      const stats = await this.transactionRepository.getUserStatistics(userId);
      return {
        ...stats,
        total: stats.totalCount, // Map totalCount to total for compatibility
        processingCount: stats.byStatus[TransactionStatus.PROCESSING] || 0,
        failedCount: stats.byStatus[TransactionStatus.FAILED] || 0,
        cancelledCount: stats.byStatus[TransactionStatus.CANCELLED] || 0
      };
    } catch (error) {
      throw new Error(`Failed to get user transaction statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Coordinate transaction validation with business warnings
   * Domain Service handles core validation, Application Service adds business warnings
   */
  validateTransactionCreation(createDto: CreateTransactionDto): TransactionValidationDto {
    try {
      // Delegate core validation to domain service
      this.transactionDomainService.validateTransactionCreation(
        createDto.accountId,
        createDto.userId,
        createDto.amount,
        createDto.transactionType,
        createDto.description
      );

      // Add application-level warnings
      const warnings: string[] = [];

      if (createDto.amount > 10000) {
        warnings.push('High transaction amount detected');
      }

      if (createDto.transactionType === TransactionType.WITHDRAWAL && createDto.amount > 5000) {
        warnings.push('Large withdrawal amount detected');
      }

      return {
        isValid: true,
        errors: [],
        warnings
      };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
        warnings: []
      };
    }
  }

  // Calculate transaction fees
  calculateTransactionFees(transactionType: TransactionType, amount: number, currency = 'USD'): number {
    return this.transactionDomainService.calculateFees(transactionType, amount, currency);
  }

  // Removed generateId() - now handled by SharedUtilitiesService in Domain Service

  private mapToDto(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      transactionNumber: transaction.transactionNumber,
      accountId: transaction.accountId,
      userId: transaction.userId,
      amount: transaction.amount,
      currency: transaction.currency,
      transactionType: transaction.transactionType,
      type: transaction.transactionType, // Alias for compatibility
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString(),
      date: transaction.createdAt.toISOString(), // Alias for compatibility
      referenceNumber: transaction.referenceNumber,
      category: transaction.category,
      fees: transaction.fees,
      notes: transaction.notes,
      totalAmount: transaction.getTotalAmount()
    };
  }

  /**
   * Centralized error handling
   */
  private handleError(operation: string, error: any): Error {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`Failed to ${operation}: ${message}`);
  }
}
