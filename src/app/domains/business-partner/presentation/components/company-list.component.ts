import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed, effect } from '@angular/core';
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
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CompanyApplicationService } from '../../application/services/company.application.service';
import { CompanyResponseDto, CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { finalize } from 'rxjs/operators';

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
    NzSwitchModule,
    NzSpinModule,
    ScrollingModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="company-list">
      <div class="header">
        <h2>合作夥伴管理</h2>
        <div class="search-box">
          <input 
            nz-input 
            placeholder="搜尋公司..." 
            [ngModel]="searchQuery()" 
            (ngModelChange)="onSearch($event)" 
          />
        </div>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <span nz-icon nzType="plus"></span>
          新增合作夥伴
        </button>
      </div>

      @if (loading()) {
        <div class="loading-container">
          <nz-spin nzSize="large"></nz-spin>
        </div>
      } @else if (companies().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <span nz-icon nzType="team" nzTheme="outline"></span>
          </div>
          <h3>目前你孤單一個人</h3>
          <p>還沒有任何合作夥伴，快來新增第一個合作夥伴吧！</p>
          <button nz-button nzType="primary" nzSize="large" (click)="showCreateModal()">
            <span nz-icon nzType="plus"></span>
            新增第一個合作夥伴
          </button>
        </div>
      } @else {
        <nz-table 
          #companyTable 
          [nzData]="companies()" 
          [nzVirtualItemSize]="54"
          [nzVirtualMaxBufferPx]="500"
          [nzVirtualMinBufferPx]="300"
          [nzShowPagination]="false"
          [nzScroll]="{ y: '400px' }">
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
            @for (company of companyTable.data; track company.id) {
              <tr>
                <td [nzExpand]="expandSet().has(company.id)" (nzExpandChange)="onExpandChange(company.id, $event)"></td>
                <td>{{ company.companyName }}</td>
                <td>{{ company.businessRegistrationNumber }}</td>
                <td>
                  <nz-tag [nzColor]="getStatusColor(company.status)">{{ company.status }}</nz-tag>
                </td>
                <td>{{ company.businessPhone }}</td>
                <td>
                  <button nz-button nzType="link" (click)="editCompany(company)">編輯</button>
                  <button nz-button nzType="link" nzDanger (click)="deleteCompany(company)">刪除</button>
                </td>
              </tr>
              @if (expandSet().has(company.id)) {
                <tr>
                  <td colspan="6">
                    <nz-table 
                      #contactTable 
                      [nzData]="company.contacts" 
                      nzSize="small" 
                      [nzShowPagination]="false"
                      [nzVirtualItemSize]="40">
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
                        @for (contact of contactTable.data; track contact.name) {
                          <tr>
                            <td>{{ contact.name }}</td>
                            <td>{{ contact.title }}</td>
                            <td>{{ contact.email }}</td>
                            <td>{{ contact.phone }}</td>
                            <td>
                              <nz-tag [nzColor]="contact.isPrimary ? 'green' : 'default'">
                                {{ contact.isPrimary ? '是' : '否' }}
                              </nz-tag>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </nz-table>
                  </td>
                </tr>
              }
            }
          </tbody>
        </nz-table>
      }

      <!-- 新增/編輯合作夥伴模態框 -->
      <nz-modal
        [nzVisible]="isModalVisible()"
        [nzTitle]="modalTitle()"
        [nzWidth]="1200"
        [nzOkLoading]="submitLoading()"
        nzOkText="確認"
        nzCancelText="取消"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleOk()">
        
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="companyForm" nzLayout="vertical">
            
            <!-- 基本資訊區塊 -->
            <div class="form-section">
              <h3 class="section-title">
                <span nz-icon nzType="info-circle"></span>
                基本資訊
              </h3>
              <div nz-row [nzGutter]="16">
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>公司名稱</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入公司名稱">
                      <input nz-input formControlName="companyName" placeholder="請輸入公司名稱" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>統一編號</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入統一編號">
                      <input nz-input formControlName="businessRegistrationNumber" placeholder="請輸入統一編號" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>合作狀態</nz-form-label>
                    <nz-form-control nzErrorTip="請選擇合作狀態">
                      <nz-select formControlName="status" placeholder="請選擇狀態">
                        @for (status of statusOptions(); track status) {
                          <nz-option [nzLabel]="status" [nzValue]="status"></nz-option>
                        }
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                </div>
              </div>
            </div>

            <!-- 聯絡資訊區塊 -->
            <div class="form-section">
              <h3 class="section-title">
                <span nz-icon nzType="phone"></span>
                聯絡資訊
              </h3>
              <div nz-row [nzGutter]="16">
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>公司地址</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入公司地址">
                      <input nz-input formControlName="address" placeholder="請輸入地址" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>代表電話</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入電話">
                      <input nz-input formControlName="businessPhone" placeholder="請輸入電話" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label>傳真號碼</nz-form-label>
                    <nz-form-control>
                      <input nz-input formControlName="fax" placeholder="請輸入傳真" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label>公司網站</nz-form-label>
                    <nz-form-control>
                      <input nz-input formControlName="website" placeholder="請輸入網站" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
              </div>
            </div>

            <!-- 合約與業務資料區塊 -->
            <div class="form-section">
              <h3 class="section-title">
                <span nz-icon nzType="file-text"></span>
                合約與業務資料
              </h3>
              <div nz-row [nzGutter]="16">
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>合約數量</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入合約數量">
                      <input nz-input type="number" formControlName="contractCount" placeholder="請輸入合約數量" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>最近合約日期</nz-form-label>
                    <nz-form-control nzErrorTip="請選擇日期">
                      <nz-date-picker formControlName="latestContractDate" style="width: 100%;" placeholder="請選擇日期"></nz-date-picker>
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>初次合作日期</nz-form-label>
                    <nz-form-control nzErrorTip="請選擇日期">
                      <nz-date-picker formControlName="partnerSince" style="width: 100%;" placeholder="請選擇日期"></nz-date-picker>
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label>合作範圍</nz-form-label>
                    <nz-form-control>
                      <input nz-input formControlName="cooperationScope" placeholder="請輸入合作範圍" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="24">
                  <nz-form-item>
                    <nz-form-label>合作模式</nz-form-label>
                    <nz-form-control>
                      <input nz-input formControlName="businessModel" placeholder="請輸入合作模式" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
              </div>
            </div>

            <!-- 審查與風控資料區塊 -->
            <div class="form-section">
              <h3 class="section-title">
                <span nz-icon nzType="safety"></span>
                審查與風控資料
              </h3>
              <div nz-row [nzGutter]="16">
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>信用評分</nz-form-label>
                    <nz-form-control nzErrorTip="請輸入評分">
                      <input nz-input type="number" formControlName="creditScore" placeholder="請輸入信用評分" />
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="12">
                  <nz-form-item>
                    <nz-form-label nzRequired>風險等級</nz-form-label>
                    <nz-form-control nzErrorTip="請選擇風險等級">
                      <nz-select formControlName="riskLevel" placeholder="請選擇風險等級">
                        @for (risk of riskOptions(); track risk) {
                          <nz-option [nzLabel]="risk" [nzValue]="risk"></nz-option>
                        }
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="24">
                  <nz-form-item>
                    <nz-form-label>稽核紀錄</nz-form-label>
                    <nz-form-control>
                      <textarea nz-input rows="3" formControlName="reviewHistory" placeholder="請輸入稽核紀錄"></textarea>
                    </nz-form-control>
                  </nz-form-item>
                </div>
                <div nz-col nzSpan="24">
                  <nz-form-item>
                    <nz-form-label>黑名單原因</nz-form-label>
                    <nz-form-control>
                      <textarea nz-input rows="2" formControlName="blacklistReason" placeholder="請輸入黑名單原因（如適用）"></textarea>
                    </nz-form-control>
                  </nz-form-item>
                </div>
              </div>
            </div>

            <!-- 聯絡人清單區塊 -->
            <div class="form-section">
              <h3 class="section-title">
                <span nz-icon nzType="team"></span>
                聯絡人清單
                <button 
                  nz-button 
                  nzType="dashed" 
                  nzSize="small"
                  (click)="addContact()" 
                  class="add-contact-btn">
                  <span nz-icon nzType="plus"></span>
                  新增聯絡人
                </button>
              </h3>
              
              <div formArrayName="contacts">
                @if (contactsFormArray.length > 0) {
                  <div class="contacts-container">
                    @for (contactControl of contactsFormArray.controls; track $index) {
                      <div class="contact-card" [formGroupName]="$index">
                        <div class="contact-header">
                          <span class="contact-index">聯絡人 {{ $index + 1 }}</span>
                          <button 
                            nz-button 
                            nzType="text" 
                            nzDanger 
                            nzSize="small"
                            (click)="removeContact($index)"
                            [disabled]="contactsFormArray.length === 1">
                            <span nz-icon nzType="close"></span>
                          </button>
                        </div>
                        <div nz-row [nzGutter]="16">
                          <div nz-col nzSpan="12">
                            <nz-form-item>
                              <nz-form-label nzRequired>姓名</nz-form-label>
                              <nz-form-control nzErrorTip="請輸入姓名">
                                <input nz-input formControlName="name" placeholder="請輸入姓名" />
                              </nz-form-control>
                            </nz-form-item>
                          </div>
                          <div nz-col nzSpan="12">
                            <nz-form-item>
                              <nz-form-label nzRequired>職稱</nz-form-label>
                              <nz-form-control nzErrorTip="請輸入職稱">
                                <input nz-input formControlName="title" placeholder="請輸入職稱" />
                              </nz-form-control>
                            </nz-form-item>
                          </div>
                          <div nz-col nzSpan="12">
                            <nz-form-item>
                              <nz-form-label nzRequired>Email</nz-form-label>
                              <nz-form-control nzErrorTip="請輸入有效的Email">
                                <input nz-input formControlName="email" placeholder="請輸入Email" type="email" />
                              </nz-form-control>
                            </nz-form-item>
                          </div>
                          <div nz-col nzSpan="8">
                            <nz-form-item>
                              <nz-form-label nzRequired>電話</nz-form-label>
                              <nz-form-control nzErrorTip="請輸入電話">
                                <input nz-input formControlName="phone" placeholder="請輸入電話" />
                              </nz-form-control>
                            </nz-form-item>
                          </div>
                          <div nz-col nzSpan="4">
                            <nz-form-item>
                              <nz-form-label>主要聯絡人</nz-form-label>
                              <nz-form-control>
                                <nz-switch formControlName="isPrimary"></nz-switch>
                              </nz-form-control>
                            </nz-form-item>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="empty-contacts">
                    <span nz-icon nzType="user-add" style="font-size: 48px;"></span>
                    <p>尚未新增任何聯絡人</p>
                    <button nz-button nzType="dashed" (click)="addContact()">
                      <span nz-icon nzType="plus"></span>
                      新增第一個聯絡人
                    </button>
                  </div>
                }
              </div>
            </div>

          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      gap: 16px;
    }
    
    .header h2 {
      margin: 0;
      flex-shrink: 0;
    }
    
    .search-box {
      width: 300px;
      flex-shrink: 0;
    }
    
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
      border-radius: 8px;
      margin: 20px 0;
    }
    
    .empty-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      font-size: 24px;
      color: #262626;
      margin: 0 0 8px 0;
      font-weight: 500;
    }
    
    .empty-state p {
      font-size: 16px;
      margin: 0 0 24px 0;
      line-height: 1.5;
    }
    
    .text-center {
      text-align: center;
      padding: 20px;
      color: #999;
    }
    
    .add-contact-btn {
      margin-left: auto;
    }
    
    .contacts-container {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .empty-contacts {
      text-align: center;
      padding: 40px;
      color: #999;
    }
    
    .empty-contacts p {
      margin: 16px 0;
      font-size: 16px;
    }

  `]
})
export class CompanyListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyApplicationService);
  private readonly modalService = inject(NzModalService);
  private readonly message = inject(NzMessageService);

  // 直接使用 Application Service 的 Signals
  companies = this.companyService.companies;
  loading = this.companyService.loading;
  error = this.companyService.error;

  // 組件自己的狀態
  searchQuery = signal('');
  expandSet = signal(new Set<string>());

  // Modal 狀態
  isModalVisible = signal(false);
  submitLoading = signal(false);
  isEditMode = signal(false);
  editingCompany = signal<CompanyResponseDto | null>(null);

  // 表單
  companyForm!: FormGroup;

  // Computed values
  statusOptions = computed(() => Object.values(CompanyStatusEnum));
  riskOptions = computed(() => Object.values(RiskLevelEnum));
  modalTitle = computed(() => this.isEditMode() ? '編輯合作夥伴' : '新增合作夥伴');

  // 在類的頂層定義 effect，符合 Angular 20+ 最佳實踐
  private readonly debugEffect = effect(() => {
    console.log('Companies data changed:', this.companies().length, 'companies');
    console.log('Companies data:', this.companies());
  });

  private readonly loadingEffect = effect(() => {
    console.log('Loading state changed:', this.loading());
  });

  private readonly errorEffect = effect(() => {
    console.log('Error state changed:', this.error());
  });

  ngOnInit(): void {
    this.initForm();
    // 不需要手動調用 loadCompanies，因為 Application Service 會自動載入
    console.log('CompanyListComponent initialized');
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

  loadCompanies(): void {
    // 使用 Application Service 的刷新方法
    this.companyService.refreshCompanies();
  }

  onSearch(query: string): void {
    this.searchQuery.set(query);

    if (!query.trim()) {
      this.loadCompanies();
      return;
    }

    // 使用 Application Service 的搜索方法
    this.companyService.searchCompanies(query).subscribe({
      next: (data) => {
        // 直接更新 Application Service 的數據
        (this.companyService as any).companiesSignal.set(data);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.message.error('搜尋失敗');
      }
    });
  }

  onExpandChange(id: string, checked: boolean): void {
    const currentSet = new Set(this.expandSet());
    if (checked) {
      currentSet.add(id);
    } else {
      currentSet.delete(id);
    }
    this.expandSet.set(currentSet);
  }

  getStatusColor(status: string): string {
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

  showCreateModal(): void {
    this.isEditMode.set(false);
    this.editingCompany.set(null);
    this.initForm();
    this.addContact(); // 預設新增一個聯絡人
    this.isModalVisible.set(true);
  }

  editCompany(company: CompanyResponseDto): void {
    this.isEditMode.set(true);
    this.editingCompany.set(company);
    this.initForm();

    // 填充表單資料
    this.companyForm.patchValue({
      companyName: company.companyName,
      businessRegistrationNumber: company.businessRegistrationNumber,
      status: company.status,
      address: company.address,
      businessPhone: company.businessPhone,
      fax: company.fax,
      website: company.website,
      contractCount: company.contractCount,
      latestContractDate: company.latestContractDate,
      partnerSince: company.partnerSince,
      cooperationScope: company.cooperationScope,
      businessModel: company.businessModel,
      creditScore: company.creditScore,
      riskLevel: company.riskLevel,
      reviewHistory: company.reviewHistory,
      blacklistReason: company.blacklistReason
    });

    // 填充聯絡人資料
    if (company.contacts && company.contacts.length > 0) {
      company.contacts.forEach(contact => {
        this.contactsFormArray.push(this.fb.group({
          name: [contact.name, [Validators.required]],
          title: [contact.title, [Validators.required]],
          email: [contact.email, [Validators.required, Validators.email]],
          phone: [contact.phone, [Validators.required]],
          isPrimary: [contact.isPrimary]
        }));
      });
    } else {
      this.addContact(); // 如果沒有聯絡人，新增一個
    }

    this.isModalVisible.set(true);
  }

  handleCancel(): void {
    this.isModalVisible.set(false);
    this.isEditMode.set(false);
    this.editingCompany.set(null);
    this.initForm();
  }

  handleOk(): void {
    if (!this.companyForm.valid) {
      this.message.error('請填寫所有必填欄位');
      this.markFormGroupTouched(this.companyForm);
      return;
    }

    this.submitLoading.set(true);
    const formData = this.companyForm.value as CreateCompanyDto;

    if (this.isEditMode()) {
      // 編輯模式
      const companyId = this.editingCompany()?.id;
      if (companyId) {
        this.companyService.updateCompany(companyId, formData).pipe(
          finalize(() => this.submitLoading.set(false))
        ).subscribe({
          next: () => {
            this.message.success('更新合作夥伴成功');
            this.handleCancel();
            this.companyService.refreshCompanies();
          },
          error: (err) => {
            console.error('Update company error:', err);
            this.message.error('更新合作夥伴失敗');
          }
        });
      }
    } else {
      // 新增模式
      this.companyService.createCompany(formData).pipe(
        finalize(() => this.submitLoading.set(false))
      ).subscribe({
        next: () => {
          this.message.success('新增合作夥伴成功');
          this.handleCancel();
          this.companyService.refreshCompanies();
        },
        error: (err) => {
          console.error('Create company error:', err);
          this.message.error('新增合作夥伴失敗');
        }
      });
    }
  }

  addContact(): void {
    this.contactsFormArray.push(this.createContactFormGroup());
  }

  removeContact(index: number): void {
    if (this.contactsFormArray.length > 1) {
      this.contactsFormArray.removeAt(index);
    } else {
      this.message.warning('至少需要保留一個聯絡人');
    }
  }

  deleteCompany(company: CompanyResponseDto): void {
    this.modalService.confirm({
      nzTitle: `確定要刪除 ${company.companyName} 嗎？`,
      nzContent: '此操作無法復原，請謹慎操作。',
      nzOkText: '確定刪除',
      nzCancelText: '取消',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        return new Promise((resolve, reject) => {
          this.companyService.deleteCompany(company.id).subscribe({
            next: () => {
              this.message.success('刪除成功');
              this.companyService.refreshCompanies();
              resolve(void 0);
            },
            error: (err) => {
              console.error('Delete company error:', err);
              this.message.error('刪除失敗');
              reject(err);
            }
          });
        });
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();

        if (control instanceof FormGroup) {
          this.markFormGroupTouched(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(arrayControl => {
            if (arrayControl instanceof FormGroup) {
              this.markFormGroupTouched(arrayControl);
            }
          });
        }
      }
    });
  }
}