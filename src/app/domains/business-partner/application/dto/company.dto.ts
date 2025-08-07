import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';

/**
 * 聯絡人 DTO
 * 極簡設計，用於 API 傳輸
 */
export interface ContactDto {
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

/**
 * 創建公司 DTO
 * 極簡設計，只包含必要欄位
 */
export interface CreateCompanyDto {
  companyName: string;
  businessRegistrationNumber: string;
  address: string;
  businessPhone: string;
  status?: CompanyStatusEnum;
  riskLevel?: RiskLevelEnum;
  fax?: string;
  website?: string;
  contacts?: ContactDto[];
}

/**
 * 更新公司 DTO
 */
export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {
  dynamicWorkflow?: any; // 動態工作流程數據
}

/**
 * 公司回應 DTO
 * 用於 API 回應
 */
export interface CompanyResponseDto {
  id: string;
  companyName: string;
  businessRegistrationNumber: string;
  address: string;
  businessPhone: string;
  status: CompanyStatusEnum;
  riskLevel: RiskLevelEnum;
  fax: string;
  website: string;
  contacts: ContactDto[];
  dynamicWorkflow?: any; // 動態工作流程數據
  createdAt: string;
  updatedAt: string;
}
