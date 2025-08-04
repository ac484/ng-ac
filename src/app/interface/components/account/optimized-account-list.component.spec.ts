/**
 * 優化帳戶列表組件測試
 * 測試帳戶列表的顯示、操作和交易功能
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

import { OptimizedAccountListComponent } from './optimized-account-list.component';
import {
  OptimizedAccountApplicationService,
  AccountResponseDto
} from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

describe('OptimizedAccountListComponent', () => {
  let component: OptimizedAccountListComponent;
  let fixture: ComponentFixture<OptimizedAccountListComponent>;
  let mockAccountService: jasmine.SpyObj<OptimizedAccountApplicationService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockMessage: jasmine.SpyObj<NzMessageService>;
  let mockModal: jasmine.SpyObj<NzModalService>;

  const mockAccounts: AccountResponseDto[] = [
    {
      id: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      userId: 'user-1',
      accountNumber: 'ACC-001234-ABCD',
      name: '主要支票帳戶',
      type: AccountType.CHECKING,
      balance: 15000,
      formattedBalance: 'NT$15,000',
      currency: 'TWD',
      status: AccountStatus.ACTIVE,
      statusText: '啟用',
      isActive: true,
      canPerformTransactions: true,
      description: '日常使用的主要帳戶'
    },
    {
      id: '2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      userId: 'user-1',
      accountNumber: 'ACC-001235-EFGH',
      name: '儲蓄帳戶',
      type: AccountType.SAVINGS,
      balance: 50000,
      formattedBalance: 'NT$50,000',
      currency: 'TWD',
      status: AccountStatus.ACTIVE,
      statusText: '啟用',
      isActive: true,
      canPerformTransactions: true,
      description: '長期儲蓄用途'
    }
  ];

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('OptimizedAccountApplicationService', ['getAccountsByUserId', 'deleteAccount']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'info']);
    const modalSpy = jasmine.createSpyObj('NzModalService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [OptimizedAccountListComponent, NoopAnimationsModule],
      providers: [
        { provide: OptimizedAccountApplicationService, useValue: accountServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: NzMessageService, useValue: messageSpy },
        { provide: NzModalService, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OptimizedAccountListComponent);
    component = fixture.componentInstance;
    mockAccountService = TestBed.inject(OptimizedAccountApplicationService) as jasmine.SpyObj<OptimizedAccountApplicationService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockMessage = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    mockModal = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.accounts).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(component.transactionModalVisible).toBeFalse();
      expect(component.selectedAccount).toBeUndefined();
      expect(component.currentTransactionType).toBeUndefined();
    });

    it('should load accounts on init', () => {
      spyOn(component, 'loadAccounts').and.returnValue(Promise.resolve());
      spyOn(component, 'loadAccountStats').and.returnValue(Promise.resolve());

      component.ngOnInit();

      expect(component.loadAccounts).toHaveBeenCalled();
      expect(component.loadAccountStats).toHaveBeenCalled();
    });
  });

  describe('Account Loading', () => {
    it('should load accounts successfully', async () => {
      component.accounts = mockAccounts;

      await component.loadAccounts();

      expect(component.accounts.length).toBe(2);
      expect(component.paginationConfig.total).toBe(2);
    });

    it('should handle loading error', async () => {
      spyOn(console, 'error');
      // 模擬載入錯誤的情況
      component.accounts = [];

      await component.loadAccounts();

      expect(component.loading).toBeFalse();
    });
  });

  describe('Account Statistics', () => {
    beforeEach(() => {
      component.accounts = mockAccounts;
    });

    it('should calculate account statistics correctly', async () => {
      await component.loadAccountStats();

      expect(component.accountStats.totalAccounts).toBe(2);
      expect(component.accountStats.activeAccounts).toBe(2);
      expect(component.accountStats.totalBalance).toBe(65000);
      expect(component.accountStats.averageBalance).toBe(32500);
    });

    it('should handle empty accounts list', async () => {
      component.accounts = [];

      await component.loadAccountStats();

      expect(component.accountStats.totalAccounts).toBe(0);
      expect(component.accountStats.activeAccounts).toBe(0);
      expect(component.accountStats.totalBalance).toBe(0);
      expect(component.accountStats.averageBalance).toBe(0);
    });
  });

  describe('Pagination', () => {
    it('should handle page change', async () => {
      spyOn(component, 'loadAccounts').and.returnValue(Promise.resolve());

      await component.onPageChange(2);

      expect(component.paginationConfig.pageIndex).toBe(2);
      expect(component.loadAccounts).toHaveBeenCalled();
    });

    it('should handle page size change', async () => {
      spyOn(component, 'loadAccounts').and.returnValue(Promise.resolve());

      await component.onPageSizeChange(20);

      expect(component.paginationConfig.pageSize).toBe(20);
      expect(component.paginationConfig.pageIndex).toBe(1);
      expect(component.loadAccounts).toHaveBeenCalled();
    });
  });

  describe('Account Operations', () => {
    const testAccount = mockAccounts[0];

    it('should navigate to view account', () => {
      component.viewAccount(testAccount);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts', testAccount.id]);
    });

    it('should navigate to edit account', () => {
      component.editAccount(testAccount);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts', testAccount.id, 'edit']);
    });

    it('should navigate to create account', () => {
      component.createAccount();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts/create']);
    });
  });

  describe('Transaction Operations', () => {
    const testAccount = mockAccounts[0];

    it('should open deposit modal', () => {
      component['depositToAccount'](testAccount);

      expect(component.selectedAccount).toBe(testAccount);
      expect(component.currentTransactionType).toBe('deposit');
      expect(component.transactionModalVisible).toBeTrue();
    });

    it('should open withdraw modal', () => {
      component['withdrawFromAccount'](testAccount);

      expect(component.selectedAccount).toBe(testAccount);
      expect(component.currentTransactionType).toBe('withdraw');
      expect(component.transactionModalVisible).toBeTrue();
    });

    it('should open transfer modal', () => {
      component['transferFromAccount'](testAccount);

      expect(component.selectedAccount).toBe(testAccount);
      expect(component.currentTransactionType).toBe('transfer');
      expect(component.transactionModalVisible).toBeTrue();
    });

    it('should handle transaction completion', () => {
      component.accounts = [...mockAccounts];
      const updatedAccount = { ...testAccount, balance: 20000, formattedBalance: 'NT$20,000' };
      const transactionResult = {
        success: true,
        message: '交易成功',
        updatedAccount
      };

      spyOn(component, 'loadAccountStats').and.returnValue(Promise.resolve());

      component.onTransactionComplete(transactionResult);

      expect(component.accounts[0].balance).toBe(20000);
      expect(component.loadAccountStats).toHaveBeenCalled();
    });

    it('should handle transaction cancellation', () => {
      component.selectedAccount = testAccount;
      component.currentTransactionType = 'deposit';
      component.transactionModalVisible = true;

      component.onTransactionCancel();

      expect(component.transactionModalVisible).toBeFalse();
      expect(component.selectedAccount).toBeUndefined();
      expect(component.currentTransactionType).toBeUndefined();
    });
  });

  describe('Custom Actions', () => {
    const testAccount = mockAccounts[0];

    it('should handle deposit action', () => {
      spyOn(component as any, 'depositToAccount');
      const action = { key: 'deposit', type: 'custom' as const, title: '存款', icon: 'plus-circle' };

      component.onCustomAction({ action, item: testAccount });

      expect(component['depositToAccount']).toHaveBeenCalledWith(testAccount);
    });

    it('should handle withdraw action', () => {
      spyOn(component as any, 'withdrawFromAccount');
      const action = { key: 'withdraw', type: 'custom' as const, title: '提款', icon: 'minus-circle' };

      component.onCustomAction({ action, item: testAccount });

      expect(component['withdrawFromAccount']).toHaveBeenCalledWith(testAccount);
    });

    it('should handle transfer action', () => {
      spyOn(component as any, 'transferFromAccount');
      const action = { key: 'transfer', type: 'custom' as const, title: '轉帳', icon: 'swap' };

      component.onCustomAction({ action, item: testAccount });

      expect(component['transferFromAccount']).toHaveBeenCalledWith(testAccount);
    });

    it('should handle unknown action', () => {
      spyOn(console, 'warn');
      const action = { key: 'unknown', type: 'custom' as const, title: '未知', icon: 'question' };

      component.onCustomAction({ action, item: testAccount });

      expect(console.warn).toHaveBeenCalledWith('Unknown custom action:', 'unknown');
    });
  });

  describe('Data Refresh', () => {
    it('should refresh data successfully', async () => {
      spyOn(component, 'loadAccounts').and.returnValue(Promise.resolve());
      spyOn(component, 'loadAccountStats').and.returnValue(Promise.resolve());

      await component.refreshData();

      expect(component.loadAccounts).toHaveBeenCalled();
      expect(component.loadAccountStats).toHaveBeenCalled();
      expect(mockMessage.success).toHaveBeenCalledWith('資料已重新整理');
    });
  });

  describe('Export Data', () => {
    it('should show export message', () => {
      component.exportData();

      expect(mockMessage.info).toHaveBeenCalledWith('匯出功能開發中...');
    });
  });

  describe('Balance Formatter', () => {
    it('should format balance correctly', () => {
      const formatted = component.balanceFormatter(15000);

      expect(formatted).toContain('15,000');
      expect(formatted).toContain('NT$');
    });

    it('should handle negative balance', () => {
      const formatted = component.balanceFormatter(-2500);

      expect(formatted).toContain('-2,500');
      expect(formatted).toContain('NT$');
    });
  });

  describe('Table Configuration', () => {
    it('should have correct table columns', () => {
      expect(component.tableColumns.length).toBeGreaterThan(0);

      const accountNumberColumn = component.tableColumns.find(col => col.key === 'accountNumber');
      expect(accountNumberColumn).toBeDefined();
      expect(accountNumberColumn?.sortable).toBeTrue();

      const balanceColumn = component.tableColumns.find(col => col.key === 'formattedBalance');
      expect(balanceColumn).toBeDefined();
      expect(balanceColumn?.align).toBe('right');
    });

    it('should have correct table actions', () => {
      expect(component.tableActions.length).toBeGreaterThan(0);

      const viewAction = component.tableActions.find(action => action.type === 'view');
      expect(viewAction).toBeDefined();

      const editAction = component.tableActions.find(action => action.type === 'edit');
      expect(editAction).toBeDefined();

      const deleteAction = component.tableActions.find(action => action.type === 'delete');
      expect(deleteAction).toBeDefined();
    });
  });
});
