/**
 * 優化帳戶表單組件測試
 * 測試帳戶創建和編輯表單的功能
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';

import { OptimizedAccountFormComponent } from './optimized-account-form.component';
import { OptimizedAccountApplicationService, AccountResponseDto, CreateAccountDto, UpdateAccountDto } from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

describe('OptimizedAccountFormComponent', () => {
    let component: OptimizedAccountFormComponent;
    let fixture: ComponentFixture<OptimizedAccountFormComponent>;
    let mockAccountService: jasmine.SpyObj<OptimizedAccountApplicationService>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockRoute: jasmine.SpyObj<ActivatedRoute>;
    let mockMessage: jasmine.SpyObj<NzMessageService>;

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
        description: '日常使用的主要帳戶'
    };

    beforeEach(async () => {
        const accountServiceSpy = jasmine.createSpyObj('OptimizedAccountApplicationService', [
            'createAccount',
            'updateAccount',
            'getAccountById'
        ]);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
            params: of({ id: '1' })
        });
        const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [
                OptimizedAccountFormComponent,
                NoopAnimationsModule
            ],
            providers: [
                { provide: OptimizedAccountApplicationService, useValue: accountServiceSpy },
                { provide: Router, useValue: routerSpy },
                { provide: ActivatedRoute, useValue: routeSpy },
                { provide: NzMessageService, useValue: messageSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OptimizedAccountFormComponent);
        component = fixture.componentInstance;
        mockAccountService = TestBed.inject(OptimizedAccountApplicationService) as jasmine.SpyObj<OptimizedAccountApplicationService>;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockRoute = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
        mockMessage = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Initialization', () => {
        it('should initialize with default values', () => {
            expect(component.mode).toBe('create');
            expect(component.loading).toBeFalse();
            expect(component.currentAccount).toBeUndefined();
        });

        it('should initialize form configuration', () => {
            component.ngOnInit();

            expect(component.formConfig).toBeDefined();
            expect(component.formConfig.fields.length).toBeGreaterThan(0);
        });

        it('should load account data in edit mode', () => {
            component.mode = 'edit';
            component.accountId = '1';
            spyOn(component as any, 'loadAccountData').and.returnValue(Promise.resolve());

            component.ngOnInit();

            expect(component['loadAccountData']).toHaveBeenCalled();
        });
    });

    describe('Form Field Configuration', () => {
        it('should build create mode form fields correctly', () => {
            component.mode = 'create';
            const fields = component['buildFormFields']();

            const nameField = fields.find(f => f.key === 'name');
            expect(nameField).toBeDefined();
            expect(nameField?.required).toBeTrue();

            const accountNumberField = fields.find(f => f.key === 'accountNumber');
            expect(accountNumberField).toBeDefined();
            expect(accountNumberField?.disabled).toBeFalse();

            const typeField = fields.find(f => f.key === 'type');
            expect(typeField).toBeDefined();
            expect(typeField?.disabled).toBeFalse();
        });

        it('should build edit mode form fields correctly', () => {
            component.mode = 'edit';
            const fields = component['buildFormFields']();

            const accountNumberField = fields.find(f => f.key === 'accountNumber');
            expect(accountNumberField?.disabled).toBeTrue();

            const typeField = fields.find(f => f.key === 'type');
            expect(typeField?.disabled).toBeTrue();

            const balanceField = fields.find(f => f.key === 'initialBalance');
            expect(balanceField?.disabled).toBeTrue();
        });

        it('should include all required form fields', () => {
            const fields = component['buildFormFields']();
            const fieldKeys = fields.map(f => f.key);

            expect(fieldKeys).toContain('name');
            expect(fieldKeys).toContain('accountNumber');
            expect(fieldKeys).toContain('type');
            expect(fieldKeys).toContain('currency');
            expect(fieldKeys).toContain('initialBalance');
            expect(fieldKeys).toContain('description');
        });
    });

    describe('Account Data Loading', () => {
        beforeEach(() => {
            component.accountId = '1';
        });

        it('should load account data successfully', async () => {
            component.currentAccount = mockAccount;

            await component['loadAccountData']();

            expect(component.currentAccount).toBeDefined();
            expect(component.initialFormValue.name).toBe(mockAccount.name);
            expect(component.initialFormValue.accountNumber).toBe(mockAccount.accountNumber);
        });

        it('should handle loading error', async () => {
            spyOn(console, 'error');
            component.currentAccount = undefined;

            await component['loadAccountData']();

            expect(component.loading).toBeFalse();
        });

        it('should not load data without account ID', async () => {
            component.accountId = undefined;
            spyOn(component as any, 'generateMockAccount');

            await component['loadAccountData']();

            expect(component['generateMockAccount']).not.toHaveBeenCalled();
        });
    });

    describe('Form Submission', () => {
        const createFormValue = {
            name: '新帳戶',
            accountNumber: 'ACC-123456',
            type: AccountType.CHECKING,
            currency: 'TWD',
            initialBalance: 1000,
            description: '測試帳戶'
        };

        const updateFormValue = {
            name: '更新的帳戶',
            description: '更新的描述'
        };

        it('should create account successfully', async () => {
            component.mode = 'create';
            spyOn(component as any, 'mockCreateAccount').and.returnValue(mockAccount);

            await component.onFormSubmit(createFormValue);

            expect(mockMessage.success).toHaveBeenCalledWith('帳戶創建成功');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts']);
        });

        it('should update account successfully', async () => {
            component.mode = 'edit';
            component.accountId = '1';
            component.currentAccount = mockAccount;
            spyOn(component as any, 'mockUpdateAccount').and.returnValue(mockAccount);

            await component.onFormSubmit(updateFormValue);

            expect(mockMessage.success).toHaveBeenCalledWith('帳戶更新成功');
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts']);
        });

        it('should handle create error', async () => {
            component.mode = 'create';
            spyOn(component as any, 'mockCreateAccount').and.throwError('創建失敗');
            spyOn(console, 'error');

            await component.onFormSubmit(createFormValue);

            expect(mockMessage.error).toHaveBeenCalledWith('帳戶創建失敗');
            expect(component.loading).toBeFalse();
        });

        it('should handle update error', async () => {
            component.mode = 'edit';
            component.accountId = '1';
            spyOn(component as any, 'mockUpdateAccount').and.throwError('更新失敗');
            spyOn(console, 'error');

            await component.onFormSubmit(updateFormValue);

            expect(mockMessage.error).toHaveBeenCalledWith('帳戶更新失敗');
            expect(component.loading).toBeFalse();
        });

        it('should emit formSubmitted event', async () => {
            spyOn(component.formSubmitted, 'emit');
            component.mode = 'create';
            spyOn(component as any, 'mockCreateAccount').and.returnValue(mockAccount);

            await component.onFormSubmit(createFormValue);

            expect(component.formSubmitted.emit).toHaveBeenCalledWith(mockAccount);
        });
    });

    describe('Form Cancellation', () => {
        it('should emit formCancelled event', () => {
            spyOn(component.formCancelled, 'emit');

            component.onFormCancel();

            expect(component.formCancelled.emit).toHaveBeenCalled();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/accounts']);
        });
    });

    describe('Form Properties', () => {
        it('should return correct form title for create mode', () => {
            component.mode = 'create';

            expect(component.formTitle).toBe('新增帳戶');
        });

        it('should return correct form title for edit mode', () => {
            component.mode = 'edit';

            expect(component.formTitle).toBe('編輯帳戶');
        });

        it('should return correct submit text for create mode', () => {
            component.mode = 'create';

            expect(component.submitText).toBe('創建帳戶');
        });

        it('should return correct submit text for edit mode', () => {
            component.mode = 'edit';

            expect(component.submitText).toBe('更新帳戶');
        });
    });

    describe('Mock Operations', () => {
        it('should create mock account correctly', () => {
            const createDto: CreateAccountDto = {
                userId: 'user-1',
                name: '測試帳戶',
                type: AccountType.CHECKING,
                currency: 'TWD',
                initialBalance: 1000
            };

            const result = component['mockCreateAccount'](createDto);

            expect(result.name).toBe(createDto.name);
            expect(result.type).toBe(createDto.type);
            expect(result.balance).toBe(createDto.initialBalance || 0);
            expect(result.currency).toBe(createDto.currency || 'TWD');
        });

        it('should update mock account correctly', () => {
            component.currentAccount = mockAccount;
            const updateDto: UpdateAccountDto = {
                name: '更新的名稱',
                description: '更新的描述'
            };

            const result = component['mockUpdateAccount'](updateDto);

            expect(result.name).toBe(updateDto.name || mockAccount.name);
            expect(result.description).toBe(updateDto.description || mockAccount.description);
            expect(result.id).toBe(mockAccount.id);
        });

        it('should generate mock account with correct structure', () => {
            component.accountId = '1';

            const result = component['generateMockAccount']();

            expect(result.id).toBe('1');
            expect(result.accountNumber).toBeDefined();
            expect(result.name).toBeDefined();
            expect(result.type).toBeDefined();
            expect(result.balance).toBeDefined();
            expect(result.currency).toBeDefined();
            expect(result.status).toBe(AccountStatus.ACTIVE);
        });
    });

    describe('Route Parameter Handling', () => {
        it('should handle route parameters', () => {
            spyOn(component as any, 'loadAccountData').and.returnValue(Promise.resolve());

            // 模擬路由參數變化
            mockRoute.params = of({ id: '2' });

            component.ngOnInit();

            expect(component.accountId).toBe('2');
            expect(component.mode).toBe('edit');
        });
    });
});