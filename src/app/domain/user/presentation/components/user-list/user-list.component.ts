import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserQueryService } from 'src/app/domain/user/application/services/user-query.service';
import { UserCommandService } from 'src/app/domain/user/application/services/user-command.service';
import { UserResponse } from 'src/app/domain/user/application/dto/responses/user.response';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-list',
  template: `
    <nz-card [nzTitle]="'Users'" [nzExtra]="extraTemplate">
      <nz-table #basicTable [nzData]="(users$ | async)!" [nzLoading]="(loading$ | async)!" [nzPageSize]="10" [nzShowPagination]="true">
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of basicTable.data">
            <td>{{ user.email }}</td>
            <td>{{ user.displayName }}</td>
            <td>{{ user.createdAt | date }}</td>
            <td>
              <button nz-button nzType="primary" nzSize="small" 
                        (click)="editUser(user.id)">
                  <i nz-icon nzType="edit"></i>
                  Edit
                </button>
                <button nz-button nzType="default" nzSize="small" nzDanger
                        (click)="deleteUser(user.id)">
                  <i nz-icon nzType="delete"></i>
                  Delete
                </button>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </nz-card>

    <ng-template #extraTemplate>
      <button nz-button nzType="primary" (click)="createUser()">
        <i nz-icon nzType="plus"></i>
        Add User
      </button>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule
  ]
})
export class UserListComponent implements OnInit {
  users$!: Observable<UserResponse[]>;
  loading$!: Observable<boolean>;

  constructor(
    private readonly userQuery: UserQueryService,
    private readonly userCommands: UserCommandService,
    private readonly router: Router,
    private readonly modal: NzModalService
  ) { }

  ngOnInit(): void {
    // this.users$ = this.userQuery.getUsersList(new GetUsersListQuery());
    // this.loading$ = this.userQuery.loading$;
  }

  createUser(): void {
    this.router.navigate(['/users/create']);
  }

  editUser(userId: string): void {
    this.router.navigate(['/users', userId, 'edit']);
  }

  deleteUser(userId: string): void {
    this.modal.confirm({
      nzTitle: 'Delete User',
      nzContent: 'Are you sure you want to delete this user?',
      nzOkText: 'Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      // nzOnOk: () => this.userCommands.deleteUser(userId)
    });
  }
}
