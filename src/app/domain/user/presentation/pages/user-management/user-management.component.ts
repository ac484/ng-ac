import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from 'src/app/domain/user/presentation/components/user-list/user-list.component';
import { UserSearchComponent } from 'src/app/domain/user/presentation/components/user-search/user-search.component';

@Component({
  selector: 'app-user-management',
  template: `
    <app-user-search (search)="onSearch($event)"></app-user-search>
    <app-user-list></app-user-list>
  `,
  standalone: true,
  imports: [CommonModule, UserListComponent, UserSearchComponent]
})
export class UserManagementComponent {
  onSearch(term: string): void {
    console.log('Searching for:', term);
    // Here you would typically call a service to filter the user list
  }
}
