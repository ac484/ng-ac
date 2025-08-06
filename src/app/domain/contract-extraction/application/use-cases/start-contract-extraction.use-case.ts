// src/app/domain/contract-extraction/application/use-cases/start-contract-extraction.use-case.ts
import { Injectable, Inject } from '@angular/core';
import { ContractExtractionService } from '../../domain/services/contract-extraction.service';
import { ContractExtractionRepository, CONTRACT_EXTRACTION_REPOSITORY } from '../../domain/repositories/contract-extraction.repository';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';
import { ContractExtraction } from '../../domain/entities/contract-extraction.entity';
import { ExtractionResult } from '../../domain/services/contract-extraction.service';

export interface StartContractExtractionRequest {
    contractId: string;
    pdfUrl: string;
}

export interface StartContractExtractionResponse {
    extractionId: string;
    status: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class StartContractExtractionUseCase {

    constructor(
        private contractExtractionService: ContractExtractionService,
        @Inject(CONTRACT_EXTRACTION_REPOSITORY)
        private contractExtractionRepository: ContractExtractionRepository
    ) { }

    async execute(request: StartContractExtractionRequest): Promise<StartContractExtractionResponse> {
        try {
            // Create contract ID
            const contractId = ContractId.create(request.contractId);

            // Create extraction
            const extraction = this.contractExtractionService.createExtraction(
                contractId,
                request.pdfUrl
            );

            // Save initial state
            await this.contractExtractionRepository.save(extraction);

            // Execute extraction pipeline
            const result: ExtractionResult = await this.contractExtractionService.executeExtractionPipeline(extraction);

            // Save final state with all entities
            await this.contractExtractionRepository.saveWithEntities(extraction);

            return {
                extractionId: extraction.id.value,
                status: extraction.status.value,
                message: `Extraction completed successfully. Found ${result.tasks.length} tasks, ${result.milestones.length} milestones, and ${result.contractTerms.length} contract terms.`
            };

        } catch (error) {
            return {
                extractionId: '',
                status: 'FAILED',
                message: error instanceof Error ? error.message : 'Unknown error occurred during extraction'
            };
        }
    }
} 