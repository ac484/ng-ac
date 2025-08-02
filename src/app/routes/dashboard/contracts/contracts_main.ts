/**
 * 重構後的合約管理主組件
 * 將原本的功能拆分成多個子組件，保持邏輯清晰
 */

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractService, Contract } from '../../../core/services/firestore/contract.service';
import { ClientService, Client } from '../../../core/services/firestore/client.service';
import { AntTableConfig, SortFile } from '../../../shared/components/ant-table/ant-table.component';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import { ContractStatisticsComponent, ContractStats } from './component/contract_stats';
import { ContractSearchFormComponent, SearchParam, StatusOption } from './component/contract_search';
import { ContractModalComponent } from './component/contract_modal';
import { ContractTableComponent } from './component/contract_table';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-contracts',
  template: `
    <!-- 頁面標題 -->
    <app-page-header [pageHeaderInfo]="pageHeaderInfo" />

    <!-- 統計卡片 -->
    <app-contract-statistics [stats]="contractStats" />

    <!-- 搜索表單 -->
    <app-contract-search-form
      [statusOptions]="statusOptions"
      [isCollapse]="isCollapse"
      (search)="onSearch($event)"
      (reset)="onResetSearch()"
      (collapseChange)="onCollapseChange($event)">
    </app-contract-search-form>

    <!-- 表格 -->
    <app-contract-table
      [contractList]="contractList"
      [selectedContracts]="checkedCashArray"
      [tableConfig]="tableConfig"
      (add)="addContract()"
      (edit)="editContract($event)"
      (delete)="deleteContract($event)"
      (batchDelete)="batchDelete($event)"
      (reload)="reloadTable()"
      (tableChange)="onTableChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
      (selectionChange)="onSelectionChange($event)"
      (sort)="onSort($event)">
    </app-contract-table>

    <!-- 新增/編輯模態框 -->
    <app-contract-modal
      [(visible)]="isModalVisible"
      [title]="modalTitle"
      [editingContract]="editingContract"
      [clientList]="clientList"
      [statusOptions]="statusOptions"
      [loading]="tableConfig.loading"
      [defaultContractCode]="defaultContractCode"
      (save)="saveContract($event)"
      (cancel)="handleCancel()">
    </app-contract-modal>
  `,
  styleUrls: ['./contracts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    ContractStatisticsComponent,
    ContractSearchFormComponent,
    ContractTableComponent,
    ContractModalComponent
  ]
})
export class ContractsComponent implements OnInit {
  // 表格配置
  tableConfig!: AntTableConfig;
  
  // 數據
  contractList: Contract[] = [];
  checkedCashArray: Contract[] = [];
  clientList: Client[] = [];
  
  // 搜索參數
  searchParam: Partial<SearchParam> = {};
  isCollapse = true;
  
  // 統計數據
  contractStats: ContractStats = {
    total: 0,
    draft: 0,
    preparing: 0,
    active: 0,
    completed: 0,
    totalAmount: 0
  };

