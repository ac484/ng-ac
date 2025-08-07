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
 * 極簡設計，包含基本業務邏輯和顯示方法
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

  // 核心業務邏輯
  isHigh(): boolean {
    return this.props.value === RiskLevelEnum.High;
  }

  requiresApproval(): boolean {
    return this.isHigh();
  }

  override toString(): string {
    return this.props.value;
  }
}
