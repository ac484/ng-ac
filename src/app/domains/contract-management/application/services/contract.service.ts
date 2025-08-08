import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CONTRACT_REPOSITORY } from '../../contract-management.providers';
import { Contract, ContractId, ContractEntity, CreateContractProps } from '../../domain/entities/contract.entity';

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

  async createContract(contractProps: CreateContractProps): Promise<string> {
    // 業務邏輯驗證
    if (!contractProps.contractName) {
      throw new Error('合約名稱為必填項目');
    }

    if (contractProps.totalAmount <= 0) {
      throw new Error('總金額必須大於0');
    }

    if (!contractProps.endDate) {
      throw new Error('結束日期為必填項目');
    }

    // 檢查結束日期是否在未來
    const now = new Date();
    if (contractProps.endDate <= now) {
      throw new Error('結束日期必須在未來');
    }

    // 使用 ContractEntity.create 創建合約
    const contract = ContractEntity.create(contractProps);

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
