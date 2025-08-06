import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '../../infrastructure/auth/firebase-auth.service';
import { LoginRequest } from './auth.models';
import { ITokenModel } from '@delon/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private readonly authService = inject(FirebaseAuthService);

  execute(request: LoginRequest): Observable<ITokenModel> {
    return this.authService.login(request);
  }
} 