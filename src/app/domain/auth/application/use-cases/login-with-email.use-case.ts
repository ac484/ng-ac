import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Inject, Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { LoginCommand } from '../dto/commands/login.command';
import { AuthResponse } from '../dto/responses/auth.response';
import { AuthFirebaseRepository } from '../../infrastructure/repositories/auth-firebase.repository';
import { EventBus } from 'src/app/shared/application/event-bus';
import { UnitOfWork } from 'src/app/shared/application/unit-of-work';

@Injectable({
  providedIn: 'root'
})
export class LoginWithEmailUseCase implements UseCase<LoginCommand, AuthResponse> {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly authRepository: AuthFirebaseRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(command: LoginCommand): Promise<AuthResponse> {
    return this.unitOfWork.execute(async () => {
      const authData = await this.authRepository.loginWithEmail(command.email, command.password);
      const user = authData.user;
      const idToken = await user.getIdToken();

      this.tokenService.set({
        token: idToken,
        uid: user.uid,
        username: user.displayName || '',
        email: user.email || ''
      });

      // this.eventBus.publish(new UserLoggedInEvent(UserId.create(user.uid)));
      return new AuthResponse(user.uid, idToken);
    });
  }
}
