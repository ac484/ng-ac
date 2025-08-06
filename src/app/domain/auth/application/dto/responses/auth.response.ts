export class AuthResponse {
  constructor(
    public readonly userId: string,
    public readonly token: string
  ) {}
}
