// src/app/domain/contract-extraction/domain/services/contract-extraction.service.ts
import { Injectable } from '@angular/core';
import { ContractExtraction } from '../entities/contract-extraction.entity';
import { Task } from '../entities/task.entity';
import { Milestone } from '../entities/milestone.entity';
import { ContractTerm } from '../entities/contract-term.entity';
import { ExtractionId } from '../value-objects/extraction-id.vo';
import { TaskId } from '../value-objects/task-id.vo';
import { MilestoneId } from '../value-objects/milestone-id.vo';
import { ContractTermId } from '../value-objects/contract-term-id.vo';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';

export interface ExtractionResult {
    tasks: Task[];
    milestones: Milestone[];
    contractTerms: ContractTerm[];
}

export interface OcrResult {
    text: string;
    confidence: number;
    pages: number;
}

export interface NlpResult {
    sentences: string[];
    entities: Array<{
        text: string;
        type: string;
        confidence: number;
    }>;
}

export interface TaskExtractionResult {
    title: string;
    description: string;
    taskType: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    dueDate?: Date;
    assignedTo?: string;
    sourceText: string;
    confidence: number;
}

export interface MilestoneExtractionResult {
    title: string;
    description: string;
    dueDate: Date;
    milestoneType: string;
    sourceText: string;
    confidence: number;
}

export interface ContractTermExtractionResult {
    termType: string;
    title: string;
    content: string;
    clauseNumber?: string;
    section?: string;
    sourceText: string;
    confidence: number;
    isCritical: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ContractExtractionService {

    /**
     * Creates a new contract extraction process
     */
    public createExtraction(
        contractId: ContractId,
        pdfUrl: string
    ): ContractExtraction {
        const extractionId = ExtractionId.create(this.generateId());
        return new ContractExtraction(extractionId, contractId, pdfUrl);
    }

    /**
     * Processes OCR extraction using Google Vision AI
     */
    public async performOcrExtraction(pdfUrl: string): Promise<OcrResult> {
        // TODO: Implement Google Vision AI integration
        // This would typically call Google Cloud Vision API
        return {
            text: 'Extracted text from PDF',
            confidence: 0.95,
            pages: 1
        };
    }

    /**
     * Performs NLP processing on extracted text
     */
    public async performNlpProcessing(text: string): Promise<NlpResult> {
        // TODO: Implement NLP processing
        // This would use libraries like spaCy, NLTK, or cloud NLP services
        return {
            sentences: text.split(/[.!?]+/).filter(s => s.trim().length > 0),
            entities: []
        };
    }

    /**
     * Extracts tasks from processed text
     */
    public async extractTasks(
        extractionId: ExtractionId,
        nlpResult: NlpResult
    ): Promise<TaskExtractionResult[]> {
        // TODO: Implement task extraction logic
        // This would use ML models or rule-based systems to identify tasks
        return [];
    }

    /**
     * Extracts milestones from processed text
     */
    public async extractMilestones(
        extractionId: ExtractionId,
        nlpResult: NlpResult
    ): Promise<MilestoneExtractionResult[]> {
        // TODO: Implement milestone extraction logic
        return [];
    }

    /**
     * Extracts contract terms from processed text
     */
    public async extractContractTerms(
        extractionId: ExtractionId,
        nlpResult: NlpResult
    ): Promise<ContractTermExtractionResult[]> {
        // TODO: Implement contract term extraction logic
        return [];
    }

    /**
     * Creates Task entities from extraction results
     */
    public createTaskEntities(
        extractionId: ExtractionId,
        taskResults: TaskExtractionResult[]
    ): Task[] {
        return taskResults.map(result => {
            const taskId = TaskId.create(this.generateId());
            return new Task(
                taskId,
                extractionId,
                result.title,
                result.description,
                result.taskType,
                result.priority,
                result.sourceText,
                result.confidence,
                result.dueDate,
                result.assignedTo
            );
        });
    }

    /**
     * Creates Milestone entities from extraction results
     */
    public createMilestoneEntities(
        extractionId: ExtractionId,
        milestoneResults: MilestoneExtractionResult[]
    ): Milestone[] {
        return milestoneResults.map(result => {
            const milestoneId = MilestoneId.create(this.generateId());
            return new Milestone(
                milestoneId,
                extractionId,
                result.title,
                result.description,
                result.dueDate,
                result.milestoneType,
                result.sourceText,
                result.confidence
            );
        });
    }

    /**
     * Creates ContractTerm entities from extraction results
     */
    public createContractTermEntities(
        extractionId: ExtractionId,
        contractTermResults: ContractTermExtractionResult[]
    ): ContractTerm[] {
        return contractTermResults.map(result => {
            const contractTermId = ContractTermId.create(this.generateId());
            return new ContractTerm(
                contractTermId,
                extractionId,
                result.termType,
                result.title,
                result.content,
                result.sourceText,
                result.confidence,
                result.clauseNumber,
                result.section,
                result.isCritical
            );
        });
    }

    /**
     * Executes the complete extraction pipeline
     */
    public async executeExtractionPipeline(
        extraction: ContractExtraction
    ): Promise<ExtractionResult> {
        try {
            // Step 1: Start processing
            extraction.startProcessing();

            // Step 2: Perform OCR
            const ocrResult = await this.performOcrExtraction(extraction.originalPdfUrl);
            extraction.setExtractedText(ocrResult.text);

            // Step 3: Perform NLP processing
            const nlpResult = await this.performNlpProcessing(ocrResult.text);

            // Step 4: Extract tasks, milestones, and contract terms
            const taskResults = await this.extractTasks(extraction.id, nlpResult);
            const milestoneResults = await this.extractMilestones(extraction.id, nlpResult);
            const contractTermResults = await this.extractContractTerms(extraction.id, nlpResult);

            // Step 5: Create entities
            const tasks = this.createTaskEntities(extraction.id, taskResults);
            const milestones = this.createMilestoneEntities(extraction.id, milestoneResults);
            const contractTerms = this.createContractTermEntities(extraction.id, contractTermResults);

            // Step 6: Add to extraction
            tasks.forEach(task => extraction.addTask(task));
            milestones.forEach(milestone => extraction.addMilestone(milestone));
            contractTerms.forEach(contractTerm => extraction.addContractTerm(contractTerm));

            // Step 7: Complete extraction
            extraction.completeExtraction();

            return {
                tasks,
                milestones,
                contractTerms
            };

        } catch (error) {
            extraction.failExtraction(error instanceof Error ? error.message : 'Unknown error');
            throw error;
        }
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
} 