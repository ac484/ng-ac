import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';

export const firebaseAuthGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);

    return from(new Promise<boolean>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // 立即取消訂閱

            if (user) {
                console.log('Firebase認證成功，用戶:', user.email);
                resolve(true);
            } else {
                console.log('Firebase認證失敗，重定向到登入頁面');
                router.navigate(['/auth/login']);
                resolve(false);
            }
        });
    }));
}; 