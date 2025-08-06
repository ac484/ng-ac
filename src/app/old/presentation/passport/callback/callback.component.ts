import { Component, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { User } from '@angular/fire/auth';
import { FirebaseAuthService } from '../../../infrastructure/auth/firebase-auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <div style="text-align: center; padding: 50px;">
      @if (type === 'firebase') {
      <div>
        <div>🔄</div>
        <p style="margin-top: 16px;">Processing Firebase login...</p>
      </div>
      } @else {
      <div>
        <div>🔄</div>
        <p style="margin-top: 16px;">Processing login...</p>
      </div>
      }
    </div>
  `,
  standalone: true
})
export class CallbackComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly firebaseAuthService = inject(FirebaseAuthService);
  private readonly tokenService: ITokenService = inject(DA_SERVICE_TOKEN);

  @Input() type = '';

  ngOnInit(): void {
    if (this.type === 'firebase') {
      this.handleFirebaseCallback();
    } else {
      this.router.navigateByUrl('/passport/login');
    }
  }

  private async handleFirebaseCallback(): Promise<void> {
    try {
      const userCredential = await this.firebaseAuthService.getRedirectResult();
      if (userCredential?.user) {
        await this.handleAuthSuccess(userCredential.user);
      } else {
        this.router.navigateByUrl('/passport/login');
      }
    } catch (error) {
      console.error('Callback error:', error);
      this.router.navigateByUrl('/passport/login');
    }
  }

  private async handleAuthSuccess(user: User): Promise<void> {
    const idToken = await user.getIdToken();
    const tokenModel = {
      token: idToken,
      name: user.displayName || user.email?.split('@')[0] || 'User',
      email: user.email,
      id: user.uid,
      avatar: user.photoURL,
      time: +new Date()
    };
    this.tokenService.set(tokenModel);
    let url = this.tokenService.referrer?.url || '/';
    if (url.includes('/passport')) {
      url = '/';
    }
    this.router.navigateByUrl(url);
  }
} 