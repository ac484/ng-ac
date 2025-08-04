/**
 * 重構的帳戶應用服務
 * 使用新的 BaseApplicationService，整合 Money 值物件的業務邏輯，簡化餘額計算和驗證邏輯
 */

import { Injectable, Inject } from '@angular/core';

import { BaseApplicationService, Repository, ValidationError, NotFoundError, ApplicationError } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import { OptimizedAccount, AccountType, AccountStatus } from '../../domain/entities/optimized-account.entity';
import { BaseCreateDto, BaseUpdateDto, BaseResponseDto, SearchCriteriaDto } from '../dto/base.dto';

/**
 * 帳戶創建 DTO
 */
export interface CreateAccountDto extends BaseCreateDto {
  userId: string;
  accountNumber?: string; // 可選，如果不提供會自動生成
  name: string;
  type: AccountType;
  initialBalance?: number;
  currency?: string;
  description?: string;
}

/**
 * 帳戶更新 DTO
 */
export interface UpdateAccountDto extends BaseUpdateDto {
  name?: string;
  description?: string;
}

/**
 * 帳戶回應 DTO
 */
export interface AccountResponseDto extends BaseResponseDto {
  userId: string;
  accountNumber: string;
  name: string;
  type: AccountType;
  balance: number;
  formattedBalance: string;
  currency: string;
  status: AccountStatus;
  statusText: string;
  isActive: boolean;
  canPerformTransactions: boolean;
  description?: string;
  lastTransactionDate?: string;
}

/**
 * 帳戶搜尋條件 DTO
 */
export interface AccountSearchCriteriaDto extends SearchCriteriaDto {
  userId?: string;
  accountNumber?: string;
  accountName?: string;
  accountType?: AccountType;
  accountStatus?: AccountStatus;
  minBalance?: number;
  maxBalance?: number;
  currency?: string;
}

/**
 * 存款 DTO
 */
export interface DepositDto {
  amount: number;
  description?: string;
}

/**
 * 提款 DTO
 */
export interface WithdrawDto {
  amount: number;
  description?: string;
}

/**
 * 轉帳 DTO
 */
export interface TransferDto {
  targetAccountId: string;
  amount: number;
  description?: string;
}

/**
 * 帳戶狀態更新 DTO
 */
export interface UpdateAccountStatusDto {
  status: AccountStatus;
}

/**
 * 轉帳結果 DTO
 */
export interface TransferResultDto {
  sourceAccount: AccountResponseDto;
  targetAccount: AccountResponseDto;
  transferAmount: number;
  timestamp: string;
}

/**
 * 帳戶統計 DTO
 */
export interface AccountStatsDto {
  totalAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  suspendedAccounts: number;
  closedAccounts: number;
  totalBalance: number;
  formattedTotalBalance: string;
  averageBalance: number;
  formattedAverageBalance: string;
  accountsByType: Record<AccountType, number>;
  accountsByCurrency: Record<string, { count: number; totalBalance: number; formattedBalance: string }>;
}

/**
 * 重構的帳戶應用服務
 * 繼承自 BaseApplicationService，專注於帳戶特定的業務邏輯
 */
@Injectable({
  providedIn: 'root'
})
export class RefactoredAccountApplicationService extends BaseApplicationService<
  OptimizedAccount,
  CreateAccountDto,
  UpdateAccountDto,
  AccountResponseDto
