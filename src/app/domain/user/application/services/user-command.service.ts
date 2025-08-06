import { Injectable } from '@angular/core';

import { CreateUserCommand } from '../dto/commands/create-user.command';
import { UpdateUserCommand } from '../dto/commands/update-user.command';
import { UserResponse } from '../dto/responses/user.response';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { VerifyUserEmailUseCase } from '../use-cases/verify-user-email.use-case';

@Injectable({
  providedIn: 'root'
})
export class UserCommandService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly verifyUserEmailUseCase: VerifyUserEmailUseCase
  ) { }

  async createUser(command: CreateUserCommand): Promise<UserResponse> {
    return this.createUserUseCase.execute(command);
  }

  async updateUser(command: UpdateUserCommand): Promise<UserResponse> {
    return this.updateUserUseCase.execute(command);
  }

  async verifyUserEmail(userId: string): Promise<void> {
    return this.verifyUserEmailUseCase.execute(userId);
  }
}
