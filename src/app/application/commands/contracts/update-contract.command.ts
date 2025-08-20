/**
 * @fileoverview 更新合約命令 (Update Contract Command)
 * @description 更新合約的命令對象，遵循 CQRS 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer Command
 * - 職責：更新合約命令封裝
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 CQRS 命令模式
 * - 包含命令驗證
 * - 使用不可變數據結構
 * - 支持部分更新
 */

import { ContractStatus } from '../../../domain/value-objects/contract-status/contract-status.vo';
import { ContractType } from '../../../domain/value-objects/contract-type/contract-type.vo';

/**
 * 更新合約命令
 */
export class UpdateContractCommand {
  constructor(
    public readonly id: string,
    public readonly updatedBy: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly contractNumber?: string,
    public readonly status?: ContractStatus,
    public readonly type?: ContractType,
    public readonly startDate?: Date,
    public readonly endDate?: Date,
    public readonly amount?: number,
    public readonly currency?: string,
    public readonly partyA?: string,
    public readonly partyB?: string,
    public readonly terms?: string[],
    public readonly attachments?: string[],
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * 驗證命令是否有效
   */
  public isValid(): boolean {
    // 至少有一個字段需要更新
    const hasUpdates = !!(
      this.title ||
      this.description ||
      this.contractNumber ||
      this.status ||
      this.type ||
      this.startDate ||
      this.endDate ||
      this.amount ||
      this.currency ||
      this.partyA ||
      this.partyB ||
      this.terms ||
      this.attachments
    );

    if (!hasUpdates) {
      return false;
    }

    // 如果同時更新開始和結束日期，檢查邏輯
    if (this.startDate && this.endDate && this.startDate >= this.endDate) {
      return false;
    }

    // 如果更新金額，檢查是否為正數
    if (this.amount !== undefined && this.amount <= 0) {
      return false;
    }

    return true;
  }

  /**
   * 獲取命令摘要
   */
  public getSummary(): string {
    return `更新合約: ${this.id}`;
  }

  /**
   * 獲取更新的字段
   */
  public getUpdatedFields(): string[] {
    const fields: string[] = [];

    if (this.title !== undefined) fields.push('title');
    if (this.description !== undefined) fields.push('description');
    if (this.contractNumber !== undefined) fields.push('contractNumber');
    if (this.status !== undefined) fields.push('status');
    if (this.type !== undefined) fields.push('type');
    if (this.startDate !== undefined) fields.push('startDate');
    if (this.endDate !== undefined) fields.push('endDate');
    if (this.amount !== undefined) fields.push('amount');
    if (this.currency !== undefined) fields.push('currency');
    if (this.partyA !== undefined) fields.push('partyA');
    if (this.partyB !== undefined) fields.push('partyB');
    if (this.terms !== undefined) fields.push('terms');
    if (this.attachments !== undefined) fields.push('attachments');

    return fields;
  }

  /**
   * 轉換為普通對象
   */
  public toObject(): Record<string, any> {
    const result: Record<string, any> = {
      id: this.id,
      updatedBy: this.updatedBy,
      timestamp: this.timestamp
    };

    if (this.title !== undefined) result['title'] = this.title;
    if (this.description !== undefined) result['description'] = this.description;
    if (this.contractNumber !== undefined) result['contractNumber'] = this.contractNumber;
    if (this.status !== undefined) result['status'] = this.status;
    if (this.type !== undefined) result['type'] = this.type;
    if (this.startDate !== undefined) result['startDate'] = this.startDate;
    if (this.endDate !== undefined) result['endDate'] = this.endDate;
    if (this.amount !== undefined) result['amount'] = this.amount;
    if (this.currency !== undefined) result['currency'] = this.currency;
    if (this.partyA !== undefined) result['partyA'] = this.partyA;
    if (this.partyB !== undefined) result['partyB'] = this.partyB;
    if (this.terms !== undefined) result['terms'] = this.terms;
    if (this.attachments !== undefined) result['attachments'] = this.attachments;

    return result;
  }
}
