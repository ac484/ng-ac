import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Inject, Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { AuthResponse } from '../dto/responses/auth.response';
import { AuthFirebaseRepository } from '../../infrastructure/repositories/auth-firebase.repository';
import { EventBus } from 'src/app/shared/application/event-bus';
import { UnitOfWork } from 'src/app/shared/application/unit-of-work';

@Injectable({
  providedIn: 'root'
})
export class LoginAnonymouslyUseCase implements UseCase<void, AuthResponse> {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly authRepository: AuthFirebaseRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(): Promise<AuthResponse> {
    return this.unitOfWork.execute(async () => {
      const authData = await this.authRepository.loginAnonymously();
      const user = authData.user;
      const idToken = await user.getIdToken();

      // 設置 @delon/auth 的 token
      this.tokenService.set({
        token: idToken,
        name: 'Anonymous User',
        avatar: '',
        email: '',
        uid: user.uid,
        expired: +new Date() + 1000 * 60 * 60 * 24 * 7 // 7天後過期
      });

      // this.eventBus.publish(new UserLoggedInEvent(UserId.create(user.uid)));
      return new AuthResponse(user.uid, idToken);
    });
  }
}
