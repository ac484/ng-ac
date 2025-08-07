import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { ContactProps } from '../../domain/entities/contact.entity';

export interface CreateCompanyDto {
    readonly companyName: string;
    readonly businessRegistrationNumber: string;
    readonly status: CompanyStatusEnum;
    readonly address: string;
    readonly businessPhone: string;
    readonly fax: string;
    readonly website: string;
    readonly contractCount: number;
    readonly latestContractDate: Date | null;
    readonly partnerSince: Date;
    readonly cooperationScope: string;
    readonly businessModel: string;
    readonly creditScore: number;
    readonly riskLevel: RiskLevelEnum;
    readonly reviewHistory: string;
    readonly blacklistReason: string | null;
    readonly contacts: readonly ContactProps[];
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> { }

export interface CompanyResponseDto {
    readonly id: string;
    readonly companyName: string;
    readonly businessRegistrationNumber: string;
    readonly status: CompanyStatusEnum;
    readonly address: string;
    readonly businessPhone: string;
    readonly fax: string;
    readonly website: string;
    readonly contractCount: number;
    readonly latestContractDate: string | null;
    readonly partnerSince: string;
    readonly cooperationScope: string;
    readonly businessModel: string;
    readonly creditScore: number;
    readonly riskLevel: RiskLevelEnum;
    readonly reviewHistory: string;
    readonly blacklistReason: string | null;
    readonly contacts: readonly ContactProps[];
    readonly createdAt: string;
    readonly updatedAt: string;
}


