/**
 * @fileoverview 創建合約命令 (Create Contract Command)
 * @description 創建合約的命令對象，遵循 CQRS 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer Command
 * - 職責：創建合約命令封裝
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 CQRS 命令模式
 * - 包含命令驗證
 * - 使用不可變數據結構
 * - 支持命令日誌記錄
 */

import { ContractStatus } from '../../../domain/value-objects/contract-status/contract-status.vo';
import { ContractType } from '../../../domain/value-objects/contract-type/contract-type.vo';

/**
 * 創建合約命令
 */
export class CreateContractCommand {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly contractNumber: string,
    public readonly status: ContractStatus,
    public readonly type: ContractType,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly amount: number,
    public readonly currency: string,
    public readonly partyA: string,
    public readonly partyB: string,
    public readonly terms: string[],
    public readonly attachments: string[],
    public readonly createdBy: string,
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * 驗證命令是否有效
   */
  public isValid(): boolean {
    return !!(
      this.title &&
      this.contractNumber &&
      this.startDate &&
      this.endDate &&
      this.amount > 0 &&
      this.partyA &&
      this.partyB &&
      this.startDate < this.endDate &&
      this.terms.length > 0
    );
  }

  /**
   * 獲取命令摘要
   */
  public getSummary(): string {
    return `創建合約: ${this.title} (${this.contractNumber})`;
  }

  /**
   * 轉換為普通對象
   */
  public toObject(): Record<string, any> {
    return {
      title: this.title,
      description: this.description,
      contractNumber: this.contractNumber,
      status: this.status,
      type: this.type,
      startDate: this.startDate,
      endDate: this.endDate,
      amount: this.amount,
      currency: this.currency,
      partyA: this.partyA,
      partyB: this.partyB,
      terms: this.terms,
      attachments: this.attachments,
      createdBy: this.createdBy,
      timestamp: this.timestamp
    };
  }
}
