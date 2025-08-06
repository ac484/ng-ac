import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

export const firebaseAuthGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    return new Promise<boolean>(resolve => {
        const unsubscribe = onAuthStateChanged(
            auth,
            user => {
                unsubscribe();
                if (user) {
                    resolve(true);
                } else {
                    router.navigate(['/auth/login']);
                    resolve(false);
                }
            },
            error => {
                unsubscribe();
                console.error('Auth state error in guard:', error);
                router.navigate(['/auth/login']);
                resolve(false);
            }
        );
    });
}; 