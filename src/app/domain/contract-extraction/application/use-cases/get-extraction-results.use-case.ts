// src/app/domain/contract-extraction/application/use-cases/get-extraction-results.use-case.ts
import { Injectable } from '@angular/core';
import { ContractExtractionRepository } from '../../domain/repositories/contract-extraction.repository';
import { ExtractionId } from '../../domain/value-objects/extraction-id.vo';
import { ContractExtraction } from '../../domain/entities/contract-extraction.entity';

export interface GetExtractionResultsRequest {
    extractionId: string;
}

export interface GetExtractionResultsResponse {
    extractionId: string;
    contractId: string;
    status: string;
    originalPdfUrl: string;
    extractedText: string;
    tasks: Array<{
        id: string;
        title: string;
        description: string;
        taskType: string;
        priority: string;
        dueDate?: string;
        assignedTo?: string;
        confidence: number;
    }>;
    milestones: Array<{
        id: string;
        title: string;
        description: string;
        dueDate: string;
        milestoneType: string;
        isCompleted: boolean;
        confidence: number;
    }>;
    contractTerms: Array<{
        id: string;
        termType: string;
        title: string;
        content: string;
        clauseNumber?: string;
        section?: string;
        isCritical: boolean;
        confidence: number;
    }>;
    processingError?: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class GetExtractionResultsUseCase {

    constructor(
        private contractExtractionRepository: ContractExtractionRepository
    ) { }

    async execute(request: GetExtractionResultsRequest): Promise<GetExtractionResultsResponse | null> {
        try {
            const extractionId = ExtractionId.create(request.extractionId);
            const extraction = await this.contractExtractionRepository.findById(extractionId);

            if (!extraction) {
                return null;
            }

            return {
                extractionId: extraction.id.value,
                contractId: extraction.contractId.value,
                status: extraction.status.value,
                originalPdfUrl: extraction.originalPdfUrl,
                extractedText: extraction.extractedText,
                tasks: extraction.tasks.map(task => ({
                    id: task.id.value,
                    title: task.title,
                    description: task.description,
                    taskType: task.taskType,
                    priority: task.priority,
                    dueDate: task.dueDate?.toISOString(),
                    assignedTo: task.assignedTo,
                    confidence: task.confidence
                })),
                milestones: extraction.milestones.map(milestone => ({
                    id: milestone.id.value,
                    title: milestone.title,
                    description: milestone.description,
                    dueDate: milestone.dueDate.toISOString(),
                    milestoneType: milestone.milestoneType,
                    isCompleted: milestone.isCompleted,
                    confidence: milestone.confidence
                })),
                contractTerms: extraction.contractTerms.map(contractTerm => ({
                    id: contractTerm.id.value,
                    termType: contractTerm.termType,
                    title: contractTerm.title,
                    content: contractTerm.content,
                    clauseNumber: contractTerm.clauseNumber,
                    section: contractTerm.section,
                    isCritical: contractTerm.isCritical,
                    confidence: contractTerm.confidence
                })),
                processingError: extraction.processingError,
                createdAt: extraction.createdAt.toISOString(),
                updatedAt: extraction.updatedAt.toISOString()
            };

        } catch (error) {
            throw new Error(`Failed to get extraction results: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
} 