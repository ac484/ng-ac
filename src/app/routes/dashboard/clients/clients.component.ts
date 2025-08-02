import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService, Client, PaymentFlowStatus } from '../../../core/services/firestore/client.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTransferModule, TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzTableModule,
    NzTransferModule,
    NzIconModule,
    NzTagModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  addForm: FormGroup;
  loading = false;
  editing = false;
  editingClientId: string | null = null;
  statusOptions = [
    { label: '啟用', value: 'active' },
    { label: '停用', value: 'inactive' }
  ];

  // 請款流程選項 - 使用TransferItem格式
  paymentFlowOptions: TransferItem[] = [];

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.addForm = this.fb.group({
      clientCode: [{ value: this.clientService.generateClientCode(), disabled: true }],
      clientName: ['', Validators.required],
      contactPerson: [''],
      phoneNumber: [''],
      email: ['', [Validators.email]],
      address: [''],
      industry: [''],
      companySize: [''],
      status: ['active'],
      notes: [''],
      lastContactDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.initPaymentFlowOptions();
  }

  // 初始化請款流程選項
  initPaymentFlowOptions(): void {
    const flowOptions = [
      { key: PaymentFlowStatus.DRAFT, title: '草稿', description: '初始草稿狀態', order: 1 },
      { key: PaymentFlowStatus.SUBMITTED, title: '已提交', description: '已提交審核', order: 2 },
      { key: PaymentFlowStatus.REVIEWING, title: '審核中', description: '正在審核中', order: 3 },
      { key: PaymentFlowStatus.APPROVED, title: '已核准', description: '審核已通過', order: 4 },
      { key: PaymentFlowStatus.REJECTED, title: '已拒絕', description: '審核被拒絕', order: 5 },
      { key: PaymentFlowStatus.PROCESSING, title: '處理中', description: '正在處理中', order: 6 },
      { key: PaymentFlowStatus.COMPLETED, title: '已完成', description: '流程已完成', order: 7 },
      { key: PaymentFlowStatus.CANCELLED, title: '已取消', description: '流程已取消', order: 8 }
    ];

    // 按順序排序並轉換為TransferItem格式，將描述合併到title中
    // 設置direction為'right'，讓所有項目預設在右側（可選）
    this.paymentFlowOptions = flowOptions
      .sort((a, b) => a.order - b.order)
      .map(option => ({
        key: option.key,
        title: `${option.title} - ${option.description}`,
        description: option.description,
        disabled: false,
        checked: false,
        direction: 'right' // 預設在右側（可選）
      }));
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe((data: Client[]) => {
      this.clients = data;
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.addForm.invalid) {
      Object.values(this.addForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }
    const formValue = this.addForm.getRawValue();
    
    // 移除paymentFlow，讓它保持undefined，這樣transfer組件會正確處理
    delete formValue.paymentFlow;
    
    if (this.editing && this.editingClientId) {
      this.clientService.update(this.editingClientId, formValue).subscribe(() => {
        this.resetForm();
        this.loadClients();
      });
    } else {
      this.clientService.create(formValue).subscribe(() => {
        this.resetForm();
        this.loadClients();
      });
    }
  }

  onEdit(client: Client): void {
    this.editing = true;
    this.editingClientId = client.id || null;
    this.addForm.patchValue({
      clientCode: client.clientCode,
      clientName: client.clientName,
      contactPerson: client.contactPerson,
      phoneNumber: client.phoneNumber,
      email: client.email,
      address: client.address,
      industry: client.industry,
      companySize: client.companySize,
      status: client.status,
      notes: client.notes,
      lastContactDate: client.lastContactDate || null
    });
  }

  onDelete(id: string): void {
    this.clientService.delete(id).subscribe(() => this.loadClients());
  }

  updateStatus(id: string, status: 'active' | 'inactive'): void {
    this.clientService.update(id, { status }).subscribe(() => {
      // 更新本地數據
      const client = this.clients.find(c => c.id === id);
      if (client) {
        client.status = status;
      }
    });
  }

  // 處理請款流程變更
  onPaymentFlowChange(clientId: string, change: TransferChange): void {
    // 從TransferChange中提取已選中的項目
    const flows = change.list.map(item => item['key'] as PaymentFlowStatus);
    
    // 立即更新本地數據，防止重新渲染問題
    const client = this.clients.find(c => c.id === clientId);
    if (client) {
      client.paymentFlow = flows;
    }
    
    // 異步更新Firestore，不等待響應
    this.clientService.update(clientId, { paymentFlow: flows }).subscribe({
      error: (error) => {
        console.error('更新請款流程失敗:', error);
        // 如果更新失敗，恢復本地數據
        if (client) {
          this.loadClients();
        }
      }
    });
  }

  // 獲取客戶的請款流程（已選中的項目）
  getClientPaymentFlows(client: Client): PaymentFlowStatus[] {
    // 動態更新paymentFlowOptions的direction
    this.paymentFlowOptions.forEach(option => {
      const key = option['key'] as PaymentFlowStatus;
      if (client.paymentFlow && client.paymentFlow.includes(key)) {
        option.direction = 'left'; // 已選項目在左側
      } else {
        option.direction = 'right'; // 未選項目在右側
      }
    });
    
    return client.paymentFlow || [];
  }

  onCancel(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.editing = false;
    this.editingClientId = null;
    this.addForm.reset({
      clientCode: this.clientService.generateClientCode(),
      clientName: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      address: '',
      industry: '',
      companySize: '',
      status: 'active',
      notes: '',
      lastContactDate: null
    });
  }
}
