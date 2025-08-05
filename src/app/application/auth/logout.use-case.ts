import { inject, Injectable } from '@angular/core';
import { FirebaseAuthService } from '../../infrastructure/auth/firebase-auth.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private readonly authService = inject(FirebaseAuthService);

  execute(): void {
    this.authService.logout();
  }
} 