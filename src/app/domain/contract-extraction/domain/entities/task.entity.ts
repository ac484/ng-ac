// src/app/domain/contract-extraction/domain/entities/task.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { TaskId } from '../value-objects/task-id.vo';
import { ExtractionId } from '../value-objects/extraction-id.vo';

export class Task extends BaseEntity<TaskId> {
    private _extractionId: ExtractionId;
    private _title: string;
    private _description: string;
    private _taskType: string;
    private _priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    private _dueDate?: Date;
    private _assignedTo?: string;
    private _sourceText: string;
    private _confidence: number;

    constructor(
        id: TaskId,
        extractionId: ExtractionId,
        title: string,
        description: string,
        taskType: string,
        priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
        sourceText: string,
        confidence: number,
        dueDate?: Date,
        assignedTo?: string
    ) {
        super(id);
        this._extractionId = extractionId;
        this._title = title;
        this._description = description;
        this._taskType = taskType;
        this._priority = priority;
        this._sourceText = sourceText;
        this._confidence = confidence;
        this._dueDate = dueDate;
        this._assignedTo = assignedTo;
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

    get taskType(): string {
        return this._taskType;
    }

    get priority(): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        return this._priority;
    }

    get dueDate(): Date | undefined {
        return this._dueDate;
    }

    get assignedTo(): string | undefined {
        return this._assignedTo;
    }

    get sourceText(): string {
        return this._sourceText;
    }

    get confidence(): number {
        return this._confidence;
    }

    public updateTitle(title: string): void {
        this._title = title;
    }

    public updateDescription(description: string): void {
        this._description = description;
    }

    public updatePriority(priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'): void {
        this._priority = priority;
    }

    public updateDueDate(dueDate: Date): void {
        this._dueDate = dueDate;
    }

    public assignTo(assignedTo: string): void {
        this._assignedTo = assignedTo;
    }
} 