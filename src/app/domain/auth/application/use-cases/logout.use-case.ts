import { ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { Inject, Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { AuthFirebaseRepository } from '../../infrastructure/repositories/auth-firebase.repository';
import { EventBus } from 'src/app/shared/application/event-bus';
import { UnitOfWork } from 'src/app/shared/application/unit-of-work';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase implements UseCase<void, void> {
  constructor(
    @Inject(DA_SERVICE_TOKEN) private readonly tokenService: ITokenService,
    private readonly authRepository: AuthFirebaseRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(): Promise<void> {
    return this.unitOfWork.execute(async () => {
      // const userId = this.authRepository.getCurrentUserId();
      await this.authRepository.logout();

      // 清理 @delon/auth 的 token
      this.tokenService.clear();

      // if (userId) {
      //   this.eventBus.publish(new UserLoggedOutEvent(userId));
      // }
    });
  }
}
