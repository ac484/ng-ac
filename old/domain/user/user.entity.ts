import { BaseEntity } from "../common/base.entity";

export interface UserProps {
  email: string;
  displayName: string;
  photoURL?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends BaseEntity<string> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get email(): string {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get photoURL(): string | undefined {
    return this.props.photoURL;
  }

  get isEmailVerified(): boolean {
    return this.props.isEmailVerified;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public updateDisplayName(displayName: string): void {
    this.props.displayName = displayName;
    this.props.updatedAt = new Date();
  }

  public updatePhotoURL(photoURL: string): void {
    this.props.photoURL = photoURL;
    this.props.updatedAt = new Date();
  }

  public updateLastLoginAt(): void {
    this.props.lastLoginAt = new Date();
  }
} 