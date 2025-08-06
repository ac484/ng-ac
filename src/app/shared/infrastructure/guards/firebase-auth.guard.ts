import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { map, take } from 'rxjs/operators';
import { from } from 'rxjs';
import { DA_SERVICE_TOKEN } from '@delon/auth';

export const firebaseAuthGuard: CanActivateFn = (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);
    const tokenService = inject(DA_SERVICE_TOKEN);

    return from(new Promise<boolean>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe(); // 立即取消訂閱

            if (user) {
                console.log('Firebase認證成功，用戶:', user.email);

                // 確保 @delon/auth 也有正確的 token
                if (!tokenService.get()?.token) {
                    user.getIdToken().then(idToken => {
                        tokenService.set({
                            token: idToken,
                            name: user.displayName || user.email || 'User',
                            avatar: user.photoURL,
                            email: user.email,
                            uid: user.uid,
                            expired: +new Date() + 1000 * 60 * 60 * 24 * 7
                        });
                    });
                }

                resolve(true);
            } else {
                console.log('Firebase認證失敗，重定向到登入頁面');

                // 清理 @delon/auth 的 token
                tokenService.clear();

                // 導航到登入頁面
                router.navigate(['/auth/login']);
                resolve(false);
            }
        });
    }));
}; 