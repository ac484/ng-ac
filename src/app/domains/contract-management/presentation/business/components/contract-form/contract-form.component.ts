import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

import {
  Contract,
  ContractType,
  ContractStatus,
  RiskLevel,
  PaymentStatus,
  CreateContractProps,
  ContractEntity
} from '../../../../domain/entities/contract.entity';
import { ContractTypeSelectComponent } from '../../../../presentation/shared/components/contract-type-select';

@Component({
  selector: 'app-contract-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzAlertModule,
    ContractTypeSelectComponent
  ],
  template: `
    <form nz-form [formGroup]="contractForm" (ngSubmit)="onSubmit()">
      <nz-card [nzTitle]="isEdit ? '編輯合約' : '新增合約'">
        <!-- 合約編號顯示 -->
        @if (!isEdit) {
          <nz-alert nzType="info" nzMessage="合約編號將自動生成" nzDescription="格式：YYYYMMDDHHMM (年+月+日+時分)" class="mb-4">
          </nz-alert>
        }

        <!-- 基本信息 -->
        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>合約名稱</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入合約名稱">
                <input nz-input formControlName="contractName" placeholder="請輸入合約名稱" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>合約類型</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請選擇合約類型">
                <app-contract-type-select formControlName="contractType" placeholder="請選擇合約類型"> </app-contract-type-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>風險等級</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請選擇風險等級">
                <nz-select formControlName="riskLevel" placeholder="請選擇風險等級">
                  <nz-option nzValue="low" nzLabel="低風險"></nz-option>
                  <nz-option nzValue="medium" nzLabel="中風險"></nz-option>
                  <nz-option nzValue="high" nzLabel="高風險"></nz-option>
                  <nz-option nzValue="critical" nzLabel="極高風險"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <!-- 客戶信息 -->
        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>客戶公司</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入客戶公司">
                <input nz-input formControlName="clientCompany" placeholder="請輸入客戶公司" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>客戶代表</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入客戶代表">
                <input nz-input formControlName="clientRepresentative" placeholder="請輸入客戶代表" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6">聯繫電話</nz-form-label>
              <nz-form-control [nzSpan]="18">
                <input nz-input formControlName="clientContact" placeholder="請輸入聯繫電話" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6">電子郵件</nz-form-label>
              <nz-form-control [nzSpan]="18">
                <input nz-input formControlName="clientEmail" placeholder="請輸入電子郵件" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <!-- 合約信息 -->
        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>結束日期</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請選擇結束日期">
                <nz-date-picker formControlName="endDate" style="width: 100%"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>總金額</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入總金額">
                <nz-input-number formControlName="totalAmount" [nzMin]="0" [nzStep]="1000" placeholder="請輸入總金額" style="width: 100%">
                </nz-input-number>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="12">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>幣種</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請選擇幣種">
                <nz-select formControlName="currency" placeholder="請選擇幣種">
                  <nz-option nzValue="TWD" nzLabel="新台幣"></nz-option>
                  <nz-option nzValue="USD" nzLabel="美元"></nz-option>
                  <nz-option nzValue="EUR" nzLabel="歐元"></nz-option>
                  <nz-option nzValue="JPY" nzLabel="日圓"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <!-- 操作按鈕 -->
        <div nz-row>
          <nz-col [nzSpan]="24" style="text-align: center;">
            <button nz-button nzType="primary" [nzLoading]="loading" type="submit">
              {{ isEdit ? '更新合約' : '新增合約' }}
            </button>
            <button nz-button type="button" (click)="onCancel()" style="margin-left: 8px;"> 取消 </button>
          </nz-col>
        </div>
      </nz-card>
    </form>
  `,
  styles: [
    `
      .mb-4 {
        margin-bottom: 16px;
      }
    `
  ]
})
export class ContractFormComponent implements OnInit {
  @Input() contract?: Contract;
  @Input() loading = false;
  @Input() isEdit = false;
  @Output() readonly submit = new EventEmitter<Contract>();
  @Output() readonly cancel = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  contractForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contractForm = this.fb.group({
      contractName: ['', [Validators.required]],
      contractType: [ContractType.PURE_LABOR, [Validators.required]],
      riskLevel: [RiskLevel.LOW, [Validators.required]],
      clientCompany: ['', [Validators.required]],
      clientRepresentative: ['', [Validators.required]],
      clientContact: [''],
      clientEmail: [''],
      endDate: [null, [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0)]],
      currency: ['TWD', [Validators.required]],
      status: [ContractStatus.DRAFT],
      paymentStatus: [PaymentStatus.PENDING],
      paidAmount: [0],
      paymentSchedule: [[]],
      approvalStatus: [
        {
          status: 'pending',
          currentStep: 1,
          totalSteps: 3
        }
      ],
      approvers: [[]],
      documents: [[]],
      risks: [[]]
    });

    if (this.contract) {
      this.contractForm.patchValue(this.contract);
    }
  }

  onSubmit(): void {
    if (this.contractForm.valid) {
      const formValue = this.contractForm.value;

      if (this.isEdit && this.contract) {
        // 編輯模式：保留原有的合約編號
        const contract: Contract = {
          ...this.contract,
          ...formValue
        };
        this.submit.emit(contract);
      } else {
        // 新增模式：使用 CreateContractProps
        const createProps: CreateContractProps = {
          contractName: formValue.contractName,
          contractType: formValue.contractType,
          riskLevel: formValue.riskLevel,
          clientCompany: formValue.clientCompany,
          clientRepresentative: formValue.clientRepresentative,
          clientContact: formValue.clientContact,
          clientEmail: formValue.clientEmail,
          endDate: formValue.endDate,
          totalAmount: formValue.totalAmount,
          currency: formValue.currency,
          paymentStatus: formValue.paymentStatus,
          paidAmount: formValue.paidAmount,
          paymentSchedule: formValue.paymentSchedule,
          approvalStatus: formValue.approvalStatus,
          approvers: formValue.approvers,
          documents: formValue.documents,
          risks: formValue.risks
        };

        // 使用 ContractEntity.create 來創建合約
        const contract = ContractEntity.create(createProps);
        this.submit.emit(contract);
      }
    } else {
      Object.values(this.contractForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
