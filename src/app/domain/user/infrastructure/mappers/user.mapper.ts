import { Injectable } from '@angular/core';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { UserProfile } from '../../domain/value-objects/user-profile.vo';

@Injectable({
  providedIn: 'root'
})
export class UserMapper {
  toFirestore(user: User): any {
    return {
      id: user.id.value,
      email: user.email.value,
      profile: {
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        displayName: user.profile.displayName,
        photoURL: user.profile.photoURL
      },
      isEmailVerified: user.isEmailVerified,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  toDomain(data: any): User {
    const userId = UserId.create(data.id);
    const email = Email.create(data.email);
    const profile = UserProfile.create(
      data.profile.firstName,
      data.profile.lastName,
      data.profile.displayName,
      data.profile.photoURL
    );
    const lastLoginAt = data.lastLoginAt ? data.lastLoginAt.toDate() : undefined;
    const createdAt = data.createdAt ? data.createdAt.toDate() : undefined;
    
    return User.reconstitute(userId, email, profile, data.isEmailVerified, lastLoginAt, createdAt);
  }
}
