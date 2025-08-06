export abstract class BaseEntity<TId> {
  protected constructor(
    public readonly id: TId,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  equals(other: BaseEntity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this.id === other.id;
  }
} 