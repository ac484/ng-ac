import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from './data-table.component';
import { TableColumn, TableAction, PaginationConfig } from './table-column.interface';

/**
 * DataTableComponent 使用範例
 * 展示如何使用可重用的資料表格組件
 */
@Component({
    selector: 'app-data-table-example',
    standalone: true,
    imports: [CommonModule, DataTableComponent],
    template: `
    <div class="example-container">
      <h2>資料表格組件範例</h2>
      
      <div class="example-section">
        <h3>基本用法</h3>
        <app-data-table
          [data]="userData"
          [columns]="userColumns"
          [loading]="loading"
          [pagination]="userPagination"
          (view)="onViewUser($event)"
          (edit)="onEditUser($event)"
          (delete)="onDeleteUser($event)"
          (pageChange)="onPageChange($event)"
          (pageSizeChange)="onPageSizeChange($event)">
        </app-data-table>
      </div>
      
      <div class="example-section">
        <h3>自定義操作按鈕</h3>
        <app-data-table
          [data]="accountData"
          [columns]="accountColumns"
          [actions]="customActions"
          [pagination]="accountPagination"
          (customAction)="onCustomAction($event)">
        </app-data-table>
      </div>
      
      <div class="example-section">
        <h3>小尺寸表格</h3>
        <app-data-table
          [data]="transactionData"
          [columns]="transactionColumns"
          [actions]="[]"
          [showActions]="false"
          size="small"
          [bordered]="true"
          [pagination]="transactionPagination">
        </app-data-table>
      </div>
    </div>
  `,
    styles: [`
    .example-container {
      padding: 24px;
    }
    
    .example-section {
      margin-bottom: 32px;
    }
    
    .example-section h3 {
      margin-bottom: 16px;
      color: #1890ff;
    }
  `]
})
export class DataTableExampleComponent {
    loading = false;

    // 用戶資料範例
    userData = [
        {
            id: '1',
            name: '張三',
            email: 'zhang.san@example.com',
            status: 'active',
            role: 'admin',
            lastLogin: new Date('2024-01-15T10:30:00'),
            isVerified: true
        },
        {
            id: '2',
            name: '李四',
            email: 'li.si@example.com',
            status: 'inactive',
            role: 'user',
            lastLogin: new Date('2024-01-10T14:20:00'),
            isVerified: false
        },
        {
            id: '3',
            name: '王五',
            email: 'wang.wu@example.com',
            status: 'pending',
            role: 'user',
            lastLogin: new Date('2024-01-12T09:15:00'),
            isVerified: true
        }
    ];

