import { ApplicationException } from '../../../../shared/domain/exceptions';

export class InvalidCredentialsException extends ApplicationException {
  constructor() {
    super('Invalid credentials provided', 'INVALID_CREDENTIALS');
  }
}
