import { Injectable, Inject } from '@angular/core';
import {
    BaseApplicationService,
    Repository
} from './base-application.service';
import {
    BaseCreateDto,
    BaseUpdateDto,
    BaseResponseDto,
    SearchCriteriaDto
} from '../dto/base.dto';
import { OptimizedUser, UserData } from '../../domain/entities/optimized-user.entity';
import { ErrorHandlerService } from './error-handler.service';
import { USER_REPOSITORY } from '../../domain/repositories/repository-tokens';

/**
 * 用戶相關的 DTO 定義
 */
export interface CreateUserDto extends BaseCreateDto {
    email: string;
    displayName: string;
    photoURL?: string;
}

export interface UpdateUserDto extends BaseUpdateDto {
    displayName?: string;
    photoURL?: string;
}

export interface UserResponseDto extends BaseResponseDto {
    email: string;
    displayName: string;
    photoURL?: string;
    isEmailVerified: boolean;
    lastLoginAt?: string;
}

/**
 * 優化的用戶應用服務
 * 使用統一的基礎應用服務，展示最佳實踐
 */
@Injectable({
    providedIn: 'root'
})
export class OptimizedUserApplicationService extends BaseApplicationService<
    OptimizedUser,
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto
> {

    constructor(
        @Inject(USER_REPOSITORY) repository: Repository<OptimizedUser>,
        errorHandler: ErrorHandlerService
    ) {
        super(repository, errorHandler, 'OptimizedUserApplicationService');
    }

    // 實作抽象方法

    /**
     * 創建用戶實體
     */
    protected async createEntity(dto: CreateUserDto): Promise<OptimizedUser> {
        this.logger.info('創建用戶實體', { email: dto.email });

        // 檢查郵箱是否已存在
        const existingUsers = await this.repository.findAll();
        const emailExists = existingUsers.some(user => user.email === dto.email);

        if (emailExists) {
            throw new Error('郵箱已被使用');
        }

        // 創建新用戶
        const userData: UserData = {
            id: this.generateId(),
            email: dto.email,
            displayName: dto.displayName,
            photoURL: dto.photoURL,
            isEmailVerified: false,
            isAnonymous: false,
            authProvider: 'email',
            status: 'active',
            lastLoginAt: undefined,
            phoneNumber: undefined,
            roles: [],
            permissions: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return new OptimizedUser(userData);
    }

    /**
     * 更新用戶實體
     */
    protected async updateEntity(entity: OptimizedUser, dto: UpdateUserDto): Promise<void> {
        this.logger.info('更新用戶實體', { id: entity.id, dto });

        if (dto.displayName !== undefined) {
            entity.updateProfile(dto.displayName, entity.photoURL);
        }

        if (dto.photoURL !== undefined) {
            entity.updateProfile(entity.displayName, dto.photoURL);
        }
    }

    /**
     * 將實體轉換為回應 DTO
     */
    protected mapToResponseDto(entity: OptimizedUser): UserResponseDto {
        return {
            id: entity.id,
            email: entity.email,
            displayName: entity.displayName,
            photoURL: entity.photoURL,
            isEmailVerified: entity.isEmailVerified,
            lastLoginAt: entity.lastLoginAt?.toISOString(),
            createdAt: entity.createdAt.toISOString(),
            updatedAt: entity.updatedAt.toISOString()
        };
    }

    // 覆寫驗證方法

    /**
     * 驗證創建 DTO
     */
    protected override validateCreateDto(dto: CreateUserDto): void {
        super.validateCreateDto(dto);

        if (!dto.email || dto.email.trim() === '') {
            throw new Error('郵箱不能為空');
        }

        if (!this.isValidEmail(dto.email)) {
            throw new Error('郵箱格式無效');
        }

        if (!dto.displayName || dto.displayName.trim() === '') {
            throw new Error('顯示名稱不能為空');
        }

        if (dto.displayName.length > 50) {
            throw new Error('顯示名稱不能超過 50 個字元');
        }
    }

    /**
     * 驗證更新 DTO
     */
    protected override validateUpdateDto(dto: UpdateUserDto): void {
        super.validateUpdateDto(dto);

        if (dto.displayName !== undefined) {
            if (dto.displayName.trim() === '') {
                throw new Error('顯示名稱不能為空');
            }

            if (dto.displayName.length > 50) {
                throw new Error('顯示名稱不能超過 50 個字元');
            }
        }
    }

    // 覆寫搜尋過濾方法

    /**
     * 關鍵字過濾
     */
    protected override async filterByKeyword(entities: OptimizedUser[], keyword: string): Promise<OptimizedUser[]> {
        const lowerKeyword = keyword.toLowerCase();

        return entities.filter(user =>
            user.email.toLowerCase().includes(lowerKeyword) ||
            user.displayName.toLowerCase().includes(lowerKeyword)
        );
    }

    /**
     * 狀態過濾
     */
    protected override async filterByStatus(entities: OptimizedUser[], status: string): Promise<OptimizedUser[]> {
        switch (status.toLowerCase()) {
            case 'verified':
                return entities.filter(user => user.isEmailVerified);
            case 'unverified':
                return entities.filter(user => !user.isEmailVerified);
            case 'active':
                // 假設最近 30 天內登入的用戶為活躍用戶
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return entities.filter(user =>
                    user.lastLoginAt && user.lastLoginAt > thirtyDaysAgo
                );
            default:
                this.logger.warn(`未知的用戶狀態過濾條件: ${status}`);
                return entities;
        }
    }

    // 額外的業務方法

    /**
     * 根據郵箱獲取用戶
     */
    async getUserByEmail(email: string): Promise<UserResponseDto | null> {
        this.logger.info('根據郵箱獲取用戶', { email });

        try {
            if (!email || !this.isValidEmail(email)) {
                throw new Error('無效的郵箱地址');
            }

            const allUsers = await this.repository.findAll();
            const user = allUsers.find(u => u.email === email);

            if (!user) {
                this.logger.info('用戶不存在', { email });
                return null;
            }

            return this.mapToResponseDto(user);
        } catch (error) {
            this.logger.error('根據郵箱獲取用戶失敗', error, { email });
            const appError = this.errorHandler.handleError(error, 'get user by email');
            throw appError;
        }
    }

    /**
     * 驗證用戶郵箱
     */
    async verifyUserEmail(userId: string): Promise<UserResponseDto> {
        this.logger.info('驗證用戶郵箱', { userId });

        try {
            const entity = await this.repository.findById(userId);
            if (!entity) {
                throw new Error('用戶不存在');
            }

            entity.verifyEmail();
            await this.repository.save(entity);

            this.logger.info('用戶郵箱驗證成功', { userId });
            this.errorHandler.handleSuccess('郵箱驗證成功');

            return this.mapToResponseDto(entity);
        } catch (error) {
            this.logger.error('驗證用戶郵箱失敗', error, { userId });
            const appError = this.errorHandler.handleError(error, 'verify user email');
            throw appError;
        }
    }

    /**
     * 更新用戶最後登入時間
     */
    async updateLastLogin(userId: string): Promise<void> {
        this.logger.info('更新用戶最後登入時間', { userId });

        try {
            const entity = await this.repository.findById(userId);
            if (!entity) {
                throw new Error('用戶不存在');
            }

            entity.recordLogin();
            await this.repository.save(entity);

            this.logger.info('用戶最後登入時間更新成功', { userId });
        } catch (error) {
            this.logger.error('更新用戶最後登入時間失敗', error, { userId });
            // 這個操作失敗不應該影響主要流程，所以只記錄錯誤
        }
    }

    /**
     * 獲取用戶統計資料
     */
    async getUserStats(): Promise<{
        total: number;
        verified: number;
        unverified: number;
        active: number;
    }> {
        this.logger.info('獲取用戶統計資料');

        try {
            const allUsers = await this.repository.findAll();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const stats = {
                total: allUsers.length,
                verified: allUsers.filter(u => u.isEmailVerified).length,
                unverified: allUsers.filter(u => !u.isEmailVerified).length,
                active: allUsers.filter(u =>
                    u.lastLoginAt && u.lastLoginAt > thirtyDaysAgo
                ).length
            };

            this.logger.info('用戶統計資料獲取成功', stats);
            return stats;
        } catch (error) {
            this.logger.error('獲取用戶統計資料失敗', error);
            const appError = this.errorHandler.handleError(error, 'get user stats');
            throw appError;
        }
    }

    // 私有輔助方法

    /**
     * 驗證郵箱格式
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * 生成唯一 ID
     */
    private generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}