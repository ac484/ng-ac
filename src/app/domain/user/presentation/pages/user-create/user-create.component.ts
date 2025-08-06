import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  template: `
    <nz-card [nzTitle]="'Create User'">
      <p>User creation form - coming soon</p>
    </nz-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class UserCreateComponent {} 