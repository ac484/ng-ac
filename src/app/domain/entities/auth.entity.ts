/**
 * Authentication domain entity
 * Represents user authentication state and session management
 */
import { AggregateRoot } from './aggregate-root';
import { Email } from '../value-objects/authentication/email.value-object';
import { UserAuthenticatedEvent, UserSignedOutEvent, AuthenticationFailedEvent, TokenRefreshedEvent } from '../events/auth-events';

export interface AuthUser {
  id: string;
  email: Email;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  providerId: string;
  createdAt: Date;
  lastSignInAt: Date;
}

export interface AuthSession {
  token: string;
  expiresAt: Date;
  refreshToken?: string;
}

export interface AuthToken {
  token: string;
  name: string;
  email: string;
  id: string;
  avatar: string;
  time: number;
  expired: number;
  firebase?: {
    uid: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerId: string;
    providerData: any[];
  };
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  session?: AuthSession;
  error?: any;
  message?: string;
}

export interface EmailAuthData {
  email: string;
  password: string;
  displayName?: string;
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  ANONYMOUS = 'anonymous'
}

export class Authentication extends AggregateRoot<string> {
  private user: AuthUser | null = null;
  private session: AuthSession | null = null;
  private isAuthenticated: boolean = false;

  constructor(id: string) {
    super(id);
  }

  // Getter for id
  get id(): string { return this.props; }

  /**
   * Create authentication from Firebase user
   * 改進：通過實體內部邏輯創建值物件
   */
  static fromFirebaseUser(firebaseUser: any): Authentication {
    const auth = new Authentication(firebaseUser.uid);
    
    // 通過實體內部邏輯創建用戶信息
    const user = auth.createUserFromFirebase(firebaseUser);
    auth.setUser(user);
    auth.setAuthenticated(true);
    
    auth.addDomainEvent(new UserAuthenticatedEvent(
      firebaseUser.uid,
      firebaseUser.providerId || 'firebase',
      firebaseUser.email
    ));
    
    return auth;
  }

  /**
   * Create authentication from @delon/auth token model
   * 改進：通過實體內部邏輯創建值物件
   */
  static fromTokenModel(tokenModel: any): Authentication {
    const auth = new Authentication(tokenModel.id || tokenModel.firebase?.uid);
    
    // 通過實體內部邏輯創建用戶信息
    const user = auth.createUserFromTokenModel(tokenModel);
    const session = auth.createSessionFromTokenModel(tokenModel);

    auth.setUser(user);
    auth.setSession(session);
    auth.setAuthenticated(true);
    
    return auth;
  }

  /**
   * 實體內部方法：從Firebase用戶創建用戶信息
   */
  private createUserFromFirebase(firebaseUser: any): AuthUser {
    return {
      id: firebaseUser.uid,
      email: new Email(firebaseUser.email),
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      emailVerified: firebaseUser.emailVerified,
      isAnonymous: firebaseUser.isAnonymous,
      providerId: firebaseUser.providerId,
      createdAt: new Date(firebaseUser.metadata?.creationTime || Date.now()),
      lastSignInAt: new Date(firebaseUser.metadata?.lastSignInTime || Date.now())
    };
  }

  /**
   * 實體內部方法：從Token模型創建用戶信息
   */
  private createUserFromTokenModel(tokenModel: any): AuthUser {
    return {
      id: tokenModel.id || tokenModel.firebase?.uid,
      email: new Email(tokenModel.email),
      displayName: tokenModel.name || tokenModel.displayName,
      photoURL: tokenModel.avatar || tokenModel.photoURL,
      emailVerified: tokenModel.firebase?.emailVerified || false,
      isAnonymous: tokenModel.firebase?.isAnonymous || false,
      providerId: tokenModel.firebase?.providerId || 'unknown',
      createdAt: new Date(tokenModel.time || Date.now()),
      lastSignInAt: new Date(tokenModel.time || Date.now())
    };
  }

