import { Observable } from 'rxjs';

import { Contract, ContractId } from '../entities/contract.entity';

export interface ContractRepository {
  getAll(): Observable<ContractId[]>;
  getById(id: string): Observable<ContractId | undefined>;
  create(contract: Contract): Promise<string>;
  update(id: string, contract: Partial<Contract>): Promise<void>;
  delete(id: string): Promise<void>;
}
