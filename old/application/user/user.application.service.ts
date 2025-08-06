import { Injectable } from '@angular/core';
import { BaseApplicationService } from '../common/base-application.service';
import { User, UserProps } from '../../domain/user/user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserRepository } from '../../infrastructure/user/user.repository';

@Injectable({
  providedIn: 'root'
})
export class UserApplicationService extends BaseApplicationService<User, CreateUserDto, UpdateUserDto> {
  constructor(protected override repository: UserRepository) {
    super(repository);
  }

  protected createEntity(dto: CreateUserDto): User {
    const props: UserProps = {
      ...dto,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return new User(props);
  }

  protected updateEntity(entity: User, dto: UpdateUserDto): void {
    if (dto.displayName) {
      entity.updateDisplayName(dto.displayName);
    }
    if (dto.photoURL) {
      entity.updatePhotoURL(dto.photoURL);
    }
  }
} 