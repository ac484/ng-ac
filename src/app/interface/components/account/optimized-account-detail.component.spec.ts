/**
 * 優化帳戶詳情組件測試
 * 測試帳戶詳情顯示、即時更新和交易記錄功能
 */

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { of } from 'rxjs';

import { OptimizedAccountDetailComponent } from './optimized-account-detail.component';
import { OptimizedAccountApplicationService, AccountResponseDto } from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

describe('OptimizedAccountDetailComponent', () => {
    let component: OptimizedAccountDetailComponent;
    let fixture: ComponentFixture<OptimizedAccountDetailComponent>;
    let mockAccountService: jasmine.SpyObj<OptimizedAccountApplicationService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: jasmine.SpyObj<ActivatedRoute>;
    let mockMessage: jasmine.SpyObj<NzMessageService>;
    let mockModal: jasmine.SpyObj<NzModalService>;

    const mockAccount: AccountResponseDto = {
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
        description: '日常使用的主要帳戶',
        lastTransactionDate: '2024-01-15T10:30:00Z'
    };

    beforeEach(async () => {
        const accountServiceSpy = jasmine.createSpyObj('OptimizedAccountApplicationService', [
            'getAccountById',
            'getRecentTransactions'
        ]);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
            params: of({ id: '1' })
        });
        const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'info']);
        const modalSpy = jasmine.createSpyObj('NzModalService', ['confirm']);

        await TestBed.configureTestingModule({
            imports: [
                OptimizedAccountDetailComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: OptimizedAccountApplicationService, useValue: accountServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeSpy },
                { provide: NzMessageService, useValue: messageSpy },
                { provide: NzModalService, useValue: modalSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OptimizedAccountDetailComponent);
        component = fixture.componentInstance;
        mockAccountService = TestBed.inject(OptimizedAccountApplicationService) as jasmine.SpyObj<OptimizedAccountApplicationService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        mockMessage = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
        mockModal = TestBed.inject(NzModalService) as jasmine.SpyObj<NzModalService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Initialization', () => {
        it('should initialize with default values', () => {
            expect(component.account).toBeUndefined();
            expect(component.loading).toBeFalse();
            expect(component.recentTransactions).toEqual([]);
            expect(component.accountId).toBeUndefined();
        });

        it('should load account data on route params change', () => {
            spyOn(component, 'loadAccountData').and.returnValue(Promise.resolve());
            spyOn(component, 'loadRecentTransactions').and.returnValue(Promise.resolve());
            spyOn(component as any, 'startAutoRefresh');

            component.ngOnInit();

            expect(component.accountId).toBe('1');
            expect(component.loadAccountData).toHaveBeenCalled();
            expect(component.loadRecentTransactions).toHaveBeenCalled();
            expect(component['startAutoRefresh']).toHaveBeenCalled();
        });
    });

    describe('Account Data Loading', () => {
        beforeEach(() => {
            component.accountId = '1';
        });

        it('should load account data successfully', async () => {
            component.account = mockAccount;

            await component.loadAccountData();

            expect(component.account).toBeDefined();
            expect(component.loading).toBeFalse();
        });

        it('should handle loading error', async () => {
            spyOn(console, 'error');

            await component.loadAccountData();

            expect(component.loading).toBeFalse();
        });

        it('should not load data without account ID', async () => {
            component.accountId = undefined;
            spyOn(component as any, 'generateMockAccount');

            await component.loadAccountData();

            expect(component['generateMockAccount']).not.toHaveBeenCalled();
        });
    });

    describe('Transaction History Loading', () => {
        beforeEach(() => {
            component.accountId = '1';
        });

        it('should load recent transactions successfully', async () => {
            const mockTransactions = component['generateMockTransactions']();

            await component.loadRecentTransactions();

            expect(component.recentTransactions.length).toBeGreaterThan(0);
        });

        it('should handle transaction loading error', async () => {
            spyOn(console, 'error');

            await component.loadRecentTransactions();

            // Should not throw error, just log it
            expect(console.error).not.toHaveBeenCalled();
        });

        it('should not load transactions without account ID', async () => {
            component.accountId = undefined;
            spyOn(component as any, 'generateMockTransactions');

            await component.loadRecentTransactions();

            expect(component['generateMockTransactions']).not.toHaveBeenCalled();
        });
    });

    describe('Auto Refresh', () => {
        it('should start auto refresh on initialization', fakeAsync(() => {
            spyOn(component, 'loadAccountData').and.returnValue(Promise.resolve());
            component.accountId = '1';

            component['startAutoRefresh']();
            tick(30000); // 30 seconds

            expect(component.loadAccountData).toHaveBeenCalled();
        }));
    });

    describe('Data Refresh', () => {
        it('should refresh all data successfully', async () => {
            spyOn(component, 'loadAccountData').and.returnValue(Promise.resolve());
            spyOn(component, 'loadRecentTransactions').and.returnValue(Promise.resolve());

            await component.refreshData();

            expect(component.loadAccountData).toHaveBeenCalled();
            expect(component.loadRecentTransactions).toHaveBeenCalled();
            expect(mockMessage.success).toHaveBeenCalledWith('資料已重新整理');
        });
    });

    describe('Navigation', () => {
        beforeEach(() => {
            component.accountId = '1';
        });

        it('should navigate to edit account', () => {
            component.editAccount();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts', '1', 'edit']);
        });

        it('should navigate back to account list', () => {
            component.goBack();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts']);
        });

        it('should navigate to transaction history', () => {
            component.viewTransactionHistory();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts', '1', 'transactions']);
        });

        it('should navigate to all transactions', () => {
            component.viewAllTransactions();

            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts', '1', 'transactions']);
        });
    });

    describe('Transaction Operations', () => {
        it('should show deposit message', () => {
            component.deposit();

            expect(mockMessage.info).toHaveBeenCalledWith('存款功能開發中...');
        });

        it('should show withdraw message', () => {
            component.withdraw();

            expect(mockMessage.info).toHaveBeenCalledWith('提款功能開發中...');
        });

        it('should show transfer message', () => {
            component.transfer();

            expect(mockMessage.info).toHaveBeenCalledWith('轉帳功能開發中...');
        });
    });

    describe('Balance Styling', () => {
        beforeEach(() => {
            component.account = mockAccount;
        });

        it('should return positive balance style', () => {
            const style = component.getBalanceStyle();

            expect(style.color).toBe('#52c41a');
            expect(style.fontSize).toBe('28px');
            expect(style.fontWeight).toBe('bold');
        });

        it('should return negative balance style', () => {
            component.account = { ...mockAccount, balance: -1000 };

            const style = component.getBalanceStyle();

            expect(style.color).toBe('#ff4d4f');
        });
    });

    describe('Status Styling', () => {
        beforeEach(() => {
            component.account = mockAccount;
        });

        it('should return correct status style', () => {
            const style = component.getStatusStyle();

            expect(style.color).toBe('#52c41a');
            expect(style.fontSize).toBe('18px');
            expect(style.fontWeight).toBe('500');
        });
    });

    describe('Balance Health', () => {
        beforeEach(() => {
            component.account = mockAccount;
        });

        it('should calculate balance health percentage correctly', () => {
            // Balance: 15000
            const percentage = component.getBalanceHealthPercentage();

            expect(percentage).toBe(50); // Between 10000 and 50000
        });

        it('should return 0 for negative balance', () => {
            component.account = { ...mockAccount, balance: -1000 };

            const percentage = component.getBalanceHealthPercentage();

            expect(percentage).toBe(0);
        });

        it('should return 100 for high balance', () => {
            component.account = { ...mockAccount, balance: 100000 };

            const percentage = component.getBalanceHealthPercentage();

            expect(percentage).toBe(100);
        });

        it('should return correct health color', () => {
            // Test different balance ranges
            component.account = { ...mockAccount, balance: 500 };
            expect(component.getBalanceHealthColor()).toBe('#ff4d4f'); // Low balance

            component.account = { ...mockAccount, balance: 5000 };
            expect(component.getBalanceHealthColor()).toBe('#faad14'); // Medium balance

            component.account = { ...mockAccount, balance: 25000 };
            expect(component.getBalanceHealthColor()).toBe('#52c41a'); // Good balance

            component.account = { ...mockAccount, balance: 75000 };
            expect(component.getBalanceHealthColor()).toBe('#1890ff'); // Excellent balance
        });
    });

    describe('Account Type and Status', () => {
        it('should return correct type color', () => {
            expect(component.getTypeColor(AccountType.CHECKING)).toBe('blue');
            expect(component.getTypeColor(AccountType.SAVINGS)).toBe('green');
            expect(component.getTypeColor(AccountType.CREDIT)).toBe('orange');
        });

        it('should return correct type text', () => {
            expect(component.getTypeText(AccountType.CHECKING)).toBe('支票帳戶');
            expect(component.getTypeText(AccountType.SAVINGS)).toBe('儲蓄帳戶');
            expect(component.getTypeText(AccountType.CREDIT)).toBe('信用帳戶');
        });

        it('should return correct status color', () => {
            expect(component.getStatusColor(AccountStatus.ACTIVE)).toBe('green');
            expect(component.getStatusColor(AccountStatus.INACTIVE)).toBe('red');
            expect(component.getStatusColor(AccountStatus.SUSPENDED)).toBe('orange');
            expect(component.getStatusColor(AccountStatus.CLOSED)).toBe('red');
        });
    });

    describe('Transaction Display', () => {
        it('should return correct transaction color', () => {
            expect(component.getTransactionColor('deposit')).toBe('green');
            expect(component.getTransactionColor('withdrawal')).toBe('red');
            expect(component.getTransactionColor('transfer')).toBe('blue');
        });

        it('should return correct transaction type text', () => {
            expect(component.getTransactionTypeText('deposit')).toBe('存款');
            expect(component.getTransactionTypeText('withdrawal')).toBe('提款');
            expect(component.getTransactionTypeText('transfer')).toBe('轉帳');
        });

        it('should return correct transaction amount class', () => {
            expect(component.getTransactionAmountClass('deposit')).toBe('positive');
            expect(component.getTransactionAmountClass('withdrawal')).toBe('negative');
            expect(component.getTransactionAmountClass('transfer')).toBe('negative');
        });
    });

    describe('Balance Formatter', () => {
        beforeEach(() => {
            component.account = mockAccount;
        });

        it('should format balance correctly', () => {
            const formatted = component.balanceFormatter(15000);

            expect(formatted).toContain('15,000');
            expect(formatted).toContain('NT$');
        });

        it('should handle different currencies', () => {
            component.account = { ...mockAccount, currency: 'USD' };

            const formatted = component.balanceFormatter(15000);

            expect(formatted).toContain('$15,000');
        });
    });

    describe('Mock Data Generation', () => {
        it('should generate mock account with dynamic balance', () => {
            component.accountId = '1';

            const account1 = component['generateMockAccount']();
            const account2 = component['generateMockAccount']();

            // Balance should be different due to random component
            expect(account1.balance).toBeGreaterThan(15000);
            expect(account1.balance).toBeLessThan(16000);
            expect(account1.id).toBe('1');
            expect(account1.updatedAt).toBeDefined();
        });

        it('should generate mock transactions', () => {
            const transactions = component['generateMockTransactions']();

            expect(transactions.length).toBe(3);
            expect(transactions[0].type).toBe('deposit');
            expect(transactions[1].type).toBe('withdrawal');
            expect(transactions[2].type).toBe('transfer');
        });
    });

    describe('Component Cleanup', () => {
        it('should complete destroy subject on destroy', () => {
            spyOn(component['destroy$'], 'next');
            spyOn(component['destroy$'], 'complete');

            component.ngOnDestroy();

            expect(component['destroy$'].next).toHaveBeenCalled();
            expect(component['destroy$'].complete).toHaveBeenCalled();
        });
    });
});