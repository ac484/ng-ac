import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AuthFirebaseRepository } from 'src/app/domain/auth/infrastructure/repositories/auth-firebase.repository';
@Component({
  selector: 'app-register-form',
  template: `
    <div class="container">
      <div class="wrap">
        <div class="top">
          <div class="head">
            <img class="logo" src="./assets/logo-color.svg" />
            <span class="title">NG-AC</span>
          </div>
          <div class="desc">Angular DDD project - Register</div>
        </div>
        <div class="main">
          <form nz-form [formGroup]="form" (ngSubmit)="submit()">
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <nz-input-group nzPrefixIcon="user">
                  <input type="text" nz-input formControlName="displayName" placeholder="Display Name" />
                </nz-input-group>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <nz-input-group nzPrefixIcon="mail">
                  <input type="email" nz-input formControlName="email" placeholder="Email" />
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
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <nz-input-group nzPrefixIcon="lock">
                  <input type="password" nz-input formControlName="confirmPassword" placeholder="Confirm Password" />
                </nz-input-group>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-control [nzErrorTip]="errorTpl">
                <label nz-checkbox formControlName="agree">
                  <span>I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a></span>
                </label>
              </nz-form-control>
            </nz-form-item>
            <button nz-button [nzType]="'primary'" [nzBlock]="true" [nzLoading]="loading">
              <span>Register</span>
            </button>
            <div class="other">
              <a routerLink="/auth/login" class="login">Already have an account?</a>
            </div>
            <ng-template #errorTpl let-control>
              <ng-container *ngIf="control.hasError('required')">Required</ng-container>
              <ng-container *ngIf="control.hasError('email')">Invalid email</ng-container>
              <ng-container *ngIf="control.hasError('minlength')">Password must be at least 6 characters</ng-container>
              <ng-container *ngIf="control.hasError('passwordMismatch')">Passwords do not match</ng-container>
              <ng-container *ngIf="control.hasError('requiredTrue')">You must agree to the terms</ng-container>
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
      background-color: #f0f2f5;
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
      color: rgba(0, 0, 0, .85);
      font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
      font-weight: 600;
      position: relative;
      top: 2px;
    }
    .desc {
      font-size: 14px;
      color: rgba(0, 0, 0, .45);
      margin-top: 12px;
      margin-bottom: 40px;
    }
    .main {
      width: 368px;
      margin: 0 auto;
    }
    .other {
        margin-top: 16px;
        text-align: right;
    }
    .login {
        color: #1890ff;
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
    NzIconModule,
    RouterLink
  ],
  providers: [NzMessageService, AuthFirebaseRepository]
})
export class RegisterFormComponent {
  form: FormGroup;
  error = '';
  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authRepository = inject(AuthFirebaseRepository);
  private readonly message = inject(NzMessageService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]],
      displayName: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]]
    });
  }

  passwordMatchValidator(control: any) {
    if (!this.form) {
      return null;
    }
    const password = this.form.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async submit() {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    this.loading = true;
    const { email, password } = this.form.value;

    try {
      await this.authRepository.registerWithEmail(email, password);
      this.message.success('Registration successful!');
      this.router.navigate(['/dashboard']);
    } catch (err: any) {
      this.error = err.message || 'Registration failed';
      this.message.error(this.error);
    } finally {
      this.loading = false;
    }
  }
}
