import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContractService } from '../../../application/services/contract.service';
import { Contract } from '../../../domain/entities/contract.entity';

@Component({
  selector: 'app-contract-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzButtonModule,
    NzCardModule,
    NzTypographyModule,
    NzGridModule
  ],
  template: `
    <nz-card>
      <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
        <nz-col>
          <h2 nz-typography>新增合約</h2>
        </nz-col>
        <nz-col>
          <button nz-button (click)="goBack()">
            返回列表
          </button>
        </nz-col>
      </div>

      <form nz-form [formGroup]="contractForm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>合約編號</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="請輸入合約編號">
            <input nz-input formControlName="contractNumber" placeholder="請輸入合約編號" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>合約名稱</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="請輸入合約名稱">
            <input nz-input formControlName="contractName" placeholder="請輸入合約名稱" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>客戶公司</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="請輸入客戶公司">
            <input nz-input formControlName="clientCompany" placeholder="請輸入客戶公司" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>客戶代表</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="請輸入客戶代表">
            <input nz-input formControlName="clientRepresentative" placeholder="請輸入客戶代表" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="4" nzRequired>總金額</nz-form-label>
          <nz-form-control [nzSpan]="20" nzErrorTip="請輸入總金額">
            <nz-input-number
              formControlName="totalAmount"
              [nzMin]="0"
              [nzStep]="1000"
              placeholder="請輸入總金額"
              style="width: 100%">
            </nz-input-number>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzOffset]="4" [nzSpan]="20">
            <button nz-button nzType="primary" [nzLoading]="loading" type="submit">
              新增合約
            </button>
            <button nz-button (click)="goBack()" style="margin-left: 8px;">
              取消
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-card>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
  `]
})
export class ContractCreateComponent implements OnInit {
  contractForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private contractService: ContractService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contractForm = this.fb.group({
      contractNumber: ['', [Validators.required]],
      contractName: ['', [Validators.required]],
      clientCompany: ['', [Validators.required]],
      clientRepresentative: ['', [Validators.required]],
      totalAmount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.contractForm.valid) {
      this.loading = true;
      try {
        const contract: Contract = this.contractForm.value;
        await this.contractService.createContract(contract);
        this.message.success('合約新增成功');
        this.router.navigate(['/dashboard/contract-management']);
      } catch (error: any) {
        this.message.error(error.message || '合約新增失敗');
      } finally {
        this.loading = false;
      }
    } else {
      Object.values(this.contractForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/contract-management']);
  }
}
