import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { AccountDto, AccountSearchDto, AccountStatus, AccountType } from '../../application/dto/account.dto';
import { AccountApplicationService } from '../../application/services/account-application.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzSpaceModule,
    NzTagModule,
    NzModalModule,

    NzPopconfirmModule,
    NzIconModule,
    NzStatisticModule,
    NzProgressModule,
    NzToolTipModule,
    NzBadgeModule,
    NzAvatarModule,
    NzDividerModule,
    NzDescriptionsModule,
    NzFormModule,
    NzInputNumberModule,
    NzDatePickerModule
  ],
  template: `
    <div class="account-list-container">
      <!-- Header with Statistics -->
      <nz-card class="stats-card">
        <div class="stats-grid">
          <nz-statistic nzTitle="Total Accounts" [nzValue]="accountStats.total" [nzValueStyle]="{ color: '#3f8600' }"> </nz-statistic>
          <nz-statistic nzTitle="Active Accounts" [nzValue]="accountStats.active" [nzValueStyle]="{ color: '#1890ff' }"> </nz-statistic>
          <nz-statistic
            nzTitle="Total Balance"
            [nzValue]="(accountStats.totalBalance | currency: 'USD') || '0'"
            [nzValueStyle]="{ color: '#722ed1' }"
          >
          </nz-statistic>
          <nz-statistic
            nzTitle="Average Balance"
            [nzValue]="(accountStats.averageBalance | currency: 'USD') || '0'"
            [nzValueStyle]="{ color: '#eb2f96' }"
          >
          </nz-statistic>
        </div>
      </nz-card>

      <!-- Search and Actions -->
      <nz-card class="search-card">
        <div class="search-form">
          <nz-row [nzGutter]="16">
            <nz-col [nzSpan]="6">
              <nz-input-group [nzSuffix]="suffixIconSearch">
                <input
                  type="text"
                  nz-input
                  placeholder="Search account number or name"
                  [(ngModel)]="searchDto.accountNumber"
                  (ngModelChange)="onSearch()"
                />
              </nz-input-group>
              <ng-template #suffixIconSearch>
                <span nz-icon nzType="search"></span>
              </ng-template>
            </nz-col>
            <nz-col [nzSpan]="4">
              <nz-select nzPlaceHolder="Account Type" [(ngModel)]="searchDto.accountType" (ngModelChange)="onSearch()" nzAllowClear>
                <nz-option nzValue="CHECKING" nzLabel="Checking"></nz-option>
                <nz-option nzValue="SAVINGS" nzLabel="Savings"></nz-option>
                <nz-option nzValue="CREDIT" nzLabel="Credit"></nz-option>
                <nz-option nzValue="INVESTMENT" nzLabel="Investment"></nz-option>
              </nz-select>
            </nz-col>
            <nz-col [nzSpan]="4">
              <nz-select nzPlaceHolder="Status" [(ngModel)]="searchDto.status" (ngModelChange)="onSearch()" nzAllowClear>
                <nz-option nzValue="ACTIVE" nzLabel="Active"></nz-option>
                <nz-option nzValue="INACTIVE" nzLabel="Inactive"></nz-option>
                <nz-option nzValue="SUSPENDED" nzLabel="Suspended"></nz-option>
                <nz-option nzValue="CLOSED" nzLabel="Closed"></nz-option>
              </nz-select>
            </nz-col>
            <nz-col [nzSpan]="4">
              <nz-input-number
                nzPlaceHolder="Min Balance"
                [(ngModel)]="searchDto.minBalance"
                (ngModelChange)="onSearch()"
                [nzMin]="0"
                nzStyle="width: 100%"
              >
              </nz-input-number>
            </nz-col>
            <nz-col [nzSpan]="4">
              <nz-input-number
                nzPlaceHolder="Max Balance"
                [(ngModel)]="searchDto.maxBalance"
                (ngModelChange)="onSearch()"
                [nzMin]="0"
                nzStyle="width: 100%"
              >
              </nz-input-number>
            </nz-col>
            <nz-col [nzSpan]="2">
              <button nz-button nzType="primary" (click)="addAccount()" nz-tooltip nzTooltipTitle="Add New Account">
                <span nz-icon nzType="plus"></span>
              </button>
            </nz-col>
          </nz-row>
        </div>
      </nz-card>

      <!-- Accounts Table -->
      <nz-card>
        <nz-table
          #basicTable
          [nzData]="accounts"
          [nzLoading]="loading"
          [nzTotal]="total"
          [nzPageSize]="pageSize"
          [nzPageIndex]="currentPage"
          [nzShowSizeChanger]="true"
          [nzShowQuickJumper]="true"
          [nzShowTotal]="totalTemplate"
          (nzCurrentPageDataChange)="onCurrentPageDataChange($event)"
          (nzPageIndexChange)="onPageIndexChange($event)"
        >
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Account Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Last Transaction</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let account of basicTable.data">
              <td>
                <nz-badge [nzCount]="account.status === 'ACTIVE' ? 0 : 1" [nzOffset]="[10, 0]">
                  <strong>{{ account.accountNumber }}</strong>
                </nz-badge>
              </td>
              <td>
                <div class="account-name">
                  <span class="name">{{ account.accountName }}</span>
                  <small *ngIf="account.description" class="description">{{ account.description }}</small>
                </div>
              </td>
              <td>
                <nz-tag [nzColor]="getAccountTypeColor(account.accountType)">
                  {{ account.accountType }}
                </nz-tag>
              </td>
              <td>
                <div class="balance-info">
                  <span class="balance" [class.negative]="account.balance < 0">
                    {{ account.balance | currency: account.currency }}
                  </span>
                  <nz-progress
                    *ngIf="account.balance >= 0"
                    [nzPercent]="getBalancePercentage(account.balance)"
                    [nzShowInfo]="false"
                    [nzSize]="'small'"
                    [nzStrokeColor]="getBalanceColor(account.balance)"
                  >
                  </nz-progress>
                </div>
              </td>
              <td>
                <nz-tag [nzColor]="getStatusColor(account.status)">
                  {{ account.status }}
                </nz-tag>
              </td>
              <td>
                <span *ngIf="account.lastTransactionDate; else noTransaction">
                  {{ account.lastTransactionDate | date: 'short' }}
                </span>
                <ng-template #noTransaction>
                  <span class="no-transaction">No transactions</span>
                </ng-template>
              </td>
              <td>
                <nz-space>
                  <button nz-button nzType="text" nzSize="small" (click)="viewAccount(account)" nz-tooltip nzTooltipTitle="View Details">
                    <span nz-icon nzType="eye"></span>
                  </button>
                  <button nz-button nzType="text" nzSize="small" (click)="editAccount(account)" nz-tooltip nzTooltipTitle="Edit Account">
                    <span nz-icon nzType="edit"></span>
                  </button>
                  <button nz-button nzType="text" nzSize="small" (click)="deposit(account)" nz-tooltip nzTooltipTitle="Deposit">
                    <span nz-icon nzType="plus-circle"></span>
                  </button>
                  <button nz-button nzType="text" nzSize="small" (click)="withdraw(account)" nz-tooltip nzTooltipTitle="Withdraw">
                    <span nz-icon nzType="minus-circle"></span>
                  </button>
                  <nz-popconfirm
                    nzTitle="Are you sure you want to delete this account?"
                    nzOkText="Yes"
                    nzCancelText="No"
                    (nzOnConfirm)="deleteAccount(account.id)"
                  >
                    <button nz-button nzType="text" nzSize="small" nzDanger nz-tooltip nzTooltipTitle="Delete Account">
                      <span nz-icon nzType="delete"></span>
                    </button>
                  </nz-popconfirm>
                </nz-space>
              </td>
            </tr>
          </tbody>
        </nz-table>

        <ng-template #totalTemplate let-total let-range="range"> {{ range[0] }}-{{ range[1] }} of {{ total }} accounts </ng-template>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .account-list-container {
        padding: 24px;
      }

      .stats-card {
        margin-bottom: 16px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
      }

      .search-card {
        margin-bottom: 16px;
      }

      .search-form {
        margin-bottom: 16px;
      }

      .account-name {
        display: flex;
        flex-direction: column;
      }

      .account-name .name {
        font-weight: 500;
      }

      .account-name .description {
        color: #8c8c8c;
        font-size: 12px;
      }

      .balance-info {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .balance {
        font-weight: 500;
      }

      .balance.negative {
        color: #ff4d4f;
      }

      .no-transaction {
        color: #8c8c8c;
        font-style: italic;
      }

      nz-card {
        margin-bottom: 16px;
      }

      nz-table {
        margin-top: 16px;
      }

      .ant-table-tbody > tr > td {
        vertical-align: top;
      }
    `
  ]
})
export class AccountListComponent implements OnInit {
  accounts: AccountDto[] = [];
  loading = false;
  total = 0;
  currentPage = 1;
  pageSize = 10;
  searchDto: AccountSearchDto = {};
  accountStats = {
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    closed: 0,
    totalBalance: 0,
    averageBalance: 0
  };

