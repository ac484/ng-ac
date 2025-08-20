/**
 * @fileoverview 合約倉儲接口 (Contract Repository Interface)
 * @description 定義合約數據訪問的抽象接口，遵循 DDD 倉儲模式
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Domain Layer Repository Interface
 * - 職責：合約數據訪問抽象定義
 * - 依賴：Contract Entity
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 DDD 倉儲模式
 * - 定義標準 CRUD 操作
 * - 支持業務查詢方法
 * - 使用 Promise 異步操作
 */

import { Contract } from '../../entities/contracts/contract.entity';
import { ContractStatus } from '../../value-objects/contract-status/contract-status.vo';
import { ContractType } from '../../value-objects/contract-type/contract-type.vo';

/**
 * 合約查詢條件接口
 */
export interface ContractQueryCriteria {
  status?: ContractStatus;
  type?: ContractType;
  partyA?: string;
  partyB?: string;
  startDate?: Date;
  endDate?: Date;
  amountMin?: number;
  amountMax?: number;
  searchTerm?: string;
}

/**
 * 合約倉儲接口
 */
export interface IContractRepository {
  /**
   * 根據 ID 查找合約
   */
  findById(id: string): Promise<Contract | null>;

  /**
   * 根據合約編號查找合約
   */
  findByContractNumber(contractNumber: string): Promise<Contract | null>;

  /**
   * 查找所有合約
   */
  findAll(): Promise<Contract[]>;

  /**
   * 根據條件查詢合約
   */
  findByCriteria(criteria: ContractQueryCriteria): Promise<Contract[]>;

  /**
   * 查找活躍合約
   */
  findActive(): Promise<Contract[]>;

  /**
   * 查找即將到期的合約（30天內）
   */
  findExpiringSoon(): Promise<Contract[]>;

  /**
   * 查找過期合約
   */
  findExpired(): Promise<Contract[]>;

  /**
   * 根據狀態查找合約
   */
  findByStatus(status: ContractStatus): Promise<Contract[]>;

  /**
   * 根據類型查找合約
   */
  findByType(type: ContractType): Promise<Contract[]>;

  /**
   * 根據當事人查找合約
   */
  findByParty(partyName: string): Promise<Contract[]>;

  /**
   * 保存合約
   */
  save(contract: Contract): Promise<void>;

  /**
   * 更新合約
   */
  update(contract: Contract): Promise<void>;

  /**
   * 刪除合約
   */
  delete(id: string): Promise<void>;

  /**
   * 檢查合約編號是否存在
   */
  existsByContractNumber(contractNumber: string): Promise<boolean>;

  /**
   * 獲取合約總數
   */
  count(): Promise<number>;

  /**
   * 根據條件獲取合約數量
   */
  countByCriteria(criteria: ContractQueryCriteria): Promise<number>;
}
