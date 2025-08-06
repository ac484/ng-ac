import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Contract, ContractId } from '../../domain/entities/contract.entity';
import { ContractRepository } from '../../domain/repositories/contract.repository';
import { CONTRACT_REPOSITORY } from '../../contract-management.providers';

@Injectable({
  providedIn: 'root'
})
export class ContractService {
  private contractRepository = inject(CONTRACT_REPOSITORY);

  getContracts(): Observable<ContractId[]> {
    return this.contractRepository.getAll();
  }

  getContractById(id: string): Observable<ContractId | undefined> {
    return this.contractRepository.getById(id);
  }

  async createContract(contract: Contract): Promise<string> {
    // 業務邏輯驗證
    if (!contract.contractNumber || !contract.contractName) {
      throw new Error('合約編號和合約名稱為必填項目');
    }

    if (contract.totalAmount <= 0) {
      throw new Error('總金額必須大於0');
    }

    return this.contractRepository.create(contract);
  }

  async updateContract(id: string, contract: Partial<Contract>): Promise<void> {
    if (contract.totalAmount !== undefined && contract.totalAmount <= 0) {
      throw new Error('總金額必須大於0');
    }

    return this.contractRepository.update(id, contract);
  }

  async deleteContract(id: string): Promise<void> {
    return this.contractRepository.delete(id);
  }
}
