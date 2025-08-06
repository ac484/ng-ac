import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContactApplicationService } from '../../application/services/contact.application.service';
import { ContactResponseDto } from '../../application/dto/create-contact.dto';
import { ContactCreateModalComponent } from './contact-create-modal.component';
import { ContactEditModalComponent } from './contact-edit-modal.component';

@Component({
  selector: 'app-contact-list',
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
    NzModalModule
  ],
  template: `
    <div class="contact-list">
      <div class="header">
        <h2>聯絡人管理</h2>
        <div class="search-box">
          <nz-input-group [nzSuffix]="suffixIcon">
            <input 
              nz-input 
              placeholder="搜尋聯絡人..." 
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch($event)"
            />
          </nz-input-group>
          <ng-template #suffixIcon>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </div>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <span nz-icon nzType="plus"></span>
          新增聯絡人
        </button>
      </div>

      <nz-table 
        #basicTable 
        [nzData]="contacts()"
        [nzLoading]="loading()"
        [nzTotal]="contacts().length"
        [nzPageSize]="10"
        [nzShowSizeChanger]="true"
        [nzShowQuickJumper]="true"
      >
        <thead>
          <tr>
            <th>聯絡人</th>
            <th>郵箱</th>
            <th>電話</th>
            <th>狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let contact of basicTable.data">
            <td>
              <div class="contact-info">
                <nz-avatar [nzText]="contact.initials" nzSize="large"></nz-avatar>
                <div class="contact-details">
                  <div class="name">{{ contact.fullName }}</div>
                  <div class="subtitle">{{ contact.firstName }} {{ contact.lastName }}</div>
                </div>
              </div>
            </td>
            <td>{{ contact.email }}</td>
            <td>{{ contact.phone }}</td>
            <td>
              <nz-tag>
                {{ contact.status ? '啟用' : '停用' }}
              </nz-tag>
            </td>
            <td>
              <button nz-button nzType="link" (click)="editContact(contact)">
                <span nz-icon nzType="edit"></span>
              </button>
              <button nz-button nzType="link" nzDanger (click)="deleteContact(contact)">
                <span nz-icon nzType="delete"></span>
              </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
  styles: [`
    .contact-list {
      padding: 24px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      gap: 16px;
    }
    
    .search-box {
      flex: 1;
      max-width: 300px;
    }
    
    .contact-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .contact-details {
      display: flex;
      flex-direction: column;
    }
    
    .name {
      font-weight: 500;
    }
    
    .subtitle {
      font-size: 12px;
    }
  `]
})
export class ContactListComponent implements OnInit {
  private readonly contactService = inject(ContactApplicationService);
  private readonly message = inject(NzMessageService);
  private readonly modalService = inject(NzModalService);

  contacts = signal<ContactResponseDto[]>([]);
  loading = signal(false);
  searchQuery = '';

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.loading.set(true);
    this.contactService.getAllContacts().subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Contact loading error:', error);
        this.message.error(`載入聯絡人失敗: ${error.message || '未知錯誤'}`);
        this.loading.set(false);
      }
    });
  }

  onSearch(query: string): void {
    this.searchQuery = query;
    if (!query.trim()) {
      this.loadContacts();
      return;
    }

    this.loading.set(true);
    this.contactService.searchContacts(query).subscribe({
      next: (contacts) => {
        this.contacts.set(contacts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Contact search error:', error);
        this.message.error(`搜尋失敗: ${error.message || '未知錯誤'}`);
        this.loading.set(false);
      }
    });
  }

  showCreateModal(): void {
    const modal = this.modalService.create({
      nzTitle: '新增聯絡人',
      nzContent: ContactCreateModalComponent,
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadContacts();
      }
    });
  }

  editContact(contact: ContactResponseDto): void {
    const modal = this.modalService.create({
      nzTitle: '編輯聯絡人',
      nzContent: ContactEditModalComponent,
      nzData: { contact },
      nzWidth: 600,
      nzFooter: null,
      nzClosable: true,
      nzMaskClosable: false
    });

    modal.afterClose.subscribe((result) => {
      if (result) {
        this.loadContacts();
      }
    });
  }

  deleteContact(contact: ContactResponseDto): void {
    this.modalService.confirm({
      nzTitle: '確認刪除',
      nzContent: `確定要刪除聯絡人 "${contact.fullName}" 嗎？此操作無法撤銷。`,
      nzOkText: '確定刪除',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: '取消',
      nzOnOk: () => {
        this.contactService.deleteContact(contact.id).subscribe({
          next: () => {
            this.message.success('聯絡人刪除成功');
            this.loadContacts();
          },
          error: (error) => {
            console.error('Contact deletion error:', error);
            this.message.error(`刪除聯絡人失敗: ${error.message || '未知錯誤'}`);
          }
        });
      }
    });
  }
}
