import { ValueObject } from '@shared';

export enum RiskLevelEnum {
    Low = '低',
    Medium = '中',
    High = '高'
}

export interface RiskLevelProps {
    value: RiskLevelEnum;
}

/**
 * 風險等級值對象
 */
export class RiskLevel extends ValueObject<RiskLevelProps> {
    private constructor(props: RiskLevelProps) {
        super(props);
    }

    static create(value: RiskLevelEnum): RiskLevel {
        if (!Object.values(RiskLevelEnum).includes(value)) {
            throw new Error(`Invalid risk level: ${value}`);
        }
        return new RiskLevel({ value });
    }

    get value(): RiskLevelEnum {
        return this.props.value;
    }

    override equals(vo?: RiskLevel): boolean {
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