  // 頁面配置
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '合約管理',
    desc: '管理所有合約資料，包含合約狀態、進度追蹤和客戶資訊',
    breadcrumb: ['首頁', '儀表板', '合約管理']
  };

  // 模態框
  isModalVisible = false;
  modalTitle = '新增合約';
  editingContract: Contract | null = null;
  defaultContractCode = '';

  // 狀態選項
  statusOptions: StatusOption[] = [
    { label: '草稿', value: 'draft', color: 'default' },
    { label: '籌備中', value: 'preparing', color: 'processing' },
    { label: '進行中', value: 'active', color: 'processing' },
    { label: '已完成', value: 'completed', color: 'success' }
  ];

  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private contractService = inject(ContractService);
  private clientService = inject(ClientService);

  ngOnInit(): void {
    this.initTable();
    this.loadClients();
    this.loadContracts();
    this.loadStats();
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [], // 由 ContractTableComponent 初始化
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  // 載入客戶列表
  loadClients(): void {
    (this.clientService as any).findAll().subscribe({
      next: (clients: Client[]) => {
        this.clientList = clients;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('載入客戶列表失敗:', error);
        this.message.error('載入客戶列表失敗');
      }
    });
  }

  // 載入合約列表
  loadContracts(): void {
    console.log('🔥 開始從 Firestore 載入合約...');
    this.tableConfig.loading = true;
    this.cdr.markForCheck();
    
    const searchConditions = this.buildSearchConditions();
    
    // 修復：使用 findAll() 方法而不是 queryContracts()
    (this.contractService as any).findAll(
      searchConditions.where || [],
      searchConditions.order || [],
      searchConditions.limit
    ).subscribe({
      next: (contracts: Contract[]) => {
        console.log('✅ Firestore 查詢成功:', contracts);
        
        console.log('📊 合約數據詳情:', contracts.map(c => ({
          id: c.id,
          contractCode: c.contractCode,
          clientName: c.clientName,
          status: c.status,
          totalAmount: c.totalAmount
        })));
        this.contractList = contracts;
        this.tableConfig.total = contracts.length;
        this.tableConfig.loading = false;
        this.cdr.markForCheck();
        
        if (contracts.length === 0) {
          this.message.info('目前沒有合約資料，可以開始新增合約');
        }
      },
      error: (error: any) => {
        console.error('❌ Firestore 查詢失敗:', error);
        this.handleFirestoreError(error);
        this.contractList = [];
        this.tableConfig.total = 0;
        this.tableConfig.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // 載入統計數據
  loadStats(): void {
    console.log('📊 開始載入統計數據...');
    
    // 修復：使用 findAll() 方法來獲取統計數據
    (this.contractService as any).findAll().subscribe({
      next: (contracts: Contract[]) => {
        console.log('✅ 統計數據載入成功:', contracts);
        
        // 手動計算統計數據
        const stats: ContractStats = {
          total: contracts.length,
          draft: contracts.filter(c => c.status === 'draft').length,
          preparing: contracts.filter(c => c.status === 'preparing').length,
          active: contracts.filter(c => c.status === 'active').length,
          completed: contracts.filter(c => c.status === 'completed').length,
          totalAmount: contracts.reduce((sum, contract) => sum + (contract.totalAmount || 0), 0)
        };
        
        this.contractStats = stats;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('❌ 統計數據載入失敗:', error);
        this.handleFirestoreError(error);
        this.contractStats = {
          total: 0,
          draft: 0,
          preparing: 0,
          active: 0,
          completed: 0,
          totalAmount: 0
        };
        this.cdr.markForCheck();
      }
    });
  }

  // 構建搜索條件
  private buildSearchConditions(): any {
    const conditions: any = {};
    const where: any[] = [];
    const order: any[] = [];
    
    if (this.searchParam.contractCode) {
      where.push({ field: 'contractCode', operator: '>=', value: this.searchParam.contractCode });
      where.push({ field: 'contractCode', operator: '<=', value: this.searchParam.contractCode + '\uf8ff' });
    }
    
    if (this.searchParam.clientName) {
      where.push({ field: 'clientName', operator: '>=', value: this.searchParam.clientName });
      where.push({ field: 'clientName', operator: '<=', value: this.searchParam.clientName + '\uf8ff' });
    }
    
    if (this.searchParam.status) {
      where.push({ field: 'status', operator: '==', value: this.searchParam.status });
    }
    
    if (this.searchParam.minAmount) {
      where.push({ field: 'totalAmount', operator: '>=', value: this.searchParam.minAmount });
    }
    
    if (this.searchParam.maxAmount) {
      where.push({ field: 'totalAmount', operator: '<=', value: this.searchParam.maxAmount });
    }

    // 添加默認排序
    order.push({ field: 'createdAt', direction: 'desc' });

    if (where.length > 0) {
      conditions.where = where;
    }
    
    if (order.length > 0) {
      conditions.order = order;
    }

    conditions.limit = 50;

    console.log('🔍 構建的查詢條件:', conditions);
    return conditions;
  }

  // 搜索事件處理
  onSearch(searchParam: SearchParam): void {
    // 極簡型別轉換：確保搜尋金額為 number
    const cleanedParam = { ...searchParam };
    if (cleanedParam.minAmount) {
      cleanedParam.minAmount = Number(cleanedParam.minAmount) || undefined;
    }
    if (cleanedParam.maxAmount) {
      cleanedParam.maxAmount = Number(cleanedParam.maxAmount) || undefined;
    }
    
    this.searchParam = cleanedParam;
    this.loadContracts();
  }

  onResetSearch(): void {
    this.searchParam = {};
    this.loadContracts();
  }

  onCollapseChange(isCollapse: boolean): void {
    this.isCollapse = isCollapse;
  }

  // 合約操作
  addContract(): void {
    this.modalTitle = '新增合約';
    this.editingContract = null;
    this.defaultContractCode = (this.contractService as any).generateContractCode();
    this.isModalVisible = true;
  }

  editContract(contract: Contract): void {
    this.modalTitle = '編輯合約';
    this.editingContract = contract;
    this.isModalVisible = true;
  }

  saveContract(contractData: any): void {
    console.log('💾 準備保存合約數據:', contractData);
    console.log('💾 金額字段:', contractData.totalAmount, typeof contractData.totalAmount);
    
    if (this.editingContract) {
      // 更新
      (this.contractService as any).update(this.editingContract.id!, contractData).subscribe({
        next: () => {
          this.message.success('合約更新成功');
          this.isModalVisible = false;
          this.loadContracts();
          this.loadStats();
        },
        error: (error: any) => {
          console.error('更新合約失敗:', error);
          this.message.error('更新合約失敗');
        }
      });
    } else {
      // 新增
      (this.contractService as any).create(contractData).subscribe({
        next: () => {
          this.message.success('合約新增成功');
          this.isModalVisible = false;
          this.loadContracts();
          this.loadStats();
        },
        error: (error: any) => {
          console.error('新增合約失敗:', error);
          this.message.error('新增合約失敗');
        }
      });
    }
  }

  deleteContract(contract: Contract): void {
    this.modal.confirm({
      nzTitle: '確定要刪除此合約嗎？',
      nzContent: `合約編號：${contract.contractCode}`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        (this.contractService as any).delete(contract.id!).subscribe({
          next: () => {
            this.message.success('合約刪除成功');
            this.loadContracts();
            this.loadStats();
          },
          error: (error: any) => {
            console.error('刪除合約失敗:', error);
            this.message.error('刪除合約失敗');
          }
        });
      }
    });
  }

  batchDelete(contracts: Contract[]): void {
    if (contracts.length === 0) {
      this.message.warning('請選擇要刪除的合約');
      return;
    }

    this.modal.confirm({
      nzTitle: `確定要刪除選中的 ${contracts.length} 個合約嗎？`,
      nzContent: '此操作不可恢復',
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const ids = contracts.map(contract => contract.id!);
        (this.contractService as any).deleteBatch(ids).subscribe({
          next: () => {
            this.message.success('批量刪除成功');
            this.checkedCashArray = [];
            this.loadContracts();
            this.loadStats();
          },
          error: (error: any) => {
            console.error('批量刪除失敗:', error);
            this.message.error('批量刪除失敗');
          }
        });
      }
    });
  }

  // 表格事件處理
  onTableChange(event?: any): void {
    console.log('表格變更事件:', event);
    this.loadContracts();
  }

  onPageSizeChange(pageSize: number): void {
    this.tableConfig.pageSize = pageSize;
    this.loadContracts();
  }

  onSelectionChange(selectedContracts: Contract[]): void {
    this.checkedCashArray = selectedContracts;
  }

  onSort(sortInfo: SortFile): void {
    console.log('排序:', sortInfo);
    // 這裡可以實現排序邏輯
  }

  // 刷新表格
  reloadTable(): void {
    this.loadContracts();
    this.loadStats();
  }

  // 模態框事件
  handleCancel(): void {
    this.isModalVisible = false;
  }

  // Firestore 錯誤處理
  private handleFirestoreError(error: any): void {
    console.error('Firestore 錯誤詳情:', error);
    
    if (error.code) {
      switch (error.code) {
        case 'permission-denied':
          this.message.error('權限不足，請檢查 Firestore 安全規則');
          break;
        case 'unavailable':
          this.message.error('Firestore 服務暫時無法使用，請稍後再試');
          break;
        case 'unauthenticated':
          this.message.error('未驗證用戶，請重新登入');
          break;
        case 'failed-precondition':
          this.message.error('Firestore 索引可能需要建立，請檢查控制台');
          break;
        default:
          this.message.error(`Firestore 錯誤: ${error.message || '未知錯誤'}`);
      }
    } else {
      this.message.error('網路連接問題，請檢查網路狀態');
    }
  }
}