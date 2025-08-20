/**
 * @fileoverview 合約管理頁面 (Contract Management Page)
 * @description 合約管理的主頁面，包含合約列表和操作功能
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Interface Layer Page
 * - 職責：合約管理頁面邏輯
 * - 依賴：ContractApplicationService, Router
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 Angular 頁面規範
 * - 使用 OnPush 變更檢測策略
 * - 包含頁面生命週期管理
 * - 支持響應式設計
 */

import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContractDTO } from '@application/dto/contracts/contract.dto';
import { ContractApplicationService } from '@application/services/contracts/contract-application.service';
import { ContractStatistics } from '@domain/services/contracts/contract-domain.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * 合約管理頁面
 */
@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.page.html',
  styleUrls: ['./contract-management.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContractManagementPage implements OnInit, OnDestroy {
  public contracts: ContractDTO[] = [];
  public statistics: ContractStatistics | null = null;
  public isLoading = false;
  public errorMessage = '';
  public showCreateForm = false;

  private destroy$ = new Subject<void>();

  constructor(
    private contractService: ContractApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadContracts();
    this.loadStatistics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 載入合約列表
   */
  private loadContracts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.contractService.getAllContracts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (contracts) => {
          this.contracts = contracts;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = '載入合約列表失敗';
          this.isLoading = false;
          console.error('載入合約錯誤:', error);
        }
      });
  }

  /**
   * 載入統計信息
   */
  private loadStatistics(): void {
    this.contractService.getContractStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.statistics = stats;
        },
        error: (error) => {
          console.error('載入統計信息錯誤:', error);
        }
      });
  }

  /**
   * 顯示創建表單
   */
  public showCreateContractForm(): void {
    this.showCreateForm = true;
  }

  /**
   * 隱藏創建表單
   */
  public hideCreateContractForm(): void {
    this.showCreateForm = false;
  }

  /**
   * 處理合約創建成功
   */
  public onContractCreated(contract: ContractDTO): void {
    this.contracts.unshift(contract);
    this.showCreateForm = false;
    this.loadStatistics(); // 重新載入統計信息
  }

  /**
   * 處理合約創建取消
   */
  public onContractCreationCancelled(): void {
    this.showCreateForm = false;
  }

  /**
   * 查看合約詳情
   */
  public viewContract(contract: ContractDTO): void {
    this.router.navigate(['/contracts', contract.id]);
  }

  /**
   * 編輯合約
   */
  public editContract(contract: ContractDTO): void {
    this.router.navigate(['/contracts', contract.id, 'edit']);
  }

  /**
   * 刪除合約
   */
  public deleteContract(contract: ContractDTO): void {
    if (confirm(`確定要刪除合約 "${contract.title}" 嗎？`)) {
      // 實現刪除邏輯
      console.log('刪除合約:', contract.id);
    }
  }

  /**
   * 刷新頁面
   */
  public refresh(): void {
    this.loadContracts();
    this.loadStatistics();
  }

  /**
   * 獲取狀態顯示名稱
   */
  public getStatusDisplayName(status: string): string {
    const statusMap: Record<string, string> = {
      'draft': '草稿',
      'active': '活躍',
      'suspended': '暫停',
      'completed': '完成',
      'terminated': '終止'
    };
    return statusMap[status] || status;
  }

  /**
   * 獲取類型顯示名稱
   */
  public getTypeDisplayName(type: string): string {
    const typeMap: Record<string, string> = {
      'service': '服務合約',
      'product': '產品合約',
      'employment': '僱傭合約',
      'partnership': '合作合約',
      'licensing': '授權合約',
      'lease': '租賃合約'
    };
    return typeMap[type] || type;
  }

  /**
   * 獲取狀態樣式類
   */
  public getStatusClass(status: string): string {
    const statusClassMap: Record<string, string> = {
      'draft': 'status-draft',
      'active': 'status-active',
      'suspended': 'status-suspended',
      'completed': 'status-completed',
      'terminated': 'status-terminated'
    };
    return statusClassMap[status] || 'status-default';
  }

  /**
   * 檢查合約是否即將到期
   */
  public isExpiringSoon(contract: ContractDTO): boolean {
    const endDate = new Date(contract.endDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return endDate <= thirtyDaysFromNow && contract.status === 'active';
  }

  /**
   * 檢查合約是否過期
   */
  public isExpired(contract: ContractDTO): boolean {
    const endDate = new Date(contract.endDate);
    const now = new Date();
    return endDate < now;
  }
}
