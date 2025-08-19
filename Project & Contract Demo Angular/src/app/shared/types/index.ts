/**
 * @ai-context {
 *   "role": "Shared/Type",
 *   "purpose": "共享類型定義-專案和合約領域類型",
 *   "constraints": ["類型安全", "接口一致性", "領域語言"],
 *   "dependencies": [],
 *   "security": "none",
 *   "lastmod": "2025-08-19"
 * }
 * @usage import { Project, Task, Contract } from '@shared/types'
 * @see docs/architecture/types.md
 */

// Project Domain Types
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

// Contract Domain Types
export type ContractStatus = "Active" | "Completed" | "On Hold" | "Terminated";

export interface Payment {
  id: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
  requestDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  status: "Approved" | "Pending" | "Rejected";
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

// Dashboard Types
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
