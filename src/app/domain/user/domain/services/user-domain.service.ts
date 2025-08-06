import { Injectable } from '@angular/core';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';
import { UserProfile } from '../value-objects/user-profile.vo';
import { UserEmailUniqueSpecification } from '../specifications/user-email-unique.spec';

@Injectable()
export class UserDomainService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailUniqueSpec: UserEmailUniqueSpecification
  ) {}

  async createUser(email: Email, profile: UserProfile): Promise<User> {
    // Check if email is unique
    const isEmailUnique = await this.emailUniqueSpec.isSatisfiedBy(email);
    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }

    const user = User.create(email, profile);
    await this.userRepository.save(user);
    
    return user;
  }

  async updateUserProfile(userId: string, profile: UserProfile): Promise<User> {
    const user = await this.userRepository.findById(userId as any);
    if (!user) {
      throw new Error('User not found');
    }

    user.updateProfile(profile);
    await this.userRepository.save(user);
    
    return user;
  }

  async changeUserEmail(userId: string, newEmail: Email): Promise<User> {
    const user = await this.userRepository.findById(userId as any);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if new email is unique
    const isEmailUnique = await this.emailUniqueSpec.isSatisfiedBy(newEmail);
    if (!isEmailUnique) {
      throw new Error('Email already exists');
    }

    user.changeEmail(newEmail);
    await this.userRepository.save(user);
    
    return user;
  }

  async verifyUserEmail(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId as any);
    if (!user) {
      throw new Error('User not found');
    }

    user.verifyEmail();
    await this.userRepository.save(user);
    
    return user;
  }

  async deactivateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId as any);
    if (!user) {
      throw new Error('User not found');
    }

    user.deactivate();
    await this.userRepository.save(user);
    
    return user;
  }

  async activateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId as any);
    if (!user) {
      throw new Error('User not found');
    }

    user.activate();
    await this.userRepository.save(user);
    
    return user;
  }
} 