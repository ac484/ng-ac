// 合約狀態枚舉
export enum ContractStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  TERMINATED = 'terminated',
  EXPIRED = 'expired'
}

// 合約類型枚舉
export enum ContractType {
  SERVICE = 'service',
  PRODUCT = 'product',
  LICENSING = 'licensing',
  PARTNERSHIP = 'partnership',
  EMPLOYMENT = 'employment'
}

// 風險等級枚舉
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// 付款狀態枚舉
export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  COMPLETED = 'completed',
  OVERDUE = 'overdue'
}

// 合約實體
export interface Contract {
  id?: string;
  contractNumber: string;
  contractName: string;
  contractType: ContractType;
  status: ContractStatus;
  riskLevel: RiskLevel;
  
  // 客戶信息
  clientCompany: string;
  clientRepresentative: string;
  clientContact: string;
  clientEmail: string;
  
  // 合約信息
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  currency: string;
  
  // 付款信息
  paymentStatus: PaymentStatus;
  paidAmount: number;
  paymentSchedule: PaymentSchedule[];
  
  // 審批信息
  approvalStatus: ApprovalStatus;
  approvers: string[];
  approvedBy?: string;
  approvedAt?: Date;
  
  // 文檔信息
  documents: ContractDocument[];
  
  // 風險信息
  risks: ContractRisk[];
  
  // 時間戳
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// 合約ID擴展
export interface ContractId extends Contract {
  id: string;
}

// 付款計劃
export interface PaymentSchedule {
  id: string;
  dueDate: Date;
  amount: number;
  status: PaymentStatus;
  paidAt?: Date;
}

// 審批狀態
export interface ApprovalStatus {
  status: 'pending' | 'approved' | 'rejected';
  currentStep: number;
  totalSteps: number;
  comments?: string;
}

// 合約文檔
export interface ContractDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image';
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// 合約風險
export interface ContractRisk {
  id: string;
  description: string;
  level: RiskLevel;
  mitigation: string;
  assignedTo?: string;
  dueDate?: Date;
}