  constructor(
    private accountApplicationService: AccountApplicationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadAccountStats();
  }

  async loadAccounts(): Promise<void> {
    try {
      this.loading = true;
      const result = await this.accountApplicationService.getAllAccounts({
        ...this.searchDto,
        page: this.currentPage,
        pageSize: this.pageSize
      });
      this.accounts = result.accounts;
      this.total = result.total;
    } catch (error) {
      this.message.error('Failed to load accounts');
      console.error('Error loading accounts:', error);
    } finally {
      this.loading = false;
    }
  }

  async loadAccountStats(): Promise<void> {
    try {
      const stats = await this.accountApplicationService.getAccountStats();
      this.accountStats = stats;
    } catch (error) {
      console.error('Error loading account stats:', error);
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadAccounts();
  }

  onCurrentPageDataChange(data: readonly AccountDto[]): void {
    this.accounts = [...data];
  }

  onPageIndexChange(page: number): void {
    this.currentPage = page;
    this.loadAccounts();
  }

  getAccountTypeColor(accountType: string): string {
    switch (accountType.toUpperCase()) {
      case 'CHECKING':
        return 'blue';
      case 'SAVINGS':
        return 'green';
      case 'CREDIT':
        return 'orange';
      case 'INVESTMENT':
        return 'purple';
      default:
        return 'default';
    }
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'gray';
      case 'SUSPENDED':
        return 'orange';
      case 'CLOSED':
        return 'red';
      default:
        return 'default';
    }
  }

