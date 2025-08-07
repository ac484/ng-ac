import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { ContactProps } from '../../domain/entities/contact.entity';

export interface CreateCompanyDto {
    companyName: string;
    businessRegistrationNumber: string;
    status: CompanyStatusEnum;
    address: string;
    businessPhone: string;
    fax: string;
    website: string;
    contractCount: number;
    latestContractDate: Date | null;
    partnerSince: Date;
    cooperationScope: string;
    businessModel: string;
    creditScore: number;
    riskLevel: RiskLevelEnum;
    reviewHistory: string;
    blacklistReason: string | null;
    contacts: ContactProps[];
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> { }

export interface CompanyResponseDto {
    id: string;
    companyName: string;
    businessRegistrationNumber: string;
    status: CompanyStatusEnum;
    address: string;
    businessPhone: string;
    fax: string;
    website: string;
    contractCount: number;
    latestContractDate: string | null;
    partnerSince: string;
    cooperationScope: string;
    businessModel: string;
    creditScore: number;
    riskLevel: RiskLevelEnum;
    reviewHistory: string;
    blacklistReason: string | null;
    contacts: ContactProps[];
    createdAt: string;
    updatedAt: string;
}


