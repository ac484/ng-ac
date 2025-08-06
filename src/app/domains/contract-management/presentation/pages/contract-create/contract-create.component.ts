import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContractService } from '../../../application/services/contract.service';
import { Contract } from '../../../domain/entities/contract.entity';
import { ContractFormComponent } from '../../business/components/contract-form';

@Component({
  selector: 'app-contract-create',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTypographyModule,
    NzGridModule,
    ContractFormComponent
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

      <app-contract-form
        [loading]="loading"
        (submit)="onSubmit($event)"
        (cancel)="goBack()">
      </app-contract-form>
    </nz-card>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
  `]
})
export class ContractCreateComponent {
  loading = false;

  constructor(
    private contractService: ContractService,
    private router: Router,
    private message: NzMessageService
  ) {}

  async onSubmit(contract: Contract): Promise<void> {
    this.loading = true;
    try {
      await this.contractService.createContract(contract);
      this.message.success('合約新增成功');
      this.router.navigate(['/dashboard/contract-management']);
    } catch (error) {
      console.error('Error creating contract:', error);
      this.message.error('合約新增失敗');
    } finally {
      this.loading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/contract-management']);
  }
}
