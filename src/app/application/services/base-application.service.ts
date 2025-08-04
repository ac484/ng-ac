import { Injectable } from '@angular/core';
import { OptimizedBaseEntity } from '../../domain/entities/optimized-base-entity';
import { ErrorHandlerService } from './error-handler.service';
import {
    BaseCreateDto,
    BaseUpdateDto,
    BaseResponseDto,
    ListResponseDto,
    SearchCriteriaDto
} from '../dto/base.dto';

// Re-export for backward compatibility
export type {
    BaseCreateDto,
    BaseUpdateDto,
    BaseResponseDto,
    ListResponseDto,
    SearchCriteriaDto
} from '../dto/base.dto';

/**
 * 儲存庫介面
 */
export interface Repository<T> {
    findById(id: string): Promise<T | null>;
    findAll(criteria?: any): Promise<T[]>;
    save(entity: T): Promise<void>;
    delete(id: string): Promise<void>;
}

/**
 * 日誌記錄器介面
 */
export interface Logger {
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, error?: any, ...args: any[]): void;
    debug(message: string, ...args: any[]): void;
}

/**
 * 簡單的控制台日誌記錄器實作
 */
export class ConsoleLogger implements Logger {
    constructor(private context: string) { }

    info(message: string, ...args: any[]): void {
        console.log(`[${this.context}] INFO: ${message}`, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.warn(`[${this.context}] WARN: ${message}`, ...args);
    }

    error(message: string, error?: any, ...args: any[]): void {
        console.error(`[${this.context}] ERROR: ${message}`, error, ...args);
    }

    debug(message: string, ...args: any[]): void {
        console.debug(`[${this.context}] DEBUG: ${message}`, ...args);
    }
}

/**
 * 應用程式錯誤類型
 */
export abstract class BaseError extends Error {
    abstract readonly code: string;
    abstract readonly statusCode: number;

