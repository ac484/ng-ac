import { Firestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { BaseFirebaseRepository } from '../common/base-firebase.repository';
import { User, UserProps } from '../../domain/user/user.entity';

@Injectable({
  providedIn: 'root'
})
export class UserRepository extends BaseFirebaseRepository<User> {
  constructor(firestore: Firestore) {
    super(firestore, 'users');
  }

  protected fromFirestore(data: any, id: string): User {
    const props: UserProps = {
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      isEmailVerified: data.isEmailVerified,
      lastLoginAt: data.lastLoginAt?.toDate(),
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    };
    return new User(props, id);
  }

  protected toFirestore(entity: User): any {
    return {
      email: entity.email,
      displayName: entity.displayName,
      photoURL: entity.photoURL,
      isEmailVerified: entity.isEmailVerified,
      lastLoginAt: entity.lastLoginAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    };
  }
} 