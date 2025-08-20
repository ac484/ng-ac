/**
 * @fileoverview 刪除合約命令 (Delete Contract Command)
 * @description 刪除合約的命令對象，遵循 CQRS 模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer Command
 * - 職責：刪除合約命令封裝
 * - 依賴：無外部依賴
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 CQRS 命令模式
 * - 包含命令驗證
 * - 使用不可變數據結構
 * - 支持軟刪除選項
 */

/**
 * 刪除合約命令
 */
export class DeleteContractCommand {
  constructor(
    public readonly id: string,
    public readonly deletedBy: string,
    public readonly reason?: string,
    public readonly softDelete: boolean = true,
    public readonly timestamp: Date = new Date()
  ) {}

  /**
   * 驗證命令是否有效
   */
  public isValid(): boolean {
    return !!(this.id && this.deletedBy);
  }

  /**
   * 獲取命令摘要
   */
  public getSummary(): string {
    return `刪除合約: ${this.id} (${this.softDelete ? '軟刪除' : '硬刪除'})`;
  }

  /**
   * 獲取刪除原因
   */
  public getDeleteReason(): string {
    return this.reason || '未提供刪除原因';
  }

  /**
   * 轉換為普通對象
   */
  public toObject(): Record<string, any> {
    return {
      id: this.id,
      deletedBy: this.deletedBy,
      reason: this.reason,
      softDelete: this.softDelete,
      timestamp: this.timestamp
    };
  }
}
