// src/app/domain/contract-extraction/domain/entities/contract-term.entity.ts
import { BaseEntity } from '../../../../shared/domain/base-entity';
import { ContractTermId } from '../value-objects/contract-term-id.vo';
import { ExtractionId } from '../value-objects/extraction-id.vo';

export class ContractTerm extends BaseEntity<ContractTermId> {
    private _extractionId: ExtractionId;
    private _termType: string;
    private _title: string;
    private _content: string;
    private _clauseNumber?: string;
    private _section?: string;
    private _sourceText: string;
    private _confidence: number;
    private _isCritical: boolean;

    constructor(
        id: ContractTermId,
        extractionId: ExtractionId,
        termType: string,
        title: string,
        content: string,
        sourceText: string,
        confidence: number,
        clauseNumber?: string,
        section?: string,
        isCritical: boolean = false
    ) {
        super(id);
        this._extractionId = extractionId;
        this._termType = termType;
        this._title = title;
        this._content = content;
        this._clauseNumber = clauseNumber;
        this._section = section;
        this._sourceText = sourceText;
        this._confidence = confidence;
        this._isCritical = isCritical;
    }

    get extractionId(): ExtractionId {
        return this._extractionId;
    }

    get termType(): string {
        return this._termType;
    }

    get title(): string {
        return this._title;
    }

    get content(): string {
        return this._content;
    }

    get clauseNumber(): string | undefined {
        return this._clauseNumber;
    }

    get section(): string | undefined {
        return this._section;
    }

    get sourceText(): string {
        return this._sourceText;
    }

    get confidence(): number {
        return this._confidence;
    }

    get isCritical(): boolean {
        return this._isCritical;
    }

    public updateTitle(title: string): void {
        this._title = title;
    }

    public updateContent(content: string): void {
        this._content = content;
    }

    public updateTermType(termType: string): void {
        this._termType = termType;
    }

    public markAsCritical(): void {
        this._isCritical = true;
    }

    public markAsNonCritical(): void {
        this._isCritical = false;
    }

    public updateClauseNumber(clauseNumber: string): void {
        this._clauseNumber = clauseNumber;
    }

    public updateSection(section: string): void {
        this._section = section;
    }
} 