import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { TokenService } from '@delon/auth';

import { AuthProvider } from '../../domain/value-objects/authentication/auth-provider.value-object';
import { Email } from '../../domain/value-objects/authentication/email.value-object';
import { IsAnonymous } from '../../domain/value-objects/status/is-anonymous.value-object';
import { IsEmailVerified } from '../../domain/value-objects/status/is-email-verified.value-object';

/**
 * Firebase Auth 適配器
 * 整合 Firebase Auth 與 @delon/auth
 */
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthAdapter {
  constructor(
    private auth: Auth,
    private tokenService: TokenService
  ) {
    this.initializeAuthStateListener();
  }

  private initializeAuthStateListener(): void {
    onAuthStateChanged(this.auth, async firebaseUser => {
      if (firebaseUser) {
        await this.handleFirebaseUserSignIn(firebaseUser);
      } else {
        await this.handleFirebaseUserSignOut();
      }
    });
  }

  private async handleFirebaseUserSignIn(firebaseUser: any): Promise<void> {
    // 轉換 Firebase 用戶到值物件
    const email = Email.fromFirebaseUser(firebaseUser);
    const isAnonymous = IsAnonymous.fromFirebaseUser(firebaseUser);
    const authProvider = AuthProvider.fromFirebaseUser(firebaseUser);
    const isEmailVerified = IsEmailVerified.fromFirebaseUser(firebaseUser);

    // 創建 @delon/auth Token Model
    const tokenModel: any = {
      token: await firebaseUser.getIdToken(),
      name: firebaseUser.displayName || 'Anonymous User',
      email: email.getValue(),
      id: firebaseUser.uid,
      avatar: firebaseUser.photoURL || '',
      time: +new Date(),
      expired: Date.now() + 60 * 60 * 1000, // 1 hour
      firebase: {
        uid: firebaseUser.uid,
        emailVerified: isEmailVerified.getValue(),
        isAnonymous: isAnonymous.getValue(),
        providerId: authProvider.getValue(),
        providerData: firebaseUser.providerData || []
      }
    };

    await this.tokenService.set(tokenModel);

    // 觸發 @delon/auth 事件 - 使用 TokenService 的 change 方法
    this.tokenService.change().subscribe(() => {
      // Token 變更已處理
    });
  }

  private async handleFirebaseUserSignOut(): Promise<void> {
    await this.tokenService.clear();
    // Token 清除已處理
  }

  private convertToDelonUser(firebaseUser: any): any {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || 'Anonymous User',
      email: firebaseUser.email,
      avatar: firebaseUser.photoURL,
      isAnonymous: firebaseUser.isAnonymous,
      emailVerified: firebaseUser.emailVerified
    };
  }
}
