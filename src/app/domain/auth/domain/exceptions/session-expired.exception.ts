import { ApplicationException } from '../../../../shared/domain/exceptions';

export class SessionExpiredException extends ApplicationException {
  constructor() {
    super('Session has expired', 'SESSION_EXPIRED');
  }
}
