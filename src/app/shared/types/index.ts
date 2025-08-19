/**
 * Shared domain types for Projects and Contracts (minimal set)
 */

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  lastUpdated: string;
  subTasks: Task[];
  value: number;
  quantity: number;
  unitPrice: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  value: number;
}

export type ContractStatus = 'Active' | 'Completed' | 'On Hold' | 'Terminated';

export interface Payment {
  id: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  requestDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: Date;
  impact: {
    cost: number;
    scheduleDays: number;
  };
}

export interface ContractVersion {
  version: number;
  date: Date;
  changeSummary: string;
}

export interface Contract {
  id: string;
  title: string;
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  status: ContractStatus;
  scope: string;
  payments: Payment[];
  changeOrders: ChangeOrder[];
  versions: ContractVersion[];
}

export interface DashboardStats {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  upcomingDeadlines: Project[];
}

export interface ContractStats {
  total: number;
  active: number;
  completed: number;
  totalValue: number;
}


