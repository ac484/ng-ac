import { Repository } from '../../../../../shared/application/interfaces/repository.interface';
import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export interface UserRepository extends Repository<User, UserId> {
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
  findActiveUsers(): Promise<User[]>;
  findInactiveUsers(): Promise<User[]>;
} 