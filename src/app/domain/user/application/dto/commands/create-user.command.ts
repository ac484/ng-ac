export class CreateUserCommand {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly displayName: string,
    public readonly photoURL?: string,
  ) {}
}
