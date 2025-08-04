import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';

import { AuthApplicationService } from '../../application/services/auth-application.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthApplicationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return of(true);
    }

    return this.authService.getUserPermissions().pipe(
      map(userRoles => {
        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (hasRequiredRole) {
          return true;
        }

        this.router.navigate(['/unauthorized']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/unauthorized']);
        return of(false);
      })
    );
  }
}
