/**
 * 優化的交易列表組件
 * 使用通用組件重構交易列表和表單，整合交易狀態的視覺化呈現
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ModalService } from '../../services/modal.service';
import { FormModalComponent, FormModalData } from '../shared/modal-templates/form-modal.component';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';

import { DataTableComponent } from '../shared/data-table/data-table.component';
import { TableColumn, TableAction, PaginationConfig } from '../shared/data-table/table-column.interface';
import {
  OptimizedTransactionApplicationService,
  TransactionResponseDto,
  CreateTransactionDto,
  TransactionSearchCriteriaDto,
  TransactionStatsDto
} from '../../../application/services/optimized-transaction-application.service';
import { TransactionType, TransactionStatus } from '../../../domain/entities/optimized-transaction.entity';

@Component({
  selector: 'app-optimized-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzStatisticModule,
    NzSpaceModule,
    NzGridModule,
    NzTagModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputModule,
    NzInputNumberModule,
    NzFormModule,
    NzModalModule,
    DataTableComponent
  ],
  template: `
    <div class="transaction-list-container">
      <!-- 統計卡片 -->
      <nz-card class="stats-card" nzTitle="交易統計">
        <nz-row [nzGutter]="16">
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="總交易數"
              [nzValue]="transactionStats.totalCount"
              [nzValueStyle]="{ color: '#3f8600' }">
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="已完成"
              [nzValue]="transactionStats.completedCount"
              [nzValueStyle]="{ color: '#1890ff' }">
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="總金額"
              [nzValue]="transactionStats.totalAmount"
              [nzValueStyle]="{ color: '#722ed1' }">
              <ng-template #nzFormatter let-value>
                {{ formatCurrency(value) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
          <nz-col [nzSpan]="6">
            <nz-statistic
              nzTitle="平均金額"
              [nzValue]="transactionStats.averageAmount"
              [nzValueStyle]="{ color: '#eb2f96' }">
              <ng-template #nzFormatter let-value>
                {{ formatCurrency(value) }}
              </ng-template>
            </nz-statistic>
          </nz-col>
        </nz-row>
      </nz-card>

      <!-- 搜尋和操作區域 -->
      <nz-card class="search-card" nzTitle="搜尋條件">
        <form nz-form [formGroup]="searchForm" (ngSubmit)="onSearch()">
          <nz-row [nzGutter]="16">
            <nz-col [nzSpan]="6">
              <nz-form-item>
                <nz-form-label>交易類型</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="transactionType" nzPlaceHolder="選擇交易類型" nzAllowClear>
                    <nz-option [nzValue]="TransactionType.DEPOSIT" nzLabel="存款"></nz-option>
                    <nz-option [nzValue]="TransactionType.WITHDRAWAL" nzLabel="提款"></nz-option>
                    <nz-option [nzValue]="TransactionType.TRANSFER" nzLabel="轉帳"></nz-option>
                    <nz-option [nzValue]="TransactionType.PAYMENT" nzLabel="付款"></nz-option>
                    <nz-option [nzValue]="TransactionType.REFUND" nzLabel="退款"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzSpan]="6">
              <nz-form-item>
                <nz-form-label>狀態</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="status" nzPlaceHolder="選擇狀態" nzAllowClear>
                    <nz-option [nzValue]="TransactionStatus.PENDING" nzLabel="待處理"></nz-option>
                    <nz-option [nzValue]="TransactionStatus.PROCESSING" nzLabel="處理中"></nz-option>
                    <nz-option [nzValue]="TransactionStatus.COMPLETED" nzLabel="已完成"></nz-option>
                    <nz-option [nzValue]="TransactionStatus.FAILED" nzLabel="失敗"></nz-option>
                    <nz-option [nzValue]="TransactionStatus.CANCELLED" nzLabel="已取消"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzSpan]="6">
              <nz-form-item>
                <nz-form-label>開始日期</nz-form-label>
                <nz-form-control>
                  <nz-date-picker formControlName="startDate" nzPlaceHolder="選擇開始日期"></nz-date-picker>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzSpan]="6">
              <nz-form-item>
                <nz-form-label>結束日期</nz-form-label>
                <nz-form-control>
                  <nz-date-picker formControlName="endDate" nzPlaceHolder="選擇結束日期"></nz-date-picker>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
          </nz-row>
          <nz-row [nzGutter]="16">
            <nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>關鍵字</nz-form-label>
                <nz-form-control>
                  <input nz-input formControlName="keyword" placeholder="搜尋交易編號、描述或參考編號">
                </nz-form-control>
              </nz-form-item>
            </nz-col>
            <nz-col [nzSpan]="16">
              <nz-form-item>
                <nz-form-control>
                  <nz-space>
                    <button nz-button nzType="primary" [nzLoading]="loading">
                      <span nz-icon nzType="search"></span>
                      搜尋
                    </button>
                    <button nz-button type="button" (click)="resetSearch()">
                      <span nz-icon nzType="reload"></span>
                      重置
                    </button>
                    <button nz-button nzType="default" (click)="createTransaction()">
                      <span nz-icon nzType="plus"></span>
                      新增交易
                    </button>
                    <button nz-button nzType="default" (click)="exportData()">
                      <span nz-icon nzType="download"></span>
                      匯出資料
                    </button>
                  </nz-space>
                </nz-form-control>
              </nz-form-item>
            </nz-col>
          </nz-row>
        </form>
      </nz-card>

      <!-- 交易列表 -->
      <nz-card nzTitle="交易列表">
        <app-data-table
          [data]="transactions"
          [columns]="tableColumns"
          [actions]="tableActions"
          [loading]="loading"
          [pagination]="paginationConfig"
          [size]="'middle'"
          [bordered]="true"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
          (view)="viewTransaction($event)"
          (edit)="editTransaction($event)"
          (delete)="deleteTransaction($event)"
          (customAction)="onCustomAction($event)">
        </app-data-table>
      </nz-card>

      <!-- 移除不再需要的表單模態框，現在使用統一的模態框服務 -->
    </div>
  `,
  styles: [`
    .transaction-list-container {
      padding: 24px;
    }

    .stats-card,
    .search-card {
      margin-bottom: 16px;
    }

    .stats-card .ant-statistic {
      text-align: center;
    }

    nz-card {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .search-card .ant-form-item {
      margin-bottom: 16px;
    }
  `]
})
export class OptimizedTransactionListComponent implements OnInit {
  private readonly transactionService = inject(OptimizedTransactionApplicationService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);

  // 資料屬性
  transactions: TransactionResponseDto[] = [];
  loading = false;

  // 搜尋表單
  searchForm: FormGroup;

  // 移除不再需要的交易表單

  // 統計資料
  transactionStats: TransactionStatsDto = {
    totalCount: 0,
    totalAmount: 0,
    byStatus: {} as Record<TransactionStatus, number>,
    byType: {} as Record<TransactionType, number>,
    averageAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    processingCount: 0,
    failedCount: 0,
    cancelledCount: 0
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

  // 枚舉引用
  readonly TransactionType = TransactionType;
  readonly TransactionStatus = TransactionStatus;

  constructor() {
    this.searchForm = this.fb.group({
      transactionType: [null],
      status: [null],
      startDate: [null],
      endDate: [null],
      keyword: ['']
    });

    // 移除不再需要的表單初始化
  }

  ngOnInit(): void {
    this.loadTransactions();
    this.loadTransactionStats();
  }
  // 表格欄位配置
  tableColumns: TableColumn[] = [
    {
      key: 'transactionNumber',
      title: '交易編號',
      type: 'text',
      width: '140px',
      sortable: true
    },
    {
      key: 'transactionType',
      title: '交易類型',
      type: 'status',
      width: '100px',
      statusColors: {
        [TransactionType.DEPOSIT]: 'green',
        [TransactionType.WITHDRAWAL]: 'red',
        [TransactionType.TRANSFER]: 'blue',
        [TransactionType.PAYMENT]: 'orange',
        [TransactionType.REFUND]: 'purple',
        [TransactionType.FEE]: 'gray'
      },
      statusTexts: {
        [TransactionType.DEPOSIT]: '存款',
        [TransactionType.WITHDRAWAL]: '提款',
        [TransactionType.TRANSFER]: '轉帳',
        [TransactionType.PAYMENT]: '付款',
        [TransactionType.REFUND]: '退款',
        [TransactionType.FEE]: '手續費'
      }
    },
    {
      key: 'amount',
      title: '金額',
      type: 'currency',
      width: '120px',
      align: 'right',
      sortable: true
    },
    {
      key: 'totalAmount',
      title: '總金額',
      type: 'currency',
      width: '120px',
      align: 'right',
      sortable: true
    },
    {
      key: 'status',
      title: '狀態',
      type: 'status',
      width: '100px',
      statusColors: {
        [TransactionStatus.PENDING]: 'orange',
        [TransactionStatus.PROCESSING]: 'blue',
        [TransactionStatus.COMPLETED]: 'green',
        [TransactionStatus.FAILED]: 'red',
        [TransactionStatus.CANCELLED]: 'gray'
      },
      statusTexts: {
        [TransactionStatus.PENDING]: '待處理',
        [TransactionStatus.PROCESSING]: '處理中',
        [TransactionStatus.COMPLETED]: '已完成',
        [TransactionStatus.FAILED]: '失敗',
        [TransactionStatus.CANCELLED]: '已取消'
      }
    },
    {
      key: 'description',
      title: '描述',
      type: 'text',
      formatter: (value: string) => {
        return value.length > 30 ? `${value.substring(0, 30)}...` : value;
      }
    },
    {
      key: 'category',
      title: '分類',
      type: 'text',
      width: '100px'
    },
    {
      key: 'createdAt',
      title: '創建時間',
      type: 'date',
      width: '140px',
      sortable: true
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
      title: '編輯交易',
      icon: 'edit',
      visible: (item: TransactionResponseDto) => item.status !== TransactionStatus.COMPLETED
    },
    {
      type: 'custom',
      title: '處理',
      icon: 'play-circle',
      key: 'process',
      visible: (item: TransactionResponseDto) => item.status === TransactionStatus.PENDING
    },
    {
      type: 'custom',
      title: '完成',
      icon: 'check-circle',
      key: 'complete',
      visible: (item: TransactionResponseDto) => item.status === TransactionStatus.PROCESSING
    },
    {
      type: 'custom',
      title: '失敗',
      icon: 'close-circle',
      key: 'fail',
      danger: true,
      visible: (item: TransactionResponseDto) =>
        item.status === TransactionStatus.PENDING || item.status === TransactionStatus.PROCESSING
    },
    {
      type: 'custom',
      title: '重試',
      icon: 'reload',
      key: 'retry',
      visible: (item: TransactionResponseDto) => item.status === TransactionStatus.FAILED
    },
    {
      type: 'delete',
      title: '刪除交易',
      icon: 'delete',
      danger: true,
      visible: (item: TransactionResponseDto) =>
        item.status === TransactionStatus.PENDING || item.status === TransactionStatus.FAILED
    }
  ];



  /**
   * 載入交易列表
   */
  async loadTransactions(): Promise<void> {
    try {
      this.loading = true;

      const searchCriteria = this.buildSearchCriteria();
      const result = await this.transactionService.getList(searchCriteria);

      this.transactions = result.items;
      this.paginationConfig.total = result.total;

    } catch (error) {
      this.message.error('載入交易列表失敗');
      console.error('Error loading transactions:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * 載入交易統計
   */
  async loadTransactionStats(): Promise<void> {
    try {
      const searchCriteria = this.buildSearchCriteria();
      this.transactionStats = await this.transactionService.getStatistics(searchCriteria);
    } catch (error) {
      console.error('Error loading transaction stats:', error);
    }
  }

  /**
   * 建立搜尋條件
   */
  private buildSearchCriteria(): TransactionSearchCriteriaDto {
    const formValue = this.searchForm.value;

    return {
      keyword: formValue.keyword || undefined,
      transactionType: formValue.transactionType || undefined,
      status: formValue.status || undefined,
      startDate: formValue.startDate ? formValue.startDate.toISOString() : undefined,
      endDate: formValue.endDate ? formValue.endDate.toISOString() : undefined,
      page: this.paginationConfig.pageIndex,
      pageSize: this.paginationConfig.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  }
  /**
    * 搜尋處理
    */
  async onSearch(): Promise<void> {
    this.paginationConfig.pageIndex = 1;
    await this.loadTransactions();
    await this.loadTransactionStats();
  }

  /**
   * 重置搜尋
   */
  async resetSearch(): Promise<void> {
    this.searchForm.reset();
    this.paginationConfig.pageIndex = 1;
    await this.loadTransactions();
    await this.loadTransactionStats();
  }

  /**
   * 分頁變更處理
   */
  async onPageChange(page: number): Promise<void> {
    this.paginationConfig.pageIndex = page;
    await this.loadTransactions();
  }

  /**
   * 每頁數量變更處理
   */
  async onPageSizeChange(pageSize: number): Promise<void> {
    this.paginationConfig.pageSize = pageSize;
    this.paginationConfig.pageIndex = 1;
    await this.loadTransactions();
  }

  /**
   * 檢視交易詳情
   */
  viewTransaction(transaction: TransactionResponseDto): void {
    this.router.navigate(['/transactions', transaction.id]);
  }

  /**
   * 編輯交易
   */
  editTransaction(transaction: TransactionResponseDto): void {
    const formData: FormModalData = {
      title: '編輯交易',
      initialData: {
        accountId: transaction.accountId,
        transactionType: transaction.transactionType,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        category: transaction.category || '',
        referenceNumber: transaction.referenceNumber || ''
      },
      fields: [
        {
          key: 'accountId',
          label: '帳戶',
          type: 'select',
          required: true,
          span: 12,
          disabled: true, // 編輯時不允許修改帳戶
          options: [
            { label: '主要支票帳戶', value: 'account-1' },
            { label: '儲蓄帳戶', value: 'account-2' },
            { label: '信用帳戶', value: 'account-3' }
          ]
        },
        {
          key: 'transactionType',
          label: '交易類型',
          type: 'select',
          required: true,
          span: 12,
          disabled: true, // 編輯時不允許修改類型
          options: [
            { label: '存款', value: TransactionType.DEPOSIT },
            { label: '提款', value: TransactionType.WITHDRAWAL },
            { label: '轉帳', value: TransactionType.TRANSFER },
            { label: '付款', value: TransactionType.PAYMENT },
            { label: '退款', value: TransactionType.REFUND }
          ]
        },
        {
          key: 'amount',
          label: '金額',
          type: 'number',
          required: true,
          span: 12,
          disabled: true, // 編輯時不允許修改金額
          min: 0.01,
          step: 0.01,
          precision: 2
        },
        {
          key: 'currency',
          label: '貨幣',
          type: 'select',
          required: true,
          span: 12,
          disabled: true, // 編輯時不允許修改貨幣
          options: [
            { label: '新台幣 (TWD)', value: 'TWD' },
            { label: '美元 (USD)', value: 'USD' },
            { label: '歐元 (EUR)', value: 'EUR' },
            { label: '日圓 (JPY)', value: 'JPY' }
          ]
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          required: true,
          span: 24,
          rows: 3,
          maxLength: 500
        },
        {
          key: 'category',
          label: '分類',
          type: 'text',
          span: 12,
          maxLength: 50
        },
        {
          key: 'referenceNumber',
          label: '參考編號',
          type: 'text',
          span: 12,
          maxLength: 100
        }
      ]
    };

    this.modalService.openForm({
      title: formData.title,
      component: FormModalComponent,
      componentParams: { data: formData },
      width: 800,
      onOk: async (data) => {
        try {
          const updateDto = {
            description: data.description,
            category: data.category,
            referenceNumber: data.referenceNumber
          };

          await this.transactionService.update(transaction.id, updateDto);
          this.message.success('交易更新成功');
          await this.loadTransactions();
          await this.loadTransactionStats();
        } catch (error) {
          this.message.error('交易更新失敗');
          console.error('Error updating transaction:', error);
        }
      }
    });
  }

  /**
   * 刪除交易
   */
  async deleteTransaction(transaction: TransactionResponseDto): Promise<void> {
    await this.modalService.confirmDelete(
      `交易 "${transaction.transactionNumber}"`,
      async () => {
        try {
          await this.transactionService.delete(transaction.id);
          this.message.success('交易刪除成功');
          await this.loadTransactions();
          await this.loadTransactionStats();
        } catch (error) {
          this.message.error('交易刪除失敗');
          console.error('Error deleting transaction:', error);
        }
      }
    );
  }

  /**
   * 自定義操作處理
   */
  async onCustomAction(event: { action: TableAction; item: TransactionResponseDto }): Promise<void> {
    const { action, item } = event;

    switch (action.key) {
      case 'process':
        await this.processTransaction(item);
        break;
      case 'complete':
        await this.completeTransaction(item);
        break;
      case 'fail':
        await this.failTransaction(item);
        break;
      case 'retry':
        await this.retryTransaction(item);
        break;
      default:
        console.warn('Unknown custom action:', action.key);
    }
  }

  /**
   * 處理交易
   */
  private async processTransaction(transaction: TransactionResponseDto): Promise<void> {
    try {
      await this.transactionService.processTransaction(transaction.id, { action: 'process' });
      this.message.success('交易處理成功');
      await this.loadTransactions();
      await this.loadTransactionStats();
    } catch (error) {
      this.message.error('交易處理失敗');
      console.error('Error processing transaction:', error);
    }
  }

  /**
   * 完成交易
   */
  private async completeTransaction(transaction: TransactionResponseDto): Promise<void> {
    try {
      await this.transactionService.processTransaction(transaction.id, { action: 'complete' });
      this.message.success('交易完成成功');
      await this.loadTransactions();
      await this.loadTransactionStats();
    } catch (error) {
      this.message.error('交易完成失敗');
      console.error('Error completing transaction:', error);
    }
  }
  /**
    * 交易失敗
    */
  private async failTransaction(transaction: TransactionResponseDto): Promise<void> {
    await this.modalService.confirmWarning({
      title: '確認標記失敗',
      content: `確定要將交易 "${transaction.transactionNumber}" 標記為失敗嗎？`,
      onOk: async () => {
        try {
          await this.transactionService.processTransaction(transaction.id, {
            action: 'fail',
            reason: '手動標記失敗'
          });
          this.message.success('交易已標記為失敗');
          await this.loadTransactions();
          await this.loadTransactionStats();
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
  private async retryTransaction(transaction: TransactionResponseDto): Promise<void> {
    try {
      await this.transactionService.processTransaction(transaction.id, { action: 'retry' });
      this.message.success('交易重試成功');
      await this.loadTransactions();
      await this.loadTransactionStats();
    } catch (error) {
      this.message.error('交易重試失敗');
      console.error('Error retrying transaction:', error);
    }
  }

  /**
   * 新增交易
   */
  createTransaction(): void {
    const formData: FormModalData = {
      title: '新增交易',
      fields: [
        {
          key: 'accountId',
          label: '帳戶',
          type: 'select',
          required: true,
          span: 12,
          options: [
            { label: '主要支票帳戶', value: 'account-1' },
            { label: '儲蓄帳戶', value: 'account-2' },
            { label: '信用帳戶', value: 'account-3' }
          ]
        },
        {
          key: 'transactionType',
          label: '交易類型',
          type: 'select',
          required: true,
          span: 12,
          defaultValue: TransactionType.DEPOSIT,
          options: [
            { label: '存款', value: TransactionType.DEPOSIT },
            { label: '提款', value: TransactionType.WITHDRAWAL },
            { label: '轉帳', value: TransactionType.TRANSFER },
            { label: '付款', value: TransactionType.PAYMENT },
            { label: '退款', value: TransactionType.REFUND }
          ]
        },
        {
          key: 'amount',
          label: '金額',
          type: 'number',
          required: true,
          span: 12,
          min: 0.01,
          step: 0.01,
          precision: 2
        },
        {
          key: 'currency',
          label: '貨幣',
          type: 'select',
          required: true,
          span: 12,
          defaultValue: 'TWD',
          options: [
            { label: '新台幣 (TWD)', value: 'TWD' },
            { label: '美元 (USD)', value: 'USD' },
            { label: '歐元 (EUR)', value: 'EUR' },
            { label: '日圓 (JPY)', value: 'JPY' }
          ]
        },
        {
          key: 'description',
          label: '描述',
          type: 'textarea',
          required: true,
          span: 24,
          rows: 3,
          maxLength: 500
        },
        {
          key: 'category',
          label: '分類',
          type: 'text',
          span: 12,
          maxLength: 50
        },
        {
          key: 'referenceNumber',
          label: '參考編號',
          type: 'text',
          span: 12,
          placeholder: '輸入參考編號（可選）'
        }
      ]
    };

    this.modalService.openForm({
      title: formData.title,
      component: FormModalComponent,
      componentParams: { data: formData },
      width: 800,
      onOk: async (data) => {
        try {
          const createDto: CreateTransactionDto = {
            accountId: data.accountId,
            userId: 'current-user-id', // 應該從認證服務獲取
            amount: data.amount,
            currency: data.currency,
            transactionType: data.transactionType,
            description: data.description,
            category: data.category,
            referenceNumber: data.referenceNumber
          };

          await this.transactionService.create(createDto);
          this.message.success('交易創建成功');
          await this.loadTransactions();
          await this.loadTransactionStats();
        } catch (error) {
          this.message.error('交易創建失敗');
          console.error('Error creating transaction:', error);
        }
      }
    });
  }

  // 移除不再需要的表單提交和取消方法，現在使用統一的模態框服務

  /**
   * 匯出資料
   */
  exportData(): void {
    this.message.info('匯出功能開發中...');
  }

  /**
   * 格式化貨幣
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    }).format(value);
  }
}