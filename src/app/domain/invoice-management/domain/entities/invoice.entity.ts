// src/app/domain/invoice-management/domain/entities/invoice.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { InvoiceId } from '../value-objects/invoice-id.vo';
import { InvoiceStatus } from '../value-objects/invoice-status.vo';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';

export class Invoice extends BaseEntity<InvoiceId> {
    contractId: ContractId;
    amount: number;
    status: InvoiceStatus;

    constructor(id: InvoiceId, contractId: ContractId, amount: number) {
        super(id);
        this.contractId = contractId;
        this.amount = amount;
        this.status = InvoiceStatus.create('DRAFT');
    }
} 