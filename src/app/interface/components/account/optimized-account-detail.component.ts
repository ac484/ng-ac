/**
 * 優化的帳戶詳情組件
 * 整合 Money 值物件的顯示格式化，實作帳戶餘額的即時更新
 */

import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { Subject, takeUntil, interval } from 'rxjs';

import {
  OptimizedAccountApplicationService,
  AccountResponseDto
} from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

interface TransactionHistory {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  formattedAmount: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

@Component({
  selector: 'app-optimized-account-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzStatisticModule,
    NzSpaceModule,
    NzDividerModule,
    NzGridModule,
    NzProgressModule,
    NzTimelineModule
  ],
  template: `
    <div class="account-detail-container" *ngIf="account">
      <!-- 帳戶概覽卡片 -->
      <nz-card class="overview-card" [nzExtra]="actionsTemplate">
        <nz-row [nzGutter]="24">
          <nz-col [nzSpan]="8">
            <nz-statistic nzTitle="當前餘額" [nzValue]="account.balance" [nzValueStyle]="getBalanceStyle()">
              <ng-template #nzFormatter let-value>
                {{ balanceFormatter(value) }}
              </ng-template>
            </nz-statistic>
            <nz-progress
              [nzPercent]="getBalanceHealthPercentage()"
              [nzStrokeColor]="getBalanceHealthColor()"
              [nzShowInfo]="false"
              nzSize="small"
            >
            </nz-progress>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-statistic nzTitle="帳戶狀態" [nzValue]="account.statusText" [nzValueStyle]="getStatusStyle()"> </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-statistic nzTitle="最後更新" [nzValue]="account.updatedAt" [nzValueStyle]="{ fontSize: '16px' }">
              <ng-template #nzFormatter let-value>
                {{ value | date: 'yyyy-MM-dd HH:mm' }}
              </ng-template>
            </nz-statistic>
          </nz-col>
        </nz-row>
      </nz-card>

      <!-- 帳戶詳細資訊 -->
      <nz-card nzTitle="帳戶資訊" class="info-card">
        <nz-descriptions [nzColumn]="2" nzBordered>
          <nz-descriptions-item nzTitle="帳戶號碼">
            <code>{{ account.accountNumber }}</code>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶名稱">
            {{ account.name }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶類型">
            <nz-tag [nzColor]="getTypeColor(account.type)">
              {{ getTypeText(account.type) }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="貨幣">
            {{ account.currency }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶狀態">
            <nz-tag [nzColor]="getStatusColor(account.status)">
              {{ account.statusText }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="可執行交易">
            <nz-tag [nzColor]="account.canPerformTransactions ? 'green' : 'red'">
              {{ account.canPerformTransactions ? '是' : '否' }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="創建時間">
            {{ account.createdAt | date: 'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="最後交易時間">
            {{ account.lastTransactionDate ? (account.lastTransactionDate | date: 'yyyy-MM-dd HH:mm:ss') : '無交易記錄' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶描述" [nzSpan]="2">
            {{ account.description || '無描述' }}
          </nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <!-- 快速操作 -->
      <nz-card nzTitle="快速操作" class="actions-card" *ngIf="account.canPerformTransactions">
        <nz-space nzSize="large">
          <button nz-button nzType="primary" nzSize="large" (click)="deposit()">
            <span nz-icon nzType="plus-circle"></span>
            存款
          </button>
          <button nz-button nzType="default" nzSize="large" (click)="withdraw()">
            <span nz-icon nzType="minus-circle"></span>
            提款
          </button>
          <button nz-button nzType="default" nzSize="large" (click)="transfer()">
            <span nz-icon nzType="swap"></span>
            轉帳
          </button>
          <button nz-button nzType="default" nzSize="large" (click)="viewTransactionHistory()">
            <span nz-icon nzType="history"></span>
            交易記錄
          </button>
        </nz-space>
      </nz-card>

      <!-- 最近交易記錄 -->
      <nz-card nzTitle="最近交易" [nzExtra]="historyExtraTemplate" class="history-card">
        <nz-timeline *ngIf="recentTransactions.length > 0; else noTransactions">
          <nz-timeline-item
            *ngFor="let transaction of recentTransactions"
            [nzColor]="getTransactionColor(transaction.type)"
            [nzDot]="getTransactionIcon(transaction.type)"
          >
            <div class="transaction-item">
              <div class="transaction-header">
                <span class="transaction-type">{{ getTransactionTypeText(transaction.type) }}</span>
                <span class="transaction-amount" [class]="getTransactionAmountClass(transaction.type)">
                  {{ transaction.formattedAmount }}
                </span>
              </div>
              <div class="transaction-description">{{ transaction.description }}</div>
              <div class="transaction-time">{{ transaction.timestamp | date: 'yyyy-MM-dd HH:mm:ss' }}</div>
            </div>
          </nz-timeline-item>
        </nz-timeline>

        <ng-template #noTransactions>
          <div class="no-transactions">
            <span nz-icon nzType="inbox" nzTheme="outline" style="font-size: 48px; color: #d9d9d9;"></span>
            <p>暫無交易記錄</p>
          </div>
        </ng-template>
      </nz-card>
    </div>

    <!-- 載入中狀態 -->
    <div class="loading-container" *ngIf="!account && loading">
      <nz-card>
        <div style="text-align: center; padding: 50px;">
          <span nz-icon nzType="loading" nzSpin style="font-size: 24px;"></span>
          <p style="margin-top: 16px;">載入帳戶資料中...</p>
        </div>
      </nz-card>
    </div>

    <!-- 操作按鈕模板 -->
    <ng-template #actionsTemplate>
      <nz-space>
        <button nz-button nzType="default" (click)="editAccount()">
          <span nz-icon nzType="edit"></span>
          編輯
        </button>
        <button nz-button nzType="default" (click)="refreshData()">
          <span nz-icon nzType="reload"></span>
          重新整理
        </button>
        <button nz-button nzType="default" (click)="goBack()">
          <span nz-icon nzType="arrow-left"></span>
          返回
        </button>
      </nz-space>
    </ng-template>

    <!-- 交易記錄額外操作模板 -->
    <ng-template #historyExtraTemplate>
      <button nz-button nzType="link" (click)="viewAllTransactions()">
        查看全部
        <span nz-icon nzType="arrow-right"></span>
      </button>
    </ng-template>
  `,
  styles: [
    `
      .account-detail-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .overview-card,
      .info-card,
      .actions-card,
      .history-card {
        margin-bottom: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .overview-card .ant-statistic {
        text-align: center;
      }

      .actions-card .ant-space {
        width: 100%;
        justify-content: center;
      }

      .transaction-item {
        padding: 8px 0;
      }

      .transaction-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
      }

      .transaction-type {
        font-weight: 500;
        font-size: 14px;
      }

      .transaction-amount {
        font-weight: 600;
        font-size: 16px;
      }

      .transaction-amount.positive {
        color: #52c41a;
      }

      .transaction-amount.negative {
        color: #ff4d4f;
      }

      .transaction-description {
        color: #666;
        font-size: 12px;
        margin-bottom: 2px;
      }

      .transaction-time {
        color: #999;
        font-size: 11px;
      }

      .no-transactions {
        text-align: center;
        padding: 40px;
        color: #999;
      }

      .loading-container {
        padding: 24px;
      }

      code {
        background: #f5f5f5;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
    `
  ]
})
export class OptimizedAccountDetailComponent implements OnInit, OnDestroy {
  private readonly accountService = inject(OptimizedAccountApplicationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly destroy$ = new Subject<void>();

  account?: AccountResponseDto;
  loading = false;
  recentTransactions: TransactionHistory[] = [];
  accountId?: string;

  // 餘額格式化器
  balanceFormatter = (value: number) => {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: this.account?.currency || 'TWD'
    }).format(value);
  };

  ngOnInit(): void {
    // 獲取路由參數
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.accountId = params['id'];
      if (this.accountId) {
        this.loadAccountData();
        this.loadRecentTransactions();
        this.startAutoRefresh();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 載入帳戶資料
   */
  async loadAccountData(): Promise<void> {
    if (!this.accountId) return;

    try {
      this.loading = true;

      // 模擬載入帳戶資料
      // this.account = await this.accountService.getAccountById(this.accountId);

      // 暫時使用模擬資料
      this.account = this.generateMockAccount();
    } catch (error) {
      this.message.error('載入帳戶資料失敗');
      console.error('Error loading account data:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 載入最近交易記錄
   */
  async loadRecentTransactions(): Promise<void> {
    if (!this.accountId) return;

    try {
      // 模擬載入交易記錄
      // this.recentTransactions = await this.accountService.getRecentTransactions(this.accountId, 5);

      // 暫時使用模擬資料
      this.recentTransactions = this.generateMockTransactions();
    } catch (error) {
      console.error('Error loading recent transactions:', error);
    }
  }

  /**
   * 開始自動重新整理
   */
  private startAutoRefresh(): void {
    // 每30秒自動重新整理餘額
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAccountData();
      });
  }

  /**
   * 重新整理資料
   */
  async refreshData(): Promise<void> {
    await Promise.all([this.loadAccountData(), this.loadRecentTransactions()]);
    this.message.success('資料已重新整理');
  }

  /**
   * 編輯帳戶
   */
  editAccount(): void {
    this.router.navigate(['/accounts', this.accountId, 'edit']);
  }

  /**
   * 返回列表
   */
  goBack(): void {
    this.router.navigate(['/accounts']);
  }

  /**
   * 存款操作
   */
  deposit(): void {
    this.message.info('存款功能開發中...');
    // TODO: 實作存款對話框
  }

  /**
   * 提款操作
   */
  withdraw(): void {
    this.message.info('提款功能開發中...');
    // TODO: 實作提款對話框
  }

  /**
   * 轉帳操作
   */
  transfer(): void {
    this.message.info('轉帳功能開發中...');
    // TODO: 實作轉帳對話框
  }

  /**
   * 查看交易記錄
   */
  viewTransactionHistory(): void {
    this.router.navigate(['/accounts', this.accountId, 'transactions']);
  }

  /**
   * 查看所有交易
   */
  viewAllTransactions(): void {
    this.viewTransactionHistory();
  }

  /**
   * 取得餘額樣式
   */
  getBalanceStyle(): any {
    const isNegative = this.account && this.account.balance < 0;
    return {
      color: isNegative ? '#ff4d4f' : '#52c41a',
      fontSize: '28px',
      fontWeight: 'bold'
    };
  }

  /**
   * 取得狀態樣式
   */
  getStatusStyle(): any {
    const color = this.getStatusColor(this.account?.status || '');
    return {
      color: this.getStatusColorHex(color),
      fontSize: '18px',
      fontWeight: '500'
    };
  }

  /**
   * 取得餘額健康度百分比
   */
  getBalanceHealthPercentage(): number {
    if (!this.account) return 0;

    // 簡單的健康度計算邏輯
    if (this.account.balance < 0) return 0;
    if (this.account.balance < 1000) return 25;
    if (this.account.balance < 10000) return 50;
    if (this.account.balance < 50000) return 75;
    return 100;
  }

  /**
   * 取得餘額健康度顏色
   */
  getBalanceHealthColor(): string {
    const percentage = this.getBalanceHealthPercentage();
    if (percentage <= 25) return '#ff4d4f';
    if (percentage <= 50) return '#faad14';
    if (percentage <= 75) return '#52c41a';
    return '#1890ff';
  }

  /**
   * 取得帳戶類型顏色
   */
  getTypeColor(type: AccountType): string {
    switch (type) {
      case AccountType.CHECKING:
        return 'blue';
      case AccountType.SAVINGS:
        return 'green';
      case AccountType.CREDIT:
        return 'orange';
      default:
        return 'default';
    }
  }

  /**
   * 取得帳戶類型文字
   */
  getTypeText(type: AccountType): string {
    switch (type) {
      case AccountType.CHECKING:
        return '支票帳戶';
      case AccountType.SAVINGS:
        return '儲蓄帳戶';
      case AccountType.CREDIT:
        return '信用帳戶';
      default:
        return '未知類型';
    }
  }

  /**
   * 取得狀態顏色
   */
  getStatusColor(status: AccountStatus | string): string {
    switch (status) {
      case AccountStatus.ACTIVE:
        return 'green';
      case AccountStatus.INACTIVE:
        return 'red';
      case AccountStatus.SUSPENDED:
        return 'orange';
      case AccountStatus.CLOSED:
        return 'red';
      default:
        return 'default';
    }
  }

  /**
   * 取得狀態顏色十六進制值
   */
  private getStatusColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
      green: '#52c41a',
      red: '#ff4d4f',
      orange: '#faad14',
      default: '#666666'
    };
    return colorMap[colorName] || '#666666';
  }

  /**
   * 取得交易類型顏色
   */
  getTransactionColor(type: string): string {
    switch (type) {
      case 'deposit':
        return 'green';
      case 'withdrawal':
        return 'red';
      case 'transfer':
        return 'blue';
      default:
        return 'default';
    }
  }

  /**
   * 取得交易圖示
   */
  getTransactionIcon(type: string): any {
    const iconMap: Record<string, string> = {
      deposit: 'plus-circle',
      withdrawal: 'minus-circle',
      transfer: 'swap'
    };

    return {
      template: `<span nz-icon nzType="${iconMap[type] || 'question-circle'}"></span>`
    };
  }

  /**
   * 取得交易類型文字
   */
  getTransactionTypeText(type: string): string {
    switch (type) {
      case 'deposit':
        return '存款';
      case 'withdrawal':
        return '提款';
      case 'transfer':
        return '轉帳';
      default:
        return '未知';
    }
  }

  /**
   * 取得交易金額樣式類別
   */
  getTransactionAmountClass(type: string): string {
    return type === 'deposit' ? 'positive' : 'negative';
  }

  /**
   * 生成模擬帳戶資料
   */
  private generateMockAccount(): AccountResponseDto {
    return {
      id: this.accountId!,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(), // 使用當前時間模擬即時更新
      userId: 'user-1',
      accountNumber: 'ACC-001234-ABCD',
      name: '主要支票帳戶',
      type: AccountType.CHECKING,
      balance: 15000 + Math.floor(Math.random() * 1000), // 模擬餘額變化
      formattedBalance: 'NT$15,000',
      currency: 'TWD',
      status: AccountStatus.ACTIVE,
      statusText: '啟用',
      isActive: true,
      canPerformTransactions: true,
      description: '日常使用的主要帳戶，支援所有交易類型',
      lastTransactionDate: new Date().toISOString()
    };
  }

  /**
   * 生成模擬交易記錄
   */
  private generateMockTransactions(): TransactionHistory[] {
    return [
      {
        id: '1',
        type: 'deposit',
        amount: 5000,
        formattedAmount: '+NT$5,000',
        description: '薪資入帳',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed'
      },
      {
        id: '2',
        type: 'withdrawal',
        amount: 2000,
        formattedAmount: '-NT$2,000',
        description: 'ATM提款',
        timestamp: '2024-01-14T15:45:00Z',
        status: 'completed'
      },
      {
        id: '3',
        type: 'transfer',
        amount: 1500,
        formattedAmount: '-NT$1,500',
        description: '轉帳至儲蓄帳戶',
        timestamp: '2024-01-13T09:15:00Z',
        status: 'completed'
      }
    ];
  }
}
