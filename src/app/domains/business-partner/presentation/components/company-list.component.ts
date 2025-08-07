import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CompanyApplicationService } from '../../application/services/company.application.service';
import { CompanyResponseDto, CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';

interface ContactForm {
  name: string;
  title: string;
  email: string;
  phone: string;
  isPrimary: boolean;
}

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
    NzDatePickerModule,
    NzSwitchModule
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

      <!-- 新增合作夥伴公司 模態框 -->
      <nz-modal
        [nzVisible]="isModalVisible()"
        (nzVisibleChange)="isModalVisible.set($event)"
        nzTitle="新增合作夥伴公司"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleOk()"
        [nzOkLoading]="submitLoading()"
      >
        <form nz-form [formGroup]="companyForm" nz-row nzGutter="16">
          <!-- 一、基本資訊 -->
          <div nz-col nzSpan="24"><h3>一、基本資訊</h3></div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>公司名稱</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入公司名稱">
                <input nz-input formControlName="companyName" placeholder="公司名稱" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>統一編號</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入統一編號">
                <input nz-input formControlName="businessRegistrationNumber" placeholder="統一編號" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>合作狀態</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請選擇合作狀態">
                <nz-select formControlName="status" placeholder="選擇狀態">
                  <nz-option *ngFor="let s of statusOptions" [nzLabel]="s" [nzValue]="s"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>

          <!-- 二、聯絡資訊 -->
          <div nz-col nzSpan="24"><h3>二、聯絡資訊</h3></div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>公司地址</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入公司地址">
                <input nz-input formControlName="address" placeholder="地址" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>代表電話</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入電話">
                <input nz-input formControlName="businessPhone" placeholder="電話" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8">傳真號碼</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="fax" placeholder="傳真" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8">公司網站</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="website" placeholder="網站" />
              </nz-form-control>
            </nz-form-item>
          </div>

          <!-- 三、合約與業務資料 -->
          <div nz-col nzSpan="24"><h3>三、合約與業務資料</h3></div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>合約數量</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入合約數量">
                <input nz-input type="number" formControlName="contractCount" placeholder="合約數量" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>最近合約日期</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請選擇日期">
                <nz-date-picker formControlName="latestContractDate" style="width: 100%;"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>初次合作日期</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請選擇日期">
                <nz-date-picker formControlName="partnerSince" style="width: 100%;"></nz-date-picker>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8">合作範圍</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="cooperationScope" placeholder="合作範圍" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8">合作模式</nz-form-label>
              <nz-form-control nzSpan="16">
                <input nz-input formControlName="businessModel" placeholder="合作模式" />
              </nz-form-control>
            </nz-form-item>
          </div>

          <!-- 四、審查與風控資料 -->
          <div nz-col nzSpan="24"><h3>四、審查與風控資料</h3></div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>信用評分</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請輸入評分">
                <input nz-input type="number" formControlName="creditScore" placeholder="信用評分" />
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="12">
            <nz-form-item>
              <nz-form-label nzSpan="8" nzRequired>風險等級</nz-form-label>
              <nz-form-control nzSpan="16" nzErrorTip="請選擇風險等級">
                <nz-select formControlName="riskLevel" placeholder="風險等級">
                  <nz-option *ngFor="let r of riskOptions" [nzLabel]="r" [nzValue]="r"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="24">
            <nz-form-item>
              <nz-form-label nzSpan="4">稽核紀錄</nz-form-label>
              <nz-form-control nzSpan="20">
                <textarea nz-input rows="3" formControlName="reviewHistory" placeholder="稽核紀錄"></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>
          <div nz-col nzSpan="24">
            <nz-form-item>
              <nz-form-label nzSpan="4">黑名單原因</nz-form-label>
              <nz-form-control nzSpan="20">
                <textarea nz-input rows="2" formControlName="blacklistReason" placeholder="黑名單原因"></textarea>
              </nz-form-control>
            </nz-form-item>
          </div>

          <!-- 五、聯絡人清單 -->
          <div nz-col nzSpan="24"><h3>五、聯絡人清單</h3></div>
          <div nz-col nzSpan="24" formArrayName="contacts">
            <nz-table #contactsTable [nzData]="contactsFormArray.controls" nzSize="small" [nzShowPagination]="false">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>職稱</th>
                  <th>Email</th>
                  <th>電話</th>
                  <th>主要</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let contactControl of contactsFormArray.controls; let i=index" [formGroup]="getContactControl(i)">
                  <td>
                    <nz-form-control nzErrorTip="請輸入姓名">
                      <input nz-input formControlName="name" placeholder="姓名" />
                    </nz-form-control>
                  </td>
                  <td>
                    <nz-form-control nzErrorTip="請輸入職稱">
                      <input nz-input formControlName="title" placeholder="職稱" />
                    </nz-form-control>
                  </td>
                  <td>
                    <nz-form-control nzErrorTip="請輸入有效的Email">
                      <input nz-input formControlName="email" placeholder="Email" type="email" />
                    </nz-form-control>
                  </td>
                  <td>
                    <nz-form-control nzErrorTip="請輸入電話">
                      <input nz-input formControlName="phone" placeholder="電話" />
                    </nz-form-control>
                  </td>
                  <td>
                    <nz-switch formControlName="isPrimary"></nz-switch>
                  </td>
                  <td>
                    <button nz-button nzType="link" nzDanger (click)="removeContact(i)">
                      <span nz-icon nzType="delete"></span>
                      刪除
                    </button>
                  </td>
                </tr>
              </tbody>
            </nz-table>
            <button nz-button nzType="dashed" (click)="addContact()" style="width: 100%; margin-top: 8px;">
              <span nz-icon nzType="plus"></span>
              新增聯絡人
            </button>
          </div>
        </form>
      </nz-modal>
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

  statusOptions = Object.values(CompanyStatusEnum);
  riskOptions = Object.values(RiskLevelEnum);

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
      contacts: this.fb.array([])
    });
  }

  private createContactFormGroup(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      isPrimary: [false]
    });
  }

  get contactsFormArray(): FormArray<FormGroup> {
    return this.companyForm.get('contacts') as FormArray<FormGroup>;
  }

  getContactControl(index: number): FormGroup {
    return this.contactsFormArray.at(index) as FormGroup;
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
    this.contactsFormArray.push(this.createContactFormGroup());
  }

  removeContact(index: number): void {
    this.contactsFormArray.removeAt(index);
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

