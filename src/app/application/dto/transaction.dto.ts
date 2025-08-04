import { BaseCreateDto, BaseUpdateDto, BaseResponseDto, ListResponseDto, SearchCriteriaDto, BaseStatsDto, ExportDataDto } from './base.dto';
import { TransactionStatus, TransactionType } from '../../domain/entities/transaction.entity';

// Create Transaction DTO
// 擴展標準化的 BaseCreateDto
export interface CreateTransactionDto extends BaseCreateDto {
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
// 擴展標準化的 BaseUpdateDto
export interface UpdateTransactionDto extends BaseUpdateDto {
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
// 擴展標準化的 BaseResponseDto
export interface TransactionDto extends BaseResponseDto {
  transactionNumber: string;
  accountId: string;
  userId: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  type: TransactionType; // Alias for compatibility
  status: TransactionStatus;
  description: string;
  date: string; // Alias for createdAt (ISO 字串格式)
  referenceNumber?: string;
  category?: string;
  fees?: number;
  notes?: string;
  totalAmount: number;
}

// Transaction List DTO
// 使用標準化的 ListResponseDto 格式
export interface TransactionListDto extends ListResponseDto<TransactionDto> {
  // 繼承標準列表回應格式
  // 向後相容性：保留舊的屬性名稱
  transactions: TransactionDto[]; // Alias for items
  totalPages: number; // 向後相容性
  totalAmount?: number; // 交易特定的額外欄位
  averageAmount?: number;
}

// Transaction Search DTO
// 擴展標準化的 SearchCriteriaDto
export interface TransactionSearchDto extends SearchCriteriaDto {
  accountId?: string;
  userId?: string;
  transactionType?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  referenceNumber?: string;
  category?: string;
}

// Transaction Statistics DTO
// 擴展標準化的 BaseStatsDto
export interface TransactionStatsDto extends BaseStatsDto {
  totalCount: number; // Alias for compatibility with total
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
// 使用標準化的 ExportDataDto 格式
export interface TransactionExportDto extends ExportDataDto<TransactionDto> {
  // 繼承標準匯出格式
  statistics?: TransactionStatsDto; // 交易特定的統計資料
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
