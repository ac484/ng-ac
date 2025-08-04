/**
 * 優化的交易應用服務測試
 */

import { TestBed } from '@angular/core/testing';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Repository, ValidationError, NotFoundError } from './base-application.service';
import { ErrorHandlerService } from './error-handler.service';
import {
  OptimizedTransactionApplicationService,
  CreateTransactionDto,
  UpdateTransactionDto,
  ProcessTransactionDto
} from './optimized-transaction-application.service';
import { OptimizedTransaction, TransactionType, TransactionStatus } from '../../domain/entities/optimized-transaction.entity';
import { TRANSACTION_REPOSITORY } from '../../domain/repositories/repository-tokens';
import { Money } from '../../domain/value-objects/account/money.value-object';

describe('OptimizedTransactionApplicationService', () => {
  let service: OptimizedTransactionApplicationService;
  let mockRepository: jasmine.SpyObj<Repository<OptimizedTransaction>>;
  let mockErrorHandler: jasmine.SpyObj<ErrorHandlerService>;
  let mockMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(() => {
    // 創建 mock 物件
    mockRepository = jasmine.createSpyObj('Repository', ['findById', 'findAll', 'save', 'delete']);

    mockErrorHandler = jasmine.createSpyObj('ErrorHandlerService', ['handleError', 'handleSuccess', 'handleWarning']);

    mockMessageService = jasmine.createSpyObj('NzMessageService', ['success', 'error', 'warning', 'info']);

    TestBed.configureTestingModule({
      providers: [
        OptimizedTransactionApplicationService,
        { provide: TRANSACTION_REPOSITORY, useValue: mockRepository },
        { provide: ErrorHandlerService, useValue: mockErrorHandler },
        { provide: NzMessageService, useValue: mockMessageService }
      ]
    });

    service = TestBed.inject(OptimizedTransactionApplicationService);
  });

  describe('create', () => {
    it('should create transaction successfully', async () => {
      // Arrange
      const createDto: CreateTransactionDto = {
        accountId: 'account-123',
        userId: 'user-123',
        amount: 1000,
        currency: 'TWD',
        transactionType: TransactionType.DEPOSIT,
        description: '存款交易',
        category: '收入'
      };

      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.accountId).toBe(createDto.accountId);
      expect(result.userId).toBe(createDto.userId);
      expect(result.amount).toBe(createDto.amount);
      expect(result.currency).toBe(createDto.currency || 'TWD');
      expect(result.transactionType).toBe(createDto.transactionType);
      expect(result.description).toBe(createDto.description);
      expect(result.category).toBe(createDto.category);
      expect(result.status).toBe(TransactionStatus.PENDING);
      expect(result.transactionNumber).toMatch(/^TXN-\d+-[A-Z0-9]{6}$/);
      expect(mockRepository.save).toHaveBeenCalledWith(jasmine.any(OptimizedTransaction));
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('創建成功');
    });

    it('should throw ValidationError when accountId is empty', async () => {
      // Arrange
      const createDto: CreateTransactionDto = {
        accountId: '',
        userId: 'user-123',
        amount: 1000,
        transactionType: TransactionType.DEPOSIT,
        description: '存款交易'
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError(ValidationError, '帳戶 ID 不能為空');
    });

    it('should throw ValidationError when amount is zero or negative', async () => {
      // Arrange
      const createDto: CreateTransactionDto = {
        accountId: 'account-123',
        userId: 'user-123',
        amount: 0,
        transactionType: TransactionType.DEPOSIT,
        description: '存款交易'
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError(ValidationError, '交易金額必須大於零');
    });

    it('should throw ValidationError when description is empty', async () => {
      // Arrange
      const createDto: CreateTransactionDto = {
        accountId: 'account-123',
        userId: 'user-123',
        amount: 1000,
        transactionType: TransactionType.DEPOSIT,
        description: ''
      };

      // Act & Assert
      await expectAsync(service.create(createDto)).toBeRejectedWithError(ValidationError, '交易描述不能為空');
    });

    it('should use default currency TWD when not specified', async () => {
      // Arrange
      const createDto: CreateTransactionDto = {
        accountId: 'account-123',
        userId: 'user-123',
        amount: 1000,
        transactionType: TransactionType.DEPOSIT,
        description: '存款交易'
      };

      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result.currency).toBe('TWD');
    });
  });

  describe('update', () => {
    it('should update transaction successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const updateDto: UpdateTransactionDto = {
        description: '更新的描述',
        category: '更新的分類',
        notes: '更新的備註'
      };

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.update(transactionId, updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.description).toBe(updateDto.description!);
      expect(result.category).toBe(updateDto.category);
      expect(result.notes).toBe(updateDto.notes);
      expect(mockRepository.findById).toHaveBeenCalledWith(transactionId);
      expect(mockRepository.save).toHaveBeenCalledWith(existingTransaction);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('更新成功');
    });

    it('should throw NotFoundError when transaction does not exist', async () => {
      // Arrange
      const transactionId = 'non-existent-id';
      const updateDto: UpdateTransactionDto = {
        description: '更新的描述'
      };

      mockRepository.findById.and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(service.update(transactionId, updateDto)).toBeRejectedWithError(NotFoundError, '實體不存在');
    });
  });

  describe('updateStatus', () => {
    it('should update transaction status to PROCESSING successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const statusDto = {
        status: TransactionStatus.PROCESSING,
        reason: '開始處理'
      };

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.updateStatus(transactionId, statusDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.PROCESSING);
      expect(mockRepository.save).toHaveBeenCalledWith(existingTransaction);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('交易狀態更新成功');
    });

    it('should update transaction status to COMPLETED successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const statusDto = {
        status: TransactionStatus.COMPLETED
      };

      const existingTransaction = createMockTransaction();
      existingTransaction.status = TransactionStatus.PROCESSING; // 設定為可以轉換到 COMPLETED 的狀態
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.updateStatus(transactionId, statusDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should throw ValidationError for invalid status', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const statusDto = {
        status: 'INVALID_STATUS' as TransactionStatus
      };

      // Act & Assert
      await expectAsync(service.updateStatus(transactionId, statusDto)).toBeRejectedWithError(ValidationError, '無效的交易狀態');
    });
  });

  describe('processTransaction', () => {
    it('should process transaction successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const processDto: ProcessTransactionDto = {
        action: 'process'
      };

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.processTransaction(transactionId, processDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.PROCESSING);
      expect(mockRepository.save).toHaveBeenCalledWith(existingTransaction);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('交易process成功');
    });

    it('should complete transaction successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const processDto: ProcessTransactionDto = {
        action: 'complete'
      };

      const existingTransaction = createMockTransaction();
      existingTransaction.status = TransactionStatus.PROCESSING;
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.processTransaction(transactionId, processDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.COMPLETED);
    });

    it('should fail transaction with reason', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const processDto: ProcessTransactionDto = {
        action: 'fail',
        reason: '餘額不足'
      };

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.processTransaction(transactionId, processDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.FAILED);
      expect(result.notes).toContain('失敗原因: 餘額不足');
    });

    it('should retry failed transaction', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const processDto: ProcessTransactionDto = {
        action: 'retry'
      };

      const existingTransaction = createMockTransaction();
      existingTransaction.status = TransactionStatus.FAILED;
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.processTransaction(transactionId, processDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(TransactionStatus.PENDING);
      expect(result.notes).toContain('重試於');
    });

    it('should throw ValidationError for invalid action', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const processDto = {
        action: 'invalid_action' as any
      };

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));

      // Act & Assert
      await expectAsync(service.processTransaction(transactionId, processDto)).toBeRejectedWithError(
        ValidationError,
        '不支援的處理動作: invalid_action'
      );
    });
  });

  describe('addFees', () => {
    it('should add fees successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const feeAmount = 50;
      const currency = 'TWD';

      const existingTransaction = createMockTransaction();
      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.save.and.returnValue(Promise.resolve());

      // Act
      const result = await service.addFees(transactionId, feeAmount, currency);

      // Assert
      expect(result).toBeDefined();
      expect(result.fees).toBe(feeAmount);
      expect(result.totalAmount).toBe(1000 + feeAmount); // 原金額 + 手續費
      expect(mockRepository.save).toHaveBeenCalledWith(existingTransaction);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('手續費添加成功');
    });

    it('should throw ValidationError when fee amount is zero or negative', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const feeAmount = 0;

      // Act & Assert
      await expectAsync(service.addFees(transactionId, feeAmount)).toBeRejectedWithError(ValidationError, '手續費金額必須大於零');
    });
  });

  describe('getByAccountId', () => {
    it('should get transactions by account ID successfully', async () => {
      // Arrange
      const accountId = 'account-123';
      const mockTransactions = [createMockTransaction(), createMockTransaction()];
      mockTransactions[0].accountId = accountId;
      mockTransactions[1].accountId = accountId;

      mockRepository.findAll.and.returnValue(Promise.resolve(mockTransactions));

      // Act
      const result = await service.getByAccountId(accountId);

      // Assert
      expect(result).toBeDefined();
      expect(result.items.length).toBe(2);
      expect(result.items.every(item => item.accountId === accountId)).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should throw ValidationError when account ID is empty', async () => {
      // Act & Assert
      await expectAsync(service.getByAccountId('')).toBeRejectedWithError(ValidationError, '帳戶 ID 不能為空');
    });
  });

  describe('getByUserId', () => {
    it('should get transactions by user ID successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const mockTransactions = [createMockTransaction(), createMockTransaction()];
      mockTransactions[0].userId = userId;
      mockTransactions[1].userId = userId;

      mockRepository.findAll.and.returnValue(Promise.resolve(mockTransactions));

      // Act
      const result = await service.getByUserId(userId);

      // Assert
      expect(result).toBeDefined();
      expect(result.items.length).toBe(2);
      expect(result.items.every(item => item.userId === userId)).toBe(true);
      expect(result.total).toBe(2);
    });

    it('should throw ValidationError when user ID is empty', async () => {
      // Act & Assert
      await expectAsync(service.getByUserId('')).toBeRejectedWithError(ValidationError, '用戶 ID 不能為空');
    });
  });

  describe('getStatistics', () => {
    it('should get transaction statistics successfully', async () => {
      // Arrange
      const mockTransactions = [
        createMockTransaction(TransactionStatus.COMPLETED, TransactionType.DEPOSIT, 1000),
        createMockTransaction(TransactionStatus.PENDING, TransactionType.WITHDRAWAL, 500),
        createMockTransaction(TransactionStatus.FAILED, TransactionType.TRANSFER, 200)
      ];

      // Set the status for each transaction
      mockTransactions[0].status = TransactionStatus.COMPLETED;
      mockTransactions[1].status = TransactionStatus.PENDING;
      mockTransactions[2].status = TransactionStatus.FAILED;

      mockRepository.findAll.and.returnValue(Promise.resolve(mockTransactions));

      // Act
      const result = await service.getStatistics();

      // Assert
      expect(result).toBeDefined();
      expect(result.totalCount).toBe(3);
      expect(result.totalAmount).toBe(1700);
      expect(result.averageAmount).toBe(1700 / 3);
      expect(result.completedCount).toBe(1);
      expect(result.pendingCount).toBe(1);
      expect(result.failedCount).toBe(1);
      expect(result.byStatus[TransactionStatus.COMPLETED]).toBe(1);
      expect(result.byStatus[TransactionStatus.PENDING]).toBe(1);
      expect(result.byStatus[TransactionStatus.FAILED]).toBe(1);
      expect(result.byType[TransactionType.DEPOSIT]).toBe(1);
      expect(result.byType[TransactionType.WITHDRAWAL]).toBe(1);
      expect(result.byType[TransactionType.TRANSFER]).toBe(1);
    });

    it('should return zero statistics when no transactions exist', async () => {
      // Arrange
      mockRepository.findAll.and.returnValue(Promise.resolve([]));

      // Act
      const result = await service.getStatistics();

      // Assert
      expect(result).toBeDefined();
      expect(result.totalCount).toBe(0);
      expect(result.totalAmount).toBe(0);
      expect(result.averageAmount).toBe(0);
      expect(result.completedCount).toBe(0);
      expect(result.pendingCount).toBe(0);
    });
  });

  describe('delete', () => {
    it('should delete pending transaction successfully', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const existingTransaction = createMockTransaction(TransactionStatus.PENDING);

      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));
      mockRepository.delete.and.returnValue(Promise.resolve());

      // Act
      await service.delete(transactionId);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(transactionId);
      expect(mockErrorHandler.handleSuccess).toHaveBeenCalledWith('刪除成功');
    });

    it('should throw ValidationError when trying to delete completed transaction', async () => {
      // Arrange
      const transactionId = 'transaction-123';
      const existingTransaction = createMockTransaction(TransactionStatus.COMPLETED);
      existingTransaction.status = TransactionStatus.COMPLETED; // Ensure status is set

      mockRepository.findById.and.returnValue(Promise.resolve(existingTransaction));

      // Act & Assert
      await expectAsync(service.delete(transactionId)).toBeRejectedWithError(ValidationError, '已完成的交易不能刪除');
    });
  });

  // 輔助方法
  function createMockTransaction(
    status: TransactionStatus = TransactionStatus.PENDING,
    type: TransactionType = TransactionType.DEPOSIT,
    amount = 1000
  ): OptimizedTransaction {
    const money = new Money(amount, 'TWD');
    const transaction = OptimizedTransaction.create(
      'TXN-123456789-ABC123',
      'account-123',
      'user-123',
      money,
      type,
      '測試交易',
      'transaction-123'
    );

    // Set the status after creation
    transaction.status = status;

    return transaction;
  }
});
