import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { ContractStatus, ContractType, RiskLevel } from '../../../../domain/entities/contract.entity';

export interface ContractSearchCriteria {
  keyword?: string;
  status?: ContractStatus;
  contractType?: ContractType;
  riskLevel?: RiskLevel;
  startDate?: Date;
  endDate?: Date;
  clientCompany?: string;
}

@Component({
  selector: 'app-contract-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule
  ],
  template: `
    <nz-card nzTitle="搜索條件" [nzExtra]="extraTemplate">
      <form nz-form [formGroup]="searchForm">
        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>關鍵字</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="keyword" placeholder="合約編號、名稱、客戶公司" />
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>合約狀態</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="status" placeholder="請選擇狀態" nzAllowClear>
                  <nz-option nzValue="draft" nzLabel="草稿"></nz-option>
                  <nz-option nzValue="pending_approval" nzLabel="待審批"></nz-option>
                  <nz-option nzValue="approved" nzLabel="已審批"></nz-option>
                  <nz-option nzValue="active" nzLabel="執行中"></nz-option>
                  <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
                  <nz-option nzValue="terminated" nzLabel="已終止"></nz-option>
                  <nz-option nzValue="expired" nzLabel="已過期"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>合約類型</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="contractType" placeholder="請選擇類型" nzAllowClear>
                  <nz-option nzValue="pure_labor" nzLabel="純工"></nz-option>
                  <nz-option nzValue="material_included" nzLabel="帶料"></nz-option>
                  <nz-option nzValue="subcontract" nzLabel="分包"></nz-option>
                  <nz-option nzValue="outsourcing" nzLabel="外包"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <div nz-row [nzGutter]="16">
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>風險等級</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="riskLevel" placeholder="請選擇風險等級" nzAllowClear>
                  <nz-option nzValue="low" nzLabel="低風險"></nz-option>
                  <nz-option nzValue="medium" nzLabel="中風險"></nz-option>
                  <nz-option nzValue="high" nzLabel="高風險"></nz-option>
                  <nz-option nzValue="critical" nzLabel="極高風險"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>開始日期</nz-form-label>
              <nz-form-control>
                <nz-date-picker formControlName="startDate" style="width: 100%"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
          <nz-col [nzSpan]="8">
            <nz-form-item>
              <nz-form-label>結束日期</nz-form-label>
              <nz-form-control>
                <nz-date-picker formControlName="endDate" style="width: 100%"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </nz-col>
        </div>

        <div nz-row>
          <nz-col [nzSpan]="24" style="text-align: center;">
            <button nz-button nzType="primary" (click)="onSearch()"> 搜索 </button>
            <button nz-button (click)="onReset()" style="margin-left: 8px;"> 重置 </button>
          </nz-col>
        </div>
      </form>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzSize="small" (click)="toggleAdvanced()">
        {{ showAdvanced ? '簡化' : '高級' }}
      </button>
    </ng-template>
  `
})
export class ContractSearchComponent {
  @Output() readonly search = new EventEmitter<ContractSearchCriteria>();
  @Output() readonly reset = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);

  searchForm!: FormGroup;
  showAdvanced = false;

  constructor() {
    this.initForm();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      keyword: [''],
      status: [null],
      contractType: [null],
      riskLevel: [null],
      startDate: [null],
      endDate: [null],
      clientCompany: ['']
    });
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const criteria: ContractSearchCriteria = this.searchForm.value;
      this.search.emit(criteria);
    }
  }

  onReset(): void {
    this.searchForm.reset();
    this.reset.emit();
  }

  toggleAdvanced(): void {
    this.showAdvanced = !this.showAdvanced;
  }
}
