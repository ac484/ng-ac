import { Injectable } from '@angular/core';
import { AbstractSpecification } from '../../../../../shared/domain/specification';
import { Email } from '../value-objects/email.vo';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserEmailUniqueSpecification extends AbstractSpecification<Email> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async isSatisfiedBy(email: Email): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }
} 