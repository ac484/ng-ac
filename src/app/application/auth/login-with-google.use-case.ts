import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '../../infrastructure/auth/firebase-auth.service';
import { ITokenModel } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginWithGoogleUseCase {
  private readonly authService = inject(FirebaseAuthService);

  execute(): Observable<ITokenModel> {
    return this.authService.loginWithGoogle();
  }
} 