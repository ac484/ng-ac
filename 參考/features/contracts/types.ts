export interface Contract {
  id: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'TERMINATED';
  scope: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  payments: Payment[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}

export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  requestDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: Date;
  createdAt: Date;
}

export interface ChangeOrder {
  id: string;
  contractId: string;
  title: string;
  date: Date;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  impact: {
    cost: number;
    schedule: number;
  };
  createdAt: Date;
}

export interface ContractVersion {
  id: string;
  contractId: string;
  version: number;
  date: Date;
  changeSummary: string;
  createdAt: Date;
}

export interface ContractStats {
  totalContracts: number;
  active: number;
  completed: number;
  totalValue: number;
}

export interface SummarizeContractInput {
  file: File;
  summaryType: 'brief' | 'detailed' | 'financial';
  language: 'zh-TW' | 'en-US';
}

export interface SummarizeContractOutput {
  summary: string;
}
