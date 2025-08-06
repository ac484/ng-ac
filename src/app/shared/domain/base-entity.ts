// src/app/shared/domain/base-entity.ts
export abstract class BaseEntity<T> {
  protected readonly _id: T;
  public readonly createdAt: Date;
  protected _updatedAt: Date;

  protected constructor(id: T) {
    this._id = id;
    this.createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): T {
    return this._id;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  equals(other?: BaseEntity<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    if (!(other instanceof BaseEntity)) {
      return false;
    }
    return this._id === other._id;
  }
}
