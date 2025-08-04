import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserApplicationService } from '../../application/services/user-application.service';
import { UserDto, UserSearchDto, UserStatus } from '../../application/dto/user.dto';

/**
 * User list component using ng-zorro-antd components
 * Demonstrates interface layer integration with DDD architecture
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzSpaceModule,
    NzTagModule,
    NzAvatarModule,
    NzModalModule,

    NzPopconfirmModule,
    NzIconModule
  ],
  template: `
    <nz-card nzTitle="User Management" [nzExtra]="extraTemplate">
      <div nz-row nzGutter="16" class="mb-4">
        <div nz-col nzSpan="6">
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input 
              nz-input 
              placeholder="Search by email or name" 
              [(ngModel)]="searchDto.email"
              (ngModelChange)="onSearch()"
            />
          </nz-input-group>
          <ng-template #suffixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </div>
        <div nz-col nzSpan="4">
          <nz-select 
            nzPlaceHolder="Select status" 
            [(ngModel)]="searchDto.status"
            (ngModelChange)="onSearch()"
            [nzAllowClear]="true"
          >
            <nz-option nzValue="ACTIVE" nzLabel="Active"></nz-option>
            <nz-option nzValue="INACTIVE" nzLabel="Inactive"></nz-option>
            <nz-option nzValue="PENDING" nzLabel="Pending"></nz-option>
            <nz-option nzValue="SUSPENDED" nzLabel="Suspended"></nz-option>
          </nz-select>
        </div>
        <div nz-col nzSpan="4">
          <button nz-button nzType="primary" (click)="loadUsers()">
            <span nz-icon nzType="reload"></span>
            Refresh
          </button>
        </div>
      </div>

      <nz-table 
        #basicTable 
        [nzData]="users" 
        [nzLoading]="loading"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="currentPage"
        (nzCurrentPageDataChange)="onCurrentPageDataChange($event)"
        (nzPageIndexChange)="onPageIndexChange($event)"
      >
        <thead>
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of basicTable.data">
            <td>
              <nz-space>
                <nz-avatar 
                  [nzSrc]="user.photoURL" 
                  [nzText]="user.displayName.charAt(0).toUpperCase()"
                ></nz-avatar>
                <span>{{ user.displayName }}</span>
              </nz-space>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(user.status)">
                {{ user.status }}
              </nz-tag>
            </td>
            <td>{{ user.createdAt | date:'short' }}</td>
            <td>
              <nz-space>
                <button 
                  nz-button 
                  nzType="link" 
                  nzSize="small"
                  (click)="editUser(user)"
                >
                  <span nz-icon nzType="edit"></span>
                </button>
                <nz-popconfirm
                  nzTitle="Are you sure you want to delete this user?"
                  (nzOnConfirm)="deleteUser(user.id)"
                >
                  <button 
                    nz-button 
                    nzType="link" 
                    nzDanger 
                    nzSize="small"
                  >
                    <span nz-icon nzType="delete"></span>
                  </button>
                </nz-popconfirm>
              </nz-space>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzType="primary" (click)="addUser()">
        <span nz-icon nzType="plus"></span>
        Add User
      </button>
    </ng-template>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  loading = false;
  total = 0;
  currentPage = 1;
  pageSize = 10;
  searchDto: UserSearchDto = {};

  constructor(
    private userApplicationService: UserApplicationService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      this.loading = true;
      const searchParams: UserSearchDto = {
        ...this.searchDto,
        page: this.currentPage,
        pageSize: this.pageSize
      };
      
      const result = await this.userApplicationService.getAllUsers(searchParams);
      this.users = result.users;
      this.total = result.total;
    } catch (error) {
      this.message.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      this.loading = false;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onCurrentPageDataChange(data: readonly UserDto[]): void {
    this.users = [...data];
  }

  onPageIndexChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  getStatusColor(status: string): string {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'green';
      case 'SUSPENDED':
        return 'orange';
      case 'BANNED':
        return 'red';
      case 'PENDING':
        return 'blue';
      case 'INACTIVE':
        return 'gray';
      default:
        return 'default';
    }
  }

  addUser(): void {
    this.message.info('Add user functionality will be implemented');
    // TODO: Implement add user modal
  }

  editUser(user: UserDto): void {
    this.message.info(`Edit user: ${user.displayName}`);
    // TODO: Implement edit user modal
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await this.userApplicationService.deleteUser(userId);
      this.message.success('User deleted successfully');
      this.loadUsers();
    } catch (error) {
      this.message.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  }
} 