/**
 * @fileoverview 合約 DTO (Contract DTO)
 * @description 合約數據傳輸對象，用於應用層與接口層的數據交換
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer DTO
 * - 職責：合約數據傳輸封裝
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 DTO 模式
 * - 包含數據驗證
 * - 支持序列化/反序列化
 * - 使用接口定義
 */

/**
 * 合約 DTO 接口
 */
export interface IContractDTO {
  id: string;
  title: string;
  description: string;
  contractNumber: string;
  status: string;
  type: string;
  startDate: string; // ISO 日期字符串
  endDate: string; // ISO 日期字符串
  amount: number;
  currency: string;
  partyA: string;
  partyB: string;
  terms: string[];
  attachments: string[];
  createdAt: string; // ISO 日期字符串
  updatedAt: string; // ISO 日期字符串
}

/**
 * 合約 DTO 實現
 */
export class ContractDTO implements IContractDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly contractNumber: string,
    public readonly status: string,
    public readonly type: string,
    public readonly startDate: string,
    public readonly endDate: string,
    public readonly amount: number,
    public readonly currency: string,
    public readonly partyA: string,
    public readonly partyB: string,
    public readonly terms: string[],
    public readonly attachments: string[],
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  /**
   * 從普通對象創建 DTO
   */
  public static fromObject(obj: any): ContractDTO {
    return new ContractDTO(
      obj.id || '',
      obj.title || '',
      obj.description || '',
      obj.contractNumber || '',
      obj.status || '',
      obj.type || '',
      obj.startDate || '',
      obj.endDate || '',
      obj.amount || 0,
      obj.currency || '',
      obj.partyA || '',
      obj.partyB || '',
      obj.terms || [],
      obj.attachments || [],
      obj.createdAt || '',
      obj.updatedAt || ''
    );
  }

  /**
   * 驗證 DTO 是否有效
   */
  public isValid(): boolean {
    return !!(
      this.id &&
      this.title &&
      this.contractNumber &&
      this.startDate &&
      this.endDate &&
      this.amount > 0 &&
      this.partyA &&
      this.partyB
    );
  }

  /**
   * 轉換為普通對象
   */
  public toObject(): Record<string, any> {
    return {
      id: this.id,
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * 克隆 DTO
   */
  public clone(): ContractDTO {
    return new ContractDTO(
      this.id,
      this.title,
      this.description,
      this.contractNumber,
      this.status,
      this.type,
      this.startDate,
      this.endDate,
      this.amount,
      this.currency,
      this.partyA,
      this.partyB,
      this.terms,
      this.attachments,
      this.createdAt,
      this.updatedAt
    );
  }
}
