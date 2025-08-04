import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthApplicationService } from '../../application/services/auth-application.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthApplicationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
