/**
 * @ai-context {
 *   "role": "Interface/Guard",
 *   "purpose": "函數式認證守衛-路由保護",
 *   "constraints": ["Angular v20", "函數式守衛", "極簡主義"],
 *   "dependencies": ["FirebaseAuthService", "Router"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 * @usage canActivate: [AuthGuard]
 * @see docs/01-angular20-architecture.md
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


