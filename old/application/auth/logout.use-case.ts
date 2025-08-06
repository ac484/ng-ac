import { inject, Injectable } from '@angular/core';
import { FirebaseAuthService } from '../../infrastructure/auth/firebase-auth.service';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private readonly authService = inject(FirebaseAuthService);
  private readonly tokenService: ITokenService = inject(DA_SERVICE_TOKEN);

  execute(): void {
    this.authService.logout();
    this.tokenService.clear();
  }
} 