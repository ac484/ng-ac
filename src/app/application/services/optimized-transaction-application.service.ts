/**
 * 優化的交易應用服務
 * 使用新的基類重構，整合交易處理的業務邏輯，簡化狀態管理和通知機制
 */

import { Injectable, Inject } from '@angular/core';
import {
    BaseApplicationService,
    Repository,
    ValidationError,
    NotFoundError,
    ApplicationError
} from './base-application.service';
import {
    BaseCreateDto,
    BaseUpdateDto,
    BaseResponseDto,
    ListResponseDto,
    SearchCriteriaDto
} from '../dto/base.dto';
import { OptimizedTransaction, TransactionType, TransactionStatus, TransactionData } from '../../domain/entities/optimized-transaction.entity';
import { Money } from '../../domain/value-objects/account/money.value-object';
import { ErrorHandlerService } from './error-handler.service';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { generateId } from '../../domain/entities/optimized-base-entity';

/**
 * 交易創建 DTO
 */
export interface CreateTransactionDto extends BaseCreateDto {
    accountId: string;
    userId: string;
    amount: number;
    currency?: string;
    transactionType: TransactionType;
    description: string;
    referenceNumber?: string;
    category?: string;
}

/**
 * 交易更新 DTO
 */
export interface UpdateTransactionDto extends BaseUpdateDto {
    description?: string;
    category?: string;
    referenceNumber?: string;
    notes?: string;
}

/**
 * 交易回應 DTO
 */
export interface TransactionResponseDto extends BaseResponseDto {
    transactionNumber: string;
    accountId: string;
    userId: string;
    amount: number;
    currency: string;
    transactionType: TransactionType;
    status: TransactionStatus;
    description: string;
    referenceNumber?: string;
    category?: string;
    fees?: number;
    notes?: string;
    totalAmount: number;
}

/**
 * 交易狀態更新 DTO
 */
export interface UpdateTransactionStatusDto {
    status: TransactionStatus;
    reason?: string;
}

/**
 * 交易處理 DTO
 */
export interface ProcessTransactionDto {
    action: 'process' | 'complete' | 'fail' | 'cancel' | 'retry';
    reason?: string;
}

/**
 * 交易搜尋條件 DTO
 */
export interface TransactionSearchCriteriaDto extends SearchCriteriaDto {
    accountId?: string;
    userId?: string;
    transactionType?: TransactionType;
    minAmount?: number;
    maxAmount?: number;
    referenceNumber?: string;
    category?: string;
}

/**
 * 交易統計 DTO
 */
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

/**
 * 優化的交易應用服務
 * 繼承基礎應用服務，專注於交易特定的業務邏輯
 */
@Injectable({
    providedIn: 'root'
})
export class OptimizedTransactionApplicationService extends BaseApplicationService<
    OptimizedTransaction,
    CreateTransactionDto,
    UpdateTransactionDto,
    TransactionResponseDto
