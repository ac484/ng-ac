/**
 * 合約表格組件
 * 專門處理合約列表的顯示、操作和模板
 */

import { Component, Input, Output, EventEmitter, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Contract } from '../../../../core/services/firestore/contract.service';
import { AntTableConfig, SortFile, AntTableComponent } from '../../../../shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '../../../../shared/components/card-table-wrap/card-table-wrap.component';
import { CopyTextComponent } from '../../../../shared/components/copy-text/copy-text.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzProgressModule } from 'ng-zorro-antd/progress';

@Component({
  selector: 'app-contract-table',
  template: `
    <app-card-table-wrap [btnTpl]="tableBtns" (reload)="onReload()">
      <app-ant-table 
        [checkedCashArrayFromComment]="selectedContracts" 
        [tableConfig]="tableConfig"
        [tableData]="contractList" 
        (changePageNum)="onTableChange($event)" 
        (changePageSize)="onPageSizeChange($event)"
        (selectedChange)="onSelectionChange($event)" 
        (sortFn)="onSort($event)">
      </app-ant-table>

      <!-- 表格按鈕 -->
      <ng-template #tableBtns>
        <button class="mr-8" nz-button nzType="primary" (click)="onAdd()">
          <i nz-icon nzType="plus"></i>
          新增合約
        </button>

        <button nz-button nzType="default" nzDanger (click)="onBatchDelete()">
          <i nz-icon nzType="delete"></i>
          批量刪除
        </button>
      </ng-template>

      <!-- 合約編號模板 -->
      <ng-template #contractCodeTpl let-contractCode="contractCode" let-id="id">
        <div class="flex items-center">
          <span class="mr-8">{{ contractCode }}</span>
          <app-copy-text [text]="contractCode" tooltipTitle="複製合約編號">
            <i nz-icon nzType="copy"></i>
          </app-copy-text>
        </div>
      </ng-template>

      <!-- 金額模板 -->
      <ng-template #amountTpl let-totalAmount="totalAmount">
        <span class="font-medium text-green-600">{{ formatAmount(totalAmount) }}</span>
      </ng-template>

      <!-- 進度模板 -->
      <ng-template #progressTpl let-progress="progress" let-status="status">
        <div class="flex items-center">
          <nz-progress 
            [nzPercent]="progress" 
            nzSize="small" 
            [nzStatus]="progress === 100 ? 'success' : 'active'"
            class="mr-8">
          </nz-progress>
          <span class="text-xs">{{ progress }}%</span>
        </div>
      </ng-template>

      <!-- 狀態模板 -->
      <ng-template #statusTpl let-status="status">
        <nz-tag [nzColor]="getStatusColor(status)">
          {{ getStatusText(status) }}
        </nz-tag>
      </ng-template>

      <!-- 操作模板 -->
      <ng-template #operationTpl let-contract="$implicit">
        <div class="flex items-center space-x-2">
          <button nz-button nzType="link" nzSize="small" (click)="onEdit(contract)">
            <i nz-icon nzType="edit"></i>
            編輯
          </button>
          <button nz-button nzType="link" nzSize="small" nzDanger (click)="onDelete(contract)">
            <i nz-icon nzType="delete"></i>
            刪除
          </button>
          <app-copy-text 
            [text]="'合約編號: ' + contract.contractCode + ', 客戶: ' + contract.clientName"
            tooltipTitle="複製合約資訊">
            複製
          </app-copy-text>
        </div>
      </ng-template>
    </app-card-table-wrap>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    CardTableWrapComponent,
    AntTableComponent,
    CopyTextComponent,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzProgressModule
  ]
})
export class ContractTableComponent {
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('progressTpl', { static: true }) progressTpl!: TemplateRef<any>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<any>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('contractCodeTpl', { static: true }) contractCodeTpl!: TemplateRef<any>;

  @Input() contractList: Contract[] = [];
  @Input() selectedContracts: Contract[] = [];
  @Input() tableConfig!: AntTableConfig;

  @Output() add = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Contract>();
  @Output() delete = new EventEmitter<Contract>();
  @Output() batchDelete = new EventEmitter<Contract[]>();
  @Output() reload = new EventEmitter<void>();
  @Output() tableChange = new EventEmitter<any>();
  @Output() pageSizeChange = new EventEmitter<number>();
  @Output() selectionChange = new EventEmitter<Contract[]>();
  @Output() sort = new EventEmitter<SortFile>();

  ngAfterViewInit(): void {
    // 初始化表格配置模板
    this.initTableConfig();
  }

  private initTableConfig(): void {
    if (this.tableConfig) {
      this.tableConfig.headers = [
        {
          title: '合約編號',
          field: 'contractCode',
          width: 150,
          fixed: true,
          fixedDir: 'left',
          tdTemplate: this.contractCodeTpl,
          showSort: true
        },
        {
          title: '客戶名稱',
          field: 'clientName',
          width: 200,
          showSort: true
        },
        {
          title: '合約名稱',
          field: 'contractName',
          width: 250,
          showSort: true
        },
        {
          title: '專案經理',
          field: 'projectManager',
          width: 120,
          showSort: true
        },
        {
          title: '總金額',
          field: 'totalAmount',
          width: 150,
          tdTemplate: this.amountTpl,
          showSort: true
        },
        {
          title: '進度',
          field: 'progress',
          width: 120,
          tdTemplate: this.progressTpl,
          showSort: true
        },
        {
          title: '狀態',
          field: 'status',
          width: 100,
          tdTemplate: this.statusTpl,
          showSort: true
        },
        {
          title: '創建時間',
          field: 'createdAt',
          width: 150,
          showSort: true
        },
        {
          title: '操作',
          tdTemplate: this.operationTpl,
          width: 200,
          fixed: true,
          fixedDir: 'right'
        }
      ];
    }
  }

  onAdd(): void {
    this.add.emit();
  }

  onEdit(contract: Contract): void {
    this.edit.emit(contract);
  }

  onDelete(contract: Contract): void {
    this.delete.emit(contract);
  }

  onBatchDelete(): void {
    this.batchDelete.emit(this.selectedContracts);
  }

  onReload(): void {
    this.reload.emit();
  }

  onTableChange(event?: any): void {
    this.tableChange.emit(event);
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSizeChange.emit(pageSize);
  }

  onSelectionChange(selectedContracts: Contract[]): void {
    this.selectionChange.emit(selectedContracts);
  }

  onSort(sortInfo: SortFile): void {
    this.sort.emit(sortInfo);
  }

  // 工具方法
  getStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': 'default',
      'preparing': 'processing',
      'active': 'processing',
      'completed': 'success'
    };
    return statusMap[status] || 'default';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'draft': '草稿',
      'preparing': '籌備中',
      'active': '進行中',
      'completed': '已完成'
    };
    return statusMap[status] || status;
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD',
      minimumFractionDigits: 0
    }).format(amount);
  }
}