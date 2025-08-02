import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService, Client, PaymentFlowStatus, ContactInfo } from '../../../core/services/firestore/client.service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTransferModule, TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';

interface ClientWithExpand extends Client {
  expand: boolean;
}

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
  template: `
    <form nz-form [formGroup]="addForm" (ngSubmit)="onSubmit()" class="add-form">
      <nz-row nzGutter="16">
        <nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="clientCode">客戶編號</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="clientCode" id="clientCode" readonly />
            </nz-form-control>
          </nz-form-item>
        </nz-col>
        <nz-col nzSpan="6">
          <nz-form-item nzRequired>
            <nz-form-label nzFor="clientName">客戶名稱</nz-form-label>
            <nz-form-control nzErrorTip="請輸入客戶名稱">
              <input nz-input formControlName="clientName" id="clientName" />
            </nz-form-control>
          </nz-form-item>
        </nz-col>
        <nz-col nzSpan="6">
          <nz-form-item>
            <nz-form-label nzFor="address">地址</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="address" id="address" />
            </nz-form-control>
          </nz-form-item>
        </nz-col>
        <nz-col nzSpan="6" class="form-action">
          <button nz-button nzType="primary" [disabled]="addForm.invalid">{{ editing ? '更新客戶' : '新增客戶' }}</button>
          <button nz-button (click)="onCancel()" *ngIf="editing" style="margin-left:8px;">取消</button>
        </nz-col>
      </nz-row>
    </form>

    <nz-table #clientTable [nzData]="clientsWithExpand" [nzLoading]="loading" nzBordered>
      <thead>
        <tr>
          <th></th>
          <th>編號</th>
          <th>名稱</th>
          <th>地址</th>
          <th>產業</th>
          <th>狀態</th>
          <th>請款流程</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        @for (client of clientTable.data; track client.id) {
          <tr>
            <td [(nzExpand)]="client.expand"></td>
            <td>{{ client.clientCode }}</td>
            <td>{{ client.clientName }}</td>
            <td>{{ client.address }}</td>
            <td>{{ client.industry }}</td>
            <td>
              <nz-select [ngModel]="client.status" (ngModelChange)="updateStatus(client.id!, $event)" style="width: 100px;">
                @for (o of statusOptions; track o.value) {
                  <nz-option [nzLabel]="o.label" [nzValue]="o.value"></nz-option>
                }
              </nz-select>
            </td>
            <td class="payment-flow-cell">
              <nz-transfer [nzDataSource]="paymentFlowOptions" [nzTitles]="['已選', '可選']" [nzOperations]="['←', '→']"
                [nzShowSearch]="false" [nzShowSelectAll]="true" (nzChange)="onPaymentFlowChange(client.id!, $event)"
                [nzListStyle]="{ 'width': '180px', 'height': '200px' }">
              </nz-transfer>
            </td>
            <td>
              <a nz-button nzType="link" (click)="onEdit(client)">編輯</a>
              <a nz-button nzType="link" nzDanger (click)="onDelete(client.id!)">刪除</a>
            </td>
          </tr>
          <tr [nzExpand]="client.expand">
            <nz-table #innerTable [nzData]="client.contacts || []" nzSize="middle" [nzShowPagination]="false">
              <thead>
                <tr>
                  <th>聯絡人姓名</th>
                  <th>電話號碼</th>
                  <th>電子郵件</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                @for (contact of innerTable.data; track contact.name) {
                  <tr>
                    <td>{{ contact.name }}</td>
                    <td>{{ contact.phone }}</td>
                    <td>{{ contact.email }}</td>
                    <td>
                      <a nz-button nzType="link" (click)="editContact(client, contact)">編輯</a>
                      <a nz-button nzType="link" nzDanger (click)="deleteContact(client, contact)">刪除</a>
                    </td>
                  </tr>
                }
              </tbody>
            </nz-table>
          </tr>
        }
      </tbody>
    </nz-table>
  `
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  clientsWithExpand: ClientWithExpand[] = [];
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
      this.clientsWithExpand = data.map(client => ({
        ...client,
        expand: false
      }));
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
      const client = this.clientsWithExpand.find(c => c.id === id);
      if (client) client.status = status;
    });
  }

  onPaymentFlowChange(clientId: string, change: TransferChange): void {
    const flows = change.list.map(item => item['key'] as PaymentFlowStatus);
    const client = this.clientsWithExpand.find(c => c.id === clientId);
    if (client) client.paymentFlow = flows;
    
    this.clientService.update(clientId, { paymentFlow: flows }).subscribe({
      error: () => this.loadClients()
    });
  }

  editContact(client: Client, contact: ContactInfo): void {
    // TODO: 實現聯絡人編輯功能
    console.log('編輯聯絡人:', contact);
  }

  deleteContact(client: Client, contact: ContactInfo): void {
    // TODO: 實現聯絡人刪除功能
    console.log('刪除聯絡人:', contact);
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
      address: '',
      industry: '',
      companySize: '',
      status: 'active',
      notes: '',
      lastContactDate: null
    });
  }
}
