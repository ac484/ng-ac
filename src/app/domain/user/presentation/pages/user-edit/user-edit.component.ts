import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  template: `
    <nz-card [nzTitle]="'Edit User'">
      <p>User edit form - coming soon</p>
    </nz-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class UserEditComponent {} 