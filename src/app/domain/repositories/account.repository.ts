import { Account, AccountStatus, AccountType } from '../entities/account.entity';

/**
 * Account repository interface
 * Defines the contract for account data persistence operations
 */
export interface AccountRepository {
  /**
   * Find account by ID
   * @param id Account ID
   * @returns Account or null if not found
   */
  findById(id: string): Promise<Account | null>;

  /**
   * Find account by account number
   * @param accountNumber Account number
   * @returns Account or null if not found
   */
  findByAccountNumber(accountNumber: string): Promise<Account | null>;

  /**
   * Find accounts by user ID
   * @param userId User ID
   * @returns Array of accounts
   */
  findByUserId(userId: string): Promise<Account[]>;

  /**
   * Find accounts by status
   * @param status Account status
   * @returns Array of accounts
   */
  findByStatus(status: AccountStatus): Promise<Account[]>;

  /**
   * Find accounts by type
   * @param accountType Account type
   * @returns Array of accounts
   */
  findByType(accountType: AccountType): Promise<Account[]>;

  /**
   * Find all accounts
   * @param status Optional status filter
   * @param accountType Optional account type filter
   * @returns Array of accounts
   */
  findAll(status?: AccountStatus, accountType?: AccountType): Promise<Account[]>;

  /**
   * Save account (create or update)
   * @param account Account to save
   */
  save(account: Account): Promise<void>;

  /**
   * Delete account by ID
   * @param id Account ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if account exists by account number
   * @param accountNumber Account number
   * @returns True if account exists
   */
  existsByAccountNumber(accountNumber: string): Promise<boolean>;

  /**
   * Count total accounts
   * @param status Optional status filter
   * @returns Total count
   */
  count(status?: AccountStatus): Promise<number>;

  /**
   * Find accounts with balance range
   * @param minBalance Minimum balance
   * @param maxBalance Maximum balance
   * @returns Array of accounts
   */
  findByBalanceRange(minBalance: number, maxBalance: number): Promise<Account[]>;

  /**
   * Find accounts by currency
   * @param currency Currency code
   * @returns Array of accounts
   */
  findByCurrency(currency: string): Promise<Account[]>;

  /**
   * Find accounts created within date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Array of accounts
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Account[]>;

  /**
   * Get account statistics
   * @returns Account statistics
   */
  getStatistics(): Promise<{
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    closed: number;
    totalBalance: number;
    averageBalance: number;
  }>;
} 