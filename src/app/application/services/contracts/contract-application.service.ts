/**
 * @fileoverview 合約應用服務 (Contract Application Service)
 * @description 合約業務的應用服務，協調用例和提供業務功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Application Layer Service
 * - 職責：合約業務功能協調
 * - 依賴：合約用例, 合約領域服務, 合約倉儲
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循應用服務模式
 * - 協調用例執行
 * - 提供業務功能接口
 * - 不包含業務邏輯
 */

import { Inject, Injectable } from '@angular/core';
import { CreateContractCommand } from '@application/commands/contracts/create-contract.command';
import { ContractDTO } from '@application/dto/contracts/contract.dto';
import { CreateContractResult, CreateContractUseCase } from '@application/use-cases/contracts/create-contract.use-case';
import { Contract } from '@domain/entities/contracts/contract.entity';
import { IContractRepository } from '@domain/repositories/contracts/contract.repository.interface';
import { ContractDomainService, ContractStatistics } from '@domain/services/contracts/contract-domain.service';
import { ContractStatus } from '@domain/value-objects/contract-status/contract-status.vo';
import { ContractType } from '@domain/value-objects/contract-type/contract-type.vo';
import { Observable, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * 合約應用服務
 */
@Injectable({
  providedIn: 'root'
})
export class ContractApplicationService {
  constructor(
    private createContractUseCase: CreateContractUseCase,
    private contractDomainService: ContractDomainService,
    @Inject('IContractRepository') private contractRepository: IContractRepository
  ) {}

  /**
   * 創建合約
   */
  public createContract(contractData: {
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
    createdBy: string;
  }): Observable<CreateContractResult> {
    const command = new CreateContractCommand(
      contractData.title,
      contractData.description,
      contractData.contractNumber,
      contractData.status,
      contractData.type,
      contractData.startDate,
      contractData.endDate,
      contractData.amount,
      contractData.currency,
      contractData.partyA,
      contractData.partyB,
      contractData.terms,
      contractData.attachments,
      contractData.createdBy
    );

    return from(this.createContractUseCase.execute(command));
  }

  /**
   * 獲取所有合約
   */
  public getAllContracts(): Observable<ContractDTO[]> {
    return from(this.contractRepository.findAll()).pipe(
      map(contracts => contracts.map(contract => this.mapContractToDTO(contract))),
      catchError(error => {
        console.error('獲取合約列表失敗:', error);
        return of([]);
      })
    );
  }

  /**
   * 根據 ID 獲取合約
   */
  public getContractById(id: string): Observable<ContractDTO | null> {
    return from(this.contractRepository.findById(id)).pipe(
      map(contract => contract ? this.mapContractToDTO(contract) : null),
      catchError(error => {
        console.error('獲取合約詳情失敗:', error);
        return of(null);
      })
    );
  }

  /**
   * 根據狀態獲取合約
   */
  public getContractsByStatus(status: ContractStatus): Observable<ContractDTO[]> {
    return from(this.contractRepository.findByStatus(status)).pipe(
      map(contracts => contracts.map(contract => this.mapContractToDTO(contract))),
      catchError(error => {
        console.error('根據狀態獲取合約失敗:', error);
        return of([]);
      })
    );
  }

  /**
   * 根據類型獲取合約
   */
  public getContractsByType(type: ContractType): Observable<ContractDTO[]> {
    return from(this.contractRepository.findByType(type)).pipe(
      map(contracts => contracts.map(contract => this.mapContractToDTO(contract))),
      catchError(error => {
        console.error('根據類型獲取合約失敗:', error);
        return of([]);
      })
    );
  }

  /**
   * 獲取活躍合約
   */
  public getActiveContracts(): Observable<ContractDTO[]> {
    return from(this.contractRepository.findActive()).pipe(
      map(contracts => contracts.map(contract => this.mapContractToDTO(contract))),
      catchError(error => {
        console.error('獲取活躍合約失敗:', error);
        return of([]);
      })
    );
  }

  /**
   * 獲取即將到期的合約
   */
  public getExpiringContracts(): Observable<ContractDTO[]> {
    return from(this.contractRepository.findExpiringSoon()).pipe(
      map(contracts => contracts.map(contract => this.mapContractToDTO(contract))),
      catchError(error => {
        console.error('獲取即將到期合約失敗:', error);
        return of([]);
      })
    );
  }

  /**
   * 獲取合約統計信息
   */
  public getContractStatistics(): Observable<ContractStatistics> {
    return from(this.contractDomainService.getContractStatistics()).pipe(
      catchError(error => {
        console.error('獲取合約統計失敗:', error);
        return of({
          total: 0,
          active: 0,
          draft: 0,
          suspended: 0,
          completed: 0,
          terminated: 0,
          expiringSoon: 0,
          expired: 0
        });
      })
    );
  }

  /**
   * 檢查合約編號是否唯一
   */
  public isContractNumberUnique(contractNumber: string, excludeId?: string): Observable<boolean> {
    return from(this.contractDomainService.isContractNumberUnique(contractNumber, excludeId)).pipe(
      catchError(error => {
        console.error('檢查合約編號唯一性失敗:', error);
        return of(false);
      })
    );
  }

  /**
   * 將合約實體映射為 DTO
   */
  private mapContractToDTO(contract: Contract): ContractDTO {
    return new ContractDTO(
      contract.id,
      contract.title,
      contract.description,
      contract.contractNumber,
      contract.status.value,
      contract.type.value,
      contract.startDate.toISOString(),
      contract.endDate.toISOString(),
      contract.amount,
      contract.currency,
      contract.partyA,
      contract.partyB,
      contract.terms,
      contract.attachments,
      contract.createdAt.toISOString(),
      contract.updatedAt.toISOString()
    );
  }
}
