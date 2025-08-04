import { AggregateRoot } from './aggregate-root';
import { UserCreatedEvent, UserUpdatedEvent, UserStatusChangedEvent, UserDeactivatedEvent, UserActivatedEvent } from '../events/user-events';

// 導入值物件
import { Email } from '../value-objects/authentication/email.value-object';
import { DisplayName } from '../value-objects/authentication/display-name.value-object';
import { PhotoUrl } from '../value-objects/authentication/photo-url.value-object';
import { UserId } from '../value-objects/authentication/user-id.value-object';
import { UserStatus } from '../value-objects/status/user-status.value-object';
import { IsAnonymous } from '../value-objects/status/is-anonymous.value-object';
import { IsEmailVerified } from '../value-objects/status/is-email-verified.value-object';
import { AuthProvider } from '../value-objects/authentication/auth-provider.value-object';
import { AuthMethod } from '../value-objects/authentication/auth-method.value-object';
import { SessionId } from '../value-objects/authentication/session-id.value-object';
import { RoleSet } from '../value-objects/authorization/role-set.value-object';
import { PermissionSet } from '../value-objects/authorization/permission-set.value-object';
import { DeviceInfo } from '../value-objects/device/device-info.value-object';
import { GeoLocation } from '../value-objects/device/geo-location.value-object';
import { LoginContext } from '../value-objects/device/login-context.value-object';

// 重新導出值物件以解決 TS2459 錯誤
export { UserStatus } from '../value-objects/status/user-status.value-object';

/**
 * User entity representing a user in the system
 * Integrates with @delon/auth and Firebase authentication
 * Now extends AggregateRoot for DDD architecture with rich value objects
 */
export class User extends AggregateRoot<string> {
  constructor(
    id: UserId,
    email: Email,
    displayName: DisplayName,
    photoUrl: PhotoUrl,
    status: UserStatus,
    isAnonymous: IsAnonymous,
    isEmailVerified: IsEmailVerified,
    authProvider: AuthProvider,
    authMethod: AuthMethod,
    sessionId: SessionId,
    roles: RoleSet,
    permissions: PermissionSet,
    deviceInfo: DeviceInfo,
    geoLocation: GeoLocation,
    loginContext: LoginContext,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date(),
    phoneNumber?: string
  ) {
    super(id.getValue());
    
    // 私有屬性使用值物件
    this._id = id;
    this._email = email;
    this._displayName = displayName;
    this._photoUrl = photoUrl;
    this._status = status;
    this._isAnonymous = isAnonymous;
    this._isEmailVerified = isEmailVerified;
    this._authProvider = authProvider;
    this._authMethod = authMethod;
    this._sessionId = sessionId;
    this._roles = roles;
    this._permissions = permissions;
    this._deviceInfo = deviceInfo;
    this._geoLocation = geoLocation;
    this._loginContext = loginContext;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
    this._phoneNumber = phoneNumber;
  }

  // 私有屬性
  private _id: UserId;
  private _email: Email;
  private _displayName: DisplayName;
  private _photoUrl: PhotoUrl;
  private _status: UserStatus;
  private _isAnonymous: IsAnonymous;
  private _isEmailVerified: IsEmailVerified;
  private _authProvider: AuthProvider;
  private _authMethod: AuthMethod;
  private _sessionId: SessionId;
  private _roles: RoleSet;
  private _permissions: PermissionSet;
  private _deviceInfo: DeviceInfo;
  private _geoLocation: GeoLocation;
  private _loginContext: LoginContext;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _phoneNumber?: string;

