import { Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EventBus } from 'src/app/shared/application/event-bus';
import { UnitOfWork } from 'src/app/shared/application/unit-of-work';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class VerifyUserEmailUseCase implements UseCase<string, void> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(userIdValue: string): Promise<void> {
    return await this.unitOfWork.execute(async () => {
      const userId = UserId.create(userIdValue);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UserNotFoundException(userId);
      }

      user.verifyEmail();

      await this.userRepository.save(user);
      await this.eventBus.publishAll(user.domainEvents);
    });
  }
}
