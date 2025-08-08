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

// 合約類型枚舉 - 更新為新的業務類型
export enum ContractType {
  PURE_LABOR = 'pure_labor', // 純工
  MATERIAL_INCLUDED = 'material_included', // 帶料
  SUBCONTRACT = 'subcontract', // 分包
  OUTSOURCING = 'outsourcing' // 外包
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

// 合約創建屬性
export interface CreateContractProps {
  contractName: string;
  contractType: ContractType;
  status?: ContractStatus;
  riskLevel?: RiskLevel;

  // 客戶信息
  clientCompany: string;
  clientRepresentative: string;
  clientContact?: string;
  clientEmail?: string;

  // 合約信息 - 開始日期等於建立日期
  endDate: Date;
  totalAmount: number;
  currency: string;

  // 付款信息
  paymentStatus?: PaymentStatus;
  paidAmount?: number;
  paymentSchedule?: PaymentSchedule[];

  // 審批信息
  approvalStatus?: ApprovalStatus;
  approvers?: string[];

  // 文檔信息
  documents?: ContractDocument[];

  // 風險信息
  risks?: ContractRisk[];
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

  // 合約信息 - 開始日期等於建立日期
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

// 合約實體類
export class ContractEntity {
  /**
   * 創建新合約
   *
   * @param props 合約創建屬性
   * @returns 合約實體
   */
  static create(props: CreateContractProps): Contract {
    const now = new Date();

    return {
      contractNumber: this.generateContractNumber(now),
      contractName: props.contractName,
      contractType: props.contractType,
      status: props.status || ContractStatus.DRAFT,
      riskLevel: props.riskLevel || RiskLevel.LOW,

      // 客戶信息
      clientCompany: props.clientCompany,
      clientRepresentative: props.clientRepresentative,
      clientContact: props.clientContact || '',
      clientEmail: props.clientEmail || '',

      // 合約信息 - 開始日期等於建立日期
      startDate: now, // 開始日期等於建立日期
      endDate: props.endDate,
      totalAmount: props.totalAmount,
      currency: props.currency,

      // 付款信息
      paymentStatus: props.paymentStatus || PaymentStatus.PENDING,
      paidAmount: props.paidAmount || 0,
      paymentSchedule: props.paymentSchedule || [],

      // 審批信息
      approvalStatus: props.approvalStatus || {
        status: 'pending',
        currentStep: 1,
        totalSteps: 3
      },
      approvers: props.approvers || [],

      // 文檔信息
      documents: props.documents || [],

      // 風險信息
      risks: props.risks || [],

      // 時間戳
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * 生成合約編號
   *
   * @param date 日期
   * @returns 合約編號
   */
  private static generateContractNumber(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minute}`;
  }
}
