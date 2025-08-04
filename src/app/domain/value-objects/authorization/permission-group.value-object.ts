import { PermissionSet } from './permission-set.value-object';
import { Permission } from './permission.value-object';

/**
 * 權限群組值物件
 */
export class PermissionGroup {
  private readonly name: string;
  private readonly permissions: PermissionSet;

  constructor(name: string, permissions: PermissionSet = new PermissionSet()) {
    const trimmed = name.trim();
    if (trimmed.length === 0) {
      throw new Error('Permission group name cannot be empty');
    }
    this.name = trimmed;
    this.permissions = permissions;
  }

  getName(): string {
    return this.name;
  }

  getPermissions(): PermissionSet {
    return this.permissions;
  }

  addPermission(permission: Permission): void {
    this.permissions.addPermission(permission);
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.hasPermission(permission);
  }

  static CONTRACTS_ADMIN(): PermissionGroup {
    return new PermissionGroup('ContractsAdmin', new PermissionSet([Permission.CONTRACT_EDIT(), Permission.USER_READ()]));
  }
}
