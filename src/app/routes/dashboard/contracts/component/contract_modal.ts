/**
 * 合約新增/編輯模態框組件
 * 處理合約的新增和編輯表單
 */

import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Contract } from '../../../../core/services/firestore/contract.service';
import { Client, ContactInfo } from '../../../../core/services/firestore/client.service';

import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';

export interface StatusOption {
  label: string;
  value: string;
  color: string;
}

@Component({
  selector: 'app-contract-modal',
  template: `
    <nz-modal 
      [(nzVisible)]="visible" 
      [nzTitle]="title" 
      [nzWidth]="800" 
      [nzFooter]="modalFooter"
      (nzOnCancel)="onCancel()">

      <ng-container *nzModalContent>
        <form nz-form [formGroup]="contractForm" nzLayout="vertical">
          <div nz-row [nzGutter]="16">
            <!-- 合約編號 -->
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>合約編號</nz-form-label>
                <nz-form-control nzErrorTip="請輸入合約編號">
                  <input nz-input formControlName="contractCode" placeholder="請輸入合約編號" />
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 客戶選擇 -->
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>客戶</nz-form-label>
                <nz-form-control nzErrorTip="請選擇客戶">
                  <nz-select 
                    formControlName="clientId" 
                    nzPlaceHolder="請選擇客戶"
                    (ngModelChange)="onClientChange($event)">
                    @for (client of clientList; track client.id) {
                      <nz-option [nzValue]="client.id" [nzLabel]="client.clientName"></nz-option>
                    }
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 專案經理 -->
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>專案經理</nz-form-label>
                <nz-form-control nzErrorTip="請選擇專案經理">
                  <nz-select 
                    formControlName="contactId" 
                    nzPlaceHolder="請選擇專案經理"
                    (ngModelChange)="onContactChange($event)">
                    @for (contact of contactList; track contact.id) {
                      <nz-option [nzValue]="contact.id" [nzLabel]="contact.name"></nz-option>
                    }
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 合約名稱 -->
            <div nz-col [nzSpan]="24">
              <nz-form-item>
                <nz-form-label nzRequired>合約名稱</nz-form-label>
                <nz-form-control nzErrorTip="請輸入合約名稱">
                  <input nz-input formControlName="contractName" placeholder="請輸入合約名稱" />
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 總金額 -->
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label nzRequired>總金額</nz-form-label>
                <nz-form-control nzErrorTip="請輸入總金額">
                  <nz-input-number 
                    formControlName="totalAmount" 
                    [nzMin]="0" 
                    [nzFormatter]="formatNumber"
                    [nzParser]="parseNumber" 
                    nzPlaceHolder="請輸入總金額" 
                    style="width: 100%">
                  </nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 進度 -->
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label nzRequired>進度</nz-form-label>
                <nz-form-control nzErrorTip="請輸入進度">
                  <nz-input-number 
                    formControlName="progress" 
                    [nzMin]="0" 
                    [nzMax]="100" 
                    nzPlaceHolder="0-100"
                    style="width: 100%">
                  </nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 狀態 -->
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label nzRequired>狀態</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="status">
                    @for (option of statusOptions; track option.value) {
                      <nz-option [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
                    }
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            
            <!-- 合約描述 -->
            <div nz-col [nzSpan]="24">
              <nz-form-item>
                <nz-form-label>合約描述</nz-form-label>
                <nz-form-control>
                  <textarea nz-input formControlName="description" rows="3" placeholder="請輸入合約描述"></textarea>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </form>
      </ng-container>

      <ng-template #modalFooter>
        <button nz-button nzType="default" (click)="onCancel()">取消</button>
        <button nz-button nzType="primary" [nzLoading]="loading" (click)="onSave()">
          {{ editingContract ? '更新' : '新增' }}
        </button>
      </ng-template>
    </nz-modal>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzModalModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzButtonModule
  ]
})
export class ContractModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() title = '新增合約';
  @Input() editingContract: Contract | null = null;
  @Input() clientList: Client[] = [];
  @Input() statusOptions: StatusOption[] = [];
  @Input() loading = false;
  @Input() defaultContractCode = '';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  contractForm!: FormGroup;
  contactList: ContactInfo[] = [];
  
  private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editingContract'] && this.contractForm) {
      this.updateFormData();
    }
    
    if (changes['visible'] && this.visible && !this.editingContract && this.contractForm) {
      this.resetForm();
    }
  }

  private initForm(): void {
    this.contractForm = this.fb.group({
      contractCode: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      clientName: ['', [Validators.required]],
      contactId: ['', [Validators.required]],
      projectManager: ['', [Validators.required]],
      contractName: ['', [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      status: ['draft', [Validators.required]],
      description: ['']
    });

    // 監聽客戶選擇變化
    this.contractForm.get('clientId')?.valueChanges.subscribe(clientId => {
      this.onClientChange(clientId);
    });
  }

  private updateFormData(): void {
    if (this.editingContract) {
      // 找到對應的客戶
      const client = this.clientList.find(c => c.clientName === this.editingContract!.clientName);
      if (client) {
        // 更新聯絡人列表
        this.contactList = client.contacts || [];
        
        // 找到對應的聯絡人
        const contact = this.contactList.find(c => c.name === this.editingContract!.projectManager);
        
        this.contractForm.patchValue({
          contractCode: this.editingContract.contractCode,
          clientId: client.id,
          clientName: this.editingContract.clientName,
          contactId: contact?.id || '',
          projectManager: this.editingContract.projectManager,
          contractName: this.editingContract.contractName,
          totalAmount: this.editingContract.totalAmount,
          progress: this.editingContract.progress,
          status: this.editingContract.status,
          description: this.editingContract.description
        });
      } else {
        // 如果找不到對應的客戶，只設置基本信息
        this.contactList = [];
        this.contractForm.patchValue({
          contractCode: this.editingContract.contractCode,
          clientId: '',
          clientName: this.editingContract.clientName,
          contactId: '',
          projectManager: this.editingContract.projectManager,
          contractName: this.editingContract.contractName,
          totalAmount: this.editingContract.totalAmount,
          progress: this.editingContract.progress,
          status: this.editingContract.status,
          description: this.editingContract.description
        });
      }
    }
  }

  private resetForm(): void {
    this.contactList = [];
    this.contractForm.reset({
      contractCode: this.defaultContractCode,
      clientId: '',
      clientName: '',
      contactId: '',
      projectManager: '',
      contractName: '',
      totalAmount: null,
      progress: 0,
      status: 'draft',
      description: ''
    });
  }

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

  onSave(): void {
    if (this.contractForm.valid) {
      const formData = this.contractForm.value;
      console.log('💰 表單數據:', formData);
      console.log('💰 金額字段:', formData.totalAmount, typeof formData.totalAmount);
      
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
      
      console.log('💰 準備保存的合約數據:', contractData);
      this.save.emit(contractData);
    }
  }

  onCancel(): void {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }

  // 數字格式化方法
  formatNumber = (value: number): string => {
    if (value === null || value === undefined) return '';
    return `NT$ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  parseNumber = (value: string): number => {
    if (!value) return 0;
    return parseFloat(value.replace(/NT\$\s?|(,*)/g, '')) || 0;
  };
}