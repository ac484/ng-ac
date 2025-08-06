import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { UserResponse } from 'src/app/domain/user/application/dto/responses/user.response';

@Component({
  selector: 'app-user-detail',
  template: `
    <nz-descriptions *ngIf="user" nzTitle="User Details" nzBordered>
      <nz-descriptions-item nzTitle="ID">{{ user.id }}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="Email">{{ user.email }}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="Display Name">{{ user.displayName }}</nz-descriptions-item>
      <nz-descriptions-item nzTitle="Created At">{{ user.createdAt | date:'short' }}</nz-descriptions-item>
    </nz-descriptions>
  `,
  standalone: true,
  imports: [CommonModule, NzDescriptionsModule]
})
export class UserDetailComponent {
  @Input() user?: UserResponse;
}