> {
    constructor(
        @Inject(TRANSACTION_REPOSITORY) repository: Repository<OptimizedTransaction>,
        errorHandler: ErrorHandlerService
    ) {
        super(repository, errorHandler, 'OptimizedTransactionApplicationService');
    }

    /**
     * 創建實體實例
     */
    protected async createEntity(dto: CreateTransactionDto): Promise<OptimizedTransaction> {
        // 生成交易編號
        const transactionNumber = this.generateTransactionNumber();

        // 創建 Money 值物件
        const amount = new Money(dto.amount, dto.currency || 'TWD');

        // 創建交易實體
        const transaction = OptimizedTransaction.create(
            transactionNumber,
            dto.accountId,
            dto.userId,
            amount,
            dto.transactionType,
            dto.description
        );

        // 設定可選屬性
        if (dto.referenceNumber) {
            transaction.referenceNumber = dto.referenceNumber;
        }

        if (dto.category) {
            transaction.category = dto.category;
        }

        return transaction;
    }

    /**
     * 更新實體屬性
     */
    protected async updateEntity(entity: OptimizedTransaction, dto: UpdateTransactionDto): Promise<void> {
        if (dto.description) {
            entity.updateDescription(dto.description);
        }

        if (dto.category) {
            entity.updateCategory(dto.category);
        }

        if (dto.referenceNumber) {
            entity.referenceNumber = dto.referenceNumber;
        }

        if (dto.notes) {
            entity.notes = dto.notes;
        }
    }

    /**
     * 將實體轉換為回應 DTO
     */
    protected mapToResponseDto(entity: OptimizedTransaction): TransactionResponseDto {
        return {
            id: entity.id,
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString(),
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
            totalAmount: entity.getTotalAmount().getAmount()
        };
    }

    /**
     * 驗證創建 DTO
     */
    protected override validateCreateDto(dto: CreateTransactionDto): void {
        super.validateCreateDto(dto);

        if (!dto.accountId || dto.accountId.trim() === '') {
            throw new ValidationError('帳戶 ID 不能為空');
        }

        if (!dto.userId || dto.userId.trim() === '') {
            throw new ValidationError('用戶 ID 不能為空');
        }

        if (!dto.amount || dto.amount <= 0) {
            throw new ValidationError('交易金額必須大於零');
        }

        if (!dto.description || dto.description.trim() === '') {
            throw new ValidationError('交易描述不能為空');
        }

        if (dto.description.length > 500) {
            throw new ValidationError('交易描述不能超過 500 個字元');
        }

        if (!Object.values(TransactionType).includes(dto.transactionType)) {
            throw new ValidationError('無效的交易類型');
        }
    }

    /**
     * 刪除前的業務邏輯檢查
     */
    protected override async beforeDelete(entity: OptimizedTransaction): Promise<void> {
        if (entity.isCompleted()) {
            throw new ValidationError('已完成的交易不能刪除');
        }
    }

    /**
     * 關鍵字過濾
     */
    protected override async filterByKeyword(entities: OptimizedTransaction[], keyword: string): Promise<OptimizedTransaction[]> {
        const lowerKeyword = keyword.toLowerCase();
        return entities.filter(entity =>
            entity.description.toLowerCase().includes(lowerKeyword) ||
            entity.transactionNumber.toLowerCase().includes(lowerKeyword) ||
            entity.referenceNumber?.toLowerCase().includes(lowerKeyword) ||
            entity.category?.toLowerCase().includes(lowerKeyword) ||
            entity.notes?.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 狀態過濾
     */
    protected override async filterByStatus(entities: OptimizedTransaction[], status: string): Promise<OptimizedTransaction[]> {
        if (!Object.values(TransactionStatus).includes(status as TransactionStatus)) {
            this.logger.warn(`無效的狀態過濾條件: ${status}`);
            return entities;
        }

        return entities.filter(entity => entity.status === status);
    }

    /**
     * 排序
     */
    protected override async applySorting(
        entities: OptimizedTransaction[],
        sortBy: string,
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<OptimizedTransaction[]> {
        const sorted = [...entities];

        sorted.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortBy) {
                case 'amount':
                    aValue = a.amount.getAmount();
                    bValue = b.amount.getAmount();
                    break;
                case 'totalAmount':
                    aValue = a.getTotalAmount().getAmount();
                    bValue = b.getTotalAmount().getAmount();
                    break;
                case 'transactionNumber':
                    aValue = a.transactionNumber;
                    bValue = b.transactionNumber;
                    break;
                case 'status':
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case 'transactionType':
                    aValue = a.transactionType;
                    bValue = b.transactionType;
                    break;
                case 'description':
                    aValue = a.description;
                    bValue = b.description;
                    break;
                default:
                    // For unknown sort fields, delegate to parent class
                    // We need to return the result directly since we can't await in sort callback
                    this.logger.warn(`未知的排序欄位: ${sortBy}`);
                    return 0;
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortOrder === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });

        return sorted;
    }

    // 交易特定的業務方法

    /**
     * 更新交易狀態
     */
    async updateStatus(id: string, dto: UpdateTransactionStatusDto): Promise<TransactionResponseDto> {
        const operation = 'updateStatus';
        this.logger.info(`開始更新交易狀態`, { id, dto });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('交易 ID 不能為空');
            }

            if (!Object.values(TransactionStatus).includes(dto.status)) {
                throw new ValidationError('無效的交易狀態');
            }

            const entity = await this.repository.findById(id);
            if (!entity) {
                throw new NotFoundError('交易不存在');
            }

            // 根據狀態執行相應的業務邏輯
            switch (dto.status) {
                case TransactionStatus.PROCESSING:
                    entity.process();
                    break;
                case TransactionStatus.COMPLETED:
                    entity.complete();
                    break;
                case TransactionStatus.FAILED:
                    entity.fail(dto.reason);
                    break;
                case TransactionStatus.CANCELLED:
                    entity.cancel(dto.reason);
                    break;
                default:
                    throw new ValidationError(`不支援的狀態轉換: ${dto.status}`);
            }

            await this.repository.save(entity);

            this.logger.info(`成功更新交易狀態`, { id, newStatus: dto.status });
            this.errorHandler.handleSuccess('交易狀態更新成功');

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`更新交易狀態失敗`, error, { id, dto });

            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            }

            const appError = new ApplicationError('更新交易狀態失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 處理交易
     */
    async processTransaction(id: string, dto: ProcessTransactionDto): Promise<TransactionResponseDto> {
        const operation = 'processTransaction';
        this.logger.info(`開始處理交易`, { id, dto });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('交易 ID 不能為空');
            }

            const entity = await this.repository.findById(id);
            if (!entity) {
                throw new NotFoundError('交易不存在');
            }

            // 根據動作執行相應的業務邏輯
            switch (dto.action) {
                case 'process':
                    entity.process();
                    break;
                case 'complete':
                    entity.complete();
                    break;
                case 'fail':
                    entity.fail(dto.reason);
                    break;
                case 'cancel':
                    entity.cancel(dto.reason);
                    break;
                case 'retry':
                    entity.retry();
                    break;
                default:
                    throw new ValidationError(`不支援的處理動作: ${dto.action}`);
            }

            await this.repository.save(entity);

            this.logger.info(`成功處理交易`, { id, action: dto.action });
            this.errorHandler.handleSuccess(`交易${dto.action}成功`);

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`處理交易失敗`, error, { id, dto });

            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            }

            const appError = new ApplicationError('處理交易失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 添加手續費
     */
    async addFees(id: string, feeAmount: number, currency?: string): Promise<TransactionResponseDto> {
        const operation = 'addFees';
        this.logger.info(`開始添加手續費`, { id, feeAmount, currency });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('交易 ID 不能為空');
            }

            if (feeAmount <= 0) {
                throw new ValidationError('手續費金額必須大於零');
            }

            const entity = await this.repository.findById(id);
            if (!entity) {
                throw new NotFoundError('交易不存在');
            }

            const fees = new Money(feeAmount, currency || entity.amount.getCurrency());
            entity.addFees(fees);

            await this.repository.save(entity);

            this.logger.info(`成功添加手續費`, { id, feeAmount });
            this.errorHandler.handleSuccess('手續費添加成功');

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`添加手續費失敗`, error, { id, feeAmount });

            if (error instanceof ValidationError || error instanceof NotFoundError) {
                throw error;
            }

            const appError = new ApplicationError('添加手續費失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 根據帳戶 ID 獲取交易列表
     */
    async getByAccountId(accountId: string, criteria?: TransactionSearchCriteriaDto): Promise<ListResponseDto<TransactionResponseDto>> {
        const operation = 'getByAccountId';
        this.logger.info(`開始獲取帳戶交易列表`, { accountId, criteria });

        try {
            if (!accountId || accountId.trim() === '') {
                throw new ValidationError('帳戶 ID 不能為空');
            }

            const searchCriteria = { ...criteria, accountId };
            return await this.getList(searchCriteria);
        } catch (error) {
            this.logger.error(`獲取帳戶交易列表失敗`, error, { accountId });

            if (error instanceof ValidationError) {
                throw error;
            }

            const appError = new ApplicationError('獲取帳戶交易列表失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 根據用戶 ID 獲取交易列表
     */
    async getByUserId(userId: string, criteria?: TransactionSearchCriteriaDto): Promise<ListResponseDto<TransactionResponseDto>> {
        const operation = 'getByUserId';
        this.logger.info(`開始獲取用戶交易列表`, { userId, criteria });

        try {
            if (!userId || userId.trim() === '') {
                throw new ValidationError('用戶 ID 不能為空');
            }

            const searchCriteria = { ...criteria, userId };
            return await this.getList(searchCriteria);
        } catch (error) {
            this.logger.error(`獲取用戶交易列表失敗`, error, { userId });

            if (error instanceof ValidationError) {
                throw error;
            }

            const appError = new ApplicationError('獲取用戶交易列表失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 應用交易特定的搜尋條件
     */
    protected override async applySearchCriteria(
        entities: OptimizedTransaction[],
        criteria?: SearchCriteriaDto
    ): Promise<OptimizedTransaction[]> {
        let filtered = await super.applySearchCriteria(entities, criteria);

        if (!criteria) {
            return filtered;
        }

        const transactionCriteria = criteria as TransactionSearchCriteriaDto;

        // 帳戶 ID 過濾
        if (transactionCriteria.accountId) {
            filtered = filtered.filter(entity => entity.accountId === transactionCriteria.accountId);
        }

        // 用戶 ID 過濾
        if (transactionCriteria.userId) {
            filtered = filtered.filter(entity => entity.userId === transactionCriteria.userId);
        }

        // 交易類型過濾
        if (transactionCriteria.transactionType) {
            filtered = filtered.filter(entity => entity.transactionType === transactionCriteria.transactionType);
        }

        // 金額範圍過濾
        if (transactionCriteria.minAmount !== undefined || transactionCriteria.maxAmount !== undefined) {
            filtered = filtered.filter(entity => {
                const amount = entity.amount.getAmount();
                if (transactionCriteria.minAmount !== undefined && amount < transactionCriteria.minAmount) {
                    return false;
                }
                if (transactionCriteria.maxAmount !== undefined && amount > transactionCriteria.maxAmount) {
                    return false;
                }
                return true;
            });
        }

        // 參考編號過濾
        if (transactionCriteria.referenceNumber) {
            filtered = filtered.filter(entity =>
                entity.referenceNumber?.includes(transactionCriteria.referenceNumber!)
            );
        }

        // 分類過濾
        if (transactionCriteria.category) {
            filtered = filtered.filter(entity =>
                entity.category?.includes(transactionCriteria.category!)
            );
        }

        return filtered;
    }

    /**
     * 獲取交易統計
     */
    async getStatistics(criteria?: TransactionSearchCriteriaDto): Promise<TransactionStatsDto> {
        const operation = 'getStatistics';
        this.logger.info(`開始獲取交易統計`, { criteria });

        try {
            const entities = await this.repository.findAll();
            const filteredEntities = await this.applySearchCriteria(entities, criteria);

            const stats: TransactionStatsDto = {
                totalCount: filteredEntities.length,
                totalAmount: 0,
                byStatus: {} as Record<TransactionStatus, number>,
                byType: {} as Record<TransactionType, number>,
                averageAmount: 0,
                completedCount: 0,
                pendingCount: 0,
                processingCount: 0,
                failedCount: 0,
                cancelledCount: 0
            };

            // 初始化計數器
            Object.values(TransactionStatus).forEach(status => {
                stats.byStatus[status] = 0;
            });

            Object.values(TransactionType).forEach(type => {
                stats.byType[type] = 0;
            });

            // 計算統計數據
            filteredEntities.forEach(entity => {
                const amount = entity.amount.getAmount();
                stats.totalAmount += amount;
                stats.byStatus[entity.status]++;
                stats.byType[entity.transactionType]++;

                switch (entity.status) {
                    case TransactionStatus.COMPLETED:
                        stats.completedCount++;
                        break;
                    case TransactionStatus.PENDING:
                        stats.pendingCount++;
                        break;
                    case TransactionStatus.PROCESSING:
                        stats.processingCount++;
                        break;
                    case TransactionStatus.FAILED:
                        stats.failedCount++;
                        break;
                    case TransactionStatus.CANCELLED:
                        stats.cancelledCount++;
                        break;
                }
            });

            stats.averageAmount = stats.totalCount > 0 ? stats.totalAmount / stats.totalCount : 0;

            this.logger.info(`成功獲取交易統計`, { totalCount: stats.totalCount });
            return stats;
        } catch (error) {
            this.logger.error(`獲取交易統計失敗`, error, { criteria });

            const appError = new ApplicationError('獲取交易統計失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 生成交易編號
     */
    private generateTransactionNumber(): string {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TXN-${timestamp}-${random}`;
    }
}