/**
 * @fileoverview 創建合約用例 (Create Contract Use Case)
 * @description 創建合約的業務用例，協調領域服務和倉儲
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer Use Case
 * - 職責：創建合約業務邏輯編排
 * - 依賴：CreateContractCommand, ContractDomainService, IContractRepository
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循用例模式
 * - 協調領域服務
 * - 處理業務規則
 * - 返回操作結果
 */

import { Injectable } from '@angular/core';
import { Contract } from '../../../domain/entities/contracts/contract.entity';
import { IContractRepository } from '../../../domain/repositories/contracts/contract.repository.interface';
import { ContractDomainService } from '../../../domain/services/contracts/contract-domain.service';
import { CreateContractCommand } from '../../commands/contracts/create-contract.command';

/**
 * 創建合約用例結果
 */
export interface CreateContractResult {
  success: boolean;
  contract?: Contract;
  errors: string[];
}

/**
 * 創建合約用例
 */
@Injectable({
  providedIn: 'root'
})
export class CreateContractUseCase {
  constructor(
    private contractDomainService: ContractDomainService,
    private contractRepository: IContractRepository
  ) {}

  /**
   * 執行創建合約用例
   */
  public async execute(command: CreateContractCommand): Promise<CreateContractResult> {
    try {
      // 驗證命令
      if (!command.isValid()) {
        return {
          success: false,
          errors: ['命令驗證失敗']
        };
      }

      // 檢查合約編號唯一性
      const isUnique = await this.contractDomainService.isContractNumberUnique(
        command.contractNumber
      );

      if (!isUnique) {
        return {
          success: false,
          errors: ['合約編號已存在']
        };
      }

      // 檢查日期衝突
      const hasConflict = await this.contractDomainService.hasDateConflict(
        command.partyA,
        command.partyB,
        command.startDate,
        command.endDate
      );

      if (hasConflict) {
        return {
          success: false,
          errors: ['合約日期與現有合約衝突']
        };
      }

      // 創建合約實體
      const contractProps = {
        id: this.generateId(),
        title: command.title,
        description: command.description,
        contractNumber: command.contractNumber,
        status: command.status,
        type: command.type,
        startDate: command.startDate,
        endDate: command.endDate,
        amount: command.amount,
        currency: command.currency,
        partyA: command.partyA,
        partyB: command.partyB,
        terms: command.terms,
        attachments: command.attachments
      };

      const contract = Contract.create(contractProps);

      if (!contract) {
        return {
          success: false,
          errors: ['合約創建失敗']
        };
      }

      // 驗證業務規則
      const validationResult = this.contractDomainService.validateContractBusinessRules(contract);

      if (!validationResult.isValid) {
        return {
          success: false,
          errors: validationResult.errors
        };
      }

      // 保存合約
      await this.contractRepository.save(contract);

      return {
        success: true,
        contract,
        errors: []
      };

    } catch (error) {
      console.error('創建合約用例執行失敗:', error);
      return {
        success: false,
        errors: ['系統錯誤，請稍後重試']
      };
    }
  }

  /**
   * 生成唯一 ID
   */
  private generateId(): string {
    return `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
