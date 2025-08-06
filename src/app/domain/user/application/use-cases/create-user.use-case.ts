import { Injectable } from '@angular/core';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';
import { CreateUserCommand } from '../dto/commands/create-user.command';
import { UserResponse } from '../dto/responses/user.response';
import { UserRepository } from '../../domain/repositories/user.repository';
import { EventBus } from '../../../../shared/application/event-bus';
import { UnitOfWork } from '../../../../shared/application/unit-of-work';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserProfile } from '../../domain/value-objects/user-profile.vo';

@Injectable({
  providedIn: 'root'
})
export class CreateUserUseCase implements UseCase<CreateUserCommand, UserResponse> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly unitOfWork: UnitOfWork
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponse> {
    return await this.unitOfWork.execute(async () => {
      const email = Email.create(command.email);
      const profile = UserProfile.create(command.firstName, command.lastName, command.displayName, command.photoURL);

      const emailExists = await this.userRepository.existsByEmail(email);
      if (emailExists) {
        // In a real app, you would throw a specific exception
        throw new Error('Email already exists');
      }

      const user = User.create(email, profile);
      await this.userRepository.save(user);
      await this.eventBus.publishAll(user.domainEvents);

      return UserResponse.fromDomain(user);
    });
  }
}
