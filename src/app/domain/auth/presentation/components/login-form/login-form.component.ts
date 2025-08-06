import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthApplicationService } from 'src/app/domain/auth/application/services/auth-application.service';
import { LoginCommand } from 'src/app/domain/auth/application/dto/commands/login.command';
import { SettingsService } from '@delon/theme';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-login-form',
  template: `
    <div class="container">
      <div class="wrap">
        <div class="top">
          <div class="head">
            <img class="logo" src="./assets/logo-color.svg" />
            <span class="title">NG-AC</span>
          </div>
          <div class="desc">Angular DDD project</div>
        </div>
        <div class="main">
          <form nz-form [formGroup]="form" (ngSubmit)="submit()">
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <nz-input-group nzPrefixIcon="user">
                  <input type="text" nz-input formControlName="email" placeholder="Email" />
                </nz-input-group>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <nz-input-group nzPrefixIcon="lock">
                  <input type="password" nz-input formControlName="password" placeholder="Password" />
                </nz-input-group>
              </nz-form-control>
            </nz-form-item>
            <div nz-row>
              <div nz-col [nzSpan]="12">
                <label nz-checkbox formControlName="remember">
                  <span>Remember me</span>
                </label>
              </div>
            </div>
            <button nz-button [nzType]="'primary'" [nzBlock]="true" [nzLoading]="loading">
              <span>Login</span>
            </button>
            <div class="other">
              Other login methods
              <a (click)="loginWithGoogle()"><span nz-icon nzType="google" class="icon"></span></a>
              <a (click)="loginAnonymously()"><span nz-icon nzType="user" class="icon"></span></a>
            </div>
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">Required</ng-container>
              <ng-container *ngIf="control.hasError('email')">Invalid email</ng-container>
            </ng-template>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    .wrap {
      width: 368px;
      margin: 0 auto;
    }
    .top {
      text-align: center;
    }
    .head {
      height: 44px;
      line-height: 44px;
    }
    .logo {
      height: 44px;
      vertical-align: top;
      margin-right: 16px;
    }
    .title {
      font-size: 33px;
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 2px;
    }
    .desc {
      font-size: 14px;
      margin-top: 12px;
      margin-bottom: 40px;
    }
    .main {
      width: 368px;
      margin: 0 auto;
    }
    .other {
        margin-top: 16px;
        text-align: center;
    }
    .icon {
        font-size: 24px;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;
    }
    `
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzIconModule
  ],
  providers: [NzMessageService]
})
export class LoginFormComponent {
  form: FormGroup;
  error = '';
  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthApplicationService);
  private readonly message = inject(NzMessageService);
  private readonly settingsService = inject(SettingsService);
  private readonly firebaseAuth = inject(Auth);

  constructor() {
    this.form = this.fb.group({
      email: ['admin@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      remember: [true]
    });
  }

  get email() {
    return this.form.controls['email'];
  }
  get password() {
    return this.form.controls['password'];
  }

  private async updateUserInfo(user: any) {
    // 更新 SettingsService 的用戶信息
    this.settingsService.setUser({
      name: user.displayName || user.email || 'User',
      avatar: user.photoURL,
      email: user.email,
      uid: user.uid
    });
  }

  async submit() {
    this.error = '';
    this.email.markAsDirty();
    this.email.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();

    if (this.email.invalid || this.password.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      await this.authService.loginWithEmail(new LoginCommand(email, password));

      // 等待 Firebase 認證狀態更新並更新用戶信息
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(this.firebaseAuth, (user) => {
          unsubscribe();
          if (user) {
            this.updateUserInfo(user);
            resolve();
          }
        });
      });

      this.message.success('Login successful!');
      // 讓 @delon/auth 的路由守衛處理自動跳轉
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err.message || 'Login failed';
      this.message.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  async loginWithGoogle() {
    this.loading = true;
    try {
      await this.authService.loginWithGoogle();

      // 等待 Firebase 認證狀態更新並更新用戶信息
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(this.firebaseAuth, (user) => {
          unsubscribe();
          if (user) {
            this.updateUserInfo(user);
            resolve();
          }
        });
      });

      this.message.success('Login successful!');
      // 讓 @delon/auth 的路由守衛處理自動跳轉
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err.message || 'Login failed';
      this.message.error(this.error);
    } finally {
      this.loading = false;
    }
  }

  async loginAnonymously() {
    this.loading = true;
    try {
      await this.authService.loginAnonymously();

      // 等待 Firebase 認證狀態更新並更新用戶信息
      await new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(this.firebaseAuth, (user) => {
          unsubscribe();
          if (user) {
            this.updateUserInfo(user);
            resolve();
          }
        });
      });

      this.message.success('Login successful!');
      // 讓 @delon/auth 的路由守衛處理自動跳轉
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err.message || 'Login failed';
      this.message.error(this.error);
    } finally {
      this.loading = false;
    }
  }
}
