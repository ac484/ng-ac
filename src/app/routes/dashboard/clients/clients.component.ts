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
import { NzTransferModule, TransferChange } from 'ng-zorro-antd/transfer';

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
    NzTransferModule
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

  // 請款流程選項
  paymentFlowOptions = [
    { key: PaymentFlowStatus.DRAFT, title: '草稿', disabled: false },
    { key: PaymentFlowStatus.SUBMITTED, title: '已提交', disabled: false },
    { key: PaymentFlowStatus.REVIEWING, title: '審核中', disabled: false },
    { key: PaymentFlowStatus.APPROVED, title: '已核准', disabled: false },
    { key: PaymentFlowStatus.REJECTED, title: '已拒絕', disabled: false },
    { key: PaymentFlowStatus.PROCESSING, title: '處理中', disabled: false },
    { key: PaymentFlowStatus.COMPLETED, title: '已完成', disabled: false },
    { key: PaymentFlowStatus.CANCELLED, title: '已取消', disabled: false }
  ];

  // 當前選中的請款流程
  selectedPaymentFlows: PaymentFlowStatus[] = [];

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
    this.clientService.update(clientId, { paymentFlow: flows }).subscribe(() => {
      // 更新本地數據
      const client = this.clients.find(c => c.id === clientId);
      if (client) {
        client.paymentFlow = flows;
      }
    });
  }

  // 獲取客戶的請款流程
  getClientPaymentFlows(client: Client): PaymentFlowStatus[] {
    return client.paymentFlow || [];
  }

  // 獲取客戶的請款流程選項
  getClientPaymentFlowOptions(client: Client): Array<{ key: PaymentFlowStatus; title: string; disabled: boolean }> {
    const currentFlows = this.getClientPaymentFlows(client);
    // 左邊顯示已選項目，右邊顯示可選項目
    return this.paymentFlowOptions.map(option => ({
      ...option,
      disabled: !currentFlows.includes(option.key) // 已選的項目在左邊，未選的在右邊
    }));
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
