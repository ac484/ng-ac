// src/app/domain/contract-management/domain/repositories/contract.repository.ts
import { Contract } from '../entities/contract.entity';
import { ContractId } from '../value-objects/contract-id.vo';

export abstract class ContractRepository {
    abstract findById(id: ContractId): Promise<Contract | null>;
    abstract findAll(): Promise<Contract[]>;
    abstract save(contract: Contract): Promise<void>;
    abstract delete(id: ContractId): Promise<void>;
}
