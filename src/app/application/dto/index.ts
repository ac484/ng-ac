/**
 * DTO 模組統一匯出
 * 提供所有 DTO 介面的統一存取點
 */

// 基礎 DTO 介面
export * from './base.dto';

// DTO 工具函數
export * from './dto-utils';

// 業務 DTO 介面
export * from './user.dto';
export * from './account.dto';
export * from './transaction.dto';
export * from './contract.dto';

// 為了向後相容性，重新匯出常用的基礎介面
export type {
    BaseCreateDto,
    BaseUpdateDto,
    BaseResponseDto,
    ListResponseDto,
    SearchCriteriaDto,
    BaseStatsDto,
    OperationResultDto,
    ValidationResultDto
} from './base.dto';