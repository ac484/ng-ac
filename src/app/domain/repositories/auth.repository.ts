/**
 * Authentication repository interface
 * Defines the contract for authentication data access operations
 */
import { Observable } from 'rxjs';

import { Authentication, AuthResult, EmailAuthData, AuthProvider } from '../entities/auth.entity';

export interface AuthRepository {
  /**
   * Sign in with Google
   */
  signInWithGoogle(): Observable<AuthResult>;

  /**
   * Sign in anonymously
   */
  signInAnonymously(): Observable<AuthResult>;

  /**
   * Sign in with email and password
   */
  signInWithEmail(authData: EmailAuthData): Observable<AuthResult>;

  /**
   * Create user with email and password
   */
  createUserWithEmail(authData: EmailAuthData): Observable<AuthResult>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Observable<AuthResult>;

  /**
   * Sign out
   */
  signOut(): Observable<void>;

  /**
   * Get current authentication
   */
  getCurrentAuthentication(): Observable<Authentication | null>;

  /**
   * Get current user token
   */
  getCurrentUserToken(): Promise<string | null>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean;

  /**
   * Handle authentication success
   */
  handleAuthSuccess(authentication: Authentication): Promise<void>;

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthResult>;

  /**
   * Validate authentication token
   */
  validateToken(token: string): Observable<boolean>;
}
