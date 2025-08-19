import { Contract } from '@shared/types';

export interface ContractRepository {
  getAll(): Promise<Contract[]>;
  getById(id: string): Promise<Contract | null>;
  create(contractData: Omit<Contract, 'id'>): Promise<Contract>;
  update(id: string, updates: Partial<Contract>): Promise<Contract>;
  delete(id: string): Promise<void>;
}


