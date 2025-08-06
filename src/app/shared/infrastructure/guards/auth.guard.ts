import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
// import { AuthService } from '../services/auth.service'; // Create an auth service

export const authGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  // return authService.isAuthenticated();
  return true; // Placeholder
};
