import { BaseAggregateRoot } from '@shared';
import { CompanyId } from '../value-objects/company-id.vo';
import { CompanyStatus, CompanyStatusEnum } from '../value-objects/company-status.vo';
import { RiskLevel, RiskLevelEnum } from '../value-objects/risk-level.vo';
import { Contact } from './contact.entity';

/**
 * 公司創建屬性
 * 極簡設計，只包含必要欄位
 */
export interface CreateCompanyProps {
    companyName: string;
    businessRegistrationNumber: string;
    address: string;
    businessPhone: string;
    status?: CompanyStatusEnum;
    riskLevel?: RiskLevelEnum;
    fax?: string;
    website?: string;
    contacts?: Contact[];
}

/**
 * 公司聚合根
 * 極簡設計，遵循 DDD 原則，使用不可變性
 */
export class Company extends BaseAggregateRoot<CompanyId> {
    private constructor(
        id: CompanyId,
        public readonly companyName: string,
        public readonly businessRegistrationNumber: string,
        public readonly address: string,
        public readonly businessPhone: string,
        public readonly status: CompanyStatus,
        public readonly riskLevel: RiskLevel,
        public readonly fax: string,
        public readonly website: string,
        public readonly contacts: readonly Contact[],
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
        super(id);
    }

    static create(props: CreateCompanyProps): Company {
        // 基本驗證
        if (!props.companyName?.trim()) throw new Error('Company name is required');
        if (!props.businessRegistrationNumber?.trim()) throw new Error('Business registration number is required');
        if (!props.address?.trim()) throw new Error('Address is required');
        if (!props.businessPhone?.trim()) throw new Error('Business phone is required');

        const now = new Date();
        return new Company(
            CompanyId.generate(),
            props.companyName.trim(),
            props.businessRegistrationNumber.trim(),
            props.address.trim(),
            props.businessPhone.trim(),
            CompanyStatus.create(props.status || CompanyStatusEnum.Active),
            RiskLevel.create(props.riskLevel || RiskLevelEnum.Low),
            props.fax?.trim() || '',
            props.website?.trim() || '',
            props.contacts || [],
            now,
            now
        );
    }

    // Getters
    get companyId(): CompanyId {
        return this.id;
    }

    // 不可變更新方法
    updateBasicInfo(props: Partial<CreateCompanyProps>): Company {
        return new Company(
            this.id,
            props.companyName?.trim() || this.companyName,
            props.businessRegistrationNumber?.trim() || this.businessRegistrationNumber,
            props.address?.trim() || this.address,
            props.businessPhone?.trim() || this.businessPhone,
            this.status,
            this.riskLevel,
            props.fax?.trim() ?? this.fax,
            props.website?.trim() ?? this.website,
            this.contacts,
            this.createdAt,
            new Date()
        );
    }

    updateStatus(status: CompanyStatus): Company {
        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.address,
            this.businessPhone,
            status,
            this.riskLevel,
            this.fax,
            this.website,
            this.contacts,
            this.createdAt,
            new Date()
        );
    }

    addContact(contact: Contact): Company {
        // 業務規則：只能有一個主要聯絡人
        let updatedContacts = [...this.contacts];
        if (contact.isPrimary) {
            updatedContacts = updatedContacts.map(c =>
                new Contact(c.name, c.title, c.email, c.phone, false)
            );
        }
        updatedContacts.push(contact);

        return new Company(
            this.id,
            this.companyName,
            this.businessRegistrationNumber,
            this.address,
            this.businessPhone,
            this.status,
            this.riskLevel,
            this.fax,
            this.website,
            updatedContacts,
            this.createdAt,
            new Date()
        );
    }

    // 業務邏輯方法
    isActive(): boolean {
        return this.status.isActive();
    }

    isHighRisk(): boolean {
        return this.riskLevel.isHigh();
    }

    getPrimaryContact(): Contact | null {
        return this.contacts.find(c => c.isPrimary) || null;
    }

    // 驗證方法
    isValid(): boolean {
        return !!(
            this.companyName?.trim() &&
            this.businessRegistrationNumber?.trim() &&
            this.address?.trim() &&
            this.businessPhone?.trim()
        );
    }

    // 序列化方法（用於 Firebase）
    toPlainObject(): any {
        return {
            id: this.id.value,
            companyName: this.companyName,
            businessRegistrationNumber: this.businessRegistrationNumber,
            address: this.address,
            businessPhone: this.businessPhone,
            status: this.status.value,
            riskLevel: this.riskLevel.value,
            fax: this.fax,
            website: this.website,
            contacts: this.contacts.map(c => ({
                name: c.name,
                title: c.title,
                email: c.email,
                phone: c.phone,
                isPrimary: c.isPrimary
            })),
            createdAt: this.createdAt.toISOString(),
            updatedAt: this.updatedAt.toISOString()
        };
    }
}