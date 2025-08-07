import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { CompanyService } from '../../application/services/company.service';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { PaymentWorkflowState } from '../../domain/value-objects/payment-workflow-state.vo';
import { CreateCompanyDto, CompanyResponseDto, ContactDto } from '../../application/dto/company.dto';
import { PaymentWorkflowComponent, PaymentWorkflowTransition } from './payment-workflow.component';

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
    NzIconModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzSwitchModule,
    PaymentWorkflowComponent
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
            <th nzWidth="50px"></th>
            <th>公司名稱</th>
            <th>統一編號</th>
            <th>地址</th>
            <th>電話</th>
            <th>狀態</th>
            <th>風險等級</th>
            <th>聯絡人數</th>
            <th nzWidth="160px">操作</th>
          </tr>
        </thead>
        <tbody>
          @for (company of filteredCompanies(); track trackByCompanyId($index, company)) {
            <tr>
              <td [nzExpand]="expandSet().has(company.id)" (nzExpandChange)="onExpandChange(company.id, $event)"></td>
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
                <button nz-button nzType="link" nzSize="small" (click)="showWorkflowModal(company.id)">
                  <span nz-icon nzType="deployment-unit"></span>
                  狀態
                </button>
                <button nz-button nzType="link" nzSize="small">
                  <span nz-icon nzType="edit"></span>
                </button>
                <button nz-button nzType="link" nzSize="small" nzDanger>
                  <span nz-icon nzType="delete"></span>
                </button>
              </td>
            </tr>
            
            <!-- 展開的聯絡人子表 -->
            @if (expandSet().has(company.id)) {
              <tr>
                <td colspan="9" class="contact-table-container">
                  <div class="contact-section">
                    <h4>聯絡人管理</h4>
                    
                    <!-- 聯絡人子表 -->
                    <nz-table 
                      [nzData]="getContactsForCompany(company.id)" 
                      [nzShowPagination]="false"
                      nzSize="small">
                      <thead>
                        <tr>
                          <th>姓名</th>
                          <th>職稱</th>
                          <th>Email</th>
                          <th>電話</th>
                          <th>主要聯絡人</th>
                          <th nzWidth="120px">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (contact of getContactsForCompany(company.id); track trackByContactIndex($index, contact); let i = $index) {
                          @let isEditing = editingContactIndex() === i && currentEditingCompanyId() === company.id;
                          
                          <tr>
                            <td>
                              @if (isEditing) {
                                <nz-form-item>
                                  <nz-form-control nzErrorTip="請輸入姓名">
                                    <input nz-input [(ngModel)]="editingContact().name" placeholder="請輸入姓名" />
                                  </nz-form-control>
                                </nz-form-item>
                              } @else {
                                {{ contact.name }}
                              }
                            </td>
                            
                            <td>
                              @if (isEditing) {
                                <nz-form-item>
                                  <nz-form-control nzErrorTip="請輸入職稱">
                                    <input nz-input [(ngModel)]="editingContact().title" placeholder="請輸入職稱" />
                                  </nz-form-control>
                                </nz-form-item>
                              } @else {
                                {{ contact.title }}
                              }
                            </td>
                            
                            <td>
                              @if (isEditing) {
                                <nz-form-item>
                                  <nz-form-control nzErrorTip="請輸入有效的Email">
                                    <input nz-input [(ngModel)]="editingContact().email" placeholder="請輸入Email" type="email" />
                                  </nz-form-control>
                                </nz-form-item>
                              } @else {
                                {{ contact.email }}
                              }
                            </td>
                            
                            <td>
                              @if (isEditing) {
                                <nz-form-item>
                                  <nz-form-control nzErrorTip="請輸入電話">
                                    <input nz-input [(ngModel)]="editingContact().phone" placeholder="請輸入電話" />
                                  </nz-form-control>
                                </nz-form-item>
                              } @else {
                                {{ contact.phone }}
                              }
                            </td>
                            
                            <td>
                              @if (isEditing) {
                                <nz-switch [(ngModel)]="editingContact().isPrimary"></nz-switch>
                              } @else {
                                <nz-tag [nzColor]="contact.isPrimary ? 'green' : 'default'">
                                  {{ contact.isPrimary ? '是' : '否' }}
                                </nz-tag>
                              }
                            </td>
                            
                            <td>
                              @if (isEditing) {
                                <a (click)="saveContact(company.id, i)" [class.disabled]="isSubmittingContact()">
                                  @if (isSubmittingContact()) {
                                    <span nz-icon nzType="loading"></span>
                                  }
                                  保存
                                </a>
                                <nz-divider nzType="vertical"></nz-divider>
                                <a (click)="cancelEditContact()">取消</a>
                              } @else {
                                <a (click)="editContact(company.id, i, contact)">編輯</a>
                                <nz-divider nzType="vertical"></nz-divider>
                                <a nz-popconfirm nzPopconfirmTitle="是否要刪除此聯絡人？" (nzOnConfirm)="deleteContact(company.id, i)">刪除</a>
                              }
                            </td>
                          </tr>
                        }
                        
                        <!-- 新增聯絡人行 -->
                        @if (editingContactIndex() === -2 && currentEditingCompanyId() === company.id) {
                          <tr class="adding-contact-row">
                            <td>
                              <nz-form-item>
                                <nz-form-control nzErrorTip="請輸入姓名">
                                  <input nz-input [(ngModel)]="editingContact().name" placeholder="請輸入姓名" />
                                </nz-form-control>
                              </nz-form-item>
                            </td>
                            <td>
                              <nz-form-item>
                                <nz-form-control nzErrorTip="請輸入職稱">
                                  <input nz-input [(ngModel)]="editingContact().title" placeholder="請輸入職稱" />
                                </nz-form-control>
                              </nz-form-item>
                            </td>
                            <td>
                              <nz-form-item>
                                <nz-form-control nzErrorTip="請輸入有效的Email">
                                  <input nz-input [(ngModel)]="editingContact().email" placeholder="請輸入Email" type="email" />
                                </nz-form-control>
                              </nz-form-item>
                            </td>
                            <td>
                              <nz-form-item>
                                <nz-form-control nzErrorTip="請輸入電話">
                                  <input nz-input [(ngModel)]="editingContact().phone" placeholder="請輸入電話" />
                                </nz-form-control>
                              </nz-form-item>
                            </td>
                            <td>
                              <nz-switch [(ngModel)]="editingContact().isPrimary"></nz-switch>
                            </td>
                            <td>
                              <a (click)="saveContact(company.id, -1)" [class.disabled]="isSubmittingContact()">
                                @if (isSubmittingContact()) {
                                  <span nz-icon nzType="loading"></span>
                                }
                                保存
                              </a>
                              <nz-divider nzType="vertical"></nz-divider>
                              <a (click)="cancelEditContact()">取消</a>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </nz-table>
                    
                    <!-- 新增聯絡人按鈕 -->
                    @if (editingContactIndex() === -1 || currentEditingCompanyId() !== company.id) {
                      <button 
                        nz-button 
                        nzType="dashed" 
                        nzBlock 
                        class="add-contact-btn"
                        (click)="addContact(company.id)">
                        <span nz-icon nzType="plus"></span>
                        新增聯絡人
                      </button>
                    }
                  </div>
                </td>
              </tr>
            }
          }
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

      <!-- 狀態機模態框 -->
      <app-payment-workflow
        [companyId]="currentWorkflowCompanyId()"
        [workflowState]="currentWorkflowState()"
        [visible]="isWorkflowModalVisible()"
        (visibleChange)="onWorkflowModalVisibleChange($event)"
        (stateTransition)="onStateTransition($event)">
      </app-payment-workflow>
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

    .contact-table-container {
      padding: 0 !important;
    }

    .contact-section {
      padding: 16px;
    }

    .contact-section h4 {
      margin: 0 0 16px 0;
      font-weight: 600;
    }

    .add-contact-btn {
      margin-top: 12px;
      border-style: dashed;
    }

    .add-contact-btn:hover {
    }

    .adding-contact-row td {
      padding: 8px;
    }

    .adding-contact-row nz-form-item {
      margin-bottom: 0;
    }

    .disabled {
      pointer-events: none;
      opacity: 0.6;
      cursor: not-allowed;
    }

    ::ng-deep .ant-table-expanded-row > td {
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

  // 展開狀態
  private readonly expandSetSignal = signal(new Set<string>());

  // 聯絡人編輯狀態
  private readonly editingContactIndexSignal = signal(-1);
  private readonly currentEditingCompanyIdSignal = signal<string | null>(null);
  private readonly isSubmittingContactSignal = signal(false);
  private readonly editingContactSignal = signal<ContactDto>({
    name: '',
    title: '',
    email: '',
    phone: '',
    isPrimary: false
  });
  private readonly originalContactSignal = signal<ContactDto | null>(null);

  // 狀態機相關狀態
  private readonly isWorkflowModalVisibleSignal = signal(false);
  private readonly currentWorkflowCompanyIdSignal = signal('');
  private readonly currentWorkflowStateSignal = signal<PaymentWorkflowState | null>(null);

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
  readonly expandSet = this.expandSetSignal.asReadonly();
  readonly editingContactIndex = this.editingContactIndexSignal.asReadonly();
  readonly currentEditingCompanyId = this.currentEditingCompanyIdSignal.asReadonly();
  readonly isSubmittingContact = this.isSubmittingContactSignal.asReadonly();
  readonly editingContact = this.editingContactSignal.asReadonly();
  readonly isWorkflowModalVisible = this.isWorkflowModalVisibleSignal.asReadonly();
  readonly currentWorkflowCompanyId = this.currentWorkflowCompanyIdSignal.asReadonly();
  readonly currentWorkflowState = this.currentWorkflowStateSignal.asReadonly();

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
   * 展開/收合公司行
   */
  onExpandChange(companyId: string, expanded: boolean): void {
    const currentSet = new Set(this.expandSetSignal());
    if (expanded) {
      currentSet.add(companyId);
    } else {
      currentSet.delete(companyId);
      // 如果收合時正在編輯該公司的聯絡人，取消編輯
      if (this.currentEditingCompanyIdSignal() === companyId) {
        this.cancelEditContact();
      }
    }
    this.expandSetSignal.set(currentSet);
  }

  /**
   * 獲取公司的聯絡人列表
   */
  getContactsForCompany(companyId: string): ContactDto[] {
    const company = this.filteredCompanies().find(c => c.id === companyId);
    return company?.contacts || [];
  }

  /**
   * 新增聯絡人
   */
  addContact(companyId: string): void {
    this.editingContactIndexSignal.set(-2); // -2 表示新增模式
    this.currentEditingCompanyIdSignal.set(companyId);
    this.editingContactSignal.set({
      name: '',
      title: '',
      email: '',
      phone: '',
      isPrimary: false
    });
    this.originalContactSignal.set(null);
  }

  /**
   * 編輯聯絡人
   */
  editContact(companyId: string, contactIndex: number, contact: ContactDto): void {
    this.editingContactIndexSignal.set(contactIndex);
    this.currentEditingCompanyIdSignal.set(companyId);
    this.editingContactSignal.set({ ...contact });
    this.originalContactSignal.set({ ...contact });
  }

  /**
   * 保存聯絡人
   */
  saveContact(companyId: string, contactIndex: number): void {
    const contact = this.editingContactSignal();

    // 基本驗證
    if (!contact.name.trim() || !contact.email.trim()) {
      this.message.error('請填寫必要欄位');
      return;
    }

    this.isSubmittingContactSignal.set(true);

    // 這裡應該調用後端 API 更新聯絡人
    // 暫時模擬更新本地數據
    setTimeout(() => {
      try {
        const companies = this.filteredCompanies();
        const companyIndex = companies.findIndex(c => c.id === companyId);

        if (companyIndex !== -1) {
          const updatedCompanies = [...companies];
          const company = { ...updatedCompanies[companyIndex] };
          const contacts = [...company.contacts];

          if (contactIndex === -1) {
            // 新增聯絡人
            contacts.push({ ...contact });
            this.message.success('新增聯絡人成功');
          } else {
            // 更新聯絡人
            contacts[contactIndex] = { ...contact };
            this.message.success('更新聯絡人成功');
          }

          company.contacts = contacts;
          updatedCompanies[companyIndex] = company;
          this.filteredCompanies.set(updatedCompanies);
        }

        this.cancelEditContact();
      } catch (error) {
        this.message.error('操作失敗');
      } finally {
        this.isSubmittingContactSignal.set(false);
      }
    }, 500);
  }

  /**
   * 刪除聯絡人
   */
  deleteContact(companyId: string, contactIndex: number): void {
    const companies = this.filteredCompanies();
    const companyIndex = companies.findIndex(c => c.id === companyId);

    if (companyIndex !== -1) {
      const updatedCompanies = [...companies];
      const company = { ...updatedCompanies[companyIndex] };
      const contacts = [...company.contacts];

      contacts.splice(contactIndex, 1);
      company.contacts = contacts;
      updatedCompanies[companyIndex] = company;

      this.filteredCompanies.set(updatedCompanies);
      this.message.success('刪除聯絡人成功');
    }
  }

  /**
   * 取消編輯聯絡人
   */
  cancelEditContact(): void {
    this.editingContactIndexSignal.set(-1);
    this.currentEditingCompanyIdSignal.set(null);
    this.editingContactSignal.set({
      name: '',
      title: '',
      email: '',
      phone: '',
      isPrimary: false
    });
    this.originalContactSignal.set(null);
  }

  /**
   * TrackBy 函數
   */
  trackByCompanyId(index: number, company: any): string {
    return company.id;
  }

  trackByContactIndex(index: number, contact: ContactDto): string {
    return `${contact.name}-${contact.email}-${index}`;
  }

  /**
   * 顯示狀態機模態框
   */
  showWorkflowModal(companyId: string): void {
    const company = this.filteredCompanies().find(c => c.id === companyId);
    if (company) {
      this.currentWorkflowCompanyIdSignal.set(companyId);
      // 這裡應該從公司實體獲取狀態機狀態，暫時創建一個默認狀態
      this.currentWorkflowStateSignal.set(PaymentWorkflowState.create());
      this.isWorkflowModalVisibleSignal.set(true);
    }
  }

  /**
   * 狀態機模態框可見性變更
   */
  onWorkflowModalVisibleChange(visible: boolean): void {
    this.isWorkflowModalVisibleSignal.set(visible);
    if (!visible) {
      this.currentWorkflowCompanyIdSignal.set('');
      this.currentWorkflowStateSignal.set(null);
    }
  }

  /**
   * 處理狀態轉換
   */
  onStateTransition(transition: PaymentWorkflowTransition): void {
    console.log('狀態轉換:', transition);

    // 這裡應該調用後端 API 更新狀態
    // 暫時更新本地狀態
    const currentState = this.currentWorkflowStateSignal();
    if (currentState) {
      try {
        const newState = currentState.transitionTo(
          transition.newState,
          transition.operator,
          transition.comment
        );
        this.currentWorkflowStateSignal.set(newState);
        this.message.success('狀態轉換成功');
      } catch (error) {
        console.error('狀態轉換失敗:', error);
        this.message.error('狀態轉換失敗');
      }
    }
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