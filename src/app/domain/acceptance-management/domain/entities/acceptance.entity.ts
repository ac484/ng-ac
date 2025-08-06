// src/app/domain/acceptance-management/domain/entities/acceptance.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { AcceptanceId } from '../value-objects/acceptance-id.vo';
import { AcceptanceStatus } from '../value-objects/acceptance-status.vo';

export class Acceptance extends BaseEntity<AcceptanceId> {
    name: string;
    criteria: string;
    status: AcceptanceStatus;

    constructor(id: AcceptanceId, name: string, criteria: string) {
        super(id);
        this.name = name;
        this.criteria = criteria;
        this.status = AcceptanceStatus.create('PENDING');
    }
} 