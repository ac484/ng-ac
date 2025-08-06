import { ValueObject } from '@shared';
import { v4 as uuidv4 } from 'uuid';

export interface ContactIdProps {
    value: string;
}

/**
 * 聯絡人 ID 值對象
 */
export class ContactId extends ValueObject<ContactIdProps> {
    private constructor(props: ContactIdProps) {
        super(props);
    }

    static create(value: string): ContactId {
        if (!value || value.trim().length === 0) {
            throw new Error('Contact ID cannot be empty');
        }
        return new ContactId({ value: value.trim() });
    }

    static generate(): ContactId {
        return new ContactId({ value: uuidv4() });
    }

    get value(): string {
        return this.props.value;
    }

    override equals(vo?: ContactId): boolean {
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
