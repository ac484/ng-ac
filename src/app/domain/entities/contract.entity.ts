import { AggregateRoot } from './aggregate-root';
import { Money } from '../value-objects/account/money.value-object';
import {
  ContractNumber,
  ContractStatus,
  ClientName,
  ClientRepresentative,
  ContactPerson,
  ContractName,
  ContactPhone,
  Notes
} from '../value-objects/contract';

/**
 * Contract entity - Aggregate root for contract management
 */
export class Contract extends AggregateRoot<string> {
  constructor(
    id: string,
    contractNumber: ContractNumber,
    clientName: ClientName,
    clientRepresentative: ClientRepresentative,
    contactPerson: ContactPerson,
    contractName: ContractName,
    amount: Money,
    status: ContractStatus,
    contactPhone?: ContactPhone,
    notes?: Notes,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id);
    this._contractNumber = contractNumber;
    this._clientName = clientName;
    this._clientRepresentative = clientRepresentative;
    this._contactPerson = contactPerson;
    this._contractName = contractName;
    this._amount = amount;
    this._status = status;
    this._contactPhone = contactPhone;
    this._notes = notes;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  // Private properties
  private _contractNumber: ContractNumber;
  private _clientName: ClientName;
  private _clientRepresentative: ClientRepresentative;
  private _contactPerson: ContactPerson;
  private _contractName: ContractName;
  private _amount: Money;
  private _status: ContractStatus;
  private _contactPhone?: ContactPhone;
  private _notes?: Notes;
  private _createdAt: Date;
  private _updatedAt: Date;

  // Getters
  get id(): string {
    return this.props;
  }
  get contractNumber(): ContractNumber {
    return this._contractNumber;
  }
  get clientName(): ClientName {
    return this._clientName;
  }
  get clientRepresentative(): ClientRepresentative {
    return this._clientRepresentative;
  }
  get contactPerson(): ContactPerson {
    return this._contactPerson;
  }
  get contractName(): ContractName {
    return this._contractName;
  }
  get amount(): Money {
    return this._amount;
  }
  get status(): ContractStatus {
    return this._status;
  }
  get contactPhone(): ContactPhone | undefined {
    return this._contactPhone;
  }
  get notes(): Notes | undefined {
    return this._notes;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateStatus(newStatus: ContractStatus): void {
    this._status = newStatus;
    this._updatedAt = new Date();
  }

  updateAmount(newAmount: Money): void {
    this._amount = newAmount;
    this._updatedAt = new Date();
  }

  updateClientName(newClientName: ClientName): void {
    this._clientName = newClientName;
    this._updatedAt = new Date();
  }

  updateClientRepresentative(newRepresentative: ClientRepresentative): void {
    this._clientRepresentative = newRepresentative;
    this._updatedAt = new Date();
  }

  updateContactPerson(newContactPerson: ContactPerson): void {
    this._contactPerson = newContactPerson;
    this._updatedAt = new Date();
  }

  updateContractName(newContractName: ContractName): void {
    this._contractName = newContractName;
    this._updatedAt = new Date();
  }

  updateContactPhone(newContactPhone: ContactPhone): void {
    this._contactPhone = newContactPhone;
    this._updatedAt = new Date();
  }

  updateNotes(newNotes: Notes): void {
    this._notes = newNotes;
    this._updatedAt = new Date();
  }

  // Static factory method
  static create(dto: CreateContractDto): Contract {
    // Don't generate ID here - let Firestore generate it
    const contractNumber = dto.contractNumber ? new ContractNumber(dto.contractNumber) : ContractNumber.generate();
    const clientName = new ClientName(dto.clientName);
    const clientRepresentative = dto.clientRepresentative
      ? new ClientRepresentative(dto.clientRepresentative)
      : new ClientRepresentative('');
    const contactPerson = dto.contactPerson ? new ContactPerson(dto.contactPerson) : new ContactPerson('');
    const contractName = new ContractName(dto.contractName);
    const amount = new Money(dto.amount);
    const status = dto.status ? new ContractStatus(dto.status) : new ContractStatus(ContractStatus.DRAFT);
    const contactPhone = dto.contactPhone ? new ContactPhone(dto.contactPhone) : undefined;
    const notes = dto.notes ? new Notes(dto.notes) : undefined;

    return new Contract(
      '', // Empty ID - will be set by Firestore
      contractNumber,
      clientName,
      clientRepresentative,
      contactPerson,
      contractName,
      amount,
      status,
      contactPhone,
      notes
    );
  }
}

// Helper function
function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

// DTO interface for creation
export interface CreateContractDto {
  contractNumber?: string;
  clientName: string;
  clientRepresentative?: string;
  contactPerson?: string;
  contractName: string;
  amount: number;
  status?: string;
  contactPhone?: string;
  notes?: string;
}
