import { UserResponse } from './user.response';

export class UserListResponse {
  constructor(
    public readonly users: UserResponse[],
    public readonly total: number
  ) {}
}
