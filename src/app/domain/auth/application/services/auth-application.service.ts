import { Injectable } from '@angular/core';
import { LoginAnonymouslyUseCase } from 'src/app/domain/auth/application/use-cases/login-anonymously.use-case';
import { LoginWithEmailUseCase } from 'src/app/domain/auth/application/use-cases/login-with-email.use-case';
import { LoginWithGoogleUseCase } from 'src/app/domain/auth/application/use-cases/login-with-google.use-case';
import { LogoutUseCase } from 'src/app/domain/auth/application/use-cases/logout.use-case';
import { LoginCommand } from 'src/app/domain/auth/application/dto/commands/login.command';
import { AuthResponse } from 'src/app/domain/auth/application/dto/responses/auth.response';

@Injectable({
  providedIn: 'root'
})
export class AuthApplicationService {
  constructor(
    private readonly loginWithEmailUseCase: LoginWithEmailUseCase,
    private readonly loginWithGoogleUseCase: LoginWithGoogleUseCase,
    private readonly loginAnonymouslyUseCase: LoginAnonymouslyUseCase,
    private readonly logoutUseCase: LogoutUseCase
  ) { }

  loginWithEmail(command: LoginCommand): Promise<AuthResponse> {
    return this.loginWithEmailUseCase.execute(command);
  }

  loginWithGoogle(): Promise<AuthResponse> {
    return this.loginWithGoogleUseCase.execute();
  }

  logout(): Promise<void> {
    return this.logoutUseCase.execute();
  }
}
