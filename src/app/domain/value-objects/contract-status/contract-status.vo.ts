/**
 * @fileoverview 合約狀態值對象 (Contract Status Value Object)
 * @description 定義合約的狀態值，包含狀態驗證和業務規則
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Domain Layer Value Object
 * - 職責：合約狀態值封裝和驗證
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
 * 合約狀態枚舉
 */
export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  TERMINATED = 'terminated'
}

/**
 * 合約狀態值對象
 */
export class ContractStatusVO {
  private readonly _value: ContractStatus;

  private constructor(value: ContractStatus) {
    this._value = value;
  }

  /**
   * 創建合約狀態實例
   */
  public static create(value: string): ContractStatusVO | null {
    if (this.isValid(value)) {
      return new ContractStatusVO(value as ContractStatus);
    }
    return null;
  }

  /**
   * 驗證狀態值是否有效
   */
  public static isValid(value: string): boolean {
    return Object.values(ContractStatus).includes(value as ContractStatus);
  }

  /**
   * 獲取狀態值
   */
  public get value(): ContractStatus {
    return this._value;
  }

  /**
   * 檢查是否為草稿狀態
   */
  public isDraft(): boolean {
    return this._value === ContractStatus.DRAFT;
  }

  /**
   * 檢查是否為活躍狀態
   */
  public isActive(): boolean {
    return this._value === ContractStatus.ACTIVE;
  }

  /**
   * 檢查是否為暫停狀態
   */
  public isSuspended(): boolean {
    return this._value === ContractStatus.SUSPENDED;
  }

  /**
   * 檢查是否為完成狀態
   */
  public isCompleted(): boolean {
    return this._value === ContractStatus.COMPLETED;
  }

  /**
   * 檢查是否為終止狀態
   */
  public isTerminated(): boolean {
    return this._value === ContractStatus.TERMINATED;
  }

  /**
   * 檢查是否可以激活
   */
  public canActivate(): boolean {
    return this._value === ContractStatus.DRAFT;
  }

  /**
   * 檢查是否可以暫停
   */
  public canSuspend(): boolean {
    return this._value === ContractStatus.ACTIVE;
  }

  /**
   * 檢查是否可以完成
   */
  public canComplete(): boolean {
    return this._value === ContractStatus.ACTIVE;
  }

  /**
   * 檢查是否可以終止
   */
  public canTerminate(): boolean {
    return this._value === ContractStatus.ACTIVE ||
           this._value === ContractStatus.SUSPENDED;
  }

  /**
   * 轉換為字符串
   */
  public toString(): string {
    return this._value;
  }

  /**
   * 比較兩個狀態是否相等
   */
  public equals(other: ContractStatusVO): boolean {
    return this._value === other._value;
  }
}
