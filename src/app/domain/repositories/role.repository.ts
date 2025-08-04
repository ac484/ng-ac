import { RoleEntity } from '../entities/role.entity';
import { UserId } from '../value-objects/authentication/user-id.value-object';
import { PermissionSet } from '../value-objects/authorization/permission-set.value-object';
import { Role } from '../value-objects/authorization/role.value-object';

/**
 * 角色存儲庫接口
 */
export interface RoleRepository {
  /**
   * 根據 ID 查找角色
   */
  findById(id: string): Promise<RoleEntity | null>;

  /**
   * 根據名稱查找角色
   */
  findByName(name: string): Promise<RoleEntity | null>;

  /**
   * 查找所有角色
   */
  findAll(): Promise<RoleEntity[]>;

  /**
   * 查找活躍的角色
   */
  findActive(): Promise<RoleEntity[]>;

  /**
   * 保存角色
   */
  save(role: RoleEntity): Promise<RoleEntity>;

  /**
   * 刪除角色
   */
  delete(id: string): Promise<void>;

  /**
   * 檢查角色是否存在
   */
  exists(id: string): Promise<boolean>;

  /**
   * 檢查角色名稱是否存在
   */
  existsByName(name: string): Promise<boolean>;

  /**
   * 根據用戶 ID 查找角色
   */
  findByUserId(userId: UserId): Promise<RoleEntity[]>;

  /**
   * 為用戶分配角色
   */
  assignRoleToUser(roleId: string, userId: UserId): Promise<void>;

  /**
   * 從用戶移除角色
   */
  removeRoleFromUser(roleId: string, userId: UserId): Promise<void>;

  /**
   * 為角色添加權限
   */
  addPermissionToRole(roleId: string, permission: any): Promise<void>;

  /**
   * 從角色移除權限
   */
  removePermissionFromRole(roleId: string, permission: any): Promise<void>;

  /**
   * 獲取角色的權限集合
   */
  getRolePermissions(roleId: string): Promise<PermissionSet>;

  /**
   * 檢查用戶是否具有指定角色
   */
  userHasRole(userId: UserId, roleName: string): Promise<boolean>;

  /**
   * 檢查用戶是否具有指定權限
   */
  userHasPermission(userId: UserId, permissionName: string): Promise<boolean>;

  /**
   * 獲取用戶的所有權限
   */
  getUserPermissions(userId: UserId): Promise<string[]>;
}