    constructor(
        message: string,
        public override readonly cause?: Error
    ) {
        super(message);
        this.name = this.constructor.name;
    }
}

export class ValidationError extends BaseError {
    readonly code = 'VALIDATION_ERROR';
    readonly statusCode = 400;
}

export class NotFoundError extends BaseError {
    readonly code = 'NOT_FOUND';
    readonly statusCode = 404;
}

export class ApplicationError extends BaseError {
    readonly code = 'APPLICATION_ERROR';
    readonly statusCode = 500;
}

/**
 * 統一的應用服務基類
 * 提供通用的 CRUD 操作模式、錯誤處理和日誌記錄
 */
@Injectable()
export abstract class BaseApplicationService<
    TEntity extends OptimizedBaseEntity,
    TCreateDto extends BaseCreateDto,
    TUpdateDto extends BaseUpdateDto,
    TResponseDto extends BaseResponseDto
> {
    protected logger: Logger;

    constructor(
        protected repository: Repository<TEntity>,
        protected errorHandler: ErrorHandlerService,
        loggerContext?: string
    ) {
        this.logger = new ConsoleLogger(loggerContext || this.constructor.name);
    }

    /**
     * 創建新實體
     */
    async create(dto: TCreateDto): Promise<TResponseDto> {
        const operation = 'create';
        this.logger.info(`開始創建實體`, { dto });

        try {
            // 驗證創建 DTO
            this.validateCreateDto(dto);

            // 創建實體
            const entity = await this.createEntity(dto);

            // 驗證實體
            const validation = entity.validate();
            if (!validation.isValid) {
                throw new ValidationError(`實體驗證失敗: ${validation.errors.join(', ')}`);
            }

            // 儲存實體
            await this.repository.save(entity);

            this.logger.info(`成功創建實體`, { id: entity.id });
            this.errorHandler.handleSuccess('創建成功');

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`創建實體失敗`, error, { dto });

            if (error instanceof BaseError) {
                throw error;
            }

            const appError = new ApplicationError('創建失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 根據 ID 獲取實體
     */
    async getById(id: string): Promise<TResponseDto | null> {
        const operation = 'getById';
        this.logger.info(`開始獲取實體`, { id });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('ID 不能為空');
            }

            const entity = await this.repository.findById(id);

            if (!entity) {
                this.logger.warn(`實體不存在`, { id });
                return null;
            }

            this.logger.info(`成功獲取實體`, { id });
            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`獲取實體失敗`, error, { id });

            if (error instanceof BaseError) {
                throw error;
            }

            const appError = new ApplicationError('獲取失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 更新實體
     */
    async update(id: string, dto: TUpdateDto): Promise<TResponseDto> {
        const operation = 'update';
        this.logger.info(`開始更新實體`, { id, dto });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('ID 不能為空');
            }

            // 驗證更新 DTO
            this.validateUpdateDto(dto);

            // 獲取現有實體
            const entity = await this.repository.findById(id);
            if (!entity) {
                throw new NotFoundError('實體不存在');
            }

            // 更新實體
            await this.updateEntity(entity, dto);

            // 驗證更新後的實體
            const validation = entity.validate();
            if (!validation.isValid) {
                throw new ValidationError(`實體驗證失敗: ${validation.errors.join(', ')}`);
            }

            // 儲存實體
            await this.repository.save(entity);

            this.logger.info(`成功更新實體`, { id });
            this.errorHandler.handleSuccess('更新成功');

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error(`更新實體失敗`, error, { id, dto });

            if (error instanceof BaseError) {
                throw error;
            }

            const appError = new ApplicationError('更新失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 刪除實體
     */
    async delete(id: string): Promise<void> {
        const operation = 'delete';
        this.logger.info(`開始刪除實體`, { id });

        try {
            if (!id || id.trim() === '') {
                throw new ValidationError('ID 不能為空');
            }

            // 檢查實體是否存在
            const entity = await this.repository.findById(id);
            if (!entity) {
                throw new NotFoundError('實體不存在');
            }

            // 執行刪除前的業務邏輯檢查
            await this.beforeDelete(entity);

            // 刪除實體
            await this.repository.delete(id);

            this.logger.info(`成功刪除實體`, { id });
            this.errorHandler.handleSuccess('刪除成功');
        } catch (error) {
            this.logger.error(`刪除實體失敗`, error, { id });

            if (error instanceof BaseError) {
                throw error;
            }

            const appError = new ApplicationError('刪除失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    /**
     * 獲取實體列表
     */
    async getList(criteria?: SearchCriteriaDto): Promise<ListResponseDto<TResponseDto>> {
        const operation = 'getList';
        this.logger.info(`開始獲取實體列表`, { criteria });

        try {
            // 設定預設值
            const page = criteria?.page || 1;
            const pageSize = Math.min(criteria?.pageSize || 10, 100); // 限制最大頁面大小

            // 獲取所有符合條件的實體
            const allEntities = await this.repository.findAll(criteria);

            // 應用搜尋條件過濾
            const filteredEntities = await this.applySearchCriteria(allEntities, criteria);

            // 計算分頁
            const total = filteredEntities.length;
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

            // 轉換為 DTO
            const items = paginatedEntities.map(entity => this.mapToResponseDto(entity));

            const result: ListResponseDto<TResponseDto> = {
                items,
                total,
                page,
                pageSize,
                hasNext: endIndex < total,
                hasPrevious: page > 1
            };

            this.logger.info(`成功獲取實體列表`, {
                total,
                page,
                pageSize,
                itemCount: items.length
            });

            return result;
        } catch (error) {
            this.logger.error(`獲取實體列表失敗`, error, { criteria });

            if (error instanceof BaseError) {
                throw error;
            }

            const appError = new ApplicationError('獲取列表失敗', error as Error);
            this.errorHandler.handleError(appError, operation);
            throw appError;
        }
    }

    // 抽象方法 - 子類別必須實作

    /**
     * 創建實體實例
     */
    protected abstract createEntity(dto: TCreateDto): Promise<TEntity>;

    /**
     * 更新實體屬性
     */
    protected abstract updateEntity(entity: TEntity, dto: TUpdateDto): Promise<void>;

    /**
     * 將實體轉換為回應 DTO
     */
    protected abstract mapToResponseDto(entity: TEntity): TResponseDto;

    // 可選的鉤子方法 - 子類別可以覆寫

    /**
     * 驗證創建 DTO
     */
    protected validateCreateDto(dto: TCreateDto): void {
        if (!dto) {
            throw new ValidationError('創建資料不能為空');
        }
    }

    /**
     * 驗證更新 DTO
     */
    protected validateUpdateDto(dto: TUpdateDto): void {
        if (!dto) {
            throw new ValidationError('更新資料不能為空');
        }
    }

    /**
     * 刪除前的業務邏輯檢查
     */
    protected async beforeDelete(entity: TEntity): Promise<void> {
        // 預設不做任何檢查，子類別可以覆寫
    }

    /**
     * 應用搜尋條件過濾
     */
    protected async applySearchCriteria(
        entities: TEntity[],
        criteria?: SearchCriteriaDto
    ): Promise<TEntity[]> {
        if (!criteria) {
            return entities;
        }

        let filtered = entities;

        // 關鍵字搜尋 - 子類別可以覆寫此方法來實作特定的搜尋邏輯
        if (criteria.keyword) {
            filtered = await this.filterByKeyword(filtered, criteria.keyword);
        }

        // 狀態過濾 - 子類別可以覆寫此方法
        if (criteria.status) {
            filtered = await this.filterByStatus(filtered, criteria.status);
        }

        // 日期範圍過濾
        if (criteria.startDate || criteria.endDate) {
            filtered = this.filterByDateRange(filtered, criteria.startDate, criteria.endDate);
        }

        // 排序
        if (criteria.sortBy) {
            filtered = await this.applySorting(filtered, criteria.sortBy, criteria.sortOrder);
        }

        return filtered;
    }

    /**
     * 關鍵字過濾 - 子類別應該覆寫此方法
     */
    protected async filterByKeyword(entities: TEntity[], keyword: string): Promise<TEntity[]> {
        // 預設實作：不進行過濾
        this.logger.warn('關鍵字過濾未實作，返回原始列表');
        return entities;
    }

    /**
     * 狀態過濾 - 子類別應該覆寫此方法
     */
    protected async filterByStatus(entities: TEntity[], status: string): Promise<TEntity[]> {
        // 預設實作：不進行過濾
        this.logger.warn('狀態過濾未實作，返回原始列表');
        return entities;
    }

    /**
     * 日期範圍過濾
     */
    protected filterByDateRange(
        entities: TEntity[],
        startDate?: string,
        endDate?: string
    ): TEntity[] {
        if (!startDate && !endDate) {
            return entities;
        }

        return entities.filter(entity => {
            const entityDate = entity.createdAt;

            if (startDate) {
                const start = new Date(startDate);
                if (entityDate < start) {
                    return false;
                }
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // 包含整天
                if (entityDate > end) {
                    return false;
                }
            }

            return true;
        });
    }

    /**
     * 排序 - 子類別可以覆寫此方法
     */
    protected async applySorting(
        entities: TEntity[],
        sortBy: string,
        sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<TEntity[]> {
        const sorted = [...entities];

        sorted.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            // 基本排序欄位
            switch (sortBy) {
                case 'id':
                    aValue = a.id;
                    bValue = b.id;
                    break;
                case 'createdAt':
                    aValue = a.createdAt;
                    bValue = b.createdAt;
                    break;
                case 'updatedAt':
                    aValue = a.updatedAt;
                    bValue = b.updatedAt;
                    break;
                default:
                    // 子類別可以覆寫此方法來處理特定的排序欄位
                    this.logger.warn(`未知的排序欄位: ${sortBy}`);
                    return 0;
            }

            // 處理不同資料類型的比較
            if (aValue instanceof Date && bValue instanceof Date) {
                return sortOrder === 'asc'
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // 預設字串比較
            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortOrder === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });

        return sorted;
    }
}