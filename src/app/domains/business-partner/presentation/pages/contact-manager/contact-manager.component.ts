import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ContactListComponent } from '../contact-list/contact-list.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';

@Component({
  selector: 'app-contact-manager',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzGridModule,
    NzTypographyModule,
    ContactListComponent,
    ContactDetailComponent
  ],
  template: `
    <div class="contact-manager-container">
      <nz-card>
        <div nz-row nzJustify="space-between" nzAlign="middle" class="mb-4">
          <nz-col>
            <h2 nz-typography>業務夥伴管理系統</h2>
            <p nz-typography class="text-muted">聯絡人管理 - DDD 架構</p>
          </nz-col>
        </div>
        
        <div nz-row nzGutter="16">
          <nz-col nzSpan="12">
            <app-contact-list></app-contact-list>
          </nz-col>
          <nz-col nzSpan="12">
            <app-contact-detail></app-contact-detail>
          </nz-col>
        </div>
      </nz-card>
    </div>
  `,
  styles: [`
    .contact-manager-container {
      padding: 16px;
    }
    
    .mb-4 {
      margin-bottom: 16px;
    }
    
    .text-muted {
      color: #666;
    }
  `]
})
export class ContactManagerComponent {
  constructor() { }
}

