import { ValueObject } from '@shared';

export enum CompanyStatusEnum {
    Active = '啟用中',
    Inactive = '停用',
    Blacklisted = '黑名單'
}

export interface CompanyStatusProps {
    value: CompanyStatusEnum;
}

/**
 * 公司狀態值對象
 */
export class CompanyStatus extends ValueObject<CompanyStatusProps> {
    private constructor(props: CompanyStatusProps) {
        super(props);
    }

    static create(value: CompanyStatusEnum): CompanyStatus {
        if (!Object.values(CompanyStatusEnum).includes(value)) {
            throw new Error(`Invalid company status: ${value}`);
        }
        return new CompanyStatus({ value });
    }

    get value(): CompanyStatusEnum {
        return this.props.value;
    }

    override equals(vo?: CompanyStatus): boolean {
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
