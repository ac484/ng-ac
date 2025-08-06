// src/app/domain/invoice-management/infrastructure/repositories/invoice-firebase.repository.ts
import { Injectable } from '@angular/core';
import { InvoiceRepository } from '../../domain/repositories/invoice.repository';
import { Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceId } from '../../domain/value-objects/invoice-id.vo';

@Injectable({ providedIn: 'root' })
export class InvoiceFirebaseRepository extends InvoiceRepository {
    findById(id: InvoiceId): Promise<Invoice | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Invoice[]> {
        throw new Error('Method not implemented.');
    }
    save(invoice: Invoice): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: InvoiceId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 