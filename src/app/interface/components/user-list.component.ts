import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UserApplicationService } from '../../application/services/user-application.service';
import { UserDto, UserSearchDto } from '../../application/dto/user.dto';
import { DataTableComponent } from './shared/data-table/data-table.component';
import { TableColumn, TableAction } from './shared/data-table/table-column.interface';

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
    NzButtonModule,
    NzInputModule,
    NzSelectModule,
    NzCardModule,
    NzSpaceModule,
    NzIconModule,
    NzGridModule,
    DataTableComponent
  ],
  template: `
    <nz-card nzTitle="用戶管理" [nzExtra]="extraTemplate">
      <!-- 搜尋區域 -->
      <div nz-row nzGutter="16" class="mb-4">
        <div nz-col nzSpan="6">
          <nz-input-group [nzSuffix]="suffixIconSearch">
            <input 
              nz-input 
              placeholder="搜尋用戶名稱或郵箱" 
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
            nzPlaceHolder="選擇狀態" 
            [(ngModel)]="searchDto.status"
            (ngModelChange)="onSearch()"
            [nzAllowClear]="true"
          >
            <nz-option nzValue="ACTIVE" nzLabel="啟用"></nz-option>
            <nz-option nzValue="INACTIVE" nzLabel="停用"></nz-option>
            <nz-option nzValue="PENDING" nzLabel="待審核"></nz-option>
            <nz-option nzValue="SUSPENDED" nzLabel="暫停"></nz-option>
          </nz-select>
        </div>
        <div nz-col nzSpan="4">
          <button nz-button nzType="default" (click)="loadUsers()">
            <span nz-icon nzType="reload"></span>
            重新載入
          </button>
        </div>
      </div>

      <!-- 使用新的 DataTableComponent -->
      <app-data-table
        [data]="users"
        [columns]="tableColumns"
        [actions]="tableActions"
        [loading]="loading"
        [pagination]="paginationConfig"
        (pageChange)="onPageChange($event)"
        (pageSizeChange)="onPageSizeChange($event)"
        (view)="viewUser($event)"
        (edit)="editUser($event)"
        (delete)="deleteUser($event.id)"
      ></app-data-table>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzType="primary" (click)="addUser()">
        <span nz-icon nzType="plus"></span>
        新增用戶
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

  // 表格欄位配置
  tableColumns: TableColumn[] = [
    {
      key: 'displayName',
      title: '用戶名稱',
      type: 'text',
      sortable: true,
      formatter: (value: string, item: UserDto) => {
        return `${value} ${item.photoURL ? '📷' : ''}`;
      }
    },
    {
      key: 'email',
      title: '郵箱',
      type: 'text',
      sortable: true
    },
    {
      key: 'status',
      title: '狀態',
      type: 'status',
      statusColors: {
        'ACTIVE': 'green',
        'INACTIVE': 'red',
        'PENDING': 'orange',
        'SUSPENDED': 'red'
      },
      statusTexts: {
        'ACTIVE': '啟用',
        'INACTIVE': '停用',
        'PENDING': '待審核',
        'SUSPENDED': '暫停'
      }
    },
    {
      key: 'createdAt',
      title: '創建時間',
      type: 'date',
      sortable: true
    }
  ];

  // 表格操作配置
  tableActions: TableAction[] = [
    {
      type: 'view',
      title: '檢視',
      icon: 'eye'
    },
    {
      type: 'edit',
      title: '編輯',
      icon: 'edit'
    },
    {
      type: 'delete',
      title: '刪除',
      icon: 'delete',
      danger: true
    }
  ];

  // 分頁配置
  paginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50, 100]
  };

  constructor(
    private userApplicationService: UserApplicationService,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

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

      // 更新分頁配置
      this.paginationConfig = {
        ...this.paginationConfig,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        total: this.total
      };
    } catch (error) {
      this.message.error('載入用戶列表失敗');
      console.error('Error loading users:', error);
    } finally {
      this.loading = false;
    }
  }

  onSearch(): void {
    this.currentPage = 1;
    this.paginationConfig.pageIndex = 1;
    this.loadUsers();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 1;
    this.loadUsers();
  }



  addUser(): void {
    // TODO: 實作新增用戶功能，將使用獨立的用戶表單頁面
    this.message.info('新增用戶功能將導向到用戶表單頁面');
    // 可以導向到 /users/create 路由
  }

  viewUser(user: UserDto): void {
    // 使用模態框顯示用戶詳情
    this.modal.info({
      nzTitle: '用戶詳情',
      nzContent: `
        <div>
          <p><strong>ID:</strong> ${user.id}</p>
          <p><strong>顯示名稱:</strong> ${user.displayName}</p>
          <p><strong>郵箱:</strong> ${user.email}</p>
          <p><strong>狀態:</strong> ${user.status}</p>
          <p><strong>電話:</strong> ${user.phoneNumber || '未設定'}</p>
          <p><strong>創建時間:</strong> ${new Date(user.createdAt).toLocaleString()}</p>
        </div>
      `,
      nzWidth: 500
    });
  }

  editUser(user: UserDto): void {
    // TODO: 實作編輯用戶功能，將使用獨立的用戶表單頁面
    this.message.info(`編輯用戶功能將導向到用戶表單頁面: ${user.displayName}`);
    // 可以導向到 /users/${user.id}/edit 路由
  }

  async deleteUser(userId: string): Promise<void> {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: '確定要刪除這個用戶嗎？此操作無法撤銷。',
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.userApplicationService.deleteUser(userId);
          this.message.success('用戶刪除成功');
          this.loadUsers();
        } catch (error) {
          this.message.error('用戶刪除失敗');
          console.error('Error deleting user:', error);
        }
      }
    });
  }
} 