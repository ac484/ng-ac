/**
 * Firebase Authentication Repository Implementation
 * Migrates FirebaseAuthService to Infrastructure layer following DDD patterns
 */
import { Injectable, inject } from '@angular/core';
import {
  Auth,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, SocialService, ITokenModel } from '@delon/auth';
import { SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

import { Authentication, AuthResult, EmailAuthData, AuthSession } from '../../domain/entities/auth.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { StartupService } from '../services/startup.service';

@Injectable()
export class FirebaseAuthRepository implements AuthRepository {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly socialService = inject(SocialService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly settingsService = inject(SettingsService);
  private readonly startupService = inject(StartupService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });

  private currentAuthSubject = new BehaviorSubject<Authentication | null>(null);

  constructor() {
    // Initialize auth state listener
    this.initAuthStateListener();
  }

  /**
   * Initialize authentication state listener
   */
  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, firebaseUser => {
      if (firebaseUser) {
        const authentication = Authentication.fromFirebaseUser(firebaseUser);
        this.currentAuthSubject.next(authentication);
        console.log('Firebase user authenticated:', firebaseUser.uid);
      } else {
        this.currentAuthSubject.next(null);
        console.log('Firebase user signed out');
      }
    });
  }

  /**
   * Sign in with Google
   */
  signInWithGoogle(): Observable<AuthResult> {
    const provider = new GoogleAuthProvider();

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap(async (result: UserCredential) => {
        const authentication = Authentication.fromFirebaseUser(result.user);
        await this.handleAuthSuccess(authentication);
        return {
          success: true,
          user: authentication.getUser() || undefined,
          session: authentication.getSession() || undefined,
          message: 'Google sign in successful'
        };
      }),
      catchError(error => {
        console.error('Google sign in failed:', error);
        let message = 'Google sign in failed';

        if (error.code === 'auth/popup-closed-by-user') {
          message = 'Sign in popup was closed';
        } else if (error.code === 'auth/popup-blocked') {
          message = 'Popup blocked, please allow popups';
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * Sign in anonymously
   */
  signInAnonymously(): Observable<AuthResult> {
    return from(signInAnonymously(this.auth)).pipe(
      switchMap(async (result: UserCredential) => {
        const authentication = Authentication.fromFirebaseUser(result.user);
        await this.handleAuthSuccess(authentication);
        return {
          success: true,
          user: authentication.getUser() || undefined,
          session: authentication.getSession() || undefined,
          message: 'Anonymous sign in successful'
        };
      }),
      catchError(error => {
        console.error('Anonymous sign in failed:', error);
        return throwError(() => ({
          success: false,
          error,
          message: 'Anonymous sign in failed, please try again'
        }));
      })
    );
  }

  /**
   * Sign in with email and password
   */
  signInWithEmail(authData: EmailAuthData): Observable<AuthResult> {
    return from(signInWithEmailAndPassword(this.auth, authData.email, authData.password)).pipe(
      switchMap(async (result: UserCredential) => {
        const authentication = Authentication.fromFirebaseUser(result.user);
        await this.handleAuthSuccess(authentication);
        return {
          success: true,
          user: authentication.getUser() || undefined,
          session: authentication.getSession() || undefined,
          message: 'Email sign in successful'
        };
      }),
      catchError(error => {
        console.error('Email sign in failed:', error);
        let message = 'Sign in failed, please try again';

        switch (error.code) {
          case 'auth/user-not-found':
            message = 'User not found';
            break;
          case 'auth/wrong-password':
            message = 'Incorrect password';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email format';
            break;
          case 'auth/user-disabled':
            message = 'User account is disabled';
            break;
          case 'auth/too-many-requests':
            message = 'Too many sign in attempts, please try again later';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * Create user with email and password
   */
  createUserWithEmail(authData: EmailAuthData): Observable<AuthResult> {
    return from(createUserWithEmailAndPassword(this.auth, authData.email, authData.password)).pipe(
      switchMap(async (result: UserCredential) => {
        // Update profile if display name provided
        if (authData.displayName && result.user) {
          await updateProfile(result.user, { displayName: authData.displayName });
        }

        const authentication = Authentication.fromFirebaseUser(result.user);
        await this.handleAuthSuccess(authentication);
        return {
          success: true,
          user: authentication.getUser() || undefined,
          session: authentication.getSession() || undefined,
          message: 'Registration successful'
        };
      }),
      catchError(error => {
        console.error('Email registration failed:', error);
        let message = 'Registration failed, please try again';

        switch (error.code) {
          case 'auth/email-already-in-use':
            message = 'Email already in use';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email format';
            break;
          case 'auth/weak-password':
            message = 'Password too weak, use at least 6 characters';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(email: string): Observable<AuthResult> {
    return from(sendPasswordResetEmail(this.auth, email)).pipe(
      map(() => ({
        success: true,
        message: 'Password reset email sent, please check your inbox'
      })),
      catchError(error => {
        console.error('Send password reset email failed:', error);
        let message = 'Failed to send reset email, please try again';

        switch (error.code) {
          case 'auth/user-not-found':
            message = 'Email not registered';
            break;
          case 'auth/invalid-email':
            message = 'Invalid email format';
            break;
        }

        return throwError(() => ({ success: false, error, message }));
      })
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => {
        // Clear @delon/auth token
        this.tokenService.clear();
        // Clear user settings
        this.settingsService.setUser({});
        // Clear reuse tab info
        this.reuseTabService?.clear();
        console.log('Firebase sign out successful');
      }),
      catchError(error => {
        console.error('Firebase sign out failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Get current authentication
   */
  getCurrentAuthentication(): Observable<Authentication | null> {
    return this.currentAuthSubject.asObservable();
  }

  /**
   * Get current user token
   */
  async getCurrentUserToken(): Promise<string | null> {
    const user = this.auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.auth.currentUser;
  }

  /**
   * Handle authentication success
   */
  async handleAuthSuccess(authentication: Authentication): Promise<void> {
    try {
      const user = authentication.getUser();
      if (!user) {
        throw new Error('No authenticated user available');
      }

      // Get Firebase ID Token
      const firebaseUser = this.auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No Firebase user available');
      }

      const idToken = await firebaseUser.getIdToken();

      // Create session
      const session: AuthSession = {
        token: idToken || '',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
        refreshToken: undefined
      };
      authentication.setSession(session);

      // Build @delon/auth compatible token model
      const tokenModel: ITokenModel = authentication.toTokenModel();

      // Clear reuse tab info
      this.reuseTabService?.clear();

      // Set user info to @delon/theme settings
      this.settingsService.setUser({
        ...this.settingsService.user,
        ...tokenModel
      });

      // Set token to @delon/auth
      this.tokenService.set(tokenModel);

      // Call @delon/auth social service callback if available
      if (this.socialService) {
        this.socialService.callback(tokenModel);
      }

      // Reload StartupService content
      this.startupService.load().subscribe(() => {
        let url = this.tokenService.referrer!.url || '/';
        if (url.includes('/passport')) {
          url = '/';
        }
        this.router.navigateByUrl(url);
      });

      this.message.success('Sign in successful');
    } catch (error) {
      console.error('Handle auth success failed:', error);
      this.message.error('Sign in processing failed, please try again');
      throw error;
    }
  }

  /**
   * Refresh authentication token
   */
  refreshToken(): Observable<AuthResult> {
    return from(this.getCurrentUserToken()).pipe(
      switchMap(token => {
        if (!token) {
          return throwError(() => ({ success: false, message: 'No token available' }));
        }

        const currentAuth = this.currentAuthSubject.value;
        if (!currentAuth) {
          return throwError(() => ({ success: false, message: 'No authentication available' }));
        }

        // Create new session with refreshed token
        const session: AuthSession = {
          token: token as string,
          expiresAt: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
          refreshToken: undefined
        };
        currentAuth.setSession(session);

        return from(
          Promise.resolve({
            success: true,
            user: currentAuth.getUser() || undefined,
            session: currentAuth.getSession() || undefined,
            message: 'Token refreshed successfully'
          })
        );
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        return throwError(() => ({ success: false, error, message: 'Token refresh failed' }));
      })
    );
  }

  /**
   * Validate authentication token
   */
  validateToken(token: string): Observable<boolean> {
    return from(this.getCurrentUserToken()).pipe(
      map(currentToken => currentToken === token),
      catchError(() => from([false]))
    );
  }
}
