import { PermissionEntity } from '../entities/permission.entity';
import { Permission } from '../value-objects/authorization/permission.value-object';

/**
 * 權限存儲庫接口
 */
export interface PermissionRepository {
  /**
   * 根據 ID 查找權限
   */
  findById(id: string): Promise<PermissionEntity | null>;

  /**
   * 根據名稱查找權限
   */
  findByName(name: string): Promise<PermissionEntity | null>;

  /**
   * 查找所有權限
   */
  findAll(): Promise<PermissionEntity[]>;

  /**
   * 查找活躍的權限
   */
  findActive(): Promise<PermissionEntity[]>;

  /**
   * 根據資源查找權限
   */
  findByResource(resource: string): Promise<PermissionEntity[]>;

  /**
   * 根據操作查找權限
   */
  findByAction(action: string): Promise<PermissionEntity[]>;

  /**
   * 根據資源和操作查找權限
   */
  findByResourceAndAction(resource: string, action: string): Promise<PermissionEntity | null>;

  /**
   * 保存權限
   */
  save(permission: PermissionEntity): Promise<PermissionEntity>;

  /**
   * 刪除權限
   */
  delete(id: string): Promise<void>;

  /**
   * 檢查權限是否存在
   */
  exists(id: string): Promise<boolean>;

  /**
   * 檢查權限名稱是否存在
   */
  existsByName(name: string): Promise<boolean>;

  /**
   * 檢查資源和操作組合是否存在
   */
  existsByResourceAndAction(resource: string, action: string): Promise<boolean>;

  /**
   * 批量保存權限
   */
  saveMany(permissions: PermissionEntity[]): Promise<PermissionEntity[]>;

  /**
   * 批量刪除權限
   */
  deleteMany(ids: string[]): Promise<void>;

  /**
   * 查找系統預設權限
   */
  findSystemPermissions(): Promise<PermissionEntity[]>;

  /**
   * 查找自定義權限
   */
  findCustomPermissions(): Promise<PermissionEntity[]>;

  /**
   * 根據權限類型查找
   */
  findByType(type: string): Promise<PermissionEntity[]>;

  /**
   * 統計權限數量
   */
  count(): Promise<number>;

  /**
   * 統計活躍權限數量
   */
  countActive(): Promise<number>;

  /**
   * 檢查權限是否被使用
   */
  isPermissionUsed(permissionId: string): Promise<boolean>;

  /**
   * 獲取權限使用統計
   */
  getPermissionUsageStats(): Promise<Array<{ permissionId: string; usageCount: number }>>;
}
