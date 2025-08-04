import { Injectable, Inject } from '@angular/core';
import { ACCOUNT_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { Account } from '../../domain/entities/account.entity';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { AccountDomainService } from '../../domain/services/account-domain.service';
import { ConversionUtilitiesService } from '../../domain/services/conversion-utilities.service';
import { AccountType } from '../../domain/value-objects/account/account-type.value-object';
import { AccountStatus } from '../../domain/value-objects/account/account-status.value-object';
import {
  CreateAccountDto,
  UpdateAccountDto,
  UpdateAccountStatusDto,
  DepositDto,
  WithdrawalDto,
  TransferDto,
  AccountDto,
  AccountListDto,
  AccountSearchDto,
  AccountStatsDto,
  AccountSummaryDto,
  AccountBalanceDto,
  AccountTransactionDto,
  AccountTransactionListDto
} from '../dto/account.dto';

/**
 * Optimized Account Application Service - Coordination Logic Only
 * Focuses on orchestrating domain operations, repository interactions, and DTO mapping
 * Eliminates duplicate validation logic (handled by Domain Service)
 * Uses centralized conversion utilities
 */
@Injectable({ providedIn: 'root' })
export class AccountApplicationService {
  constructor(
    @Inject(ACCOUNT_REPOSITORY) private accountRepository: AccountRepository,
    private accountDomainService: AccountDomainService,
    private conversionUtilities: ConversionUtilitiesService
  ) { }

  /**
   * Coordinate account creation
   * Removed duplicate validation - handled by Domain Service
   */
  async createAccount(createAccountDto: CreateAccountDto): Promise<AccountDto> {
    try {
      // Use centralized conversion utilities
      const accountType = this.conversionUtilities.stringToAccountType(createAccountDto.accountType);

      // Delegate to domain service (handles all validation and creation logic)
      const account = this.accountDomainService.createAccount(
        createAccountDto.accountNumber,
        createAccountDto.accountName,
        accountType,
        createAccountDto.userId,
        createAccountDto.initialBalance || 0,
        createAccountDto.currency || 'USD',
        createAccountDto.description
      );

      // Persist entity
      await this.accountRepository.save(account);

      // Return DTO
      return this.mapToDto(account);
    } catch (error) {
      throw this.handleError('create account', error);
    }
  }

  /**
   * Get account by ID
   * @param id Account ID
   * @returns Account DTO or null
   */
  async getAccountById(id: string): Promise<AccountDto | null> {
    try {
      const account = await this.accountRepository.findById(id);
      return account ? this.mapToDto(account) : null;
    } catch (error) {
      throw new Error(`Failed to get account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account by account number
   * @param accountNumber Account number
   * @returns Account DTO or null
   */
  async getAccountByNumber(accountNumber: string): Promise<AccountDto | null> {
    try {
      const account = await this.accountRepository.findByAccountNumber(accountNumber);
      return account ? this.mapToDto(account) : null;
    } catch (error) {
      throw new Error(`Failed to get account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get accounts by user ID
   * @param userId User ID
   * @returns Array of account DTOs
   */
  async getAccountsByUserId(userId: string): Promise<AccountDto[]> {
    try {
      const accounts = await this.accountRepository.findByUserId(userId);
      return accounts.map(account => this.mapToDto(account));
    } catch (error) {
      throw new Error(`Failed to get user accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update account information
   * @param id Account ID
   * @param updateAccountDto Update data
   * @returns Updated account DTO
   */
  async updateAccount(id: string, updateAccountDto: UpdateAccountDto): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      if (updateAccountDto.accountName) {
        this.accountDomainService.updateAccountInfo(account, updateAccountDto.accountName, updateAccountDto.description);
      }

      await this.accountRepository.save(account);
      return this.mapToDto(account);
    } catch (error) {
      throw new Error(`Failed to update account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update account status
   * @param id Account ID
   * @param updateStatusDto Status update data
   * @returns Updated account DTO
   */
  async updateAccountStatus(id: string, updateStatusDto: UpdateAccountStatusDto): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      const newStatus = this.conversionUtilities.stringToAccountStatus(updateStatusDto.status);
      this.accountDomainService.updateAccountStatus(account, newStatus);
      await this.accountRepository.save(account);

      return this.mapToDto(account);
    } catch (error) {
      throw new Error(`Failed to update account status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process account deposit
   * @param id Account ID
   * @param depositDto Deposit data
   * @returns Updated account DTO
   */
  async deposit(id: string, depositDto: DepositDto): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      this.accountDomainService.processDeposit(account, depositDto.amount);
      await this.accountRepository.save(account);

      return this.mapToDto(account);
    } catch (error) {
      throw new Error(`Failed to process deposit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process account withdrawal
   * @param id Account ID
   * @param withdrawalDto Withdrawal data
   * @returns Updated account DTO
   */
  async withdraw(id: string, withdrawalDto: WithdrawalDto): Promise<AccountDto> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      this.accountDomainService.processWithdrawal(account, withdrawalDto.amount);
      await this.accountRepository.save(account);

      return this.mapToDto(account);
    } catch (error) {
      throw new Error(`Failed to process withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process account transfer
   * @param sourceAccountId Source account ID
   * @param transferDto Transfer data
   * @returns Updated source account DTO
   */
  async transfer(sourceAccountId: string, transferDto: TransferDto): Promise<AccountDto> {
    try {
      const sourceAccount = await this.accountRepository.findById(sourceAccountId);
      if (!sourceAccount) {
        throw new Error('Source account not found');
      }

      const targetAccount = await this.accountRepository.findById(transferDto.targetAccountId);
      if (!targetAccount) {
        throw new Error('Target account not found');
      }

      this.accountDomainService.processTransfer(sourceAccount, targetAccount, transferDto.amount);

      await this.accountRepository.save(sourceAccount);
      await this.accountRepository.save(targetAccount);

      return this.mapToDto(sourceAccount);
    } catch (error) {
      throw new Error(`Failed to process transfer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete account
   * @param id Account ID
   */
  async deleteAccount(id: string): Promise<void> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      if (!account.balance.isZero()) {
        throw new Error('Cannot delete account with non-zero balance');
      }

      await this.accountRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all accounts with search and pagination
   * @param searchDto Search parameters
   * @returns Account list DTO
   */
  async getAllAccounts(searchDto?: AccountSearchDto): Promise<AccountListDto> {
    try {
      const page = searchDto?.page || 1;
      const pageSize = searchDto?.pageSize || 10;
      const offset = (page - 1) * pageSize;

      // Get all accounts and filter
      const status = searchDto?.status ? this.conversionUtilities.stringToAccountStatus(searchDto.status) : undefined;
      const accountType = searchDto?.accountType ? this.conversionUtilities.stringToAccountType(searchDto.accountType) : undefined;
      let accounts = await this.accountRepository.findAll(status, accountType);

      // Apply additional filters
      accounts = this.filterAccounts(accounts, searchDto);

      const total = accounts.length;
      const paginatedAccounts = accounts.slice(offset, offset + pageSize);

      const accountDtos = paginatedAccounts.map(account => this.mapToDto(account));

      return {
        items: accountDtos,
        accounts: accountDtos, // Alias for backward compatibility
        total,
        page,
        pageSize,
        hasNext: (page * pageSize) < total,
        hasPrevious: page > 1
      };
    } catch (error) {
      throw new Error(`Failed to get accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account statistics
   * @returns Account statistics DTO
   */
  async getAccountStats(): Promise<AccountStatsDto> {
    try {
      const allAccounts = await this.accountRepository.findAll();

      const total = allAccounts.length;
      const active = allAccounts.filter(acc => acc.status.getValue() === 'ACTIVE').length;
      const inactive = allAccounts.filter(acc => acc.status.getValue() === 'INACTIVE').length;
      const suspended = allAccounts.filter(acc => acc.status.getValue() === 'SUSPENDED').length;
      const closed = allAccounts.filter(acc => acc.status.getValue() === 'CLOSED').length;

      const totalBalance = allAccounts.reduce((sum, acc) => sum + acc.balance.getAmount(), 0);
      const averageBalance = total > 0 ? totalBalance / total : 0;

      // Calculate additional statistics
      const byType: { [key: string]: number } = {
        'CHECKING': 0,
        'SAVINGS': 0,
        'CREDIT': 0,
        'INVESTMENT': 0
      };

      allAccounts.forEach(account => {
        const typeKey = account.accountType.getValue();
        byType[typeKey] = (byType[typeKey] || 0) + 1;
      });

      const byCurrency: { [currency: string]: number } = {};
      allAccounts.forEach(account => {
        const currency = account.currency.getValue();
        byCurrency[currency] = (byCurrency[currency] || 0) + 1;
      });

      return {
        total,
        totalAccounts: total,
        active,
        inactive,
        suspended,
        closed,
        totalBalance,
        averageBalance,
        byType,
        byCurrency
      };
    } catch (error) {
      throw new Error(`Failed to get account stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account balance
   * @param id Account ID
   * @returns Account balance DTO
   */
  async getAccountBalance(id: string): Promise<AccountBalanceDto> {
    try {
      const account = await this.accountRepository.findById(id);
      if (!account) {
        throw new Error('Account not found');
      }

      return {
        accountId: account.id,
        accountNumber: account.accountNumber.getValue(),
        accountName: account.accountName.getValue(),
        balance: account.balance.getAmount(),
        currency: account.currency.getValue(),
        lastTransactionDate: account.lastTransactionDate
      };
    } catch (error) {
      throw new Error(`Failed to get account balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Filter accounts based on search criteria
   * @param accounts Accounts to filter
   * @param searchDto Search criteria
   * @returns Filtered accounts
   */
  private filterAccounts(accounts: Account[], searchDto?: AccountSearchDto): Account[] {
    if (!searchDto) return accounts;

    return accounts.filter(account => {
      if (searchDto.userId && account.userId.getValue() !== searchDto.userId) return false;
      if (searchDto.accountNumber && !account.accountNumber.getValue().includes(searchDto.accountNumber)) return false;
      if (searchDto.accountName && !account.accountName.getValue().toLowerCase().includes(searchDto.accountName.toLowerCase())) return false;
      if (searchDto.minBalance !== undefined && account.balance.getAmount() < searchDto.minBalance) return false;
      if (searchDto.maxBalance !== undefined && account.balance.getAmount() > searchDto.maxBalance) return false;
      if (searchDto.currency && account.currency.getValue() !== searchDto.currency) return false;
      return true;
    });
  }

  /**
   * Map domain entity to DTO
   * @param account Account entity
   * @returns Account DTO
   */
  private mapToDto(account: Account): AccountDto {
    return {
      id: account.id,
      accountNumber: account.accountNumber.getValue(),
      accountName: account.accountName.getValue(),
      name: account.accountName.getValue(), // Alias for compatibility
      accountType: account.accountType.getValue(),
      balance: account.balance.getAmount(),
      currency: account.currency.getValue(),
      status: account.status.getValue(),
      userId: account.userId.getValue(),
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString(),
      description: account.description,
      lastTransactionDate: account.lastTransactionDate?.toISOString()
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