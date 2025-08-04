import { Role } from './role.value-object';

/**
 * 多角色封裝值物件
 */
export class RoleSet {
  private readonly roles: Set<Role>;

  constructor(roles: Role[] = []) {
    this.roles = new Set(roles);
  }

  addRole(role: Role): void {
    this.roles.add(role);
  }

  removeRole(role: Role): void {
    this.roles.delete(role);
  }

  hasRole(role: Role): boolean {
    return this.roles.has(role);
  }

  hasRoleByName(roleName: string): boolean {
    return Array.from(this.roles).some(role => role.getValue() === roleName);
  }

  getRoles(): Role[] {
    return Array.from(this.roles);
  }

  getRoleNames(): string[] {
    return Array.from(this.roles).map(role => role.getValue());
  }

  isEmpty(): boolean {
    return this.roles.size === 0;
  }

  size(): number {
    return this.roles.size;
  }
} 