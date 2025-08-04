import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { AccountDto } from '../../../application/dto/account.dto';
import { AccountApplicationService } from '../../../application/services/account-application.service';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzTagModule],
  template: `
    <div class="account-list-container">
      <div class="header">
        <h2>帳戶管理</h2>
        <button nz-button nzType="primary" (click)="createAccount()">
          <span nz-icon nzType="plus"></span>
          新增帳戶
        </button>
      </div>

      <nz-table
        #basicTable
        [nzData]="accounts"
        [nzLoading]="loading"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th>帳戶號</th>
            <th>帳戶名稱</th>
            <th>類型</th>
            <th>餘額</th>
            <th>狀態</th>
            <th>創建時間</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let account of basicTable.data">
            <td>{{ account.accountNumber }}</td>
            <td>{{ account.accountName }}</td>
            <td>
              <nz-tag [nzColor]="getTypeColor(account.accountType)">
                {{ getTypeText(account.accountType) }}
              </nz-tag>
            </td>
            <td>{{ account.balance | currency: 'USD' }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(account.status)">
                {{ getStatusText(account.status) }}
              </nz-tag>
            </td>
            <td>{{ account.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
            <td>
              <button nz-button nzType="link" (click)="viewAccount(account)">
                <span nz-icon nzType="eye"></span>
              </button>
              <button nz-button nzType="link" (click)="editAccount(account)">
                <span nz-icon nzType="edit"></span>
              </button>
              <button nz-button nzType="link" nzDanger (click)="deleteAccount(account)">
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
      .account-list-container {
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
    `
  ]
})
export class AccountListComponent implements OnInit {
  private readonly accountApplicationService = inject(AccountApplicationService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  accounts: AccountDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  ngOnInit(): void {
    this.loadAccounts();
  }

  async loadAccounts(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.accountApplicationService.getAllAccounts({
        page: this.pageIndex,
        pageSize: this.pageSize
      });
      this.accounts = result.accounts;
      this.total = result.total;
    } catch (error: any) {
      this.message.error('載入帳戶列表失敗');
    } finally {
      this.loading = false;
    }
  }

  async onPageIndexChange(pageIndex: number): Promise<void> {
    this.pageIndex = pageIndex;
    await this.loadAccounts();
  }

  async onPageSizeChange(pageSize: number): Promise<void> {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    await this.loadAccounts();
  }

  createAccount(): void {
    this.router.navigate(['/accounts/create']);
  }

  viewAccount(account: AccountDto): void {
    this.router.navigate(['/accounts', account.id]);
  }

  editAccount(account: AccountDto): void {
    this.router.navigate(['/accounts', account.id, 'edit']);
  }

  async deleteAccount(account: AccountDto): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除帳戶 "${account.accountName}" 嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: async () => {
        try {
          await this.accountApplicationService.deleteAccount(account.id);
          this.message.success('帳戶刪除成功');
          await this.loadAccounts();
        } catch (error: any) {
          this.message.error('帳戶刪除失敗');
        }
      }
    });
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'CHECKING':
        return 'blue';
      case 'SAVINGS':
        return 'green';
      case 'CREDIT':
        return 'orange';
      case 'INVESTMENT':
        return 'purple';
      default:
        return 'default';
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'CHECKING':
        return '支票帳戶';
      case 'SAVINGS':
        return '儲蓄帳戶';
      case 'CREDIT':
        return '信用帳戶';
      case 'INVESTMENT':
        return '投資帳戶';
      default:
        return '未知';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'SUSPENDED':
        return 'orange';
      case 'CLOSED':
        return 'red';
      default:
        return 'default';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return '啟用';
      case 'INACTIVE':
        return '停用';
      case 'SUSPENDED':
        return '暫停';
      case 'CLOSED':
        return '已關閉';
      default:
        return '未知';
    }
  }
}
