/**
 * 帳戶交易模態框組件測試
 * 測試存款、提款、轉帳操作的模態框功能
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AccountTransactionModalComponent, TransactionType, TransactionResult } from './account-transaction-modal.component';
import {
  OptimizedAccountApplicationService,
  AccountResponseDto,
  DepositDto,
  WithdrawDto,
  TransferDto
} from '../../../application/services/optimized-account-application.service';
import { AccountType, AccountStatus } from '../../../domain/entities/optimized-account.entity';

describe('AccountTransactionModalComponent', () => {
  let component: AccountTransactionModalComponent;
  let fixture: ComponentFixture<AccountTransactionModalComponent>;
  let mockAccountService: jasmine.SpyObj<OptimizedAccountApplicationService>;
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

  const mockTargetAccount: AccountResponseDto = {
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
  };

  beforeEach(async () => {
    const accountServiceSpy = jasmine.createSpyObj('OptimizedAccountApplicationService', ['deposit', 'withdraw', 'transfer']);
    const messageSpy = jasmine.createSpyObj('NzMessageService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [AccountTransactionModalComponent, NoopAnimationsModule],
      providers: [
        { provide: OptimizedAccountApplicationService, useValue: accountServiceSpy },
        { provide: NzMessageService, useValue: messageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AccountTransactionModalComponent);
    component = fixture.componentInstance;
    mockAccountService = TestBed.inject(OptimizedAccountApplicationService) as jasmine.SpyObj<OptimizedAccountApplicationService>;
    mockMessage = TestBed.inject(NzMessageService) as jasmine.SpyObj<NzMessageService>;

    // Set up default inputs
    component.account = mockAccount;
    component.availableAccounts = [mockAccount, mockTargetAccount];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.visible).toBeFalse();
      expect(component.loading).toBeFalse();
      expect(component.formConfig.fields).toEqual([]);
    });

    it('should build form config on init', () => {
      component.transactionType = 'deposit';
      spyOn(component as any, 'buildFormConfig');

      component.ngOnInit();

      expect(component['buildFormConfig']).toHaveBeenCalled();
    });

    it('should build form config on changes', () => {
      component.visible = true;
      component.transactionType = 'withdraw';
      spyOn(component as any, 'buildFormConfig');

      component.ngOnChanges();

      expect(component['buildFormConfig']).toHaveBeenCalled();
    });
  });

  describe('Form Configuration', () => {
    it('should build deposit form fields', () => {
      component.transactionType = 'deposit';
      const fields = component['buildFormFields']();

      expect(fields.length).toBe(2);
      expect(fields[0].key).toBe('amount');
      expect(fields[1].key).toBe('description');
    });

    it('should build withdraw form fields', () => {
      component.transactionType = 'withdraw';
      const fields = component['buildFormFields']();

      expect(fields.length).toBe(2);
      expect(fields[0].key).toBe('amount');
      expect(fields[1].key).toBe('description');
    });

    it('should build transfer form fields', () => {
      component.transactionType = 'transfer';
      const fields = component['buildFormFields']();

      expect(fields.length).toBe(3);
      expect(fields[0].key).toBe('amount');
      expect(fields[1].key).toBe('targetAccountId');
      expect(fields[2].key).toBe('description');
    });

    it('should filter available accounts for transfer', () => {
      component.transactionType = 'transfer';
      const fields = component['buildFormFields']();
      const targetAccountField = fields.find(f => f.key === 'targetAccountId');

      expect(targetAccountField?.options?.length).toBe(1); // Only target account, not source
      expect(targetAccountField?.options?.[0].value).toBe(mockTargetAccount.id);
    });
  });

  describe('Modal Properties', () => {
    it('should return correct modal title for deposit', () => {
      component.transactionType = 'deposit';

      expect(component.modalTitle).toBe('存款');
    });

    it('should return correct modal title for withdraw', () => {
      component.transactionType = 'withdraw';

      expect(component.modalTitle).toBe('提款');
    });

    it('should return correct modal title for transfer', () => {
      component.transactionType = 'transfer';

      expect(component.modalTitle).toBe('轉帳');
    });

    it('should return correct submit button text for deposit', () => {
      component.transactionType = 'deposit';

      expect(component.submitButtonText).toBe('確認存款');
    });

    it('should return correct submit button text for withdraw', () => {
      component.transactionType = 'withdraw';

      expect(component.submitButtonText).toBe('確認提款');
    });

    it('should return correct submit button text for transfer', () => {
      component.transactionType = 'transfer';

      expect(component.submitButtonText).toBe('確認轉帳');
    });
  });

  describe('Transaction Tips', () => {
    it('should return deposit tips', () => {
      component.transactionType = 'deposit';
      const tips = component.getTransactionTips();

      expect(tips.length).toBe(3);
      expect(tips[0]).toContain('存款將立即生效');
    });

    it('should return withdraw tips', () => {
      component.transactionType = 'withdraw';
      const tips = component.getTransactionTips();

      expect(tips.length).toBe(3);
      expect(tips[0]).toContain('提款金額不能超過當前餘額');
    });

    it('should return transfer tips', () => {
      component.transactionType = 'transfer';
      const tips = component.getTransactionTips();

      expect(tips.length).toBe(4);
      expect(tips[0]).toContain('轉帳將同時影響兩個帳戶的餘額');
    });

    it('should return empty tips for unknown transaction type', () => {
      component.transactionType = undefined;
      const tips = component.getTransactionTips();

      expect(tips).toEqual([]);
    });
  });

  describe('Form Submission', () => {
    const depositFormValue = {
      amount: 1000,
      description: '測試存款'
    };

    const withdrawFormValue = {
      amount: 500,
      description: '測試提款'
    };

    const transferFormValue = {
      amount: 2000,
      targetAccountId: '2',
      description: '測試轉帳'
    };

    it('should handle deposit submission successfully', async () => {
      component.transactionType = 'deposit';
      spyOn(component as any, 'handleDeposit').and.returnValue(
        Promise.resolve({
          success: true,
          message: '存款成功',
          updatedAccount: mockAccount
        })
      );
      spyOn(component.transactionComplete, 'emit');
      spyOn(component as any, 'closeModal');

      await component.onFormSubmit(depositFormValue);

      expect(component['handleDeposit']).toHaveBeenCalledWith(depositFormValue);
      expect(mockMessage.success).toHaveBeenCalledWith('存款成功');
      expect(component.transactionComplete.emit).toHaveBeenCalled();
      expect(component['closeModal']).toHaveBeenCalled();
    });

    it('should handle withdraw submission successfully', async () => {
      component.transactionType = 'withdraw';
      spyOn(component as any, 'handleWithdraw').and.returnValue(
        Promise.resolve({
          success: true,
          message: '提款成功',
          updatedAccount: mockAccount
        })
      );
      spyOn(component.transactionComplete, 'emit');

      await component.onFormSubmit(withdrawFormValue);

      expect(component['handleWithdraw']).toHaveBeenCalledWith(withdrawFormValue);
      expect(mockMessage.success).toHaveBeenCalledWith('提款成功');
    });

    it('should handle transfer submission successfully', async () => {
      component.transactionType = 'transfer';
      spyOn(component as any, 'handleTransfer').and.returnValue(
        Promise.resolve({
          success: true,
          message: '轉帳成功',
          updatedAccount: mockAccount,
          targetAccount: mockTargetAccount
        })
      );
      spyOn(component.transactionComplete, 'emit');

      await component.onFormSubmit(transferFormValue);

      expect(component['handleTransfer']).toHaveBeenCalledWith(transferFormValue);
      expect(mockMessage.success).toHaveBeenCalledWith('轉帳成功');
    });

    it('should handle submission error', async () => {
      component.transactionType = 'deposit';
      spyOn(component as any, 'handleDeposit').and.returnValue(
        Promise.resolve({
          success: false,
          message: '存款失敗'
        })
      );

      await component.onFormSubmit(depositFormValue);

      expect(mockMessage.error).toHaveBeenCalledWith('存款失敗');
      expect(component.loading).toBeFalse();
    });

    it('should handle submission exception', async () => {
      component.transactionType = 'deposit';
      spyOn(component as any, 'handleDeposit').and.throwError('網路錯誤');
      spyOn(console, 'error');

      await component.onFormSubmit(depositFormValue);

      expect(mockMessage.error).toHaveBeenCalledWith('網路錯誤');
      expect(console.error).toHaveBeenCalled();
    });

    it('should not submit without account or transaction type', async () => {
      component.account = undefined;
      component.transactionType = 'deposit';

      await component.onFormSubmit(depositFormValue);

      expect(component.loading).toBeFalse();
    });
  });

  describe('Transaction Handlers', () => {
    it('should handle deposit correctly', async () => {
      const depositDto: DepositDto = { amount: 1000, description: '測試存款' };
      spyOn(component as any, 'mockDeposit').and.returnValue(mockAccount);

      const result = await component['handleDeposit']({ amount: 1000, description: '測試存款' });

      expect(result.success).toBeTrue();
      expect(result.message).toContain('成功存入');
      expect(result.updatedAccount).toBeDefined();
    });

    it('should handle withdraw correctly', async () => {
      const withdrawDto: WithdrawDto = { amount: 500, description: '測試提款' };
      spyOn(component as any, 'mockWithdraw').and.returnValue(mockAccount);

      const result = await component['handleWithdraw']({ amount: 500, description: '測試提款' });

      expect(result.success).toBeTrue();
      expect(result.message).toContain('成功提取');
      expect(result.updatedAccount).toBeDefined();
    });

    it('should handle transfer correctly', async () => {
      const transferDto: TransferDto = {
        targetAccountId: '2',
        amount: 2000,
        description: '測試轉帳'
      };
      spyOn(component as any, 'mockTransfer').and.returnValue({
        source: mockAccount,
        target: mockTargetAccount
      });

      const result = await component['handleTransfer']({
        targetAccountId: '2',
        amount: 2000,
        description: '測試轉帳'
      });

      expect(result.success).toBeTrue();
      expect(result.message).toContain('成功轉帳');
      expect(result.updatedAccount).toBeDefined();
      expect(result.targetAccount).toBeDefined();
    });
  });

  describe('Mock Operations', () => {
    it('should mock deposit correctly', () => {
      const depositDto: DepositDto = { amount: 1000 };
      const result = component['mockDeposit'](depositDto);

      expect(result.balance).toBe(mockAccount.balance + depositDto.amount);
      expect(result.lastTransactionDate).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should mock withdraw correctly', () => {
      const withdrawDto: WithdrawDto = { amount: 500 };
      const result = component['mockWithdraw'](withdrawDto);

      expect(result.balance).toBe(mockAccount.balance - withdrawDto.amount);
      expect(result.lastTransactionDate).toBeDefined();
      expect(result.updatedAt).toBeDefined();
    });

    it('should mock transfer correctly', () => {
      const transferDto: TransferDto = {
        targetAccountId: '2',
        amount: 2000
      };
      const result = component['mockTransfer'](transferDto);

      expect(result.source.balance).toBe(mockAccount.balance - transferDto.amount);
      expect(result.target.balance).toBe(mockTargetAccount.balance + transferDto.amount);
      expect(result.source.lastTransactionDate).toBeDefined();
      expect(result.target.lastTransactionDate).toBeDefined();
    });

    it('should throw error for invalid target account in transfer', () => {
      const transferDto: TransferDto = {
        targetAccountId: 'invalid-id',
        amount: 2000
      };

      expect(() => component['mockTransfer'](transferDto)).toThrowError('目標帳戶不存在');
    });
  });

  describe('Modal Control', () => {
    it('should emit cancel event and close modal', () => {
      spyOn(component.cancel, 'emit');
      spyOn(component as any, 'closeModal');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
      expect(component['closeModal']).toHaveBeenCalled();
    });

    it('should close modal and emit visible change', () => {
      component.visible = true;
      spyOn(component.visibleChange, 'emit');

      component['closeModal']();

      expect(component.visible).toBeFalse();
      expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly', () => {
      const formatted = component['formatCurrency'](1000);

      expect(formatted).toContain('1,000');
      expect(formatted).toContain('NT$');
    });

    it('should use account currency', () => {
      component.account = { ...mockAccount, currency: 'USD' };

      const formatted = component['formatCurrency'](1000);

      expect(formatted).toContain('$1,000');
    });

    it('should use default currency when no account', () => {
      component.account = undefined;

      const formatted = component['formatCurrency'](1000);

      expect(formatted).toContain('NT$');
    });
  });
});
