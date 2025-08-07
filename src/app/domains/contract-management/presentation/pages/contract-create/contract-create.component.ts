import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { ContractService } from '../../../application/services/contract.service';
import { Contract, CreateContractProps } from '../../../domain/entities/contract.entity';
import { ContractFormComponent } from '../../business/components/contract-form';

@Component({
  selector: 'app-contract-create',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzTypographyModule, NzGridModule, ContractFormComponent],
  template: `
    <nz-card>
      <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
        <nz-col>
          <h2 nz-typography>新增合約</h2>
        </nz-col>
        <nz-col>
          <button nz-button (click)="goBack()"> 返回列表 </button>
        </nz-col>
      </div>

      <app-contract-form [loading]="loading" (submit)="onSubmit($event)" (cancel)="goBack()"> </app-contract-form>
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
export class ContractCreateComponent {
  loading = false;

  private readonly contractService = inject(ContractService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  async onSubmit(contract: Contract): Promise<void> {
    this.loading = true;
    try {
      // 提取 CreateContractProps
      const createProps: CreateContractProps = {
        contractName: contract.contractName,
        contractType: contract.contractType,
        riskLevel: contract.riskLevel,
        clientCompany: contract.clientCompany,
        clientRepresentative: contract.clientRepresentative,
        clientContact: contract.clientContact,
        clientEmail: contract.clientEmail,

        endDate: contract.endDate,
        totalAmount: contract.totalAmount,
        currency: contract.currency,
        paymentStatus: contract.paymentStatus,
        paidAmount: contract.paidAmount,
        paymentSchedule: contract.paymentSchedule,
        approvalStatus: contract.approvalStatus,
        approvers: contract.approvers,
        documents: contract.documents,
        risks: contract.risks
      };

      const contractNumber = await this.contractService.createContract(createProps);
      this.message.success(`合約新增成功，合約編號：${contractNumber}`);
      this.router.navigate(['/dashboard/contract-management']);
    } catch (error) {
      console.error('Error creating contract:', error);
      this.message.error(`合約新增失敗：${(error as Error).message}`);
    } finally {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/contract-management']);
  }
}
