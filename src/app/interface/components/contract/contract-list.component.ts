import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ContractDto, ContractSearchDto } from '../../../application/dto/contract.dto';
import { ContractApplicationService } from '../../../application/services/contract-application.service';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NzTableModule, NzButtonModule, NzIconModule, NzTagModule, NzInputModule, NzSelectModule],
  template: `
    <div class="contract-list-container">
      <div class="header">
        <h2>合約管理</h2>
        <button nz-button nzType="primary" (click)="createContract()">
          <span nz-icon nzType="plus"></span>
          新增合約
        </button>
      </div>

      <div class="search-bar">
        <nz-input-group>
          <input nz-input placeholder="搜尋客戶名稱或合約名稱" [(ngModel)]="searchText" (input)="onSearch()" />
        </nz-input-group>

        <nz-select [(ngModel)]="statusFilter" (ngModelChange)="onStatusFilterChange()" placeholder="狀態篩選">
          <nz-option nzValue="" nzLabel="全部狀態"></nz-option>
          <nz-option nzValue="draft" nzLabel="草稿"></nz-option>
          <nz-option nzValue="preparing" nzLabel="籌備中"></nz-option>
          <nz-option nzValue="in_progress" nzLabel="進行中"></nz-option>
          <nz-option nzValue="completed" nzLabel="已完成"></nz-option>
        </nz-select>
      </div>

      <nz-table
        #basicTable
        [nzData]="contracts"
        [nzLoading]="loading"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th>合約編號</th>
            <th>客戶名稱</th>
            <th>客戶代表</th>
            <th>聯絡人</th>
            <th>合約名稱</th>
            <th>總金額</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let contract of basicTable.data">
            <td>{{ contract.contractNumber }}</td>
            <td>{{ contract.clientName }}</td>
            <td>{{ contract.clientRepresentative }}</td>
            <td>{{ contract.contactPerson }}</td>
            <td>{{ contract.contractName }}</td>
            <td>{{ contract.amount | currency: 'TWD' : 'symbol' : '1.0-0' }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(contract.status)">
                {{ getStatusText(contract.status) }}
              </nz-tag>
            </td>
            <td>
              <button nz-button nzType="link" (click)="viewContract(contract)">
                <span nz-icon nzType="eye"></span>
              </button>
              <button nz-button nzType="link" (click)="editContract(contract)">
                <span nz-icon nzType="edit"></span>
              </button>
              <button nz-button nzType="link" nzDanger (click)="deleteContract(contract)">
                <span nz-icon nzType="delete"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [
    `
      .contract-list-container {
        padding: 24px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .header h2 {
        margin: 0;
      }

      .search-bar {
        display: flex;
        gap: 16px;
        margin-bottom: 24px;
      }

      .search-bar nz-input-group {
        flex: 1;
      }

      .search-bar nz-select {
        width: 200px;
      }
    `
  ]
})
export class ContractListComponent implements OnInit, OnDestroy {
  private readonly contractApplicationService = inject(ContractApplicationService);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  contracts: ContractDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;
  searchText = '';
  statusFilter = '';

  ngOnInit(): void {
    this.loadContracts();
    this.setupRouteListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupRouteListener(): void {
    // Listen to route changes to reload contracts when returning from create/edit
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        console.log('Route changed to:', event.url);
        // Reload contracts when navigating back to the list page
        if (event.url === '/contracts' || event.url.startsWith('/contracts?')) {
          console.log('Reloading contracts due to route change');
          this.loadContracts();
        }
      });
  }

  async loadContracts(): Promise<void> {
    try {
      this.loading = true;
      console.log('Loading contracts with criteria:', {
        page: this.pageIndex,
        pageSize: this.pageSize,
        clientName: this.searchText || undefined,
        contractName: this.searchText || undefined,
        status: this.statusFilter || undefined
      });

      const criteria: ContractSearchDto = {
        page: this.pageIndex,
        pageSize: this.pageSize,
        clientName: this.searchText || undefined,
        contractName: this.searchText || undefined,
        status: this.statusFilter || undefined
      };

      const result = await this.contractApplicationService.getContracts(criteria);
      console.log('Contracts loaded:', result.contracts.length, 'total:', result.total);
      this.contracts = result.contracts;
      this.total = result.total;
    } catch (error) {
      console.error('Error loading contracts:', error);
      this.message.error('載入合約列表失敗');
    } finally {
      this.loading = false;
    }
  }

  onSearch(): void {
    this.pageIndex = 1;
    this.loadContracts();
  }

  onStatusFilterChange(): void {
    this.pageIndex = 1;
    this.loadContracts();
  }

  async onPageIndexChange(pageIndex: number): Promise<void> {
    this.pageIndex = pageIndex;
    await this.loadContracts();
  }

  async onPageSizeChange(pageSize: number): Promise<void> {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    await this.loadContracts();
  }

  createContract(): void {
    this.router.navigate(['/contracts/create']);
  }

  viewContract(contract: ContractDto): void {
    this.router.navigate(['/contracts', contract.id]);
  }

  editContract(contract: ContractDto): void {
    this.router.navigate(['/contracts', contract.id, 'edit']);
  }

  async deleteContract(contract: ContractDto): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除合約 "${contract.contractName}" 嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: async () => {
        try {
          await this.contractApplicationService.deleteContract(contract.id);
          this.message.success('合約刪除成功');
          await this.loadContracts();
        } catch (error) {
          console.error('Error deleting contract:', error);
          this.message.error('合約刪除失敗');
        }
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      draft: 'default',
      preparing: 'processing',
      in_progress: 'warning',
      completed: 'success'
    };
    return colors[status] || 'default';
  }

  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      draft: '草稿',
      preparing: '籌備中',
      in_progress: '進行中',
      completed: '已完成'
    };
    return texts[status] || status;
  }
}
