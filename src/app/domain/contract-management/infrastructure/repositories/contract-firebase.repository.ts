// src/app/domain/contract-management/infrastructure/repositories/contract-firebase.repository.ts
import { Injectable } from '@angular/core';
import { ContractRepository } from '../../domain/repositories/contract.repository';
import { Contract } from '../../domain/entities/contract.entity';
import { ContractId } from '../../domain/value-objects/contract-id.vo';

@Injectable({ providedIn: 'root' })
export class ContractFirebaseRepository extends ContractRepository {
    findById(id: ContractId): Promise<Contract | null> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Contract[]> {
        throw new Error('Method not implemented.');
    }
    save(contract: Contract): Promise<void> {
        throw new Error('Method not implemented.');
    }
    delete(id: ContractId): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
