import { BaseAggregateRoot } from '@shared';

import { Contact } from './contact.entity';
import { CompanyId } from '../value-objects/company-id.vo';
import { CompanyStatus, CompanyStatusEnum } from '../value-objects/company-status.vo';
import { DynamicWorkflowStateVO } from '../value-objects/dynamic-workflow-state.vo';
import { PaymentWorkflowState } from '../value-objects/payment-workflow-state.vo';
import { RiskLevel, RiskLevelEnum } from '../value-objects/risk-level.vo';

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
  paymentWorkflow?: PaymentWorkflowState;
  dynamicWorkflow?: DynamicWorkflowStateVO;
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
    public readonly paymentWorkflow: PaymentWorkflowState | null,
    public readonly dynamicWorkflow: DynamicWorkflowStateVO | null,
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
      props.paymentWorkflow || PaymentWorkflowState.create(),
      props.dynamicWorkflow || null,
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
    const newCompanyName = props.companyName?.trim() || this.companyName;
    const newBusinessRegistrationNumber = props.businessRegistrationNumber?.trim() || this.businessRegistrationNumber;
    const newAddress = props.address?.trim() || this.address;
    const newBusinessPhone = props.businessPhone?.trim() || this.businessPhone;
    const newFax = props.fax?.trim() ?? this.fax;
    const newWebsite = props.website?.trim() ?? this.website;
    const newPaymentWorkflow = props.paymentWorkflow ?? this.paymentWorkflow;
    const newDynamicWorkflow = props.dynamicWorkflow ?? this.dynamicWorkflow;

    // 檢查是否有實際變化
    const hasChanges =
      newCompanyName !== this.companyName ||
      newBusinessRegistrationNumber !== this.businessRegistrationNumber ||
      newAddress !== this.address ||
      newBusinessPhone !== this.businessPhone ||
      newFax !== this.fax ||
      newWebsite !== this.website ||
      newPaymentWorkflow !== this.paymentWorkflow ||
      newDynamicWorkflow !== this.dynamicWorkflow;

    return new Company(
      this.id,
      newCompanyName,
      newBusinessRegistrationNumber,
      newAddress,
      newBusinessPhone,
      this.status,
      this.riskLevel,
      newFax,
      newWebsite,
      this.contacts,
      newPaymentWorkflow,
      newDynamicWorkflow,
      this.createdAt,
      hasChanges ? new Date() : this.updatedAt // ✅ 只有在有變化時才更新時間戳
    );
  }

  updateStatus(status: CompanyStatus): Company {
    // 檢查狀態是否有實際變化
    const hasStatusChange = !this.status.value || this.status.value !== status.value;

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
      this.paymentWorkflow,
      this.dynamicWorkflow,
      this.createdAt,
      hasStatusChange ? new Date() : this.updatedAt // ✅ 只有在狀態變化時才更新時間戳
    );
  }

  addContact(contact: Contact): Company {
    // 業務規則：只能有一個主要聯絡人
    let updatedContacts = [...this.contacts];
    if (contact.isPrimary) {
      updatedContacts = updatedContacts.map(c => new Contact(c.name, c.title, c.email, c.phone, false));
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
      this.paymentWorkflow,
      this.dynamicWorkflow,
      this.createdAt,
      new Date() // ✅ 新增聯絡人總是需要更新時間戳
    );
  }

  // 更新聯絡人方法
  updateContact(contactIndex: number, updatedContact: Contact): Company {
    if (contactIndex < 0 || contactIndex >= this.contacts.length) {
      throw new Error(`Invalid contact index: ${contactIndex}`);
    }

    const updatedContacts = [...this.contacts];
    const oldContact = updatedContacts[contactIndex];

    // 檢查聯絡人是否有實際變化
    const hasContactChange =
      oldContact.name !== updatedContact.name ||
      oldContact.title !== updatedContact.title ||
      oldContact.email !== updatedContact.email ||
      oldContact.phone !== updatedContact.phone ||
      oldContact.isPrimary !== updatedContact.isPrimary;

    if (!hasContactChange) {
      return this; // ✅ 沒有變化時返回原實例
    }

    // 業務規則：只能有一個主要聯絡人
    if (updatedContact.isPrimary) {
      for (let i = 0; i < updatedContacts.length; i++) {
        if (i !== contactIndex) {
          updatedContacts[i] = new Contact(
            updatedContacts[i].name,
            updatedContacts[i].title,
            updatedContacts[i].email,
            updatedContacts[i].phone,
            false
          );
        }
      }
    }

    updatedContacts[contactIndex] = updatedContact;

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
      this.paymentWorkflow,
      this.dynamicWorkflow,
      this.createdAt,
      new Date() // ✅ 有變化時更新時間戳
    );
  }

  // 刪除聯絡人方法
  removeContact(contactIndex: number): Company {
    if (contactIndex < 0 || contactIndex >= this.contacts.length) {
      throw new Error(`Invalid contact index: ${contactIndex}`);
    }

    const updatedContacts = [...this.contacts];
    updatedContacts.splice(contactIndex, 1);

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
      this.paymentWorkflow,
      this.dynamicWorkflow,
      this.createdAt,
      new Date() // ✅ 刪除聯絡人總是需要更新時間戳
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
    return !!(this.companyName?.trim() && this.businessRegistrationNumber?.trim() && this.address?.trim() && this.businessPhone?.trim());
  }

  // 動態工作流程管理方法
  updateDynamicWorkflow(workflow: DynamicWorkflowStateVO): Company {
    // 檢查工作流程是否有實際變化
    const hasWorkflowChange =
      !this.dynamicWorkflow || JSON.stringify(this.dynamicWorkflow.toPlainObject()) !== JSON.stringify(workflow.toPlainObject());

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
      this.contacts,
      this.paymentWorkflow,
      workflow,
      this.createdAt,
      hasWorkflowChange ? new Date() : this.updatedAt // ✅ 只有在工作流程變化時才更新時間戳
    );
  }

  // 獲取當前工作流程狀態
  getCurrentWorkflowState(): string {
    return this.dynamicWorkflow?.getCurrentState()?.name || this.paymentWorkflow?.getStateDisplayName() || '無狀態';
  }

  // 檢查是否可以執行工作流程轉換
  canExecuteWorkflowTransition(targetStateId: string): boolean {
    return this.dynamicWorkflow?.canTransitionTo(targetStateId) || false;
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
      dynamicWorkflow: this.dynamicWorkflow?.toPlainObject(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
