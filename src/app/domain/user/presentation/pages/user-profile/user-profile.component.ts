import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserDetailComponent } from 'src/app/domain/user/presentation/components/user-detail/user-detail.component';
import { UserQueryService } from 'src/app/domain/user/application/services/user-query.service';
import { UserResponse } from 'src/app/domain/user/application/dto/responses/user.response';
import { Observable } from 'rxjs';
import { GetUserByIdQuery } from 'src/app/domain/user/application/dto/queries/get-user-by-id.query';

@Component({
  selector: 'app-user-profile',
  template: `
    <app-user-detail [user]="(user$ | async)!"></app-user-detail>
  `,
  standalone: true,
  imports: [CommonModule, UserDetailComponent]
})
export class UserProfileComponent implements OnInit {
  user$!: Observable<UserResponse>;

  constructor(
    private route: ActivatedRoute,
    private userQuery: UserQueryService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // this.user$ = this.userQuery.getUserById(new GetUserByIdQuery(userId));
    }
  }
}
