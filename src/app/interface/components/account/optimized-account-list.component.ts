/**
 * 優化的帳戶列表組件
 * 使用通用 DataTableComponent，整合 Money 值物件的顯示格式化
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

import { AccountTransactionModalComponent, TransactionType, TransactionResult } from './account-transaction-modal.component';
import {
  OptimizedAccountApplicationService,
  AccountResponseDto
} from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';
import { DataTableComponent } from '../shared/data-table/data-table.component';
import { TableColumn, TableAction, PaginationConfig } from '../shared/data-table/table-column.interface';

@Component({
  selector: 'app-optimized-account-list',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzSpaceModule,
    NzGridModule,
    DataTableComponent,
    AccountTransactionModalComponent
  ],
  template: `
    <div class="account-list-container">
      <!-- 統計卡片 -->
      <nz-card class="stats-card" nzTitle="帳戶統計">
        <nz-row [nzGutter]="16">
          <nz-col [nzSpan]="6">
            <nz-statistic nzTitle="總帳戶數" [nzValue]="accountStats.totalAccounts" [nzValueStyle]="{ color: '#3f8600' }"> </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic nzTitle="啟用帳戶" [nzValue]="accountStats.activeAccounts" [nzValueStyle]="{ color: '#1890ff' }"> </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic nzTitle="總餘額" [nzValue]="accountStats.totalBalance" [nzValueStyle]="{ color: '#722ed1' }">
              <ng-template #nzFormatter let-value>
                {{ balanceFormatter(value) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic nzTitle="平均餘額" [nzValue]="accountStats.averageBalance" [nzValueStyle]="{ color: '#eb2f96' }">
              <ng-template #nzFormatter let-value>
                {{ balanceFormatter(value) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
        </nz-row>
      </nz-card>

      <!-- 操作區域 -->
      <nz-card class="actions-card">
        <nz-space>
          <button nz-button nzType="primary" (click)="createAccount()">
            <span nz-icon nzType="plus"></span>
            新增帳戶
          </button>
          <button nz-button nzType="default" (click)="refreshData()">
            <span nz-icon nzType="reload"></span>
            重新整理
          </button>
          <button nz-button nzType="default" (click)="exportData()">
            <span nz-icon nzType="download"></span>
            匯出資料
          </button>
        </nz-space>
      </nz-card>

      <!-- 帳戶列表 -->
      <nz-card nzTitle="帳戶列表">
        <app-data-table
          [data]="accounts"
          [columns]="tableColumns"
          [actions]="tableActions"
          [loading]="loading"
          [pagination]="paginationConfig"
          [size]="'middle'"
          [bordered]="true"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
          (view)="viewAccount($event)"
          (edit)="editAccount($event)"
          (delete)="deleteAccount($event)"
          (customAction)="onCustomAction($event)"
        >
        </app-data-table>
      </nz-card>

      <!-- 交易模態框 -->
      <app-account-transaction-modal
        [(visible)]="transactionModalVisible"
        [account]="selectedAccount"
        [transactionType]="currentTransactionType"
        [availableAccounts]="accounts"
        (transactionComplete)="onTransactionComplete($event)"
        (cancel)="onTransactionCancel()"
      >
      </app-account-transaction-modal>
    </div>
  `,
  styles: [
    `
      .account-list-container {
        padding: 24px;
      }

      .stats-card,
      .actions-card {
        margin-bottom: 16px;
      }

      .stats-card .ant-statistic {
        text-align: center;
      }

      .actions-card {
        text-align: right;
      }

      nz-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    `
  ]
})
export class OptimizedAccountListComponent implements OnInit {
  private readonly accountService = inject(OptimizedAccountApplicationService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  // 資料屬性
  accounts: AccountResponseDto[] = [];
  loading = false;

  // 交易模態框相關屬性
  transactionModalVisible = false;
  selectedAccount?: AccountResponseDto;
  currentTransactionType?: TransactionType;

  // 統計資料
  accountStats = {
    totalAccounts: 0,
    activeAccounts: 0,
    totalBalance: 0,
    averageBalance: 0
  };

  // 分頁配置
  paginationConfig: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50, 100]
  };

  // 表格欄位配置
  tableColumns: TableColumn[] = [
    {
      key: 'accountNumber',
      title: '帳戶號碼',
      type: 'text',
      width: '120px',
      sortable: true
    },
    {
      key: 'name',
      title: '帳戶名稱',
      type: 'text',
      sortable: true
    },
    {
      key: 'type',
      title: '帳戶類型',
      type: 'status',
      width: '100px',
      statusColors: {
        [AccountType.CHECKING]: 'blue',
        [AccountType.SAVINGS]: 'green',
        [AccountType.CREDIT]: 'orange'
      },
      statusTexts: {
        [AccountType.CHECKING]: '支票帳戶',
        [AccountType.SAVINGS]: '儲蓄帳戶',
        [AccountType.CREDIT]: '信用帳戶'
      }
    },
    {
      key: 'formattedBalance',
      title: '餘額',
      type: 'text',
      width: '120px',
      align: 'right',
      formatter: (value: string, item: AccountResponseDto) => {
        return `<span class="${item.balance < 0 ? 'negative-balance' : 'positive-balance'}">${value}</span>`;
      }
    },
    {
      key: 'status',
      title: '狀態',
      type: 'status',
      width: '80px',
      statusColors: {
        [AccountStatus.ACTIVE]: 'green',
        [AccountStatus.INACTIVE]: 'red',
        [AccountStatus.SUSPENDED]: 'orange',
        [AccountStatus.CLOSED]: 'red'
      },
      statusTexts: {
        [AccountStatus.ACTIVE]: '啟用',
        [AccountStatus.INACTIVE]: '停用',
        [AccountStatus.SUSPENDED]: '暫停',
        [AccountStatus.CLOSED]: '已關閉'
      }
    },
    {
      key: 'lastTransactionDate',
      title: '最後交易',
      type: 'date',
      width: '140px'
    },
    {
      key: 'createdAt',
      title: '創建時間',
      type: 'date',
      width: '140px'
    }
  ];

  // 表格操作配置
  tableActions: TableAction[] = [
    {
      type: 'view',
      title: '檢視詳情',
      icon: 'eye'
    },
    {
      type: 'edit',
      title: '編輯帳戶',
      icon: 'edit',
      visible: (item: AccountResponseDto) => item.status !== AccountStatus.CLOSED
    },
    {
      type: 'custom',
      title: '存款',
      icon: 'plus-circle',
      key: 'deposit',
      visible: (item: AccountResponseDto) => item.canPerformTransactions
    },
    {
      type: 'custom',
      title: '提款',
      icon: 'minus-circle',
      key: 'withdraw',
      visible: (item: AccountResponseDto) => item.canPerformTransactions
    },
    {
      type: 'custom',
      title: '轉帳',
      icon: 'swap',
      key: 'transfer',
      visible: (item: AccountResponseDto) => item.canPerformTransactions
    },
    {
      type: 'delete',
      title: '刪除帳戶',
      icon: 'delete',
      danger: true,
      visible: (item: AccountResponseDto) => item.status === AccountStatus.INACTIVE
    }
  ];

  // 餘額格式化器
  balanceFormatter = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(value);
  };

  ngOnInit(): void {
    this.loadAccounts();
    this.loadAccountStats();
  }

  /**
   * 載入帳戶列表
   */
  async loadAccounts(): Promise<void> {
    try {
      this.loading = true;

      // 模擬資料載入（實際應該調用服務）
      // const result = await this.accountService.getAccountsByUserId('current-user-id');
      // this.accounts = result;

      // 暫時使用模擬資料
      this.accounts = this.generateMockAccounts();
      this.paginationConfig.total = this.accounts.length;
    } catch (error) {
      this.message.error('載入帳戶列表失敗');
      console.error('Error loading accounts:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 載入帳戶統計
   */
  async loadAccountStats(): Promise<void> {
    try {
      // 計算統計資料
      this.accountStats = {
        totalAccounts: this.accounts.length,
        activeAccounts: this.accounts.filter(a => a.status === AccountStatus.ACTIVE).length,
        totalBalance: this.accounts.reduce((sum, a) => sum + a.balance, 0),
        averageBalance: this.accounts.length > 0 ? this.accounts.reduce((sum, a) => sum + a.balance, 0) / this.accounts.length : 0
      };
    } catch (error) {
      console.error('Error loading account stats:', error);
    }
  }

  /**
   * 分頁變更處理
   */
  async onPageChange(page: number): Promise<void> {
    this.paginationConfig.pageIndex = page;
    await this.loadAccounts();
  }

  /**
   * 每頁數量變更處理
   */
  async onPageSizeChange(pageSize: number): Promise<void> {
    this.paginationConfig.pageSize = pageSize;
    this.paginationConfig.pageIndex = 1;
    await this.loadAccounts();
  }

  /**
   * 檢視帳戶詳情
   */
  viewAccount(account: AccountResponseDto): void {
    this.router.navigate(['/accounts', account.id]);
  }

  /**
   * 編輯帳戶
   */
  editAccount(account: AccountResponseDto): void {
    this.router.navigate(['/accounts', account.id, 'edit']);
  }

  /**
   * 刪除帳戶
   */
  async deleteAccount(account: AccountResponseDto): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除帳戶 "${account.name}" 嗎？此操作無法復原。`,
      nzOkText: '確定刪除',
      nzCancelText: '取消',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          // await this.accountService.deleteAccount(account.id);
          this.message.success('帳戶刪除成功');
          await this.loadAccounts();
          await this.loadAccountStats();
        } catch (error) {
          this.message.error('帳戶刪除失敗');
          console.error('Error deleting account:', error);
        }
      }
    });
  }

  /**
   * 自定義操作處理
   */
  onCustomAction(event: { action: TableAction; item: AccountResponseDto }): void {
    const { action, item } = event;

    switch (action.key) {
      case 'deposit':
        this.depositToAccount(item);
        break;
      case 'withdraw':
        this.withdrawFromAccount(item);
        break;
      case 'transfer':
        this.transferFromAccount(item);
        break;
      default:
        console.warn('Unknown custom action:', action.key);
    }
  }

  /**
   * 新增帳戶
   */
  createAccount(): void {
    this.router.navigate(['/accounts/create']);
  }

  /**
   * 重新整理資料
   */
  async refreshData(): Promise<void> {
    await this.loadAccounts();
    await this.loadAccountStats();
    this.message.success('資料已重新整理');
  }

  /**
   * 匯出資料
   */
  exportData(): void {
    // 實作資料匯出功能
    this.message.info('匯出功能開發中...');
  }

  /**
   * 存款操作
   */
  private depositToAccount(account: AccountResponseDto): void {
    this.selectedAccount = account;
    this.currentTransactionType = 'deposit';
    this.transactionModalVisible = true;
  }

  /**
   * 提款操作
   */
  private withdrawFromAccount(account: AccountResponseDto): void {
    this.selectedAccount = account;
    this.currentTransactionType = 'withdraw';
    this.transactionModalVisible = true;
  }

  /**
   * 轉帳操作
   */
  private transferFromAccount(account: AccountResponseDto): void {
    this.selectedAccount = account;
    this.currentTransactionType = 'transfer';
    this.transactionModalVisible = true;
  }

  /**
   * 交易完成處理
   */
  onTransactionComplete(result: TransactionResult): void {
    if (result.success && result.updatedAccount) {
      // 更新帳戶列表中的帳戶資料
      const index = this.accounts.findIndex(acc => acc.id === result.updatedAccount!.id);
      if (index !== -1) {
        this.accounts[index] = result.updatedAccount;
      }

      // 如果是轉帳，也要更新目標帳戶
      if (result.targetAccount) {
        const targetIndex = this.accounts.findIndex(acc => acc.id === result.targetAccount!.id);
        if (targetIndex !== -1) {
          this.accounts[targetIndex] = result.targetAccount;
        }
      }

      // 重新計算統計資料
      this.loadAccountStats();
    }
  }

  /**
   * 交易取消處理
   */
  onTransactionCancel(): void {
    this.transactionModalVisible = false;
    this.selectedAccount = undefined;
    this.currentTransactionType = undefined;
  }

  /**
   * 生成模擬帳戶資料
   */
  private generateMockAccounts(): AccountResponseDto[] {
    return [
      {
        id: '1',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
        userId: 'user-1',
        accountNumber: 'ACC-001234-ABCD',
        name: '主要支票帳戶',
        type: AccountType.CHECKING,
        balance: 15000,
        formattedBalance: 'NT$15,000',
        currency: 'TWD',
        status: AccountStatus.ACTIVE,
        statusText: '啟用',
        isActive: true,
        canPerformTransactions: true,
        description: '日常使用的主要帳戶',
        lastTransactionDate: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-14T15:45:00Z',
        userId: 'user-1',
        accountNumber: 'ACC-001235-EFGH',
        name: '儲蓄帳戶',
        type: AccountType.SAVINGS,
        balance: 50000,
        formattedBalance: 'NT$50,000',
        currency: 'TWD',
        status: AccountStatus.ACTIVE,
        statusText: '啟用',
        isActive: true,
        canPerformTransactions: true,
        description: '長期儲蓄用途',
        lastTransactionDate: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-10T09:15:00Z',
        userId: 'user-1',
        accountNumber: 'ACC-001236-IJKL',
        name: '信用帳戶',
        type: AccountType.CREDIT,
        balance: -2500,
        formattedBalance: '-NT$2,500',
        currency: 'TWD',
        status: AccountStatus.ACTIVE,
        statusText: '啟用',
        isActive: true,
        canPerformTransactions: true,
        description: '信用卡相關帳戶',
        lastTransactionDate: '2024-01-10T09:15:00Z'
      }
    ];
  }
}
