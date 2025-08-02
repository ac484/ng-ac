/**
 * 合約管理組件
 * 
 * 使用已有的表格組件展示和管理合約資料
 */

import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ContractService, Contract } from '../../../core/services/firestore/contract.service';
import { AntTableConfig, SortFile, AntTableComponent } from '../../../shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '../../../shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '../../../shared/components/water-mark/water-mark.component';
import { CopyTextComponent } from '../../../shared/components/copy-text/copy-text.component';
import { DebounceClickDirective } from '../../../shared/directives/debounce-click.directive';
import { ToggleFullscreenDirective } from '../../../shared/directives/toggle-fullscreen.directive';
import { MapPipe } from '../../../shared/pipes/map.pipe';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';

interface SearchParam {
  contractCode?: string;
  clientName?: string;
  contractName?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
}

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    NzCardModule,
    WaterMarkComponent,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzWaveModule,
    NzIconModule,
    CardTableWrapComponent,
    AntTableComponent,
    CopyTextComponent,
    DebounceClickDirective,
    ToggleFullscreenDirective,
    NzBadgeModule,
    NzTagModule,
    NzProgressModule,
    NzStatisticModule,
    NzModalModule,
    MapPipe
  ]
})
export class ContractsComponent implements OnInit {
  @ViewChild('statusTpl', { static: true }) statusTpl!: TemplateRef<any>;
  @ViewChild('progressTpl', { static: true }) progressTpl!: TemplateRef<any>;
  @ViewChild('amountTpl', { static: true }) amountTpl!: TemplateRef<any>;
  @ViewChild('operationTpl', { static: true }) operationTpl!: TemplateRef<any>;
  @ViewChild('contractCodeTpl', { static: true }) contractCodeTpl!: TemplateRef<any>;

  // 表單和搜索
  searchForm!: FormGroup;
  contractForm!: FormGroup;
  searchParam: Partial<SearchParam> = {};
  isCollapse = true;

  // 表格配置
  tableConfig!: AntTableConfig;
  
  // 數據
  contractList: Contract[] = [];
  checkedCashArray: Contract[] = [];
  
