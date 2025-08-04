import { Injectable } from '@angular/core';
import { Contract } from '../../domain/entities/contract.entity';
import { ContractRepository, ContractSearchCriteria } from '../../domain/repositories/contract.repository';
import { 
  ContractNumber, 
  ContractStatus, 
  ClientName, 
  ClientRepresentative, 
  ContactPerson, 
  ContractName 
} from '../../domain/value-objects/contract';
import { Money } from '../../domain/value-objects/account/money.value-object';

@Injectable()
export class MockContractRepository implements ContractRepository {
  private contracts: Contract[] = [];

  constructor() {
    this.initializeMockData();
  }

  async findById(id: string): Promise<Contract | null> {
    return this.contracts.find(c => c.id === id) || null;
  }

  async findByContractNumber(contractNumber: string): Promise<Contract | null> {
    return this.contracts.find(c => c.contractNumber.getValue() === contractNumber) || null;
  }

  async findByDate(date: Date): Promise<Contract[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.contracts.filter(c => 
      c.createdAt >= startOfDay && c.createdAt <= endOfDay
    );
  }

  async findAll(criteria?: ContractSearchCriteria): Promise<Contract[]> {
    let filtered = [...this.contracts];

    if (criteria?.status) {
      filtered = filtered.filter(c => c.status.getValue() === criteria.status);
    }
    if (criteria?.clientName) {
      filtered = filtered.filter(c => 
        c.clientName.getValue().toLowerCase().includes(criteria.clientName!.toLowerCase())
      );
    }
    if (criteria?.contractName) {
      filtered = filtered.filter(c => 
        c.contractName.getValue().toLowerCase().includes(criteria.contractName!.toLowerCase())
      );
    }

    // Simple pagination
    const page = criteria?.page || 1;
    const pageSize = criteria?.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return filtered.slice(start, end);
  }

  async save(contract: Contract): Promise<void> {
    const existingIndex = this.contracts.findIndex(c => c.id === contract.id);
    if (existingIndex >= 0) {
      this.contracts[existingIndex] = contract;
    } else {
      this.contracts.push(contract);
    }
  }

  async delete(id: string): Promise<void> {
    this.contracts = this.contracts.filter(c => c.id !== id);
  }

  async countByStatus(status: string): Promise<number> {
    return this.contracts.filter(c => c.status.getValue() === status).length;
  }

  private initializeMockData(): void {
    const mockContracts = [
      this.createMockContract('1', '202412190001', '台灣電力公司', '張經理', '李小姐', '變電站設備維護合約', 1500000),
      this.createMockContract('2', '202412190002', '中華電信', '王主任', '陳先生', '通訊設備安裝合約', 2300000),
      this.createMockContract('3', '202412190003', '台積電', '林副總', '黃小姐', '廠房電力系統建置', 5000000),
    ];

    this.contracts = mockContracts;
  }

  private createMockContract(
    id: string,
    contractNumber: string,
    clientName: string,
    clientRepresentative: string,
    contactPerson: string,
    contractName: string,
    amount: number
  ): Contract {
    return new Contract(
      id,
      new ContractNumber(contractNumber),
      new ClientName(clientName),
      new ClientRepresentative(clientRepresentative),
      new ContactPerson(contactPerson),
      new ContractName(contractName),
      new Money(amount),
      new ContractStatus(ContractStatus.IN_PROGRESS),
      undefined, // contactPhone
      undefined, // notes
      new Date('2024-12-19'),
      new Date('2024-12-19')
    );
  }
} 