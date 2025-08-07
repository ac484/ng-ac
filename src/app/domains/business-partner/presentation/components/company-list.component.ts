import { Component, inject, OnInit, signal, ChangeDetectionStrategy, computed } from '@angular/core';
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
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CompanyApplicationService } from '../../application/services/company.application.service';
import { CompanyResponseDto, CreateCompanyDto } from '../../application/dto/create-company.dto';
import { CompanyStatusEnum } from '../../domain/value-objects/company-status.vo';
import { RiskLevelEnum } from '../../domain/value-objects/risk-level.vo';
import { finalize } from 'rxjs/operators';

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
    ScrollingModule,
    NzDividerModule,
    NzPopconfirmModule
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
                  
                <div class="action-buttons">
                    <button nz-button nzSize="small" nzType="default" (click)="editCompany(company)">
                      <span nz-icon nzType="edit"></span>
                      編輯
                    </button>
                    <button nz-button nzSize="small" nzType="primary" (click)="manageContacts(company)">
                      <span nz-icon nzType="team"></span>
                      聯絡人 ({{ company.contacts.length }})
                    </button>
                    <button nz-button nzSize="small" nzType="default" nzDanger (click)="deleteCompany(company)">
                      <span nz-icon nzType="delete"></span>
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
              @if (expandSet().has(company.id)) {
                <tr>
                  <td colspan="6">
                    <div class="contact-section">
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
                            <th width="120px">操作</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (contact of contactTable.data; track contact.name; let i = $index) {
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
                                  <a (click)="saveInlineContact(company.id, i)">保存</a>
                                  <nz-divider nzType="vertical"></nz-divider>
                                  <a (click)="cancelInlineEdit()">取消</a>
                                } @else {
                                  <a (click)="editInlineContact(company.id, i, contact)">編輯</a>
                                  <nz-divider nzType="vertical"></nz-divider>
                                  <a nz-popconfirm nzPopconfirmTitle="是否要刪除此聯絡人？" (nzOnConfirm)="deleteInlineContact(company.id, i)">刪除</a>
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
                                <a (click)="saveInlineContact(company.id, -1)">保存</a>
                                <nz-divider nzType="vertical"></nz-divider>
                                <a (click)="cancelInlineEdit()">取消</a>
                              </td>
                            </tr>
                          }
                        </tbody>
                      </nz-table>
                      
                      <!-- 內聯新增聯絡人按鈕 -->
                      @if (editingContactIndex() === -1 || currentEditingCompanyId() !== company.id) {
                        <button 
                          nz-button 
                          nzType="dashed" 
                          nzBlock 
                          class="inline-add-contact-btn"
                          (click)="addInlineContact(company.id)">
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
      }

      <!-- 新增/編輯公司模態框 -->
      <nz-modal
        [nzVisible]="isModalVisible()"
        [nzTitle]="modalTitle()"
        [nzWidth]="800"
        [nzOkLoading]="submitLoading()"
        nzOkText="建立"
        nzCancelText="取消"
        (nzOnCancel)="handleCancel()"
        (nzOnOk)="handleCompanySave()">
        
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="companyBasicForm" nzLayout="vertical">
            
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

          </form>
        </ng-container>
      </nz-modal>

      <!-- 聯絡人管理模態框 -->
      <nz-modal
        [nzVisible]="isContactModalVisible()"
        [nzTitle]="contactModalTitle()"
        [nzWidth]="900"
        [nzOkLoading]="contactSubmitLoading()"
        nzOkText="儲存聯絡人"
        nzCancelText="取消"
        (nzOnCancel)="handleContactCancel()"
        (nzOnOk)="handleContactSave()">
        
        <ng-container *nzModalContent>
          <div class="contact-management">
            <div class="contact-header">
              <h4>
                <span nz-icon nzType="team"></span>
                聯絡人管理
              </h4>
              <button 
                nz-button 
                nzType="primary" 
                nzSize="default"
                (click)="addContact()" 
                class="add-contact-btn">
                <span nz-icon nzType="plus"></span>
                新增聯絡人
              </button>
            </div>
            
            <!-- 聯絡人數量提示 -->
            <div class="contact-info">
              <nz-tag [nzColor]="contactsFormArray.length > 0 ? 'blue' : 'default'">
                目前共有 {{ contactsFormArray.length }} 位聯絡人
              </nz-tag>
            </div>
            
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
                      <form nz-form [formGroup]="contactControl" nzLayout="vertical">
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
                      </form>
                    </div>
                  }
                </div>
              } @else {
                <div class="empty-contacts">
                  <div class="empty-icon">
                    <span nz-icon nzType="user-add" style="font-size: 64px; color: #1890ff;"></span>
                  </div>
                  <h4>尚未新增任何聯絡人</h4>
                  <p>請點擊上方的「新增聯絡人」按鈕來新增第一位聯絡人</p>
                  <button nz-button nzType="primary" nzSize="large" (click)="addContact()">
                    <span nz-icon nzType="plus"></span>
                    新增第一個聯絡人
                  </button>
                </div>
              }
            </div>
          </div>
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
    
    .add-contact-btn {
      margin-left: auto;
    }
    
    .contacts-container {
      max-height: 400px;
      overflow-y: auto;
    }
    
    .empty-contacts {
      text-align: center;
      padding: 60px 40px;
      border-radius: 8px;
    }

    .empty-contacts .empty-icon {
      margin-bottom: 20px;
    }
    
    .empty-contacts h4 {
      margin: 16px 0 8px 0;
      color: #262626;
      font-size: 18px;
      font-weight: 500;
    }
    
    .empty-contacts p {
      margin: 8px 0 24px 0;
      font-size: 14px;
      color: #8c8c8c;
      line-height: 1.5;
    }

    .contact-management {
      padding: 16px 0;
    }

    .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding: 12px 16px;
      border-radius: 6px;
    }

    .contact-header h4 {
      margin: 0;
      color: #262626;
      font-weight: 600;
    }

    .contact-info {
      margin-bottom: 16px;
      padding: 0 16px;
    }

    .add-contact-btn {
      box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
    }

    .contact-card {
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .contact-card .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .contact-index {
      font-weight: 500;
      color: #262626;
    }

    .action-buttons {
      display: flex;
      gap: 4px;
    }

    .action-buttons button {
      border-radius: 4px;
    }

    .action-buttons button:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .action-buttons button:not(:first-child):not(:last-child) {
      border-radius: 0;
      margin-left: -1px;
    }

    .action-buttons button:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }

    .contact-section {
      padding: 16px;
      border-radius: 6px;
    }

    .inline-add-contact-btn {
      margin-top: 12px;
      border-style: dashed;
      color: #1890ff;
      border-color: #1890ff;
    }

    .inline-add-contact-btn:hover {
      color: #40a9ff;
      border-color: #40a9ff;
    }

    .adding-contact-row td {
      padding: 8px;
    }

    .adding-contact-row nz-form-item {
      margin-bottom: 0;
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

  // 公司模態框狀態
  isModalVisible = signal(false);
  submitLoading = signal(false);
  isEditMode = signal(false);
  editingCompany = signal<CompanyResponseDto | null>(null);

  // 聯絡人模態框狀態
  isContactModalVisible = signal(false);
  contactSubmitLoading = signal(false);
  isContactEditMode = signal(false);
  currentCompanyId = signal<string | null>(null);

  // 內聯編輯聯絡人狀態
  editingContactIndex = signal(-1);
  currentEditingCompanyId = signal<string | null>(null);
  editingContact = signal<any>({
    name: '',
    title: '',
    email: '',
    phone: '',
    isPrimary: false
  });
  originalContact = signal<any>(null);

  // 表單
  companyBasicForm!: FormGroup;
  companyForm!: FormGroup;

  // Computed values
  statusOptions = computed(() => Object.values(CompanyStatusEnum));
  riskOptions = computed(() => Object.values(RiskLevelEnum));
  modalTitle = computed(() => this.isEditMode() ? '編輯合作夥伴' : '新增合作夥伴');
  contactModalTitle = computed(() => this.isContactEditMode() ? '編輯聯絡人' : '管理聯絡人');

  ngOnInit(): void {
    this.initForms();
  }

  private initForms(): void {
    // 公司基本信息表單
    this.companyBasicForm = this.fb.group({
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
      blacklistReason: ['']
    });

    // 聯絡人表單
    this.companyForm = this.fb.group({
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

  onSearch(query: string): void {
    this.searchQuery.set(query);

    if (!query.trim()) {
      this.companyService.refreshCompanies();
      return;
    }

    this.companyService.searchCompanies(query).subscribe({
      next: (data) => {
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
    this.initForms();
    this.isModalVisible.set(true);
  }

  editCompany(company: CompanyResponseDto): void {
    this.isEditMode.set(true);
    this.editingCompany.set(company);
    this.initForms();

    this.companyBasicForm.patchValue({
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

    this.isModalVisible.set(true);
  }

  manageContacts(company: CompanyResponseDto): void {
    this.currentCompanyId.set(company.id);
    this.isContactEditMode.set(true);
    this.initContactForm(company);
    this.isContactModalVisible.set(true);
  }

  private initContactForm(company: CompanyResponseDto): void {
    // 清空現有聯絡人
    while (this.contactsFormArray.length !== 0) {
      this.contactsFormArray.removeAt(0);
    }

    // 添加現有聯絡人
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
      // 如果沒有聯絡人，添加一個空的聯絡人表單
      this.addContact();
    }
  }

  handleCancel(): void {
    this.isModalVisible.set(false);
    this.isEditMode.set(false);
    this.editingCompany.set(null);
    this.initForms();
  }

  handleContactCancel(): void {
    this.isContactModalVisible.set(false);
    this.isContactEditMode.set(false);
    this.currentCompanyId.set(null);
    this.initForms();
  }

  handleCompanySave(): void {
    if (!this.companyBasicForm.valid) {
      this.message.error('請填寫所有必填欄位');
      this.markFormGroupTouched(this.companyBasicForm);
      return;
    }

    this.submitLoading.set(true);
    const formData = {
      ...this.companyBasicForm.value,
      contacts: [] // 確保包含空的聯絡人數組
    } as CreateCompanyDto;

    if (this.isEditMode()) {
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
      // 新增模式：直接建立公司
      this.companyService.createCompany(formData).pipe(
        finalize(() => this.submitLoading.set(false))
      ).subscribe({
        next: (createdCompany) => {
          this.message.success('新增合作夥伴成功');
          this.handleCancel();
          this.companyService.refreshCompanies();

          // 詢問是否要新增聯絡人
          this.modalService.confirm({
            nzTitle: '新增聯絡人',
            nzContent: `是否要為 ${createdCompany.companyName} 新增聯絡人？`,
            nzOkText: '是',
            nzCancelText: '否',
            nzOnOk: () => {
              this.currentCompanyId.set(createdCompany.id);
              this.isContactEditMode.set(false);
              this.initContactForm(createdCompany);
              this.isContactModalVisible.set(true);
            },
            nzOnCancel: () => {
              // 用戶選擇不新增聯絡人，不做任何操作
            }
          });
        },
        error: (err) => {
          console.error('Create company error:', err);
          this.message.error('新增合作夥伴失敗');
        }
      });
    }
  }

  handleContactSave(): void {
    if (!this.companyForm.valid) {
      this.message.error('請檢查聯絡人資料');
      this.markFormGroupTouched(this.companyForm);
      return;
    }

    this.contactSubmitLoading.set(true);
    const contacts = this.contactsFormArray.value;

    // 過濾掉空的聯絡人（所有字段都為空的聯絡人）
    const validContacts = contacts.filter(contact =>
      contact.name?.trim() ||
      contact.title?.trim() ||
      contact.email?.trim() ||
      contact.phone?.trim()
    );

    // 更新公司的聯絡人信息
    const companyId = this.currentCompanyId();
    if (companyId) {
      const updateData = { contacts: validContacts };
      this.companyService.updateCompany(companyId, updateData).pipe(
        finalize(() => this.contactSubmitLoading.set(false))
      ).subscribe({
        next: () => {
          this.message.success('聯絡人更新成功');
          this.handleContactCancel();
          this.companyService.refreshCompanies();
        },
        error: (err) => {
          console.error('Update contacts error:', err);
          this.message.error('聯絡人更新失敗');
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
      // 如果是最後一個聯絡人，清空表單並添加一個新的空聯絡人
      this.contactsFormArray.clear();
      this.addContact();
      this.message.info('已重置聯絡人表單');
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

  // 內聯編輯聯絡人方法
  addInlineContact(companyId: string): void {
    // 如果正在編輯其他聯絡人，先取消
    if (this.editingContactIndex() !== -1) {
      this.cancelInlineEdit();
    }

    // 設置為新增模式
    this.currentEditingCompanyId.set(companyId);
    this.editingContactIndex.set(-2); // -2 表示新增模式
    this.editingContact.set({
      name: '',
      title: '',
      email: '',
      phone: '',
      isPrimary: false
    });
    this.originalContact.set(null);
  }

  editInlineContact(companyId: string, index: number, contact: any): void {
    // 如果正在編輯其他聯絡人，先取消
    if (this.editingContactIndex() !== -1) {
      this.cancelInlineEdit();
    }

    this.currentEditingCompanyId.set(companyId);
    this.editingContactIndex.set(index);
    this.editingContact.set({ ...contact });
    this.originalContact.set({ ...contact });
  }

  saveInlineContact(companyId: string, index: number): void {
    const contact = this.editingContact();

    // 驗證必填欄位
    if (!contact.name?.trim() || !contact.title?.trim() || !contact.email?.trim() || !contact.phone?.trim()) {
      this.message.error('請填寫所有必填欄位');
      return;
    }

    // 驗證 Email 格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contact.email)) {
      this.message.error('請輸入有效的 Email 格式');
      return;
    }

    // 獲取當前公司的聯絡人列表
    const company = this.companies().find(c => c.id === companyId);
    if (!company) {
      this.message.error('找不到公司資料');
      return;
    }

    let updatedContacts = [...company.contacts];

    if (this.editingContactIndex() === -2) {
      // 新增模式
      updatedContacts.push(contact);
    } else {
      // 編輯模式
      updatedContacts[index] = contact;
    }

    // 更新公司資料
    const updateData = { contacts: updatedContacts };
    this.companyService.updateCompany(companyId, updateData).subscribe({
      next: () => {
        this.message.success(this.editingContactIndex() === -2 ? '新增聯絡人成功' : '更新聯絡人成功');
        this.cancelInlineEdit();
        this.companyService.refreshCompanies();
      },
      error: (err) => {
        console.error('Update contact error:', err);
        this.message.error(this.editingContactIndex() === -2 ? '新增聯絡人失敗' : '更新聯絡人失敗');
      }
    });
  }

  deleteInlineContact(companyId: string, index: number): void {
    const company = this.companies().find(c => c.id === companyId);
    if (!company) {
      this.message.error('找不到公司資料');
      return;
    }

    const updatedContacts = company.contacts.filter((_, i) => i !== index);
    const updateData = { contacts: updatedContacts };

    this.companyService.updateCompany(companyId, updateData).subscribe({
      next: () => {
        this.message.success('刪除聯絡人成功');
        this.companyService.refreshCompanies();
      },
      error: (err) => {
        console.error('Delete contact error:', err);
        this.message.error('刪除聯絡人失敗');
      }
    });
  }

  cancelInlineEdit(): void {
    this.editingContactIndex.set(-1);
    this.currentEditingCompanyId.set(null);
    this.editingContact.set({
      name: '',
      title: '',
      email: '',
      phone: '',
      isPrimary: false
    });
    this.originalContact.set(null);
  }
}