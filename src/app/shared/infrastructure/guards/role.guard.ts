import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, map, take, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return new Observable(observer => observer.next(true));
    }

    return this.auth.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return new Observable<boolean>(observer => observer.next(false));
        }

        return this.firestore.collection('users').doc(user.uid).get().pipe(
          map(doc => {
            if (!doc.exists) {
              this.router.navigate(['/auth/login']);
              return false;
            }

            const userData = doc.data() as any;
            const userRoles = userData?.roles || [];
            
            const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
            
            if (!hasRequiredRole) {
              this.router.navigate(['/unauthorized']);
              return false;
            }

            return true;
          })
        );
      })
    );
  }
} 