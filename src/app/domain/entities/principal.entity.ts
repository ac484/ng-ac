import { BaseEntity } from './base-entity';
import { PrincipalName } from '../value-objects/principal/principal-name.value-object';
import { PrincipalId } from '../value-objects/principal/principal-id.value-object';
import { Contact } from './contact.entity';

export interface PrincipalProps {
  id: PrincipalId;
  name: PrincipalName;
  status: 'active' | 'inactive';
  description?: string;
  contacts: Contact[];
  createdAt: Date;
  updatedAt: Date;
}

export class Principal extends BaseEntity<PrincipalProps> {
  constructor(props: PrincipalProps) {
    super(props);
  }

  static create(props: Omit<PrincipalProps, 'id' | 'createdAt' | 'updatedAt'>): Principal {
    const now = new Date();
    return new Principal({
      ...props,
      id: PrincipalId.generate(),
      createdAt: now,
      updatedAt: now
    });
  }

  get id(): PrincipalId {
    return this.props.id;
  }

  get name(): PrincipalName {
    return this.props.name;
  }

  get status(): 'active' | 'inactive' {
    return this.props.status;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get contacts(): Contact[] {
    return [...this.props.contacts];
  }

  get contactCount(): number {
    return this.props.contacts.length;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateName(name: PrincipalName): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateStatus(status: 'active' | 'inactive'): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  addContact(contact: Contact): void {
    this.props.contacts.push(contact);
    this.props.updatedAt = new Date();
  }

  removeContact(contactId: string): void {
    this.props.contacts = this.props.contacts.filter(c => c.id !== contactId);
    this.props.updatedAt = new Date();
  }

  updateContact(contact: Contact): void {
    const index = this.props.contacts.findIndex(c => c.id === contact.id);
    if (index !== -1) {
      this.props.contacts[index] = contact;
      this.props.updatedAt = new Date();
    }
  }

  isActive(): boolean {
    return this.props.status === 'active';
  }

  hasContacts(): boolean {
    return this.props.contacts.length > 0;
  }
} 