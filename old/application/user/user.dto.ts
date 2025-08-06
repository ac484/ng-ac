export interface CreateUserDto {
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface UpdateUserDto {
  displayName?: string;
  photoURL?: string;
} 