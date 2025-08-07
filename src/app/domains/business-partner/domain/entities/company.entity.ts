import { BaseAggregateRoot } from '@shared';
import { CompanyId } from '../value-objects/company-id.vo';
import { CompanyStatus, CompanyStatusEnum } from '../value-objects/company-status.vo';
import { RiskLevel, RiskLevelEnum } from '../value-objects/risk-level.vo';
import { Contact } from './contact.entity';

export interface CompanyProps {
    readonly companyName: string;
    readonly businessRegistrationNumber: string;
    readonly status: CompanyStatus;
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
    readonly riskLevel: RiskLevel;
    readonly reviewHistory: string;
    readonly blacklistReason: string | null;
    readonly contacts: readonly Contact[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/**
 * 公司聚合根
 * 使用不可變性設計，提高效能和可預測性
 */
export class Company extends BaseAggregateRoot<CompanyId> {
    private constructor(
        id: CompanyId,
        public readonly companyName: string,
        public readonly businessRegistrationNumber: string,
        public readonly status: CompanyStatus,
        public readonly address: string,
        public readonly businessPhone: string,
        public readonly fax: string,
        public readonly website: string,
        public readonly contractCount: number,
        public readonly latestContractDate: Date | null,
        public readonly partnerSince: Date,
        public readonly cooperationScope: string,
        public readonly businessModel: string,
        public readonly creditScore: number,
        public readonly riskLevel: RiskLevel,
        public readonly reviewHistory: string,
        public readonly blacklistReason: string | null,
        public readonly contacts: readonly Contact[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
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

    // 不可變更新方法，返回新的實例
    updateStatus(newStatus: CompanyStatus): Company {
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            newStatus,
            this.address,
            this.businessPhone,
            this.fax,
            this.website,
            this.contractCount,
            this.latestContractDate,
            this.partnerSince,
            this.cooperationScope,
            this.businessModel,
            this.creditScore,
            this.riskLevel,
            this.reviewHistory,
            this.blacklistReason,
            this.contacts,
            this.createdAt,
            new Date()
        );
    }

    updateRiskLevel(newRiskLevel: RiskLevel): Company {
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.status,
            this.address,
            this.businessPhone,
            this.fax,
            this.website,
            this.contractCount,
            this.latestContractDate,
            this.partnerSince,
            this.cooperationScope,
            this.businessModel,
            this.creditScore,
            newRiskLevel,
            this.reviewHistory,
            this.blacklistReason,
            this.contacts,
            this.createdAt,
            new Date()
        );
    }

    addContact(contact: Contact): Company {
        const newContacts = [...this.contacts, contact];
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.status,
            this.address,
            this.businessPhone,
            this.fax,
            this.website,
            this.contractCount,
            this.latestContractDate,
            this.partnerSince,
            this.cooperationScope,
            this.businessModel,
            this.creditScore,
            this.riskLevel,
            this.reviewHistory,
            this.blacklistReason,
            newContacts,
            this.createdAt,
            new Date()
        );
    }

    removeContact(contactIndex: number): Company {
        if (contactIndex < 0 || contactIndex >= this.contacts.length) {
            throw new Error('Invalid contact index');
        }
        const newContacts = this.contacts.filter((_, index) => index !== contactIndex);
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.status,
            this.address,
            this.businessPhone,
            this.fax,
            this.website,
            this.contractCount,
            this.latestContractDate,
            this.partnerSince,
            this.cooperationScope,
            this.businessModel,
            this.creditScore,
            this.riskLevel,
            this.reviewHistory,
            this.blacklistReason,
            newContacts,
            this.createdAt,
            new Date()
        );
    }

    updateContractCount(newCount: number): Company {
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.status,
            this.address,
            this.businessPhone,
            this.fax,
            this.website,
            newCount,
            this.latestContractDate,
            this.partnerSince,
            this.cooperationScope,
            this.businessModel,
            this.creditScore,
            this.riskLevel,
            this.reviewHistory,
            this.blacklistReason,
            this.contacts,
            this.createdAt,
            new Date()
        );
    }

    // 業務邏輯方法
    isActive(): boolean {
        return this.status.value === CompanyStatusEnum.Active;
    }

    isBlacklisted(): boolean {
        return this.status.value === CompanyStatusEnum.Blacklisted;
    }

    hasHighRisk(): boolean {
        return this.riskLevel.value === RiskLevelEnum.High;
    }

    getPrimaryContact(): Contact | null {
        return this.contacts.find(contact => contact.isPrimary) || null;
    }

    getContactCount(): number {
        return this.contacts.length;
    }

    // 驗證方法
    isValid(): boolean {
        return (
            this.companyName.trim().length > 0 &&
            this.businessRegistrationNumber.trim().length > 0 &&
            this.address.trim().length > 0 &&
            this.businessPhone.trim().length > 0 &&
            this.creditScore >= 0 &&
            this.contractCount >= 0
        );
    }
}
