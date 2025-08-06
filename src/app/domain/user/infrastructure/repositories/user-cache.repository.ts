import { Injectable } from '@angular/core';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';

@Injectable({
  providedIn: 'root'
})
export class UserCacheRepository extends UserRepository {
    
    constructor() {
        super();
    }
    
  findById(id: UserId): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }
  save(entity: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: UserId): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByEmail(email: Email): Promise<User | null> {
    throw new Error('Method not implemented.');
  }
  existsByEmail(email: Email): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

}
