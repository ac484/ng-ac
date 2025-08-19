/**
 * @ai-context {
 *   "role": "Infrastructure/Security",
 *   "purpose": "RBAC角色權限服務-快取優化",
 *   "constraints": ["快取策略", "Firestore整合", "極簡主義"],
 *   "dependencies": ["FirestoreService"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 * @usage rbacService.getUserRoles(uid), rbacService.getUserPermissions(uid)
 * @see docs/01-angular20-architecture.md
 */

import { Injectable } from '@angular/core';
import { FirestoreService } from '../persistence/firebase';

type RoleId = string;
type PermissionId = string;

@Injectable({ providedIn: 'root' })
export class RbacService {
    private readonly userRolesCache = new Map<string, RoleId[]>();
    private readonly userPermissionsCache = new Map<string, PermissionId[]>();

    constructor(private readonly firestore: FirestoreService) {}

    async getUserRoles(uid: string): Promise<RoleId[]> {
        if (this.userRolesCache.has(uid)) {
            return this.userRolesCache.get(uid)!;
        }
        const userDoc = await this.firestore.getDocument<any>('users', uid);
        const roles: RoleId[] = Array.isArray(userDoc?.roles) ? userDoc.roles : [];
        this.userRolesCache.set(uid, roles);
        return roles;
    }

    async getUserPermissions(uid: string): Promise<PermissionId[]> {
        if (this.userPermissionsCache.has(uid)) {
            return this.userRolesCache.has(uid) ? this.userPermissionsCache.get(uid)! : [];
        }
        const roles = await this.getUserRoles(uid);
        const directPermissions: PermissionId[] = await this.getUserDirectPermissions(uid);
        const rolePermissions = await this.expandRolesToPermissions(roles);
        const all = Array.from(new Set([...directPermissions, ...rolePermissions]));
        this.userPermissionsCache.set(uid, all);
        return all;
    }

    private async getUserDirectPermissions(uid: string): Promise<PermissionId[]> {
        const userDoc = await this.firestore.getDocument<any>('users', uid);
        return Array.isArray(userDoc?.permissions) ? userDoc.permissions : [];
    }

    private async expandRolesToPermissions(roles: RoleId[]): Promise<PermissionId[]> {
        const all: PermissionId[] = [];
        for (const roleId of roles) {
            const roleDoc = await this.firestore.getDocument<any>('roles', roleId);
            if (Array.isArray(roleDoc?.permissions)) {
                all.push(...roleDoc.permissions);
            }
        }
        return Array.from(new Set(all));
    }
}


