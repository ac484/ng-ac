import { BaseAggregateRoot } from '@shared';

import { UserCreatedEvent } from '../events/user-created.event';
import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserProfile } from '../value-objects/user-profile.vo';

/**
 * 用戶實體
 * 封裝用戶的核心業務邏輯和規則
 */
export class User extends BaseAggregateRoot<UserId> {
  private constructor(
    id: UserId,
    private _email: Email,
    private _profile: UserProfile,
    private _firebaseUid?: string,
    private _isAdmin = false
  ) {
    super(id);
  }

  /**
   * 創建新用戶
   */
  static create(email: Email, profile: UserProfile, firebaseUid?: string, isAdmin = false): User {
    const user = new User(UserId.generate(), email, profile, firebaseUid, isAdmin);

    user.addDomainEvent(new UserCreatedEvent(user.id, email, profile));
    return user;
  }

  /**
   * 創建管理員用戶
   */
  static createAdmin(email: Email, profile: UserProfile): User {
    return User.create(email, profile, undefined, true);
  }

  /**
   * 從 Firebase 用戶創建
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromFirebaseUser(firebaseUser: any): User {
    const email = Email.create(firebaseUser.email);
    const profile = UserProfile.create(firebaseUser.displayName || 'User', firebaseUser.displayName || 'User');

    return User.create(email, profile, firebaseUser.uid);
  }

  /**
   * 從匿名 Firebase 用戶創建
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromAnonymousUser(firebaseUser: any): User {
    // 匿名用戶沒有 email，使用 uid 生成一個虛擬 email
    const anonymousEmail = `anonymous-${firebaseUser.uid}@anonymous.com`;
    const email = Email.create(anonymousEmail);
    const profile = UserProfile.create('Anonymous', 'User');

    return User.create(email, profile, firebaseUser.uid);
  }

  // Getters
  get email(): Email {
    return this._email;
  }

  get profile(): UserProfile {
    return this._profile;
  }

  get firebaseUid(): string | undefined {
    return this._firebaseUid;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  /**
   * 更新用戶資料
   */
  updateProfile(newProfile: UserProfile): void {
    this._profile = newProfile;
  }

  /**
   * 更新郵箱
   */
  changeEmail(newEmail: Email): void {
    if (!this._email.equals(newEmail)) {
      this._email = newEmail;
    }
  }

  /**
   * 設置為管理員
   */
  promoteToAdmin(): void {
    this._isAdmin = true;
  }

  /**
   * 轉換為 @delon/auth 格式
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toDelonAuthUser(): any {
    return {
      token: this.generateToken(),
      name: this._profile.displayName,
      email: this._email.value,
      id: this.id.value,
      uid: this._firebaseUid,
      isAdmin: this._isAdmin,
      time: +new Date(),
      expired: +new Date() + 1000 * 60 * 60 * 24 // 24小時過期
    };
  }

  /**
   * 生成認證 token
   */
  private generateToken(): string {
    const prefix = this._isAdmin ? 'admin' : 'user';
    const timestamp = Date.now();
    return `${prefix}-${this.id.value}-${timestamp}`;
  }
}
