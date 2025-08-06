import { Injectable } from '@angular/core';
import { UserRepository } from 'src/app/domain/user/domain/repositories/user.repository';
import { User } from 'src/app/domain/user/domain/entities/user.entity';
import { Email } from 'src/app/domain/user/domain/value-objects/email.vo';

@Injectable({
  providedIn: 'root'
})
export class UserDomainService {
  constructor(private readonly userRepository: UserRepository) { }

  async isEmailUnique(email: Email): Promise<boolean> {
    const user = await this.userRepository.findByEmail(email);
    return user === null;
  }
}
