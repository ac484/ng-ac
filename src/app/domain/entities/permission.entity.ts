import { AggregateRoot } from './aggregate-root';
import { PermissionCreatedEvent, PermissionUpdatedEvent, PermissionDeletedEvent } from '../events/permission-events';
import { Permission } from '../value-objects/authorization/permission.value-object';

/**
 * 權限聚合根
 * 管理權限及其相關信息
 */
export class PermissionEntity extends AggregateRoot<string> {
  private name: string;
  private description: string;
  private resource: string;
  private action: string;
  private isActive: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    description = '',
    resource = '',
    action = '',
    isActive = true,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    super(id);
    this.name = name;
    this.description = description;
    this.resource = resource;
    this.action = action;
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

  getResource(): string {
    return this.resource;
  }

  getAction(): string {
    return this.action;
  }

  isPermissionActive(): boolean {
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
      throw new Error('Permission name cannot be empty');
    }

    const oldName = this.name;
    this.name = newName.trim();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PermissionUpdatedEvent(this.id, {
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
      new PermissionUpdatedEvent(this.id, {
        description: this.description,
        updatedAt: this.updatedAt
      })
    );
  }

  updateResource(newResource: string): void {
    this.resource = newResource.trim();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PermissionUpdatedEvent(this.id, {
        resource: this.resource,
        updatedAt: this.updatedAt
      })
    );
  }

  updateAction(newAction: string): void {
    this.action = newAction.trim();
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PermissionUpdatedEvent(this.id, {
        action: this.action,
        updatedAt: this.updatedAt
      })
    );
  }

  activate(): void {
    if (this.isActive) {
      throw new Error('Permission is already active');
    }

    this.isActive = true;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PermissionUpdatedEvent(this.id, {
        isActive: true,
        updatedAt: this.updatedAt
      })
    );
  }

  deactivate(): void {
    if (!this.isActive) {
      throw new Error('Permission is already inactive');
    }

    this.isActive = false;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new PermissionUpdatedEvent(this.id, {
        isActive: false,
        updatedAt: this.updatedAt
      })
    );
  }

  getFullPermissionName(): string {
    return `${this.resource}:${this.action}`;
  }

  // 靜態工廠方法
  static create(id: string, name: string, description = '', resource = '', action = ''): PermissionEntity {
    const permission = new PermissionEntity(id, name, description, resource, action);
    permission.addDomainEvent(
      new PermissionCreatedEvent(id, {
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
        createdAt: permission.createdAt
      })
    );
    return permission;
  }

  static createContractEditPermission(): PermissionEntity {
    return PermissionEntity.create('contract.edit', 'Edit Contract', 'Permission to edit contracts', 'contract', 'edit');
  }

  static createUserReadPermission(): PermissionEntity {
    return PermissionEntity.create('user.read', 'Read User', 'Permission to read user information', 'user', 'read');
  }

  static createUserWritePermission(): PermissionEntity {
    return PermissionEntity.create('user.write', 'Write User', 'Permission to write user information', 'user', 'write');
  }
}
