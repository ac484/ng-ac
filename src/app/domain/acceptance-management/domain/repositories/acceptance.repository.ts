// src/app/domain/acceptance-management/domain/repositories/acceptance.repository.ts
import { Acceptance } from '../entities/acceptance.entity';
import { AcceptanceId } from '../value-objects/acceptance-id.vo';

export abstract class AcceptanceRepository {
    abstract findById(id: AcceptanceId): Promise<Acceptance | null>;
    abstract findAll(): Promise<Acceptance[]>;
    abstract save(acceptance: Acceptance): Promise<void>;
    abstract delete(id: AcceptanceId): Promise<void>;
} 