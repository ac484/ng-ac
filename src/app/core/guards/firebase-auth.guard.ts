import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { FirebaseAuthService } from '@core/services/firebase/firebase-auth.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthGuard implements CanActivate {
    private firebaseAuthService = inject(FirebaseAuthService);
    private router = inject(Router);

    canActivate(): Observable<boolean> {
        return this.firebaseAuthService.isLoggedIn$.pipe(
            take(1),
            map(isLoggedIn => {
                if (!isLoggedIn) {
                    this.router.navigate(['/login']);
                    return false;
                }
                return true;
            })
        );
    }
}