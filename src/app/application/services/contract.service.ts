import { inject, Injectable, signal } from '@angular/core';
import { MockContractRepository } from '@infrastructure/persistence/mock-contract.repository';
import { Contract } from '@shared/types';

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly contractRepository = inject(MockContractRepository);
  private readonly _contracts = signal<Contract[]>([]);
  private readonly _loading = signal(false);

  readonly contracts = this._contracts.asReadonly();
  readonly loading = this._loading.asReadonly();

  constructor() { this.loadContracts(); }

  private async loadContracts(): Promise<void> {
    this._loading.set(true);
    try {
      const contracts = await this.contractRepository.getAll();
      this._contracts.set(contracts);
    } catch (error) {
      console.error('Failed to load contracts:', error);
    } finally {
      this._loading.set(false);
    }
  }

  async getContract(id: string): Promise<Contract | null> {
    return await this.contractRepository.getById(id);
  }

  async createContract(contractData: Omit<Contract, 'id'>): Promise<Contract> {
    const contract = await this.contractRepository.create(contractData);
    await this.loadContracts();
    return contract;
  }

  async updateContract(id: string, updates: Partial<Contract>): Promise<Contract> {
    const contract = await this.contractRepository.update(id, updates);
    await this.loadContracts();
    return contract;
  }

  async deleteContract(id: string): Promise<void> {
    await this.contractRepository.delete(id);
    await this.loadContracts();
  }
}


