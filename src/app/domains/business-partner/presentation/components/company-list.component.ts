import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CompanyApplicationService } from '../../application/services/company.application.service';
import { CompanyResponseDto, CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzTagModule,
    NzAvatarModule,
    NzIconModule,
    NzModalModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule
  ],
  template: `
    <div class="company-list">
      <div class="header">
        <h2>合作夥伴管理</h2>
        <div class="search-box">
          <input nz-input placeholder="搜尋公司..." [(ngModel)]="searchQuery" (ngModelChange)="onSearch($event)" />
        </div>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <span nz-icon nzType="plus"></span>
          新增合作夥伴
        </button>
      </div>

      <nz-table #companyTable [nzData]="companies()" [nzLoading]="loading()">
        <thead>
          <tr>
            <th nzWidth="50px"></th>
            <th>公司名稱</th>
            <th>統一編號</th>
            <th>合作狀態</th>
            <th>電話</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <ng-container *ngFor="let company of companyTable.data">
            <tr>
              <td [nzExpand]="expandSet.has(company.id)" (nzExpandChange)="onExpandChange(company.id, $event)"></td>
              <td>{{ company.companyName }}</td>
              <td>{{ company.businessRegistrationNumber }}</td>
              <td>
                <nz-tag>{{ company.status }}</nz-tag>
              </td>
              <td>{{ company.businessPhone }}</td>
              <td>
                <button nz-button nzType="link" (click)="editCompany(company)">編輯</button>
                <button nz-button nzType="link" nzDanger (click)="deleteCompany(company)">刪除</button>
              </td>
            </tr>
            <tr [nzExpand]="expandSet.has(company.id)">
              <td colspan="6">
                <nz-table #contactTable [nzData]="company.contacts" nzSize="small" [nzShowPagination]="false">
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>職稱</th>
                      <th>Email</th>
                      <th>電話</th>
                      <th>主要聯絡人</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let contact of contactTable.data">
                      <td>{{ contact.name }}</td>
                      <td>{{ contact.title }}</td>
                      <td>{{ contact.email }}</td>
                      <td>{{ contact.phone }}</td>
                      <td>
                        <nz-tag>
                          {{ contact.isPrimary ? '是' : '否' }}
                        </nz-tag>
                      </td>
                    </tr>
                  </tbody>
                </nz-table>
              </td>
            </tr>
          </ng-container>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .search-box {
      width: 300px;
    }
  `]
})
export class CompanyListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyApplicationService);
  private readonly modalService = inject(NzModalService);
  private readonly message = inject(NzMessageService);

  companies = signal<CompanyResponseDto[]>([]);
  loading = signal(false);
  searchQuery = '';
  expandSet = new Set<string>();

  isModalVisible = signal(false);
  submitLoading = signal(false);
  companyForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadCompanies();
  }

  private initForm(): void {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      businessRegistrationNumber: ['', [Validators.required]],
      status: [CompanyStatusEnum.Active, [Validators.required]],
      address: ['', [Validators.required]],
      businessPhone: ['', [Validators.required]],
      fax: [''],
      website: [''],
      contractCount: [0, [Validators.required, Validators.min(0)]],
      latestContractDate: [null, [Validators.required]],
      partnerSince: [null, [Validators.required]],
      cooperationScope: [''],
      businessModel: [''],
      creditScore: [0, [Validators.required, Validators.min(0)]],
      riskLevel: [RiskLevelEnum.Low, [Validators.required]],
      reviewHistory: [''],
      blacklistReason: [''],
      contacts: [[]]
    });
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.companyService.getAllCompanies().subscribe({
      next: (data) => {
        this.companies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.message.error('無法載入合作夥伴清單');
        this.loading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.loading.set(true);
    this.companyService.searchCompanies(query).subscribe({
      next: (data) => {
        this.companies.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.message.error('搜尋失敗');
        this.loading.set(false);
      }
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showCreateModal(): void {
    this.isModalVisible.set(true);
  }

  handleCancel(): void {
    this.isModalVisible.set(false);
    this.initForm();
  }

  handleOk(): void {
    if (this.companyForm.valid) {
      this.submitLoading.set(true);
      const dto = this.companyForm.value as CreateCompanyDto;
      this.companyService.createCompany(dto).subscribe({
        next: () => {
          this.message.success('新增合作夥伴成功');
          this.isModalVisible.set(false);
          this.initForm();
          this.loadCompanies();
          this.submitLoading.set(false);
        },
        error: () => {
          this.message.error('新增合作夥伴失敗');
          this.submitLoading.set(false);
        }
      });
    } else {
      this.message.error('請填寫所有必填欄位');
    }
  }

  addContact(): void {
    const contacts = this.companyForm.get('contacts')?.value || [];
    contacts.push({ name: '', title: '', email: '', phone: '', isPrimary: false });
    this.companyForm.get('contacts')?.setValue(contacts);
  }

  removeContact(index: number): void {
    const contacts = this.companyForm.get('contacts')?.value || [];
    contacts.splice(index, 1);
    this.companyForm.get('contacts')?.setValue(contacts);
  }

  editCompany(company: CompanyResponseDto): void {
    // TODO: Implement edit modal
  }

  deleteCompany(company: CompanyResponseDto): void {
    this.modalService.confirm({
      nzTitle: `確定要刪除 ${company.companyName} 嗎？`,
      nzContent: '此操作無法復原。',
      nzOkText: '刪除',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.companyService.deleteCompany(company.id).subscribe({
          next: () => {
            this.message.success('刪除成功');
            this.loadCompanies();
          },
          error: (err) => {
            this.message.error('刪除失敗');
          }
        });
      }
    });
  }
}

