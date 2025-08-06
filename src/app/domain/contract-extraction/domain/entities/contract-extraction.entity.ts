// src/app/domain/contract-extraction/domain/entities/contract-extraction.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { ExtractionId } from '../value-objects/extraction-id.vo';
import { ExtractionStatus } from '../value-objects/extraction-status.vo';
import { ContractId } from '../../../contract-management/domain/value-objects/contract-id.vo';
import { Task } from './task.entity';
import { Milestone } from './milestone.entity';
import { ContractTerm } from './contract-term.entity';

export class ContractExtraction extends BaseEntity<ExtractionId> {
    private _contractId: ContractId;
    private _status: ExtractionStatus;
    private _originalPdfUrl: string;
    private _extractedText: string;
    private _tasks: Task[];
    private _milestones: Milestone[];
    private _contractTerms: ContractTerm[];
    private _processingError?: string;

    constructor(
        id: ExtractionId,
        contractId: ContractId,
        originalPdfUrl: string
    ) {
        super(id);
        this._contractId = contractId;
        this._status = ExtractionStatus.create('PENDING');
        this._originalPdfUrl = originalPdfUrl;
        this._extractedText = '';
        this._tasks = [];
        this._milestones = [];
        this._contractTerms = [];
    }

    get contractId(): ContractId {
        return this._contractId;
    }

    get status(): ExtractionStatus {
        return this._status;
    }

    get originalPdfUrl(): string {
        return this._originalPdfUrl;
    }

    get extractedText(): string {
        return this._extractedText;
    }

    get tasks(): readonly Task[] {
        return [...this._tasks];
    }

    get milestones(): readonly Milestone[] {
        return [...this._milestones];
    }

    get contractTerms(): readonly ContractTerm[] {
        return [...this._contractTerms];
    }

    get processingError(): string | undefined {
        return this._processingError;
    }

    public startProcessing(): void {
        this._status = ExtractionStatus.create('PROCESSING');
        this.updateTimestamp();
    }

    public setExtractedText(text: string): void {
        this._extractedText = text;
        this.updateTimestamp();
    }

    public addTask(task: Task): void {
        this._tasks.push(task);
        this.updateTimestamp();
    }

    public addMilestone(milestone: Milestone): void {
        this._milestones.push(milestone);
        this.updateTimestamp();
    }

    public addContractTerm(contractTerm: ContractTerm): void {
        this._contractTerms.push(contractTerm);
        this.updateTimestamp();
    }

    public completeExtraction(): void {
        this._status = ExtractionStatus.create('COMPLETED');
        this.updateTimestamp();
    }

    public failExtraction(error: string): void {
        this._status = ExtractionStatus.create('FAILED');
        this._processingError = error;
        this.updateTimestamp();
    }

    public isCompleted(): boolean {
        return this._status.isCompleted();
    }

    public isFailed(): boolean {
        return this._status.isFailed();
    }

    public isProcessing(): boolean {
        return this._status.isProcessing();
    }
} 