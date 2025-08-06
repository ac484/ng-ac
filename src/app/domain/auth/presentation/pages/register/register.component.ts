import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterFormComponent } from 'src/app/domain/auth/presentation/components/register-form/register-form.component';

@Component({
  selector: 'app-register-page',
  template: `<app-register-form></app-register-form>`,
  standalone: true,
  imports: [CommonModule, RegisterFormComponent]
})
export class RegisterPageComponent { }
