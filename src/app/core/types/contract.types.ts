/**
 * 合約管理系統統一型別定義
 * 解決型別不一致問題，提供統一的型別處理
 */

import { Timestamp } from '@angular/fire/firestore';

// ===== 基礎型別 =====

/** 金額型別 - 統一處理 null/undefined */
export type AmountValue = number | null;

/** 格式化金額型別 */
export interface FormattedAmount {
  value: AmountValue;
  formatted: string;
  currency: string;
}

/** 進度型別 - 0-100 */
export type ProgressValue = number;

/** 狀態型別 */
export type ContractStatus = 'draft' | 'preparing' | 'active' | 'completed';

// ===== 核心介面 =====

/** 合約版本控制 */
export interface ContractVersion {
  versionNumber: number;
  type: 'initial' | 'addition' | 'reduction' | 'modification';
  amount: AmountValue;
  description: string;
  createdAt: Timestamp;
  approvedBy?: string;
}

/** 合約實體 */
export interface Contract {
  id?: string;
  contractCode: string;
  clientName: string;
  contractName: string;
  status: ContractStatus;
  projectManager: string;
  totalAmount: AmountValue;
  progress: ProgressValue;
  description?: string;
  versions: ContractVersion[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  lastModified?: Timestamp;
}

// ===== 查詢型別 =====

/** 搜索參數 */
export interface SearchParam {
  contractCode?: string;
  clientName?: string;
  contractName?: string;
  status?: ContractStatus;
  minAmount?: AmountValue;
  maxAmount?: AmountValue;
}

/** 狀態選項 */
export interface StatusOption {
  label: string;
  value: ContractStatus;
  color: string;
}

// ===== 統計型別 =====

/** 合約統計 */
export interface ContractStats {
  total: number;
  draft: number;
  preparing: number;
  active: number;
  completed: number;
  totalAmount: AmountValue;
}

// ===== 表格型別 =====

/** 表格配置 */
export interface TableConfig {
  headers: TableHeader[];
  total: number;
  showCheckbox: boolean;
  loading: boolean;
  pageSize: number;
  pageIndex: number;
}

/** 表格標題 */
export interface TableHeader {
  title: string;
  field?: string;
  width?: number;
  fixed?: boolean;
  fixedDir?: 'left' | 'right';
  tdTemplate?: any;
  showSort?: boolean;
}

// ===== 工具型別 =====

/** 型別轉換結果 */
export interface TypeConversionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ===== 錯誤型別 =====

/** 合約錯誤類型 */
export enum ContractErrorType {
  PERMISSION_DENIED = 'permission-denied',
  UNAVAILABLE = 'unavailable',
  UNAUTHENTICATED = 'unauthenticated',
  CONTRACT_NOT_FOUND = 'contract-not-found',
  VERSION_CONFLICT = 'version-conflict',
  INVALID_STATUS_TRANSITION = 'invalid-status-transition',
  AMOUNT_VALIDATION_FAILED = 'amount-validation-failed',
  DUPLICATE_CONTRACT_CODE = 'duplicate-contract-code',
  INVALID_VERSION_TYPE = 'invalid-version-type',
  APPROVAL_REQUIRED = 'approval-required'
}

/** 合約錯誤 */
export interface ContractError {
  type: ContractErrorType;
  message: string;
  suggestion?: string;
  guidance?: string;
} 