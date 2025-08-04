import { AccountStatus, AccountType } from '../../domain/entities/account.entity';
import {
  BaseCreateDto,
  BaseUpdateDto,
  BaseResponseDto,
  ListResponseDto,
  SearchCriteriaDto,
  BaseStatsDto
} from './base.dto';

// Re-export domain types for convenience
export { AccountStatus, AccountType };

/**
 * DTO for creating a new account
 * 擴展標準化的 BaseCreateDto
 */
export interface CreateAccountDto extends BaseCreateDto {
  accountNumber: string;
  accountName: string;
  accountType: string;
  userId: string;
  initialBalance?: number;
  currency?: string;
  description?: string;
}

/**
 * DTO for updating account information
 * 擴展標準化的 BaseUpdateDto
 */
export interface UpdateAccountDto extends BaseUpdateDto {
  accountName?: string;
  description?: string;
}

/**
 * DTO for updating account status
 */
export interface UpdateAccountStatusDto {
  status: string;
}

/**
 * DTO for account deposit operation
 */
export interface DepositDto {
  amount: number;
  description?: string;
}

/**
 * DTO for account withdrawal operation
 */
export interface WithdrawalDto {
  amount: number;
  description?: string;
}

/**
 * DTO for account transfer operation
 */
export interface TransferDto {
  targetAccountId: string;
  amount: number;
  description?: string;
}

/**
 * DTO for account data transfer
 * 擴展標準化的 BaseResponseDto
 */
export interface AccountDto extends BaseResponseDto {
  accountNumber: string;
  accountName: string;
  name: string; // Alias for accountName (向後相容性)
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  userId: string;
  description?: string;
  lastTransactionDate?: string; // ISO 字串格式
}

/**
 * DTO for account list response
 * 使用標準化的 ListResponseDto 格式
 */
export interface AccountListDto extends ListResponseDto<AccountDto> {
  // 繼承標準列表回應格式
  // 向後相容性：保留舊的屬性名稱
  accounts: AccountDto[]; // Alias for items
  // 可以添加帳戶特定的額外欄位
  totalBalance?: number;
  averageBalance?: number;
}

/**
 * DTO for account search parameters
 * 擴展標準化的 SearchCriteriaDto
 */
export interface AccountSearchDto extends SearchCriteriaDto {
  accountType?: string;
  userId?: string;
  accountNumber?: string;
  accountName?: string;
  minBalance?: number;
  maxBalance?: number;
  currency?: string;
}

/**
 * DTO for account statistics
 * 擴展標準化的 BaseStatsDto
 */
export interface AccountStatsDto extends BaseStatsDto {
  totalAccounts: number; // Alias for compatibility with total
  active: number;
  inactive: number;
  suspended: number;
  closed: number;
  totalBalance: number;
  averageBalance: number;
  byType: {
    [key: string]: number;
  };
  byCurrency: {
    [currency: string]: number;
  };
}

/**
 * DTO for account summary
 */
export interface AccountSummaryDto {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  lastTransactionDate?: Date;
}

/**
 * DTO for account balance information
 */
export interface AccountBalanceDto {
  accountId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  lastTransactionDate?: Date;
}

/**
 * DTO for account transaction history
 */
export interface AccountTransactionDto {
  id: string;
  accountId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number;
  description?: string;
  timestamp: Date;
  targetAccountId?: string;
}

/**
 * DTO for account transaction list
 */
export interface AccountTransactionListDto {
  transactions: AccountTransactionDto[];
  total: number;
  page: number;
  pageSize: number;
} 