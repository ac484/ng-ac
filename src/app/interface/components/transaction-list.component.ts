/**
 * Transaction List Component
 * Uses ng-zorro-antd and DDD application services for transaction management
 */
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subject, takeUntil, from } from 'rxjs';

import { TransactionDto, CreateTransactionDto, UpdateTransactionDto } from '../../application/dto/transaction.dto';
import { TransactionApplicationService } from '../../application/services/transaction-application.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputNumberModule
  ],
  template: `
    <div class="transaction-list-container">
      <div class="header">
        <h2>Transaction Management</h2>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <i nz-icon nzType="plus"></i>
          Add Transaction
        </button>
      </div>

      <nz-table
        #transactionTable
        [nzData]="transactions"
        [nzLoading]="loading"
        [nzTotal]="total"
        [nzPageSize]="pageSize"
        [nzPageIndex]="pageIndex"
        (nzCurrentPageDataChange)="onCurrentPageDataChange($event)"
        (nzPageIndexChange)="onPageIndexChange($event)"
        (nzPageSizeChange)="onPageSizeChange($event)"
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Account</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let transaction of transactions">
            <td>{{ transaction.id }}</td>
            <td>{{ transaction.accountId }}</td>
            <td>
              <nz-tag [nzColor]="transaction.type === 'DEPOSIT' ? 'green' : 'red'">
                {{ transaction.type }}
              </nz-tag>
            </td>
            <td>{{ transaction.amount | currency }}</td>
            <td>{{ transaction.description }}</td>
            <td>{{ transaction.date | date: 'short' }}</td>
            <td>
              <nz-tag [nzColor]="transaction.status === 'COMPLETED' ? 'green' : 'orange'">
                {{ transaction.status }}
              </nz-tag>
            </td>
            <td>
              <button nz-button nzType="primary" nzSize="small" (click)="editTransaction(transaction)">
                <i nz-icon nzType="edit"></i>
              </button>
              <button nz-button nzType="primary" nzSize="small" (click)="deleteTransaction(transaction)">
                <i nz-icon nzType="delete"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>

    <!-- Create/Edit Modal -->
    <nz-modal
      [(nzVisible)]="isModalVisible"
      [nzTitle]="isEditing ? 'Edit Transaction' : 'Create Transaction'"
      (nzOnCancel)="handleModalCancel()"
      (nzOnOk)="handleModalOk()"
    >
      <form nz-form [formGroup]="transactionForm" nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label [nzSpan]="8" nzRequired>Account</nz-form-label>
            <nz-form-control [nzSpan]="16">
              <nz-select formControlName="accountId" placeholder="Select account">
                <nz-option nzValue="account1" nzLabel="Account 1"></nz-option>
                <nz-option nzValue="account2" nzLabel="Account 2"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label [nzSpan]="8" nzRequired>Type</nz-form-label>
            <nz-form-control [nzSpan]="16">
              <nz-select formControlName="type" placeholder="Select type">
                <nz-option nzValue="INCOME" nzLabel="Income"></nz-option>
                <nz-option nzValue="EXPENSE" nzLabel="Expense"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label [nzSpan]="8" nzRequired>Amount</nz-form-label>
            <nz-form-control [nzSpan]="16">
              <nz-input-number
                formControlName="amount"
                [nzMin]="0"
                [nzStep]="0.01"
                [nzPrecision]="2"
                placeholder="Enter amount"
              ></nz-input-number>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col [nzSpan]="12">
          <nz-form-item>
            <nz-form-label [nzSpan]="8">Date</nz-form-label>
            <nz-form-control [nzSpan]="16">
              <nz-date-picker formControlName="date" nzFormat="yyyy-MM-dd" placeholder="Select date"></nz-date-picker>
            </nz-form-control>
          </nz-form-item>
        </div>

        <div nz-col [nzSpan]="24">
          <nz-form-item>
            <nz-form-label [nzSpan]="4">Description</nz-form-label>
            <nz-form-control [nzSpan]="20">
              <textarea
                nz-input
                formControlName="description"
                [nzAutosize]="{ minRows: 3, maxRows: 5 }"
                placeholder="Enter description"
              ></textarea>
            </nz-form-control>
          </nz-form-item>
        </div>
      </form>
    </nz-modal>
  `,
  styles: [
    `
      .transaction-list-container {
        padding: 24px;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .header h2 {
        margin: 0;
      }
    `
  ]
})
export class TransactionListComponent implements OnInit, OnDestroy {
  transactions: TransactionDto[] = [];
  loading = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  isModalVisible = false;
  isEditing = false;
  currentTransaction: TransactionDto | null = null;

  transactionForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private transactionService: TransactionApplicationService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTransactions();
  }

  private initForm(): void {
    this.transactionForm = this.fb.group({
      accountId: ['', []],
      type: ['INCOME', []],
      amount: [0, []],
      date: [new Date(), []],
      description: ['', []]
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async loadTransactions(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.transactionService.getAllTransactions();
      this.transactions = result.transactions;
      this.total = result.total;
      this.loading = false;
    } catch (error) {
      this.message.error('Failed to load transactions');
      this.loading = false;
    }
  }

  showCreateModal(): void {
    this.isEditing = false;
    this.currentTransaction = null;
    this.transactionForm.reset({
      type: 'INCOME',
      amount: 0,
      date: new Date()
    });
    this.isModalVisible = true;
  }

  editTransaction(transaction: TransactionDto): void {
    this.isEditing = true;
    this.currentTransaction = transaction;
    this.transactionForm.patchValue({
      accountId: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: new Date(transaction.date)
    });
    this.isModalVisible = true;
  }

  deleteTransaction(transaction: TransactionDto): void {
    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this transaction?',
      nzContent: `Transaction: ${transaction.description}`,
      nzOkText: 'Yes',
      nzCancelText: 'No',
      nzOnOk: () => {
        from(this.transactionService.deleteTransaction(transaction.id))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Transaction deleted successfully');
              this.loadTransactions();
            },
            error: (error: any) => {
              this.message.error('Failed to delete transaction');
            }
          });
      }
    });
  }

  handleModalOk(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;

      if (this.isEditing && this.currentTransaction) {
        const updateDto: UpdateTransactionDto = {
          description: formValue.description!,
          category: formValue.category,
          referenceNumber: formValue.referenceNumber,
          notes: formValue.notes
        };

        from(this.transactionService.updateTransaction(this.currentTransaction.id, updateDto))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Transaction updated successfully');
              this.isModalVisible = false;
              this.loadTransactions();
            },
            error: (error: any) => {
              this.message.error('Failed to update transaction');
            }
          });
      } else {
        const createDto: CreateTransactionDto = {
          accountId: formValue.accountId!,
          userId: 'current-user-id', // This should come from auth service
          amount: formValue.amount!,
          transactionType: formValue.type!,
          description: formValue.description!
        };

        from(this.transactionService.createTransaction(createDto))
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.message.success('Transaction created successfully');
              this.isModalVisible = false;
              this.loadTransactions();
            },
            error: (error: any) => {
              this.message.error('Failed to create transaction');
            }
          });
      }
    } else {
      this.message.error('Please fill in all required fields');
    }
  }

  handleModalCancel(): void {
    this.isModalVisible = false;
  }

  onCurrentPageDataChange(data: readonly TransactionDto[]): void {
    this.transactions = [...data];
  }

  onPageIndexChange(pageIndex: number): void {
    this.pageIndex = pageIndex;
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
  }
}
