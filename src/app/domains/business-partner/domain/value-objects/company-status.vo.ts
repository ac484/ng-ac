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
 * 極簡設計，包含基本業務邏輯和顯示方法
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

  // 核心業務邏輯
  isActive(): boolean {
    return this.props.value === CompanyStatusEnum.Active;
  }

  isBlacklisted(): boolean {
    return this.props.value === CompanyStatusEnum.Blacklisted;
  }

  override toString(): string {
    return this.props.value;
  }
}
