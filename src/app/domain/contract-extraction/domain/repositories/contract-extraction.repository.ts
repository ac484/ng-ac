// src/app/domain/contract-extraction/domain/repositories/contract-extraction.repository.ts
import { InjectionToken } from '@angular/core';
import { ContractExtraction } from '../entities/contract-extraction.entity';
import { ExtractionId } from '../value-objects/extraction-id.vo';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';
import { BaseRepository } from '../../../../shared/infrastructure/base-repository';

export interface ContractExtractionRepository extends BaseRepository<ContractExtraction, ExtractionId> {

    /**
     * Find extraction by contract ID
     */
    findByContractId(contractId: ContractId): Promise<ContractExtraction[]>;

    /**
     * Find extractions by status
     */
    findByStatus(status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): Promise<ContractExtraction[]>;

    /**
     * Find completed extractions
     */
    findCompleted(): Promise<ContractExtraction[]>;

    /**
     * Find failed extractions
     */
    findFailed(): Promise<ContractExtraction[]>;

    /**
     * Save extraction with all related entities
     */
    saveWithEntities(extraction: ContractExtraction): Promise<void>;

    /**
     * Delete extraction and all related entities
     */
    deleteWithEntities(extractionId: ExtractionId): Promise<void>;
}

// Injection token for the repository interface
export const CONTRACT_EXTRACTION_REPOSITORY = new InjectionToken<ContractExtractionRepository>('ContractExtractionRepository'); 