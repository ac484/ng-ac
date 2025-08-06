import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { ContactResponseDto } from '../../../application/dto/contact.dto';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzButtonModule,
    NzInputModule,
    NzSpaceModule,
    NzAvatarModule,
    NzTypographyModule,
    NzTagModule,
    NzEmptyModule,
    NzIconModule,
    NzGridModule
  ],
  template: `
    <nz-card>
      <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
        <nz-col>
          <h3 nz-typography>聯絡人管理</h3>
        </nz-col>
        <nz-col>
          <button nz-button nzType="primary" (click)="addNewContact()">
            新增聯絡人
          </button>
        </nz-col>
      </div>
      
      <div class="search-container mb-4" *ngIf="contacts.length > 0">
        <nz-input-group [nzSuffix]="suffixIcon">
          <input 
            nz-input 
            placeholder="搜尋聯絡人..." 
            [(ngModel)]="searchQuery"
            (input)="onSearch()" />
        </nz-input-group>
        <ng-template #suffixIcon>
          <span nz-icon nzType="search"></span>
        </ng-template>
      </div>

      <div class="contacts-container">
        <nz-card 
          *ngFor="let contact of filteredContacts; let index = index"
          class="contact-item"
          [class.selected]="contact.id === selectedContactId"
          (click)="selectContact(contact)"
          [nzBodyStyle]="{ padding: '12px', cursor: 'pointer' }">
          
          <div nz-row nzAlign="middle">
            <nz-col nzSpan="4">
              <nz-avatar 
                [nzText]="contact.initials"
                [nzSize]="40"
                [style.background-color]="getAvatarColor(index)">
              </nz-avatar>
            </nz-col>
            <nz-col nzSpan="20">
              <div nz-row nzJustify="space-between" nzAlign="middle">
                <nz-col>
                  <h4 nz-typography class="contact-name">{{ contact.fullName }}</h4>
                  <p nz-typography class="contact-info">{{ contact.phone }} - {{ contact.email }}</p>
                </nz-col>
                <nz-col>
                  <nz-tag [nzColor]="contact.status ? 'green' : 'red'">
                    {{ contact.status ? '啟用' : '停用' }}
                  </nz-tag>
                </nz-col>
              </div>
            </nz-col>
          </div>
        </nz-card>

        <div *ngIf="!contacts.length" class="text-center text-muted">
          <nz-empty nzNotFoundImage="simple" nzNotFoundContent="暫無聯絡人資料">
            <button nz-button nzType="primary" (click)="addNewContact()">新增第一個聯絡人</button>
          </nz-empty>
        </div>
      </div>
    </nz-card>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
    
    .contact-item {
      margin-bottom: 12px;
      transition: all 0.2s ease;
    }
    
    .contact-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    .contact-item.selected {
      border-color: #1890ff;
      box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
    }
    
    .contact-name {
      margin-bottom: 4px !important;
      font-weight: 500;
    }
    
    .contact-info {
      color: #666;
      margin-bottom: 0 !important;
    }
    
    .search-container {
      margin-bottom: 16px;
    }
  `]
})
export class ContactListComponent implements OnInit {
  contacts: ContactResponseDto[] = [];
  filteredContacts: ContactResponseDto[] = [];
  selectedContactId: string | null = null;
  searchQuery: string = '';

  constructor(private contactApplicationService: ContactApplicationService) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts(): void {
    this.contactApplicationService.getAllContacts().subscribe(contacts => {
      this.contacts = contacts;
      this.filteredContacts = contacts;
    });
  }

  selectContact(contact: ContactResponseDto): void {
    this.selectedContactId = contact.id;
    this.contactApplicationService.selectContact(contact);
  }

  addNewContact(): void {
    // This would typically navigate to a form component
    console.log('Add new contact clicked');
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredContacts = this.contacts;
      return;
    }

    this.contactApplicationService.searchContacts({ query: this.searchQuery }).subscribe(results => {
      this.filteredContacts = results;
    });
  }

  getAvatarColor(index: number): string {
    const colors = ['#1890ff', '#f5222d', '#52c41a', '#faad14', '#722ed1', '#eb2f96'];
    return colors[index % colors.length];
  }
}

