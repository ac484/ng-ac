/**
 * @fileoverview 認證 Facade
 * @description 提供 UI/守衛唯一入口：isAuthenticated/hasRole/hasPermission
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


