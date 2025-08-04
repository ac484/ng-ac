import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PrincipalApplicationService } from '../../../application/services/principal-application.service';
import { Contact } from '../../../domain/entities/contact.entity';
import { Principal } from '../../../domain/entities/principal.entity';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSplitterModule } from 'ng-zorro-antd/splitter';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-principal-list',
  templateUrl: './principal-list.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzSpaceModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSplitterModule,
    NzListModule,
    NzEmptyModule,
    NzSpinModule
  ]
})
export class PrincipalListComponent implements OnInit, OnDestroy {
  @Output() principalSelected = new EventEmitter<Principal>();

  principalList: Principal[] = [];
  loading = false;
  selectedPrincipal: Principal | null = null;
  expandedPrincipalId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private principalService: PrincipalApplicationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadPrincipals();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPrincipals(): void {
    this.loading = true;
    this.principalService
      .getPrincipals()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: principals => {
          this.principalList = principals;
          console.log('載入的 Principal 數據:', principals);
          principals.forEach(principal => {
            console.log(`Principal: ${principal.name.getValue()}, 聯絡人數量: ${principal.contactCount}`);
          });
          this.loading = false;
        },
        error: error => {
          console.error('載入 Principal 列表失敗:', error);
          this.message.error('載入 Principal 列表失敗');
          this.loading = false;
        }
      });
  }

  expandPrincipal(principal: Principal, expanded?: boolean): void {
    const principalId = principal.id.getValue();

    // 如果傳入了 expanded 參數，使用該值；否則切換當前狀態
    const newExpandedState = expanded !== undefined ? expanded : !this.isExpanded(principal);

    if (newExpandedState) {
      this.expandedPrincipalId = principalId;
      this.selectedPrincipal = principal;
      this.principalSelected.emit(principal);
    } else {
      this.expandedPrincipalId = null;
      this.selectedPrincipal = null;
    }
  }

  addPrincipal(): void {
    // TODO: Implement with new dynamic form component
    this.message.info('新增功能將在重構完成後實作');
    /*
    const modalRef = this.modal.create({
      nzTitle: '新增 Principal',
      nzContent: PrincipalFormComponent,
      nzWidth: 600,
      nzData: { mode: 'add' },
      nzOnOk: (componentInstance: any) => {
        return componentInstance.submitForm();
      }
    });

    // 監聽模態框關閉事件，重新載入數據
    modalRef.afterClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      if (result) {
        this.loadPrincipals();
        this.message.success('Principal 新增成功');
      }
    });
    */
  }

  editPrincipal(principal: Principal): void {
    // TODO: Implement with new dynamic form component
    this.message.info('編輯功能將在重構完成後實作');
    /*
    const modalRef = this.modal.create({
      nzTitle: '編輯 Principal',
      nzContent: PrincipalFormComponent,
      nzWidth: 600,
      nzData: { mode: 'edit', principal },
      nzOnOk: (componentInstance: any) => {
        return componentInstance.submitForm();
      }
    });

    // 監聽模態框關閉事件，重新載入數據
    modalRef.afterClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      if (result) {
        this.loadPrincipals();
        this.message.success('Principal 更新成功');
      }
    });
    */
  }

  deletePrincipal(principal: Principal): void {
    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除 Principal "${principal.name.getValue()}" 嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.principalService
          .deletePrincipal(principal.id.getValue())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadPrincipals();
              this.message.success('Principal 刪除成功');
            },
            error: () => {
              this.message.error('Principal 刪除失敗');
            }
          });
      }
    });
  }

  addContact(): void {
    if (!this.selectedPrincipal) {
      this.message.warning('請先選擇一個 Principal');
      return;
    }

    // TODO: Implement with new dynamic form component
    this.message.info('新增聯絡人功能將在重構完成後實作');
    /*
    const modalRef = this.modal.create({
      nzTitle: '新增聯絡人',
      nzContent: PrincipalContactComponent,
      nzWidth: 500,
      nzData: { mode: 'add', principalId: this.selectedPrincipal.id.getValue() },
      nzOnOk: (componentInstance: any) => {
        return componentInstance.submitForm();
      }
    });

    // 監聽模態框關閉事件，重新載入數據
    modalRef.afterClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      if (result) {
        this.loadPrincipals();
        this.message.success('聯絡人新增成功');
      }
    });
    */
  }

  editContact(contact: Contact): void {
    // TODO: Implement with new dynamic form component
    this.message.info('編輯聯絡人功能將在重構完成後實作');
    /*
    const modalRef = this.modal.create({
      nzTitle: '編輯聯絡人',
      nzContent: PrincipalContactComponent,
      nzWidth: 500,
      nzData: { mode: 'edit', contact },
      nzOnOk: (componentInstance: any) => {
        return componentInstance.submitForm();
      }
    });

    // 監聽模態框關閉事件，重新載入數據
    modalRef.afterClose.pipe(
      takeUntil(this.destroy$)
    ).subscribe((result) => {
      if (result) {
        this.loadPrincipals();
        this.message.success('聯絡人更新成功');
      }
    });
    */
  }

  deleteContact(contact: Contact): void {
    if (!this.selectedPrincipal) {
      this.message.warning('請先選擇一個 Principal');
      return;
    }

    this.modal.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除聯絡人 "${contact.name.getValue()}" 嗎？`,
      nzOkText: '確定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.principalService
          .deleteContact(this.selectedPrincipal!.id.getValue(), contact.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadPrincipals();
              this.message.success('聯絡人刪除成功');
            },
            error: () => {
              this.message.error('聯絡人刪除失敗');
            }
          });
      }
    });
  }

  isExpanded(principal: Principal): boolean {
    return this.expandedPrincipalId === principal.id.getValue();
  }

  // 獲取聯絡人列表的顯示數據
  getContactDisplayData(principal: Principal): any[] {
    return principal.contacts.map(contact => ({
      id: contact.id,
      name: contact.name.getValue(),
      email: contact.email.getValue(),
      phone: contact.phone.getValue(),
      contact: contact // 保留原始 contact 對象用於操作
    }));
  }
}
