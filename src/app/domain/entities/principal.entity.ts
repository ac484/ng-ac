import { OptimizedBaseEntity, createEntityData } from './optimized-base-entity';
import { Contact } from './contact.entity';
import { WorkflowStep } from '../../interface/components/principal/principal-workflow.component';
import { PrincipalId } from '../value-objects/principal/principal-id.value-object';
import { PrincipalName } from '../value-objects/principal/principal-name.value-object';

export interface PrincipalData {
  id: string;
  name: string;
  status: 'active' | 'inactive';
  description?: string;
  contacts: Contact[];
  workflowSteps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
}

export class Principal extends OptimizedBaseEntity {
  name: string;
  status: 'active' | 'inactive';
  description?: string;
  contacts: Contact[];
  workflowSteps: WorkflowStep[];

  constructor(data: PrincipalData) {
    super(data);
    this.name = data.name;
    this.status = data.status;
    this.description = data.description;
    this.contacts = [...data.contacts];
    this.workflowSteps = [...data.workflowSteps];
  }

  static create(props: Omit<PrincipalData, 'id' | 'createdAt' | 'updatedAt'>): Principal {
    const now = new Date();
    return new Principal({
      ...props,
      id: PrincipalId.generate().getValue(),
      createdAt: now,
      updatedAt: now
    });
  }

  get contactCount(): number {
    return this.contacts.length;
  }

  get workflowStepCount(): number {
    return this.workflowSteps.length;
  }

  updateName(name: string): void {
    this.name = name;
    this.touch();
  }

  updateStatus(status: 'active' | 'inactive'): void {
    this.status = status;
    this.touch();
  }

  updateDescription(description: string): void {
    this.description = description;
    this.touch();
  }

  addContact(contact: Contact): void {
    this.contacts.push(contact);
    this.touch();
  }

  removeContact(contactId: string): void {
    this.contacts = this.contacts.filter(c => c.id !== contactId);
    this.touch();
  }

  updateContact(contact: Contact): void {
    const index = this.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.contacts[index] = contact;
      this.touch();
    }
  }

  updateWorkflowSteps(workflowSteps: WorkflowStep[]): void {
    this.workflowSteps = [...workflowSteps];
    this.touch();
  }

  addWorkflowStep(workflowStep: WorkflowStep): void {
    this.workflowSteps.push(workflowStep);
    this.touch();
  }

  removeWorkflowStep(stepId: string): void {
    this.workflowSteps = this.workflowSteps.filter(s => s.id !== stepId);
    this.touch();
  }

  updateWorkflowStep(workflowStep: WorkflowStep): void {
    const index = this.workflowSteps.findIndex(s => s.id === workflowStep.id);
    if (index !== -1) {
      this.workflowSteps[index] = workflowStep;
      this.touch();
    }
  }

  isActive(): boolean {
    return this.status === 'active';
  }

  hasContacts(): boolean {
    return this.contacts.length > 0;
  }

  hasWorkflowSteps(): boolean {
    return this.workflowSteps.length > 0;
  }

  validate(): { isValid: boolean; errors: string[] } {
    const errors = this.validateBase();

    if (!this.name || this.name.trim() === '') {
      errors.push('名稱不能為空');
    }

    if (!this.status) {
      errors.push('狀態不能為空');
    }

    if (this.description && this.description.length > 1000) {
      errors.push('描述不能超過1000字元');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      name: this.name,
      status: this.status,
      description: this.description,
      contacts: this.contacts,
      workflowSteps: this.workflowSteps
    };
  }
}
