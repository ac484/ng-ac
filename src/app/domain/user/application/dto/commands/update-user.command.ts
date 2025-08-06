export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly displayName: string,
    public readonly photoURL?: string,
  ) {}
}
