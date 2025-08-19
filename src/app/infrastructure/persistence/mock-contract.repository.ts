import { Injectable } from '@angular/core';
import { ContractRepository } from '@domain/repositories/contract.repository';
import { Contract } from '@shared/types';

@Injectable({ providedIn: 'root' })
export class MockContractRepository implements ContractRepository {
  private contracts: Contract[] = [
    {
      id: 'CTR-001',
      title: 'Foundation and Structural Frame for Tower A',
      name: 'Foundation and Structural Frame for Tower A',
      contractor: 'Steel & Stone Construction Ltd.',
      client: 'Urban Development Group',
      startDate: new Date('2023-01-15'),
      endDate: new Date('2024-01-14'),
      totalValue: 1250000,
      status: 'Active',
      scope: 'Complete foundation work and erect the main structural frame.',
      payments: [],
      changeOrders: [],
      versions: []
    },
    {
      id: 'CTR-002',
      title: 'HVAC Installation for Commercial Complex',
      name: 'HVAC Installation for Commercial Complex',
      contractor: 'Climate Control Systems Inc.',
      client: 'Prime Properties',
      startDate: new Date('2023-03-01'),
      endDate: new Date('2023-09-30'),
      totalValue: 780000,
      status: 'Active',
      scope: 'Install all HVAC systems for a 5-building complex.',
      payments: [],
      changeOrders: [],
      versions: []
    }
  ];

  async getAll(): Promise<Contract[]> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return [...this.contracts];
  }

  async getById(id: string): Promise<Contract | null> {
    await new Promise(resolve => setTimeout(resolve, 20));
    return this.contracts.find(c => c.id === id) || null;
  }

  async create(contractData: Omit<Contract, 'id'>): Promise<Contract> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const newContract: Contract = { ...contractData, id: `CTR-${String(this.contracts.length + 1).padStart(3, '0')}` };
    this.contracts.push(newContract);
    return newContract;
  }

  async update(id: string, updates: Partial<Contract>): Promise<Contract> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const index = this.contracts.findIndex(c => c.id === id);
    if (index === -1) throw new Error(`Contract with id ${id} not found`);
    this.contracts[index] = { ...this.contracts[index], ...updates };
    return this.contracts[index];
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const index = this.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contracts.splice(index, 1);
    }
  }
}


