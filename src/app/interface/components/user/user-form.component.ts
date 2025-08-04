import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';

import { UserApplicationService } from '../../../application/services/user-application.service';
import { CreateUserDto, UpdateUserDto } from '../../../application/dto/user.dto';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCardModule
  ],
  template: `
    <div class="user-form-container">
      <nz-card>
        <div class="header">
          <h2>{{ isEdit ? '編輯用戶' : '新增用戶' }}</h2>
        </div>

        <form nz-form [formGroup]="form" (ngSubmit)="onSubmit()">
          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>顯示名稱</nz-form-label>
            <nz-form-control [nzSpan]="14" nzErrorTip="請輸入顯示名稱">
              <input nz-input formControlName="displayName" placeholder="請輸入顯示名稱" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>郵箱</nz-form-label>
            <nz-form-control [nzSpan]="14" nzErrorTip="請輸入有效的郵箱地址">
              <input nz-input formControlName="email" placeholder="請輸入郵箱地址" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item *ngIf="!isEdit">
            <nz-form-label [nzSpan]="6" nzRequired>密碼</nz-form-label>
            <nz-form-control [nzSpan]="14" nzErrorTip="請輸入密碼">
              <input nz-input type="password" formControlName="password" placeholder="請輸入密碼" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6">電話號碼</nz-form-label>
            <nz-form-control [nzSpan]="14">
              <input nz-input formControlName="phoneNumber" placeholder="請輸入電話號碼" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6">頭像URL</nz-form-label>
            <nz-form-control [nzSpan]="14">
              <input nz-input formControlName="photoURL" placeholder="請輸入頭像URL" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item *ngIf="isEdit">
            <nz-form-label [nzSpan]="6">狀態</nz-form-label>
            <nz-form-control [nzSpan]="14">
              <nz-select formControlName="status" placeholder="請選擇狀態">
                <nz-option nzValue="ACTIVE" nzLabel="啟用"></nz-option>
                <nz-option nzValue="INACTIVE" nzLabel="停用"></nz-option>
                <nz-option nzValue="PENDING" nzLabel="待審核"></nz-option>
                <nz-option nzValue="SUSPENDED" nzLabel="暫停"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control [nzOffset]="6" [nzSpan]="14">
              <button nz-button nzType="primary" type="submit" [nzLoading]="loading">
                {{ isEdit ? '更新' : '創建' }}
              </button>
              <button nz-button nzType="default" type="button" (click)="goBack()" style="margin-left: 8px;">
                取消
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>
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
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  loading = false;
  isEdit = false;
  userId: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.checkEditMode();
  }

  private initForm(): void {
    this.form = this.fb.group({
      displayName: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [''],
      photoURL: [''],
      status: ['ACTIVE']
    });
  }

  private checkEditMode(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!this.userId;

    if (this.isEdit) {
      this.loadUser();
      // 編輯模式下不需要密碼驗證
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  private loadUser(): void {
    if (!this.userId) return;

    this.loading = true;
    this.userApplicationService.getUserById(this.userId).then(user => {
      if (user) {
        this.form.patchValue({
          displayName: user.displayName,
          phoneNumber: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          status: user.status
        });
      }
      this.loading = false;
    }).catch(error => {
      this.message.error('載入用戶信息失敗');
      this.loading = false;
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.message.error('請檢查表單輸入');
      return;
    }

    this.loading = true;
    const formValue = this.form.value;

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