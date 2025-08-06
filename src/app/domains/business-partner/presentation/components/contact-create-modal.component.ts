import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ContactApplicationService } from '../../application/services/contact.application.service';
import { CreateContactDto } from '../../application/dto/create-contact.dto';
import { signal } from '@angular/core';

@Component({
    selector: 'app-contact-create-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzSwitchModule
    ],
    template: `
    <div class="contact-create-modal">
      <form nz-form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>名字</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請輸入名字">
            <input nz-input formControlName="firstName" placeholder="請輸入名字" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>姓氏</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請輸入姓氏">
            <input nz-input formControlName="lastName" placeholder="請輸入姓氏" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>郵箱</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請輸入有效的郵箱地址">
            <input nz-input formControlName="email" placeholder="請輸入郵箱地址" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6" nzRequired>電話</nz-form-label>
          <nz-form-control [nzSpan]="18" nzErrorTip="請輸入電話號碼">
            <input nz-input formControlName="phone" placeholder="請輸入電話號碼" />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-label [nzSpan]="6">狀態</nz-form-label>
          <nz-form-control [nzSpan]="18">
            <nz-switch formControlName="status"></nz-switch>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item>
          <nz-form-control [nzOffset]="6" [nzSpan]="18">
            <button nz-button nzType="primary" type="submit" [disabled]="!contactForm.valid || loading()">
              <span nz-icon nzType="save"></span>
              新增聯絡人
            </button>
            <button nz-button nzType="default" type="button" (click)="onCancel()" style="margin-left: 8px;">
              取消
            </button>
          </nz-form-control>
        </nz-form-item>
      </form>
    </div>
  `,
    styles: [`
    .contact-create-modal {
      padding: 16px;
    }
  `]
})
export class ContactCreateModalComponent {
    private readonly fb = inject(FormBuilder);
    private readonly contactService = inject(ContactApplicationService);
    private readonly message = inject(NzMessageService);
    private readonly modalRef = inject(NzModalRef);

    @Output() contactCreated = new EventEmitter<void>();

    contactForm: FormGroup;
    loading = signal(false);

    constructor() {
        this.contactForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(1)]],
            lastName: ['', [Validators.required, Validators.minLength(1)]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern(/^[\d\-\+\(\)\s]+$/)]],
            status: [true]
        });
    }

    onSubmit(): void {
        if (this.contactForm.valid) {
            this.loading.set(true);
            const dto: CreateContactDto = this.contactForm.value;

            this.contactService.createContact(dto).subscribe({
                next: (contact) => {
                    this.message.success('聯絡人新增成功');
                    this.contactCreated.emit();
                    this.modalRef.close(contact);
                },
                error: (error) => {
                    console.error('Contact creation error:', error);
                    this.message.error(`新增聯絡人失敗: ${error.message || '未知錯誤'}`);
                    this.loading.set(false);
                }
            });
        } else {
            this.message.warning('請檢查表單輸入');
        }
    }

    onCancel(): void {
        this.modalRef.close();
    }
}
