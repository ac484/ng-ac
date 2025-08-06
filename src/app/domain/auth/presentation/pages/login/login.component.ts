import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from 'src/app/domain/auth/presentation/components/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  template: `<app-login-form></app-login-form>`,
  standalone: true,
  imports: [CommonModule, LoginFormComponent]
})
export class LoginPageComponent { }
