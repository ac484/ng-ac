import { AccountStatus, AccountType } from '../../domain/entities/account.entity';

// Re-export domain types for convenience
export { AccountStatus, AccountType };

/**
 * DTO for creating a new account
 */
export interface CreateAccountDto {
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
 */
export interface UpdateAccountDto {
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
 */
export interface AccountDto {
  id: string;
  accountNumber: string;
  accountName: string;
  name: string; // Alias for accountName
  accountType: string;
  balance: number;
  currency: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  lastTransactionDate?: Date;
}

/**
 * DTO for account list response
 */
export interface AccountListDto {
  accounts: AccountDto[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * DTO for account search parameters
 */
export interface AccountSearchDto {
  status?: string;
  accountType?: string;
  userId?: string;
  accountNumber?: string;
  accountName?: string;
  minBalance?: number;
  maxBalance?: number;
  currency?: string;
  page?: number;
  pageSize?: number;
}

/**
 * DTO for account statistics
 */
export interface AccountStatsDto {
  total: number;
  totalAccounts: number; // Alias for compatibility
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