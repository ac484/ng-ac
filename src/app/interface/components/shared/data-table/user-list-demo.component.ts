import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { DataTableComponent } from './data-table.component';
import { TableColumn, TableAction, PaginationConfig } from './table-column.interface';

/**
 * 用戶列表示範組件
 * 展示如何在實際業務場景中使用 DataTableComponent
 */
@Component({
  selector: 'app-user-list-demo',
  standalone: true,
  imports: [CommonModule, DataTableComponent],
  template: `
    <div class="user-list-container">
      <div class="page-header">
        <h2>用戶管理</h2>
        <p>使用 DataTableComponent 的用戶列表示範</p>
      </div>

      <div class="table-container">
        <app-data-table
          [data]="users"
          [columns]="columns"
          [actions]="actions"
          [loading]="loading"
          [pagination]="pagination"
          [size]="'default'"
          [bordered]="true"
          (view)="onViewUser($event)"
          (edit)="onEditUser($event)"
          (delete)="onDeleteUser($event)"
          (customAction)="onCustomAction($event)"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)"
        >
        </app-data-table>
      </div>

      <!-- 操作結果顯示 -->
      <div class="action-result" *ngIf="lastAction">
        <h3>最後操作結果：</h3>
        <pre>{{ lastAction | json }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .user-list-container {
        padding: 24px;
        background: #f5f5f5;
        min-height: 100vh;
      }

      .page-header {
        background: white;
        padding: 24px;
        margin-bottom: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .page-header h2 {
        margin: 0 0 8px 0;
        color: #1890ff;
      }

      .page-header p {
        margin: 0;
        color: #666;
      }

      .table-container {
        background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .action-result {
        background: white;
        padding: 24px;
        margin-top: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .action-result h3 {
        margin: 0 0 16px 0;
        color: #1890ff;
      }

      .action-result pre {
        background: #f5f5f5;
        padding: 16px;
        border-radius: 4px;
        overflow-x: auto;
      }
    `
  ]
})
export class UserListDemoComponent implements OnInit {
  loading = false;
  lastAction: any = null;

  // 模擬用戶資料
  users = [
    {
      id: '1',
      name: '張三',
      email: 'zhang.san@example.com',
      phone: '0912-345-678',
      status: 'active',
      role: 'admin',
      department: '資訊部',
      joinDate: new Date('2023-01-15'),
      lastLogin: new Date('2024-01-20T10:30:00'),
      isEmailVerified: true,
      loginCount: 156
    },
    {
      id: '2',
      name: '李四',
      email: 'li.si@example.com',
      phone: '0923-456-789',
      status: 'inactive',
      role: 'user',
      department: '業務部',
      joinDate: new Date('2023-03-20'),
      lastLogin: new Date('2024-01-18T14:20:00'),
      isEmailVerified: false,
      loginCount: 89
    },
    {
      id: '3',
      name: '王五',
      email: 'wang.wu@example.com',
      phone: '0934-567-890',
      status: 'pending',
      role: 'user',
      department: '行銷部',
      joinDate: new Date('2023-06-10'),
      lastLogin: new Date('2024-01-19T09:15:00'),
      isEmailVerified: true,
      loginCount: 234
    },
    {
      id: '4',
      name: '趙六',
      email: 'zhao.liu@example.com',
      phone: '0945-678-901',
      status: 'suspended',
      role: 'user',
      department: '財務部',
      joinDate: new Date('2023-08-25'),
      lastLogin: new Date('2024-01-15T16:45:00'),
      isEmailVerified: true,
      loginCount: 67
    },
    {
      id: '5',
      name: '錢七',
      email: 'qian.qi@example.com',
      phone: '0956-789-012',
      status: 'active',
      role: 'manager',
      department: '人事部',
      joinDate: new Date('2022-12-01'),
      lastLogin: new Date('2024-01-21T08:30:00'),
      isEmailVerified: true,
      loginCount: 445
    }
  ];

  // 表格欄位配置
  columns: TableColumn[] = [
    {
      key: 'name',
      title: '姓名',
      type: 'text',
      sortable: true,
      width: '120px'
    },
    {
      key: 'email',
      title: '電子郵件',
      type: 'text',
      width: '200px'
    },
    {
      key: 'phone',
      title: '電話',
      type: 'text',
      width: '130px'
    },
    {
      key: 'status',
      title: '狀態',
      type: 'status',
      width: '100px',
      statusColors: {
        active: 'green',
        inactive: 'red',
        pending: 'orange',
        suspended: 'volcano'
      },
      statusTexts: {
        active: '啟用',
        inactive: '停用',
        pending: '待審核',
        suspended: '暫停'
      },
      filterable: true,
      filters: [
        { text: '啟用', value: 'active' },
        { text: '停用', value: 'inactive' },
        { text: '待審核', value: 'pending' },
        { text: '暫停', value: 'suspended' }
      ]
    },
    {
      key: 'role',
      title: '角色',
      type: 'text',
      width: '100px',
      formatter: value => {
        const roleMap: Record<string, string> = {
          admin: '管理員',
          manager: '主管',
          user: '一般用戶'
        };
        return roleMap[value] || value;
      },
      filterable: true,
      filters: [
        { text: '管理員', value: 'admin' },
        { text: '主管', value: 'manager' },
        { text: '一般用戶', value: 'user' }
      ]
    },
    {
      key: 'department',
      title: '部門',
      type: 'text',
      width: '100px'
    },
    {
      key: 'joinDate',
      title: '加入日期',
      type: 'date',
      sortable: true,
      width: '120px'
    },
    {
      key: 'lastLogin',
      title: '最後登入',
      type: 'date',
      sortable: true,
      width: '150px'
    },
    {
      key: 'isEmailVerified',
      title: '信箱驗證',
      type: 'boolean',
      width: '100px'
    },
    {
      key: 'loginCount',
      title: '登入次數',
      type: 'number',
      sortable: true,
      width: '100px',
      align: 'right'
    }
  ];

