import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FloatActionButtonsComponent, FloatActionButton } from './components/float-action-buttons/float-action-buttons.component';
import { FirebaseCrudService } from '@core/services/firebase/firebase-crud.service';

interface Contract {
    id?: string;
    title: string;
    clientName: string;
    status: 'active' | 'pending' | 'completed';
    amount: number;
    startDate: Date;
    endDate: Date;
}

@Component({
    selector: 'app-contracts',
    standalone: true,
    imports: [CommonModule, NzTableModule, NzTagModule, NzButtonModule, NzIconModule, FloatActionButtonsComponent],
    template: `
    <div class="contracts-container">
      <h2>合約管理</h2>
      
      <nz-table [nzData]="contracts" [nzLoading]="loading">
        <thead>
          <tr>
            <th>合約標題</th>
            <th>客戶名稱</th>
            <th>狀態</th>
            <th>金額</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let contract of contracts">
            <td>{{ contract.title }}</td>
            <td>{{ contract.clientName }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(contract.status)">
                {{ contract.status }}
              </nz-tag>
            </td>
            <td>{{ contract.amount | currency:'TWD' }}</td>
            <td>
              <button nz-button nzType="link" nzSize="small" (click)="deleteContract(contract)">
                <span nz-icon nzType="delete"></span>
                刪除
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <app-float-action-buttons 
        [buttons]="floatButtons" 
        (onButtonClick)="onFloatButtonClick($event)">
      </app-float-action-buttons>
    </div>
  `,
    styles: [`
    .contracts-container {
      padding: 20px;
    }
    
    h2 {
      margin-bottom: 20px;
    }
  `]
})
export class ContractsComponent implements OnInit {
    private firebaseCrud = inject(FirebaseCrudService);
    private message = inject(NzMessageService);

    contracts: Contract[] = [];
    loading = false;

    floatButtons: FloatActionButton[] = [
        { id: 'add', type: 'add', icon: 'plus' },
        { id: 'refresh', type: 'refresh', icon: 'reload' }
    ];

    ngOnInit(): void {
        this.loadContracts();
    }

    async loadContracts(): Promise<void> {
        this.loading = true;
        try {
            this.contracts = await this.firebaseCrud.readAll<Contract>('contracts');
            if (this.contracts.length === 0) {
                await this.createSampleData();
            }
        } catch (error) {
            this.message.error('載入失敗');
        } finally {
            this.loading = false;
        }
    }

    private async createSampleData(): Promise<void> {
        const samples: Omit<Contract, 'id'>[] = [
            {
                title: '網站開發合約',
                clientName: 'ABC 公司',
                status: 'active',
                amount: 500000,
                startDate: new Date(),
                endDate: new Date()
            }
        ];

        for (const sample of samples) {
            await this.firebaseCrud.create('contracts', sample);
        }
        await this.loadContracts();
    }

    onFloatButtonClick(type: string): void {
        if (type === 'refresh') {
            this.loadContracts();
        }
    }

    async deleteContract(contract: Contract): Promise<void> {
        if (contract.id && confirm('確定刪除？')) {
            await this.firebaseCrud.delete('contracts', contract.id);
            await this.loadContracts();
        }
    }

    getStatusColor(status: string): string {
        const colors = { active: 'green', pending: 'orange', completed: 'blue' };
        return colors[status as keyof typeof colors] || 'default';
    }
}