  /**
   * 實體內部方法：從Token模型創建會話信息
   */
  private createSessionFromTokenModel(tokenModel: any): AuthSession {
    return {
      token: tokenModel.token,
      expiresAt: new Date(tokenModel.expired || Date.now() + 3600000),
      refreshToken: tokenModel.refreshToken
    };
  }

  /**
   * Set user information
   */
  setUser(user: AuthUser): void {
    this.user = user;
  }

  /**
   * Set session information
   */
  setSession(session: AuthSession): void {
    this.session = session;
  }

  /**
   * Set authentication status
   */
  setAuthenticated(authenticated: boolean): void {
    this.isAuthenticated = authenticated;
  }

  /**
   * Get user information
   */
  getUser(): AuthUser | null {
    return this.user;
  }

  /**
   * Get session information
   */
  getSession(): AuthSession | null {
    return this.session;
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.user !== null;
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    if (!this.session) return false;
    return this.session.expiresAt > new Date();
  }

  /**
   * Clear authentication data
   */
  clear(): void {
    if (this.user) {
      this.addDomainEvent(new UserSignedOutEvent(this.user.id, this.session?.token || ''));
    }
    this.user = null;
    this.session = null;
    this.isAuthenticated = false;
  }

  /**
   * Get user email
   */
  getUserEmail(): Email | null {
    return this.user?.email || null;
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): string | null {
    return this.user?.displayName || null;
  }

  /**
   * Check if user is anonymous
   */
  isUserAnonymous(): boolean {
    return this.user?.isAnonymous || false;
  }

  /**
   * Check if email is verified
   */
  isEmailVerified(): boolean {
    return this.user?.emailVerified || false;
  }

  /**
   * Convert to token model for @delon/auth
   */
  toTokenModel(): AuthToken {
    if (!this.user) {
      throw new Error('No user data available');
    }

    return {
      token: this.session?.token || '',
      name: this.user.displayName || '',
      email: this.user.email.getValue(),
      id: this.user.id,
      avatar: this.user.photoURL || '',
      time: this.user.createdAt.getTime(),
      expired: this.session?.expiresAt.getTime() || Date.now() + 3600000,
      firebase: {
        uid: this.user.id,
        emailVerified: this.user.emailVerified,
        isAnonymous: this.user.isAnonymous,
        providerId: this.user.providerId,
        providerData: []
      }
    };
  }

  /**
   * Refresh authentication token
   */
  refreshToken(newToken: string, expiresAt: Date): void {
    if (this.session) {
      this.session.token = newToken;
      this.session.expiresAt = expiresAt;
      
      this.addDomainEvent(new TokenRefreshedEvent(
        this.user?.id || '',
        newToken,
        expiresAt
      ));
    }
  }

  /**
   * Handle authentication failure
   */
  handleAuthFailure(reason: string): void {
    this.addDomainEvent(new AuthenticationFailedEvent(
      this.user?.email.getValue() || '',
      this.user?.providerId || 'unknown',
      reason
    ));
  }

  /**
   * Validate authentication data
   */
  validate(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.user) {
      errors.push('User data is required');
    } else {
      if (!this.user.email) {
        errors.push('User email is required');
      }
      
      if (!this.user.id) {
        errors.push('User ID is required');
      }
    }

    if (this.isAuthenticated && !this.session) {
      errors.push('Session data is required for authenticated user');
    }

    if (this.session && this.session.expiresAt <= new Date()) {
      errors.push('Session has expired');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get authentication summary
   */
  getSummary(): { 
    id: string; 
    isAuthenticated: boolean; 
    email: string | null; 
    displayName: string | null; 
    isAnonymous: boolean 
  } {
    return {
      id: this.id,
      isAuthenticated: this.isUserAuthenticated(),
      email: this.getUserEmail()?.getValue() || null,
      displayName: this.getUserDisplayName(),
      isAnonymous: this.isUserAnonymous()
    };
  }
} 