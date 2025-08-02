import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  paymentFlowOptions: TransferItem[] = [
    { key: PaymentFlowStatus.DRAFT, title: '草稿 - 初始草稿狀態', direction: 'right' },
    { key: PaymentFlowStatus.SUBMITTED, title: '已提交 - 已提交審核', direction: 'right' },
    { key: PaymentFlowStatus.REVIEWING, title: '審核中 - 正在審核中', direction: 'right' },
    { key: PaymentFlowStatus.APPROVED, title: '已核准 - 審核已通過', direction: 'right' },
    { key: PaymentFlowStatus.REJECTED, title: '已拒絕 - 審核被拒絕', direction: 'right' },
    { key: PaymentFlowStatus.PROCESSING, title: '處理中 - 正在處理中', direction: 'right' },
    { key: PaymentFlowStatus.COMPLETED, title: '已完成 - 流程已完成', direction: 'right' },
    { key: PaymentFlowStatus.CANCELLED, title: '已取消 - 流程已取消', direction: 'right' }
  ];

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
      const client = this.clients.find(c => c.id === id);
      if (client) client.status = status;
    });
  }

  onPaymentFlowChange(clientId: string, change: TransferChange): void {
    const flows = change.list.map(item => item['key'] as PaymentFlowStatus);
    const client = this.clients.find(c => c.id === clientId);
    if (client) client.paymentFlow = flows;
    
    this.clientService.update(clientId, { paymentFlow: flows }).subscribe({
      error: () => this.loadClients()
    });
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
