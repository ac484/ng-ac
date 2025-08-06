import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzRowDirective } from 'ng-zorro-antd/grid';
import { NzColDirective } from 'ng-zorro-antd/grid';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { FirebaseAuthService } from '../../../infrastructure/auth/firebase-auth.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.less',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzRowDirective,
    NzColDirective,
    NzIconModule,
    RouterLink
  ],
  providers: [NzMessageService]
})
export class RegisterFormComponent {
  form: FormGroup;
  error = '';
  loading = false;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly message = inject(NzMessageService);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      displayName: ['', [Validators.required]],
      agree: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  get email() {
    return this.form.controls['email'];
  }
  get password() {
    return this.form.controls['password'];
  }
  get confirmPassword() {
    return this.form.controls['confirmPassword'];
  }
  get displayName() {
    return this.form.controls['displayName'];
  }
  get agree() {
    return this.form.controls['agree'];
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  submit(): void {
    this.error = '';
    this.email.markAsDirty();
    this.email.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    this.confirmPassword.markAsDirty();
    this.confirmPassword.updateValueAndValidity();
    this.displayName.markAsDirty();
    this.displayName.updateValueAndValidity();
    this.agree.markAsDirty();
    this.agree.updateValueAndValidity();

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const { email, password, displayName } = this.form.value;
    
    this.firebaseAuthService.createUserWithEmail({ email, password, displayName })
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.message.success('Registration successful!');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          this.error = err.message || 'Registration failed';
          this.message.error(this.error);
        }
      });
  }

  loginWithGoogle(): void {
    this.loading = true;
    this.firebaseAuthService.loginWithGoogle()
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

  loginAnonymously(): void {
    this.loading = true;
    this.firebaseAuthService.loginAnonymously()
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