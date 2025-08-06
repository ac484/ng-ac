// src/app/domain/acceptance-management/infrastructure/repositories/acceptance-firebase.repository.ts
import { Injectable } from '@angular/core';
import { AcceptanceRepository } from '../../domain/repositories/acceptance.repository';
import { Acceptance } from '../../domain/entities/acceptance.entity';
import { AcceptanceId } from '../../domain/value-objects/acceptance-id.vo';

@Injectable({ providedIn: 'root' })
export class AcceptanceFirebaseRepository extends AcceptanceRepository {
    findById(id: AcceptanceId): Promise<Acceptance | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Acceptance[]> {
        throw new Error('Method not implemented.');
    }
    save(acceptance: Acceptance): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: AcceptanceId): Promise<void> {
        throw new Error('Method not implemented.');
    }
} 