import { Permission } from './permission.value-object';

/**
 * 權限集合值物件
 */
export class PermissionSet {
  private readonly permissions: Set<Permission>;

  constructor(permissions: Permission[] = []) {
    this.permissions = new Set(permissions);
  }

  addPermission(permission: Permission): void {
    this.permissions.add(permission);
  }

  removePermission(permission: Permission): void {
    this.permissions.delete(permission);
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.has(permission);
  }

  hasPermissionByName(permissionName: string): boolean {
    return Array.from(this.permissions).some(perm => perm.getValue() === permissionName);
  }

  getPermissions(): Permission[] {
    return Array.from(this.permissions);
  }

  getPermissionNames(): string[] {
    return Array.from(this.permissions).map(perm => perm.getValue());
  }

  intersection(other: PermissionSet): PermissionSet {
    const intersection = new Set<Permission>();
    for (const perm of this.permissions) {
      if (other.permissions.has(perm)) {
        intersection.add(perm);
      }
    }
    return new PermissionSet(Array.from(intersection));
  }

  union(other: PermissionSet): PermissionSet {
    const union = new Set<Permission>([...this.permissions, ...other.permissions]);
    return new PermissionSet(Array.from(union));
  }

  isEmpty(): boolean {
    return this.permissions.size === 0;
  }

  size(): number {
    return this.permissions.size;
  }
} 