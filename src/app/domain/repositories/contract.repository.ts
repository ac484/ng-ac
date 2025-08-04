import { Contract } from '../entities/contract.entity';
import { InjectionToken } from '@angular/core';

/**
 * Contract repository interface
 */
export interface ContractRepository {
  findById(id: string): Promise<Contract | null>;
  findByContractNumber(contractNumber: string): Promise<Contract | null>;
  findByDate(date: Date): Promise<Contract[]>;
  findAll(criteria?: ContractSearchCriteria): Promise<Contract[]>;
  save(contract: Contract): Promise<void>;
  delete(id: string): Promise<void>;
  countByStatus(status: string): Promise<number>;
}

/**
 * Contract search criteria
 */
export interface ContractSearchCriteria {
  status?: string;
  clientName?: string;
  contractName?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

/**
 * Repository token for dependency injection
 */
export const CONTRACT_REPOSITORY_TOKEN = new InjectionToken<ContractRepository>('ContractRepository'); 