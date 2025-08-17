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

// 合約接口 - 擴展版本，包含所有原始功能
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
  // 兼容性字段
  title?: string;
  fileUrl?: string;
}

// 付款接口
export interface Payment {
  id: string;
  contractId: string;
  amount: number;
  requestDate: Date;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  paidDate?: Date;
  createdAt: Date;
}

// 變更單接口
export interface ChangeOrder {
  id: string;
  contractId: string;
  title: string;
  description?: string;
  date: Date;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  impact: {
    cost: number;
    schedule: number;
    scheduleDays?: number; // 兼容性字段
  };
  createdAt: Date;
}

// 合約版本接口
export interface ContractVersion {
  id: string;
  contractId: string;
  version: number;
  date: Date;
  changeSummary: string;
  createdAt: Date;
}

// 合約統計接口
export interface ContractStats {
  totalContracts: number;
  active: number;
  completed: number;
  totalValue: number;
}

// 合約摘要輸入接口
export interface SummarizeContractInput {
  file: File;
  summaryType: 'brief' | 'detailed' | 'financial';
  language: 'zh-TW' | 'en-US';
}

// 合約摘要輸出接口
export interface SummarizeContractOutput {
  summary: string;
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
export type TaskStatus = 'pending' | 'In Progress' | 'Completed' | 'completed';

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
  price?: number; // 兼容性字段
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
  // 兼容性字段
  name?: string;
}

// 文檔接口
export interface Document {
  id: string;
  name: string;
  type: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
  expiryDate?: Date;
  fileUrl: string;
  fileSize: number;
  uploadDate: Date;
  uploader: string;
  tags: string[];
  relatedEntity?: {
    type: 'Project' | 'Contract' | 'Partner';
    id: string;
  };
  version: number;
  versionHistory: DocumentVersion[];
}

// 文檔版本接口
export interface DocumentVersion {
  version: number;
  date: Date;
  changeSummary: string;
  fileUrl: string;
  fileSize: number;
}

// AI分析接口
export interface AIAnalysis {
  id: string;
  entityId: string;
  entityType: 'Project' | 'Contract' | 'Partner' | 'Document';
  analysisType: 'Sentiment' | 'Classification' | 'Extraction' | 'Summary';
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  input: string;
  output?: string;
  confidence: number;
  model: string;
  processingTime: number;
  createdAt: Date;
  updatedAt: Date;
  error?: string;
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

// 合約創建 DTO
export interface CreateContractDto {
  name: string;
  contractor: string;
  client: string;
  startDate: Date;
  endDate: Date;
  totalValue: number;
  scope: string;
  createdBy?: string;
}

// 合約更新 DTO
export interface UpdateContractDto {
  name?: string;
  contractor?: string;
  client?: string;
  startDate?: Date;
  endDate?: Date;
  totalValue?: number;
  scope?: string;
  status?: Contract['status'];
}

// 合作夥伴創建 DTO
export interface CreatePartnerDto {
  name: string;
  logoUrl: string;
  category: Partner['category'];
  overview: string;
  website: string;
}

// 合作夥伴更新 DTO
export interface UpdatePartnerDto {
  name?: string;
  logoUrl?: string;
  category?: Partner['category'];
  status?: Partner['status'];
  overview?: string;
  website?: string;
}

// 文檔創建 DTO
export interface CreateDocumentDto {
  name: string;
  type: string;
  fileUrl: string;
  fileSize: number;
  uploader: string;
  tags: string[];
  expiryDate?: Date;
  relatedEntity?: Document['relatedEntity'];
}

// 文檔更新 DTO
export interface UpdateDocumentDto {
  name?: string;
  type?: string;
  status?: Document['status'];
  tags?: string[];
  expiryDate?: Date;
}

// AI分析創建 DTO
export interface CreateAIAnalysisDto {
  entityId: string;
  entityType: AIAnalysis['entityType'];
  analysisType: AIAnalysis['analysisType'];
  input: string;
  model: string;
}

// AI分析更新 DTO
export interface UpdateAIAnalysisDto {
  status?: AIAnalysis['status'];
  output?: string;
  confidence?: number;
  processingTime?: number;
  error?: string;
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

// 導航項目接口
export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  shortcut?: [string, string];
  icon?: string;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

// 產品接口
export interface Product {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
}
