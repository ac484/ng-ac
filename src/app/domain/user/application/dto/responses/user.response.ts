import { User } from '../../../domain/entities/user.entity';

export class UserResponse {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly displayName: string,
    public readonly photoURL: string | undefined,
    public readonly isEmailVerified: boolean,
    public readonly createdAt: Date
  ) {}

  static fromDomain(user: User): UserResponse {
    return new UserResponse(
      user.id.value,
      user.email.value,
      user.profile.displayName,
      user.profile.photoURL,
      user.isEmailVerified,
      user.createdAt
    );
  }
}
