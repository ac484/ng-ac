import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FirebaseService } from '@core/services/common/firebase.service';

@Component({
    selector: 'app-firebase-login',
    template: `
    <div class="login-container">
      <div class="login-form">
        <h2>Firebase 登入</h2>
        
        <form nz-form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>郵箱</nz-form-label>
            <nz-form-control [nzSpan]="18" nzErrorTip="請輸入有效的郵箱地址">
              <input nz-input formControlName="email" placeholder="請輸入郵箱" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-label [nzSpan]="6" nzRequired>密碼</nz-form-label>
            <nz-form-control [nzSpan]="18" nzErrorTip="請輸入密碼">
              <input nz-input type="password" formControlName="password" placeholder="請輸入密碼" />
            </nz-form-control>
          </nz-form-item>

          <nz-form-item>
            <nz-form-control [nzOffset]="6" [nzSpan]="18">
              <button nz-button nzType="primary" [nzLoading]="loading" [disabled]="!loginForm.valid">
                登入
              </button>
              <button nz-button nzType="default" (click)="goToRegister()" style="margin-left: 8px;">
                註冊
              </button>
            </nz-form-control>
          </nz-form-item>
        </form>

        <div class="forgot-password">
          <a (click)="forgotPassword()">忘記密碼？</a>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-form {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-form h2 {
      text-align: center;
      margin-bottom: 24px;
      color: #333;
    }

    .forgot-password {
      text-align: center;
      margin-top: 16px;
    }

    .forgot-password a {
      color: #1890ff;
      cursor: pointer;
    }

    .forgot-password a:hover {
      text-decoration: underline;
    }
  `]
})
export class FirebaseLoginComponent implements OnInit {
    loginForm!: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private firebaseService: FirebaseService,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.valid) {
            this.loading = true;
            try {
                const { email, password } = this.loginForm.value;
                await this.firebaseService.signInWithEmail(email, password);
                this.message.success('登入成功！');
                this.router.navigate(['/dashboard']);
            } catch (error: any) {
                console.error('登入失敗:', error);
                this.message.error(this.getErrorMessage(error.code));
            } finally {
                this.loading = false;
            }
        }
    }

    async forgotPassword(): Promise<void> {
        const email = this.loginForm.get('email')?.value;
        if (!email) {
            this.message.warning('請先輸入郵箱地址');
            return;
        }

        try {
            await this.firebaseService.sendPasswordResetEmail(email);
            this.message.success('密碼重置郵件已發送，請檢查您的郵箱');
        } catch (error: any) {
            console.error('發送密碼重置郵件失敗:', error);
            this.message.error(this.getErrorMessage(error.code));
        }
    }

    goToRegister(): void {
        this.router.navigate(['/register']);
    }

    private getErrorMessage(errorCode: string): string {
        const errorMessages: { [key: string]: string } = {
            'auth/user-not-found': '找不到該用戶',
            'auth/wrong-password': '密碼錯誤',
            'auth/invalid-email': '郵箱格式不正確',
            'auth/user-disabled': '用戶已被禁用',
            'auth/too-many-requests': '請求過於頻繁，請稍後再試',
            'auth/network-request-failed': '網絡錯誤，請檢查網絡連接',
            'auth/invalid-credential': '認證信息無效',
            'auth/operation-not-allowed': '此操作不被允許',
            'auth/weak-password': '密碼強度太弱',
            'auth/email-already-in-use': '該郵箱已被使用'
        };

        return errorMessages[errorCode] || '登入失敗，請稍後再試';
    }
} 