// src/app/domain/contract-extraction/domain/value-objects/milestone-id.vo.ts
import { ValueObject } from '../../../../shared/domain/value-object';

export class MilestoneId extends ValueObject<{ value: string }> {
    private constructor(props: { value: string }) {
        super(props);
    }

    public static create(value: string): MilestoneId {
        return new MilestoneId({ value });
    }

    get value(): string {
        return this.props.value;
    }
} 