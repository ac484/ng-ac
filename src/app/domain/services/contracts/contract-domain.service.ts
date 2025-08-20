/**
 * @fileoverview 合約領域服務 (Contract Domain Service)
 * @description 合約業務邏輯的領域服務，處理複雜的業務規則和驗證
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Domain Layer Service
 * - 職責：合約業務邏輯處理
 * - 依賴：Contract Entity, Contract Repository
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 DDD 領域服務原則
 * - 處理複雜業務邏輯
 * - 不包含基礎設施邏輯
 * - 使用依賴注入
 */

import { Inject, Injectable } from '@angular/core';
import { Contract } from '@domain/entities/contracts/contract.entity';
import { IContractRepository } from '@domain/repositories/contracts/contract.repository.interface';
import { ContractStatus } from '@domain/value-objects/contract-status/contract-status.vo';

/**
 * 合約業務規則驗證結果
 */
export interface ContractValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 合約統計信息
 */
export interface ContractStatistics {
  total: number;
  active: number;
  draft: number;
  suspended: number;
  completed: number;
  terminated: number;
  expiringSoon: number;
  expired: number;
}

/**
 * 合約領域服務
 */
@Injectable({
  providedIn: 'root'
})
export class ContractDomainService {
  constructor(
    @Inject('IContractRepository') private contractRepository: IContractRepository
  ) {}

  /**
   * 驗證合約是否可以激活
   */
  public canActivateContract(contract: Contract): ContractValidationResult {
    const errors: string[] = [];

    if (!contract.status.canActivate()) {
      errors.push('合約狀態不允許激活');
    }

    if (contract.isExpired()) {
      errors.push('合約已過期，無法激活');
    }

    if (contract.startDate > new Date()) {
      errors.push('合約開始日期未到，無法激活');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 驗證合約是否可以暫停
   */
  public canSuspendContract(contract: Contract): ContractValidationResult {
    const errors: string[] = [];

    if (!contract.status.canSuspend()) {
      errors.push('合約狀態不允許暫停');
    }

    if (contract.isExpired()) {
      errors.push('合約已過期，無法暫停');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 驗證合約是否可以完成
   */
  public canCompleteContract(contract: Contract): ContractValidationResult {
    const errors: string[] = [];

    if (!contract.status.canComplete()) {
      errors.push('合約狀態不允許完成');
    }

    if (contract.isExpired()) {
      errors.push('合約已過期，無法完成');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 驗證合約是否可以終止
   */
  public canTerminateContract(contract: Contract): ContractValidationResult {
    const errors: string[] = [];

    if (!contract.status.canTerminate()) {
      errors.push('合約狀態不允許終止');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 檢查合約編號是否唯一
   */
  public async isContractNumberUnique(contractNumber: string, excludeId?: string): Promise<boolean> {
    const existingContract = await this.contractRepository.findByContractNumber(contractNumber);

    if (!existingContract) {
      return true;
    }

    if (excludeId && existingContract.id === excludeId) {
      return true;
    }

    return false;
  }

  /**
   * 檢查合約日期衝突
   */
  public async hasDateConflict(
    partyA: string,
    partyB: string,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ): Promise<boolean> {
    const criteria = {
      partyA,
      partyB,
      startDate,
      endDate
    };

    const contracts = await this.contractRepository.findByCriteria(criteria);

    if (excludeId) {
      return contracts.some(contract =>
        contract.id !== excludeId &&
        contract.isActive()
      );
    }

    return contracts.some(contract => contract.isActive());
  }

  /**
   * 獲取合約統計信息
   */
  public async getContractStatistics(): Promise<ContractStatistics> {
    const [total, active, draft, suspended, completed, terminated, expiringSoon, expired] = await Promise.all([
      this.contractRepository.count(),
      this.contractRepository.findByStatus(ContractStatus.ACTIVE).then(contracts => contracts.length),
      this.contractRepository.findByStatus(ContractStatus.DRAFT).then(contracts => contracts.length),
      this.contractRepository.findByStatus(ContractStatus.SUSPENDED).then(contracts => contracts.length),
      this.contractRepository.findByStatus(ContractStatus.COMPLETED).then(contracts => contracts.length),
      this.contractRepository.findByStatus(ContractStatus.TERMINATED).then(contracts => contracts.length),
      this.contractRepository.findExpiringSoon().then(contracts => contracts.length),
      this.contractRepository.findExpired().then(contracts => contracts.length)
    ]);

    return {
      total,
      active,
      draft,
      suspended,
      completed,
      terminated,
      expiringSoon,
      expired
    };
  }

  /**
   * 檢查合約業務規則
   */
  public validateContractBusinessRules(contract: Contract): ContractValidationResult {
    const errors: string[] = [];

    // 檢查金額是否合理
    if (contract.amount <= 0) {
      errors.push('合約金額必須大於零');
    }

    // 檢查日期邏輯
    if (contract.startDate >= contract.endDate) {
      errors.push('合約開始日期必須早於結束日期');
    }

    // 檢查當事人
    if (!contract.partyA || !contract.partyB) {
      errors.push('合約當事人不能為空');
    }

    if (contract.partyA === contract.partyB) {
      errors.push('合約當事人不能相同');
    }

    // 檢查條款
    if (contract.terms.length === 0) {
      errors.push('合約條款不能為空');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
