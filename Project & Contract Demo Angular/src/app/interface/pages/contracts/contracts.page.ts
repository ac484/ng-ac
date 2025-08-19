/**
 * @ai-context {
 *   "role": "Interface/Page",
 *   "purpose": "合約列表頁面-展示合約統計和列表",
 *   "constraints": ["極簡設計", "Material Design", "Signals狀態"],
 *   "dependencies": ["ContractService", "MatDialog", "MatBottomSheet"],
 *   "security": "medium",
 *   "lastmod": "2025-01-18"
 * }
 */
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ContractService } from '../../../application/services/contract.service';
import { ContractsDashboardStatsComponent } from '../../../interface/components/contracts/contracts-dashboard-stats.component';
import { ContractsTableComponent } from '../../../interface/components/contracts/contracts-table.component';
import { Contract } from '../../../shared/types';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ContractsDashboardStatsComponent,
    ContractsTableComponent
  ],
  template: `
    <div class="contracts-page">
      <div class="page-header">
        <h1>合約管理</h1>
        <div class="header-actions">
          <button mat-raised-button color="primary" (click)="openAiSummarizer()">
            <mat-icon>smart_toy</mat-icon>
            AI 合約摘要
          </button>
          <button mat-raised-button color="accent">
            <mat-icon>add</mat-icon>
            新增合約
          </button>
        </div>
      </div>

      <app-contracts-dashboard-stats [stats]="contractStats()" />

      <mat-card class="contracts-table-card">
        <mat-card-header>
          <mat-card-title>合約列表</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <app-contracts-table [contracts]="contracts()" />
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .contracts-page {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 500;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .contracts-table-card {
      margin-top: 24px;
    }

    @media (max-width: 768px) {
      .contracts-page {
        padding: 16px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .header-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class ContractsPageComponent {
  private readonly contractService = inject(ContractService);
  private readonly dialog = inject(MatDialog);

  readonly contracts = this.contractService.contracts;

  readonly contractStats = computed(() => {
    const contracts = this.contracts();
    return {
      total: contracts.length,
      active: contracts.filter((c: Contract) => c.status === 'Active').length,
      completed: contracts.filter((c: Contract) => c.status === 'Completed').length,
      totalValue: contracts.reduce((sum: number, c: Contract) => sum + c.totalValue, 0)
    };
  });

  openAiSummarizer() {
    // TODO: 實現 AI 摘要對話框
    console.log('AI 摘要功能開發中...');
  }
}
