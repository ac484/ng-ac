import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { CommonModule } from '@angular/common';
import { LoginUseCase } from '../../../application/auth/login.use-case';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.less',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule
  ],
  providers: [NzMessageService]
})
export class LoginComponent {
  validateForm: FormGroup;
  isLoading = false;
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);

  constructor() {
    this.validateForm = this.fb.group({
      userName: ['admin@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const { userName, password } = this.validateForm.value;
      this.loginUseCase.execute({ email: userName, password })
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            this.message.success('Login successful!');
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            this.message.error(err.message || 'Login failed');
          }
        });
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.error('Please fill in all required fields correctly.');
    }
  }
} 