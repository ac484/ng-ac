// src/app/domain/contract-extraction/domain/value-objects/extraction-status.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class ExtractionStatus extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'): ExtractionStatus {
        return new ExtractionStatus({ value });
    }

    get value(): string {
        return this.props.value;
    }

    public isPending(): boolean {
        return this.value === 'PENDING';
    }

    public isProcessing(): boolean {
        return this.value === 'PROCESSING';
    }

    public isCompleted(): boolean {
        return this.value === 'COMPLETED';
    }

    public isFailed(): boolean {
        return this.value === 'FAILED';
    }
} 