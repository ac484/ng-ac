// src/app/domain/contract-extraction/domain/entities/milestone.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { MilestoneId } from '../value-objects/milestone-id.vo';
import { ExtractionId } from '../value-objects/extraction-id.vo';

export class Milestone extends BaseEntity<MilestoneId> {
    private _extractionId: ExtractionId;
    private _title: string;
    private _description: string;
    private _dueDate: Date;
    private _milestoneType: string;
    private _sourceText: string;
    private _confidence: number;
    private _isCompleted: boolean;

    constructor(
        id: MilestoneId,
        extractionId: ExtractionId,
        title: string,
        description: string,
        dueDate: Date,
        milestoneType: string,
        sourceText: string,
        confidence: number
    ) {
        super(id);
        this._extractionId = extractionId;
        this._title = title;
        this._description = description;
        this._dueDate = dueDate;
        this._milestoneType = milestoneType;
        this._sourceText = sourceText;
        this._confidence = confidence;
        this._isCompleted = false;
    }

    get extractionId(): ExtractionId {
        return this._extractionId;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get dueDate(): Date {
        return this._dueDate;
    }

    get milestoneType(): string {
        return this._milestoneType;
    }

    get sourceText(): string {
        return this._sourceText;
    }

    get confidence(): number {
        return this._confidence;
    }

    get isCompleted(): boolean {
        return this._isCompleted;
    }

    public updateTitle(title: string): void {
        this._title = title;
    }

    public updateDescription(description: string): void {
        this._description = description;
    }

    public updateDueDate(dueDate: Date): void {
        this._dueDate = dueDate;
    }

    public markAsCompleted(): void {
        this._isCompleted = true;
    }

    public markAsIncomplete(): void {
        this._isCompleted = false;
    }
} 