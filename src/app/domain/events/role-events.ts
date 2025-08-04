import { DomainEvent } from './domain-event';

/**
 * 角色創建事件
 */
export class RoleCreatedEvent extends DomainEvent {
  public readonly roleId: string;
  public readonly data: {
    name: string;
    description: string;
    permissions: any;
    createdAt: Date;
  };

  constructor(
    roleId: string,
    data: {
      name: string;
      description: string;
      permissions: any;
      createdAt: Date;
    }
  ) {
    super();
    this.roleId = roleId;
    this.data = data;
  }
}

/**
 * 角色更新事件
 */
export class RoleUpdatedEvent extends DomainEvent {
  public readonly roleId: string;
  public readonly data: {
    oldName?: string;
    newName?: string;
    description?: string;
    addedPermission?: string;
    removedPermission?: string;
    assignedUserId?: string;
    unassignedUserId?: string;
    isActive?: boolean;
    updatedAt: Date;
  };

  constructor(
    roleId: string,
    data: {
      oldName?: string;
      newName?: string;
      description?: string;
      addedPermission?: string;
      removedPermission?: string;
      assignedUserId?: string;
      unassignedUserId?: string;
      isActive?: boolean;
      updatedAt: Date;
    }
  ) {
    super();
    this.roleId = roleId;
    this.data = data;
  }
}

/**
 * 角色刪除事件
 */
export class RoleDeletedEvent extends DomainEvent {
  public readonly roleId: string;
  public readonly data: {
    deletedAt: Date;
  };

  constructor(
    roleId: string,
    data: {
      deletedAt: Date;
    }
  ) {
    super();
    this.roleId = roleId;
    this.data = data;
  }
} 