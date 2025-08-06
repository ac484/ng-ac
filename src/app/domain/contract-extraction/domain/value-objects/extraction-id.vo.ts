// src/app/domain/contract-extraction/domain/value-objects/extraction-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class ExtractionId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): ExtractionId {
        return new ExtractionId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 