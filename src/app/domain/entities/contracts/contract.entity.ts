/**
 * @fileoverview 合約實體 (Contract Entity)
 * @description 合約領域實體，包含合約的核心業務邏輯和狀態管理
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Domain Layer Entity
 * - 職責：合約業務邏輯封裝
 * - 依賴：BaseEntity, ContractStatusVO, ContractTypeVO
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 DDD 實體原則
 * - 繼承 BaseEntity
 * - 包含業務規則驗證
 * - 使用值對象封裝複雜屬性
 */

import { BaseEntity } from '../../../shared/base/entities/base.entity';
import { ContractStatus, ContractStatusVO } from '../../value-objects/contract-status/contract-status.vo';
import { ContractType, ContractTypeVO } from '../../value-objects/contract-type/contract-type.vo';

/**
 * 合約屬性接口
 */
export interface ContractProps {
  id: string;
  title: string;
  description: string;
  contractNumber: string;
  status: ContractStatus;
  type: ContractType;
  startDate: Date;
  endDate: Date;
  amount: number;
  currency: string;
  partyA: string;
  partyB: string;
  terms: string[];
  attachments: string[];
}

/**
 * 合約實體
 */
export class Contract extends BaseEntity {
  private readonly _title: string;
  private readonly _description: string;
  private readonly _contractNumber: string;
  private readonly _status: ContractStatusVO;
  private readonly _type: ContractTypeVO;
  private readonly _startDate: Date;
  private readonly _endDate: Date;
  private readonly _amount: number;
  private readonly _currency: string;
  private readonly _partyA: string;
  private readonly _partyB: string;
  private readonly _terms: string[];
  private readonly _attachments: string[];

  private constructor(props: ContractProps) {
    super(props.id);
    this._title = props.title;
    this._description = props.description;
    this._contractNumber = props.contractNumber;
    this._status = ContractStatusVO.create(props.status)!;
    this._type = ContractTypeVO.create(props.type)!;
    this._startDate = props.startDate;
    this._endDate = props.endDate;
    this._amount = props.amount;
    this._currency = props.currency;
    this._partyA = props.partyA;
    this._partyB = props.partyB;
    this._terms = [...props.terms];
    this._attachments = [...props.attachments];
  }

  /**
   * 創建合約實例
   */
  public static create(props: ContractProps): Contract | null {
    if (this.isValidProps(props)) {
      return new Contract(props);
    }
    return null;
  }

  /**
   * 驗證合約屬性
   */
  private static isValidProps(props: ContractProps): boolean {
    return !!(
      props.title &&
      props.contractNumber &&
      props.startDate &&
      props.endDate &&
      props.amount > 0 &&
      props.partyA &&
      props.partyB &&
      props.startDate < props.endDate
    );
  }

  // Getters
  public get title(): string { return this._title; }
  public get description(): string { return this._description; }
  public get contractNumber(): string { return this._contractNumber; }
  public get status(): ContractStatusVO { return this._status; }
  public get type(): ContractTypeVO { return this._type; }
  public get startDate(): Date { return this._startDate; }
  public get endDate(): Date { return this._endDate; }
  public get amount(): number { return this._amount; }
  public get currency(): string { return this._currency; }
  public get partyA(): string { return this._partyA; }
  public get partyB(): string { return this._partyB; }
  public get terms(): string[] { return [...this._terms]; }
  public get attachments(): string[] { return [...this._attachments]; }

  /**
   * 檢查合約是否活躍
   */
  public isActive(): boolean {
    const now = new Date();
    return this._status.isActive() &&
           now >= this._startDate &&
           now <= this._endDate;
  }

  /**
   * 檢查合約是否過期
   */
  public isExpired(): boolean {
    const now = new Date();
    return now > this._endDate;
  }

  /**
   * 檢查合約是否即將到期（30天內）
   */
  public isExpiringSoon(): boolean {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return this._status.isActive() && this._endDate <= thirtyDaysFromNow;
  }

  /**
   * 獲取合約持續時間（天）
   */
  public getDurationInDays(): number {
    const diffTime = this._endDate.getTime() - this._startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * 獲取合約剩餘天數
   */
  public getRemainingDays(): number {
    const now = new Date();
    if (now > this._endDate) return 0;
    const diffTime = this._endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * 檢查是否可以修改
   */
  public canModify(): boolean {
    return this._status.isDraft();
  }

  /**
   * 檢查是否可以刪除
   */
  public canDelete(): boolean {
    return this._status.isDraft();
  }

  /**
   * 轉換為普通對象
   */
  public toObject(): ContractProps {
    return {
      id: this.id,
      title: this._title,
      description: this._description,
      contractNumber: this._contractNumber,
      status: this._status.value,
      type: this._type.value,
      startDate: this._startDate,
      endDate: this._endDate,
      amount: this._amount,
      currency: this._currency,
      partyA: this._partyA,
      partyB: this._partyB,
      terms: [...this._terms],
      attachments: [...this._attachments]
    };
  }
}
