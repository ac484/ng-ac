// src/app/domain/contract-management/domain/entities/contract.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { ContractId } from '../value-objects/contract-id.vo';
import { ContractStatus } from '../value-objects/contract-status.vo';

export class Contract extends BaseEntity<ContractId> {
    name: string;
    terms: string;
    status: ContractStatus;

    constructor(id: ContractId, name: string, terms: string) {
        super(id);
        this.name = name;
        this.terms = terms;
        this.status = ContractStatus.create('DRAFT');
    }
}
