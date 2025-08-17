/**
 * @ai-context {
 *   "role": "Shared/Type",
 *   "purpose": "Next.js到Angular轉換的類型定義",
 *   "constraints": ["類型安全", "接口一致性", "Angular兼容性"],
 *   "dependencies": [],
 *   "security": "none",
 *   "lastmod": "2024-12-19"
 * }
 * @usage import { Project, Task, Partner } from './types'
 * @see docs/architecture/shared.md
 */

// 聯絡人接口
export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

// 交易接口
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  description: string;
}

// 合規文件接口
export interface ComplianceDocument {
  id: string;
  name: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  expiryDate: string;
  fileUrl: string;
}

// 績效評估接口
export interface PerformanceReview {
  id: string;
  date: string;
  rating: number; // 1-5
  notes: string;
  reviewer: string;
}

// 合約接口
export interface Contract {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Expired' | 'Terminated';
  fileUrl: string;
}

// 合作夥伴接口
export interface Partner {
  id?: string;
  name: string;
  logoUrl: string;
  category: 'Technology' | 'Reseller' | 'Service' | 'Consulting' | 'Subcontractor' | 'Supplier' | 'Equipment';
  status: 'Active' | 'Inactive' | 'Pending';
  overview: string;
  website: string;
  contacts: Contact[];
  transactions: Transaction[];
  joinDate: string;
  performanceReviews: PerformanceReview[];
  complianceDocuments: ComplianceDocument[];
  contracts: Contract[];
}

// 工作流程節點類型
export type WorkflowNode = {
  id: string;
  type: 'start' | 'end' | 'task' | 'decision';
  label: string;
  position: { x: number; y: number };
};

// 工作流程邊緣類型
export type WorkflowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
};

// 工作流程類型
export type Workflow = {
  id?: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  partnerId?: string;
};

// 任務狀態類型
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

// 任務接口
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  lastUpdated: string;
  subTasks: Task[];
  value: number; // 計算為 quantity * unitPrice
  quantity: number;
  unitPrice: number;
}

// 專案接口
export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  value: number;
  status?: 'active' | 'completed' | 'onHold';
  clientId?: string;
  client?: string;
}

// Firebase 查詢選項
export interface BaseQueryOptions {
  orderBy?: { field: string; direction?: 'asc' | 'desc' };
  limit?: number;
  where?: Array<{ field: string; operator: any; value: any }>;
}

// 分頁查詢選項
export interface PaginationOptions extends BaseQueryOptions {
  pageSize: number;
  startAfter?: any;
}

// 專案統計接口
export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
}

// 專案進度接口
export interface ProjectProgress {
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

// 專案創建 DTO
export interface CreateProjectDto {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  value: number;
  status?: 'active' | 'completed' | 'onHold';
  clientId?: string;
  client?: string;
}

// 任務創建 DTO
export interface CreateTaskDto {
  projectId: string;
  parentTaskId: string | null;
  taskTitle: string;
  quantity: number;
  unitPrice: number;
}

// 任務狀態更新 DTO
export interface UpdateTaskStatusDto {
  projectId: string;
  taskId: string;
  status: TaskStatus;
}

// API 響應接口
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

// 分頁響應接口
export interface PaginatedResponse<T> {
  data: T[];
  hasNextPage: boolean;
  lastDoc: any;
  total: number;
}
