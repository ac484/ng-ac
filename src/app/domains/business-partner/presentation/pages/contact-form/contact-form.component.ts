import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ContactApplicationService } from '../../../application/services/contact.application.service';
import { CreateContactDto, UpdateContactDto } from '../../../application/dto/contact.dto';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTypographyModule,
    NzGridModule
  ],
  template: `
    <nz-card>
      <div nz-row nzJustify="center">
        <nz-col nzSpan="16">
          <h3 nz-typography class="text-center mb-4">{{ isEditMode ? '編輯' : '新增' }}聯絡人</h3>
          
          <form nz-form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>名字</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入名字">
                <input 
                  nz-input 
                  formControlName="firstName"
                  placeholder="請輸入名字" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>姓氏</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入姓氏">
                <input 
                  nz-input 
                  formControlName="lastName"
                  placeholder="請輸入姓氏" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>電子郵件</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入有效的電子郵件">
                <input 
                  nz-input 
                  type="email"
                  formControlName="email"
                  placeholder="請輸入電子郵件" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="6" nzRequired>電話</nz-form-label>
              <nz-form-control [nzSpan]="18" nzErrorTip="請輸入電話號碼">
                <input 
                  nz-input 
                  type="tel"
                  formControlName="phone"
                  placeholder="請輸入電話號碼" />
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-label [nzSpan]="6">狀態</nz-form-label>
              <nz-form-control [nzSpan]="18">
                <label nz-checkbox formControlName="status">
                  啟用聯絡人
                </label>
              </nz-form-control>
            </nz-form-item>

            <nz-form-item>
              <nz-form-control [nzOffset]="6" [nzSpan]="18">
                <nz-space>
                  <button 
                    nz-button 
                    nzType="primary" 
                    nzSize="large"
                    [disabled]="!contactForm.valid || isSubmitting"
                    (click)="onSubmit()">
                    {{ isSubmitting ? '儲存中...' : (isEditMode ? '更新' : '新增') }}
                  </button>
                  <button 
                    nz-button 
                    nzSize="large"
                    (click)="cancel()">
                    取消
                  </button>
                </nz-space>
              </nz-form-control>
            </nz-form-item>
          </form>
        </nz-col>
      </div>
    </nz-card>
  `,
  styles: [`
    .mb-4 {
      margin-bottom: 16px;
    }
    
    .text-center {
      text-align: center;
    }
  `]
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  isEditMode: boolean = false;
  isSubmitting: boolean = false;
  contactId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contactApplicationService: ContactApplicationService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^[-+\s/0-9]*$/)]],
      status: [true]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode (would typically get from route params)
    // For now, we'll assume we're in add mode
    this.isEditMode = false;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formData = this.contactForm.value;

      if (this.isEditMode && this.contactId) {
        const updateDto: UpdateContactDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status
        };

        this.contactApplicationService.updateContact(this.contactId, updateDto).subscribe({
          next: () => {
            console.log('Contact updated successfully');
            this.isSubmitting = false;
            this.cancel();
          },
          error: (error) => {
            console.error('Error updating contact:', error);
            this.isSubmitting = false;
          }
        });
      } else {
        const createDto: CreateContactDto = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          status: formData.status
        };

        this.contactApplicationService.createContact(createDto).subscribe({
          next: () => {
            console.log('Contact created successfully');
            this.isSubmitting = false;
            this.cancel();
          },
          error: (error) => {
            console.error('Error creating contact:', error);
            this.isSubmitting = false;
          }
        });
      }
    }
  }

  cancel(): void {
    // This would typically navigate back or reset the form
    console.log('Form cancelled');
  }
}

