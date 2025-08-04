import { OptimizedAggregateRoot, BaseEntityData, createEntityData } from './optimized-base-entity';

/**
 * 用戶實體資料介面
 * 定義用戶的所有屬性，使用簡單的原始類型
 */
export interface UserData extends BaseEntityData {
  email: string;
  displayName: string;
  photoURL?: string;
  isEmailVerified: boolean;
  isAnonymous: boolean;
  authProvider: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  phoneNumber?: string;
  roles: string[];
  permissions: string[];
}

/**
 * 用戶創建 DTO
 */
export interface CreateUserData {
  email: string;
  displayName: string;
  photoURL?: string;
  isAnonymous?: boolean;
  authProvider?: string;
  phoneNumber?: string;
}

/**
 * 簡化的用戶實體
 * 使用直接屬性存取，只為真正需要業務邏輯的操作創建方法
 */
export class OptimizedUser extends OptimizedAggregateRoot implements UserData {
  // 直接屬性存取，無需 getter/setter
  email: string;
  displayName: string;
  photoURL?: string;
  isEmailVerified: boolean;
  isAnonymous: boolean;
  authProvider: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLoginAt?: Date;
  phoneNumber?: string;
  roles: string[];
  permissions: string[];

  constructor(data: UserData) {
    super(data);

    // 直接賦值，簡化建構過程
    this.email = data.email;
    this.displayName = data.displayName;
    this.photoURL = data.photoURL;
    this.isEmailVerified = data.isEmailVerified;
    this.isAnonymous = data.isAnonymous;
    this.authProvider = data.authProvider;
    this.status = data.status;
    this.lastLoginAt = data.lastLoginAt;
    this.phoneNumber = data.phoneNumber;
    this.roles = [...(data.roles || [])];
    this.permissions = [...(data.permissions || [])];
  }

  /**
   * 靜態工廠方法：創建新用戶
   */
  static create(data: CreateUserData): OptimizedUser {
    const userData: UserData = {
      ...createEntityData(),
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      isEmailVerified: false,
      isAnonymous: data.isAnonymous || false,
      authProvider: data.authProvider || 'email',
      status: 'active',
      phoneNumber: data.phoneNumber,
      roles: [],
      permissions: []
    };

    const user = new OptimizedUser(userData);

    // 添加領域事件
    user.addDomainEvent({
      type: 'UserCreated',
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
      timestamp: new Date()
    });

    return user;
  }

  /**
   * 靜態工廠方法：創建匿名用戶
   */
  static createAnonymous(): OptimizedUser {
    return OptimizedUser.create({
      email: `anonymous-${Date.now()}@temp.local`,
      displayName: 'Anonymous User',
      isAnonymous: true,
      authProvider: 'anonymous'
    });
  }

  /**
   * 業務方法：更新電子郵件（包含驗證邏輯）
   */
  updateEmail(newEmail: string): void {
    if (!this.isValidEmail(newEmail)) {
      throw new Error('無效的電子郵件格式');
    }

    if (this.isAnonymous) {
      throw new Error('匿名用戶無法更新電子郵件');
    }

    const oldEmail = this.email;
    this.email = newEmail;
    this.isEmailVerified = false; // 新郵件需要重新驗證
    this.touch();

    this.addDomainEvent({
      type: 'UserEmailUpdated',
      userId: this.id,
      oldEmail,
      newEmail,
      timestamp: new Date()
    });
  }

  /**
   * 業務方法：更新個人資料
   */
  updateProfile(displayName: string, photoURL?: string): void {
    if (!displayName || displayName.trim() === '') {
      throw new Error('顯示名稱不能為空');
    }

    this.displayName = displayName.trim();
    if (photoURL !== undefined) {
      this.photoURL = photoURL;
    }
    this.touch();

    this.addDomainEvent({
      type: 'UserProfileUpdated',
      userId: this.id,
      displayName: this.displayName,
      photoURL: this.photoURL,
      timestamp: new Date()
    });
  }

  /**
   * 業務方法：更新狀態
   */
  updateStatus(newStatus: 'active' | 'inactive' | 'suspended'): void {
    if (this.status === newStatus) {
      return; // 狀態未改變
    }

    const oldStatus = this.status;
    this.status = newStatus;
    this.touch();

    this.addDomainEvent({
      type: 'UserStatusChanged',
      userId: this.id,
      oldStatus,
      newStatus,
      timestamp: new Date()
    });
  }

  /**
   * 業務方法：驗證電子郵件
   */
  verifyEmail(): void {
    if (this.isAnonymous) {
      throw new Error('匿名用戶無法驗證電子郵件');
    }

    if (this.isEmailVerified) {
      return; // 已經驗證過了
    }

    this.isEmailVerified = true;
    this.touch();

    this.addDomainEvent({
      type: 'UserEmailVerified',
      userId: this.id,
      email: this.email,
      timestamp: new Date()
    });
  }

