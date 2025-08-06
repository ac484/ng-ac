import { Injectable } from '@angular/core';
import { UseCase } from 'src/app/shared/application/interfaces/use-case.interface';
import { UpdateUserCommand } from '../dto/commands/update-user.command';
import { UserResponse } from '../dto/responses/user.response';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EventBus } from 'src/app/shared/application/event-bus';
import { UnitOfWork } from 'src/app/shared/application/unit-of-work';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserProfile } from '../../domain/value-objects/user-profile.vo';
import { UserNotFoundException } from '../../domain/exceptions/user-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class UpdateUserUseCase implements UseCase<UpdateUserCommand, UserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) { }

  async execute(command: UpdateUserCommand): Promise<UserResponse> {
    return await this.unitOfWork.execute(async () => {
      const userId = UserId.create(command.id);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new UserNotFoundException(userId);
      }

      const profile = UserProfile.create(command.firstName, command.lastName, command.displayName, command.photoURL);
      // In a real app, you would have methods on the user entity to update properties
      // user.updateProfile(profile);

      await this.userRepository.save(user);
      await this.eventBus.publishAll(user.domainEvents);

      return UserResponse.fromDomain(user);
    });
  }
}
