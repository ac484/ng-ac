import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-user-list',
  template: `
    <div style="padding: 24px;">
      <h1>User Management</h1>
      <p>This is the user management page.</p>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule]
})
export class UserListComponent {} 