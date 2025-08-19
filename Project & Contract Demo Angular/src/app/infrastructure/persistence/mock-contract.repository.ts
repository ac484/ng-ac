/**
 * @ai-context {
 *   "role": "Infrastructure/Repository",
 *   "purpose": "模擬合約倉儲-合約數據模擬實現",
 *   "constraints": ["實現領域接口", "靜態數據", "開發測試用"],
 *   "dependencies": ["ContractRepository", "Contract"],
 *   "security": "low",
 *   "lastmod": "2025-01-18"
 * }
 * @usage contractRepo.getAll(), contractRepo.getById(id)
 * @see docs/architecture/infrastructure.md
 */
import { Injectable } from '@angular/core';
import { ContractRepository } from '../../domain/repositories/contract.repository';
import { Contract } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
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
      scope: 'Complete foundation work and erect the main structural frame for the 20-story Tower A, including all necessary materials and labor.',
      payments: [
        { id: 'PAY-001', amount: 125000, status: 'Paid', requestDate: new Date('2023-02-01'), dueDate: new Date('2023-02-15'), paidDate: new Date('2023-03-01') },
        { id: 'PAY-002', amount: 250000, status: 'Paid', requestDate: new Date('2023-05-01'), dueDate: new Date('2023-05-20'), paidDate: new Date('2023-06-05') },
        { id: 'PAY-003', amount: 250000, status: 'Pending', requestDate: new Date('2023-08-01'), dueDate: new Date('2023-08-18') },
      ],
      changeOrders: [
        { id: 'CO-001', title: 'Additional reinforcement in basement level 2', description: 'Client requested higher-grade steel reinforcement due to updated seismic codes.', status: 'Approved', date: new Date('2023-04-10'), impact: { cost: 50000, scheduleDays: 14 } },
      ],
      versions: [
        { version: 1, date: new Date('2023-01-15'), changeSummary: 'Initial contract signing.' },
        { version: 2, date: new Date('2023-04-10'), changeSummary: 'CO-001: Additional reinforcement.' },
      ],
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
      scope: 'Installation of all heating, ventilation, and air conditioning systems for the new 5-building commercial complex.',
      payments: [
        { id: 'PAY-004', amount: 78000, status: 'Paid', requestDate: new Date('2023-03-15'), dueDate: new Date('2023-03-30'), paidDate: new Date('2023-04-15') },
        { id: 'PAY-005', amount: 156000, status: 'Pending', requestDate: new Date('2023-06-10'), dueDate: new Date('2023-06-25') },
      ],
      changeOrders: [],
      versions: [
        { version: 1, date: new Date('2023-03-01'), changeSummary: 'Initial contract signing.' },
      ],
    },
    {
      id: 'CTR-003',
      title: 'Site Landscaping and Exterior Finishing',
      name: 'Site Landscaping and Exterior Finishing',
      contractor: 'Green Spaces Landscaping Co.',
      client: 'Urban Development Group',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      totalValue: 450000,
      status: 'Completed',
      scope: 'Full site landscaping, including irrigation, planting, paving, and exterior lighting for Tower A and surrounding areas.',
      payments: [
        { id: 'PAY-006', amount: 225000, status: 'Paid', requestDate: new Date('2024-03-01'), dueDate: new Date('2024-03-15'), paidDate: new Date('2024-04-01') },
        { id: 'PAY-007', amount: 225000, status: 'Paid', requestDate: new Date('2024-06-20'), dueDate: new Date('2024-07-05'), paidDate: new Date('2024-07-20') },
      ],
      changeOrders: [],
      versions: [
        { version: 1, date: new Date('2024-01-01'), changeSummary: 'Initial contract signing.' },
      ],
    }
  ];

  async getAll(): Promise<Contract[]> {
    // 模擬異步操作
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...this.contracts];
  }

  async getById(id: string): Promise<Contract | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return this.contracts.find(c => c.id === id) || null;
  }

  async create(contractData: Omit<Contract, 'id'>): Promise<Contract> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const newContract: Contract = {
      ...contractData,
      id: `CTR-${String(this.contracts.length + 1).padStart(3, '0')}`
    };
    this.contracts.push(newContract);
    return newContract;
  }

  async update(id: string, updates: Partial<Contract>): Promise<Contract> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contracts[index] = { ...this.contracts[index], ...updates };
      return this.contracts[index];
    }
    throw new Error(`Contract with id ${id} not found`);
  }

  async delete(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const index = this.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contracts.splice(index, 1);
    }
  }
}