  // Getter 方法
  get id(): string { return this._id.getValue(); }
  get email(): Email { return this._email; }
  get displayName(): DisplayName { return this._displayName; }
  get photoUrl(): PhotoUrl { return this._photoUrl; }
  get status(): UserStatus { return this._status; }
  get isAnonymous(): IsAnonymous { return this._isAnonymous; }
  get isEmailVerified(): IsEmailVerified { return this._isEmailVerified; }
  get authProvider(): AuthProvider { return this._authProvider; }
  get authMethod(): AuthMethod { return this._authMethod; }
  get sessionId(): SessionId { return this._sessionId; }
  get roles(): RoleSet { return this._roles; }
  get permissions(): PermissionSet { return this._permissions; }
  get deviceInfo(): DeviceInfo { return this._deviceInfo; }
  get geoLocation(): GeoLocation { return this._geoLocation; }
  get loginContext(): LoginContext { return this._loginContext; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
  get phoneNumber(): string | undefined { return this._phoneNumber; }

  /**
   * Create a new user with rich value objects
   */
  static create(
    id: string,
    email: string,
    displayName: string,
    photoUrl?: string,
    isAnonymous: boolean = false,
    isEmailVerified: boolean = false,
    authProvider: string = 'email',
    authMethod: string = 'password'
  ): User {
    const userId = new UserId(id);
    const emailVO = new Email(email);
    const displayNameVO = new DisplayName(displayName);
    const photoUrlVO = new PhotoUrl(photoUrl || null);
    const statusVO = UserStatus.ACTIVE();
    const isAnonymousVO = new IsAnonymous(isAnonymous);
    const isEmailVerifiedVO = new IsEmailVerified(isEmailVerified);
    const authProviderVO = new AuthProvider(authProvider as any);
    const authMethodVO = new AuthMethod(authMethod as any);
    const sessionIdVO = SessionId.generate();
    const rolesVO = new RoleSet();
    const permissionsVO = new PermissionSet();
    const deviceInfoVO = DeviceInfo.fromBrowser();
    const geoLocationVO = new GeoLocation('Unknown', 'Unknown', 0, 0);
    const loginContextVO = new LoginContext('127.0.0.1', deviceInfoVO, geoLocationVO, 'Web' as any);

    const user = new User(
      userId,
      emailVO,
      displayNameVO,
      photoUrlVO,
      statusVO,
      isAnonymousVO,
      isEmailVerifiedVO,
      authProviderVO,
      authMethodVO,
      sessionIdVO,
      rolesVO,
      permissionsVO,
      deviceInfoVO,
      geoLocationVO,
      loginContextVO
    );

    user.addDomainEvent(new UserCreatedEvent(id, email, displayName));
    return user;
  }

  /**
   * Create anonymous user
   */
  static createAnonymous(): User {
    const userId = UserId.generate();
    const emailVO = Email.createAnonymous();
    const displayNameVO = new DisplayName('Anonymous User');
    const photoUrlVO = new PhotoUrl(null);
    const statusVO = UserStatus.ACTIVE();
    const isAnonymousVO = IsAnonymous.ANONYMOUS();
    const isEmailVerifiedVO = IsEmailVerified.UNVERIFIED();
    const authProviderVO = new AuthProvider('anonymous' as any);
    const authMethodVO = new AuthMethod('anonymous' as any);
    const sessionIdVO = SessionId.generate();
    const rolesVO = new RoleSet();
    const permissionsVO = new PermissionSet();
    const deviceInfoVO = DeviceInfo.fromBrowser();
    const geoLocationVO = new GeoLocation('Unknown', 'Unknown', 0, 0);
    const loginContextVO = new LoginContext('127.0.0.1', deviceInfoVO, geoLocationVO, 'Web' as any);

    const user = new User(
      userId,
      emailVO,
      displayNameVO,
      photoUrlVO,
      statusVO,
      isAnonymousVO,
      isEmailVerifiedVO,
      authProviderVO,
      authMethodVO,
      sessionIdVO,
      rolesVO,
      permissionsVO,
      deviceInfoVO,
      geoLocationVO,
      loginContextVO
    );

    user.addDomainEvent(new UserCreatedEvent(userId.getValue(), emailVO.getValue(), displayNameVO.getValue()));
    return user;
  }

  /**
   * Update user profile information
   */
  updateProfile(displayName: string, photoUrl?: string): void {
    const oldDisplayName = this._displayName.getValue();
    this._displayName = new DisplayName(displayName);
    
    if (photoUrl !== undefined) {
      this._photoUrl = new PhotoUrl(photoUrl);
    }
    
    this._updatedAt = new Date();
    
    this.addDomainEvent(new UserUpdatedEvent(this._id.getValue(), displayName, photoUrl));
  }

  /**
   * Update user status
   */
  updateStatus(status: UserStatus): void {
    const oldStatus = this._status;
    this._status = status;
    this._updatedAt = new Date();
    
    this.addDomainEvent(new UserStatusChangedEvent(this._id.getValue(), oldStatus.getValue(), status.getValue()));
  }

  /**
   * Activate user account
   */
  activate(): void {
    if (!this._status.isActive()) {
      this.updateStatus(UserStatus.ACTIVE());
      this.addDomainEvent(new UserActivatedEvent(this._id.getValue()));
    }
  }

  /**
   * Deactivate user account
   */
  deactivate(): void {
    if (this._status.isActive()) {
      this.updateStatus(UserStatus.INACTIVE());
      this.addDomainEvent(new UserDeactivatedEvent(this._id.getValue()));
    }
  }

  /**
   * Suspend user account
   */
  suspend(): void {
    if (!this._status.isSuspended()) {
      this.updateStatus(UserStatus.SUSPENDED());
      this.addDomainEvent(new UserDeactivatedEvent(this._id.getValue(), 'Account suspended'));
    }
  }

  /**
   * Update authentication information
   */
  updateAuthInfo(
    authProvider: AuthProvider,
    authMethod: AuthMethod,
    isEmailVerified: IsEmailVerified
  ): void {
    this._authProvider = authProvider;
    this._authMethod = authMethod;
    this._isEmailVerified = isEmailVerified;
    this._updatedAt = new Date();
  }

  /**
   * Update device and location information
   */
  updateDeviceInfo(deviceInfo: DeviceInfo, geoLocation: GeoLocation): void {
    this._deviceInfo = deviceInfo;
    this._geoLocation = geoLocation;
    this._updatedAt = new Date();
  }

  /**
   * Add role to user
   */
  addRole(role: any): void {
    this._roles.addRole(role);
    this._updatedAt = new Date();
  }

  /**
   * Remove role from user
   */
  removeRole(role: any): void {
    this._roles.removeRole(role);
    this._updatedAt = new Date();
  }

  /**
   * Add permission to user
   */
  addPermission(permission: any): void {
    this._permissions.addPermission(permission);
    this._updatedAt = new Date();
  }

  /**
   * Remove permission from user
   */
  removePermission(permission: any): void {
    this._permissions.removePermission(permission);
    this._updatedAt = new Date();
  }

  /**
   * Check if user is active
   */
  isActive(): boolean {
    return this._status.isActive();
  }

  /**
   * Check if user can perform actions
   */
  canPerformActions(): boolean {
    return this._status.isActive();
  }

  /**
   * Check if user has role
   */
  hasRole(roleName: string): boolean {
    return this._roles.hasRoleByName(roleName);
  }

  /**
   * Check if user has permission
   */
  hasPermission(permissionName: string): boolean {
    return this._permissions.hasPermissionByName(permissionName);
  }

  /**
   * Validate user data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 驗證 Email
    if (this._email.isAnonymousEmail() && !this._isAnonymous.isAnonymous()) {
      errors.push('Anonymous email should be used with anonymous user');
    }

    // 驗證 DisplayName
    if (this._displayName.getValue().length === 0) {
      errors.push('Display name is required');
    }

    // 驗證狀態一致性
    if (this._isAnonymous.isAnonymous() && this._isEmailVerified.isVerified()) {
      errors.push('Anonymous user cannot have verified email');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get user summary with value objects
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
      id: this._id.getValue(),
      email: this._email.getValue(),
      displayName: this._displayName.getValue(),
      status: this._status.getValue(),
      isActive: this._status.isActive(),
      isAnonymous: this._isAnonymous.isAnonymous(),
      isEmailVerified: this._isEmailVerified.isVerified(),
      authProvider: this._authProvider.getValue(),
      roles: this._roles.getRoleNames(),
      permissions: this._permissions.getPermissionNames()
    };
  }

  /**
   * Get user for @delon/auth integration
   */
  toDelonAuthUser(): any {
    return {
      id: this._id.getValue(),
      name: this._displayName.getValue(),
      email: this._email.getValue(),
      avatar: this._photoUrl.getValue(),
      isAnonymous: this._isAnonymous.isAnonymous(),
      emailVerified: this._isEmailVerified.isVerified(),
      roles: this._roles.getRoleNames(),
      permissions: this._permissions.getPermissionNames()
    };
  }
} 