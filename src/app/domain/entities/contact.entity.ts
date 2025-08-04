import { BaseEntity } from './base-entity';
import { ContactPerson } from '../value-objects/principal/contact-person.value-object';
import { ContactEmail } from '../value-objects/principal/contact-email.value-object';
import { ContactPhone } from '../value-objects/principal/contact-phone.value-object';

export interface ContactProps {
  id: string;
  name: ContactPerson;
  email: ContactEmail;
  phone: ContactPhone;
  createdAt: Date;
  updatedAt: Date;
}

export class Contact extends BaseEntity<ContactProps> {
  constructor(props: ContactProps) {
    super(props);
  }

  static create(props: Omit<ContactProps, 'id' | 'createdAt' | 'updatedAt'>): Contact {
    const now = new Date();
    return new Contact({
      ...props,
      id: Contact.generateId(),
      createdAt: now,
      updatedAt: now
    });
  }

  get id(): string {
    return this.props.id;
  }

  get name(): ContactPerson {
    return this.props.name;
  }

  get email(): ContactEmail {
    return this.props.email;
  }

  get phone(): ContactPhone {
    return this.props.phone;
  }

  updateName(name: ContactPerson): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateEmail(email: ContactEmail): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  updatePhone(phone: ContactPhone): void {
    this.props.phone = phone;
    this.props.updatedAt = new Date();
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
} 