/**
 * Contract DTOs for application layer
 */

export interface CreateContractDto {
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

export interface UpdateContractDto {
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

export interface ContractDto {
  id: string;
  contractNumber: string;
  clientName: string;
  clientRepresentative: string;
  contactPerson: string;
  contractName: string;
  amount: number;
  status: string;
  contactPhone?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractListDto {
  contracts: ContractDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContractSearchDto {
  status?: string;
  clientName?: string;
  contractName?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

export interface ContractStatsDto {
  total: number;
  draft: number;
  preparing: number;
  inProgress: number;
  completed: number;
} 