/**
 * @fileoverview 合約表單組件 (Contract Form Component)
 * @description 合約創建和編輯的表單組件
 * @author NG-AC Team
 * @version 1.0.0
 * @since 2025-08-20
 *
 * 檔案性質：
 * - 類型：Interface Layer Component
 * - 職責：合約表單 UI 邏輯
 * - 依賴：ContractApplicationService, ReactiveFormsModule
 * - 不可變更：此文件的所有註解和架構說明均不可變更
 *
 * 技術規範：
 * - 遵循 Angular 組件規範
 * - 使用 Reactive Forms
 * - 包含表單驗證
 * - 支持創建和編輯模式
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractDTO } from '@application/dto/contracts/contract.dto';
import { ContractApplicationService } from '@application/services/contracts/contract-application.service';
import { ContractStatus } from '@domain/value-objects/contract-status/contract-status.vo';
import { ContractType } from '@domain/value-objects/contract-type/contract-type.vo';
import { Subject, takeUntil } from 'rxjs';

/**
 * 合約表單組件
 */
@Component({
  selector: 'app-contract-form',
  templateUrl: './contract-form.component.html',
  styleUrls: ['./contract-form.component.scss']
})
export class ContractFormComponent implements OnInit, OnDestroy {
  @Input() contract?: ContractDTO;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() saved = new EventEmitter<ContractDTO>();
  @Output() cancelled = new EventEmitter<void>();

  public contractForm!: FormGroup;
  public isLoading = false;
  public errorMessage = '';
  public contractStatuses = Object.values(ContractStatus);
  public contractTypes = Object.values(ContractType);

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private contractService: ContractApplicationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    if (this.contract && this.mode === 'edit') {
      this.patchForm();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 初始化表單
   */
  private initForm(): void {
    this.contractForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      contractNumber: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      status: [ContractStatus.DRAFT, Validators.required],
      type: [ContractType.SERVICE, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      currency: ['TWD', Validators.required],
      partyA: ['', [Validators.required, Validators.minLength(2)]],
      partyB: ['', [Validators.required, Validators.minLength(2)]],
      terms: this.fb.array([]),
      attachments: this.fb.array([])
    });

    // 監聽開始日期變化，自動設置結束日期
    this.contractForm.get('startDate')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(startDate => {
        if (startDate && !this.contractForm.get('endDate')?.value) {
          const endDate = new Date(startDate);
          endDate.setFullYear(endDate.getFullYear() + 1);
          this.contractForm.patchValue({ endDate: endDate.toISOString().split('T')[0] });
        }
      });
  }

  /**
   * 填充表單數據
   */
  private patchForm(): void {
    if (this.contract) {
      this.contractForm.patchValue({
        title: this.contract.title,
        description: this.contract.description,
        contractNumber: this.contract.contractNumber,
        status: this.contract.status,
        type: this.contract.type,
        startDate: this.contract.startDate.split('T')[0],
        endDate: this.contract.endDate.split('T')[0],
        amount: this.contract.amount,
        currency: this.contract.currency,
        partyA: this.contract.partyA,
        partyB: this.contract.partyB,
        terms: this.contract.terms,
        attachments: this.contract.attachments
      });
    }
  }

  /**
   * 提交表單
   */
  public onSubmit(): void {
    if (this.contractForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.contractForm.value;
      const contractData = {
        ...formValue,
        startDate: new Date(formValue.startDate),
        endDate: new Date(formValue.endDate),
        createdBy: 'current-user' // 應該從認證服務獲取
      };

      this.contractService.createContract(contractData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            this.isLoading = false;
            if (result.success && result.contract) {
              this.saved.emit(this.mapContractToDTO(result.contract));
            } else {
              this.errorMessage = result.errors.join(', ');
            }
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = '創建合約失敗，請稍後重試';
            console.error('創建合約錯誤:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * 取消操作
   */
  public onCancel(): void {
    this.cancelled.emit();
  }

  /**
   * 標記表單組為已觸摸
   */
  private markFormGroupTouched(): void {
    Object.keys(this.contractForm.controls).forEach(key => {
      const control = this.contractForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * 將合約實體映射為 DTO
   */
  private mapContractToDTO(contract: any): ContractDTO {
    return ContractDTO.fromObject(contract);
  }

  /**
   * 檢查字段是否有效
   */
  public isFieldValid(fieldName: string): boolean {
    const field = this.contractForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  /**
   * 獲取字段錯誤信息
   */
  public getFieldError(fieldName: string): string {
    const field = this.contractForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return '此字段為必填項';
      if (field.errors['minlength']) return `最小長度為 ${field.errors['minlength'].requiredLength} 個字符`;
      if (field.errors['min']) return `最小值為 ${field.errors['min'].min}`;
      if (field.errors['pattern']) return '格式不正確';
    }
    return '';
  }
}
