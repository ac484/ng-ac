import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserQueryService } from '../../application/services/user-query.service';
import { GetUserByIdQuery } from '../../application/dto/queries/get-user-by-id.query';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const userExistsGuard: CanActivateFn = (route, state) => {
  const userQuery = inject(UserQueryService);
  const router = inject(Router);
  const userId = route.paramMap.get('id');

  if (!userId) {
    router.navigate(['/404']);
    return false;
  }

  return userQuery.getUserById(new GetUserByIdQuery(userId)).then(user => {
      if (user) {
          return true;
      } else {
        router.navigate(['/404']);
        return false;
      }
  }).catch(() => {
    router.navigate(['/404']);
    return false;
  });
};
