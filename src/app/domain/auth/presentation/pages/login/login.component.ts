import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  template: `
    <nz-card [nzTitle]="'Login'">
      <p>Login form - coming soon</p>
    </nz-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class LoginComponent {} 