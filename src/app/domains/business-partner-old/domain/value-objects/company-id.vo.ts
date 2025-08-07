import { ValueObject } from '@shared';
import { v4 as uuidv4 } from 'uuid';

export interface CompanyIdProps {
    value: string;
}

/**
 * 公司 ID 值對象
 */
export class CompanyId extends ValueObject<CompanyIdProps> {
    private constructor(props: CompanyIdProps) {
        super(props);
    }

    static create(value: string): CompanyId {
        if (!value || value.trim().length === 0) {
            throw new Error('Company ID cannot be empty');
        }
        return new CompanyId({ value: value.trim() });
    }

    static generate(): CompanyId {
        return new CompanyId({ value: uuidv4() });
    }

    get value(): string {
        return this.props.value;
    }

    override equals(vo?: CompanyId): boolean {
        if (vo === null || vo === undefined) {
            return false;
        }
        if (this === vo) {
            return true;
        }
        return this.props.value === vo.props.value;
    }

    override toString(): string {
        return this.props.value;
    }
}
