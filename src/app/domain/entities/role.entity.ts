import { AggregateRoot } from './aggregate-root';
import { RoleCreatedEvent, RoleUpdatedEvent, RoleDeletedEvent } from '../events/role-events';
import { UserId } from '../value-objects/authentication/user-id.value-object';
import { PermissionSet } from '../value-objects/authorization/permission-set.value-object';
import { Role } from '../value-objects/authorization/role.value-object';

/**
 * 角色聚合根
 * 管理角色及其權限
 */
export class RoleEntity extends AggregateRoot<string> {
  private name: string;
  private description: string;
  private permissions: PermissionSet;
  private assignedUsers: Set<string>;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description = '',
    permissions: PermissionSet = new PermissionSet(),
    assignedUsers = new Set<string>(),
    isActive = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id);
    this.name = name;
    this.description = description;
    this.permissions = permissions;
    this.assignedUsers = assignedUsers;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // 基本屬性訪問器
  get id(): string {
    return this.props;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPermissions(): PermissionSet {
    return this.permissions;
  }

  getAssignedUsers(): Set<string> {
    return new Set(this.assignedUsers);
  }

  isRoleActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return new Date(this.createdAt);
  }

  getUpdatedAt(): Date {
    return new Date(this.updatedAt);
  }

  // 業務方法
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Role name cannot be empty');
    }

    const oldName = this.name;
    this.name = newName.trim();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        oldName,
        newName: this.name,
        updatedAt: this.updatedAt
      })
    );
  }

  updateDescription(newDescription: string): void {
    this.description = newDescription.trim();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        description: this.description,
        updatedAt: this.updatedAt
      })
    );
  }

  addPermission(permission: any): void {
    this.permissions.addPermission(permission);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        addedPermission: permission.getValue(),
        updatedAt: this.updatedAt
      })
    );
  }

  removePermission(permission: any): void {
    this.permissions.removePermission(permission);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        removedPermission: permission.getValue(),
        updatedAt: this.updatedAt
      })
    );
  }

  assignUser(userId: UserId): void {
    const userIdStr = userId.getValue();
    if (this.assignedUsers.has(userIdStr)) {
      throw new Error('User is already assigned to this role');
    }

    this.assignedUsers.add(userIdStr);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        assignedUserId: userIdStr,
        updatedAt: this.updatedAt
      })
    );
  }

  unassignUser(userId: UserId): void {
    const userIdStr = userId.getValue();
    if (!this.assignedUsers.has(userIdStr)) {
      throw new Error('User is not assigned to this role');
    }

    this.assignedUsers.delete(userIdStr);
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        unassignedUserId: userIdStr,
        updatedAt: this.updatedAt
      })
    );
  }

  activate(): void {
    if (this.isActive) {
      throw new Error('Role is already active');
    }

    this.isActive = true;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        isActive: true,
        updatedAt: this.updatedAt
      })
    );
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('Role is already inactive');
    }

    this.isActive = false;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new RoleUpdatedEvent(this.id, {
        isActive: false,
        updatedAt: this.updatedAt
      })
    );
  }

  hasPermission(permission: any): boolean {
    return this.permissions.hasPermission(permission);
  }

  hasPermissionByName(permissionName: string): boolean {
    return this.permissions.hasPermissionByName(permissionName);
  }

  isAssignedToUser(userId: UserId): boolean {
    return this.assignedUsers.has(userId.getValue());
  }

  // 靜態工廠方法
  static create(id: string, name: string, description = '', permissions: PermissionSet = new PermissionSet()): RoleEntity {
    const role = new RoleEntity(id, name, description, permissions);
    role.addDomainEvent(
      new RoleCreatedEvent(id, {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        createdAt: role.createdAt
      })
    );
    return role;
  }

  static createAdminRole(): RoleEntity {
    const adminPermissions = new PermissionSet([
      // 這裡應該添加管理員權限
    ]);
    return RoleEntity.create('admin', 'Admin', 'System administrator', adminPermissions);
  }

  static createUserRole(): RoleEntity {
    const userPermissions = new PermissionSet([
      // 這裡應該添加用戶權限
    ]);
    return RoleEntity.create('user', 'User', 'Regular user', userPermissions);
  }

  static createEditorRole(): RoleEntity {
    const editorPermissions = new PermissionSet([
      // 這裡應該添加編輯者權限
    ]);
    return RoleEntity.create('editor', 'Editor', 'Content editor', editorPermissions);
  }
}
