import { Injectable } from '@angular/core';
import { RoleEntity } from '../entities/role.entity';
import { PermissionEntity } from '../entities/permission.entity';
import { Role } from '../value-objects/authorization/role.value-object';
import { Permission } from '../value-objects/authorization/permission.value-object';
import { PermissionSet } from '../value-objects/authorization/permission-set.value-object';
import { UserId } from '../value-objects/authentication/user-id.value-object';

/**
 * 授權領域服務
 * 簡化：移除重複邏輯，使用高效算法
 */
@Injectable({
  providedIn: 'root'
})
export class AuthorizationDomainService {
  // 緩存角色權限映射
  private rolePermissionCache = new Map<string, Permission[]>();
  
  constructor() {
    this.initializeRolePermissionCache();
  }

  /**
   * 檢查用戶是否具有指定角色（統一方法）
   */
  hasRole(userRoles: Role[], requiredRole: string | Role): boolean {
    const roleName = typeof requiredRole === 'string' ? requiredRole : requiredRole.getValue();
    return userRoles.some(role => role.getValue() === roleName);
  }

  /**
   * 檢查用戶是否具有指定權限（統一方法）
   */
  hasPermission(userPermissions: Permission[], requiredPermission: string | Permission): boolean {
    const permissionName = typeof requiredPermission === 'string' ? requiredPermission : requiredPermission.getValue();
    return userPermissions.some(permission => permission.getValue() === permissionName);
  }

  /**
   * 檢查用戶是否具有指定權限集合中的任何權限
   */
  hasAnyPermission(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.some(requiredPermission => 
      this.hasPermission(userPermissions, requiredPermission)
    );
  }

  /**
   * 檢查用戶是否具有指定權限集合中的所有權限
   */
  hasAllPermissions(userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(requiredPermission => 
      this.hasPermission(userPermissions, requiredPermission)
    );
  }

  /**
   * 根據角色獲取權限（帶緩存）
   */
  getPermissionsForRole(role: Role): Permission[] {
    const roleName = role.getValue();
    const cached = this.rolePermissionCache.get(roleName);
    
    if (cached) {
      return cached;
    }

    const permissions = this.calculatePermissionsForRole(roleName);
    this.rolePermissionCache.set(roleName, permissions);
    return permissions;
  }

  /**
   * 根據多個角色獲取所有權限（高效版本）
   */
  getPermissionsForRoles(roles: Role[]): Permission[] {
    const allPermissions = new Set<string>();
    
    roles.forEach(role => {
      const rolePermissions = this.getPermissionsForRole(role);
      rolePermissions.forEach(permission => {
        allPermissions.add(permission.getValue());
      });
    });

    return Array.from(allPermissions).map(name => new Permission(name));
  }

  /**
   * 驗證角色權限分配
   */
  validateRolePermissionAssignment(role: RoleEntity, permission: Permission): boolean {
    return role.isRoleActive() && !!permission;
  }

  /**
   * 驗證用戶角色分配
   */
  validateUserRoleAssignment(userId: UserId, role: RoleEntity): boolean {
    return role.isRoleActive() && !role.isAssignedToUser(userId);
  }

  /**
   * 檢查角色是否可以刪除
   */
  canDeleteRole(role: RoleEntity): boolean {
    const roleName = role.getName();
    const isSystemRole = roleName === 'Admin' || roleName === 'User';
    const hasAssignedUsers = role.getAssignedUsers().size > 0;
    
    return !isSystemRole && !hasAssignedUsers;
  }

  /**
   * 檢查權限是否可以刪除
   */
  canDeletePermission(permission: PermissionEntity): boolean {
    const permissionName = permission.getName();
    const isSystemPermission = permissionName === 'user.read' || permissionName === 'user.write';
    
    return !isSystemPermission;
  }

  /**
   * 獲取用戶的所有權限（基於角色）
   */
  getUserPermissions(userRoles: Role[]): Permission[] {
    return this.getPermissionsForRoles(userRoles);
  }

  /**
   * 檢查用戶是否可以執行指定操作
   */
  canUserPerformAction(userRoles: Role[], resource: string, action: string): boolean {
    const userPermissions = this.getUserPermissions(userRoles);
    const requiredPermission = new Permission(`${resource}.${action}`);
    
    return this.hasPermission(userPermissions, requiredPermission);
  }

  /**
   * 獲取用戶的權限集合
   */
  getUserPermissionSet(userRoles: Role[]): PermissionSet {
    const permissions = this.getUserPermissions(userRoles);
    return new PermissionSet(permissions);
  }

  /**
   * 檢查用戶是否具有管理員權限
   */
  isUserAdmin(userRoles: Role[]): boolean {
    return this.hasRole(userRoles, 'Admin');
  }

  /**
   * 檢查用戶是否具有編輯者權限
   */
  isUserEditor(userRoles: Role[]): boolean {
    return this.hasRole(userRoles, 'Editor');
  }

  /**
   * 檢查用戶是否具有基本用戶權限
   */
  isUserBasic(userRoles: Role[]): boolean {
    return this.hasRole(userRoles, 'User');
  }

  // 私有方法：初始化角色權限緩存
  private initializeRolePermissionCache(): void {
    this.rolePermissionCache.set('Admin', [
      Permission.CONTRACT_EDIT(),
      Permission.USER_READ(),
      Permission.USER_WRITE()
    ]);
    
    this.rolePermissionCache.set('Editor', [
      Permission.CONTRACT_EDIT(),
      Permission.USER_READ()
    ]);
    
    this.rolePermissionCache.set('User', [
      Permission.USER_READ()
    ]);
  }

  // 私有方法：計算角色權限
  private calculatePermissionsForRole(roleName: string): Permission[] {
    switch (roleName) {
      case 'Admin':
        return [
          Permission.CONTRACT_EDIT(),
          Permission.USER_READ(),
          Permission.USER_WRITE()
        ];
      case 'Editor':
        return [
          Permission.CONTRACT_EDIT(),
          Permission.USER_READ()
        ];
      case 'User':
        return [
          Permission.USER_READ()
        ];
      default:
        return [];
    }
  }
} 