import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTransferModule, TransferItem } from 'ng-zorro-antd/transfer';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ClientService, Client, PaymentFlowStatus } from '../../../core/services/firestore/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTransferModule
  ]
})
export class ClientsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  clients: Client[] = [];
  loading = false;
  saving = false; // 保存時的加載狀態

  clientForm!: FormGroup;
  isModalVisible = false;
  isEdit = false;

  paymentFlowStatusList: TransferItem[] = [];

  ngOnInit(): void {
    this.initForm();
    this.initPaymentFlow();
    this.loadClients();
  }

  private initForm(): void {
    this.clientForm = this.fb.group({
      id: [null],
      clientCode: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      contactPerson: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.email]],
      address: [''],
      industry: [''],
      companySize: [''],
      status: ['active', [Validators.required]],
      notes: [''],
      paymentFlow: [[]]
    });
  }

  private initPaymentFlow(): void {
    this.paymentFlowStatusList = Object.values(PaymentFlowStatus).map(status => ({
      key: status,
      title: status,
      description: '',
      disabled: false
    }));
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.findAll().subscribe({
      next: (arr: Client[]) => {
        this.clients = arr;
        this.loading = false;
      },
      error: () => {
        this.message.error('載入客戶失敗');
        this.loading = false;
      }
    });
  }

  openAddModal(): void {
    this.isEdit = false;
    // Generate and pre-fill default client data
    const defaultCode = this.clientService.generateClientCode();
    this.clientForm.reset({
      id: null,
      clientCode: defaultCode,
      clientName: '',
      contactPerson: '',
      phoneNumber: '',
      email: '',
      address: '',
      industry: '',
      companySize: '',
      status: 'active',
      notes: '',
      paymentFlow: []
    });
    this.saving = false;
    this.isModalVisible = true;
  }

  openEditModal(client: Client): void {
    this.isEdit = true;
    this.clientForm.patchValue({ ...client });
    this.isModalVisible = true;
    this.saving = false;
  }

  // onFlowChange 已移除，改用 formControlName 綁定

  saveClient(): void {
    this.saving = true;
    const data = this.clientForm.value;
    const obs = this.isEdit
      ? this.clientService.update(data.id, data)
      : this.clientService.create(data);
    (obs as any).subscribe(
      () => {
        this.message.success('保存成功');
        this.isModalVisible = false;
        this.loadClients();
        this.saving = false;
      },
      () => {
        this.message.error('保存失敗');
        this.saving = false;
      }
    );
  }

  deleteClient(client: Client): void {
    (this.clientService.delete(client.id!) as any).subscribe(
      () => {
        this.message.success('刪除成功');
        this.loadClients();
      },
      () => {
        this.message.error('刪除失敗');
      }
    );
  }
}
