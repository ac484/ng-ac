import { DomainEvent } from './domain-event';

/**
 * 權限創建事件
 */
export class PermissionCreatedEvent extends DomainEvent {
  public readonly permissionId: string;
  public readonly data: {
    name: string;
    description: string;
    resource: string;
    action: string;
    createdAt: Date;
  };

  constructor(
    permissionId: string,
    data: {
      name: string;
      description: string;
      resource: string;
      action: string;
      createdAt: Date;
    }
  ) {
    super();
    this.permissionId = permissionId;
    this.data = data;
  }
}

/**
 * 權限更新事件
 */
export class PermissionUpdatedEvent extends DomainEvent {
  public readonly permissionId: string;
  public readonly data: {
    oldName?: string;
    newName?: string;
    description?: string;
    resource?: string;
    action?: string;
    isActive?: boolean;
    updatedAt: Date;
  };

  constructor(
    permissionId: string,
    data: {
      oldName?: string;
      newName?: string;
      description?: string;
      resource?: string;
      action?: string;
      isActive?: boolean;
      updatedAt: Date;
    }
  ) {
    super();
    this.permissionId = permissionId;
    this.data = data;
  }
}

/**
 * 權限刪除事件
 */
export class PermissionDeletedEvent extends DomainEvent {
  public readonly permissionId: string;
  public readonly data: {
    deletedAt: Date;
  };

  constructor(
    permissionId: string,
    data: {
      deletedAt: Date;
    }
  ) {
    super();
    this.permissionId = permissionId;
    this.data = data;
  }
}