  /**
   * 業務方法：記錄登入
   */
  recordLogin(): void {
    this.lastLoginAt = new Date();
    this.touch();

    this.addDomainEvent({
      type: 'UserLoggedIn',
      userId: this.id,
      timestamp: this.lastLoginAt
    });
  }

  /**
   * 業務方法：添加角色
   */
  addRole(role: string): void {
    if (!role || role.trim() === '') {
      throw new Error('角色名稱不能為空');
    }

    const roleName = role.trim();
    if (!this.roles.includes(roleName)) {
      this.roles.push(roleName);
      this.touch();

      this.addDomainEvent({
        type: 'UserRoleAdded',
        userId: this.id,
        role: roleName,
        timestamp: new Date()
      });
    }
  }

  /**
   * 業務方法：移除角色
   */
  removeRole(role: string): void {
    const index = this.roles.indexOf(role);
    if (index > -1) {
      this.roles.splice(index, 1);
      this.touch();

      this.addDomainEvent({
        type: 'UserRoleRemoved',
        userId: this.id,
        role,
        timestamp: new Date()
      });
    }
  }

  /**
   * 業務方法：添加權限
   */
  addPermission(permission: string): void {
    if (!permission || permission.trim() === '') {
      throw new Error('權限名稱不能為空');
    }

    const permissionName = permission.trim();
    if (!this.permissions.includes(permissionName)) {
      this.permissions.push(permissionName);
      this.touch();

      this.addDomainEvent({
        type: 'UserPermissionAdded',
        userId: this.id,
        permission: permissionName,
        timestamp: new Date()
      });
    }
  }

  /**
   * 業務方法：移除權限
   */
  removePermission(permission: string): void {
    const index = this.permissions.indexOf(permission);
    if (index > -1) {
      this.permissions.splice(index, 1);
      this.touch();

      this.addDomainEvent({
        type: 'UserPermissionRemoved',
        userId: this.id,
        permission,
        timestamp: new Date()
      });
    }
  }

  /**
   * 查詢方法：檢查是否為活躍用戶
   */
  isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * 查詢方法：檢查是否可以執行操作
   */
  canPerformActions(): boolean {
    return this.isActive() && !this.isAnonymous;
  }

  /**
   * 查詢方法：檢查是否有特定角色
   */
  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }

  /**
   * 查詢方法：檢查是否有特定權限
   */
  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  /**
   * 私有方法：驗證電子郵件格式
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 實作抽象方法：驗證用戶資料
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors = this.validateBase();

    // 驗證電子郵件
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('無效的電子郵件格式');
    }

    // 驗證顯示名稱
    if (!this.displayName || this.displayName.trim() === '') {
      errors.push('顯示名稱不能為空');
    }

    // 驗證匿名用戶邏輯
    if (this.isAnonymous && this.isEmailVerified) {
      errors.push('匿名用戶不能有已驗證的電子郵件');
    }

    // 驗證狀態
    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(this.status)) {
      errors.push('無效的用戶狀態');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * 獲取用戶摘要資訊
   */
  getSummary(): {
    id: string;
    email: string;
    displayName: string;
    status: string;
    isActive: boolean;
    isAnonymous: boolean;
    isEmailVerified: boolean;
    authProvider: string;
    roles: string[];
    permissions: string[];
  } {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      status: this.status,
      isActive: this.isActive(),
      isAnonymous: this.isAnonymous,
      isEmailVerified: this.isEmailVerified,
      authProvider: this.authProvider,
      roles: [...this.roles],
      permissions: [...this.permissions]
    };
  }

  /**
   * 轉換為 @delon/auth 格式
   */
  toDelonAuthUser(): any {
    return {
      id: this.id,
      name: this.displayName,
      email: this.email,
      avatar: this.photoURL,
      isAnonymous: this.isAnonymous,
      emailVerified: this.isEmailVerified,
      roles: [...this.roles],
      permissions: [...this.permissions]
    };
  }

  /**
   * 重寫 toJSON 方法
   */
  override toJSON(): any {
    return {
      ...super.toJSON(),
      email: this.email,
      displayName: this.displayName,
      photoURL: this.photoURL,
      isEmailVerified: this.isEmailVerified,
      isAnonymous: this.isAnonymous,
      authProvider: this.authProvider,
      status: this.status,
      lastLoginAt: this.lastLoginAt?.toISOString(),
      phoneNumber: this.phoneNumber,
      roles: [...this.roles],
      permissions: [...this.permissions]
    };
  }
}
