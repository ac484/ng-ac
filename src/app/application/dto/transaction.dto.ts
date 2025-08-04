import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

// Create Transaction DTO
export interface CreateTransactionDto {
  accountId: string;
  userId: string;
  amount: number;
  currency?: string;
  transactionType: TransactionType;
  type?: TransactionType; // Alias for compatibility
  description: string;
  referenceNumber?: string;
  category?: string;
}

// Update Transaction DTO
export interface UpdateTransactionDto {
  id?: string; // Alias for compatibility
  description?: string;
  category?: string;
  referenceNumber?: string;
  notes?: string;
}

// Update Transaction Status DTO
export interface UpdateTransactionStatusDto {
  status: TransactionStatus;
  reason?: string;
}

// Transaction DTO
export interface TransactionDto {
  id: string;
  transactionNumber: string;
  accountId: string;
  userId: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  type: TransactionType; // Alias for compatibility
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date; // Alias for createdAt
  referenceNumber?: string;
  category?: string;
  fees?: number;
  notes?: string;
  totalAmount: number;
}

// Transaction List DTO
export interface TransactionListDto {
  transactions: TransactionDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Transaction Search DTO
export interface TransactionSearchDto {
  accountId?: string;
  userId?: string;
  status?: TransactionStatus;
  transactionType?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  referenceNumber?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Transaction Statistics DTO
export interface TransactionStatsDto {
  totalCount: number;
  totalAmount: number;
  byStatus: Record<TransactionStatus, number>;
  byType: Record<TransactionType, number>;
  averageAmount: number;
  completedCount: number;
  pendingCount: number;
  processingCount: number;
  failedCount: number;
  cancelledCount: number;
}

// Transaction Summary DTO
export interface TransactionSummaryDto {
  id: string;
  transactionNumber: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: Date;
  totalAmount: number;
}

// Transaction Details DTO
export interface TransactionDetailsDto extends TransactionDto {
  accountName?: string;
  userName?: string;
  userEmail?: string;
}

// Transaction Export DTO
export interface TransactionExportDto {
  transactions: TransactionDto[];
  exportDate: Date;
  filters: TransactionSearchDto;
  statistics: TransactionStatsDto;
}

// Transaction Processing DTO
export interface ProcessTransactionDto {
  transactionId: string;
  action: 'process' | 'complete' | 'fail' | 'cancel';
  reason?: string;
}

// Transaction Fee DTO
export interface TransactionFeeDto {
  transactionType: TransactionType;
  amount: number;
  currency: string;
  feeAmount: number;
  feePercentage: number;
}

// Transaction Validation DTO
export interface TransactionValidationDto {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Transaction Status Change DTO
export interface TransactionStatusChangeDto {
  transactionId: string;
  oldStatus: TransactionStatus;
  newStatus: TransactionStatus;
  reason?: string;
  changedAt: Date;
  changedBy: string;
}

// Transaction Category DTO
export interface TransactionCategoryDto {
  category: string;
  count: number;
  totalAmount: number;
  averageAmount: number;
}

// Transaction Type Summary DTO
export interface TransactionTypeSummaryDto {
  type: TransactionType;
  count: number;
  totalAmount: number;
  averageAmount: number;
  completedCount: number;
  pendingCount: number;
}

// Transaction Date Range DTO
export interface TransactionDateRangeDto {
  startDate: Date;
  endDate: Date;
  count: number;
  totalAmount: number;
  averageAmount: number;
  byStatus: Record<TransactionStatus, number>;
  byType: Record<TransactionType, number>;
} 