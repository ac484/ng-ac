import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { UserQueryService } from '../../application/services/user-query.service';
import { GetUserByIdQuery } from '../../application/dto/queries/get-user-by-id.query';
import { UserResponse } from '../../application/dto/responses/user.response';

export const userResolver: ResolveFn<UserResponse | null> = (route, state) => {
  const userQuery = inject(UserQueryService);
  const userId = route.paramMap.get('id');

  if (!userId) {
    return null;
  }

  return userQuery.getUserById(new GetUserByIdQuery(userId));
};
