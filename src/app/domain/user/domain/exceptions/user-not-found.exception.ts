import { ApplicationException } from '../../../../../shared/domain/exceptions';
import { UserId } from '../value-objects/user-id.vo';

export class UserNotFoundException extends ApplicationException {
  constructor(userId: UserId) {
    super(`User with id ${userId.value} not found`, 'USER_NOT_FOUND');
  }
} 