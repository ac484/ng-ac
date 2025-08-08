import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ContractService } from '../../../application/services/contract.service';
import { ContractId, ContractType } from '../../../domain/entities/contract.entity';
import { formatContractNumber } from '../../../domain/utils/contract-number.utils';
import { ContractSearchComponent, ContractSearchCriteria } from '../../features/components/contract-search';
import { ContractStatusBadgeComponent } from '../../shared/components/contract-status-badge';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzSpaceModule,
    NzCardModule,
    NzTypographyModule,
    NzGridModule,
    NzTooltipModule,
    NzTagModule,
    ContractStatusBadgeComponent,
    ContractSearchComponent
  ],
  template: `
    <nz-card>
      <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
        <nz-col>
          <h2 nz-typography>合約管理</h2>
        </nz-col>
        <nz-col>
          <button nz-button nzType="primary" (click)="createContract()"> 新增合約 </button>
        </nz-col>
      </div>

      <app-contract-search (search)="onSearch($event)" (reset)="onReset()"> </app-contract-search>

      <nz-table
        #basicTable
        [nzData]="displayContracts"
        [nzLoading]="loading"
        nzShowSizeChanger
        nzShowQuickJumper
        [nzTotal]="displayContracts.length"
        [nzPageSize]="10"
        [nzPageSizeOptions]="[10, 20, 50]"
      >
        <thead>
          <tr>
            <th>合約編號</th>
            <th>合約名稱</th>
            <th>合約類型</th>
            <th>客戶公司</th>
            <th>客戶代表</th>
            <th>總金額</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let contract of basicTable.data">
            <td>
              <span nz-tooltip [nzTooltipTitle]="contract.contractNumber">
                {{ formatContractNumber(contract.contractNumber) }}
              </span>
            </td>
            <td>{{ contract.contractName }}</td>
            <td>
              <nz-tag [nzColor]="getContractTypeColor(contract.contractType)">
                {{ getContractTypeText(contract.contractType) }}
              </nz-tag>
            </td>
            <td>{{ contract.clientCompany }}</td>
            <td>{{ contract.clientRepresentative }}</td>
            <td>{{ contract.totalAmount | currency: 'TWD' : 'symbol' : '1.0-0' }}</td>
            <td>
              <app-contract-status-badge [status]="contract.status"></app-contract-status-badge>
            </td>
            <td>
              <nz-space>
                <button nz-button nzSize="small" (click)="viewContract(contract)"> 查看 </button>
                <button nz-button nzSize="small" nzType="primary" (click)="editContract(contract)"> 編輯 </button>
                <button nz-button nzSize="small" nzDanger (click)="deleteContract(contract)"> 刪除 </button>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-card>
  `,
  styles: [
    `
      .mb-4 {
        margin-bottom: 16px;
      }
    `
  ]
})
export class ContractListComponent implements OnInit {
  private readonly contractService = inject(ContractService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  contracts$ = this.contractService.getContracts();
  loading = false;
  displayContracts: ContractId[] = [];
  allContracts: ContractId[] = [];

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts(): void {
    this.loading = true;
    this.contracts$.subscribe({
      next: contracts => {
        this.allContracts = contracts;
        this.displayContracts = contracts;
        this.loading = false;
      },
      error: error => {
        console.error('Error loading contracts:', error);
        this.message.error('載入合約列表失敗');
        this.loading = false;
      }
    });
  }

  createContract(): void {
    this.router.navigate(['/dashboard/contract-management/create']);
  }

  viewContract(contract: ContractId): void {
    this.router.navigate(['/dashboard/contract-management', contract.id]);
  }

  editContract(contract: ContractId): void {
    this.router.navigate(['/dashboard/contract-management', contract.id, 'edit']);
  }

  async deleteContract(contract: ContractId): Promise<void> {
    try {
      await this.contractService.deleteContract(contract.id);
      this.message.success('合約刪除成功');
      this.loadContracts();
    } catch (error) {
      console.error('Error deleting contract:', error);
      this.message.error('合約刪除失敗');
    }
  }

  formatContractNumber(contractNumber: string): string {
    return formatContractNumber(contractNumber);
  }

  getContractTypeText(contractType: ContractType): string {
    const typeMap: Record<ContractType, string> = {
      [ContractType.PURE_LABOR]: '純工',
      [ContractType.MATERIAL_INCLUDED]: '帶料',
      [ContractType.SUBCONTRACT]: '分包',
      [ContractType.OUTSOURCING]: '外包'
    };
    return typeMap[contractType] || '未知';
  }

  getContractTypeColor(contractType: ContractType): string {
    const colorMap: Record<ContractType, string> = {
      [ContractType.PURE_LABOR]: 'blue',
      [ContractType.MATERIAL_INCLUDED]: 'green',
      [ContractType.SUBCONTRACT]: 'orange',
      [ContractType.OUTSOURCING]: 'purple'
    };
    return colorMap[contractType] || 'default';
  }

  onSearch(criteria: ContractSearchCriteria): void {
    this.displayContracts = this.allContracts.filter(contract => {
      if (criteria.keyword) {
        const keyword = criteria.keyword.toLowerCase();
        const matchesKeyword =
          contract.contractNumber.toLowerCase().includes(keyword) ||
          contract.contractName.toLowerCase().includes(keyword) ||
          contract.clientCompany.toLowerCase().includes(keyword);
        if (!matchesKeyword) return false;
      }

      if (criteria.status && contract.status !== criteria.status) return false;
      if (criteria.contractType && contract.contractType !== criteria.contractType) return false;
      if (criteria.riskLevel && contract.riskLevel !== criteria.riskLevel) return false;
      if (criteria.startDate && contract.startDate < criteria.startDate) return false;
      if (criteria.endDate && contract.endDate > criteria.endDate) return false;
      if (criteria.clientCompany && !contract.clientCompany.toLowerCase().includes(criteria.clientCompany.toLowerCase())) return false;

      return true;
    });
  }

  onReset(): void {
    this.displayContracts = this.allContracts;
  }
}