    // 用戶表格欄位配置
    userColumns: TableColumn[] = [
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
            key: 'status',
            title: '狀態',
            type: 'status',
            statusColors: {
                'active': 'green',
                'inactive': 'red',
                'pending': 'orange'
            },
            statusTexts: {
                'active': '啟用',
                'inactive': '停用',
                'pending': '待審核'
            },
            filterable: true,
            filters: [
                { text: '啟用', value: 'active' },
                { text: '停用', value: 'inactive' },
                { text: '待審核', value: 'pending' }
            ]
        },
        {
            key: 'role',
            title: '角色',
            type: 'text',
            formatter: (value) => value === 'admin' ? '管理員' : '一般用戶'
        },
        {
            key: 'lastLogin',
            title: '最後登入',
            type: 'date',
            sortable: true
        },
        {
            key: 'isVerified',
            title: '已驗證',
            type: 'boolean'
        }
    ];

    // 用戶分頁配置
    userPagination: PaginationConfig = {
        pageIndex: 1,
        pageSize: 10,
        total: 100,
        showSizeChanger: true,
        showQuickJumper: true
    };

    // 帳戶資料範例
    accountData = [
        {
            id: '1',
            name: '主要帳戶',
            type: 'checking',
            balance: 50000,
            currency: 'TWD',
            status: 'active'
        },
        {
            id: '2',
            name: '儲蓄帳戶',
            type: 'savings',
            balance: 100000,
            currency: 'TWD',
            status: 'active'
        }
    ];

    // 帳戶表格欄位配置
    accountColumns: TableColumn[] = [
        { key: 'name', title: '帳戶名稱', type: 'text' },
        {
            key: 'type',
            title: '帳戶類型',
            type: 'text',
            formatter: (value) => {
                const types: { [key: string]: string } = {
                    'checking': '支票帳戶',
                    'savings': '儲蓄帳戶',
                    'credit': '信用帳戶'
                };
                return types[value] || value;
            }
        },
        { key: 'balance', title: '餘額', type: 'currency', align: 'right' },
        { key: 'status', title: '狀態', type: 'status' }
    ];

    // 自定義操作按鈕
    customActions: TableAction[] = [
        { type: 'view', title: '檢視詳情', icon: 'eye' },
        { type: 'custom', title: '轉帳', icon: 'swap' },
        { type: 'custom', title: '凍結', icon: 'lock', danger: true },
        {
            type: 'edit',
            title: '編輯',
            icon: 'edit',
            disabled: (item: any) => item.status === 'frozen'
        }
    ];

    // 帳戶分頁配置
    accountPagination: PaginationConfig = {
        pageIndex: 1,
        pageSize: 5,
        total: 20
    };

    // 交易資料範例
    transactionData = [
        {
            id: '1',
            type: 'deposit',
            amount: 1000,
            description: '薪資入帳',
            date: new Date('2024-01-15'),
            status: 'completed'
        },
        {
            id: '2',
            type: 'withdrawal',
            amount: -500,
            description: '提款',
            date: new Date('2024-01-14'),
            status: 'completed'
        },
        {
            id: '3',
            type: 'transfer',
            amount: -200,
            description: '轉帳給朋友',
            date: new Date('2024-01-13'),
            status: 'pending'
        }
    ];

    // 交易表格欄位配置
    transactionColumns: TableColumn[] = [
        {
            key: 'type',
            title: '類型',
            type: 'text',
            formatter: (value) => {
                const types: { [key: string]: string } = {
                    'deposit': '存款',
                    'withdrawal': '提款',
                    'transfer': '轉帳'
                };
                return types[value] || value;
            }
        },
        {
            key: 'amount',
            title: '金額',
            type: 'currency',
            align: 'right',
            formatter: (value) => {
                const color = value >= 0 ? 'green' : 'red';
                const sign = value >= 0 ? '+' : '';
                return `<span style="color: ${color}">${sign}${Math.abs(value).toLocaleString()}</span>`;
            }
        },
        { key: 'description', title: '描述', type: 'text' },
        { key: 'date', title: '日期', type: 'date' },
        { key: 'status', title: '狀態', type: 'status' }
    ];

    // 交易分頁配置
    transactionPagination: PaginationConfig = {
        pageIndex: 1,
        pageSize: 20,
        total: 50,
        showSizeChanger: false,
        showQuickJumper: false
    };

    // 事件處理方法
    onViewUser(user: any): void {
        console.log('檢視用戶:', user);
    }

    onEditUser(user: any): void {
        console.log('編輯用戶:', user);
    }

    onDeleteUser(user: any): void {
        console.log('刪除用戶:', user);
        // 實際應用中會顯示確認對話框並調用刪除 API
    }

    onPageChange(page: number): void {
        console.log('頁碼變更:', page);
        this.userPagination.pageIndex = page;
        // 實際應用中會重新載入資料
    }

    onPageSizeChange(size: number): void {
        console.log('每頁數量變更:', size);
        this.userPagination.pageSize = size;
        this.userPagination.pageIndex = 1;
        // 實際應用中會重新載入資料
    }

    onCustomAction(event: { action: TableAction; item: any }): void {
        console.log('自定義操作:', event.action.title, event.item);

        switch (event.action.title) {
            case '轉帳':
                console.log('開啟轉帳對話框');
                break;
            case '凍結':
                console.log('凍結帳戶');
                break;
        }
    }
}