/**
 * @fileoverview 合約類型值對象 (Contract Type Value Object)
 * @description 定義合約的類型值，包含類型驗證和業務規則
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Domain Layer Value Object
 * - 職責：合約類型值封裝和驗證
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 DDD 值對象原則
 * - 實現不可變性
 * - 包含業務規則驗證
 * - 使用 TypeScript 嚴格模式
 */

/**
 * 合約類型枚舉
 */
export enum ContractType {
  SERVICE = 'service',
  PRODUCT = 'product',
  EMPLOYMENT = 'employment',
  PARTNERSHIP = 'partnership',
  LICENSING = 'licensing',
  LEASE = 'lease'
}

/**
 * 合約類型值對象
 */
export class ContractTypeVO {
  private readonly _value: ContractType;

  private constructor(value: ContractType) {
    this._value = value;
  }

  /**
   * 創建合約類型實例
   */
  public static create(value: string): ContractTypeVO | null {
    if (this.isValid(value)) {
      return new ContractTypeVO(value as ContractType);
    }
    return null;
  }

  /**
   * 驗證類型值是否有效
   */
  public static isValid(value: string): boolean {
    return Object.values(ContractType).includes(value as ContractType);
  }

  /**
   * 獲取類型值
   */
  public get value(): ContractType {
    return this._value;
  }

  /**
   * 檢查是否為服務合約
   */
  public isService(): boolean {
    return this._value === ContractType.SERVICE;
  }

  /**
   * 檢查是否為產品合約
   */
  public isProduct(): boolean {
    return this._value === ContractType.PRODUCT;
  }

  /**
   * 檢查是否為僱傭合約
   */
  public isEmployment(): boolean {
    return this._value === ContractType.EMPLOYMENT;
  }

  /**
   * 檢查是否為合作合約
   */
  public isPartnership(): boolean {
    return this._value === ContractType.PARTNERSHIP;
  }

  /**
   * 檢查是否為授權合約
   */
  public isLicensing(): boolean {
    return this._value === ContractType.LICENSING;
  }

  /**
   * 檢查是否為租賃合約
   */
  public isLease(): boolean {
    return this._value === ContractType.LEASE;
  }

  /**
   * 獲取類型顯示名稱
   */
  public getDisplayName(): string {
    const displayNames: Record<ContractType, string> = {
      [ContractType.SERVICE]: '服務合約',
      [ContractType.PRODUCT]: '產品合約',
      [ContractType.EMPLOYMENT]: '僱傭合約',
      [ContractType.PARTNERSHIP]: '合作合約',
      [ContractType.LICENSING]: '授權合約',
      [ContractType.LEASE]: '租賃合約'
    };
    return displayNames[this._value];
  }

  /**
   * 轉換為字符串
   */
  public toString(): string {
    return this._value;
  }

  /**
   * 比較兩個類型是否相等
   */
  public equals(other: ContractTypeVO): boolean {
    return this._value === other._value;
  }
}
