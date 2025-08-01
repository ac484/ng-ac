import { Injectable, inject } from '@angular/core';
import { Auth, User, authState, signInWithEmailAndPassword, signOut, getIdToken } from '@angular/fire/auth';
import { Observable, BehaviorSubject, from, of, EMPTY } from 'rxjs';
import { map, catchError, switchMap, shareReplay } from 'rxjs/operators';
import { FirebaseErrorHandlerService } from './firebase-error-handler.service';

/**
 * Firebase Auth 適配器服務
 * 
 * 提供與 ng-alain 相容的 Firebase 認證介面
 * 遵循精簡主義原則，僅包含必要功能
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthAdapterService {
  private readonly auth = inject(Auth);
  private readonly errorHandler = inject(FirebaseErrorHandlerService);

  // 認證狀態流，使用 shareReplay 避免重複訂閱
  readonly authState$ = authState(this.auth).pipe(
    shareReplay(1)
  );

  // 認證狀態布林值
  readonly isAuthenticated$ = this.authState$.pipe(
    map(user => !!user)
  );

  /**
   * 使用 email/password 登入
   */
  signIn(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      map(credential => credential.user),
      catchError(error => {
        this.errorHandler.handleError(error);
        throw error;
      })
    );
  }

  /**
   * 登出
   */
  signOut(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      catchError(error => {
        this.errorHandler.handleSilentError(error);
        throw error;
      })
    );
  }

  /**
   * 取得當前使用者
   */
  getCurrentUser(): Observable<User | null> {
    return this.authState$;
  }

  /**
   * 取得 ID Token
   * @param forceRefresh 是否強制刷新 token
   */
  getIdToken(forceRefresh = false): Observable<string | null> {
    return this.authState$.pipe(
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        return from(getIdToken(user, forceRefresh)).pipe(
          catchError(error => {
            this.errorHandler.handleSilentError(error);
            return of(null);
          })
        );
      })
    );
  }
}