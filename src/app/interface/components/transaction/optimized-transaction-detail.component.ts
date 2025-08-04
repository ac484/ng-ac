/**
 * 優化的交易詳情組件
 * 整合交易狀態的視覺化呈現，實作交易歷史的進階篩選
 */

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzAlertModule } from 'ng-zorro-antd/alert';

import {
  OptimizedTransactionApplicationService,
  TransactionResponseDto,
  ProcessTransactionDto
} from '../../../application/services/optimized-transaction-application.service';
import { TransactionType, TransactionStatus } from '../../../domain/entities/optimized-transaction.entity';

interface TransactionStatusHistory {
  status: TransactionStatus;
  timestamp: string;
  reason?: string;
  operator?: string;
}

@Component({
  selector: 'app-optimized-transaction-detail',
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
    NzStepsModule,
    NzTimelineModule,
    NzAlertModule
  ],
  template: `
    <div class="transaction-detail-container" *ngIf="transaction">
      <!-- 交易概覽卡片 -->
      <nz-card class="overview-card" [nzExtra]="actionsTemplate">
        <nz-row [nzGutter]="24">
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="交易金額"
              [nzValue]="transaction.amount"
              [nzValueStyle]="getAmountStyle()">
              <ng-template #nzFormatter let-value>
                {{ formatCurrency(value, transaction.currency) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="總金額"
              [nzValue]="transaction.totalAmount"
              [nzValueStyle]="getTotalAmountStyle()">
              <ng-template #nzFormatter let-value>
                {{ formatCurrency(value, transaction.currency) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="交易狀態"
              [nzValue]="getStatusText(transaction.status)"
              [nzValueStyle]="getStatusStyle()">
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="創建時間"
              [nzValue]="transaction.createdAt"
              [nzValueStyle]="{ fontSize: '16px' }">
              <ng-template #nzFormatter let-value>
                {{ value | date:'yyyy-MM-dd HH:mm:ss' }}
              </ng-template>
            </nz-statistic>
          </nz-col>
        </nz-row>
      </nz-card>

      <!-- 狀態警告 -->
      <nz-alert
        *ngIf="transaction.status === TransactionStatus.FAILED"
        nzType="error"
        nzMessage="交易失敗"
        [nzDescription]="getFailureReason()"
        nzShowIcon
        class="status-alert">
      </nz-alert>

      <nz-alert
        *ngIf="transaction.status === TransactionStatus.CANCELLED"
        nzType="warning"
        nzMessage="交易已取消"
        [nzDescription]="getCancellationReason()"
        nzShowIcon
        class="status-alert">
      </nz-alert>

      <!-- 交易詳細資訊 -->
      <nz-card nzTitle="交易資訊" class="info-card">
        <nz-descriptions [nzColumn]="2" nzBordered>
          <nz-descriptions-item nzTitle="交易編號">
            <code>{{ transaction.transactionNumber }}</code>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易類型">
            <nz-tag [nzColor]="getTypeColor(transaction.transactionType)">
              {{ getTypeText(transaction.transactionType) }}
            </nz-tag>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="帳戶 ID">
            {{ transaction.accountId }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="用戶 ID">
            {{ transaction.userId }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="交易金額">
            {{ formatCurrency(transaction.amount, transaction.currency) }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="手續費" *ngIf="transaction.fees">
            {{ formatCurrency(transaction.fees, transaction.currency) }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="總金額">
            <strong>{{ formatCurrency(transaction.totalAmount, transaction.currency) }}</strong>
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="貨幣">
            {{ transaction.currency }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="分類" *ngIf="transaction.category">
            {{ transaction.category }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="參考編號" *ngIf="transaction.referenceNumber">
            {{ transaction.referenceNumber }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="創建時間">
            {{ transaction.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="最後更新">
            {{ transaction.updatedAt | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="描述" [nzSpan]="2">
            {{ transaction.description }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="備註" [nzSpan]="2" *ngIf="transaction.notes">
            {{ transaction.notes }}
          </nz-descriptions-item>
        </nz-descriptions>
      </nz-card>

      <!-- 交易狀態流程 -->
      <nz-card nzTitle="交易流程" class="process-card">
        <nz-steps [nzCurrent]="getCurrentStep()" nzStatus="process">
          <nz-step nzTitle="創建" nzDescription="交易已創建"></nz-step>
          <nz-step nzTitle="處理中" nzDescription="正在處理交易"></nz-step>
          <nz-step 
            [nzTitle]="getFinalStepTitle()" 
            [nzDescription]="getFinalStepDescription()"
            [nzStatus]="getFinalStepStatus()">
          </nz-step>
        </nz-steps>
      </nz-card>

      <!-- 狀態歷史 -->
      <nz-card nzTitle="狀態歷史" class="history-card">
        <nz-timeline>
          <nz-timeline-item
            *ngFor="let history of statusHistory"
            [nzColor]="getHistoryColor(history.status)"
            [nzDot]="getHistoryIcon(history.status)">
            <div class="history-item">
              <div class="history-header">
                <span class="history-status">{{ getStatusText(history.status) }}</span>
                <span class="history-time">{{ history.timestamp | date:'yyyy-MM-dd HH:mm:ss' }}</span>
              </div>
              <div class="history-reason" *ngIf="history.reason">{{ history.reason }}</div>
              <div class="history-operator" *ngIf="history.operator">操作者: {{ history.operator }}</div>
            </div>
          </nz-timeline-item>
        </nz-timeline>
      </nz-card>

      <!-- 快速操作 -->
      <nz-card nzTitle="快速操作" class="actions-card" *ngIf="canPerformActions()">
        <nz-space nzSize="large">
          <button 
            nz-button 
            nzType="primary" 
            nzSize="large" 
            (click)="processTransaction()"
            *ngIf="transaction.status === TransactionStatus.PENDING">
            <span nz-icon nzType="play-circle"></span>
            處理交易
          </button>
          <button 
            nz-button 
            nzType="primary" 
            nzSize="large" 
            (click)="completeTransaction()"
            *ngIf="transaction.status === TransactionStatus.PROCESSING">
            <span nz-icon nzType="check-circle"></span>
            完成交易
          </button>
          <button 
            nz-button 
            nzType="primary" 
            nzDanger 
            nzSize="large" 
            (click)="failTransaction()"
            *ngIf="canFail()">
            <span nz-icon nzType="close-circle"></span>
            標記失敗
          </button>
          <button 
            nz-button 
            nzType="default" 
            nzSize="large" 
            (click)="retryTransaction()"
            *ngIf="transaction.status === TransactionStatus.FAILED">
            <span nz-icon nzType="reload"></span>
            重試交易
          </button>
          <button 
            nz-button 
            nzType="default" 
            nzSize="large" 
            (click)="cancelTransaction()"
            *ngIf="canCancel()">
            <span nz-icon nzType="stop"></span>
            取消交易
          </button>
        </nz-space>
      </nz-card>
    </div>

    <!-- 載入中狀態 -->
    <div class="loading-container" *ngIf="!transaction && loading">
      <nz-card>
        <div style="text-align: center; padding: 50px;">
          <span nz-icon nzType="loading" nzSpin style="font-size: 24px;"></span>
          <p style="margin-top: 16px;">載入交易資料中...</p>
        </div>
      </nz-card>
    </div>

    <!-- 操作按鈕模板 -->
    <ng-template #actionsTemplate>
      <nz-space>
        <button nz-button nzType="default" (click)="editTransaction()" *ngIf="canEdit()">
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
  `,
  styles: [`
    .transaction-detail-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .overview-card,
    .info-card,
    .process-card,
    .history-card,
    .actions-card {
      margin-bottom: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .status-alert {
      margin-bottom: 16px;
    }

    .overview-card .ant-statistic {
      text-align: center;
    }

    .actions-card .ant-space {
      width: 100%;
      justify-content: center;
    }

    .history-item {
      padding: 8px 0;
    }

    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .history-status {
      font-weight: 500;
      font-size: 14px;
    }

    .history-time {
      color: #999;
      font-size: 12px;
    }

    .history-reason {
      color: #666;
      font-size: 12px;
      margin-bottom: 2px;
    }

    .history-operator {
      color: #999;
      font-size: 11px;
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
  `]
})
export class OptimizedTransactionDetailComponent implements OnInit, OnDestroy {
  private readonly transactionService = inject(OptimizedTransactionApplicationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly destroy$ = new Subject<void>();

  transaction?: TransactionResponseDto;
  loading = false;
  transactionId?: string;
  statusHistory: TransactionStatusHistory[] = [];

  // 枚舉引用
  readonly TransactionType = TransactionType;
  readonly TransactionStatus = TransactionStatus;

  ngOnInit(): void {
    // 獲取路由參數
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.transactionId = params['id'];
      if (this.transactionId) {
        this.loadTransactionData();
        this.loadStatusHistory();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 載入交易資料
   */
  async loadTransactionData(): Promise<void> {
    if (!this.transactionId) return;

    try {
      this.loading = true;
      const result = await this.transactionService.getById(this.transactionId);
      this.transaction = result || undefined;
    } catch (error) {
      this.message.error('載入交易資料失敗');
      console.error('Error loading transaction data:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 載入狀態歷史
   */
  async loadStatusHistory(): Promise<void> {
    if (!this.transactionId) return;

    try {
      // 模擬狀態歷史資料
      this.statusHistory = this.generateMockStatusHistory();
    } catch (error) {
      console.error('Error loading status history:', error);
    }
  }
  /**
    * 重新整理資料
    */
  async refreshData(): Promise<void> {
    await Promise.all([
      this.loadTransactionData(),
      this.loadStatusHistory()
    ]);
    this.message.success('資料已重新整理');
  }

  /**
   * 編輯交易
   */
  editTransaction(): void {
    this.router.navigate(['/transactions', this.transactionId, 'edit']);
  }

  /**
   * 返回列表
   */
  goBack(): void {
    this.router.navigate(['/transactions']);
  }

  /**
   * 處理交易
   */
  async processTransaction(): Promise<void> {
    if (!this.transaction) return;

    try {
      const dto: ProcessTransactionDto = { action: 'process' };
      await this.transactionService.processTransaction(this.transaction.id, dto);
      this.message.success('交易處理成功');
      await this.refreshData();
    } catch (error) {
      this.message.error('交易處理失敗');
      console.error('Error processing transaction:', error);
    }
  }

  /**
   * 完成交易
   */
  async completeTransaction(): Promise<void> {
    if (!this.transaction) return;

    try {
      const dto: ProcessTransactionDto = { action: 'complete' };
      await this.transactionService.processTransaction(this.transaction.id, dto);
      this.message.success('交易完成成功');
      await this.refreshData();
    } catch (error) {
      this.message.error('交易完成失敗');
      console.error('Error completing transaction:', error);
    }
  }

  /**
   * 交易失敗
   */
  async failTransaction(): Promise<void> {
    if (!this.transaction) return;

    this.modal.confirm({
      nzTitle: '確認標記失敗',
      nzContent: `確定要將交易 "${this.transaction.transactionNumber}" 標記為失敗嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const dto: ProcessTransactionDto = {
            action: 'fail',
            reason: '手動標記失敗'
          };
          await this.transactionService.processTransaction(this.transaction!.id, dto);
          this.message.success('交易已標記為失敗');
          await this.refreshData();
        } catch (error) {
          this.message.error('標記失敗操作失敗');
          console.error('Error failing transaction:', error);
        }
      }
    });
  }

  /**
   * 重試交易
   */
  async retryTransaction(): Promise<void> {
    if (!this.transaction) return;

    try {
      const dto: ProcessTransactionDto = { action: 'retry' };
      await this.transactionService.processTransaction(this.transaction.id, dto);
      this.message.success('交易重試成功');
      await this.refreshData();
    } catch (error) {
      this.message.error('交易重試失敗');
      console.error('Error retrying transaction:', error);
    }
  }

  /**
   * 取消交易
   */
  async cancelTransaction(): Promise<void> {
    if (!this.transaction) return;

    this.modal.confirm({
      nzTitle: '確認取消交易',
      nzContent: `確定要取消交易 "${this.transaction.transactionNumber}" 嗎？`,
      nzOkText: '確定取消',
      nzCancelText: '保留',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const dto: ProcessTransactionDto = {
            action: 'cancel',
            reason: '用戶手動取消'
          };
          await this.transactionService.processTransaction(this.transaction!.id, dto);
          this.message.success('交易已取消');
          await this.refreshData();
        } catch (error) {
          this.message.error('取消交易失敗');
          console.error('Error cancelling transaction:', error);
        }
      }
    });
  }

  // Style and status related methods

  /**
   * 取得金額樣式
   */
  getAmountStyle(): any {
    if (!this.transaction) return {};

    const isNegative = this.transaction.transactionType === TransactionType.WITHDRAWAL;
    return {
      color: isNegative ? '#ff4d4f' : '#52c41a',
      fontSize: '24px',
      fontWeight: 'bold'
    };
  }

  /**
   * 取得總金額樣式
   */
  getTotalAmountStyle(): any {
    if (!this.transaction) return {};

    const isNegative = this.transaction.transactionType === TransactionType.WITHDRAWAL;
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
    if (!this.transaction) return {};

    const color = this.getStatusColor(this.transaction.status);
    return {
      color: this.getStatusColorHex(color),
      fontSize: '18px',
      fontWeight: '500'
    };
  }

  /**
   * 取得交易類型顏色
   */
  getTypeColor(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'green';
      case TransactionType.WITHDRAWAL: return 'red';
      case TransactionType.TRANSFER: return 'blue';
      case TransactionType.PAYMENT: return 'orange';
      case TransactionType.REFUND: return 'purple';
      case TransactionType.FEE: return 'gray';
      default: return 'default';
    }
  }

  /**
   * 取得交易類型文字
   */
  getTypeText(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return '存款';
      case TransactionType.WITHDRAWAL: return '提款';
      case TransactionType.TRANSFER: return '轉帳';
      case TransactionType.PAYMENT: return '付款';
      case TransactionType.REFUND: return '退款';
      case TransactionType.FEE: return '手續費';
      default: return '未知類型';
    }
  }

  /**
   * 取得狀態顏色
   */
  getStatusColor(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.PENDING: return 'orange';
      case TransactionStatus.PROCESSING: return 'blue';
      case TransactionStatus.COMPLETED: return 'green';
      case TransactionStatus.FAILED: return 'red';
      case TransactionStatus.CANCELLED: return 'gray';
      default: return 'default';
    }
  }

  /**
   * 取得狀態文字
   */
  getStatusText(status: TransactionStatus): string {
    switch (status) {
      case TransactionStatus.PENDING: return '待處理';
      case TransactionStatus.PROCESSING: return '處理中';
      case TransactionStatus.COMPLETED: return '已完成';
      case TransactionStatus.FAILED: return '失敗';
      case TransactionStatus.CANCELLED: return '已取消';
      default: return '未知狀態';
    }
  }

  /**
   * 取得狀態顏色十六進制值
   */
  private getStatusColorHex(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'green': '#52c41a',
      'red': '#ff4d4f',
      'orange': '#faad14',
      'blue': '#1890ff',
      'purple': '#722ed1',
      'gray': '#8c8c8c',
      'default': '#666666'
    };
    return colorMap[colorName] || '#666666';
  }

  // Process and history related methods

  /**
   * 取得當前步驟
   */
  getCurrentStep(): number {
    if (!this.transaction) return 0;

    switch (this.transaction.status) {
      case TransactionStatus.PENDING: return 0;
      case TransactionStatus.PROCESSING: return 1;
      case TransactionStatus.COMPLETED:
      case TransactionStatus.FAILED:
      case TransactionStatus.CANCELLED: return 2;
      default: return 0;
    }
  }

  /**
   * 取得最終步驟標題
   */
  getFinalStepTitle(): string {
    if (!this.transaction) return '完成';

    switch (this.transaction.status) {
      case TransactionStatus.COMPLETED: return '完成';
      case TransactionStatus.FAILED: return '失敗';
      case TransactionStatus.CANCELLED: return '取消';
      default: return '完成';
    }
  }

  /**
   * 取得最終步驟描述
   */
  getFinalStepDescription(): string {
    if (!this.transaction) return '交易已完成';

    switch (this.transaction.status) {
      case TransactionStatus.COMPLETED: return '交易已完成';
      case TransactionStatus.FAILED: return '交易處理失敗';
      case TransactionStatus.CANCELLED: return '交易已取消';
      default: return '等待完成';
    }
  }

  /**
   * 取得最終步驟狀態
   */
  getFinalStepStatus(): string {
    if (!this.transaction) return 'wait';

    switch (this.transaction.status) {
      case TransactionStatus.COMPLETED: return 'finish';
      case TransactionStatus.FAILED: return 'error';
      case TransactionStatus.CANCELLED: return 'error';
      default: return 'wait';
    }
  }

  /**
   * 取得歷史顏色
   */
  getHistoryColor(status: TransactionStatus): string {
    return this.getStatusColor(status);
  }

  /**
   * 取得歷史圖示
   */
  getHistoryIcon(status: TransactionStatus): any {
    const iconMap: { [key: string]: string } = {
      [TransactionStatus.PENDING]: 'clock-circle',
      [TransactionStatus.PROCESSING]: 'loading',
      [TransactionStatus.COMPLETED]: 'check-circle',
      [TransactionStatus.FAILED]: 'close-circle',
      [TransactionStatus.CANCELLED]: 'stop'
    };

    return {
      template: `<span nz-icon nzType="${iconMap[status] || 'question-circle'}"></span>`
    };
  }

  // 權限檢查方法

  /**
   * 是否可以執行操作
   */
  canPerformActions(): boolean {
    return this.transaction?.status !== TransactionStatus.COMPLETED;
  }

  /**
   * 是否可以編輯
   */
  canEdit(): boolean {
    return this.transaction?.status !== TransactionStatus.COMPLETED;
  }

  /**
   * 是否可以標記失敗
   */
  canFail(): boolean {
    return this.transaction?.status === TransactionStatus.PENDING ||
      this.transaction?.status === TransactionStatus.PROCESSING;
  }

  /**
   * 是否可以取消
   */
  canCancel(): boolean {
    return this.transaction?.status === TransactionStatus.PENDING;
  }

  // 輔助方法

  /**
   * 取得失敗原因
   */
  getFailureReason(): string {
    if (!this.transaction?.notes) return '未知原因';

    const match = this.transaction.notes.match(/失敗原因:\s*(.+?)(?:\s-|$)/);
    return match ? match[1] : '未知原因';
  }

  /**
   * 取得取消原因
   */
  getCancellationReason(): string {
    if (!this.transaction?.notes) return '未知原因';

    const match = this.transaction.notes.match(/取消原因:\s*(.+?)(?:\s-|$)/);
    return match ? match[1] : '未知原因';
  }

  /**
   * 格式化貨幣
   */
  formatCurrency(value: number, currency: string = 'TWD'): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: currency
    }).format(value);
  }

  /**
   * 生成模擬狀態歷史
   */
  private generateMockStatusHistory(): TransactionStatusHistory[] {
    if (!this.transaction) return [];

    const history: TransactionStatusHistory[] = [
      {
        status: TransactionStatus.PENDING,
        timestamp: this.transaction.createdAt,
        operator: 'System'
      }
    ];

    if (this.transaction.status !== TransactionStatus.PENDING) {
      history.push({
        status: TransactionStatus.PROCESSING,
        timestamp: new Date(Date.now() - 60000).toISOString(),
        operator: 'System'
      });
    }

    if (this.transaction.status === TransactionStatus.COMPLETED) {
      history.push({
        status: TransactionStatus.COMPLETED,
        timestamp: this.transaction.updatedAt,
        operator: 'System'
      });
    } else if (this.transaction.status === TransactionStatus.FAILED) {
      history.push({
        status: TransactionStatus.FAILED,
        timestamp: this.transaction.updatedAt,
        reason: this.getFailureReason(),
        operator: 'Admin'
      });
    } else if (this.transaction.status === TransactionStatus.CANCELLED) {
      history.push({
        status: TransactionStatus.CANCELLED,
        timestamp: this.transaction.updatedAt,
        reason: this.getCancellationReason(),
        operator: 'User'
      });
    }

    return history.reverse(); // 最新的在前面
  }
}