  // 統計數據
  contractStats = {
    total: 0,
    active: 0,
    completed: 0,
    cancelled: 0,
    totalAmount: 0,
    averageProgress: 0
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

  // 狀態選項
  statusOptions = [
    { label: '進行中', value: 'active', color: 'processing' },
    { label: '已完成', value: 'completed', color: 'success' },
    { label: '已取消', value: 'cancelled', color: 'error' }
  ];

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private contractService = inject(ContractService);

  ngOnInit(): void {
    this.initForms();
    this.initTable();
    this.loadContracts();
    this.loadStats();
  }

  private initForms(): void {
    // 搜索表單
    this.searchForm = this.fb.group({
      contractCode: [''],
      clientName: [''],
      contractName: [''],
      status: [''],
      minAmount: [null],
      maxAmount: [null]
    });

    // 合約表單
    this.contractForm = this.fb.group({
      contractCode: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      clientRepresentative: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      contractName: ['', [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
      version: ['V1.0', [Validators.required]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['active', [Validators.required]],
      startDate: [null],
      endDate: [null],
      signDate: [null],
      description: [''],
      projectManager: [''],
      salesPerson: [''],
      paymentTerms: [''],
      category: [''],
      priority: ['medium']
    });
  }

  private initTable(): void {
    this.tableConfig = {
      headers: [
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
          title: '總金額',
          field: 'amount',
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
          title: '客戶代表',
          field: 'clientRepresentative',
          width: 120
        },
        {
          title: '客戶窗口',
          field: 'contactPerson',
          width: 120
        },
        {
          title: '版本',
          field: 'version',
          width: 80
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
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  // 載入合約列表
  loadContracts(e?: NzTableQueryParams): void {
    this.tableConfig.loading = true;
    
    // 構建查詢條件
    const searchConditions = this.buildSearchConditions();
    
    this.contractService.getAll(searchConditions).subscribe({
      next: (contracts) => {
        this.contractList = contracts;
        this.tableConfig.total = contracts.length;
        this.tableConfig.loading = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入合約失敗:', error);
        this.message.error('載入合約失敗');
        this.tableConfig.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  // 載入統計數據
  loadStats(): void {
    this.contractService.getContractStats().subscribe({
      next: (stats) => {
        this.contractStats = stats;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('載入統計數據失敗:', error);
      }
    });
  }

  // 構建搜索條件
  private buildSearchConditions(): any {
    const conditions: any = {
      orderBy: [{ field: 'createdAt', direction: 'desc' }]
    };

    const where: any[] = [];
    
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
      where.push({ field: 'amount', operator: '>=', value: this.searchParam.minAmount });
    }
    
    if (this.searchParam.maxAmount) {
      where.push({ field: 'amount', operator: '<=', value: this.searchParam.maxAmount });
    }

    if (where.length > 0) {
      conditions.where = where;
    }

    return conditions;
  }

  // 搜索
  search(): void {
    this.searchParam = { ...this.searchForm.value };
    this.loadContracts();
  }

  // 重置搜索
  resetSearch(): void {
    this.searchForm.reset();
    this.searchParam = {};
    this.loadContracts();
  }

  // 展開/收起搜索
  toggleCollapse(): void {
    this.isCollapse = !this.isCollapse;
  }

  // 新增合約
  addContract(): void {
    this.modalTitle = '新增合約';
    this.editingContract = null;
    this.contractForm.reset({
      version: 'V1.0',
      progress: 0,
      status: 'active',
      priority: 'medium'
    });
    // 自動生成合約編號
    this.contractForm.patchValue({
      contractCode: this.contractService.generateContractCode()
    });
    this.isModalVisible = true;
  }

  // 編輯合約
  editContract(contract: Contract): void {
    this.modalTitle = '編輯合約';
    this.editingContract = contract;
    this.contractForm.patchValue(contract);
    this.isModalVisible = true;
  }

  // 保存合約
  saveContract(): void {
    if (!this.contractForm.valid) {
      this.message.error('請填寫必填欄位');
      return;
    }

    const contractData = this.contractForm.value;
    
    if (this.editingContract) {
      // 更新
      this.contractService.update(this.editingContract.id!, contractData).subscribe({
        next: () => {
          this.message.success('合約更新成功');
          this.isModalVisible = false;
          this.loadContracts();
          this.loadStats();
        },
        error: (error) => {
          console.error('更新合約失敗:', error);
          this.message.error('更新合約失敗');
        }
      });
    } else {
      // 新增
      this.contractService.create(contractData).subscribe({
        next: () => {
          this.message.success('合約新增成功');
          this.isModalVisible = false;
          this.loadContracts();
          this.loadStats();
        },
        error: (error) => {
          console.error('新增合約失敗:', error);
          this.message.error('新增合約失敗');
        }
      });
    }
  }

  // 刪除合約
  deleteContract(contract: Contract): void {
    this.modal.confirm({
      nzTitle: '確定要刪除此合約嗎？',
      nzContent: `合約編號：${contract.contractCode}`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.contractService.delete(contract.id!).subscribe({
          next: () => {
            this.message.success('合約刪除成功');
            this.loadContracts();
            this.loadStats();
          },
          error: (error) => {
            console.error('刪除合約失敗:', error);
            this.message.error('刪除合約失敗');
          }
        });
      }
    });
  }

  // 批量刪除
  batchDelete(): void {
    if (this.checkedCashArray.length === 0) {
      this.message.warning('請選擇要刪除的合約');
      return;
    }

    this.modal.confirm({
      nzTitle: `確定要刪除選中的 ${this.checkedCashArray.length} 個合約嗎？`,
      nzContent: '此操作不可恢復',
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        const ids = this.checkedCashArray.map(contract => contract.id!);
        this.contractService.deleteBatch(ids).subscribe({
          next: () => {
            this.message.success('批量刪除成功');
            this.checkedCashArray = [];
            this.loadContracts();
            this.loadStats();
          },
          error: (error) => {
            console.error('批量刪除失敗:', error);
            this.message.error('批量刪除失敗');
          }
        });
      }
    });
  }

  // 更新進度
  updateProgress(contract: Contract, progress: number): void {
    this.contractService.updateProgress(contract.id!, progress).subscribe({
      next: () => {
        this.message.success('進度更新成功');
        this.loadContracts();
        this.loadStats();
      },
      error: (error) => {
        console.error('更新進度失敗:', error);
        this.message.error('更新進度失敗');
      }
    });
  }

  // 表格事件處理
  onTableChange(e: NzTableQueryParams): void {
    this.loadContracts(e);
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

  // 工具方法
  getStatusColor(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'processing',
      'completed': 'success',
      'cancelled': 'error'
    };
    return statusMap[status] || 'default';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': '進行中',
      'completed': '已完成',
      'cancelled': '已取消'
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

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-TW');
  }

  // 模態框事件
  handleCancel(): void {
    this.isModalVisible = false;
  }
}