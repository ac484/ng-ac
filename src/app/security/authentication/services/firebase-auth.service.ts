/**
 * @ai-context {
 *   "role": "Security/Auth",
 *   "purpose": "統一Firebase認證服務",
 *   "constraints": ["單例模式", "Firebase整合", "極簡主義"],
 *   "dependencies": ["@angular/fire/auth", "FirebaseService"],
 *   "security": "high",
 *   "lastmod": "2025-01-18"
 * }
 * @usage firebaseAuth.login(email, password), firebaseAuth.isLoggedIn()
 * @see docs/01-angular20-architecture.md
 */

import { Injectable } from '@angular/core';
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../../infrastructure/persistence/firebase/firebase.service';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private auth: any;

  constructor(private firebaseService: FirebaseService) {
    this.auth = this.firebaseService.getAuth();
  }

  async login(email: string, password: string): Promise<User | null> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('登錄失敗:', error);
      return null;
    }
  }

  async register(email: string, password: string): Promise<User | null> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error) {
      console.error('註冊失敗:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  getCurrentUserEmail(): string | null {
    return this.auth.currentUser?.email || null;
  }

  isEmailVerified(): boolean {
    return this.auth.currentUser?.emailVerified || false;
  }

  onAuthStateChanged(): Observable<User | null> {
    return new Observable(observer => {
      const unsubscribe = onAuthStateChanged(this.auth, (user) => {
        observer.next(user);
      });
      return () => unsubscribe();
    });
  }
}
