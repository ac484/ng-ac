import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { ContactResponseDto } from '../../../application/dto/contact.dto';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzButtonModule,
    NzSpaceModule,
    NzTypographyModule,
    NzTagModule,
    NzDescriptionsModule,
    NzEmptyModule,
    NzAvatarModule,
    NzGridModule
  ],
  template: `
    <nz-card>
      <div *ngIf="contactDetails; else noContactSelected">
        <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
          <nz-col>
            <div nz-row nzAlign="middle">
              <nz-avatar 
                [nzText]="contactDetails.initials"
                [nzSize]="48"
                class="mr-3">
              </nz-avatar>
              <div>
                <h3 nz-typography>{{ contactDetails.fullName }}</h3>
                <nz-tag [nzColor]="contactDetails.status ? 'green' : 'red'">
                  {{ contactDetails.status ? '啟用' : '停用' }}
                </nz-tag>
              </div>
            </div>
          </nz-col>
          <nz-col>
            <nz-space>
              <button nz-button nzType="primary" (click)="editContact()">
                編輯
              </button>
              <button nz-button nzDanger (click)="deleteContact()">
                刪除
              </button>
            </nz-space>
          </nz-col>
        </div>
        
        <nz-descriptions nzTitle="聯絡人詳細資料" [nzColumn]="1">
          <nz-descriptions-item nzTitle="電話">
            {{ contactDetails.phone }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="電子郵件">
            {{ contactDetails.email }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="建立時間">
            {{ contactDetails.createdAt | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
          <nz-descriptions-item nzTitle="最後更新">
            {{ contactDetails.updatedAt | date:'yyyy-MM-dd HH:mm:ss' }}
          </nz-descriptions-item>
        </nz-descriptions>
      </div>
      
      <ng-template #noContactSelected>
        <nz-empty 
          nzNotFoundImage="simple" 
          nzNotFoundContent="請選擇聯絡人以查看詳細資料">
        </nz-empty>
      </ng-template>
    </nz-card>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
    
    .mr-3 {
      margin-right: 12px;
    }
  `]
})
export class ContactDetailComponent implements OnInit {
  contactDetails: ContactResponseDto | null = null;

  constructor(private contactApplicationService: ContactApplicationService) { }

  ngOnInit(): void {
    this.contactApplicationService.getSelectedContact().subscribe(contact => {
      this.contactDetails = contact;
    });
  }

  editContact(): void {
    if (this.contactDetails) {
      // This would typically navigate to an edit form
      console.log('Edit contact:', this.contactDetails.id);
    }
  }

  deleteContact(): void {
    if (this.contactDetails && confirm(`確定要刪除聯絡人 ${this.contactDetails.fullName} 嗎？`)) {
      this.contactApplicationService.deleteContact(this.contactDetails.id).subscribe(() => {
        this.contactDetails = null;
        // Reload contacts list
        console.log('Contact deleted successfully');
      });
    }
  }
}

