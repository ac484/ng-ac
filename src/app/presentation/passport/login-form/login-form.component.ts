import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule, NzTabChangeEvent } from 'ng-zorro-antd/tabs';
import { NzRowDirective } from 'ng-zorro-antd/grid';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { LoginUseCase } from '../../../application/auth/login.use-case';
import { LoginWithGoogleUseCase } from '../../../application/auth/login-with-google.use-case';
import { LoginAnonymouslyUseCase } from '../../../application/auth/login-anonymously.use-case';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FirebaseAuthService } from '../../../infrastructure/auth/firebase-auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.less',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzTabsModule,
    NzRowDirective,
    NzColDirective,
    NzIconModule,
    RouterLink
  ],
  providers: [NzMessageService]
})
export class LoginFormComponent {
  form: FormGroup;
  error = '';
  type = 0;
  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly loginWithGoogleUseCase = inject(LoginWithGoogleUseCase);
  private readonly loginAnonymouslyUseCase = inject(LoginAnonymouslyUseCase);
  private readonly message = inject(NzMessageService);
  private readonly firebaseAuthService = inject(FirebaseAuthService);


  constructor() {
    this.form = this.fb.group({
      userName: ['admin@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true]
    });
  }

  // #region get form fields
  get userName() {
    return this.form.controls['userName'];
  }
  get password() {
    return this.form.controls['password'];
  }
  get mobile() {
    return this.form.controls['mobile'];
  }
  get captcha() {
    return this.form.controls['captcha'];
  }
  // #endregion

  switch(event: NzTabChangeEvent): void {
    this.type = event.index ?? 0;
  }

  submit(): void {
    this.error = '';
    if (this.type === 0) {
      this.userName.markAsDirty();
      this.userName.updateValueAndValidity();
      this.password.markAsDirty();
      this.password.updateValueAndValidity();
      if (this.userName.invalid || this.password.invalid) {
        return;
      }
    } else {
      this.mobile.markAsDirty();
      this.mobile.updateValueAndValidity();
      this.captcha.markAsDirty();
      this.captcha.updateValueAndValidity();
      if (this.mobile.invalid || this.captcha.invalid) {
        return;
      }
    }

    this.loading = true;
    const { userName, password } = this.form.value;
    this.loginUseCase.execute({ email: userName, password })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.message.success('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.message || 'Login failed';
          this.message.error(this.error);
        }
      });
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.firebaseAuthService.loginWithGoogleRedirect();
  }

  loginAnonymously(): void {
    this.loading = true;
    this.loginAnonymouslyUseCase.execute()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.message.success('Login successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = err.message || 'Login failed';
          this.message.error(this.error);
        }
      });
  }
} 