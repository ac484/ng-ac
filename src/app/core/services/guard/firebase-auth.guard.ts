import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { FirebaseService } from '@core/services/common/firebase.service';

@Injectable({
    providedIn: 'root'
})
export class FirebaseAuthGuard implements CanActivate {
    constructor(
        private firebaseService: FirebaseService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean | UrlTree> {
        return this.firebaseService.currentUser$.pipe(
            take(1),
            map(user => {
                if (user) {
                    return true;
                } else {
                    // 重定向到登入頁面
                    return this.router.createUrlTree(['/login']);
                }
            })
        );
    }
} 