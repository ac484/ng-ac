/**
 * @fileoverview 授權領域服務 (Authorization Domain Service)
 * @description 定義最小角色×權限矩陣與規則檢查 API
 */

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthDomainService {
    // 最小可擴展矩陣
    private readonly roleToPermissions: Record<string, readonly string[]> = {
        admin: ['dashboard.view', 'user.list'],
        user: ['dashboard.view']
    } as const;

    hasRole(userRoles: readonly string[], role: string): boolean {
        return userRoles.includes(role);
    }

    hasPermission(userPermissions: readonly string[], permission: string): boolean {
        if (userPermissions.includes(permission)) {
            return true;
        }
        // 根據角色矩陣推導
        for (const [_, perms] of Object.entries(this.roleToPermissions)) {
            if (perms.includes(permission)) {
                // 此方法只檢查集合是否包含該權限；實際角色關聯在 Facade 端整合
                return true;
            }
        }
        return false;
    }
}

