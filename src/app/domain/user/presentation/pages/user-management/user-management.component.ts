import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, NzCardModule, NzButtonModule, NzIconModule],
  template: `
    <nz-card [nzTitle]="'User Management'" [nzExtra]="extraTemplate">
      <p>User management page - coming soon</p>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzType="primary" (click)="createUser()">
        <nz-icon nzType="plus"></nz-icon>
        Add User
      </button>
    </ng-template>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
    }
  `]
})
export class UserManagementComponent {
  constructor(private router: Router) {}

  createUser(): void {
    this.router.navigate(['/users/create']);
  }
} 