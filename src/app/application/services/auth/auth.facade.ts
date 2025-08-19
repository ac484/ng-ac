/**
 * @ai-context {
 *   "role": "Application/Service",
 *   "purpose": "認證統一入口服務",
 *   "constraints": ["單例模式", "依賴注入", "極簡主義"],
 *   "dependencies": ["AuthDomainService", "RbacService", "FirebaseAuthService"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 * @usage authFacade.isAuthenticated(), authFacade.hasRole('admin')
 * @see docs/01-angular20-architecture.md
 */

import { Injectable } from '@angular/core';
import { AuthDomainService } from '../../../domain/services/auth.domain.service';
import { RbacService } from '../../../infrastructure/security/rbac.service';
import { FirebaseAuthService } from '../../../security/authentication/services/firebase-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
    constructor(
        private readonly auth: FirebaseAuthService,
        private readonly rbac: RbacService,
        private readonly domain: AuthDomainService
    ) {}

    isAuthenticated(): boolean {
        return this.auth.isLoggedIn();
    }

    async hasRole(role: string): Promise<boolean> {
        const uid = this.auth.getCurrentUserId();
        if (!uid) { return false; }
        const roles = await this.rbac.getUserRoles(uid);
        return this.domain.hasRole(roles, role);
    }

    async hasPermission(permission: string): Promise<boolean> {
        const uid = this.auth.getCurrentUserId();
        if (!uid) { return false; }
        const permissions = await this.rbac.getUserPermissions(uid);
        return this.domain.hasPermission(permissions, permission);
    }
}


