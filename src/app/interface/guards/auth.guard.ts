/**
 * @fileoverview 認證守衛 (Functional Guard)
 * @description 僅判斷是否已登入，未登入導向 /auth/login
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseAuthService } from '../../security/authentication/services/firebase-auth.service';

export const AuthGuard: CanActivateFn = () => {
    const auth = inject(FirebaseAuthService);
    const router = inject(Router);
    if (auth.isLoggedIn()) {
        return true;
    }
    router.navigate(['/auth/login']);
    return false;
};


