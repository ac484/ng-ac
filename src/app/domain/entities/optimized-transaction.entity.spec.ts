/**
 * 優化交易實體單元測試
 */

import { OptimizedTransaction, TransactionType, TransactionStatus, TransactionData } from './optimized-transaction.entity';
import { Money } from '../value-objects/account/money.value-object';
import { createEntityData } from './optimized-base-entity';

describe('OptimizedTransaction', () => {
    let transactionData: TransactionData;
    let amount: Money;
    let fees: Money;

    beforeEach(() => {
        amount = new Money(100, 'USD');
        fees = new Money(5, 'USD');

        transactionData = {
            ...createEntityData('test-transaction-id'),
            transactionNumber: 'TXN-001',
            accountId: 'account-123',
            userId: 'user-456',
            amount,
            transactionType: TransactionType.DEPOSIT,
            status: TransactionStatus.PENDING,
            description: 'Test transaction'
        };
    });

    describe('constructor', () => {
        it('should create transaction with all properties', () => {
            const transaction = new OptimizedTransaction(transactionData);

            expect(transaction.id).toBe('test-transaction-id');
            expect(transaction.transactionNumber).toBe('TXN-001');
            expect(transaction.accountId).toBe('account-123');
            expect(transaction.userId).toBe('user-456');
            expect(transaction.amount).toBe(amount);
            expect(transaction.transactionType).toBe(TransactionType.DEPOSIT);
            expect(transaction.status).toBe(TransactionStatus.PENDING);
            expect(transaction.description).toBe('Test transaction');
        });
    });

    describe('create', () => {
        it('should create new transaction with PENDING status', () => {
            const transaction = OptimizedTransaction.create(
                'TXN-002',
                'account-123',
                'user-456',
                amount,
                TransactionType.WITHDRAWAL,
                'Withdrawal transaction'
            );

            expect(transaction.transactionNumber).toBe('TXN-002');
            expect(transaction.status).toBe(TransactionStatus.PENDING);
            expect(transaction.transactionType).toBe(TransactionType.WITHDRAWAL);
            expect(transaction.hasDomainEvents()).toBe(true);
            expect(transaction.getDomainEventCount()).toBe(1);
        });

        it('should use provided id when creating transaction', () => {
            const customId = 'custom-transaction-id';
            const transaction = OptimizedTransaction.create(
                'TXN-003',
                'account-123',
                'user-456',
                amount,
                TransactionType.TRANSFER,
                'Transfer transaction',
                customId
            );

            expect(transaction.id).toBe(customId);
        });
    });

    describe('state transitions', () => {
        let transaction: OptimizedTransaction;

        beforeEach(() => {
            transaction = new OptimizedTransaction(transactionData);
        });

        describe('process', () => {
            it('should transition from PENDING to PROCESSING', () => {
                transaction.process();

                expect(transaction.status).toBe(TransactionStatus.PROCESSING);
                expect(transaction.isProcessing()).toBe(true);
            });

            it('should throw error when not in PENDING status', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.process()).toThrowError('無法從 COMPLETED 狀態轉換到 PROCESSING 狀態');
            });
        });

        describe('complete', () => {
            it('should transition from PROCESSING to COMPLETED', () => {
                transaction.status = TransactionStatus.PROCESSING;
                transaction.complete();

                expect(transaction.status).toBe(TransactionStatus.COMPLETED);
                expect(transaction.isCompleted()).toBe(true);
                expect(transaction.hasDomainEvents()).toBe(true);
            });

            it('should throw error when not in PROCESSING status', () => {
                expect(() => transaction.complete()).toThrowError('無法從 PENDING 狀態轉換到 COMPLETED 狀態');
            });
        });

        describe('fail', () => {
            it('should transition from PENDING to FAILED', () => {
                const reason = 'Insufficient funds';
                transaction.fail(reason);

                expect(transaction.status).toBe(TransactionStatus.FAILED);
                expect(transaction.isFailed()).toBe(true);
                expect(transaction.notes).toContain(reason);
                expect(transaction.hasDomainEvents()).toBe(true);
            });

            it('should transition from PROCESSING to FAILED', () => {
                transaction.status = TransactionStatus.PROCESSING;
                transaction.fail();

                expect(transaction.status).toBe(TransactionStatus.FAILED);
            });

            it('should throw error when trying to fail COMPLETED transaction', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.fail()).toThrowError('無法從 COMPLETED 狀態轉換到 FAILED 狀態');
            });
        });

        describe('cancel', () => {
            it('should transition from PENDING to CANCELLED', () => {
                const reason = 'User requested cancellation';
                transaction.cancel(reason);

                expect(transaction.status).toBe(TransactionStatus.CANCELLED);
                expect(transaction.isCancelled()).toBe(true);
                expect(transaction.notes).toContain(reason);
                expect(transaction.hasDomainEvents()).toBe(true);
            });

            it('should throw error when trying to cancel COMPLETED transaction', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.cancel()).toThrowError('無法從 COMPLETED 狀態轉換到 CANCELLED 狀態');
            });
        });

        describe('retry', () => {
            it('should transition from FAILED to PENDING', () => {
                transaction.status = TransactionStatus.FAILED;
                transaction.retry();

                expect(transaction.status).toBe(TransactionStatus.PENDING);
                expect(transaction.notes).toContain('重試於');
            });

            it('should throw error when not in FAILED status', () => {
                expect(() => transaction.retry()).toThrowError('只有失敗的交易才能重試');
            });
        });
    });

    describe('business methods', () => {
        let transaction: OptimizedTransaction;

        beforeEach(() => {
            transaction = new OptimizedTransaction(transactionData);
        });

        describe('updateDescription', () => {
            it('should update description when transaction can be modified', () => {
                const newDescription = 'Updated description';
                transaction.updateDescription(newDescription);

                expect(transaction.description).toBe(newDescription);
            });

            it('should throw error when transaction is completed', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.updateDescription('New description'))
                    .toThrowError('已完成的交易不能修改');
            });
        });

        describe('updateCategory', () => {
            it('should update category when transaction can be modified', () => {
                const category = 'Food & Dining';
                transaction.updateCategory(category);

                expect(transaction.category).toBe(category);
            });

            it('should throw error when transaction is completed', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.updateCategory('New category'))
                    .toThrowError('已完成的交易不能修改');
            });
        });

        describe('addFees', () => {
            it('should add fees to transaction', () => {
                transaction.addFees(fees);

                expect(transaction.fees).toBe(fees);
                expect(transaction.getTotalAmount().getAmount()).toBe(105); // 100 + 5
            });

            it('should accumulate multiple fees', () => {
                const additionalFees = new Money(3, 'USD');
                transaction.addFees(fees);
                transaction.addFees(additionalFees);

                expect(transaction.fees!.getAmount()).toBe(8); // 5 + 3
                expect(transaction.getTotalAmount().getAmount()).toBe(108); // 100 + 8
            });

            it('should throw error when currencies do not match', () => {
                const differentCurrencyFees = new Money(5, 'EUR');

                expect(() => transaction.addFees(differentCurrencyFees))
                    .toThrowError('手續費貨幣必須與交易金額貨幣一致');
            });

            it('should throw error when transaction is completed', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(() => transaction.addFees(fees))
                    .toThrowError('已完成的交易不能修改');
            });
        });

        describe('getTotalAmount', () => {
            it('should return amount when no fees', () => {
                const total = transaction.getTotalAmount();

                expect(total.getAmount()).toBe(100);
                expect(total.getCurrency()).toBe('USD');
            });

            it('should return amount plus fees when fees exist', () => {
                transaction.addFees(fees);
                const total = transaction.getTotalAmount();

                expect(total.getAmount()).toBe(105);
                expect(total.getCurrency()).toBe('USD');
            });
        });

        describe('canBeModified', () => {
            it('should return true when transaction is not completed', () => {
                expect(transaction.canBeModified()).toBe(true);
            });

            it('should return false when transaction is completed', () => {
                transaction.status = TransactionStatus.COMPLETED;

                expect(transaction.canBeModified()).toBe(false);
            });
        });
    });

    describe('status check methods', () => {
        let transaction: OptimizedTransaction;

        beforeEach(() => {
            transaction = new OptimizedTransaction(transactionData);
        });

        it('should correctly identify pending status', () => {
            expect(transaction.isPending()).toBe(true);
            expect(transaction.isProcessing()).toBe(false);
            expect(transaction.isCompleted()).toBe(false);
            expect(transaction.isFailed()).toBe(false);
            expect(transaction.isCancelled()).toBe(false);
        });

        it('should correctly identify processing status', () => {
            transaction.status = TransactionStatus.PROCESSING;

            expect(transaction.isPending()).toBe(false);
            expect(transaction.isProcessing()).toBe(true);
            expect(transaction.isCompleted()).toBe(false);
            expect(transaction.isFailed()).toBe(false);
            expect(transaction.isCancelled()).toBe(false);
        });

        it('should correctly identify completed status', () => {
            transaction.status = TransactionStatus.COMPLETED;

            expect(transaction.isPending()).toBe(false);
            expect(transaction.isProcessing()).toBe(false);
            expect(transaction.isCompleted()).toBe(true);
            expect(transaction.isFailed()).toBe(false);
            expect(transaction.isCancelled()).toBe(false);
        });

        it('should correctly identify failed status', () => {
            transaction.status = TransactionStatus.FAILED;

            expect(transaction.isPending()).toBe(false);
            expect(transaction.isProcessing()).toBe(false);
            expect(transaction.isCompleted()).toBe(false);
            expect(transaction.isFailed()).toBe(true);
            expect(transaction.isCancelled()).toBe(false);
        });

        it('should correctly identify cancelled status', () => {
            transaction.status = TransactionStatus.CANCELLED;

            expect(transaction.isPending()).toBe(false);
            expect(transaction.isProcessing()).toBe(false);
            expect(transaction.isCompleted()).toBe(false);
            expect(transaction.isFailed()).toBe(false);
            expect(transaction.isCancelled()).toBe(true);
        });
    });

    describe('validation', () => {
        it('should pass validation with valid data', () => {
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(true);
            expect(result.errors.length).toBe(0);
        });

        it('should fail validation with empty transaction number', () => {
            transactionData.transactionNumber = '';
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('交易編號不能為空');
        });

        it('should fail validation with empty account id', () => {
            transactionData.accountId = '';
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('帳戶 ID 不能為空');
        });

        it('should fail validation with empty user id', () => {
            transactionData.userId = '';
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('用戶 ID 不能為空');
        });

        it('should fail validation with zero amount', () => {
            transactionData.amount = new Money(0, 'USD');
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('交易金額必須大於零');
        });

        it('should fail validation with empty description', () => {
            transactionData.description = '';
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('交易描述不能為空');
        });

        it('should fail validation with too long description', () => {
            transactionData.description = 'a'.repeat(501);
            const transaction = new OptimizedTransaction(transactionData);
            const result = transaction.validate();

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('交易描述不能超過 500 個字元');
        });
    });

    describe('getSummary', () => {
        it('should return transaction summary', () => {
            const transaction = new OptimizedTransaction(transactionData);
            transaction.addFees(fees);

            const summary = transaction.getSummary();

            expect(summary.id).toBe(transaction.id);
            expect(summary.transactionNumber).toBe('TXN-001');
            expect(summary.amount).toBe(amount.toDisplayString());
            expect(summary.totalAmount).toBe(transaction.getTotalAmount().toDisplayString());
            expect(summary.type).toBe(TransactionType.DEPOSIT);
            expect(summary.status).toBe(TransactionStatus.PENDING);
            expect(summary.description).toBe('Test transaction');
        });
    });

    describe('toJSON', () => {
        it('should serialize transaction to JSON', () => {
            const transaction = new OptimizedTransaction(transactionData);
            transaction.addFees(fees);

            const json = transaction.toJSON();

            expect(json.id).toBe(transaction.id);
            expect(json.transactionNumber).toBe('TXN-001');
            expect(json.amount.amount).toBe(100);
            expect(json.amount.currency).toBe('USD');
            expect(json.fees.amount).toBe(5);
            expect(json.fees.currency).toBe('USD');
            expect(json.transactionType).toBe(TransactionType.DEPOSIT);
            expect(json.status).toBe(TransactionStatus.PENDING);
        });

        it('should serialize transaction without fees', () => {
            const transaction = new OptimizedTransaction(transactionData);

            const json = transaction.toJSON();

            expect(json.fees).toBeUndefined();
        });
    });

    describe('static factory methods', () => {
        describe('createDeposit', () => {
            it('should create deposit transaction', () => {
                const transaction = OptimizedTransaction.createDeposit(
                    'DEP-001',
                    'account-123',
                    'user-456',
                    amount,
                    'Deposit transaction'
                );

                expect(transaction.transactionType).toBe(TransactionType.DEPOSIT);
                expect(transaction.transactionNumber).toBe('DEP-001');
                expect(transaction.status).toBe(TransactionStatus.PENDING);
            });
        });

        describe('createWithdrawal', () => {
            it('should create withdrawal transaction', () => {
                const transaction = OptimizedTransaction.createWithdrawal(
                    'WTH-001',
                    'account-123',
                    'user-456',
                    amount,
                    'Withdrawal transaction'
                );

                expect(transaction.transactionType).toBe(TransactionType.WITHDRAWAL);
                expect(transaction.transactionNumber).toBe('WTH-001');
                expect(transaction.status).toBe(TransactionStatus.PENDING);
            });
        });

        describe('createTransfer', () => {
            it('should create transfer transaction', () => {
                const transaction = OptimizedTransaction.createTransfer(
                    'TRF-001',
                    'account-123',
                    'user-456',
                    amount,
                    'Transfer transaction'
                );

                expect(transaction.transactionType).toBe(TransactionType.TRANSFER);
                expect(transaction.transactionNumber).toBe('TRF-001');
                expect(transaction.status).toBe(TransactionStatus.PENDING);
            });
        });
    });

    describe('domain events', () => {
        it('should add domain event when creating transaction', () => {
            const transaction = OptimizedTransaction.create(
                'TXN-001',
                'account-123',
                'user-456',
                amount,
                TransactionType.DEPOSIT,
                'Test transaction'
            );

            expect(transaction.hasDomainEvents()).toBe(true);
            expect(transaction.getDomainEventCount()).toBe(1);
        });

        it('should add domain event when completing transaction', () => {
            const transaction = new OptimizedTransaction(transactionData);
            transaction.status = TransactionStatus.PROCESSING;
            transaction.complete();

            expect(transaction.hasDomainEvents()).toBe(true);
        });

        it('should add domain event when failing transaction', () => {
            const transaction = new OptimizedTransaction(transactionData);
            transaction.fail('Test failure');

            expect(transaction.hasDomainEvents()).toBe(true);
        });

        it('should add domain event when cancelling transaction', () => {
            const transaction = new OptimizedTransaction(transactionData);
            transaction.cancel('Test cancellation');

            expect(transaction.hasDomainEvents()).toBe(true);
        });

        it('should clear domain events', () => {
            const transaction = OptimizedTransaction.create(
                'TXN-001',
                'account-123',
                'user-456',
                amount,
                TransactionType.DEPOSIT,
                'Test transaction'
            );

            transaction.clearDomainEvents();

            expect(transaction.hasDomainEvents()).toBe(false);
            expect(transaction.getDomainEventCount()).toBe(0);
        });
    });
});