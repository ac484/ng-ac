import { Injectable } from '@angular/core';
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
    private readonly authRepository: AuthFirebaseRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(command: LoginCommand): Promise<AuthResponse> {
    return this.unitOfWork.execute(async () => {
      const authData = await this.authRepository.loginWithEmail(command.email, command.password);
      // Here you would typically handle the session, events, etc.
      // const user = authData.user;
      // this.eventBus.publish(new UserLoggedInEvent(UserId.create(user.uid)));
      return new AuthResponse(authData.user.uid, 'dummy-token');
    });
  }
}
