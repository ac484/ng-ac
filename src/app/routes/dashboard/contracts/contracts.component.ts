/**
 * 合約管理組件
 * 
 * 使用已有的表格組件展示和管理合約資料
 */

import { Component, OnInit, ChangeDetectionStrategy, ViewChild, TemplateRef, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ContractService, Contract } from '../../../core/services/firestore/contract.service';
import { ClientService, Client, ContactInfo } from '../../../core/services/firestore/client.service';
import { AntTableConfig, SortFile, AntTableComponent } from '../../../shared/components/ant-table/ant-table.component';
import { CardTableWrapComponent } from '../../../shared/components/card-table-wrap/card-table-wrap.component';
import { PageHeaderType, PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '../../../shared/components/water-mark/water-mark.component';
import { CopyTextComponent } from '../../../shared/components/copy-text/copy-text.component';
import { DebounceClickDirective } from '../../../shared/directives/debounce-click.directive';
import { ToggleFullscreenDirective } from '../../../shared/directives/toggle-fullscreen.directive';

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
  
  // 客戶和聯絡人數據
  clientList: Client[] = [];
  contactList: ContactInfo[] = [];
  
  // 統計數據
  contractStats = {
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

  // 狀態選項
  statusOptions = [
    { label: '草稿', value: 'draft', color: 'default' },
    { label: '籌備中', value: 'preparing', color: 'processing' },
    { label: '進行中', value: 'active', color: 'processing' },
    { label: '已完成', value: 'completed', color: 'success' }
  ];

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private contractService = inject(ContractService);
  private clientService = inject(ClientService);

  ngOnInit(): void {
    this.initForms();
    this.initTable();
    this.loadClients();
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
      clientId: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      contactId: ['', [Validators.required]],
      projectManager: ['', [Validators.required]],
      contractName: ['', [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['active', [Validators.required]],
      description: ['']
    });

    // 監聽客戶選擇變化
    this.contractForm.get('clientId')?.valueChanges.subscribe(clientId => {
      this.onClientChange(clientId);
    });
  }

  // 客戶選擇變化處理
  onClientChange(clientId: string): void {
    if (clientId) {
      const selectedClient = this.clientList.find(client => client.id === clientId);
      if (selectedClient) {
        // 更新客戶名稱
        this.contractForm.patchValue({
          clientName: selectedClient.clientName
        });
        
        // 更新聯絡人列表
        this.contactList = selectedClient.contacts || [];
        
        // 清空聯絡人選擇
        this.contractForm.patchValue({
          contactId: '',
          projectManager: ''
        });
      }
    } else {
      this.contactList = [];
      this.contractForm.patchValue({
        clientName: '',
        contactId: '',
        projectManager: ''
      });
    }
  }

  // 聯絡人選擇變化處理
  onContactChange(contactId: string): void {
    if (contactId) {
      const selectedContact = this.contactList.find(contact => contact.id === contactId);
      if (selectedContact) {
        this.contractForm.patchValue({
          projectManager: selectedContact.name
        });
      }
    } else {
      this.contractForm.patchValue({
        projectManager: ''
      });
    }
  }

  // 載入客戶列表
  loadClients(): void {
    this.clientService.findAll().subscribe({
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
      ],
      total: 0,
      showCheckbox: true,
      loading: false,
      pageSize: 10,
      pageIndex: 1
    };
  }

  // 載入合約列表（Firestore）
  loadContracts(): void {
    console.log('🔥 開始從 Firestore 載入合約...');
    this.tableConfig.loading = true;
    this.cdr.markForCheck();
    
    // 構建查詢條件
    const searchConditions = this.buildSearchConditions();
    
    this.contractService.queryContracts(searchConditions).subscribe({
      next: (contracts: Contract[]) => {
        console.log('✅ Firestore 查詢成功:', contracts);
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

  // 載入統計數據（Firestore）
  loadStats(): void {
    console.log('📊 開始載入統計數據...');
    
    this.contractService.getContractStats().subscribe({
      next: (stats) => {
        console.log('✅ 統計數據載入成功:', stats);
        this.contractStats = stats;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('❌ 統計數據載入失敗:', error);
        this.handleFirestoreError(error);
        // 設置預設值
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
    
    // 只有在有搜索條件時才添加 where 子句
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

    if (where.length > 0) {
      conditions.where = where;
    }

    // 簡化排序，避免索引問題
    conditions.limit = 50; // 限制查詢數量，提高性能

    console.log('🔍 構建的查詢條件:', conditions);
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
    
    // 重置聯絡人列表
    this.contactList = [];
    
    this.contractForm.reset({
      contractCode: this.contractService.generateContractCode(),
      clientId: '',
      clientName: '',
      contactId: '',
      projectManager: '',
      contractName: '',
      totalAmount: null,
      progress: 0,
      status: 'active',
      description: ''
    });
    
    this.isModalVisible = true;
  }

  // 編輯合約
  editContract(contract: Contract): void {
    this.modalTitle = '編輯合約';
    this.editingContract = contract;
    
    // 找到對應的客戶
    const client = this.clientList.find(c => c.clientName === contract.clientName);
    if (client) {
      // 更新聯絡人列表
      this.contactList = client.contacts || [];
      
      // 找到對應的聯絡人
      const contact = this.contactList.find(c => c.name === contract.projectManager);
      
      this.contractForm.patchValue({
        contractCode: contract.contractCode,
        clientId: client.id,
        clientName: contract.clientName,
        contactId: contact?.id || '',
        projectManager: contract.projectManager,
        contractName: contract.contractName,
        totalAmount: contract.totalAmount,
        progress: contract.progress,
        status: contract.status,
        description: contract.description
      });
    } else {
      // 如果找不到對應的客戶，只設置基本信息
      this.contactList = [];
      this.contractForm.patchValue({
        contractCode: contract.contractCode,
        clientId: '',
        clientName: contract.clientName,
        contactId: '',
        projectManager: contract.projectManager,
        contractName: contract.contractName,
        totalAmount: contract.totalAmount,
        progress: contract.progress,
        status: contract.status,
        description: contract.description
      });
    }
    
    this.isModalVisible = true;
  }

  // 保存合約
  saveContract(): void {
    if (!this.contractForm.valid) {
      this.message.error('請填寫必填欄位');
      return;
    }

    const formData = this.contractForm.value;
    
    // 準備保存的數據，移除不需要的字段
    const contractData = {
      contractCode: formData.contractCode,
      clientName: formData.clientName,
      projectManager: formData.projectManager,
      contractName: formData.contractName,
      totalAmount: formData.totalAmount,
      progress: formData.progress,
      status: formData.status,
      description: formData.description
    };
    
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
    this.contractService.update(contract.id!, {
      progress,
      status: progress >= 100 ? 'completed' : 'active'
    }).subscribe({
      next: () => {
        this.message.success('進度更新成功');
        this.loadContracts();
        this.loadStats();
      },
      error: (error: any) => {
        console.error('更新進度失敗:', error);
        this.message.error('更新進度失敗');
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

  formatDate(date: any): string {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('zh-TW');
  }

  // 模態框事件
  handleCancel(): void {
    this.isModalVisible = false;
  }

  // 數字格式化方法
  formatNumber(value: number): string {
    if (!value) return '';
    return `NT$ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }

  parseNumber(value: string): number {
    return parseFloat(value.replace(/NT\$\s?|(,*)/g, '')) || 0;
  }
}