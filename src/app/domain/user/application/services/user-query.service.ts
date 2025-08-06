import { Injectable } from '@angular/core';
import { QueryBus } from 'src/app/shared/application/query-bus';
import { GetUserByIdQuery } from '../dto/queries/get-user-by-id.query';
import { GetUsersListQuery } from '../dto/queries/get-users-list.query';
import { UserResponse } from '../dto/responses/user.response';
import { UserListResponse } from '../dto/responses/user-list.response';

@Injectable({
  providedIn: 'root'
})
export class UserQueryService {
  constructor(private readonly queryBus: QueryBus) { }

  async getUserById(query: GetUserByIdQuery): Promise<UserResponse> {
    return this.queryBus.execute(query);
  }

  async getUsersList(query: GetUsersListQuery): Promise<UserListResponse> {
    return this.queryBus.execute(query);
  }
}