> {
  constructor(@Inject('ACCOUNT_REPOSITORY') repository: Repository<OptimizedAccount>, errorHandler: ErrorHandlerService) {
    super(repository, errorHandler, 'AccountApplicationService');
  }

  // 實作基礎類別的抽象方法

  /**
   * 創建帳戶實體
   */
  protected async createEntity(dto: CreateAccountDto): Promise<OptimizedAccount> {
    try {
      if (dto.accountNumber) {
        // 檢查帳戶號碼是否已存在
        const existingAccount = await this.findByAccountNumber(dto.accountNumber);
        if (existingAccount) {
          throw new ValidationError('帳戶號碼已存在');
        }

        return OptimizedAccount.create({
          userId: dto.userId,
          accountNumber: dto.accountNumber,
          name: dto.name,
          type: dto.type,
          initialBalance: dto.initialBalance,
          currency: dto.currency,
          description: dto.description
        });
      } else {
        return OptimizedAccount.createWithGeneratedNumber({
          userId: dto.userId,
          name: dto.name,
          type: dto.type,
          initialBalance: dto.initialBalance,
          currency: dto.currency,
          description: dto.description
        });
      }
    } catch (error) {
      this.logger.error('創建帳戶實體失敗', error);
      throw error;
    }
  }

  /**
   * 更新帳戶實體
   */
  protected async updateEntity(entity: OptimizedAccount, dto: UpdateAccountDto): Promise<void> {
    try {
      if (dto.name || dto.description !== undefined) {
        entity.updateInfo(dto.name || entity.name, dto.description);
      }
    } catch (error) {
      this.logger.error('更新帳戶實體失敗', error);
      throw error;
    }
  }

  /**
   * 將實體轉換為回應 DTO
   */
  protected mapToResponseDto(entity: OptimizedAccount): AccountResponseDto {
    const displayObj = entity.toDisplayObject();

    return {
      id: entity.id,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
      userId: entity.userId,
      accountNumber: entity.accountNumber,
      name: entity.name,
      type: entity.type,
      balance: entity.getBalanceAmount(),
      formattedBalance: entity.getBalance().toDisplayString(),
      currency: entity.getCurrency(),
      status: entity.status,
      statusText: displayObj.statusText,
      isActive: entity.isActive(),
      canPerformTransactions: entity.canPerformTransactions(),
      description: entity.description,
      lastTransactionDate: entity.lastTransactionDate?.toISOString()
    };
  }

  // 覆寫基礎類別的過濾方法

  /**
   * 關鍵字過濾實作
   */
  protected override async filterByKeyword(entities: OptimizedAccount[], keyword: string): Promise<OptimizedAccount[]> {
    const lowerKeyword = keyword.toLowerCase();
    return entities.filter(
      account =>
        account.name.toLowerCase().includes(lowerKeyword) ||
        account.accountNumber.toLowerCase().includes(lowerKeyword) ||
        account.description?.toLowerCase().includes(lowerKeyword)
    );
  }

  /**
   * 狀態過濾實作
   */
  protected override async filterByStatus(entities: OptimizedAccount[], status: string): Promise<OptimizedAccount[]> {
    return entities.filter(account => account.status === status);
  }

  /**
   * 應用帳戶特定的搜尋條件
   */
  protected override async applySearchCriteria(entities: OptimizedAccount[], criteria?: SearchCriteriaDto): Promise<OptimizedAccount[]> {
    // 先應用基礎搜尋條件
    let filtered = await super.applySearchCriteria(entities, criteria);

    // 應用帳戶特定的搜尋條件
    if (criteria && this.isAccountSearchCriteria(criteria)) {
      const accountCriteria = criteria as AccountSearchCriteriaDto;

      if (accountCriteria.userId) {
        filtered = filtered.filter(account => account.userId === accountCriteria.userId);
      }

      if (accountCriteria.accountNumber) {
        filtered = filtered.filter(account => account.accountNumber.toLowerCase().includes(accountCriteria.accountNumber!.toLowerCase()));
      }

      if (accountCriteria.accountName) {
        filtered = filtered.filter(account => account.name.toLowerCase().includes(accountCriteria.accountName!.toLowerCase()));
      }

      if (accountCriteria.accountType) {
        filtered = filtered.filter(account => account.type === accountCriteria.accountType);
      }

      if (accountCriteria.accountStatus) {
        filtered = filtered.filter(account => account.status === accountCriteria.accountStatus);
      }

      if (accountCriteria.minBalance !== undefined) {
        filtered = filtered.filter(account => account.getBalanceAmount() >= accountCriteria.minBalance!);
      }

      if (accountCriteria.maxBalance !== undefined) {
        filtered = filtered.filter(account => account.getBalanceAmount() <= accountCriteria.maxBalance!);
      }

      if (accountCriteria.currency) {
        filtered = filtered.filter(account => account.getCurrency() === accountCriteria.currency);
      }
    }

    return filtered;
  }

  /**
   * 檢查是否為帳戶搜尋條件
   */
  private isAccountSearchCriteria(criteria: SearchCriteriaDto): criteria is AccountSearchCriteriaDto {
    return 'userId' in criteria || 'accountNumber' in criteria || 'accountName' in criteria;
  }

  /**
   * 覆寫刪除前檢查
   */
  protected override async beforeDelete(entity: OptimizedAccount): Promise<void> {
    if (entity.getBalanceAmount() > 0) {
      throw new ValidationError('帳戶餘額不為零，無法刪除');
    }

    if (entity.status !== AccountStatus.CLOSED) {
      throw new ValidationError('只能刪除已關閉的帳戶');
    }
  }

  // 帳戶特定的業務方法

  /**
   * 存款
   */
  async deposit(accountId: string, dto: DepositDto): Promise<AccountResponseDto> {
    const operation = 'deposit';
    this.logger.info(`開始存款操作`, { accountId, amount: dto.amount });

    try {
      if (dto.amount <= 0) {
        throw new ValidationError('存款金額必須大於零');
      }

      const account = await this.repository.findById(accountId);
      if (!account) {
        throw new NotFoundError('帳戶不存在');
      }

      account.deposit(dto.amount);
      await this.repository.save(account);

      this.logger.info(`存款成功`, { accountId, amount: dto.amount, newBalance: account.getBalanceAmount() });
      this.errorHandler.handleSuccess('存款成功');

      return this.mapToResponseDto(account);
    } catch (error) {
      this.logger.error(`存款失敗`, error, { accountId, dto });

      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      const appError = new ApplicationError('存款失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 提款
   */
  async withdraw(accountId: string, dto: WithdrawDto): Promise<AccountResponseDto> {
    const operation = 'withdraw';
    this.logger.info(`開始提款操作`, { accountId, amount: dto.amount });

    try {
      if (dto.amount <= 0) {
        throw new ValidationError('提款金額必須大於零');
      }

      const account = await this.repository.findById(accountId);
      if (!account) {
        throw new NotFoundError('帳戶不存在');
      }

      account.withdraw(dto.amount);
      await this.repository.save(account);

      this.logger.info(`提款成功`, { accountId, amount: dto.amount, newBalance: account.getBalanceAmount() });
      this.errorHandler.handleSuccess('提款成功');

      return this.mapToResponseDto(account);
    } catch (error) {
      this.logger.error(`提款失敗`, error, { accountId, dto });

      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      const appError = new ApplicationError('提款失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 轉帳
   */
  async transfer(sourceAccountId: string, dto: TransferDto): Promise<TransferResultDto> {
    const operation = 'transfer';
    this.logger.info(`開始轉帳操作`, { sourceAccountId, targetAccountId: dto.targetAccountId, amount: dto.amount });

    try {
      if (dto.amount <= 0) {
        throw new ValidationError('轉帳金額必須大於零');
      }

      if (sourceAccountId === dto.targetAccountId) {
        throw new ValidationError('不能轉帳到相同帳戶');
      }

      const sourceAccount = await this.repository.findById(sourceAccountId);
      if (!sourceAccount) {
        throw new NotFoundError('來源帳戶不存在');
      }

      const targetAccount = await this.repository.findById(dto.targetAccountId);
      if (!targetAccount) {
        throw new NotFoundError('目標帳戶不存在');
      }

      // 執行轉帳
      sourceAccount.transferTo(targetAccount, dto.amount);

      // 儲存兩個帳戶
      await this.repository.save(sourceAccount);
      await this.repository.save(targetAccount);

      this.logger.info(`轉帳成功`, {
        sourceAccountId,
        targetAccountId: dto.targetAccountId,
        amount: dto.amount,
        sourceBalance: sourceAccount.getBalanceAmount(),
        targetBalance: targetAccount.getBalanceAmount()
      });
      this.errorHandler.handleSuccess('轉帳成功');

      return {
        sourceAccount: this.mapToResponseDto(sourceAccount),
        targetAccount: this.mapToResponseDto(targetAccount),
        transferAmount: dto.amount,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`轉帳失敗`, error, { sourceAccountId, dto });

      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }

      const appError = new ApplicationError('轉帳失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 更新帳戶狀態
   */
  async updateAccountStatus(accountId: string, dto: UpdateAccountStatusDto): Promise<AccountResponseDto> {
    const operation = 'updateAccountStatus';
    this.logger.info(`開始更新帳戶狀態`, { accountId, status: dto.status });

    try {
      const account = await this.repository.findById(accountId);
      if (!account) {
        throw new NotFoundError('帳戶不存在');
      }

      account.updateStatus(dto.status);
      await this.repository.save(account);

      this.logger.info(`帳戶狀態更新成功`, { accountId, status: dto.status });
      this.errorHandler.handleSuccess('狀態更新成功');

      return this.mapToResponseDto(account);
    } catch (error) {
      this.logger.error(`更新帳戶狀態失敗`, error, { accountId, dto });

      if (error instanceof NotFoundError) {
        throw error;
      }

      const appError = new ApplicationError('狀態更新失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 根據帳戶號碼查找帳戶
   */
  async findByAccountNumber(accountNumber: string): Promise<AccountResponseDto | null> {
    const operation = 'findByAccountNumber';
    this.logger.info(`根據帳戶號碼查找帳戶`, { accountNumber });

    try {
      if (!accountNumber || accountNumber.trim() === '') {
        throw new ValidationError('帳戶號碼不能為空');
      }

      // 這裡需要儲存庫支援按帳戶號碼查找
      // 暫時使用 findAll 然後過濾
      const allAccounts = await this.repository.findAll();
      const account = allAccounts.find(acc => acc.accountNumber === accountNumber.trim());

      if (!account) {
        this.logger.info(`帳戶不存在`, { accountNumber });
        return null;
      }

      this.logger.info(`成功找到帳戶`, { accountNumber, accountId: account.id });
      return this.mapToResponseDto(account);
    } catch (error) {
      this.logger.error(`根據帳戶號碼查找帳戶失敗`, error, { accountNumber });

      if (error instanceof ValidationError) {
        throw error;
      }

      const appError = new ApplicationError('查找帳戶失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 根據用戶 ID 獲取帳戶列表
   */
  async getAccountsByUserId(userId: string): Promise<AccountResponseDto[]> {
    const operation = 'getAccountsByUserId';
    this.logger.info(`根據用戶 ID 獲取帳戶列表`, { userId });

    try {
      if (!userId || userId.trim() === '') {
        throw new ValidationError('用戶 ID 不能為空');
      }

      const criteria: AccountSearchCriteriaDto = {
        userId: userId.trim()
      };

      const result = await this.getList(criteria);

      this.logger.info(`成功獲取用戶帳戶列表`, { userId, count: result.items.length });
      return result.items;
    } catch (error) {
      this.logger.error(`獲取用戶帳戶列表失敗`, error, { userId });

      if (error instanceof ValidationError) {
        throw error;
      }

      const appError = new ApplicationError('獲取帳戶列表失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 獲取帳戶統計資訊
   */
  async getAccountStats(): Promise<AccountStatsDto> {
    const operation = 'getAccountStats';
    this.logger.info(`開始獲取帳戶統計資訊`);

    try {
      const allAccounts = await this.repository.findAll();

      const totalAccounts = allAccounts.length;
      const activeAccounts = allAccounts.filter(acc => acc.status === AccountStatus.ACTIVE).length;
      const inactiveAccounts = allAccounts.filter(acc => acc.status === AccountStatus.INACTIVE).length;
      const suspendedAccounts = allAccounts.filter(acc => acc.status === AccountStatus.SUSPENDED).length;
      const closedAccounts = allAccounts.filter(acc => acc.status === AccountStatus.CLOSED).length;

      const totalBalance = allAccounts.reduce((sum, acc) => sum + acc.getBalanceAmount(), 0);
      const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

      // 按類型統計
      const accountsByType: Record<AccountType, number> = {
        [AccountType.CHECKING]: 0,
        [AccountType.SAVINGS]: 0,
        [AccountType.CREDIT]: 0
      };

      allAccounts.forEach(account => {
        accountsByType[account.type] = (accountsByType[account.type] || 0) + 1;
      });

      // 按貨幣統計
      const accountsByCurrency: Record<string, { count: number; totalBalance: number; formattedBalance: string }> = {};

      allAccounts.forEach(account => {
        const currency = account.getCurrency();
        if (!accountsByCurrency[currency]) {
          accountsByCurrency[currency] = { count: 0, totalBalance: 0, formattedBalance: '' };
        }
        accountsByCurrency[currency].count++;
        accountsByCurrency[currency].totalBalance += account.getBalanceAmount();
      });

      // 格式化貨幣餘額
      Object.keys(accountsByCurrency).forEach(currency => {
        const currencyData = accountsByCurrency[currency];
        // 使用第一個該貨幣的帳戶來格式化
        const sampleAccount = allAccounts.find(acc => acc.getCurrency() === currency);
        if (sampleAccount) {
          const money = sampleAccount.getBalance();
          const formattedMoney = new (money.constructor as any)(currencyData.totalBalance, currency);
          currencyData.formattedBalance = formattedMoney.toDisplayString();
        }
      });

      const stats: AccountStatsDto = {
        totalAccounts,
        activeAccounts,
        inactiveAccounts,
        suspendedAccounts,
        closedAccounts,
        totalBalance,
        formattedTotalBalance: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        averageBalance,
        formattedAverageBalance: `$${averageBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        accountsByType,
        accountsByCurrency
      };

      this.logger.info(`成功獲取帳戶統計資訊`, { totalAccounts, totalBalance });
      return stats;
    } catch (error) {
      this.logger.error(`獲取帳戶統計資訊失敗`, error);

      const appError = new ApplicationError('獲取統計資訊失敗', error as Error);
      this.errorHandler.handleError(appError, operation);
      throw appError;
    }
  }

  /**
   * 驗證創建 DTO
   */
  protected override validateCreateDto(dto: CreateAccountDto): void {
    super.validateCreateDto(dto);

    if (!dto.userId || dto.userId.trim() === '') {
      throw new ValidationError('用戶 ID 不能為空');
    }

    if (!dto.name || dto.name.trim() === '') {
      throw new ValidationError('帳戶名稱不能為空');
    }

    if (!Object.values(AccountType).includes(dto.type)) {
      throw new ValidationError('無效的帳戶類型');
    }

    if (dto.initialBalance !== undefined && dto.initialBalance < 0) {
      throw new ValidationError('初始餘額不能為負數');
    }

    if (dto.accountNumber && dto.accountNumber.trim() === '') {
      throw new ValidationError('帳戶號碼不能為空字串');
    }
  }

  /**
   * 驗證更新 DTO
   */
  protected override validateUpdateDto(dto: UpdateAccountDto): void {
    super.validateUpdateDto(dto);

    if (dto.name !== undefined && dto.name.trim() === '') {
      throw new ValidationError('帳戶名稱不能為空');
    }
  }
}
