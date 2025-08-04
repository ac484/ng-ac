import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { UserDto } from '../../../application/dto/user.dto';
import { UserApplicationService } from '../../../application/services/user-application.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule, NzTagModule],
  template: `
    <div class="user-list-container">
      <div class="header">
        <h2>用戶管理</h2>
        <button nz-button nzType="primary" (click)="createUser()">
          <span nz-icon nzType="plus"></span>
          新增用戶
        </button>
      </div>

      <nz-table
        #basicTable
        [nzData]="users"
        [nzLoading]="loading"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>郵箱</th>
            <th>狀態</th>
            <th>創建時間</th>
            <th>操作</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let user of basicTable.data">
            <td>{{ user.id }}</td>
            <td>{{ user.displayName }}</td>
            <td>{{ user.email }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(user.status)">
                {{ getStatusText(user.status) }}
              </nz-tag>
            </td>
            <td>{{ user.createdAt | date: 'yyyy-MM-dd HH:mm' }}</td>
            <td>
              <button nz-button nzType="link" (click)="viewUser(user)">
                <span nz-icon nzType="eye"></span>
              </button>
              <button nz-button nzType="link" (click)="editUser(user)">
                <span nz-icon nzType="edit"></span>
              </button>
              <button nz-button nzType="link" nzDanger (click)="deleteUser(user)">
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
      .user-list-container {
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
export class UserListComponent implements OnInit {
  private readonly userApplicationService = inject(UserApplicationService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly modal = inject(NzModalService);

  users: UserDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.userApplicationService.getAllUsers({
        page: this.pageIndex,
        pageSize: this.pageSize
      });
      this.users = result.users;
      this.total = result.total;
    } catch (error: any) {
      this.message.error('載入用戶列表失敗');
    } finally {
      this.loading = false;
    }
  }

  async onPageIndexChange(pageIndex: number): Promise<void> {
    this.pageIndex = pageIndex;
    await this.loadUsers();
  }

  async onPageSizeChange(pageSize: number): Promise<void> {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    await this.loadUsers();
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  viewUser(user: UserDto): void {
    this.router.navigate(['/users', user.id]);
  }

  editUser(user: UserDto): void {
    this.router.navigate(['/users', user.id, 'edit']);
  }

  async deleteUser(user: UserDto): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除用戶 "${user.displayName}" 嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: async () => {
        try {
          await this.userApplicationService.deleteUser(user.id);
          this.message.success('用戶刪除成功');
          await this.loadUsers();
        } catch (error: any) {
          this.message.error('用戶刪除失敗');
        }
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'green';
      case 'INACTIVE':
        return 'red';
      case 'PENDING':
        return 'orange';
      case 'SUSPENDED':
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
      case 'PENDING':
        return '待審核';
      case 'SUSPENDED':
        return '暫停';
      default:
        return '未知';
    }
  }
}
