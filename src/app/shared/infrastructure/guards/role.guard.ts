import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const expectedRole = route.data['expectedRole'];
  // const userRole = ... get user role from a service
  // return userRole === expectedRole;
  return true; // Placeholder
};
