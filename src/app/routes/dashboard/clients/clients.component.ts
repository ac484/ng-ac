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
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { CardTableWrapComponent } from '../../../shared/components/card-table-wrap/card-table-wrap.component';

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
    NzTagModule,
    NzPopconfirmModule,
    CardTableWrapComponent
  ],
  template: `
    <form nz-form [formGroup]="addForm" (ngSubmit)="onSubmit()" class="add-form">
      <nz-row nzGutter="16">
        <nz-col nzSpan="8">
          <nz-form-item>
            <nz-form-label nzFor="clientCode">客戶編號</nz-form-label>
            <nz-form-control>
              <input nz-input formControlName="clientCode" id="clientCode" readonly />
            </nz-form-control>
          </nz-form-item>
        </nz-col>
        <nz-col nzSpan="8">
          <nz-form-item nzRequired>
            <nz-form-label nzFor="clientName">客戶名稱</nz-form-label>
            <nz-form-control nzErrorTip="請輸入客戶名稱">
              <input nz-input formControlName="clientName" id="clientName" />
            </nz-form-control>
          </nz-form-item>
        </nz-col>
        <nz-col nzSpan="8" class="form-action">
          <button nz-button nzType="primary" [disabled]="addForm.invalid">{{ editing ? '更新客戶' : '新增客戶' }}</button>
          <button nz-button (click)="onCancel()" *ngIf="editing" style="margin-left:8px;">取消</button>
        </nz-col>
      </nz-row>
    </form>

    <app-card-table-wrap tableTitle="客戶管理">
      <nz-table #clientTable [nzData]="clientsWithExpand" [nzLoading]="loading" nzBordered>
        <thead>
          <tr>
            <th></th>
            <th>編號</th>
            <th>名稱</th>
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
                <a nz-button nzType="link" nzDanger nz-popconfirm nzPopconfirmTitle="確定要刪除此客戶嗎?" (nzOnConfirm)="onDelete(client.id!)">刪除</a>
              </td>
            </tr>
            <tr [nzExpand]="client.expand">
              <td colspan="6">
                <button nz-button (click)="addContact(client)" nzType="primary" style="margin-bottom: 8px;">新增聯絡人</button>
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
                    @for (contact of innerTable.data; track contact.id || contact.name) {
                      <tr class="editable-row">
                        <td>
                          <div class="editable-cell" [hidden]="editContactId === (contact.id || contact.name)" (click)="startEditContact(contact.id || contact.name)">
                            {{ contact.name }}
                          </div>
                          <input [hidden]="editContactId !== (contact.id || contact.name)" type="text" nz-input [(ngModel)]="contact.name" (blur)="stopEditContact()" />
                        </td>
                        <td>
                          <div class="editable-cell" [hidden]="editContactPhone === contact.phone" (click)="startEditContactPhone(contact.phone)">
                            {{ contact.phone }}
                          </div>
                          <input [hidden]="editContactPhone !== contact.phone" type="text" nz-input [(ngModel)]="contact.phone" (blur)="stopEditContactPhone()" />
                        </td>
                        <td>
                          <div class="editable-cell" [hidden]="editContactEmail === contact.email" (click)="startEditContactEmail(contact.email)">
                            {{ contact.email }}
                          </div>
                          <input [hidden]="editContactEmail !== contact.email" type="text" nz-input [(ngModel)]="contact.email" (blur)="stopEditContactEmail()" />
                        </td>
                        <td>
                          <a nz-popconfirm nzPopconfirmTitle="確定要刪除此聯絡人嗎?" (nzOnConfirm)="deleteContact(client, contact)">刪除</a>
                        </td>
                      </tr>
                    }
                  </tbody>
                </nz-table>
              </td>
            </tr>
          }
        </tbody>
      </nz-table>
    </app-card-table-wrap>
  `,
  styles: [
    `
      .editable-cell {
        position: relative;
        padding: 5px 12px;
        cursor: pointer;
      }

      .editable-row:hover .editable-cell {
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 11px;
      }
    `
  ]
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  clientsWithExpand: ClientWithExpand[] = [];
  addForm: FormGroup;
  loading = false;
  editing = false;
  editingClientId: string | null = null;
  
  // 聯絡人編輯狀態
  editContactId: string | null = null;
  editContactPhone: string | null = null;
  editContactEmail: string | null = null;
  
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
    delete formValue.paymentFlow; // 移除不需要的字段
    
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

  // 聯絡人編輯方法
  startEditContact(name: string): void {
    this.editContactId = name;
  }

  stopEditContact(): void {
    this.editContactId = null;
  }

  startEditContactPhone(phone: string): void {
    this.editContactPhone = phone;
  }

  stopEditContactPhone(): void {
    this.editContactPhone = null;
  }

  startEditContactEmail(email: string): void {
    this.editContactEmail = email;
  }

  stopEditContactEmail(): void {
    this.editContactEmail = null;
  }

  addContact(client: Client): void {
    if (!client.contacts) {
      client.contacts = [];
    }
    client.contacts.push({
      id: this.generateContactId(),
      name: '新聯絡人',
      phone: '',
      email: ''
    });
    this.updateClientContacts(client);
  }

  deleteContact(client: Client, contact: ContactInfo): void {
    if (client.contacts) {
      client.contacts = client.contacts.filter(c => c.id !== contact.id);
      this.updateClientContacts(client);
    }
  }

  private updateClientContacts(client: Client): void {
    this.clientService.update(client.id!, { contacts: client.contacts }).subscribe({
      error: () => this.loadClients()
    });
  }

  private generateContactId(): string {
    return 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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
      companySize: '',
      status: 'active',
      notes: '',
      lastContactDate: null
    });
  }
}