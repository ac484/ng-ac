import { Injectable, Inject } from '@angular/core';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { Transaction, TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
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

@Injectable({ providedIn: 'root' })
export class TransactionApplicationService {
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private transactionRepository: TransactionRepository,
    private transactionDomainService: TransactionDomainService
  ) {}

  // Create a new transaction
  async createTransaction(createDto: CreateTransactionDto): Promise<TransactionDto> {
    try {
      // Validate the transaction creation
      const validation = this.transactionDomainService.validateTransactionCreation(
        createDto.accountId,
        createDto.userId,
        createDto.amount,
        createDto.transactionType,
        createDto.description
      );

      if (!validation.isValid) {
        throw new Error(`Transaction creation failed: ${validation.errors.join(', ')}`);
      }

      // Generate unique ID
      const id = this.generateId();

      // Create transaction using domain service
      const transaction = this.transactionDomainService.createTransaction(
        id,
        createDto.accountId,
        createDto.userId,
        createDto.amount,
        createDto.transactionType,
        createDto.description,
        createDto.currency || 'USD',
        createDto.referenceNumber,
        createDto.category
      );

      // Save to repository
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
  async getAllTransactions(page: number = 1, pageSize: number = 10): Promise<TransactionListDto> {
    try {
      const allTransactions = await this.transactionRepository.findAll();
      const total = allTransactions.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

      return {
        transactions: paginatedTransactions.map(transaction => this.mapToDto(transaction)),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
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
        transactions = transactions.filter(t => 
          t.createdAt >= searchDto.startDate! && t.createdAt <= searchDto.endDate!
        );
      }

      if (searchDto.minAmount !== undefined && searchDto.maxAmount !== undefined) {
        transactions = transactions.filter(t => 
          t.amount >= searchDto.minAmount! && t.amount <= searchDto.maxAmount!
        );
      }

      if (searchDto.referenceNumber) {
        transactions = transactions.filter(t => 
          t.referenceNumber?.includes(searchDto.referenceNumber!)
        );
      }

      if (searchDto.category) {
        transactions = transactions.filter(t => 
          t.category?.includes(searchDto.category!)
        );
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

      return {
        transactions: paginatedTransactions.map(transaction => this.mapToDto(transaction)),
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
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
        const validation = this.transactionDomainService.validateReferenceNumber(updateDto.referenceNumber);
        if (!validation.isValid) {
          throw new Error(`Reference number validation failed: ${validation.errors.join(', ')}`);
        }
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

  // Update transaction status
  async updateTransactionStatus(id: string, statusDto: UpdateTransactionStatusDto): Promise<TransactionDto> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Validate status transition
      const validation = this.transactionDomainService.validateStatusTransition(
        transaction.status,
        statusDto.status
      );

      if (!validation.isValid) {
        throw new Error(`Status transition validation failed: ${validation.errors.join(', ')}`);
      }

      transaction.updateStatus(statusDto.status, statusDto.reason);
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
        processingCount: stats.byStatus[TransactionStatus.PROCESSING] || 0,
        failedCount: stats.byStatus[TransactionStatus.FAILED] || 0,
        cancelledCount: stats.byStatus[TransactionStatus.CANCELLED] || 0
      };
    } catch (error) {
      throw new Error(`Failed to get user transaction statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate transaction creation
  validateTransactionCreation(createDto: CreateTransactionDto): TransactionValidationDto {
    const validation = this.transactionDomainService.validateTransactionCreation(
      createDto.accountId,
      createDto.userId,
      createDto.amount,
      createDto.transactionType,
      createDto.description
    );

    const warnings: string[] = [];

    // Add warnings for high amounts
    if (createDto.amount > 10000) {
      warnings.push('High transaction amount detected');
    }

    // Add warnings for specific transaction types
    if (createDto.transactionType === TransactionType.WITHDRAWAL && createDto.amount > 5000) {
      warnings.push('Large withdrawal amount detected');
    }

    return {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings
    };
  }

  // Calculate transaction fees
  calculateTransactionFees(
    transactionType: TransactionType,
    amount: number,
    currency: string = 'USD'
  ): number {
    return this.transactionDomainService.calculateFees(transactionType, amount, currency);
  }

  // Private helper methods
  private generateId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

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
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      date: transaction.createdAt, // Alias for compatibility
      referenceNumber: transaction.referenceNumber,
      category: transaction.category,
      fees: transaction.fees,
      notes: transaction.notes,
      totalAmount: transaction.getTotalAmount()
    };
  }
} 