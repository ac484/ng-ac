import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';

import { UserApplicationService } from '../../../application/services/user-application.service';
import { CreateUserDto, UpdateUserDto } from '../../../application/dto/user.dto';
import { DynamicFormComponent } from '../shared/dynamic-form/dynamic-form.component';
import { FormConfig, FormField } from '../shared/dynamic-form/form-field.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzCardModule,
    DynamicFormComponent
  ],
  template: `
    <div class="user-form-container">
      <nz-card>
        <div class="header">
          <h2>{{ isEdit ? '編輯用戶' : '新增用戶' }}</h2>
        </div>

        <app-dynamic-form
          [config]="formConfig"
          [initialValue]="initialFormValue"
          [loading]="loading"
          [submitText]="isEdit ? '更新' : '創建'"
          [showCancelButton]="true"
          cancelText="取消"
          (formSubmit)="onSubmit($event)"
          (formCancel)="goBack()"
        ></app-dynamic-form>
      </nz-card>
    </div>
  `,
  styles: [`
    .user-form-container {
      padding: 24px;
    }
    
    .header {
      margin-bottom: 24px;
    }
    
    .header h2 {
      margin: 0;
    }
  `]
})
export class UserFormComponent implements OnInit {
  private readonly userApplicationService = inject(UserApplicationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  loading = false;
  isEdit = false;
  userId: string | null = null;
  formConfig!: FormConfig;
  initialFormValue: any = {};

  ngOnInit(): void {
    this.checkEditMode();
    this.initFormConfig();
  }

  private checkEditMode(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.userId;

    if (this.isEdit) {
      this.loadUser();
    }
  }

  private initFormConfig(): void {
    const baseFields: FormField[] = [
      {
        key: 'displayName',
        label: '顯示名稱',
        type: 'text',
        required: true,
        placeholder: '請輸入顯示名稱',
        validators: [
          { type: 'maxLength', value: 100, message: '顯示名稱不能超過100個字符' }
        ]
      },
      {
        key: 'phoneNumber',
        label: '電話號碼',
        type: 'text',
        placeholder: '請輸入電話號碼'
      },
      {
        key: 'photoURL',
        label: '頭像URL',
        type: 'text',
        placeholder: '請輸入頭像URL'
      }
    ];

    if (!this.isEdit) {
      // 新增模式需要郵箱和密碼
      baseFields.unshift({
        key: 'email',
        label: '郵箱',
        type: 'email',
        required: true,
        placeholder: '請輸入郵箱地址',
        validators: [
          { type: 'email', message: '請輸入有效的郵箱地址' }
        ]
      });
      baseFields.push({
        key: 'password',
        label: '密碼',
        type: 'password',
        required: true,
        placeholder: '請輸入密碼',
        validators: [
          { type: 'minLength', value: 6, message: '密碼至少需要6個字符' }
        ]
      });
    } else {
      // 編輯模式需要狀態選擇
      baseFields.push({
        key: 'status',
        label: '狀態',
        type: 'select',
        required: true,
        options: [
          { value: 'ACTIVE', label: '啟用' },
          { value: 'INACTIVE', label: '停用' },
          { value: 'PENDING', label: '待審核' },
          { value: 'SUSPENDED', label: '暫停' }
        ]
      });
    }

    this.formConfig = {
      fields: baseFields,
      layout: 'horizontal',
      labelSpan: 6,
      controlSpan: 14
    };
  }

  private loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.userApplicationService.getUserById(this.userId).then(user => {
      if (user) {
        this.initialFormValue = {
          displayName: user.displayName,
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          status: user.status
        };
      }
      this.loading = false;
    }).catch(error => {
      this.message.error('載入用戶信息失敗');
      this.loading = false;
    });
  }

  onSubmit(formValue: any): void {
    this.loading = true;

    if (this.isEdit) {
      const updateDto: UpdateUserDto = {
        displayName: formValue.displayName,
        phoneNumber: formValue.phoneNumber,
        photoURL: formValue.photoURL
      };

      this.userApplicationService.updateUserProfile(this.userId!, updateDto).then(() => {
        this.message.success('用戶更新成功');
        this.router.navigate(['/users', this.userId]);
      }).catch(error => {
        this.message.error('用戶更新失敗');
        this.loading = false;
      });
    } else {
      const createDto: CreateUserDto = {
        displayName: formValue.displayName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        photoURL: formValue.photoURL
      };

      this.userApplicationService.createUser(createDto).then(() => {
        this.message.success('用戶創建成功');
        this.router.navigate(['/users']);
      }).catch(error => {
        this.message.error('用戶創建失敗');
        this.loading = false;
      });
    }
  }

  goBack(): void {
    if (this.isEdit) {
      this.router.navigate(['/users', this.userId]);
    } else {
      this.router.navigate(['/users']);
    }
  }
} 