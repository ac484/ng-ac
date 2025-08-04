/**
 * Contract DTOs for application layer
 */

import {
  BaseCreateDto,
  BaseUpdateDto,
  BaseResponseDto,
  ListResponseDto,
  SearchCriteriaDto,
  BaseStatsDto
} from './base.dto';

/**
 * DTO for creating a new contract
 * 擴展標準化的 BaseCreateDto
 */
export interface CreateContractDto extends BaseCreateDto {
  contractNumber?: string;
  clientName: string;
  clientRepresentative?: string;
  contactPerson?: string;
  contractName: string;
  amount: number;
  status?: string;
  contactPhone?: string;
  notes?: string;
}

/**
 * DTO for updating contract information
 * 擴展標準化的 BaseUpdateDto
 */
export interface UpdateContractDto extends BaseUpdateDto {
  contractNumber?: string;
  clientName?: string;
  clientRepresentative?: string;
  contactPerson?: string;
  contractName?: string;
  amount?: number;
  status?: string;
  contactPhone?: string;
  notes?: string;
}

/**
 * DTO for contract data transfer
 * 擴展標準化的 BaseResponseDto
 */
export interface ContractDto extends BaseResponseDto {
  contractNumber: string;
  clientName: string;
  clientRepresentative: string;
  contactPerson: string;
  contractName: string;
  amount: number;
  status: string;
  contactPhone?: string;
  notes?: string;
}

/**
 * DTO for contract list response
 * 使用標準化的 ListResponseDto 格式
 */
export interface ContractListDto extends ListResponseDto<ContractDto> {
  // 繼承標準列表回應格式
  // 向後相容性：保留舊的屬性名稱
  contracts: ContractDto[]; // Alias for items
  // 可以添加合約特定的額外欄位
  totalAmount?: number;
  averageAmount?: number;
}

/**
 * DTO for contract search parameters
 * 擴展標準化的 SearchCriteriaDto
 */
export interface ContractSearchDto extends SearchCriteriaDto {
  clientName?: string;
  contractName?: string;
  contractNumber?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * DTO for contract statistics
 * 擴展標準化的 BaseStatsDto
 */
export interface ContractStatsDto extends BaseStatsDto {
  draft: number;
  preparing: number;
  inProgress: number;
  completed: number;
  totalAmount: number;
  averageAmount: number;
  byStatus: {
    [status: string]: number;
  };
} 