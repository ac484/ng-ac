import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CompanyService } from '../../application/services/company.service';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { CreateCompanyDto } from '../../application/dto/company.dto';

/**
 * 公司列表組件
 * 極簡設計，使用 ng-zorro-antd 組件，OnPush 變更檢測
 */
@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzSpinModule,
    NzEmptyModule,
    NzIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="company-list-container">
      <!-- 標題和操作區 -->
      <div class="header">
        <h2>合作夥伴管理</h2>
        <div class="actions">
          <nz-input-group nzSearch [nzAddOnAfter]="searchButton" class="search-input">
            <input 
              nz-input 
              placeholder="搜尋公司名稱或統編..." 
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch($event)"
            />
          </nz-input-group>
          <ng-template #searchButton>
            <button nz-button nzType="primary" nzSearch>
              <span nz-icon nzType="search"></span>
            </button>
          </ng-template>
          
          <button nz-button nzType="primary" (click)="showCreateModal()">
            <span nz-icon nzType="plus"></span>
            新增合作夥伴
          </button>
        </div>
      </div>

      <!-- 載入狀態 -->
      <div *ngIf="companyService.loading()" class="loading-container">
        <nz-spin nzSize="large" nzTip="載入中..."></nz-spin>
      </div>

      <!-- 空狀態 -->
      <nz-empty 
        *ngIf="!companyService.loading() && !companyService.hasCompanies()"
        nzNotFoundImage="simple"
        nzNotFoundContent="尚無合作夥伴資料">
        <div nz-empty-footer>
          <button nz-button nzType="primary" (click)="showCreateModal()">
            立即新增
          </button>
        </div>
      </nz-empty>

      <!-- 公司列表 -->
      <nz-table 
        *ngIf="!companyService.loading() && companyService.hasCompanies()"
        [nzData]="filteredCompanies()" 
        [nzPageSize]="10"
        [nzShowSizeChanger]="true"
        [nzShowQuickJumper]="true">
        <thead>
          <tr>
            <th>公司名稱</th>
            <th>統一編號</th>
            <th>地址</th>
            <th>電話</th>
            <th>狀態</th>
            <th>風險等級</th>
            <th>聯絡人數</th>
            <th nzWidth="120px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let company of filteredCompanies(); trackBy: trackByCompanyId">
            <td>{{ company.companyName }}</td>
            <td>{{ company.businessRegistrationNumber }}</td>
            <td>{{ company.address }}</td>
            <td>{{ company.businessPhone }}</td>
            <td>
              <nz-tag [nzColor]="getStatusColor(company.status)">
                {{ company.status }}
              </nz-tag>
            </td>
            <td>
              <nz-tag [nzColor]="getRiskColor(company.riskLevel)">
                {{ company.riskLevel }}
              </nz-tag>
            </td>
            <td>{{ company.contacts.length }}</td>
            <td>
              <button nz-button nzType="link" nzSize="small">
                <span nz-icon nzType="edit"></span>
              </button>
              <button nz-button nzType="link" nzSize="small" nzDanger>
                <span nz-icon nzType="delete"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- 新增公司模態框 -->
      <nz-modal
        [(nzVisible)]="isCreateModalVisible"
        nzTitle="新增合作夥伴"
        nzWidth="600px"
        [nzOkLoading]="isSubmitting()"
        (nzOnOk)="handleCreateCompany()"
        (nzOnCancel)="handleCancelCreate()">
        
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="createForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>公司名稱</nz-form-label>
              <nz-form-control nzErrorTip="請輸入公司名稱">
                <input nz-input formControlName="companyName" placeholder="請輸入公司名稱" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>統一編號</nz-form-label>
              <nz-form-control nzErrorTip="請輸入統一編號">
                <input nz-input formControlName="businessRegistrationNumber" placeholder="請輸入統一編號" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>公司地址</nz-form-label>
              <nz-form-control nzErrorTip="請輸入公司地址">
                <input nz-input formControlName="address" placeholder="請輸入公司地址" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label nzRequired>聯絡電話</nz-form-label>
              <nz-form-control nzErrorTip="請輸入聯絡電話">
                <input nz-input formControlName="businessPhone" placeholder="請輸入聯絡電話" />
              </nz-form-control>
            </nz-form-item>

            <div nz-row [nzGutter]="16">
              <div nz-col nzSpan="12">
                <nz-form-item>
                  <nz-form-label>狀態</nz-form-label>
                  <nz-form-control>
                    <nz-select formControlName="status" placeholder="請選擇狀態">
                      <nz-option 
                        *ngFor="let status of statusOptions" 
                        [nzLabel]="status" 
                        [nzValue]="status">
                      </nz-option>
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col nzSpan="12">
                <nz-form-item>
                  <nz-form-label>風險等級</nz-form-label>
                  <nz-form-control>
                    <nz-select formControlName="riskLevel" placeholder="請選擇風險等級">
                      <nz-option 
                        *ngFor="let risk of riskOptions" 
                        [nzLabel]="risk" 
                        [nzValue]="risk">
                      </nz-option>
                    </nz-select>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>

            <div nz-row [nzGutter]="16">
              <div nz-col nzSpan="12">
                <nz-form-item>
                  <nz-form-label>傳真</nz-form-label>
                  <nz-form-control>
                    <input nz-input formControlName="fax" placeholder="請輸入傳真" />
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col nzSpan="12">
                <nz-form-item>
                  <nz-form-label>網站</nz-form-label>
                  <nz-form-control>
                    <input nz-input formControlName="website" placeholder="請輸入網站" />
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .company-list-container {
      padding: 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .header h2 {
      margin: 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .search-input {
      width: 300px;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class CompanyListComponent {
  protected readonly companyService = inject(CompanyService);
  private readonly fb = inject(FormBuilder);
  private readonly modal = inject(NzModalService);
  private readonly message = inject(NzMessageService);

  // 組件狀態
  searchQuery = '';
  isCreateModalVisible = false;
  private readonly isSubmittingSignal = signal(false);

  // 表單
  createForm = this.fb.group({
    companyName: ['', [Validators.required]],
    businessRegistrationNumber: ['', [Validators.required]],
    address: ['', [Validators.required]],
    businessPhone: ['', [Validators.required]],
    status: [CompanyStatusEnum.Active],
    riskLevel: [RiskLevelEnum.Low],
    fax: [''],
    website: ['']
  });

  // 選項
  readonly statusOptions = Object.values(CompanyStatusEnum);
  readonly riskOptions = Object.values(RiskLevelEnum);

  // Computed
  readonly isSubmitting = this.isSubmittingSignal.asReadonly();
  readonly filteredCompanies = signal(this.companyService.companies());

  /**
   * 搜尋公司
   */
  onSearch(query: string): void {
    this.companyService.searchCompanies(query).subscribe(companies => {
      this.filteredCompanies.set(companies);
    });
  }

  /**
   * 顯示創建模態框
   */
  showCreateModal(): void {
    this.isCreateModalVisible = true;
    this.createForm.reset({
      status: CompanyStatusEnum.Active,
      riskLevel: RiskLevelEnum.Low
    });
  }

  /**
   * 處理創建公司
   */
  handleCreateCompany(): void {
    if (this.createForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmittingSignal.set(true);
    const formValue = this.createForm.value as CreateCompanyDto;

    this.companyService.createCompany(formValue).subscribe({
      next: () => {
        this.message.success('新增合作夥伴成功');
        this.isCreateModalVisible = false;
        this.createForm.reset();
        this.filteredCompanies.set(this.companyService.companies());
      },
      error: (error) => {
        console.error('創建公司失敗:', error);
        this.message.error('新增合作夥伴失敗');
      },
      complete: () => {
        this.isSubmittingSignal.set(false);
      }
    });
  }

  /**
   * 取消創建
   */
  handleCancelCreate(): void {
    this.isCreateModalVisible = false;
    this.createForm.reset();
  }

  /**
   * 獲取狀態顏色
   */
  getStatusColor(status: CompanyStatusEnum): string {
    switch (status) {
      case CompanyStatusEnum.Active:
        return 'green';
      case CompanyStatusEnum.Inactive:
        return 'orange';
      case CompanyStatusEnum.Blacklisted:
        return 'red';
      default:
        return 'default';
    }
  }

  /**
   * 獲取風險等級顏色
   */
  getRiskColor(riskLevel: RiskLevelEnum): string {
    switch (riskLevel) {
      case RiskLevelEnum.Low:
        return 'green';
      case RiskLevelEnum.Medium:
        return 'orange';
      case RiskLevelEnum.High:
        return 'red';
      default:
        return 'default';
    }
  }

  /**
   * TrackBy 函數
   */
  trackByCompanyId(index: number, company: any): string {
    return company.id;
  }

  /**
   * 標記表單為已觸碰
   */
  private markFormGroupTouched(): void {
    Object.keys(this.createForm.controls).forEach(key => {
      const control = this.createForm.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }
}