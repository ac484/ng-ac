/**
 * @ai-context {
 *   "role": "Interface/Component",
 *   "purpose": "合約表格組件-展示合約列表",
 *   "constraints": ["Material Design", "響應式表格", "數據展示"],
 *   "dependencies": ["MatTableModule", "MatButtonModule", "Contract"],
 *   "security": "low",
 *   "lastmod": "2025-08-19"
 * }
 * @usage <app-contracts-table [contracts]="contracts"></app-contracts-table>
 * @see docs/architecture/components.md
 */
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Contract } from '../../../shared/types';

@Component({
  selector: 'app-contracts-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  template: `
    <div class="table-container">
      <table mat-table [dataSource]="contracts()" class="contracts-table">
        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>合約編號</th>
          <td mat-cell *matCellDef="let contract">{{ contract.id }}</td>
        </ng-container>

        <!-- Title Column -->
        <ng-container matColumnDef="title">
          <th mat-header-cell *matHeaderCellDef>合約標題</th>
          <td mat-cell *matCellDef="let contract">
            <div class="contract-title">
              <span class="title">{{ contract.title }}</span>
              <span class="contractor">{{ contract.contractor }}</span>
            </div>
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>狀態</th>
          <td mat-cell *matCellDef="let contract">
            <mat-chip [color]="getStatusColor(contract.status)">
              {{ getStatusText(contract.status) }}
            </mat-chip>
          </td>
        </ng-container>

        <!-- Value Column -->
        <ng-container matColumnDef="totalValue">
          <th mat-header-cell *matHeaderCellDef>合約金額</th>
          <td mat-cell *matCellDef="let contract">
            {{ contract.totalValue | currency:'USD':'symbol':'1.0-0' }}
          </td>
        </ng-container>

        <!-- Dates Column -->
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef>期間</th>
          <td mat-cell *matCellDef="let contract">
            <div class="date-range">
              <span>{{ contract.startDate | date:'MMM dd, yyyy' }}</span>
              <span>-</span>
              <span>{{ contract.endDate | date:'MMM dd, yyyy' }}</span>
            </div>
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>操作</th>
          <td mat-cell *matCellDef="let contract">
            <div class="actions">
              <button mat-icon-button (click)="viewContract(contract)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button (click)="editContract(contract)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button (click)="exportContract(contract)">
                <mat-icon>download</mat-icon>
              </button>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"
            class="contract-row"
            (click)="viewContract(row)"></tr>
      </table>

      @if (contracts().length === 0) {
        <div class="empty-state">
          <mat-icon>description</mat-icon>
          <h3>沒有合約數據</h3>
          <p>目前沒有任何合約記錄</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-container {
      width: 100%;
      overflow-x: auto;
    }

    .contracts-table {
      width: 100%;
      min-width: 800px;
    }

    .contract-row {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .contract-row:hover {
      background-color: var(--mat-sys-surface-variant);
    }

    .contract-title {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contract-title .title {
      font-weight: 500;
    }

    .contract-title .contractor {
      font-size: 0.875rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .date-range {
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 4px;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      font-weight: 500;
    }

    .empty-state p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .contracts-table {
        min-width: 600px;
      }

      .date-range {
        font-size: 0.75rem;
      }
    }
  `]
})
export class ContractsTableComponent {
  readonly contracts = input.required<Contract[]>();

  readonly displayedColumns = ['id', 'title', 'status', 'totalValue', 'dates', 'actions'];

  protected getStatusColor(status: string): 'primary' | 'accent' | 'warn' {
    switch (status) {
      case 'Active':
        return 'primary';
      case 'Completed':
        return 'accent';
      case 'Pending':
        return 'warn';
      default:
        return 'primary';
    }
  }

  protected getStatusText(status: string): string {
    switch (status) {
      case 'Active':
        return '進行中';
      case 'Completed':
        return '已完成';
      case 'Pending':
        return '待處理';
      default:
        return status;
    }
  }

  protected viewContract(contract: Contract): void {
    console.log('View contract:', contract);
    // TODO: 實現查看合約詳情
  }

  protected editContract(contract: Contract): void {
    console.log('Edit contract:', contract);
    // TODO: 實現編輯合約
  }

  protected exportContract(contract: Contract): void {
    console.log('Export contract:', contract);
    // TODO: 實現導出合約
  }
}
