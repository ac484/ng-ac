import { Specification } from '../../../../shared/domain/specification';
import { User } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { Email } from '../value-objects/email.vo';

export class UserEmailUniqueSpec extends Specification<Email> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async isSatisfiedBy(email: Email): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return user === null;
  }
}
