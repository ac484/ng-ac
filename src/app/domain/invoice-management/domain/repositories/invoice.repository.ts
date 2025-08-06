// src/app/domain/invoice-management/domain/repositories/invoice.repository.ts
import { Invoice } from '../entities/invoice.entity';
import { InvoiceId } from '../value-objects/invoice-id.vo';

export abstract class InvoiceRepository {
    abstract findById(id: InvoiceId): Promise<Invoice | null>;
    abstract findAll(): Promise<Invoice[]>;
    abstract save(invoice: Invoice): Promise<void>;
    abstract delete(id: InvoiceId): Promise<void>;
} 