import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ContractApplicationService } from '../../../application/services/contract-application.service';
import { ContractDto } from '../../../application/dto/contract.dto';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzCardModule,
    NzDividerModule,
    NzIconModule
  ],
  template: `
    <div class="contract-form-container">
      <nz-card [nzTitle]="isEditMode ? '編輯合約' : '新增合約'" class="form-card">
        <form nz-form [formGroup]="contractForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3>基本資訊</h3>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6" nzRequired>合約編號</nz-form-label>
                  <nz-form-control [nzSpan]="18" nzErrorTip="合約編號將自動生成">
                    <input nz-input formControlName="contractNumber" placeholder="合約編號將自動生成" [readonly]="true" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6" nzRequired>合約名稱</nz-form-label>
                  <nz-form-control [nzSpan]="18" nzErrorTip="請輸入合約名稱">
                    <input nz-input formControlName="contractName" placeholder="請輸入合約名稱" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6" nzRequired>總金額</nz-form-label>
                  <nz-form-control [nzSpan]="18" nzErrorTip="請輸入有效金額">
                    <nz-input-number 
                      formControlName="amount" 
                      [nzMin]="0" 
                      [nzStep]="1000"
                      [nzFormatter]="formatCurrency"
                      [nzParser]="parseCurrency"
                      style="width: 100%"
                      placeholder="請輸入金額" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6" nzRequired>合約狀態</nz-form-label>
                  <nz-form-control [nzSpan]="18" nzErrorTip="請選擇合約狀態">
                    <nz-select formControlName="status" placeholder="請選擇狀態">
                      <nz-option nzValue="draft" nzLabel="草稿"></nz-option>
                      <nz-option nzValue="preparing" nzLabel="籌備中"></nz-option>
                      <nz-option nzValue="in_progress" nzLabel="進行中"></nz-option>
                      <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
          </div>

          <nz-divider></nz-divider>

          <div class="form-section">
            <h3>客戶資訊</h3>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6" nzRequired>客戶名稱</nz-form-label>
                  <nz-form-control [nzSpan]="18" nzErrorTip="請輸入客戶名稱">
                    <input nz-input formControlName="clientName" placeholder="請輸入客戶名稱" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6">客戶代表</nz-form-label>
                  <nz-form-control [nzSpan]="18">
                    <input nz-input formControlName="clientRepresentative" placeholder="請輸入客戶代表" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6">聯絡人</nz-form-label>
                  <nz-form-control [nzSpan]="18">
                    <input nz-input formControlName="contactPerson" placeholder="請輸入聯絡人" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label [nzSpan]="6">聯絡電話</nz-form-label>
                  <nz-form-control [nzSpan]="18">
                    <input nz-input formControlName="contactPhone" placeholder="請輸入聯絡電話" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="24">
                <nz-form-item>
                  <nz-form-label [nzSpan]="3">備註</nz-form-label>
                  <nz-form-control [nzSpan]="21">
                    <textarea 
                      nz-input 
                      formControlName="notes" 
                      [nzAutosize]="{ minRows: 3, maxRows: 6 }"
                      placeholder="請輸入備註說明"></textarea>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button nz-button nzType="default" (click)="onCancel()">
              <span nz-icon nzType="close"></span>
              取消
            </button>
            <button nz-button nzType="primary" [nzLoading]="loading" type="submit">
              <span nz-icon nzType="save"></span>
              {{ isEditMode ? '更新' : '建立' }}
            </button>
          </div>
        </form>
      </nz-card>
    </div>
  `,
  styles: [`
    .contract-form-container {
      padding: 24px;
    }
    
    .form-card {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .form-section {
      margin-bottom: 24px;
    }
    
    .form-section h3 {
      margin-bottom: 16px;
      color: #1890ff;
      font-weight: 600;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #f0f0f0;
    }
    
    nz-form-item {
      margin-bottom: 16px;
    }
  `]
})
export class ContractFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly contractApplicationService = inject(ContractApplicationService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  contractForm!: FormGroup;
  loading = false;
  isEditMode = false;
  contractId?: string;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.contractForm = this.fb.group({
      contractNumber: ['', [Validators.required, Validators.minLength(3)]],
      contractName: ['', [Validators.required, Validators.minLength(2)]],
      amount: [0, [Validators.required, Validators.min(0)]],
      status: ['draft', [Validators.required]],
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientRepresentative: [''],
      contactPerson: [''],
      contactPhone: [''],
      notes: ['']
    });

    // Auto-generate contract number for new contracts
    if (!this.isEditMode) {
      this.generateContractNumber();
    }
  }

  private generateContractNumber(): void {
    const today = new Date();
    const dateStr = today.getFullYear().toString() +
                    String(today.getMonth() + 1).padStart(2, '0') +
                    String(today.getDate()).padStart(2, '0');
    
    // Use timestamp-based sequence for now
    const timestamp = Date.now();
    const sequence = timestamp % 10000;
    const contractNumber = `${dateStr}${String(sequence).padStart(4, '0')}`;
    
    this.contractForm.patchValue({ contractNumber });
  }

  private async checkEditMode(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contractId = id;
      await this.loadContract(id);
    }
  }

  private async loadContract(id: string): Promise<void> {
    try {
      this.loading = true;
      const contract = await this.contractApplicationService.getContract(id);
      this.contractForm.patchValue(contract);
    } catch (error) {
      this.message.error('載入合約資料失敗');
      this.router.navigate(['/contracts']);
    } finally {
      this.loading = false;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.contractForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    try {
      this.loading = true;
      const formValue = this.contractForm.value;
      
      if (this.isEditMode && this.contractId) {
        await this.contractApplicationService.updateContract(this.contractId, formValue);
        this.message.success('合約更新成功');
      } else {
        await this.contractApplicationService.createContract(formValue);
        this.message.success('合約建立成功');
      }
      
      this.router.navigate(['/contracts']);
    } catch (error) {
      console.error('Contract creation/update error:', error);
      this.message.error(this.isEditMode ? '合約更新失敗' : '合約建立失敗');
    } finally {
      this.loading = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/contracts']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.contractForm.controls).forEach(key => {
      const control = this.contractForm.get(key);
      control?.markAsTouched();
    });
  }

  formatCurrency = (value: number): string => {
    return `NT$ ${value}`;
  }

  parseCurrency = (value: string): number => {
    return Number(value.replace('NT$ ', ''));
  }
} 