  getBalanceColor(balance: number): string {
    if (balance < 0) return '#ff4d4f';
    if (balance < 1000) return '#faad14';
    if (balance < 10000) return '#52c41a';
    return '#1890ff';
  }

  getBalancePercentage(balance: number): number {
    // Simple percentage calculation for visualization
    const maxBalance = 100000; // Assume max balance for percentage
    return Math.min((balance / maxBalance) * 100, 100);
  }

  addAccount(): void {
    this.message.info('Add account functionality will be implemented');
  }

  viewAccount(account: AccountDto): void {
    this.message.info(`Viewing account: ${account.accountName}`);
  }

  editAccount(account: AccountDto): void {
    this.message.info(`Editing account: ${account.accountName}`);
  }

  deposit(account: AccountDto): void {
    this.message.info(`Deposit to account: ${account.accountName}`);
  }

  withdraw(account: AccountDto): void {
    this.message.info(`Withdraw from account: ${account.accountName}`);
  }

  async deleteAccount(accountId: string): Promise<void> {
    try {
      await this.accountApplicationService.deleteAccount(accountId);
      this.message.success('Account deleted successfully');
      this.loadAccounts();
      this.loadAccountStats();
    } catch (error) {
      this.message.error('Failed to delete account');
      console.error('Error deleting account:', error);
    }
  }
}
