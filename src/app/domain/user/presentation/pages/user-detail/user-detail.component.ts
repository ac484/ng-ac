import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  template: `
    <nz-card [nzTitle]="'User Details'">
      <p>User details page - coming soon</p>
    </nz-card>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class UserDetailComponent {} 