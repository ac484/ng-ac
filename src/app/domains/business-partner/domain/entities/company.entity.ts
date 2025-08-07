import { BaseAggregateRoot } from '@shared';
import { CompanyId } from '../value-objects/company-id.vo';
import { CompanyStatus, CompanyStatusEnum } from '../value-objects/company-status.vo';
import { RiskLevel, RiskLevelEnum } from '../value-objects/risk-level.vo';
import { Contact } from './contact.entity';

export interface CompanyProps {
    companyName: string;
    businessRegistrationNumber: string;
    status: CompanyStatus;
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
    riskLevel: RiskLevel;
    reviewHistory: string;
    blacklistReason: string | null;
    contacts: Contact[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 公司聚合根
 */
export class Company extends BaseAggregateRoot<CompanyId> {
    private constructor(
        id: CompanyId,
        public companyName: string,
        public businessRegistrationNumber: string,
        public status: CompanyStatus,
        public address: string,
        public businessPhone: string,
        public fax: string,
        public website: string,
        public contractCount: number,
        public latestContractDate: Date | null,
        public partnerSince: Date,
        public cooperationScope: string,
        public businessModel: string,
        public creditScore: number,
        public riskLevel: RiskLevel,
        public reviewHistory: string,
        public blacklistReason: string | null,
        public contacts: Contact[],
        public readonly createdAt: Date,
        public updatedAt: Date
    ) {
        super(id);
    }

    static create(props: Omit<CompanyProps, 'id' | 'createdAt' | 'updatedAt'>): Company {
        const now = new Date();
        return new Company(
            CompanyId.generate(),
            props.companyName,
            props.businessRegistrationNumber,
            props.status,
            props.address,
            props.businessPhone,
            props.fax,
            props.website,
            props.contractCount || 0,
            props.latestContractDate || null,
            props.partnerSince,
            props.cooperationScope,
            props.businessModel,
            props.creditScore || 0,
            props.riskLevel,
            props.reviewHistory,
            props.blacklistReason || null,
            props.contacts || [],
            now,
            now
        );
    }

    get companyId(): CompanyId {
        return this.id;
    }
}