  // 操作按鈕配置
  actions: TableAction[] = [
    {
      type: 'view',
      title: '檢視詳情',
      icon: 'eye'
    },
    {
      type: 'edit',
      title: '編輯用戶',
      icon: 'edit',
      disabled: (item: any) => item.status === 'suspended'
    },
    {
      type: 'custom',
      title: '重設密碼',
      icon: 'key',
      visible: (item: any) => item.status === 'active'
    },
    {
      type: 'custom',
      title: '發送驗證信',
      icon: 'mail',
      visible: (item: any) => !item.isEmailVerified
    },
    {
      type: 'delete',
      title: '刪除用戶',
      icon: 'delete',
      danger: true,
      disabled: (item: any) => item.role === 'admin'
    }
  ];

  // 分頁配置
  pagination: PaginationConfig = {
    pageIndex: 1,
    pageSize: 10,
    total: 100,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [5, 10, 20, 50]
  };

  ngOnInit(): void {
    // 模擬載入資料
    this.loadUsers();
  }

  /**
   * 載入用戶資料
   */
  loadUsers(): void {
    this.loading = true;

    // 模擬 API 呼叫延遲
    setTimeout(() => {
      this.loading = false;
      this.lastAction = {
        type: 'load',
        message: '用戶資料載入完成',
        timestamp: new Date(),
        count: this.users.length
      };
    }, 1000);
  }

  /**
   * 檢視用戶詳情
   */
  onViewUser(user: any): void {
    this.lastAction = {
      type: 'view',
      message: `檢視用戶: ${user.name}`,
      user: user,
      timestamp: new Date()
    };

    console.log('檢視用戶:', user);
    // 實際應用中會開啟詳情對話框或導航到詳情頁面
  }

  /**
   * 編輯用戶
   */
  onEditUser(user: any): void {
    this.lastAction = {
      type: 'edit',
      message: `編輯用戶: ${user.name}`,
      user: user,
      timestamp: new Date()
    };

    console.log('編輯用戶:', user);
    // 實際應用中會開啟編輯表單對話框
  }

  /**
   * 刪除用戶
   */
  onDeleteUser(user: any): void {
    this.lastAction = {
      type: 'delete',
      message: `刪除用戶: ${user.name}`,
      user: user,
      timestamp: new Date()
    };

    console.log('刪除用戶:', user);

    // 模擬刪除操作
    const index = this.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.users.splice(index, 1);
      this.pagination.total--;
    }
  }

  /**
   * 自定義操作處理
   */
  onCustomAction(event: { action: TableAction; item: any }): void {
    const { action, item } = event;

    this.lastAction = {
      type: 'custom',
      action: action.title,
      message: `${action.title}: ${item.name}`,
      user: item,
      timestamp: new Date()
    };

    console.log('自定義操作:', action.title, item);

    switch (action.title) {
      case '重設密碼':
        this.resetPassword(item);
        break;
      case '發送驗證信':
        this.sendVerificationEmail(item);
        break;
    }
  }

  /**
   * 分頁變更處理
   */
  onPageChange(page: number): void {
    this.pagination.pageIndex = page;
    this.lastAction = {
      type: 'pagination',
      message: `切換到第 ${page} 頁`,
      page: page,
      timestamp: new Date()
    };

    console.log('分頁變更:', page);
    // 實際應用中會重新載入對應頁面的資料
  }

  /**
   * 每頁數量變更處理
   */
  onPageSizeChange(size: number): void {
    this.pagination.pageSize = size;
    this.pagination.pageIndex = 1; // 重置到第一頁

    this.lastAction = {
      type: 'pagination',
      message: `每頁顯示 ${size} 筆資料`,
      pageSize: size,
      timestamp: new Date()
    };

    console.log('每頁數量變更:', size);
    // 實際應用中會重新載入資料
  }

  /**
   * 重設密碼
   */
  private resetPassword(user: any): void {
    console.log('重設密碼:', user.email);
    // 實際應用中會調用重設密碼 API
  }

  /**
   * 發送驗證信
   */
  private sendVerificationEmail(user: any): void {
    console.log('發送驗證信:', user.email);
    // 實際應用中會調用發送驗證信 API

    // 模擬發送成功，更新用戶狀態
    setTimeout(() => {
      user.isEmailVerified = true;
      this.lastAction = {
        ...this.lastAction,
        message: `驗證信已發送至 ${user.email}`
      };
    }, 1000);
  }
}
