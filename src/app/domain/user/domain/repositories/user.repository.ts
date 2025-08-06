import { Repository } from 'src/app/shared/application/interfaces/repository.interface';
import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export abstract class UserRepository implements Repository<User, UserId> {
  abstract findById(id: UserId): Promise<User | null>;
  abstract findAll(): Promise<User[]>;
  abstract save(entity: User): Promise<void>;
  abstract delete(id: UserId): Promise<void>;
  abstract findByEmail(email: Email): Promise<User | null>;
  abstract existsByEmail(email: Email): Promise<boolean>;
}
