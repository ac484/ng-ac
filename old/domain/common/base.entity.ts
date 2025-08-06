export abstract class BaseEntity<T> {
  protected readonly _id: T;
  public readonly props: any;

  public constructor(props: any, id?: T) {
    this._id = id ?? (crypto.randomUUID() as T);
    this.props = props;
  }

  get id(): T {
    return this._id;
  }

  public equals(object?: BaseEntity<T>): boolean {
    if (object == null || object == undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof BaseEntity)) {
      return false;
    }

    return this._id === object._id;
  }
} 